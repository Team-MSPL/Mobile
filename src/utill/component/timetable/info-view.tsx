import {GOOGLE_API_KEY} from '@env';
import {memo, useEffect, useMemo, useRef, useState} from 'react';
import {Dimensions, Modal, Animated, PanResponder, Vibration, View} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {modalSliceActions} from '../../../redux/modal/modalSlice';
import {TimetableType, travelSliceActions} from '../../../redux/travel-info/travel.slice';
import {colors} from '../../colors';
import {useDistance} from '../../hooks/useDistance';
import {VStack, devicesWidth} from '../../layout/layout';
import {SvgInfos} from '../../svg/svg';
import PrimaryButton from '../primary-button';
import {heightPercentage, widthPercentage} from '../../layout/responsive-size';
const InfoView = ({
	navigation,
	test,
	index,
	idx,
	modify,
	viewDayIndex,
	panHandler,
	modifyState,
	setmodifyState,
	setModifyRef,
	setStop,
	CancelModify,
}: any) => {
	const {timetable, editMode, makeMode, nDay} = useAppSelector(state => state.travelSlice);
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
		const a = timetable.map(item => item.filter(value => value.id != indexRef.current.value?.id));
		dispatch(travelSliceActions.changeTimetable(a));
		setVisible(false);
	};
	const accommodationRecommend = (e: {value: any; index: number; idx: number}) => {
		CancelModify(false);
		if (timetable[e.idx].length < 2) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '추천이 불가합니다.',
					modalSubTitle: '앞,뒤 관광지를 바탕으로 추천을 해드려요\n관광지를 추가한 후 시도해주세요',
				}),
			);
		} else {
			let lat = 0;
			let lng = 0;
			let goCheck = true;
			if (e.index == 0) {
				if (timetable[e.idx][e.index + 1].name.includes('추천')) {
					goCheck = false;
				} else {
					lat = timetable[e.idx][e.index + 1].lat;
					lng = timetable[e.idx][e.index + 1].lng;
				}
			} else {
				if (timetable[e.idx][e.index - 1].name.includes('추천')) {
					goCheck = false;
				} else {
					lat = timetable[e.idx][e.index - 1].lat;
					lng = timetable[e.idx][e.index - 1].lng;
				}
			}
			// e.index != 0
			// 	? ((lat = timetable[e.idx][e.index - 1].lat), (lng = timetable[e.idx][e.index - 1].lng))
			// 	: ((lat = timetable[e.idx][e.index + 1].lat), (lng = timetable[e.idx][e.index + 1].lng));
			if (goCheck) {
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
					status: e.index != 0 ? timetable[e.idx][e.index - 1] : timetable[e.idx][e.index + 1],
				});
			} else {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '추천이 불가합니다.',
						modalSubTitle: '앞,뒤 관광지를 바탕으로 추천을 해드려요\n관광지를 추가한 후 시도해주세요',
					}),
				);
			}
		}
	};
	const restaurantRecommend = (e: {value: any; index: number; idx: number}) => {
		// let copy = timetable[e.idx];
		// let temp = copy.filter(
		// 	item => item.name != '숙소 추천' && item.name != '점심 추천' && item.name != '저녁 추천',
		// );
		// let whereItem = temp.find(q => q.id == timetable[e.idx][e.index].id);
		// console.log(timetable[e.idx][e.index].id, temp);
		// if (timetable[e.idx].length == 0) {
		// 	dispatch(
		// 		modalSliceActions.setOpenModal({
		// 			modalTitle: '참고할게 부족해서 추천이 불가합니다.',
		// 		}),
		// 	);
		// } else {
		CancelModify(false);
		let lat = 0;
		let lng = 0;
		let radius = 2000;
		let status = timetable[e.idx][e.index - 1];
		let goCheck = true;
		if (timetable[e.idx].length == 1) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '추천이 불가합니다.',
					modalSubTitle: '앞,뒤 관광지를 바탕으로 추천을 해드려요\n관광지를 추가한 후 시도해주세요',
				}),
			);
		} else {
			if (e.index == timetable[e.idx].length - 1) {
				if (timetable[e.idx][timetable[e.idx].length - 2].name.includes('추천')) {
					goCheck = false;
				} else {
					lat = timetable[e.idx][timetable[e.idx].length - 2].lat;
					lng = timetable[e.idx][timetable[e.idx].length - 2].lng;
					status = timetable[e.idx][timetable[e.idx].length - 2];
				}
			} else if (e.index == 0) {
				if (timetable[e.idx][1].name.includes('추천')) {
					goCheck = false;
				} else {
					lat = timetable[e.idx][1].lat;
					lng = timetable[e.idx][1].lng;
					status = timetable[e.idx][1];
				}
			} else {
				const departure = {lat: timetable[e.idx][e.index - 1].lat, lng: timetable[e.idx][e.index - 1].lng};
				const arrival = {lat: timetable[e.idx][e.index + 1].lat, lng: timetable[e.idx][e.index + 1].lng};
				const distance = Math.ceil(useDistance({departure: departure, arrival: arrival}));
				lat = (timetable[e.idx][e.index - 1].lat + timetable[e.idx][e.index + 1].lat) / 2;
				lng = (timetable[e.idx][e.index - 1].lng + timetable[e.idx][e.index + 1].lng) / 2;
				radius = distance >= 20 ? 20000 : distance == 0 ? 2000 : distance * 1000;
				if (
					timetable[e.idx][e.index - 1].name.includes('추천') &&
					timetable[e.idx][e.index + 1].name.includes('추천')
				) {
					goCheck = false;
				} else if (timetable[e.idx][e.index - 1].name.includes('추천')) {
					status = timetable[e.idx][e.index + 1];
				} else if (timetable[e.idx][e.index + 1].name.includes('추천')) {
					status = timetable[e.idx][e.index - 1];
				}
				//status = timetable[e.idx][e.index - 1];
			}
			if (goCheck) {
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
					backupLat: timetable[e.idx][e.index - 1]?.lat ?? 0,
					backupLng: timetable[e.idx][e.index - 1]?.lng ?? 0,
					status: status,
				});
			} else {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '추천이 불가합니다.',
						modalSubTitle: '앞,뒤 관광지를 바탕으로 추천을 해드려요\n관광지를 추가한 후 시도해주세요',
					}),
				);
			}
		}
		// }
	};

	const categortColors = ['#7AA1DC', '#F08676', 'green', 'pink', '#8DE7C6', '#ECC369'];
	const selectCategortColors = ['#89C7FD', '#E78D9F', 'green', 'pink', '#86D0C2', 'gray'];
	const nowValue = useRef({state: true, day: 0, index: 0, value: {}});
	const pan = useRef(new Animated.ValueXY()).current;
	const beforeAddress = useRef({x: 0, y: 0});
	const panResponder = useMemo(
		() =>
			PanResponder.create({
				onMoveShouldSetPanResponder: () => true,
				onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}], {useNativeDriver: false}),
				onPanResponderRelease: () => {
					// setStop(true);
					let moveX = Math.round(locationRef.current.x / ((WINDOW_WIDTH - 24) * 0.18));
					let moveY = Math.round(locationRef.current.y / (WINDOW_HEIGHT / 20));
					let afterX = (WINDOW_WIDTH - 24) * 0.18 * moveX;
					let afterY = (WINDOW_HEIGHT / 20) * moveY;
					testRef.current?.measureInWindow((x, y, width, height) => {
						try {
							let changeDay = nowValue.current.value.x + moveX;
							let copy = [...timetable[changeDay]];
							let newY = nowValue.current.value.y + moveY;
							let newEnd = nowValue.current.value.takenTime / 30 + nowValue.current.value?.y + moveY;
							let changeCopy = [...timetable];
							let changeFlag = null;
							//부터 가능
							for (let i = 0; i < copy.length; i++) {
								if (
									((newY <= copy[i]?.y && newEnd > copy[i]?.y) ||
										(newY <= copy[i]?.y + copy[i].takenTime / 30 - 1 &&
											newEnd > copy[i]?.y + copy[i].takenTime / 30 - 1)) &&
									copy[i].id != nowValue.current.value.id
								) {
									changeFlag = copy[i];
									break;
								}
							}
							let changeInputIndex = copy.findIndex(item => item.y >= newY);
							changeInputIndex =
								changeInputIndex == -1
									? copy.length
									: changeInputIndex == 0
									? changeInputIndex
									: changeInputIndex - (changeDay == nowValue.current.day ? 1 : 0);
							if (x - WINDOW_WIDTH * 0.1 < 0 || x + width > WINDOW_WIDTH || newY < 0 || newEnd > 48) {
								pan.setOffset({
									x: beforeAddress.current.x,
									y: beforeAddress.current.y,
								});
								pan.setValue({
									x: 0,
									y: 0,
								});
							} else {
								pan.setOffset({
									x: afterX,
									y: afterY,
								});
								pan.setValue({
									x: 0,
									y: 0,
								});
								beforeAddress.current = {
									x: afterX,
									y: afterY,
								};
								//!changeFlag
								if (!changeFlag) {
									let copyValue = {
										...changeCopy[nowValue.current.value.x][nowValue.current.index],
										y: newY,
										x: changeDay,
										takenTime: (newEnd - newY) * 30,
									};
									let deleteCopy = [...timetable[nowValue.current.day]];
									deleteCopy.splice(nowValue.current.index, 1);
									changeCopy[nowValue.current.day] = deleteCopy;
									let addCopy = [...changeCopy[changeDay]];
									addCopy.splice(changeInputIndex, 0, copyValue);
									changeCopy[changeDay] = addCopy;
									// setModifyRef({
									// 	x: Math.round(locationRef.current.x / ((WINDOW_WIDTH - 24) * 0.18)),
									// 	y: Math.round(locationRef.current.y / (WINDOW_HEIGHT / 20)),
									// 	timetable: changeCopy,
									// 	status: true,
									// });
								} else {
									// setModifyRef({
									// 	x: 0,
									// 	y: 0,
									// 	timetable: [],
									// 	status: false,
									// });
								}
							}
						} catch (e) {
							pan.setOffset({
								x: beforeAddress.current.x,
								y: beforeAddress.current.y,
							});
							pan.setValue({
								x: 0,
								y: 0,
							});
						}
					});
				},
			}),
		[timetable],
	);
	const locationRef = useRef({x: 0, y: 0});
	pan.addListener(async e => {
		locationRef.current = {x: e.x, y: e.y};
	});
	// useEffect(() => {
	// 	!modifyState.state && pan.setOffset({x: 0, y: 0});
	// }, [modifyState]);

	const testRef = useRef<View>();
	return (
		<PrimaryButton
			label={test.name}
			disabled={modify}
			backgroundColor={colors.Primary}
			textColor={colors.Gray5}
			onPress={() => {
				test.category == 1
					? restaurantRecommend({
							value: test,
							index: index,
							idx: idx,
					  })
					: accommodationRecommend({
							value: test,
							index: index,
							idx: idx,
					  });
			}}
			marginBottom={heightPercentage(10)}
			width={widthPercentage(282)}
			height={heightPercentage(42)}></PrimaryButton>
		// <InfoViewContainter>
		// 	<SpacerView />
		// 	{timetable.map(
		// 		(item, idx) =>
		// 			idx >= viewDayIndex &&
		// 			idx <= viewDayIndex + 4 && (
		// 				<InfoVStack key={idx}>
		// 					{item.map((value, index) => {
		// 						return modifyState.state && modifyState.day == idx && modifyState.index == index ? (
		// 							<Animated.View
		// 								key={index}
		// 								onTouchStart={() => {
		// 									setStop(false);
		// 								}}
		// 								style={{
		// 									width: '100%',
		// 									position: 'absolute',
		// 									zIndex: 100,
		// 									transform: [{translateX: pan.x}, {translateY: pan.y}],
		// 								}}
		// 								{...panResponder.panHandlers}>
		// 								<InfoViews
		// 									ref={testRef}
		// 									backgroundColor={
		// 										(value.category == 4 || value.category == 1) &&
		// 										!value.name.includes('추천')
		// 											? selectCategortColors[value.category]
		// 											: categortColors[value.category]
		// 									}
		// 									height={(WINDOW_HEIGHT / 20) * Math.ceil(value.takenTime / 30)}
		// 									top={(WINDOW_HEIGHT / 20) * (value.y ?? 1)}
		// 									state={false}
		// 									key={index}>
		// 									<InfoText>{value.name}</InfoText>

		// 									{value.photo != '' && (
		// 										<InfoImage source={{uri: `${value.photo}&key=${GOOGLE_API_KEY}`}} />
		// 									)}
		// 								</InfoViews>
		// 							</Animated.View>
		// 						) : (
		// 							<InfoPressable
		// 								backgroundColor={
		// 									(value.category == 4 || value.category == 1) && !value.name.includes('추천')
		// 										? selectCategortColors[value.category]
		// 										: categortColors[value.category]
		// 								}
		// 								height={(WINDOW_HEIGHT / 20) * Math.ceil(value.takenTime / 30)}
		// 								top={(WINDOW_HEIGHT / 20) * (value.y ?? 1)}
		// 								state={modifyState.state}
		// 								key={index}
		// 								onLongPress={() => {
		// 									if (
		// 										!(
		// 											value.name == '점심 추천' ||
		// 											value.name == '저녁 추천' ||
		// 											value.name == '숙소 추천'
		// 										)
		// 									) {
		// 										if (!modifyState.state) {
		// 											nowValue.current = {
		// 												state: true,
		// 												day: idx,
		// 												index: index,
		// 												value: value,
		// 											};
		// 											setmodifyState({state: true, day: idx, index: index, value: value});
		// 											Vibration.vibrate(100);
		// 										}
		// 									}
		// 								}}
		// 								onPress={() => {
		// 									if (!modifyState.state) {
		// 										indexRef.current = {
		// 											value: value,
		// 											index: index,
		// 											idx: idx,
		// 											category: value.category,
		// 											flag:
		// 												value.name == '점심 추천' ||
		// 												value.name == '저녁 추천' ||
		// 												value.name == '숙소 추천'
		// 													? true
		// 													: false,
		// 										};
		// 										if (makeMode == 'share') {
		// 											value.name == '점심 추천' ||
		// 											value.name == '저녁 추천' ||
		// 											value.name == '숙소 추천'
		// 												? () => {}
		// 												: viewDetail(indexRef.current);
		// 										} else {
		// 											setVisible(true);
		// 										}
		// 									}
		// 								}}>
		// 								<InfoText>{value.name}</InfoText>

		// 								{value.photo != '' && (
		// 									<InfoImage source={{uri: `${value.photo}&key=${GOOGLE_API_KEY}`}} />
		// 								)}
		// 							</InfoPressable>
		// 						);
		// 					})}
		// 				</InfoVStack>
		// 			),
		// 	)}
		// 	<Modal
		// 		visible={visible}
		// 		animationType={'fade'}
		// 		transparent={true}
		// 		statusBarTranslucent={true}
		// 		onRequestClose={() => setVisible(false)}>
		// 		<ModalContainer onPress={() => setVisible(false)}>
		// 			<InfoModalContainer>
		// 				{indexRef.current.flag ? (
		// 					<>
		// 						<ModalElementContainer
		// 							onPress={() => {
		// 								indexRef.current.category == 1
		// 									? restaurantRecommend({
		// 											value: indexRef.current.value,
		// 											index: indexRef.current.index,
		// 											idx: indexRef.current.idx,
		// 									  })
		// 									: accommodationRecommend({
		// 											value: indexRef.current.value,
		// 											index: indexRef.current.index,
		// 											idx: indexRef.current.idx,
		// 									  });
		// 								setVisible(false);
		// 							}}>
		// 							<ModalIconContainer>
		// 								<DeleteContainer name={'like2'} size={20} color={'black'} />
		// 							</ModalIconContainer>
		// 							<ModalText>추천받기</ModalText>
		// 						</ModalElementContainer>
		// 					</>
		// 				) : (
		// 					<>
		// 						<ModalElementContainer
		// 							onPress={() => {
		// 								viewDetail(indexRef.current);
		// 								setVisible(false);
		// 							}}>
		// 							<ModalIconContainer>
		// 								<SvgInfos width={20} height={20} color='black' />
		// 							</ModalIconContainer>

		// 							<ModalText>정보 보기</ModalText>
		// 						</ModalElementContainer>

		// 						<ModalElementContainer
		// 							onPress={() => {
		// 								navigation.navigate('Modify', {item: indexRef.current});
		// 								setVisible(false);
		// 							}}>
		// 							<ModalIconContainer>
		// 								<DeleteContainer name={'edit'} size={20} color={'black'} />
		// 							</ModalIconContainer>
		// 							<ModalText>수정 하기</ModalText>
		// 						</ModalElementContainer>
		// 					</>
		// 				)}
		// 				<ModalElementContainer
		// 					onPress={() => {
		// 						setVisible(false),
		// 							dispatch(
		// 								modalSliceActions.setOpenModal({
		// 									modalTitle: '삭제하시겠습니까?',
		// 									modalLeft: true,
		// 									modalFunction: goRemove,
		// 								}),
		// 							);
		// 					}}>
		// 					<ModalIconContainer>
		// 						<DeleteContainer name={'delete'} size={20} color={'black'} />
		// 					</ModalIconContainer>
		// 					<ModalText>삭제하기</ModalText>
		// 				</ModalElementContainer>
		// 			</InfoModalContainer>
		// 		</ModalContainer>
		// 	</Modal>
		// </InfoViewContainter>
	);
};

