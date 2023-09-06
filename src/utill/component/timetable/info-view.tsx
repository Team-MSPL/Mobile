import {GOOGLE_API_KEY} from '@env';
import {Box, HStack, Text, VStack} from 'native-base';
import {memo, useRef, useState} from 'react';
import {Image, Modal, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {modalSliceActions} from '../../../redux/modal/modalSlice';
import {TimetableType, travelSliceActions} from '../../../redux/travel-info/travel.slice';
const InfoView = ({navigation, setDeleteList, deleteList, viewDayIndex}: any) => {
	const {timetable, editMode, makeMode} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const viewDetail = (e: any) => {
		navigation.navigate('CourseDetail', {value: e.value});
	};
	const indexRef = useRef<{value: TimetableType; index: number; idx: number; category: number; flag: boolean}>({
		value: timetable[0][0],
		index: 0,
		idx: 0,
		category: 0,
		flag: false,
	});
	const [visible, setVisible] = useState(false);
	const goRemove = () => {
		const a = timetable.map(item => item.filter(value => value.id != indexRef.current.value?.id));
		dispatch(travelSliceActions.changeTimetable(a));
		setVisible(false);
	};
	const accommodationRecommend = (e: {value: any; index: number; idx: number}) => {
		let lat = 0;
		let lng = 0;
		e.index != 0
			? ((lat = timetable[e.idx][e.index - 1].lat), (lng = timetable[e.idx][e.index - 1].lng))
			: ((lat = timetable[e.idx][e.index + 1].lat), (lng = timetable[e.idx][e.index + 1].lng));
		const startNumber = e.value.y; // 시작 숫자
		const count = e.value.takenTime / 30; // 원하는 갯수
		const sequentialArray = Array.from({length: count}, (_, index) => startNumber + index);

		navigation.navigate('Recommend', {
			name: '숙소 추천',
			x: e.value.x,
			index: e.index,
			y: sequentialArray,
			category: e.value.category,
			lat: lat,
			lng: lng,
			apiCategory: 'AD5',
			radius: 2000,
		});
	};
	const restaurantRecommend = (e: {value: any; index: number; idx: number}) => {
		if (timetable[e.idx].length == 0) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '참고할게 부족해서 추천이 불가합니다.',
				}),
			);
		} else {
			let lat = 0;
			let lng = 0;
			let radius = 2000;
			if (e.index == timetable[e.idx].length - 1) {
				lat = timetable[e.idx][timetable[e.idx].length - 2].lat;
				lng = timetable[e.idx][timetable[e.idx].length - 2].lng;
			} else if (e.index == 0) {
				lat = timetable[e.idx][1].lat;
				lng = timetable[e.idx][1].lng;
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
				lat = (timetable[e.idx][e.index - 1].lat + timetable[e.idx][e.index + 1].lat) / 2;
				lng = (timetable[e.idx][e.index - 1].lng + timetable[e.idx][e.index + 1].lng) / 2;
				radius = distance >= 20 ? 20000 : distance == 0 ? 2000 : distance * 1000;
			}
			const startNumber = e.value.y; // 시작 숫자
			const count = e.value.takenTime / 30; // 원하는 갯수

			const sequentialArray = Array.from({length: count}, (_, index) => startNumber + index);

			navigation.navigate('Recommend', {
				name: '식당 추천',
				x: e.value.x,
				index: e.index,
				y: sequentialArray,
				category: e.value.category,
				lat: lat,
				lng: lng,
				apiCategory: 'FD6',
				radius: radius,
			});
		}
	};
	const categortColors = ['blue', 'orange', 'green', 'pink', 'purple', 'gray'];

	return (
		<Box>
			<HStack position='absolute'>
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
												zIndex: 1,
											}}
											key={index}
											onPress={() => {
												indexRef.current = {
													value: value,
													index: index,
													idx: idx,
													category: value.category,
													flag:
														value.name == '점심 추천' ||
														value.name == '저녁 추천' ||
														value.name == '숙소 추천'
															? true
															: false,
												};
												if (makeMode == 'share') {
													viewDetail(indexRef.current);
												} else {
													if (editMode == 'delete') {
														let copy = [...deleteList];
														if (deleteList.includes(value.id)) {
															copy = copy.filter(item => item != value.id);
														} else {
															copy.push(value.id);
														}
														setDeleteList(copy);
													} else {
														setVisible(true);
													}
												}
											}}
											// onLongPress={() => {

											// 	if (makeMode != 'share') {
											// 		if (editMode == 'delete') {
											// 			setDeleteList([]);
											// 			dispatch(travelSliceActions.editModeChange(''));
											// 		} else {
											// 			let copy = [...deleteList];
											// 			copy.push(value.id);
											// 			setDeleteList(copy);
											// 			dispatch(travelSliceActions.editModeChange('delete'));
											// 		}
											// 	}
											// }}
										>
											{/* h= takenTime top=시간위치 */}
											<Text>{value.name}</Text>

											{value.photo != '' && (
												<Image
													source={{uri: `${value.photo}&key=${GOOGLE_API_KEY}`}}
													style={{width: 30, height: 30}}></Image>
											)}
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
				<ModalContainer onPress={() => setVisible(false)}>
					<InfoModalContainer>
						<VStack my='50'>
							{indexRef.current.flag ? (
								<>
									<TouchableOpacity
										style={{height: 60}}
										onPress={() => {
											indexRef.current.category == 1
												? restaurantRecommend({
														value: indexRef.current.value,
														index: indexRef.current.index,
														idx: indexRef.current.idx,
												  })
												: accommodationRecommend({
														value: indexRef.current.value,
														index: indexRef.current.index,
														idx: indexRef.current.idx,
												  });
											setVisible(false);
										}}>
										<Text>추천받기</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={{height: 60}}
										onPress={() => {
											const a = timetable.map((item, idx) =>
												item.filter(value => value.id != indexRef.current.value?.id),
											);
											dispatch(travelSliceActions.changeTimetable(a));
											setVisible(false);
										}}>
										<Text>삭제하기</Text>
									</TouchableOpacity>
								</>
							) : (
								<>
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
											dispatch(
												modalSliceActions.setOpenModal({
													modalTitle: '삭제하시겠습니까?',
													modalLeft: true,
													modalFunction: goRemove,
												}),
											);
										}}>
										<Text>삭제하기</Text>
									</TouchableOpacity>
								</>
							)}

							<TouchableOpacity
								style={{height: 60}}
								onPress={() => {
									setVisible(false);
								}}>
								<Text>나가기 TODO 나가는방식,띄우는위치</Text>
							</TouchableOpacity>
						</VStack>
					</InfoModalContainer>
				</ModalContainer>
			</Modal>
		</Box>
	);
};

const ModalContainer = styled.Pressable`
	flex: 1;
	background-color: rgba(0, 0, 0, 0.4);
`;
const InfoModalContainer = styled.View`
	flex: 0.5;
	position: absolute;
	bottom: 0px;
	background-color: gray;
	width: 100%;
`;
export default memo(InfoView);
