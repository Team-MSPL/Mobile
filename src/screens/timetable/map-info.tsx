import moment from 'moment';
import {useEffect, useRef, useState} from 'react';
import {
	Image,
	Linking,
	Modal,
	NativeScrollEvent,
	NativeSyntheticEvent,
	Platform,
	Pressable,
	TouchableOpacity,
	View,
} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {colors} from '../../utill/colors';
import {
	FlexWrap,
	HStack,
	MainContainer,
	PretendardSemiBoldText,
	PretendardVariableText,
	TagContainer,
	VStack,
} from '../../utill/layout/layout';
import {DashLine, DashLineContainer, PresetButton} from './preset';
import {SVGPlus, SvgApple, SvgPlace} from '../../utill/svg/svg';
import {DayTouchablOpacity, MarkerContainer} from './preset-detail';
import {WhiteContainer} from '../enroll-info/final-check';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import PrimaryButton from '../../utill/component/primary-button';
import InfoView from '../../utill/component/timetable/info-view';
import CustomButton from '../../utill/component/custom-button';
import UseDatePicker from '../../utill/hooks/useDatePicker';
import {SelectContainer} from '../enroll-info/select-day';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import {ButtonContainer, SVGContainer} from '../enroll-info/select-multi';
import {usePosition} from '../../utill/hooks/usePosition';

