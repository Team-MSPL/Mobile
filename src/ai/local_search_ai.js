import {readAllPlace} from './data_read';

//이태운 - 임시 import - 거리민감도
import {distanceSensitivity} from './local_search_ai_test';

var _ = require('lodash');

//파이어베이스 연결부분, 분리하고싶은데 에러나서 못함

var enoughPlace = true; //관광지가 부족하여 중단할 경우 false가 됨. -> 다이어로그 표시!

var dummy = {
	name: '',
	latitude: 0.0,
	longitude: 0.0,
	takenTime: 0,
	popular: 0,
	partner: [0, 0, 0, 0, 0, 0, 0],
	concept: [0, 0, 0, 0],
	play: [0, 0, 0, 0, 0, 0],
	tour: [0, 0, 0, 0, 0, 0, 0, 0, 0],
	season: [0, 0, 0, 0],
	category: 8,
};

var count = [0, 0, 0, 0, 0]; //selectList 선택 개수 저장 배열

var placeList = []; //장소 리스트, 전역 변수, 원본
var placeListCopy = []; //장소 리스트, 전역 변수, n일차 코스를 위함, path에 들어간 Place들은 제거하는 리스트
var transitInAI = 0;
var corDis = [];

// 숙소, 필수여행지 총 합계 계산(숙소는 -2) + 총날짜도 고려!! - 반복 횟수 줄이기에 사용
var selectedNum = 0;

//Step 1. Data Loading
async function dataLoading(cityList) {
	placeList = []; // reset the list
	placeListCopy = []; // reset the list

	for (let i = 0; i < cityList.length; i++) {
		await readAllPlace(cityList[i])
			.then(res => {
				placeList = [...placeList, ...res];
				placeListCopy = [...placeListCopy, ...res];
			})
			.catch(err => {
				console.log(err);
			});
	}
}

//Step 2. Initialization
async function initializeGreedy(selectList, first, timeLimit) {
	let path = [];
	path.push(first);

	//placeListCopy에서는 제거
	placeListCopy = placeListCopy.filter(item => item.name != first.name);

	let numPlace = placeListCopy.length;
	let totalTime = 0; // Total travel time

	let startIndex = -1;

	//만약, 숙소를 골라두었을 경우, 마지막 장소로 가는 소요시간까지 생각하기
	if (first.name != '' && timeLimit > 2) {
		timeLimit -= 1;
	}

	// Iteratively connect nearest cities
	for (let i = path.length; i < numPlace; i++) {
		let sum = Array(numPlace).fill(0); // 각 관광지의 점수 합

		//각 관광지별 계산하기
		for (let n = 0; n < placeListCopy.length; n++) {
			//첫 관광지가 이미 path에 있으므로 beforePlace에 null 넣는 예외처리 안해줘도 된다.
			//각 성향 점수 * 가중치 * 선택 유무 sum에 +해주기
			sum[n] += placePoint(selectList, path[i - 1], placeListCopy[n]);
		}

		//sort해서 다음 목적지 고르기, sort해서 그 인덱스 번호를 알아와야함. 그래야 Place리스트에서 쓸 수 있음.
		//let sumCopy = [...sum];
		let sumCopy = _.cloneDeep(sum);

		for (let q = 0; q < numPlace; q++) {
			startIndex = sum.indexOf(sumCopy[q]); // 다음 목적지의 Index

			// path에 placeListCopy[startIndex]가 없을 경우 다음 목적지 확정 (sort결과 최고의 목적지)
			if (path.indexOf(placeListCopy[startIndex]) === -1) {
				break;
			}
		}

		// path에 관광지 추가, placeListCopy에서는 제거
		path.push(placeListCopy[startIndex]);
		placeListCopy.splice(startIndex, 1);

		//첫 관광지에서의 소요시간
		if (i == 0) {
			totalTime += path[0].takenTime;
		} else {
			//distance해서 거리 비율 시간 계산
			totalTime += path[i].takenTime; // 관광지에서 소요시간
		}

		//예정된 여행 시간만큼의 일정이 채워졌다면 반복 종료
		if (totalTime > timeLimit) {
			break;
		}
	}

	return path;
}

