import {useState, memo, useRef} from 'react';
import {Text, Box, ScrollView, VStack, Divider, Slider, Center, HStack, Spacer} from 'native-base';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {TouchableOpacity, Modal, TouchableWithoutFeedback} from 'react-native';
import {googleKeywordApi, recommendApi, travelSliceActions} from '../../../redux/travel-info/travel.slice';
import {colors} from '../../colors';
const InfoView = ({navigation, setDeleteList, deleteList, viewDayIndex}: any) => {
	const {timetable, editMode} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const viewDetail = (e: any) => {
		console.log(e.lat);
		console.log(e.lng);
		dispatch(googleKeywordApi(e.value));
		navigation.navigate('CourseDetail');
	};
	const indexRef = useRef({value: '', index: 0});
	const [visible, setVisible] = useState(false);
	const restaurantRecommend = (e: {value: any; index: number; idx: number}) => {
		if (timetable[e.idx].length == 0) {
			console.log('한개밖에 없어서 못해여');
		} else {
			console.log(e.index, timetable[e.idx].length);
			//혼자일때도 처리
			if (e.index == timetable[e.idx].length - 1) {
				dispatch(
					recommendApi({
						category: 'FD6',
						lat: timetable[e.idx][timetable[e.idx].length - 2].lat,
						lng: timetable[e.idx][timetable[e.idx].length - 2].lng,
						radius: 2000,
					}),
				);
			} else if (e.index == 0) {
				dispatch(
					recommendApi({
						category: 'FD6',
						lat: timetable[e.idx][1].lat,
						lng: timetable[e.idx][1].lng,
						radius: 2000,
					}),
				);
			} else {
				const dLat = (timetable[e.idx][e.index - 1].lat - timetable[e.idx][e.index + 1].lat) * (Math.PI / 180);
				const dLon = (timetable[e.idx][e.index - 1].lng - timetable[e.idx][e.index + 1].lng) * (Math.PI / 180);

				const a =
					Math.sin(dLat / 2) * Math.sin(dLat / 2) +
					Math.cos(timetable[e.idx][e.index - 1].lat * (Math.PI / 180)) *
						Math.cos(timetable[e.idx][e.index + 1].lat * (Math.PI / 180)) *
						Math.sin(dLon / 2) *
						Math.sin(dLon / 2);
				const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
				const distance = Math.ceil(6371 * c); // 두 지점 간의 거리 (단위: km)
				console.log(Math.ceil(distance));
				console.log('dd');

				dispatch(
					recommendApi({
						category: 'FD6',
						lat: (timetable[e.idx][e.index - 1].lat + timetable[e.idx][e.index + 1].lat) / 2,
						lng: (timetable[e.idx][e.index - 1].lng + timetable[e.idx][e.index + 1].lng) / 2,
						radius: distance * 1000,
					}),
				);
			}
			const startNumber = e.value.y; // 시작 숫자
			const count = e.value.takenTime / 30; // 원하는 갯수

			const sequentialArray = Array.from({length: count}, (_, index) => startNumber + index);
			console.log(sequentialArray); // [5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

			navigation.navigate('Recommend', {
				x: e.value.x,
				index: e.index,
				y: sequentialArray,
				category: 3,
			});
		}
	};
	const categortColors = ['blue', 'orange', 'green', 'pink', 'purple', 'gray'];
	const [deleteMode, setDeleteMode] = useState(false);

	return (
		<Box>
			<HStack position='absolute' zIndex='1'>
				<Box w='60px'></Box>
				{timetable.map(
					(item, idx) =>
						idx >= viewDayIndex &&
						idx <= viewDayIndex + 4 && (
							<VStack key={idx}>
								{item.map((value, index) => {
									return (
										<TouchableOpacity
											style={{
												width: 70,
												height: 35 * Math.ceil(value.takenTime / 30),
												top: 35 * (value.y ?? 1),
												left: value?.x && 70 * (idx - viewDayIndex),
												backgroundColor:
													editMode == 'delete' && deleteList.includes(value.id)
														? 'red'
														: categortColors[value.category],
												position: 'absolute',
											}}
											key={index}
											onPress={() => {
												indexRef.current = {value: value, index: index};

												if (editMode == 'delete') {
													let copy = [...deleteList];
													if (deleteList.includes(value.id)) {
														copy = copy.filter(item => item != value.id);
													} else {
														copy.push(value.id);
													}
													console.log(value.id);
													setDeleteList(copy);
												} else {
													//지금 임시로 카페를 식당으로 치환 카테고리=음식점이고 경도없을떄.
													console.log(value.category);
													if (value.category == 1 && !value.lat) {
														restaurantRecommend({value, index, idx});
													} else {
														setVisible(true);
													}
												}
											}}
											onLongPress={() => {
												if (editMode == 'delete') {
													setDeleteList([]);
													dispatch(travelSliceActions.editModeChange(''));
												} else {
													let copy = [...deleteList];
													copy.push(value.id);
													setDeleteList(copy);
													dispatch(travelSliceActions.editModeChange('delete'));
												}
											}}>
											{/* h= takenTime top=시간위치 */}
											<Text>{value.name}</Text>
										</TouchableOpacity>
									);
								})}
							</VStack>
						),
				)}
			</HStack>
			<Modal
				visible={visible}
				animationType={'slide'}
				transparent={true}
				statusBarTranslucent={true}
				onRequestClose={() => setVisible(false)}>
				<Box flex='0.5' bgColor='orange.100' backgroundColor='gray.100' opacity='1'>
					<VStack my='50'>
						<TouchableOpacity
							style={{height: 60}}
							onPress={() => {
								viewDetail(indexRef.current);
								setVisible(false);
							}}>
							<Text>정보 보기</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={{height: 60}}
							onPress={() => {
								navigation.navigate('Modify', {item: indexRef.current});
								setVisible(false);
							}}>
							<Text>수정하기</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={{height: 60}}
							onPress={() => {
								console.log(indexRef.current);
								const a = timetable.map((item, idx) =>
									item.filter(value => value.id != indexRef.current.value?.id),
								);
								dispatch(travelSliceActions.changeTimetable(a));
								setVisible(false);
							}}>
							<Text>삭제하기</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={{height: 60}}
							onPress={() => {
								setVisible(false);
							}}>
							<Text>나가기 TODO 나가는방식,띄우는위치</Text>
						</TouchableOpacity>
					</VStack>
				</Box>
			</Modal>
		</Box>
	);
};

export default memo(InfoView);