export default function MapInfo({navigation, modify, setModify, goSave}: any) {
	const {timetable, day, transit} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const [select, setSelect] = useState(0);
	const a = useRef(false);
	const viewRef = useRef({
		...timetable[0][0],
		endHours: Math.floor((((timetable[0][0].y ?? 0) + timetable[0][0].takenTime / 30) * 30 + 360) / 60),
		endMinute: (((timetable[0][0].y ?? 0) + timetable[0][0].takenTime / 30) * 30 + 360) % 60,
		index: 0,
		idx: 0,
	});
	const [selectPinIndex, setSecletPinIndex] = useState(-1);
	const scrollRef = useRef();
	const change = (idx: number) => {
		setSelect(idx);
		// let totalScroll = 0;
		// for (let i = 0; i < idx; i++) {
		// 	totalScroll += timetable[i].length;
		// }
		// scrollRef.current.scrollTo({y: totalScroll * 76 + idx * 16.71 + idx * 6, animate: true});
	};
	const [visible, setVisible] = useState(true);
	const moveRegion = async (e: number) => {
		navigation.navigate('CourseDetail', {value: timetable[select][e]});
		// setSecletPinIndex(e);
		// mapRef.current?.animateCamera(
		// 	{
		// 		center: {
		// 			latitude: timetable[select][e].lat,
		// 			longitude: timetable[select][e].lng,
		// 		},
		// 	},
		// 	{duration: 1000},
		// );
	};
	const excludeNames = ['점심 추천', '저녁 추천', '숙소 추천'];
	const goNavigation = async (e: number) => {
		let navigationIndex = e + 1;
		let transitCondition = transit == 1 ? 'public' : 'car';
		if (excludeNames.includes(timetable[select][e + 1].name)) navigationIndex += 1;
		const url = `nmap://route/${transitCondition}?slat=${timetable[select][e].lat}&slng=${timetable[select][e].lng}&sname=${timetable[select][e].name}&dlat=${timetable[select][navigationIndex].lat}&dlng=${timetable[select][navigationIndex].lng}&dname=${timetable[select][navigationIndex].name}&appname=다님`;
		const supported = await Linking.canOpenURL(url);
		if (supported) {
			await Linking.openURL(url);
		} else {
			if (Platform.OS === 'android') {
				const GOOGLE_PLAY_STORE_LINK = 'market://details?id=com.nhn.android.nmap';
				await Linking.openURL(GOOGLE_PLAY_STORE_LINK);
			} else {
				const APPLE_APP_STORE_LINK = 'http://itunes.apple.com/app/id311867728?mt=8';
				await Linking.openURL(APPLE_APP_STORE_LINK);
			}
		}
	};
	const mapRef = useRef<MapView>(null);

	const polylineCoordinates = timetable[select]
		.map((item, value) => {
			if (item.name != '점심 추천' && item.name != '저녁 추천' && item.name != '숙소 추천') {
				return {latitude: item.lat, longitude: item.lng};
			}
			return null;
		})
		.filter(items => items !== null);
	let count = 0;
	const markers = timetable[select]
		.map((value, idx) => {
			if (value.name != '점심 추천' && value.name != '저녁 추천' && value.name !== '숙소 추천') {
				count += 1;
				return (
					<Marker
						key={`marker_${idx}`}
						coordinate={{latitude: value.lat, longitude: value.lng}}
						title={value.name}
						centerOffset={Platform.OS == 'android' ? {x: 0, y: 0} : {x: 0, y: -20}}
						anchor={{x: 0.5, y: 0.5}}
						style={{zIndex: 4}}>
						<MarkerContainer key={idx}>
							<PretendardSemiBoldText size={13} lineHeight={19} color={colors.backgroundWhite}>
								{count}
							</PretendardSemiBoldText>
						</MarkerContainer>
					</Marker>
				);
			}
			return null;
		})
		.filter(marker => marker !== null);
	const polylines = timetable[select].map((val, ind) => (
		<Polyline
			key={`polyline_${ind}`}
			coordinates={polylineCoordinates}
			strokeColor={colors.PointYellow}
			strokeWidth={2} // You can change the width of the line here
		/>
	));

	const minLatitude = Math.min(...polylineCoordinates.map(marker => marker.latitude));
	const maxLatitude = Math.max(...polylineCoordinates.map(marker => marker.latitude));
	const minLongitude = Math.min(...polylineCoordinates.map(marker => marker.longitude));
	const maxLongitude = Math.max(...polylineCoordinates.map(marker => marker.longitude));

	// 경계 상자의 중심 좌표 계산
	const centerLatitude = (maxLatitude + minLatitude) / 2;
	const centerLongitude = (maxLongitude + minLongitude) / 2;

	// 경계 상자의 너비와 높이 계산
	const deltaLatitude = maxLatitude - minLatitude;
	const deltaLongitude = maxLongitude - minLongitude;

	// 너비와 높이 중 큰 값을 기준으로 줌 레벨 계산
	const maxDelta = Math.max(deltaLatitude, deltaLongitude);
	const zoomLevel = Math.log2(360 / maxDelta) + 1;
	const categoryTitle = ['관광지', '식당', '', '카페', '숙소', '필수여행지'];
	const noMove = timetable[select].filter(item => !item.name.includes('추천'));
	useEffect(() => {
		// if (route.params.mapIndex != -1 && timetable[route.params.mapIndex].length != 0) {
		// 	setSelect(route.params.mapIndex);
		// 	setVisible(false);
		// } else {
		for (let i = 0; i < timetable.length; i++) {
			if (timetable[i].length != 0) {
				a.current = true;
				setVisible(false);
				setSelect(i);
				break;
			}
		}
		//}
		// if (polylineCoordinates.length == 0) {
		// 	dispatch(
		// 		modalSliceActions.setOpenModal({
		// 			modalTitle: '보여질 정보가 없습니다.',
		// 			modalFunction: goBack,
		// 		}),
		// 	);
		// }
		console.log('예에에에에ㅔ', polylineCoordinates.length);
	}, []);
	const goRemove = () => {
		const a = timetable.map(item => item.filter(value => value.id != viewRef.current.id));
		dispatch(travelSliceActions.changeTimetable(a));
	};
	const goBack = () => {
		navigation.goBack();
	};
	const [qw, seA] = useState(0);
	const goConfirm = (timeData: {hour: string; ampm: string; minute: string}) => {
		if (timeView.value == 'left') {
			viewRef.current.y =
				(parseInt(timeData.hour) + (timeData.ampm == '오후' ? 12 : 0) - 6) * 2 + parseInt(timeData.minute) / 30;
		} else {
			viewRef.current.endHours = parseInt(timeData.hour) + (timeData.ampm == '오후' ? 12 : 0);
			viewRef.current.endMinute = parseInt(timeData.minute);
		}
		seA(qw + 1);
		return true;
	};

	const [saveView, setSaveView] = useState(false);
	const changeViewState = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		const state = usePosition(e);
		state != saveView && setSaveView(state);
	};
	const openModal = (index, idx) => {
		viewRef.current = {
			...timetable[index][idx],
			endHours: Math.floor(
				(((timetable[index][idx].y ?? 0) + timetable[index][idx].takenTime / 30) * 30 + 360) / 60,
			),
			endMinute: (((timetable[index][idx].y ?? 0) + timetable[index][idx].takenTime / 30) * 30 + 360) % 60,
			index: index,
			idx: idx,
		};
		timeView.status && setTimeView({status: false, value: ''});
		setVisible(true);
	};
	const [timeView, setTimeView] = useState({status: false, value: ''});
	const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

	const goModify = () => {
		setVisible(false);
		const newY = viewRef.current.y;
		const newEnd = (viewRef.current.endHours - 6) * 2 + viewRef.current.endMinute / 30;
		console.log(newY, newEnd);
		if (newEnd >= 49) {
			dispatch(modalSliceActions.setOpenModal({modalTitle: '시간을 다시 설정해주세요.'}));
		} else {
			let copy = [...timetable[viewRef.current.index]];
			let changeCopy = [...timetable];
			let changeFlag = null;
			console.log(copy);
			//부터 가능
			for (let i = 0; i < copy.length; i++) {
				if (
					((newY <= copy[i]?.y && newEnd > copy[i]?.y) ||
						(newY <= copy[i]?.y + copy[i].takenTime / 30 - 1 &&
							newEnd > copy[i]?.y + copy[i].takenTime / 30 - 1)) &&
					copy[i].id != viewRef.current.id
				) {
					changeFlag = copy[i];
					break;
				}
			}
			let changeInputIndex = copy.findIndex(item => item.y >= newY);
			changeInputIndex = changeInputIndex == -1 ? copy.length : changeInputIndex;
			if (changeFlag) {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: `${changeFlag.name}과 겹치는 시간입니다!`,
					}),
				);
			} else {
				let copyValue = {
					...changeCopy[viewRef.current.index][viewRef.current.idx],
					y: newY,
					x: viewRef.current.index,
					takenTime: (newEnd - newY) * 30,
				};
				let deleteCopy = [...timetable[viewRef.current.index]];
				deleteCopy.splice(viewRef.current.idx, 1);
				changeCopy[viewRef.current.index] = deleteCopy;
				let addCopy = [...changeCopy[viewRef.current.index]];
				addCopy.splice(changeInputIndex, 0, copyValue);
				changeCopy[viewRef.current.index] = addCopy;
				dispatch(travelSliceActions.changeTimetable(changeCopy));
			}
		}
	};
	const CancelModify = () => {
		setModify(false);
	};
	if (polylineCoordinates.length == 0) {
		return <MainAllContainer></MainAllContainer>;
	}
	return (
		<MainAllContainer>
			<VStack>
				{!modify &&
					timetable.map(
						(item, idx) =>
							select == idx && (
								<MapView
									key={idx}
									ref={mapRef}
									//provider={PROVIDER_GOOGLE}
									showsMyLocationButton={true}
									style={{width: '100%', height: 300}}
									showsUserLocation={true}
									region={{
										latitude: centerLatitude,
										longitude: centerLongitude,
										latitudeDelta: deltaLatitude + deltaLatitude,
										longitudeDelta: deltaLongitude + deltaLongitude,
									}}>
									{markers}
									{polylines}
								</MapView>
							),
					)}
				<BackgroundGray>
					<DayContainer horizontal={true} showsHorizontalScrollIndicator={false}>
						<FlexWrap gap={10}>
							{timetable.map(
								(item, idx) =>
									item.length != 0 && (
										<DayTouchablOpacity
											key={idx}
											select={idx === select}
											onPress={() => {
												change(idx);
											}}>
											<PretendardSemiBoldText
												size={14}
												lineHeight={19}
												color={select == idx ? colors.Gray5 : colors.Gray3}>
												{'DAY' + (idx + 1)}
											</PretendardSemiBoldText>
											{/* <DayTitle select={idx === select}>{idx + 1 + '일차'}</DayTitle>
										<DaySubTitle select={idx === select}>
											{moment(day[idx]).format('M월 D일')}({weekdays[moment(day[idx]).day()]})
										</DaySubTitle> */}
										</DayTouchablOpacity>
									),
							)}
						</FlexWrap>
					</DayContainer>
					{/* <HStack justifyContent='space-between'>
						<WhiteContainer width={widthPercentage(160)}>
							<HStack justifyContent='space-between'>
								<PretendardSemiBoldText size={14} lineHeight={16.71} color={colors.PointYellow}>
									여행지
								</PretendardSemiBoldText>
								<SVGContainer color={colors.PointYellow}>
									<SVGPlus color={colors.Primary} />
								</SVGContainer>
							</HStack>
						</WhiteContainer>
						<WhiteContainer width={widthPercentage(160)}>
							<HStack justifyContent='space-between'>
								<PretendardSemiBoldText size={14} lineHeight={16.71} color={colors.PointYellow}>
									여행지
								</PretendardSemiBoldText>
								<SVGContainer color={colors.PointYellow}>
									<SVGPlus color={colors.Primary} />
								</SVGContainer>
							</HStack>
						</WhiteContainer>
					</HStack> */}
					<DayScrollView modify={modify} ref={scrollRef} onMomentumScrollEnd={changeViewState}>
						{timetable.map(
							(value, index) =>
								value.length != 0 &&
								select == index && (
									<WhiteContainer width={widthPercentage(327)} key={index}>
										<PretendardSemiBoldText
											marginBottom={heightPercentage(10)}
											size={14}
											lineHeight={16.71}
											color={colors.Gray5}>
											{moment(day[index]).format('YY.MM.DD')} (
											{weekdays[moment(day[index]).day()]})
										</PretendardSemiBoldText>
										{value.map((item, idx) =>
											!excludeNames.includes(item.name) ? (
												<HStack gap={widthPercentage(10)} key={idx}>
													<DashLineContainer justifyContent='start'>
														<MarkerContainer>
															<PretendardSemiBoldText
																size={13}
																lineHeight={19}
																color={colors.backgroundWhite}>
																{idx + 1}
															</PretendardSemiBoldText>
														</MarkerContainer>
														<DashLine
															status={
																idx == value.length - 1 ? 'end' : 'center'
															}></DashLine>
													</DashLineContainer>
													<InsideGrayContainer>
														<HStack justifyContent='space-between'>
															<VStack>
																<PretendardVariableText
																	size={12}
																	lineHeight={18}
																	color={colors.Gray2}>
																	{categoryTitle[item.category]}
																	{Math.floor(((item.y ?? 0) * 30 + 360) / 60)}:
																	{String(((item.y ?? 0) * 30 + 360) % 60).padStart(
																		2,
																		'0',
																	)}
																	~
																	{Math.floor(
																		(((item.y ?? 0) + item.takenTime / 30) * 30 +
																			360) /
																			60,
																	)}
																	:
																	{String(
																		(((item.y ?? 0) + item.takenTime / 30) * 30 +
																			360) %
																			60,
																	).padStart(2, '0')}
																</PretendardVariableText>
																<PretendardSemiBoldText
																	size={14}
																	lineHeight={18.9}
																	color={colors.Gray5}>
																	{item.name}
																</PretendardSemiBoldText>
															</VStack>
															{modify ? (
																<Pressable
																	onPress={() => {
																		openModal(index, idx);
																	}}>
																	<PretendardSemiBoldText
																		size={14}
																		lineHeight={18.9}
																		color={colors.PointYellow}>
																		편집
																	</PretendardSemiBoldText>
																</Pressable>
															) : (
																idx != 0 && (
																	<PrimaryButton
																		onPress={() => {
																			goNavigation(index);
																		}}
																		label='길찾기'
																		textSize={12}
																		lineHeight={18}
																		width={widthPercentage(52)}
																		height={heightPercentage(22)}
																		backgroundColor={colors.Primary}
																		textColor={colors.Gray5}></PrimaryButton>
																)
															)}
														</HStack>
													</InsideGrayContainer>
												</HStack>
											) : (
												<HStack key={idx}>
													<DashLineContainer justifyContent='start'>
														<MarkerContainer
															backgroundColor={
																item.category == 4 ? colors.PointGreen1 : undefined
															}>
															<PretendardSemiBoldText
																size={13}
																lineHeight={19}
																color={colors.backgroundWhite}>
																{idx + 1}
															</PretendardSemiBoldText>
														</MarkerContainer>
														<DashLine
															status={
																idx == value.length - 1 ? 'end' : 'center'
															}></DashLine>
													</DashLineContainer>
													<InsideGrayContainer backgroundColor={colors.backgroundWhite}>
														<InfoView
															navigation={navigation}
															test={item}
															index={idx}
															idx={index}
															modify={false}
															CancelModify={CancelModify}
															//modify TODO 바꾸기
														/>
													</InsideGrayContainer>
												</HStack>
											),
										)}
									</WhiteContainer>
								),
						)}
						{/* {timetable[select].map((value, index) => {
							if (!excludeNames.includes(value.name)) {
								return (
									<DaysContainer key={index}>
										<DayElementContainer>
											<PlaceContainer
												onPress={() => {
													moveRegion(index);
												}}>
												<VStack>
													<PlaceText>{categoryTitle[value.category]}</PlaceText>
													<DayTimeText>
														{Math.floor((value.y * 30 + 360) / 60)}:
														{String((value.y * 30 + 360) % 60).padStart(2, '0')}~
														{Math.floor(((value.y + value.takenTime / 30) * 30 + 360) / 60)}
														:
														{String(
															((value.y + value.takenTime / 30) * 30 + 360) % 60,
														).padStart(2, '0')}
													</DayTimeText>
												</VStack>
												<PlaceText>{value.name}</PlaceText>
											</PlaceContainer>
										</DayElementContainer>
										<DayElementContainer>
											{value.id != noMove[noMove.length - 1].id && (
												<MoveContainer
													onPress={() => {
														goNavigation(index);
													}}>
													<PlaceText>이동</PlaceText>
													<DayTimeText>* 네이버 길찾기로 연결됩니다</DayTimeText>
												</MoveContainer>
											)}
										</DayElementContainer>
									</DaysContainer>
								);
							} else {
								return null; // '저녁 추천'이나 '점심 추천'인 경우 아무 것도 렌더링하지 않음
							}
						})} */}
					</DayScrollView>
					{saveView && (
						<AbsoluteButton onPress={goSave}>
							<PretendardSemiBoldText size={18} lineHeight={21.48} color={colors.Primary}>
								저장
							</PretendardSemiBoldText>
						</AbsoluteButton>
					)}
					{/* {modify && <CustomButton label='저장' onPress={() => {}}></CustomButton>} */}
				</BackgroundGray>
				<Modal
					visible={visible}
					animationType={'fade'}
					transparent={true}
					statusBarTranslucent={true}
					onRequestClose={() => setVisible(false)}>
					<ModalContainer onPress={() => setVisible(false)}>
						<InfoModalContainer>
							<HStack gap={widthPercentage(10)}>
								<PretendardSemiBoldText size={17.78} lineHeight={24} color={colors.Gray5}>
									{viewRef.current.name}
								</PretendardSemiBoldText>
								<PretendardVariableText size={13.33} lineHeight={20} color={colors.Gray2}>
									{categoryTitle[viewRef.current.category]}
								</PretendardVariableText>
							</HStack>
							<HStack justifyContent='space-between'>
								<SelectContainer
									onPress={() => {
										setTimeView({status: !timeView.status, value: 'left'});
									}}>
									<HStack justifyContent='space-between'>
										<PretendardSemiBoldText size={12} lineHeight={14.32} color={colors.Gray5}>
											{Math.floor(((viewRef.current.y ?? 0) * 30 + 360) / 60) < 12 ? 'AM' : 'PM'}
										</PretendardSemiBoldText>
										<PretendardSemiBoldText size={12} lineHeight={14.32} color={colors.Gray5}>
											{Math.floor(((viewRef.current.y ?? 0) * 30 + 360) / 60)}
										</PretendardSemiBoldText>
										<PretendardSemiBoldText size={12} lineHeight={14.32} color={colors.Gray5}>
											:
										</PretendardSemiBoldText>
										<PretendardSemiBoldText size={12} lineHeight={14.32} color={colors.Gray5}>
											{String(((viewRef.current.y ?? 0) * 30 + 360) % 60).padStart(2, '0')}
										</PretendardSemiBoldText>
									</HStack>
								</SelectContainer>
								<PretendardSemiBoldText size={12} lineHeight={14.32} color={colors.Gray5}>
									~
								</PretendardSemiBoldText>
								<SelectContainer
									onPress={() => {
										setTimeView({status: !timeView.status, value: 'right'});
									}}>
									<HStack justifyContent='space-between'>
										<PretendardSemiBoldText size={12} lineHeight={14.32} color={colors.Gray5}>
											{viewRef.current.endHours < 12 ? 'AM' : 'PM'}
										</PretendardSemiBoldText>
										<PretendardSemiBoldText size={12} lineHeight={14.32} color={colors.Gray5}>
											{viewRef.current.endHours}
											{/* {viewRef.current.endHours < 12
												? viewRef.current.endHours
												: viewRef.current.endHours - 12} */}
										</PretendardSemiBoldText>
										<PretendardSemiBoldText size={12} lineHeight={14.32} color={colors.Gray5}>
											:
										</PretendardSemiBoldText>
										<PretendardSemiBoldText size={12} lineHeight={14.32} color={colors.Gray5}>
											{String(viewRef.current.endMinute).padStart(2, '0')}
										</PretendardSemiBoldText>
									</HStack>
								</SelectContainer>
							</HStack>
							<TimePickerContainer alignSelf={timeView.value == 'right' ? 'flex-end' : 'flex-start'}>
								<UseDatePicker
									goConfirm={goConfirm}
									minuteData={
										timeView.value == 'right'
											? viewRef.current.endMinute / 30
											: Math.floor(((viewRef.current.y ?? 0) * 30 + 360) % 60) / 30
									}
									ampmData={
										timeView.value == 'right'
											? Math.floor(
													(((viewRef.current.y ?? 0) + viewRef.current.takenTime / 30) * 30 +
														360) /
														60,
											  ) < 12
												? 0
												: 1
											: Math.floor(((viewRef.current.y ?? 0) * 30 + 360) / 60) < 12
											? 0
											: 1
									}
									hourData={
										timeView.value == 'right'
											? viewRef.current.endHours < 12
												? viewRef.current.endHours
												: viewRef.current.endHours - 12
											: Math.floor(((viewRef.current.y ?? 0) * 30 + 360) / 60) < 12
											? Math.floor(((viewRef.current.y ?? 0) * 30 + 360) / 60)
											: Math.floor(((viewRef.current.y ?? 0) * 30 + 360) / 60) - 12
									}
									visible={timeView.status}
									setVisible={setVisible}></UseDatePicker>
							</TimePickerContainer>
							<HStack justifyContent='space-between'>
								<ButtonsContainer
									backgroundColor={colors.Gray1}
									onPress={() => {
										setVisible(false);
										dispatch(
											modalSliceActions.setOpenModal({
												modalTitle: `'${viewRef.current.name}' 일정을 삭제할까요?`,
												modalSubTitle: '추천받은 일정을 삭제하면 되돌릴 수 없어요.',
												modalFunction: goRemove,
												modalBottomText: '취소',
												modalTopText: '삭제할래요',
											}),
										);
									}}>
									<PretendardVariableText size={16} lineHeight={19} color={colors.PointGreen1}>
										삭제
									</PretendardVariableText>
								</ButtonsContainer>
								<ButtonsContainer backgroundColor='#D5FF734D' onPress={goModify}>
									<PretendardVariableText size={16} lineHeight={19} color={colors.Gray5}>
										저장
									</PretendardVariableText>
								</ButtonsContainer>
							</HStack>
						</InfoModalContainer>
					</ModalContainer>
				</Modal>
				{/* <UseDatePicker
					title={flag.current == 0 ? '시작 시간' : '종료 시간'}
					goConfirm={onConfirm}
					minuteData={flag.current == 0 ? startTime.current.minute / 30 : endTime.current.minute / 30}
					ampmData={
						flag.current == 0 ? (startTime.current.hours < 12 ? 0 : 1) : endTime.current.hours < 12 ? 0 : 1
					}
					hourData={
						flag.current == 0
							? startTime.current.hours < 12
								? startTime.current.hours
								: startTime.current.hours - 12
							: endTime.current.hours < 12
							? endTime.current.hours
							: endTime.current.hours - 12
					}
					visible={visible}
					setVisible={setVisible}></UseDatePicker> */}
			</VStack>
		</MainAllContainer>
	);
}
const AbsoluteButton = styled.TouchableOpacity`
	width: ${widthPercentage(327)}px;
	height: ${heightPercentage(60)}px;
	border-radius: 8px;
	background-color: ${colors.Gray5};
	align-items: center;
	justify-content: center;
	position: absolute;
	bottom: ${heightPercentage(50)}px;
	align-self: center;
`;
const ButtonsContainer = styled.TouchableOpacity<{backgroundColor: string}>`
	width: ${widthPercentage(160)}px;
	height: ${heightPercentage(50)}px;
	border-radius: 8px;
	background-color: ${props => props.backgroundColor};
	align-items: center;
	justify-content: center;
`;
const TimePickerContainer = styled.View<{alignSelf: string}>`
	align-self: ${props => props.alignSelf};
	height: ${heightPercentage(140)}px;
`;
const InfoModalContainer = styled.View`
	flex: 0.5;
	position: absolute;
	bottom: 0px;
	background-color: ${colors.backgroundGray};
	width: ${widthPercentage(375)}px;
	height: ${heightPercentage(309)}px;
	border-top-right-radius: 16px;
	border-top-left-radius: 16px;
	padding: ${heightPercentage(23.22)}px ${widthPercentage(24)}px;
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
const mapColor = ['black', 'blue', 'red', 'orange', 'pink'];
export const DayContainer = styled.ScrollView``;
const PlaceText = styled.Text`
	font-size: 16px;
	font-weight: bold;
	color: black;