function placePoint(selectList, beforePlace, targetPlace) {
	//반려견과, 실내여행지는 예외처리 - selectList에 있고 + 점수가 30점 이하면, sum = 0을 리턴
	if ((selectList[0][6] == 1 && targetPlace.partner[6] < 30) || (selectList[3][5] == 1 && targetPlace.tour[5] < 30)) {
		return -10000000;
	}

	let sum = 0;
	//각 성향 카테고리별 가중치, weight[5]는 popular, 인기관광지 점수
	//0:누구와, 1:테마, 2:무엇을, 3:어디 ,4:게절
	const weight = [20, 120, 120, 120, 10, 1];
	const listSum = [0, 0, 0, 0, 0];

	for (let y = 0; y < selectList[0].length; y++) {
		listSum[0] += targetPlace.partner[y] * weight[0] * selectList[0][y];
	}
	for (let y = 0; y < selectList[1].length; y++) {
		listSum[1] += targetPlace.concept[y] * weight[1] * selectList[1][y];
	}
	for (let y = 0; y < selectList[2].length; y++) {
		listSum[2] += targetPlace.play[y] * weight[2] * selectList[2][y];
	}
	for (let y = 0; y < selectList[3].length; y++) {
		listSum[3] += targetPlace.tour[y] * weight[3] * selectList[3][y];
	}
	for (let y = 0; y < selectList[4].length; y++) {
		listSum[4] += targetPlace.season[y] * weight[4] * selectList[4][y];
	}

	for (let x = 0; x < 5; x++) {
		if (count[x] > 0) {
			sum += Math.ceil(listSum[x] / count[x]);
		}
	}

	sum += Math.ceil(targetPlace.popular * weight[5]); //인기관광지 지표 포함하기

	if (beforePlace.name != '') {
		//더미는 스킵
		if (targetPlace.latitude === 0.0 || beforePlace.latitude === 0.0) {
			return sum;
		}

		const latDiff = targetPlace.latitude - beforePlace.latitude;
		const longDiff = targetPlace.longitude - beforePlace.longitude;

		let distance;

		//대중교통
		if (transitInAI === 1) {
			distance = Math.sqrt(latDiff * latDiff + longDiff * longDiff) * (distanceSensitivity * 2000 + 6000);
		}
		//자차
		else {
			distance = Math.sqrt(latDiff * latDiff + longDiff * longDiff) * (distanceSensitivity * 2000 + 2000);
		}

		sum -= Math.round(distance); // - Calculate the distance
	}

	return sum;
}