const InfoVStack = styled(VStack)`
	flex: 0.18;
	align-items: center;
	padding: 0px 0px 0px 1px;
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
	background-color: ${colors.main};
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
const InfoViews = styled.View<{backgroundColor: string; height: number; top: number; state: boolean}>`
	width: 100%;
	height: ${props => props.height}px;
	top: ${props => props.top}px;
	background-color: ${props => props.backgroundColor};
	position: absolute;
	z-index: 3;
	padding: 4px;
	border-radius: ${devicesWidth * 0.01}px;
	opacity: ${props => (props.state ? 0.6 : 1)};
`;
const InfoPressable = styled.Pressable<{backgroundColor: string; height: number; top: number; state: boolean}>`
	width: 100%;
	height: ${props => props.height}px;
	top: ${props => props.top}px;
	background-color: ${props => props.backgroundColor};
	position: absolute;
	z-index: 3;
	padding: 4px;
	border-radius: ${devicesWidth * 0.01}px;
	opacity: ${props => (props.state ? 0.6 : 1)};
`;
const InfoText = styled.Text`
	font-size: ${devicesWidth * 0.036}px;
	color: white;
	font-weight: 500;
`;
const InfoImage = styled.Image`
	margin: 5px 0px 0px 0px;
	width: 100%;
	height: 50%;
`;

const QWE = styled.TouchableOpacity`
	width: 100px;
	height: 100px;
	background-color: red;
`;

export default memo(InfoView);
