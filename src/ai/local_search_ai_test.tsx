import {useState, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../redux';
import {travelSliceActions} from '../redux/travel-info/travel.slice';
import shortId from 'shortid';

import {Text, ScrollView} from 'native-base';
import CustomButton from '../utill/component/custom-button';
import SelectButton from '../utill/component/select-button';

import {localSearchAI, enoughPlace} from './local_search_ai';
import {regionSearch} from './region_search';

export default function LocalSearchAITest({navigation}: any) {
	//const {Place, essentialPlaces} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();

	//이태운 - 임시 데이터
	const regionList = ['서울 전체'];
	const selectList = [
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 1, 0, 0],
	];
	const selectListInRegion = [
		[0, 1, 0, 0, 0, 1, 0],
		[1, 0, 1, 1],
		[1, 1, 1, 1, 0],
		[1, 0, 1, 0, 1, 1, 0, 1, 1],
		[0, 1, 1, 0],
	];
	const accomodationList = [
		{name: '', selectList: selectList, lat: 35.333, lng: 122.32323, takenTime: 30, category: 4},
		{name: '', selectList: selectList, lat: 35.333, lng: 122.32323, takenTime: 30, category: 4},
		{name: '', selectList: selectList, lat: 35.333, lng: 122.32323, takenTime: 30, category: 4},
		{name: '', selectList: selectList, lat: 34.333, lng: 121.32323, takenTime: 30, category: 4},
	];
	const essentialPlaceList = [
		{
			day: 1,
			name: '필수여행지1',
			lat: 35.51243,
			lng: 127.5436,
			category: 5,
			takenTime: 60,
			id: 1,
		},
		{
			day: 2,
			name: '필수여행지2',
			lat: 35.12221,
			lng: 127.6234,
			category: 5,
			takenTime: 60,
			id: 1,
		},
	];
	const timeLimitArray = [10, 20];
	const nDay = 2;
	const transit = 1;
	const selectPopular = [40, 80]; // 여행 지역 - 인기도 범위
	const recentPosition = {lat: 37.5518911, lng: 126.9917937}; //현재 위치

	const distanceSensitivity = 2; // 거리민감도
	//이태운 - 임시 데이터

	// 여행코스 AI 주석처리
	useEffect(() => {
		localSearchAI({
			regionList: regionList,
			accomodationList: accomodationList,
			selectList: selectList,
			essentialPlaceList: essentialPlaceList,
			timeLimitArray: timeLimitArray,
			nDay: nDay + 1,
			transit: transit,
			distanceSensitivity: distanceSensitivity,
		})
			.then(pathList => {
				if (!enoughPlace) {
					console.log('관광지 수 부족. 프리셋화면에서 다이어로그 띄울 것');
				} else {
					if (pathList) {
						console.log('AI 결과값 출력');
						for (let i = 0; i < pathList.length; i++) {
							// console.log('---------------------------  ' + '${i + 1}' + '번째 프리셋');
							// console.log('코스');
							// for (let j = 0; j < pathList[i].length; j++) {
							// 	console.log('날짜 : ' + (j + 1).toString());
							// 	for (let k = 0; k < pathList[i][j].length; k++) {
							// 		console.log(pathList[i][j][k].name);
							// 	}
							// }
							// console.log('---------------------------  ' + '${i + 1}' + '번째 프리셋');
						}
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

	useEffect(() => {
		regionSearch({
			selectList: selectListInRegion,
			selectPopular: selectPopular,
			distanceSensitivity: distanceSensitivity,
			recentPosition: recentPosition,
		})
			.then(result => {
				//console.log(result);
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