//Step 3-2. 코스 개선 시도를 위한 방법 - 2가지 (관광지 교체, 순서 변경)
function twoOpts(path, selectList, finishPath) {
	let iterations = 500; //2-opts 시도 횟수

	let bestPath = _.cloneDeep(path);

	let bestPoint = 0;

	let selectWay = 0;

	//판단 기준은 placePoint의 합으로 한다.
	bestPoint += placePoint(selectList, dummy, bestPath[0]);
	for (let i = 1; i < bestPath.length; i++) {
		bestPoint += placePoint(selectList, bestPath[i - 1], bestPath[i]);
	}

	for (let i = 0; i < iterations; i++) {
		let newPath = _.cloneDeep(bestPath);
		var addPlace;
		var removePlace;
		let flag3 = false;
		let idx1 = -1;
		let idx2 = -1;
		if (bestPath.length > 2) {
			idx1 = Math.floor(Math.random() * (bestPath.length - 1)) + 1;
			idx2 = Math.floor(Math.random() * (bestPath.length - 1)) + 1;
		} else {
			break;
		}

		while (idx1 == idx2 && bestPath.length > 2) {
			idx2 = Math.floor(Math.random() * (bestPath.length - 1)) + 1;
		}
		//idx1, 2 순서 정렬
		if (idx1 > idx2) {
			let idx3 = idx1;
			idx1 = idx2;
			idx2 = idx3;
		}

		//1. 관광지 하나를 새 관광지로 바꾼다. - 모든 관광지를 갈 경우 안함.
		if ((i == 0 || selectWay == 1) && placeList.length > newPath.length && placeListCopy.length > 0) {
			var temp;
			let flag = true;
			let flag2 = 0;
			flag3 = false;

			while (true) {
				let a = Math.floor(Math.random() * placeListCopy.length);
				let temp2 = _.cloneDeep(placeListCopy[a]);

				for (let j = 1; j < newPath.length; j++) {
					if (temp2.name == newPath[j].name) {
						flag = false; //같은 이름이 있으면, 반복하여 다른 Place찾음
					}
				}
				if (flag) {
					temp = _.cloneDeep(temp2);
					break;
				} else {
					flag2 += 1;
				}
				flag = true; //이거땜에 많이 헤멨었는데, 까먹지 말고 초기화할것!
				//만약을 대비
				if (flag2 > 10) {
					flag3 = true;
					break;
				}
			}
			if (flag3) {
				continue;
			}
			addPlace = null;
			addPlace = _.cloneDeep(temp);
			removePlace = null;
			removePlace = _.cloneDeep(newPath[idx1]);

			if (addPlace.name == removePlace.name) {
				continue;
			}

			//   //fixedPlaceList가 있는데, removePlace가 이 안에 있다면, break
			//   let flag4 = false;
			//   for (int k = 0; k < fixedPlaceList.length; k++) {
			//     if (removePlace.name == fixedPlaceList[k].name) {
			//       flag4 = true; //같은 이름이 있으면, continue;
			//     }
			//   }

			//   if (flag4) {
			//     //제거할 Place가 fixedPlace여서 continue합니다.
			//     continue;
			//   }

			newPath = newPath.filter(item => item.name !== _.cloneDeep(removePlace).name);
			//혹시모르니까, 추가전에 한번 더 없애줌
			newPath = newPath.filter(item => item.name !== _.cloneDeep(addPlace).name);
			if (idx1 >= newPath.length) {
				newPath.push(_.cloneDeep(addPlace));
			} else {
				newPath.splice(idx1, 0, addPlace);
			}
		}
		//2. 이미 있는 코스에서 2개를 바꾼다.
		else {
			let temp;
			let temp2;

			temp = _.cloneDeep(newPath[idx1]);
			temp2 = _.cloneDeep(newPath[idx2]);

			newPath.splice(idx1, 1);
			newPath.splice(idx2 - 1, 1);

			if (idx1 >= newPath.length) {
				newPath.push(_.cloneDeep(temp2));
			} else {
				newPath.splice(idx1, 0, _.cloneDeep(temp2));
			}
			if (idx2 >= newPath.length) {
				newPath.push(_.cloneDeep(temp));
			} else {
				newPath.splice(idx1, 0, _.cloneDeep(temp));
			}
		}

		let newPoint = 0;

		newPoint += placePoint(selectList, dummy, newPath[0]);

		for (let n = 1; n < newPath.length; n++) {
			newPoint += placePoint(selectList, newPath[n - 1], newPath[n]);
		}

		if (newPoint >= bestPoint) {
			bestPath = newPath;

			if (
				(i == 0 || selectWay == 1) &&
				placeList.length > newPath.length &&
				placeListCopy.length > 0 &&
				flag3 == false &&
				addPlace.name != removePlace.name
			) {
				placeListCopy = placeListCopy.filter(item => item.name !== addPlace.name);

				//혹시 모르니까 추가 전에 한번 더 없애줌
				placeListCopy = placeListCopy.filter(item => item.name !== removePlace.name);

				if (addPlace.name != removePlace.name) {
					placeListCopy.push(_.cloneDeep(removePlace));
				}
			}

			bestPoint = newPoint;

			//다음 개선 방법 선택
			if (selectWay == 0 || selectWay == 1) {
				selectWay = 1;
			} else {
				selectWay = 2;
			}
		} else {
			//개선이 안됐을 경우, 기존과 다른 방법 선택
			//다음 개선 방법 선택
			if (selectWay == 0 || selectWay == 1) {
				selectWay = 2;
			} else {
				selectWay = 1;
			}
		}
	}

	return bestPath;
}

