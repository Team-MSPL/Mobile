import {useState, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../redux';
import {travelSliceActions} from '../redux/travel-info/travel.slice';
import shortId from 'shortid';

import {Text, ScrollView} from 'native-base';
import CustomButton from '../utill/component/custom-button';
import SelectButton from '../utill/component/select-button';

import {localSearchAI, enoughPlace} from './local_search_ai';

//이태운 - 임시 데이터
var distanceSensitivity = 5; // 거리민감도, 이건 local_search_ai.js에서 참조함
//TODO 서로가 서로를 참조하는 구조는 좋지 않음. 개선할 것
//이태운 - 임시 데이터
export {distanceSensitivity};

export default function LocalSearchAITest({navigation}: any) {
	const {Place, essentialPlaces} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();

	//이태운 - 임시 데이터
	const regionList = ['경기 오산시', '경기 안양시'];
	const selectList = [
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 1, 0, 0],
	];
	const accomodationList = [
		{name: '', selectList: selectList, lat: 35.333, long: 122.32323},
		{name: '', selectList: selectList, lat: 35.333, long: 122.32323},
		{name: '', selectList: selectList, lat: 35.333, long: 122.32323},
		{name: '', selectList: selectList, lat: 34.333, long: 121.32323},
	];
	const essentialPlaceList = {...Place, day: 1, id: shortId.generate()};
	const timeLimitArray = [10, 20];
	const nDay = 3;
	const transit = 1;
	//이태운 - 임시 데이터

	useEffect(() => {
		localSearchAI(regionList, accomodationList, selectList, essentialPlaceList, timeLimitArray, nDay, transit)
			.then(pathList => {
				if (!enoughPlace) {
					console.log('관광지 수 부족. 프리셋화면에서 다이어로그 띄울 것');
				} else {
					if (pathList) {
						console.log('AI 결과값 출력');
						// for (let i = 0; i < pathList.length; i++) {
						// 	console.log("---------------------------  " + '${i + 1}' + "번째 프리셋");
						// 	console.log("코스");
						// 	for (let j = 0; j < pathList[i].length; j++) {
						// 		console.log("날짜 : " + (j + 1).toString());
						// 	  for (let k = 0; k < pathList[i][j].length; k++) {
						// 		console.log(pathList[i][j][k].name);
						// 	  }
						// 	}
						// 	console.log("---------------------------  " + '${i + 1}' + "번째 프리셋");
						//   }
					} else {
						console.log('pathList가 undefined입니다.');
						// pathList가 undefined인 경우 처리
					}
				}
			})
			.catch(error => {
				// 오류 처리
				console.log(error);
			});
	}, []);

	return (
		<ScrollView p='5' bgColor='#EFFBFB' flex='1'>
			<Text fontSize='2xl' bold color='black'>
				AI 테스트 화면
			</Text>
			<Text fontSize='md' color='grey'>
				ㅁㄴㅇㅁㄴㅇㅁㄴㅇㅁㄴㅇㅁㄴㅇㅁ
			</Text>
			<Text fontSize='lg' bold>
				sadasd
			</Text>
			{[...Array(nDay + 1)].map((item, idx) => {
				return (
					<SelectButton
						key={idx}
						label={idx + 1 + '일 차'}
						onPress={() => console.log('idx')}
						bgColor={true}></SelectButton>
				);
			})}
		</ScrollView>
	);
}
