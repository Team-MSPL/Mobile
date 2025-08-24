import moment from 'moment';
import {JSXElementConstructor, ReactElement, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Linking, Modal, NativeScrollEvent, NativeSyntheticEvent, Platform, Pressable, View} from 'react-native';
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
	VStack,
} from '../../utill/layout/layout';
import {DayTouchablOpacity, MarginContainer, MarkerContainer} from './preset-detail';
import {WhiteContainer} from '../enroll-info/final-check';
import {fontPercentage, heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';

import UseDatePicker from '../../utill/hooks/useDatePicker';
import {SelectContainer} from '../enroll-info/select-day';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import {usePosition} from '../../utill/hooks/usePosition';
import {Dropdown, DropdownElement, SVGContainer} from '../enroll-info/select-multi';
import {SVGPlus, SVGRightAdd, SvgPolygon, SvgCheck, SVGPencil} from '../../utill/svg/svg';
import {useViewPager} from '../../utill/hooks/useViewPager';
import ViewPager from '../../utill/view-pager';
import {NestableScrollContainer} from 'react-native-draggable-flatlist';
import AbsoluteTopBarComponent from '../../utill/component/timetable/absolute-top-bar-component';
import {useDistance} from '../../utill/hooks/useDistance';
import {Image} from 'react-native';
import Toast from 'react-native-toast-message';
import CustomMapView from '../../utill/component/timetable/mapView';
import Timetable from '../../utill/component/timetable/timetable';

import BottomSheet, {BottomSheetScrollView, useBottomSheetInternal} from '@gorhom/bottom-sheet';
import RouteButton from '../../utill/component/route-button';
import Animated, {useAnimatedReaction, runOnJS} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import {useHeaderHeight} from '@react-navigation/elements';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
export default function MapInfo({navigation, modify, setModify, checkSave}: any) {
	const {timetable, day, transit, shareViewWithStartFlag, region, country} = useAppSelector(
		state => state.travelSlice,
	);
	const {cooperationState} = useAppSelector(state => state.eventSlice);
	const {socialloginProvider} = useAppSelector(state => state.userSlice);
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
	const scrollRef = useRef();
	const changeTouch = (idx: number) => {
		setSelect(idx);
		// let totalScroll = 0;
		// for (let i = 0; i < idx; i++) {
		// 	totalScroll += timetable[i].length;
		// }
		// scrollRef.current.scrollTo({
		// 	y:
		// 		totalScroll * heightPercentage(76) +
		// 		totalScroll * widthPercentage(3) +
		// 		idx * fontPercentage(16.71) +
		// 		idx * heightPercentage(36),
		// 	animate: false,
		// });
	};
	const change = (idx: number) => {
		idx != select && setSelect(idx);
	};
	const [visible, setVisible] = useState(false);
	const excludeNames = ['점심 추천', '저녁 추천', '숙소 추천'];
	const goNavigation = async (e: number) => {
		try {
			let navigationIndex = e - 1;
			let transitCondition = transit == 1 ? 'public' : 'car';
			if (excludeNames.includes(timetable[select][e - 1].name)) navigationIndex -= 1;
			const url = `nmap://route/${transitCondition}?slat=${timetable[select][navigationIndex].lat}&slng=${timetable[select][navigationIndex].lng}&sname=${timetable[select][navigationIndex].name}&dlat=${timetable[select][e].lat}&dlng=${timetable[select][e].lng}&dname=${timetable[select][e].name}&appname=다님`;
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
		} catch (e) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '길찾기를 진행할 관광지가 없습니다.',
					modalSubTitle: '추천 관광지를 받은 후 다시 시도해주세요',
					modalSingleUse: true,
				}),
			);
		}
	};

	const categoryTitle = ['여행지', '식당', '', '카페', '숙소', '필수여행지', '여행 시작', '여행 종료'];
	// const noMove = timetable[select].filter(item => !item.name.includes('추천'));
	useEffect(() => {
		for (let i = 0; i < timetable.length; i++) {
			if (timetable[i].length != 0) {
				a.current = true;
				setVisible(false);
				setSelect(i);
				break;
			}
		}
	}, []);
	const goRemove = () => {
		if (Array.isArray(timetable) && Array.isArray(timetable[open.day]) && timetable[open.day][open.index]) {
			const targetId = timetable[open.day][open.index].id;
			const a = timetable.map(item => (Array.isArray(item) ? item.filter(value => value?.id !== targetId) : []));
			dispatch(travelSliceActions.changeTimetable(a));
			if (open.status) {
				setOpen({...open, status: false});
			}
		}
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

	const [saveView, setSaveView] = useState(true);
	const changeViewState = useCallback(
		(e: NativeSyntheticEvent<NativeScrollEvent>) => {
			const state = usePosition(e);
			state != saveView && setSaveView(state);
		},
		[saveView],
	);
	const openModal = (index, idx) => {
		console.log(index, idx, timeView.status);
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
		setChangeDay(index);
		setVisible(true);
	};
	const [timeView, setTimeView] = useState({status: false, value: ''});

	const getStepColor = (step, idx, activeStep) => {
		if (step === '항공') return idx <= activeStep ? '#93D5FF' : '#ccc';
		if (step === '숙소') return idx <= activeStep ? 'rgba(255, 139, 109, 1)' : '#ccc';
		return idx <= activeStep ? '#B1E832' : '#ccc';
	};
	const goModify = () => {
		setVisible(false);
		const newY = viewRef.current.y;
		const newEnd = (viewRef.current.endHours - 6) * 2 + viewRef.current.endMinute / 30;
		if (newEnd >= 49) {
			dispatch(modalSliceActions.setOpenModal({modalTitle: '시간을 다시 설정해주세요.'}));
		} else {
			let copy = [...timetable[changeDay]];
			let changeCopy = [...timetable];
			let changeFlag = null;
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
				let addCopy = [...changeCopy[changeDay]];
				addCopy.splice(changeInputIndex, 0, copyValue);
				changeCopy[changeDay] = addCopy;
				dispatch(travelSliceActions.changeTimetable(changeCopy));
			}
		}
	};
	let totalHeight = 0;
	const presetScrollHeight = timetable.map((item, idx) => {
		totalHeight +=
			item.length * heightPercentage(76) +
			item.length * widthPercentage(3) +
			idx * fontPercentage(16.71) +
			idx * heightPercentage(36);
		return totalHeight;
	});
	const scrollhandle = useCallback(
		(e: NativeSyntheticEvent<NativeScrollEvent>) => {
			const scrollY = e.nativeEvent.contentOffset.y;
			// 스크롤뷰의 높이를 가져옵니다.
			const scrollViewHeight = e.nativeEvent.layoutMeasurement.height;
			const scrollIndex = presetScrollHeight.findIndex(item => item > scrollY + scrollViewHeight / 2);
			if (scrollY + scrollViewHeight + (scrollY + scrollViewHeight) * 0.1 > e.nativeEvent.contentSize.height) {
				change(presetScrollHeight.length - 1);
			} else if (scrollIndex != -1 && scrollIndex < presetScrollHeight.length) {
				change(presetScrollHeight.findIndex(item => item > scrollY + scrollViewHeight / 2));
			}
		},
		[presetScrollHeight],
	);
	const CancelModify = () => {
		setModify(false);
	};
	const checkAccommodation = () => {
		if (select == timetable.length - 1) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '마지막 날입니다',
					modalSubTitle: '마지막 날은 숙소를 추가할 수 없습니다.',
				}),
			);
		} else if (
			timetable[select][timetable[select].length - 1].category == 4 &&
			timetable[select][timetable[select].length - 1].name != '숙소 추천'
		) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '숙소가 있습니다.',
					modalSubTitle: '숙소를 제거한 후 시도해주세요',
				}),
			);
		} else {
			navigation.navigate('TimetableAddPlace', {
				x: select,
				y: [],
				status: 'accommodation',
			});
		}
	};
	const {getMainViewPager, deleteMainViewPager, viewPagerState} = useViewPager({
		title: modify ? 'modifyViewPager' : 'timetableViewPager',
	});

	const changeLocation = (data: any) => {
		if (
			(timetable[data[0]?.x][0].category == 4 && timetable[data[0]?.x][0].category != data[0]?.category) ||
			(timetable[data[0]?.x].at(-1)?.category == 4 &&
				timetable[data[0]?.x].at(-1)?.category != data?.at(-1)?.category)
		) {
			Toast.show({type: 'success', text1: '숙소는 변경할 수 없습니다', position: 'bottom'});
		} else {
			let copy = [...timetable];
			timetable[data[0].x].map((item, index) => {
				data[index] = {...data[index], y: item.y, takenTime: item.takenTime};
			});
			copy[data[0].x] = data;
			dispatch(travelSliceActions.changeTimetable(copy));
		}
	};
	const [changeDay, setChangeDay] = useState(0);
	const changeLocationRef = useRef({before: 0, after: 1});
	useEffect(() => {
		shareViewWithStartFlag && getMainViewPager();
	}, [shareViewWithStartFlag, modify]);
	const [viewMap, setViewMap] = useState(true);
	const [topbar, setTopBar] = useState(true);

	const sheetRef = useRef<BottomSheet>(null);

	// variables
	const snapPoints: ReadonlyArray<string | number> = useMemo(() => ['10%', '60%', '90%'], []);

	// callbacks
	const handleSheetChange = useCallback((index: number) => {
		console.log('handleSheetChange', index);
	}, []);
	const [btnVisible, setBtnVisible] = useState(true);
	function SheetContent() {
		const {animatedIndex} = useBottomSheetInternal();

		useAnimatedReaction(
			() => animatedIndex.value,
			(curr, prev) => {
				if (curr !== prev && prev != null) {
					runOnJS(setBtnVisible)(!((curr < prev && Math.floor(curr) <= 0) || Math.floor(curr) <= 0));
				}
			},
			[animatedIndex],
		);

		return <></>;
	}
	const [timeOutVisible, setTiemOutVisible] = useState(true);
	useEffect(() => {
		if (!cooperationState) {
			const timer = setTimeout(() => {
				setTiemOutVisible(false);
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [cooperationState]);
	const [open, setOpen] = useState({day: 0, index: 0, status: false, type: '', x: 0, y: 0});
	const headerHeight = useHeaderHeight();
	const {top: statusBarHeight} = useSafeAreaInsets();

	const totalTopHeight = headerHeight + statusBarHeight;
	return (
		<MainAllContainer>
			{/* {topbar && <AbsoluteTopBarComponent modify={modify} viewMap={viewMap}></AbsoluteTopBarComponent>} */}
			{!modify && viewMap && (
				<CustomMapView
					select={select}
					// onTouchStart={() => setTopBar(false)}
					// onTouchEnd={() => setTopBar(true)}
				/>
			)}
			<BottomSheet
				ref={sheetRef}
				snapPoints={modify ? ['99%', '99%'] : ['10%', '60%', '90%']}
				handleIndicatorStyle={{backgroundColor: '#E4E6EB', width: widthPercentage(61)}}
				handleStyle={{borderRadius: 30}}
				backgroundStyle={{borderRadius: 30}}
				enableDynamicSizing={false}
				onChange={handleSheetChange}
				index={modify ? 0 : 1}
				style={{zIndex: 0}}>
				<SheetContent />
				<BottomSheetScrollView
					onScroll={() => {
						open.status && setOpen({...open, status: false});
					}}
					showsVerticalScrollIndicator={false}
					style={{zIndex: 0}}>
					<BackgroundGray modify={modify} viewMap={viewMap}>
						{/* <PretendardSemiBoldText
							size={14}
							lineHeight={19}
							color={colors.Gray3}
							deco={'text-align:center;'}>
							{moment(day[0]).format('YYYY/MM/DD')}~{moment(day[1]).format('YYYY/MM/DD')}
						</PretendardSemiBoldText> */}
						<DayContainer horizontal={true} showsHorizontalScrollIndicator={false}>
							<FlexWrap gap={10} marginBottom={modify || !viewMap ? 15 : 0}>
								{/* {['항공', '숙소', ...timetable].map(
									(item, idx) =>
										item.length != 0 && (
											<VStack>
												<Circle
													color={getStepColor(item, idx, select)}
													flag={idx}
													onPress={() => {
														changeTouch(idx);
													}}>
													{idx <= select && (
														<SvgCheck color='white' width={widthPercentage(15)} />
													)}
												</Circle>
												<PretendardSemiBoldText
													size={14}
													lineHeight={19}
													color={changeDay == idx ? colors.Gray5 : colors.Gray3}>
													{idx <= 1 ? item : moment(day[idx - 2]).format('MM월DD일')}
												</PretendardSemiBoldText>
											</VStack>
										),
								)} */}
								{timetable.map(
									(item, idx) =>
										item.length != 0 && (
											<DayTouchablOpacity
												key={idx}
												select={idx === select}
												onPress={() => {
													changeTouch(idx);
													open.status && setOpen({...open, status: false});
												}}>
												<PretendardSemiBoldText
													size={14}
													lineHeight={19}
													color={select == idx ? colors.Gray5 : colors.Gray3}>
													{'DAY' + (idx + 1)}
												</PretendardSemiBoldText>
											</DayTouchablOpacity>
										),
								)}
							</FlexWrap>
						</DayContainer>
						{/* <HStack justifyContent='space-between'>
							<WhiteContainer width={widthPercentage(160)}>
								<HStack justifyContent='space-between' width={widthPercentage(140)}>
									<PretendardSemiBoldText size={14} lineHeight={16.71} color={colors.PointYellow}>
										여행지
									</PretendardSemiBoldText>
									<SVGContainer
										color={colors.PointYellow}
										onPress={() => {
											navigation.navigate('TimetableAddPlace', {
												x: select,
												y: [],
												status: 'travle',
											});
										}}>
										<SVGPlus
											width={widthPercentage(16)}
											height={widthPercentage(16)}
											color={colors.Primary}
										/>
									</SVGContainer>
								</HStack>
							</WhiteContainer>
							<WhiteContainer width={widthPercentage(160)}>
								<HStack justifyContent='space-between' width={widthPercentage(140)}>
									<PretendardSemiBoldText size={14} lineHeight={16.71} color={colors.PointYellow}>
										숙소
									</PretendardSemiBoldText>
									<SVGContainer color={colors.PointYellow} onPress={checkAccommodation}>
										<SVGPlus
											width={widthPercentage(16)}
											height={widthPercentage(16)}
											color={colors.Primary}
										/>
									</SVGContainer>
								</HStack>
							</WhiteContainer>
						</HStack> */}
						<Timetable
							modify={modify}
							scrollRef={scrollRef}
							changeViewState={changeViewState}
							scrollhandle={scrollhandle}
							changeLocation={changeLocation}
							changeLocationRef={changeLocationRef}
							openModal={openModal}
							CancelModify={CancelModify}
							navigation={navigation}
							goNavigation={goNavigation}
							setModify={setModify}
							viewMap={viewMap}
							select={select}
							open={open}
							setOpen={setOpen}
						/>
					</BackgroundGray>
					<MarginContainer />
				</BottomSheetScrollView>
			</BottomSheet>
			{btnVisible && !modify && (
				<>
					<ModifyPressable onPress={() => setModify(true)}>
						<SVGPencil color='white' width={widthPercentage(24)} height={widthPercentage(24)} />
					</ModifyPressable>
					{timeOutVisible && (
						<PressBox>
							<LinearGradient
								start={{x: 0, y: 0}}
								end={{x: 1, y: 0}}
								colors={['rgba(83, 80, 255, 0.8) ', '#5350FF']}
								style={{
									zIndex: 101,
									position: 'absolute',
									width: '100%',
									height: '100%',
									alignItems: 'center',
									justifyContent: 'center',
									borderRadius: 18,
								}}>
								<PretendardSemiBoldText color={colors.backgroundWhite} size={14} lineHeight={18}>
									수정하시려면 클릭하세요
								</PretendardSemiBoldText>
							</LinearGradient>
							<LeftTriangle />
						</PressBox>
					)}
				</>
			)}
			{modify && (
				<RouteButton
					navigation={navigation}
					nextText='저장하기'
					leftText='취소'
					type={'planner'}
					btnFunction={() => {
						checkSave();
						// setStep(step + 1);
					}}
					LeftBtnFunction={() => {
						setModify(false);
						// setStep(step + 1);
					}}></RouteButton>
			)}
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
						<FlexWrap gap={10} margintop={15}>
							{timetable.map(
								(item, idx) =>
									item.length != 0 && (
										<ChangeDayContainer
											key={idx}
											select={idx === changeDay}
											onPress={() => {
												setChangeDay(idx);
											}}>
											<PretendardSemiBoldText
												size={14}
												lineHeight={19}
												color={changeDay == idx ? colors.Gray5 : colors.Gray3}>
												{moment(day[idx]).format('MM월DD일')}
											</PretendardSemiBoldText>
										</ChangeDayContainer>
									),
							)}
						</FlexWrap>
						<HStack justifyContent='space-between' marginVertical={5}>
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
			{/* <Modal
				animationType={'fade'}
				transparent={true}
				visible={viewPagerState}
				onRequestClose={deleteMainViewPager}>
				<ViewPager sliceNumber={modify ? 5 : 3} handleFunction={deleteMainViewPager} />
			</Modal> */}
			{open.status && (
				<Dropdown x={open.x} y={open.y - totalTopHeight}>
					<DropdownElement
						onPress={() => {
							setOpen({
								...open,
								status: false,
							});
							// setModify(true);
							openModal(timetable[open.day][open.index].x, open.index);
						}}>
						<PretendardSemiBoldText color={colors.Gray5} size={14} lineHeight={18}>
							편집
						</PretendardSemiBoldText>
					</DropdownElement>
					<DropdownElement
						onPress={() => {
							console.log('aa');
							goRemove();
						}}>
						<PretendardSemiBoldText color={colors.Gray5} size={14} lineHeight={18}>
							삭제
						</PretendardSemiBoldText>
					</DropdownElement>
				</Dropdown>
			)}
		</MainAllContainer>
	);
}
const ChangeDayContainer = styled.TouchableOpacity<{select: boolean}>`
	padding: ${heightPercentage(10)}px ${widthPercentage(12)}px;
	align-items: center;
	justify-content: center;
	border-radius: 99px;
	border-width: ${props => (props.select ? '1px' : '0px')};
	border-color: ${colors.Primary};
	background-color: ${props => (props.select ? colors.PrimarySecondary : colors.backgroundWhite)};
`;
const AbsoluteButton = styled.TouchableOpacity`
	width: ${widthPercentage(327)}px;
	height: ${heightPercentage(60)}px;
	border-radius: 8px;
	background-color: ${colors.Gray5};
	align-items: center;
	justify-content: center;
	position: absolute;
	bottom: ${heightPercentage(30)}px;
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
export const TimePickerContainer = styled.View<{alignSelf: string}>`
	align-self: ${props => props.alignSelf};
	height: ${heightPercentage(140)}px;
`;
export const InfoModalContainer = styled.View`
	flex: 0.5;
	position: absolute;
	bottom: 0px;
	background-color: ${colors.backgroundWhite};
	width: ${widthPercentage(375)}px;
	height: ${heightPercentage(409)}px;
	border-top-right-radius: 16px;
	border-top-left-radius: 16px;
	padding: ${heightPercentage(23.22)}px ${widthPercentage(24)}px;
`;
const ModalContainer = styled.Pressable`
	flex: 1;
	background-color: rgba(0, 0, 0, 0.4);
`;
export const DayContainer = styled.ScrollView``;
const MainAllContainer = styled(MainContainer).attrs({as: View})`
	flex: 1;
	z-index: 0;
`;
const BackgroundGray = styled.View<{modify: boolean; viewMap: boolean}>`
	width: ${widthPercentage(375)}px;
	background-color: ${colors.backgroundWhite};
	padding: ${heightPercentage(0)}px ${widthPercentage(23)}px;
	z-index: 0;
`;
const ViewMapTouchable = styled.TouchableOpacity`
	flex: 0.03;
	width: 100%;
	justify-content: center;
	align-items: center;
	padding: ${widthPercentage(3)}px;
`;

const Circle = styled.TouchableOpacity`
	width: ${widthPercentage(30)}px;
	height: ${widthPercentage(30)}px;
	border-radius: 99px;
	background-color: ${props => (props.color == '#ccc' ? 'white' : props.color)};
	border-color: ${props =>
		props.color == '#ccc'
			? props.color == '#ccc' && props.flag == 0
				? '#93D5FF'
				: props.color == '#ccc' && props.flag == 1
				? '#FF8B6D'
				: '#B1E832'
			: props.color};
	border-width: 2px;
	margin-bottom: 8px;
	align-items: center;
	justify-content: center;
`;
const ModifyPressable = styled.Pressable`
	position: absolute;
	width: ${widthPercentage(46)}px;
	height: ${widthPercentage(46)}px;
	left: ${widthPercentage(304)}px;
	bottom: ${widthPercentage(30)}px;
	border-radius: 24px;
	background-color: rgba(0, 0, 0, 0.5);
	align-items: center;
	justify-content: center;
`;

const PressBox = styled.View`
	width: ${widthPercentage(160)}px;
	height: ${widthPercentage(30)}px;
	left: ${widthPercentage(136)}px;
	bottom: ${widthPercentage(38)}px;
	position: absolute;
	border-radius: 18px;
	align-items: center;
	justify-content: center;
`;
const LeftTriangle = styled.View`
	width: 0;
	height: 0;
	background-color: transparent;
	border-style: solid;
	border-left-width: ${widthPercentage(8)}px;
	border-top-width: ${widthPercentage(4)}px;
	border-bottom-width: ${widthPercentage(4)}px;
	border-top-color: transparent;
	border-bottom-color: transparent;
	border-left-color: rgba(83, 80, 255, 1);
	position: absolute;
	right: -${widthPercentage(7)}px;
`;