//Step 3-1. 코스 개선을 위한 Hill Climbing - Local Optima를 찾기 위한 과정
function hillClimbing(path, selectList, finishPath, todayAccomodationList, timeLimit) {
	let StopRepeat = 5; //개선 여부에 따른 HC 횟수 조절
	let StopRepeat2 = 1000; //너무 많이 반복되는 것 방지

	let kOptContinue = true;

	let kOptCheck = 0;
	let kOptCheck2 = 0;

	let bestPath = twoOpts(path, selectList, finishPath);

	let bestPoint = 0;

	//판단 기준은 시간 제외, placePoint의 합으로 한다.
	//제한 시간은 동일하니, 동선이 좋다면 관광지 수가 많아 점수가 높을 것
	bestPoint += placePoint(selectList, dummy, bestPath[0]);

	for (let i = 1; i < bestPath.length; i++) {
		bestPoint += placePoint(selectList, bestPath[i - 1], bestPath[i]);
	}

	while (kOptContinue) {
		let newPath = twoOpts(path, selectList, finishPath);

		let newPoint = 0;

		newPoint += placePoint(selectList, dummy, newPath[0]);
		for (let i = 1; i < newPath.length; i++) {
			newPoint += placePoint(selectList, newPath[i - 1], newPath[i]);
		}

		// 2-opts를 통해 개선이 일어났다면, 기존 path와 교체
		if (newPoint > bestPoint) {
			bestPath = _.cloneDeep(newPath);
			bestPoint = newPoint;
			kOptCheck = 0; //개선이 일어났으면 k_opt_check를 0으로 초기화하여 다시 카운트
			kOptCheck2 += 1;
		} else {
			kOptCheck += 1;
			kOptCheck2 += 1;
		}
		//개선이 StopRepeat만큼 일어나지 않으면 반복문 종료

		if (kOptCheck >= StopRepeat || kOptCheck2 >= StopRepeat2) {
			kOptContinue = false;
		}
	}

	//이게 true가 되면 fixedPlace가 맨 앞으로 이동한 것이라서, 경로 최적화 다시
	//let courseFlag = true;

	//시간 계산해서 뒷부분 짤라야 함
	let totalTime = 0;

	//100번 해봐도 못빠져나가면 그대로 리턴해버림
	for (let r = 0; r < 100; r++) {
		totalTime = 0;

		for (let t = 0; t < bestPath.length; t++) {
			totalTime += bestPath[t].takenTime;
		}

		//거리 민감도에 따라 이동시간 어림을 다르게 함
		let moveTime = 30;

		if (distanceSensitivity < 6) {
			moveTime = 60;
		}

		//코스의 길이가 길수록 이동시간도 길어짐
		//길이에 비례하여 timeLimit를 줄임
		//이 수치는 차후에 조정할 것!!

		if (totalTime > timeLimit - (bestPath.length - 1) * moveTime) {
			let canPopPlaceList = [];

			for (let t = 0; t < bestPath.length; t++) {
				let checkAcm = false;

				if (
					bestPath[t].name == todayAccomodationList[0].name ||
					bestPath[t].name == todayAccomodationList[1].name
				) {
					checkAcm = true;
				}
				if (!checkAcm) {
					canPopPlaceList.push(_.cloneDeep(bestPath[t]));
				}
			}

			let canPopPlacePoint = [];

			for (let t = 0; t < canPopPlaceList.length; t++) {
				canPopPlacePoint.push(placePoint(selectList, dummy, canPopPlaceList[t]));
			}

			let canPopPlacePointCopy = [];
			canPopPlacePointCopy = canPopPlacePoint.toSorted();
			let cpppclen = canPopPlacePointCopy.length;

			for (let x = 0; x < cpppclen; x++) {
				let index = canPopPlacePoint.indexOf(canPopPlacePointCopy[x]);
				if (bestPath.length == 1) {
					break;
				} else {
					bestPath = bestPath.filter(item => item.name != canPopPlaceList[index].name);
				}

				totalTime = 0;
				for (let z = 0; z < bestPath.length; z++) {
					totalTime += bestPath[z].takenTime;
				}
				if (totalTime <= timeLimit - (bestPath.length - 1) * moveTime) {
					break;
				}
				if (canPopPlaceList.length == 0) {
					break;
				}
				if (x == cpppclen - 1) {
					console.log('place pop 에러');
				}
			}
		}
	}

	//fixedPlace가 맨 앞으로 이동해서, 경로 최적화 다시

	//먼저 현재 코스의 거리합을 계산한다
	let bestSum = 100000000.0;

	//그 후, full search를 통해 최적 경로를 찾는다. 갯수 적어서 ㄱㅊ을듯
	//시간복잡도 O(n!)일거임 아마?
	let tempPath = _.cloneDeep(bestPath);
	let tempPlace = _.cloneDeep(tempPath[0]);

	tempPath = tempPath.filter(item => item.name != tempPath[0].name);
	tempPath = tempPath.filter(item => item.name != todayAccomodationList[1].name);

	//첫번째 관광지는 고정이니까
	searchFullCourse(tempPath, [tempPlace], todayAccomodationList);

	for (let x = 0; x < corDis.length; x++) {
		if (corDis[x].length == 0) {
			console.log('경로최적화 중 알 수 없는 에러 발생');
			break;
		}
		// console.log(corDis[x])
		if (todayAccomodationList[1].name != '') {
			corDis[x].push(_.cloneDeep(todayAccomodationList[1]));
		}

		let sum = 0.0;

		for (let y = 0; y < corDis[x].length - 1; y++) {
			if (corDis[x][y].latitude == 0.0) {
				continue; //이 경우는 숙소가 없어서, firstPlace가 더미인경우밖에없음
			}
			let latDiff = corDis[x][y].latitude - corDis[x][y + 1].latitude;
			let longDiff = corDis[x][y].longitude - corDis[x][y + 1].longitude;

			let dis = Math.sqrt(latDiff * latDiff + longDiff * longDiff);
			sum += dis;
		}
		// 코스 길이 합이 짧아졌다면 기존 코스와 교체
		if (sum < bestSum) {
			bestPath = corDis[x];

			bestSum = sum;
		}
	}

	corDis = [];
	return bestPath;
}

