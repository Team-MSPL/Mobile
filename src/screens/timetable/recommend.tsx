import {JSX, JSXElementConstructor, ReactElement, useEffect, useLayoutEffect, useRef, useState} from 'react';
import shortId from 'shortid';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {Alert, TouchableOpacity} from 'react-native';
import {Text, Box, ScrollView, VStack, Divider, Slider, Center, HStack, Spacer} from 'native-base';
import {useAppDispatch, useAppSelector} from '../../redux';

import MapView, {Polyline, Marker} from 'react-native-maps';
import {GOOGLE_API_KEY} from '@env';
import {googleDetailApi, recommendApi, TimetableType, travelSliceActions} from '../../redux/travel-info/travel.slice';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {modalSliceActions} from '../../redux/modal/modalSlice';
export default function Recommend({navigation, route}: any) {
	const {recommendList, timetable} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const newY = useRef(0);
	const [select, setSelect] = useState(-1);
	const [recommendItem, setRecommendItem] = useState<TimetableType[]>([...timetable[route.params.x]]);

	const polylineCoordinates = recommendItem
		.map((item, value) => {
			if (item.name != '점심 추천' && item.name != '저녁 추천' && item.name != '숙소 추천') {
				return {latitude: item.lat, longitude: item.lng};
			}
			return null;
		})
		.filter(items => items !== null);
	const markers = recommendItem
		.map((value, idx) => {
			if (value.name != '점심 추천' && value.name != '저녁 추천' && value.name !== '숙소 추천') {
				return (
					<Marker
						key={`marker_${idx}`}
						coordinate={{latitude: value.lat, longitude: value.lng}}
						title={value.name}
					/>
				);
			}
			return null;
		})
		.filter(marker => marker !== null);

	const polylines = recommendItem.map((val, ind) => (
		<Polyline
			key={`polyline_${ind}`}
			coordinates={polylineCoordinates}
			strokeColor={'red'}
			strokeWidth={5} // You can change the width of the line here
		/>
	));

	const changeRecommend = (idx: number) => {
		let copy = [...recommendItem];
		const updateItem = {
			name: recommendList[idx].place_name,
			lat: Number(recommendList[idx].y),
			lng: Number(recommendList[idx].x),
			category: route.params.category,
			x: route.params.x,
			y: route.params.y[0],
			id: shortId.generate(),
			takenTime: route.params.y.length * 30,
		};
		if (route.params.name === '숙소 추천' || route.params.name === '식당 추천') {
			copy[route.params.index] = updateItem;
		} else {
			if (select === -1) {
				copy.splice(route.params.index, 0, updateItem);
			} else {
				copy[route.params.index] = updateItem;
			}
		}
		// select == -1 && route.params.category != 1
		// 	? copy.splice(route.params.index, 0, updateItem)
		// 	: (copy[route.params.index] = updateItem);
		setRecommendItem(copy);
		setSelect(idx);
		mapRef.current?.animateCamera(
			{
				center: {
					latitude: updateItem.lat,
					longitude: updateItem.lng,
				},
			},
			{duration: 1000},
		);
	};
	const checkMessage = () => {
		dispatch(
			modalSliceActions.setOpenModal({
				modalTitle: '바로 추가됩니다!',
				modalFunction: addRecommend,
				modalLeft: true,
			}),
		);
	};
	const addRecommend = () => {
		let copy = [...timetable];
		copy[route.params.x] = recommendItem;
		if (route.params.name === '숙소 추천') {
			if (route.params.index != 0) {
				let updateitem = {
					...recommendItem.at(-1),
					x: copy[route.params.x + 1][0].x,
					y: copy[route.params.x + 1][0].y,
					takenTime: copy[route.params.x + 1][0].takenTime,
				};
				let itemCopy: TimetableType[] = [...copy[route.params.x + 1]];
				itemCopy[0] = updateitem;
				copy[route.params.x + 1] = itemCopy;
			} else {
				let updateitem = {
					...recommendItem[0],
					x: copy[route.params.x - 1].at(-1).x,
					y: copy[route.params.x - 1].at(-1).y,
					takenTime: copy[route.params.x - 1].at(-1).takenTime,
				};
				let itemCopy = [...copy[route.params.x - 1]];
				itemCopy.splice(itemCopy.length - 1, 1, updateitem);
				copy[route.params.x - 1] = itemCopy;
			}
		}
		dispatch(travelSliceActions.changeTimetable(copy));
		navigation.navigate('Timetable');
	};
	const getRecommendList = () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			dispatch(
				recommendApi({
					category: route.params.apiCategory,
					lat: route.params.lat,
					lng: route.params.lng,
					radius: route.params.radius,
				}),
			);
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '추천 관광지를 받아오는 중 에러가 발생했습니다.',
				}),
			);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	useEffect(() => {
		getRecommendList();
	}, []);
	const mapRef = useRef<MapView>(null);
	if (!recommendList) {
		return (
			<Box>
				<Text>추천 받는 주제에 좀 기다려 보삼 ㅋ </Text>
			</Box>
		);
	}
	return (
		<Box flex='1'>
			<MapView
				ref={mapRef}
				style={{width: '100%', height: 300}}
				region={{
					latitude: recommendItem[0].lat,
					longitude: recommendItem[0].lng,
					latitudeDelta: 0.04,
					longitudeDelta: 0.04,
				}}>
				{markers}
				{polylines}
			</MapView>
			<ScrollView>
				{recommendList.map((item, idx) => (
					<TouchableOpacity
						onPress={() => {
							changeRecommend(idx);
						}}
						key={idx}
						style={{width: '100%', margin: 10, backgroundColor: idx == select ? 'red' : 'white'}}>
						<Text>
							{item.category_name}/{item.place_name}
						</Text>
					</TouchableOpacity>
				))}
			</ScrollView>
			<TouchableOpacity
				onPress={checkMessage}
				disabled={select == -1}
				style={{
					width: '100%',
					height: 50,
					margin: 5,
					backgroundColor: 'orange',
					alignItems: 'center',
					opacity: select == -1 ? 0.5 : 1,
				}}>
				<Text bold fontSize='lg'>
					선택이요
				</Text>
			</TouchableOpacity>
		</Box>
	);
}
