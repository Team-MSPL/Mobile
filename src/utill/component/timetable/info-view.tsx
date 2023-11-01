import {GOOGLE_API_KEY} from '@env';
import {memo, useRef, useState} from 'react';
import {Image, Modal, Pressable, TouchableOpacity, View, Dimensions} from 'react-native';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {modalSliceActions} from '../../../redux/modal/modalSlice';
import {TimetableType, travelSliceActions} from '../../../redux/travel-info/travel.slice';
import {colors} from '../../colors';
import {HStack, VStack} from '../../layout/layout';
import {SvgInfos} from '../../svg/svg';
import Icon from 'react-native-vector-icons/AntDesign';
import {useDistance} from '../../hooks/useDistance';
const InfoView = ({navigation, viewDayIndex}: any) => {
	const {timetable, editMode, makeMode} = useAppSelector(state => state.travelSlice);
	const WINDOW_WIDTH = Dimensions.get('window').width;
	const WINDOW_HEIGHT = Dimensions.get('window').height;
	const dispatch = useAppDispatch();
	const DeleteContainer = styled(Icon)`
		border-radius: 5px;
	`;
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
		console.log('1');
		const a = timetable.map(item => item.filter(value => value.id != indexRef.current.value?.id));
		console.log('2');
		dispatch(travelSliceActions.changeTimetable(a));
		console.log('3');
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
			backupLat: e.index != 0 ? timetable[e.idx][e.index - 1].lat : timetable[e.idx][e.index + 1].lat,
			backupLng: e.index != 0 ? timetable[e.idx][e.index - 1].lng : timetable[e.idx][e.index + 1].lng,
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
				const departure = {lat: timetable[e.idx][e.index - 1].lat, lng: timetable[e.idx][e.index - 1].lng};
				const arrival = {lat: timetable[e.idx][e.index + 1].lat, lng: timetable[e.idx][e.index + 1].lng};
				const distance = Math.ceil(useDistance({departure: departure, arrival: arrival}));
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
				backupLat: timetable[e.idx][e.index - 1].lat,
				backupLng: timetable[e.idx][e.index - 1].lng,
			});
		}
	};
	const categortColors = ['#89C7FD', '#FFA700', 'green', 'pink', '#E0E0E0', 'gray'];
	const selectCategortColors = ['#89C7FD', '#FFE812', 'green', 'pink', '#9DFE9A', 'gray'];
	return (
		<InfoViewContainter>
			<SpacerView />
			{timetable.map(
				(item, idx) =>
					idx >= viewDayIndex &&
					idx <= viewDayIndex + 4 && (
						<InfoVStack key={idx}>
							{item.map((value, index) => {
								return (
									<InfoPressable
										backgroundColor={
											(value.category == 4 || value.category == 1) && !value.name.includes('추천')
												? selectCategortColors[value.category]
												: categortColors[value.category]
										}
										height={(WINDOW_HEIGHT / 20) * Math.ceil(value.takenTime / 30)}
										top={(WINDOW_HEIGHT / 20) * (value.y ?? 1)}
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
												setVisible(true);
											}
										}}>
										<InfoText>{value.name}</InfoText>

										{value.photo != '' && (
											<InfoImage source={{uri: `${value.photo}&key=${GOOGLE_API_KEY}`}} />
										)}
									</InfoPressable>
								);
							})}
						</InfoVStack>
					),
			)}
			<Modal
				visible={visible}
				animationType={'slide'}
				transparent={true}
				statusBarTranslucent={true}
				onRequestClose={() => setVisible(false)}>
				<ModalContainer onPress={() => setVisible(false)}>
					<InfoModalContainer>
						{indexRef.current.flag ? (
							<>
								<ModalElementContainer
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
									<ModalIconContainer>
										<DeleteContainer name={'like2'} size={20} color={'black'} />
									</ModalIconContainer>
									<ModalText>추천 받기</ModalText>
								</ModalElementContainer>
							</>
						) : (
							<>
								<ModalElementContainer
									onPress={() => {
										viewDetail(indexRef.current);
										setVisible(false);
									}}>
									<ModalIconContainer>
										<SvgInfos width={20} height={20} color='black' />
									</ModalIconContainer>

									<ModalText>정보 보기</ModalText>
								</ModalElementContainer>

								<ModalElementContainer
									onPress={() => {
										navigation.navigate('Modify', {item: indexRef.current});
										setVisible(false);
									}}>
									<ModalIconContainer>
										<DeleteContainer name={'edit'} size={20} color={'black'} />
									</ModalIconContainer>
									<ModalText>수정 하기</ModalText>
								</ModalElementContainer>
							</>
						)}
						<ModalElementContainer
							onPress={() => {
								setVisible(false),
									dispatch(
										modalSliceActions.setOpenModal({
											modalTitle: '삭제하시겠습니까?',
											modalLeft: true,
											modalFunction: goRemove,
										}),
									);
							}}>
							<ModalIconContainer>
								<DeleteContainer name={'delete'} size={20} color={'black'} />
							</ModalIconContainer>
							<ModalText>삭제 하기</ModalText>
						</ModalElementContainer>
					</InfoModalContainer>
				</ModalContainer>
			</Modal>
		</InfoViewContainter>
	);
};

const InfoVStack = styled(VStack)`
	flex: 0.18;
`;
const ModalElementContainer = styled.TouchableOpacity`
	width: 100%;
	align-items: center;
	border-bottom-width: 1px;
	border-bottom-color: ${colors.regionNormal};
	flex-direction: row;
	padding: 3%;
`;
const ModalIconContainer = styled.View`
	width: 20%;
	align-items: center;
	justify-content: center;
`;
const ModalContainer = styled.Pressable`
	flex: 1;
	background-color: rgba(0, 0, 0, 0.4);
`;
const ModalText = styled.Text`
	font-size: 18px;
	font-weight: 500;
	color: black;
`;
const InfoModalContainer = styled.View`
	flex: 0.5;
	position: absolute;
	bottom: 0px;
	background-color: white;
	width: 100%;
`;
const InfoViewContainter = styled.View`
	z-index: 3;
	flex: 1;
	flex-direction: row;
`;
const SpacerView = styled.View`
	flex: 0.1;
	z-index: 10;
	background-color: black;
`;

const InfoPressable = styled.Pressable<{backgroundColor: string; height: number; top: number}>`
	width: 100%;
	height: ${props => props.height}px;
	top: ${props => props.top}px;
	background-color: ${props => props.backgroundColor};
	position: absolute;
	z-index: 3;
	padding: 4px;
`;
const InfoText = styled.Text`
	font-size: 13px;
	color: black;
`;
const InfoImage = styled.Image`
	margin: 5px 0px 0px 0px;
	width: 100%;
	height: 50%;
`;
export default memo(InfoView);