//Step 4. 마지막으로, 완전탐색(재귀)를 통해 코스 최적화 (조합 최적화)
function searchFullCourse(placeList, selectList, todayAccomodationList) {
	// console.log(selectList)
	//selectList가 모든 관광지를 가져온 경우
	if (placeList.length == 0) {
		corDis.push(selectList);
	}
	//재귀 하향 탐색? selectList에 관광지 하나씩 넘겨가면서
	for (let i = 0; i < placeList.length; i++) {
		selectList.push(placeList[i]);

		placeList = placeList.filter(item => item.name != placeList[i].name);

		searchFullCourse(placeList, selectList, todayAccomodationList);

		let temp = selectList.length;

		placeList.splice(i, 0, selectList[temp - 1]);

		selectList = selectList.filter(item => item.name != selectList[temp - 1].name);

		//2개 이상인 경우는 숙소가 빠지는 경우밖에 없음
		if (
			temp - selectList.length > 1 &&
			(todayAccomodationList[0].name != '' || todayAccomodationList[1].name != '')
		) {
			selectList.splice(0, 0, todayAccomodationList[0]);
		}
	}
}

async function routeSearch(accomodationList, selectList, essentialPlaceList, timeLimitArray, nDay, transit) {
	// await안쓰면 이 함수 따로 돌리고 넘어가서, placeList에 원소 안넣은 상태로 코드돌림

	//프리셋 갯수 결정
	let numPreset = 5;

	//자차, 대중교통 - 전역변수 저장
	transitInAI = transit;

	// 숙소, 필수여행지 총 합계 계산(숙소는 -2) + 총날짜도 고려!! - , 반복 횟수 줄이기에 사용
	// 총날짜 (nDay)를 3으로 나눈 몫만큼 빼주자 -> 3일이면 -1, 6일이면 -2 -> 날짜가 많으면 선택 많이해도 지장 줄어드니까
	selectedNum = houseList.length - 2 + fixTourSpotList.length - ~~(nDay / 3);

	//selectList 선순회 - placePoint에서 평균 구할 때 사용 - 내부에서 계산하면 시간 오래 걸리니까
	count = [0, 0, 0, 0, 0]; //초기화
	for (let x = 0; x < 5; x++) {
		for (let y = 0; y < selectList[x].length; y++) {
			if (selectList[x][y] == 1) count[x] += 1;
		}
	}

	//path의 List,관광지의 List의 List, 날짜별로 한번 더 쪼갠것임
	//pathList[프리셋넘버][n일차넘버][n번째관광지] - 중요!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	let pathList = [];

	let point = [];

	//let fixedPlaceList = [];

	let timeLimit = 0;
	let time = [];

	//시간 지정 안했을 경우 하루당 8시간
	if (timeLimitArray == null) {
		timeLimit = 8 * 60;
		for (let d = 0; d < nDay; d++) {
			time.push(timeLimit);
		}
	}
	//시간 지정 했을 경우
	else {
		//당일치기여행이면, timeLimitArray[0]~timeLimitArray[1]만 생각하면 된다.
		if (nDay == 1) {
			timeLimit = timeLimitArray[1] - timeLimitArray[0];

			timeLimit > 6 ? (timeLimit = timeLimit - 5) : (timeLimit = timeLimit - 3);

			timeLimit = timeLimit * 60;
			time.push(timeLimit);
		}
		//timeLimit 계산해주기 - timeLimitArray[0] = 첫날 시작시간
		//timeLimitArray[1] = 마지막 날 끝나는 시간
		//3시간 이동시간으로 빼주기
		else {
			timeLimit = 20 - timeLimitArray[0];
			timeLimit = timeLimit * 60;
			time.push(timeLimit);

			for (let d = 0; d < nDay - 2; d++) {
				timeLimit = 8 * 60;
				time.push(timeLimit);
			}

			timeLimit = timeLimitArray[1] - 8;
			// timeLimit = timeLimit * 60;
			time.push(timeLimit * 60);
		}
	}
	//timeLimit 계산 종료

	var firstPlace = _.cloneDeep(dummy);

	//preset 반복문 시작 - 프리셋 개수(5번)만큼 반복
	for (let i = 0; i < numPreset; i++) {
		let tempPath = [];

		//nDay 반복문 시작 - 날짜만큼 반복
		for (let d = 0; d < nDay; d++) {
			//전날 숙소를 지정해뒀을 경우
			if (accomodationList[d].name !== '') {
				firstPlace = _.cloneDeep(accomodationList[d]);

				if (placeListCopy.length < 3) {
					//이러면, 관광지 부족하다는 뜻!, 중단하고 프리셋에서 안내메세지 띄우자
					console.log('남은 관광지 수2222');
					console.log(placeListCopy.length);
					enoughPlace = false;
					break;
				}
			}
			//숙소를 지정해두지 않았을 경우
			else {
				//첫날이면
				if (d == 0) {
					//첫째날 숙소(마지막 장소)가 있을 경우
					if (accomodationList[d + 1].name == '') {
						point = [];
						//모든 관광지의 시간을 제외한 point를 탐색
						for (let f = 0; f < placeListCopy.length; f++) {
							point.push(placePoint(selectList, accomodationList[d + 1], placeListCopy[f]));
						}
						// 점수를 기준으로 sort해서 시작 관광지를 numPreset * day만큼 추출
						let pointCopy = _.cloneDeep(point);

						pointCopy.sort();

						// 출발지의 Index, 프리셋마다 다르게 시작하기 위함
						let index = point.indexOf(pointCopy[pointCopy.length - 1 - i * 4]);

						//if문들을 삼항 연산자로 치환
						index = index >= 0 ? index : point.indexOf(pointCopy[pointCopy.length - 1 - i * 3]);

						index = index >= 0 ? index : point.indexOf(pointCopy[pointCopy.length - 1 - i * 2]);

						index = index >= 0 ? index : point.indexOf(pointCopy[pointCopy.length - 1 - i]);

						index = index >= 0 ? index : point.indexOf(pointCopy[pointCopy.length - 1]);

						if (index < 0) {
							//이러면, 관광지 부족하다는 뜻!, 중단하고 프리셋에서 안내메세지 띄우자
							console.log('남은 관광지 수3333');
							console.log(placeListCopy.length);
							enoughPlace = false;
							break;
						}
						firstPlace = _.cloneDeep(placeListCopy[index]);
					}

					//첫째날 숙소(마지막 장소)가 없을 경우
					else {
						point = [];
						//모든 관광지의 시간을 제외한 point를 탐색
						for (let f = 0; f < placeListCopy.length; f++) {
							point.push(placePoint(selectList, dummy, placeListCopy[f]));
						}
						// 점수를 기준으로 sort해서 시작 관광지를 numPreset * day만큼 추출
						let pointCopy = _.cloneDeep(point);
						pointCopy.sort();

						// 출발지의 Index, 프리셋마다 다르게 시작하기 위함
						let index = point.indexOf(pointCopy[pointCopy.length - 1 - i * 4]);

						//if문들을 삼항 연산자로 치환
						index = index >= 0 ? index : point.indexOf(pointCopy[pointCopy.length - 1 - i * 3]);

						index = index >= 0 ? index : point.indexOf(pointCopy[pointCopy.length - 1 - i * 2]);

						index = index >= 0 ? index : point.indexOf(pointCopy[pointCopy.length - 1 - i]);

						index = index >= 0 ? index : point.indexOf(pointCopy[pointCopy.length - 1]);

						if (index < 0) {
							//이러면, 관광지 부족하다는 뜻!, 중단하고 프리셋에서 안내메세지 띄우자
							console.log('남은 관광지 수4444');
							console.log(placeListCopy.length);
							enoughPlace = false;
							break;
						}
						firstPlace = _.cloneDeep(placeListCopy[index]);
					}
					//첫날일 경우 종료
				}

				//첫날이 아니면
				else {
					point = [];
					//모든 관광지의 시간을 제외한 point를 탐색
					for (let f = 0; f < placeListCopy.length; f++) {
						point.push(placePoint(selectList, tempPath.at(-1).at(-1), placeListCopy[f]));
					}
					// 점수를 기준으로 sort해서 시작 관광지를 numPreset * day만큼 추출
					let pointCopy = _.cloneDeep(point);

					pointCopy.sort();

					let index = point.indexOf(pointCopy[pointCopy.length - 1 - i * 4]);

					//if문들을 삼항 연산자로 치환
					index = index >= 0 ? index : point.indexOf(pointCopy[pointCopy.length - 1 - i * 3]);

					index = index >= 0 ? index : point.indexOf(pointCopy[pointCopy.length - 1 - i * 2]);

					index = index >= 0 ? index : point.indexOf(pointCopy[pointCopy.length - 1 - i]);

					index = index >= 0 ? index : point.indexOf(pointCopy[pointCopy.length - 1]);

					if (index < 0) {
						//이러면, 관광지 부족하다는 뜻!, 중단하고 프리셋에서 안내메세지 띄우자
						console.log('남은 관광지 수5555');
						console.log(placeListCopy.length);
						enoughPlace = false;
						break;
					}

					firstPlace = _.cloneDeep(placeListCopy[index]);
				}
			}

			//이태운 - 필수여행지 추가 - map형식임
			let essentialPlaceListCopy = [];
			essentialPlaceList.length > 0 &&
				essentialPlaceList.map((item, idx) => {
					//fixedPlaceDayList의 원소가 d+1(n일차)와 같을때만
					if (item.day === d + 1) {
						let readData = {
							name: fixTourSpotList[f].name,
							latitude: fixTourSpotList[f].latitude,
							longitude: fixTourSpotList[f].longitude,
							takenTime: 60,
							popular: 0,
							partner: [0, 0, 0, 0, 0, 0, 0],
							concept: [0, 0, 0, 0],
							play: [0, 0, 0, 0, 0, 0],
							tour: [0, 0, 0, 0, 0, 0, 0, 0, 0],
							season: [0, 0, 0, 0],
							category: 5,
						};
						essentialPlaceListCopy.push(readData);
						placeListCopy = placeListCopy.filter(item => item.name !== readData.name);
					}
				});

			//초기 path 만들기
			let initializePath = await initializeGreedy(selectList, firstPlace, time[d]);

			//태운 - 임시로 accomodationList 하나 추가해 봄. - 왜 되는지는 모르겠네??
			if (d != nDay - 1 && accomodationList[d + 1].name != '') {
				initializePath.push(_.cloneDeep(accomodationList[d + 1]));
			}

			//날짜 기준으로 사용할 숙소(Accomodation) 2개만 따로 분리. [0]은 시작 숙소, [1]은 끝 숙소
			let todayAccomodationList = [_.cloneDeep(accomodationList[d]), _.cloneDeep(accomodationList[d + 1])];

			//초기 path 개선 - Hill-Climbing으로
			let improvedPath = hillClimbing(initializePath, selectList, finishPath, todayAccomodationList, time[d]);

			// placeListCopy를 한번 더 제대로 업데이트 해주는 것임 - 없애도 무방, Flutter에서 에러났어서 만들었던 코드
			// 와중에 이중 for문이라, 개선필요할듯, 일단 주석처리해봄. 문제시 다시 실행
			// placeListCopy = [];
			// placeListCopy = _.cloneDeep(placeList);

			// for (let q = 0; q < improvedPath.length; q++) {
			// 	let temp = [];

			// 	for (let item = 0; item < placeListCopy.length; item++) {
			// 		if (placeListCopy[item].name != improvedPath[q].name) {
			// 			temp.push(placeListCopy[item]);
			// 		}
			// 	}
			// 	placeListCopy = temp;
			// }
			// 수정한다면, 이런식으로 수정
			// for (int q = 0; q < finishPath.length; q++) {
			// 	deletePlaceListCopy(finishPath[q]);
			//   }
			// placeListCopy를 한번 더 제대로 업데이트 해주는 것임 - 없애도 무방, Flutter에서 에러났어서 만들었던 코드

			//i번째 프리셋 pathList에 추가
			tempPath.push(improvedPath);
		}

		pathList.push(tempPath);
		//placeListCopy = placeList;    //이태운 - 얕은 복사이길래 수정. 객체 배열이니까..
		placeListCopy = _.cloneDeep(placeList);
		//TODO 이부분에서, placeListCopy = placeList;를 제거하면 프리셋마다 완전 다르게 갈 수 있음.
		//단, 관광지 수가 훨씬 더 많이 필요하고, 프리셋끼리 겹치는 관광지가 1도 없게 되어버림
		//개선안 고민해볼 것!!
	}

	return pathList;
}