`;
export const DayButton = styled(PresetButton)`
	width: 130px;
	height: 60px;
	border-radius: 15px;
	padding: 10px;
	background-color: ${props => (props.select ? colors.selectButton : colors.normalButton)};
	align-items: center;
	justify-content: center;
`;

export const DayTitle = styled(PlaceText)<{select: boolean}>`
	color: ${props => (props.select ? 'white' : colors.selectButton)};
`;
export const DaySubTitle = styled(DayTitle)`
	font-weight: 500;
	font-size: 12px;
`;
export const DayElementContainer = styled.View`
	border-bottom-width: 1px;
	border-bottom-color: ${colors.regionNormal};
`;
const DaysContainer = styled.View`
	padding: 2%;
`;

const MainAllContainer = styled(MainContainer).attrs({as: View})`
	flex: 1;
`;

const DayScrollView = styled.ScrollView<{modify: boolean}>`
	width: ${widthPercentage(375)}px;
	height: ${props => (props.modify ? heightPercentage(600) : heightPercentage(300))}px;
`;

const MoveContainer = styled.TouchableOpacity`
	width: 100%;
	padding: 5%;
	align-items: center;
	justify-content: space-around;
	flex-direction: row;
`;
const PlaceContainer = styled(MoveContainer)`
	flex-direction: row;
	justify-content: space-between;
`;
const DayTimeText = styled.Text`
	font-size: 14px;
	color: ${colors.selectButton};
`;
export const MarkerText = styled.Text`
	position: absolute;
	font-size: 15px;
	font-weight: bold;
	color: black;
	z-index: 1;
	left: 20px;
	bottom: 10px;
`;

const BackgroundGray = styled.View`
	width: ${widthPercentage(375)}px;
	border-top-right-radius: 10px;
	border-top-left-radius: 10px;
	background-color: ${colors.backgroundGray};
	top: -10px;
	padding: ${heightPercentage(18)}px ${widthPercentage(23)}px;
`;
const InsideGrayContainer = styled.View<{backgroundColor?: string}>`
	width: ${widthPercentage(282)}px;
	height: ${heightPercentage(66)}px;
	border-radius: 8px;
	background-color: ${props => props.backgroundColor ?? colors.backgroundGray};
	justify-content: center;
	padding-horizontal: ${widthPercentage(10)}px;
	margin-bottom: ${heightPercentage(10)}px;
`;
