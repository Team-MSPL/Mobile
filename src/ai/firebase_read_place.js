import {GOOGLE_API_KEY} from '@env';
import firestore from '@react-native-firebase/firestore';

async function readAllPlace(city) {
	let allPlace = [];
	try {
		//"관광지 목록" 문서는 제거
		const placeSnapshot = await firestore().collection(city).where('name', '!=', '관광지 목록').get();
		let data = [];
		placeSnapshot.forEach(doc => {
			const docData = doc.data();
			data.push(docData);
		});

		data.map((item, idx) => {
			let name = item?.name;
			let latitude = item.latitude;
			let longitude = item.longitude;
			let popular = item.popular;
			let takenTime = item.takenTime;

			let partner = item.partner;
			let concept = item.concept;
			let play = item.play;
			let tour = item.tour;
			let season = item.season;
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
			allPlace.push(placeData);
		});

		//setCommunityData(data);
	} catch (error) {
		console.log('관광지 데이터셋을 읽어오는 중에 오류가 발생했습니다:', error);
	}
	//한번에 map으로 불러오고, 관광지목록 <- 이것만 예외처리 해주면 될듯??, 이후에 매핑
	//혹은 데이터셋에 하나하나 관광지 이름 값도 넣어주기? - 코드로, 불러오기한 후에 다시 입력하기 하는 식으로

	// let placeList = await readPlaceList(city).then(data => {
	// 	return data;
	// });

	// for (let i = 0; i < placeList.length; i++) {
	// 	await readOnePlace(city, placeList[i]).then(res => {
	// 		allPlace[i] = res;
	// 	});
	// }
	return allPlace;
}

async function readPlaceList(city) {
	let placeList = null;
	const placeListSnapshot = await firestore().collection(city).doc('관광지목록').get();

	placeList = placeListSnapshot.data().관광지;

	return placeList;
}

async function readOnePlace(city, name) {
	let placeData = {};
	try {
		const onePlaceSnapshot = await firestore().collection(city).doc(name).get();
		let item = onePlaceSnapshot.data();

		let name = item.name;
		let latitude = item.latitude;
		let longitude = item.longitude;
		let popular = item.popular;
		let takenTime = item.takenTime;

		let partner = item.partner;
		let concept = item.concept;
		let play = item.play;
		let tour = item.tour;
		let season = item.season;
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
	} catch (error) {
		console.log('관광지 데이터를 읽어오는 중에 오류가 발생했습니다:', error);
	}
	return placeData;
}

export {readAllPlace, readOnePlace, readPlaceList};