//localSearchAI를 실행시키는 비동기 함수
async function localSearchAI(
	regionList,
	accomodationList,
	selectList,
	essentialPlaceList,
	timeLimitArray,
	nDay,
	transit,
) {
	//이태운 주석처리
	// if(house == null){
	//   house = [...Array(nDay+1)].map((home,id)=>{
	//     home = dummy;

	//     return home;
	//   })
	// }else{
	//   house = house.map((home,id)=>{
	//     if(home == null){
	//       home = dummy;
	//     }else{
	//       home = new Place(home.name, home.latitude, home.longitude, 30, 0, [0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0],[0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0])
	//     }
	//     return home;
	//   })
	// }
	console.log('시작!');

	//시간 재기
	const startTime = performance.now();

	//데이터 로딩
	//await dataLoading(regionList);
	//임시로 주석처리하고, 임시관광지 넣음 - 파이어베이스 연결 이후에 수정할 것!
	placeList = [
		{
			name: '임시관광지1',
			latitude: 35.11111,
			longitude: 127.012411,
			takenTime: 60,
			popular: 100,
			partner: [0, 0, 0, 0, 0, 0, 0],
			concept: [0, 0, 0, 0],
			play: [0, 80, 0, 0, 0, 0],
			tour: [0, 0, 0, 0, 80, 0, 0, 0, 0],
			season: [0, 80, 0, 0],
			category: 1,
		},
		{
			name: '임시관광지2',
			latitude: 35.13213,
			longitude: 127.012411,
			takenTime: 60,
			popular: 100,
			partner: [0, 0, 0, 0, 0, 0, 0],
			concept: [0, 0, 80, 0],
			play: [0, 0, 80, 0, 0, 0],
			tour: [0, 0, 0, 0, 0, 0, 0, 80, 0],
			season: [0, 80, 0, 0],
			category: 1,
		},
		{
			name: '임시관광지3',
			latitude: 35.11111,
			longitude: 127.32532,
			takenTime: 60,
			popular: 100,
			partner: [0, 0, 0, 0, 0, 80, 0],
			concept: [0, 0, 0, 0],
			play: [0, 0, 0, 80, 0, 0],
			tour: [0, 0, 0, 0, 0, 0, 80, 0, 0],
			season: [0, 80, 0, 0],
			category: 1,
		},
		{
			name: '임시관광지4',
			latitude: 35.22211,
			longitude: 127.532332,
			takenTime: 60,
			popular: 100,
			partner: [0, 0, 0, 0, 0, 0, 0],
			concept: [0, 0, 0, 80],
			play: [0, 80, 0, 0, 0, 0],
			tour: [0, 0, 0, 0, 80, 0, 0, 0, 0],
			season: [0, 80, 0, 0],
			category: 1,
		},
		{
			name: '임시관광지5',
			latitude: 35.53424,
			longitude: 127.43221,
			takenTime: 60,
			popular: 100,
			partner: [0, 0, 0, 0, 0, 0, 80],
			concept: [0, 0, 0, 0],
			play: [80, 0, 0, 0, 0, 0],
			tour: [0, 0, 0, 0, 0, 0, 0, 0, 80],
			season: [0, 80, 0, 0],
			category: 1,
		},
		{
			name: '임시관광지6',
			latitude: 35.53243,
			longitude: 127.54364,
			takenTime: 60,
			popular: 100,
			partner: [0, 0, 0, 0, 0, 80, 0],
			concept: [0, 0, 0, 0],
			play: [0, 0, 0, 0, 0, 0],
			tour: [0, 0, 0, 0, 0, 0, 80, 0, 0],
			season: [0, 80, 0, 0],
			category: 1,
		},
		{
			name: '임시관광지7',
			latitude: 35.12312,
			longitude: 127.534242,
			takenTime: 60,
			popular: 100,
			partner: [0, 0, 0, 0, 0, 0, 0],
			concept: [80, 0, 0, 0],
			play: [0, 0, 80, 0, 0, 0],
			tour: [0, 0, 0, 0, 0, 0, 0, 0, 0],
			season: [0, 80, 80, 0],
			category: 1,
		},
		{
			name: '임시관광지8',
			latitude: 35.65644,
			longitude: 127.53243,
			takenTime: 60,
			popular: 100,
			partner: [0, 0, 0, 0, 0, 0, 0],
			concept: [0, 0, 0, 80],
			play: [0, 0, 80, 0, 0, 0],
			tour: [0, 0, 0, 0, 0, 0, 0, 0, 80],
			season: [0, 0, 0, 0],
			category: 1,
		},
		{
			name: '임시관광지9',
			latitude: 35.85654,
			longitude: 127.263345,
			takenTime: 60,
			popular: 100,
			partner: [0, 0, 0, 0, 0, 80, 0],
			concept: [0, 0, 0, 0],
			play: [80, 0, 0, 0, 0, 0],
			tour: [0, 0, 0, 0, 0, 0, 80, 0, 0],
			season: [0, 0, 0, 0],
			category: 1,
		},
		{
			name: '임시관광지10',
			latitude: 35.66409,
			longitude: 127.098765,
			takenTime: 60,
			popular: 100,
			partner: [0, 80, 0, 0, 0, 0, 0],
			concept: [0, 0, 0, 0],
			play: [0, 0, 80, 0, 0, 0],
			tour: [0, 0, 0, 0, 0, 80, 0, 0, 0],
			season: [0, 0, 0, 0],
			category: 1,
		},
	];
	placeListCopy = _.cloneDeep(placeList);
	//임시로 주석처리하고, 임시관광지 넣음 - 파이어베이스 연결 이후에 수정할 것!

	//AI 실행
	const readData = await routeSearch(accomodationList, selectList, essentialPlaceList, timeLimitArray, nDay, transit);

	//시간 재기
	const endTime = performance.now();

	for (let i = 0; i < readData.length; i++) {
		console.log(`코스`);
		for (let j = 0; j < readData[i].length; j++) {
			console.log(`날짜 : ${j + 1}`);
			for (let k = 0; k < readData[i][j].length; k++) {
				console.log(readData[i][j][k].name);
			}
		}
		console.log(`------------------------------------------`);
	}

	console.log(`AI 돌리는데 걸리는 시간`);

	const elapsedTime = endTime - startTime;

	console.log(`Elapsed time: ${elapsedTime / 1000} seconds`);

	return readData;
}

export {localSearchAI, enoughPlace};
