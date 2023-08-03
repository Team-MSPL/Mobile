//import database from './firebase_read_place';

//TODO 데이터 로딩 시간 절약 -> 한 번에 불러오기 ( 플러터에선 실패 )
const readAllPlace = async city => {
	let allPlace = [];

	//한번에 map으로 불러오고, 관광지목록 <- 이것만 예외처리 해주면 될듯??, 이후에 매핑
	//혹은 데이터셋에 하나하나 관광지 이름 값도 넣어주기? - 코드로, 불러오기한 후에 다시 입력하기 하는 식으로

	let placeList = await readPlaceList(city).then(data => {
		return data;
	});

	for (let i = 0; i < placeList.length; i++) {
		await readOnePlace(city, placeList[i]).then(res => {
			allPlace[i] = res;
		});
	}
	return allPlace;
};

async function readPlaceList(city) {
	let placeList = null;

	await database
		.collection(city)
		.doc('관광지목록')
		.get()
		.then(data => {
			placeList = data.data().관광지;
		})
		.catch(err => console.log(err));

	return placeList;
}

async function readOnePlace(city, name) {
	let placeData = {};
	await database
		.collection(city)
		.doc(name)
		.get()
		.then(data => {
			let latitude = data.data()['latitude'];
			let longitude = data.data()['longitude'];
			let popular = data.data()['popular'];
			let takenTime = data.data()['takenTime'];

			let partner2 = data.data()['partner'];
			let partner = [];
			for (let i = 0; i < partner2.length; i++) {
				partner.push(partner2[i]);
			}
			let concept2 = data.data()['concept'];
			let concept = [];
			for (let i = 0; i < concept2.length; i++) {
				concept.push(concept2[i]);
			}
			let play2 = data.data()['play'];
			let play = [];
			for (let i = 0; i < play2.length; i++) {
				play.push(play2[i]);
			}
			let tour2 = data.data()['tour'];
			let tour = [];
			for (let i = 0; i < tour2.length; i++) {
				tour.push(tour2[i]);
			}
			let season2 = data.data()['season'];
			let season = [];
			for (let i = 0; i < season2.length; i++) {
				season.push(season2[i]);
			}

			placeData = {
				name: name,
				lat: latitude,
				lng: longitude,
				takenTime: takenTime,
				popular: popular,
				partner: partner,
				concept: concept,
				play: play,
				tour: tour,
				season: season,
				category: 0, // 이태운 추가 - 타임테이블을 위함
			};
		});

	return placeData;
}

export {readAllPlace, readOnePlace, readPlaceList};
