import BottomSheet, {BottomSheetScrollView, useBottomSheetInternal} from '@gorhom/bottom-sheet';
import moment from 'moment';
import {memo, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {styled} from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {colors} from '../../colors';
import {BackgroundGray, HStack, PretendardSemiBoldText, PretendardVariableText, VStack} from '../../layout/layout';
import {heightPercentage, widthPercentage} from '../../layout/responsive-size';
import {cityViewList} from '../enroll-info/city-list';
import RouteButton from '../route-button';
import {LeftBar, RegistButton} from './components';
import Animated, {useAnimatedReaction, runOnJS} from 'react-native-reanimated';
import {
	SvgAirPort,
	SvgAirPortIcon,
	SvgAirPortIngIcon,
	SvgCarIcon,
	SVGMinus,
	SVGPlus,
	SVGRightAdd,
	SVGTrainCardIcon,
	SvgTrainIcon,
	SvgTripleDot,
} from '../../svg/svg';
import {WhiteContainer} from '../../../screens/enroll-info/final-check';
import {InsideGrayContainer, PlusBox} from '../timetable/timetable';
import {DashLineContainer} from '../../../screens/timetable/preset';
import {MarkerContainer} from '../../../screens/timetable/preset-detail';
import {modalSliceActions} from '../../../redux/modal/modalSlice';
import {
	DotBox,
	Dropdown,
	DropdownElement,
	ElementContainer,
	SVGContainer,
} from '../../../screens/enroll-info/select-multi';
import LinearGradient from 'react-native-linear-gradient';
import {LoadingSliceActions} from '../../../redux/loading/loading.slice';
import {saveTravel, travelSliceActions} from '../../../redux/travel-info/travel.slice';
import {logEvent} from '@react-native-firebase/analytics';
import useKakaoShare from '../../hooks/useKakaoShare';
import {useTendencyHandler} from '../../hooks/useTendencyHandler';
import {Alert, Modal, Pressable} from 'react-native';
import {ModalBackground, ModalBottomSheet} from '../../../screens/enroll-info/planner/regist-transit';
import {BottomContainer} from '../../../screens/enroll-info/search-place';
import PrimaryButton from '../primary-button';
function PlannerBottomSheet({navigation, step, setStep, startTime, setShow, handleClose}: any) {
	const {
		day,
		region,
		cityIndex,
		country,
		nDay,
		timetable,
		transit,
		tendency,
		travelName,
		travelId,
		regionInfo,
		transitInfo,
	} = useAppSelector(state => state.travelSlice);
	const {userId, userName} = useAppSelector(state => state.userSlice);
	const {modalConfettiFlag} = useAppSelector(state => state.modalSlice);
	const sheetRef = useRef<BottomSheet>(null);
	const [btnVisible, setBtnVisible] = useState(true);
	// variables
	const snapPoints: ReadonlyArray<string | number> = useMemo(() => ['10%', '65%', '90%'], []);
	// callbacks
	const handleSheetChange = useCallback((index: number) => {
		handleClose();
		console.log('handleSheetChange', index);
	}, []);
	const [timeValue, setTimeValue] = useState(0);
	const [modify, setModify] = useState(false);
	useEffect(() => {
		const unsubscribe = navigation.addListener('beforeRemove', e => {
			// 👇 여기서 뒤로 가려고 하는 상황을 감지함
			e.preventDefault(); // 뒤로 가는 행동을 막고
			// 사용자 확인 후 수동으로 pop() 등 호출
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '뒤로가시겠습니까?',
					modalSubTitle: '뒤로갈시 저장되지않습니다',
					modalFunction: () => navigation.dispatch(e.data.action),
				}),
			);
		});

		return unsubscribe;
	}, [navigation]);
	const [open, setOpen] = useState({day: 0, index: 0, status: false, type: ''});
	const {kakaoShare} = useKakaoShare();
	const goKakaoShare = async () => {
		try {
			await kakaoShare({
				travelName: travelName,
				travelId: travelId,
				startDay: day[0],
				endDay: day[nDay],
				photo: regionInfo?.photo,
			});

			await logEvent('share', {course: travelName});
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '카카오 공유 중 문제가 발생했습니다.',
				}),
			);
		}
	};
	const timeRef = useRef(null);
	const goMyTravelList = () => {
		navigation.popToTop();
		navigation.navigate('MyTravelListStack');
		if (!modalConfettiFlag) {
			timeRef.current = setTimeout(() => {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: `${userName}님`,
						modalSubTitle: `여행을 성공적으로 만드셨군요! 이제 여행 계획을 일행과 공유해보세요!`,
						modalLeft: true,
						modalFunction: goKakaoShare,
						modalTopText: '카카오톡으로 공유',
						modalBottomText: '다음에 할게요',
						modalConfetti: true,
					}),
				);
				clearTimeout(timeRef.current);
			}, 1000);
		}
	};
	const hanldeHome = () => {
		navigation.popToTop();
		navigation.navigate('Home');
	};

	const {countryList} = useTendencyHandler();
	const firstSave = async () => {
		try {
			let check = timetable.findIndex(item => item.length == 0);
			if (check != -1) {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '일정이 비어있습니다',
						modalSubTitle: '일정을 채워주세요',
						modalTopText: '확인',
						modalSingleUse: true,
					}),
				);
			} else {
				dispatch(LoadingSliceActions.onLoading());

				let a = region.map(item => cityViewList[country][cityIndex].title + ' ' + item);
				if (
					(country == 0 && cityViewList[country][cityIndex].id >= 3 && region[0] == '전체') ||
					(country == 0 && cityViewList[country][cityIndex].id == 1 && region[0] == '전체') ||
					(country != 0 && region[0] == '전체')
				) {
					a = cityViewList[country][cityIndex].sub.map(
						(value, idx) => cityViewList[country][cityIndex].title + ' ' + value.subTitle,
					);
					a.shift();
				}
				if (country == 0 && cityIndex == 2) {
					a = [region[0] + ' 전체'];
				}
				let copy = [...tendency];
				if (country != 0) {
					a = a.map((item, idx) => {
						return `해외/${countryList[country].en}/${item
							.slice(
								item.indexOf(cityViewList[country][cityIndex].title) +
									cityViewList[country][cityIndex].title.length,
							)
							.trim()}`;
					});
				}

				const data = {
					userId: userId,
					region: a,
					day: day.slice(0, nDay + 1),
					nDay: nDay + 1,
					transit: transit,
					timetable: timetable,
					tendency: tendency,
					travelName: travelName,
				};
				await dispatch(saveTravel(data));
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '일정이 저장되었습니다',
						modalTopText: '일정 확인하러 가기',
						modalBottomText: '홈으로 돌아가기',
						modalFunction: goMyTravelList,
						modalBottomFunctionUse: true,
						modalBottomFunction: hanldeHome,
					}),
				);
			}
		} catch (err) {
			dispatch(modalSliceActions.setOpenModal({modalSubTitle: '잠시후 다시 시도해주세요'}));
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	// const handleCheck=()=>{

	// }
	const categoryTitle = ['여행지', '식당', '', '카페', '숙소', '필수여행지', '여행 시작', '여행 종료'];
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
	const dispatch = useAppDispatch();
	const transitScreen = () => {
		return (
			<>
				<PretendardSemiBoldText size={22} lineHeight={26} color={colors.Black} deco='margin-bottom:15px;'>
					{region[0] == '전체' ? cityViewList[country][cityIndex].title : region[0]}까지 어떻게 가시나요?
				</PretendardSemiBoldText>
				{['outbound', 'inbound'].map((item, index) => (
					<>
						<HStack justifyContent='space-between;' deco='margin-bottom:10px;'>
							<HStack gap={3}>
								<LeftBar color={colors.Blue1} />
								<VStack>
									<PretendardSemiBoldText size={20} lineHeight={24} color={colors.Black}>
										{index == 0 ? '가는' : '오는'}편
									</PretendardSemiBoldText>
									<PretendardSemiBoldText size={14} lineHeight={18} color={colors.PlannerGray}>
										{moment(day[index == 0 ? index : nDay]).format('YYYY-MM-DD')}
									</PretendardSemiBoldText>
								</VStack>
							</HStack>
							{!(transitInfo[item].departureAirport != '' || transitInfo[item].arrivalAirport != '') && (
								<RegistButton
									color={colors.Blue1}
									onPress={() => {
										navigation.navigate('ChoiceTransit', {type: item});
									}}>
									<PretendardSemiBoldText size={14} lineHeight={18} color={colors.backgroundWhite}>
										{index == 0 ? '가는' : '오는'} 편 등록
									</PretendardSemiBoldText>
								</RegistButton>
							)}
						</HStack>
						{(transitInfo[item].departureAirport != '' || transitInfo[item].arrivalAirport != '') && (
							<TransitBox>
								<HStack gap={5}>
									<IconContainer>
										{transitInfo[item].type == 'airport' ? (
											<SvgAirPortIcon />
										) : (
											<SVGTrainCardIcon
												width={widthPercentage(18)}
												height={widthPercentage(18)}
												color={'white'}
											/>
										)}
									</IconContainer>
									<PretendardSemiBoldText size={14} lineHeight={18} color={colors.Black}>
										{transitInfo[item].airline}
										{transitInfo[item].reservationNumber != '' &&
											'+' + transitInfo[item].reservationNumber}
									</PretendardSemiBoldText>
									<VStack deco='z-index:1000; margin-left:auto;'>
										<DotBox
											deco='align-items:center; justify-content:center;'
											onPress={() =>
												setOpen({
													status: !open.status,
													index: index,
													day: step - 2,
													type: 'transit',
												})
											}>
											<SvgTripleDot />
										</DotBox>
										{open.status &&
											open.index == index &&
											open.day == step - 2 &&
											open.type == 'transit' && (
												<Dropdown>
													<DropdownElement
														onPress={() => {
															// setOpen({...open, status: false});
															// setTimeValue(item?.takenTime / 60 - 1);
															// setModify(true);
															// openModal(item.x, idx);
															navigation.navigate('RegistTransit', {type: item});
														}}>
														<PretendardSemiBoldText
															color={colors.Gray5}
															size={14}
															lineHeight={18}>
															편집
														</PretendardSemiBoldText>
													</DropdownElement>
													{/* <DropdownElement
													onPress={() => {
														// deleteEssential(data);
													}}>
													<PretendardSemiBoldText
														color={colors.Gray5}
														size={14}
														lineHeight={18}>
														삭제
													</PretendardSemiBoldText>
												</DropdownElement> */}
												</Dropdown>
											)}
									</VStack>
								</HStack>
								<HStack justifyContent='space-between'>
									<VStack width={widthPercentage(92)}>
										<PretendardSemiBoldText size={32} lineHeight={36} color={colors.Black}>
											{transitInfo[item]?.type == 'airport'
												? '공항'
												: transitInfo[item]?.type == 'train'
												? '기차'
												: '출발'}
										</PretendardSemiBoldText>
										<PretendardSemiBoldText
											size={12}
											lineHeight={16}
											color={colors.Gray4}
											numberOfLines={1}>
											{transitInfo[item].departureAirport}
										</PretendardSemiBoldText>
									</VStack>
									<VStack>
										<HStack deco={`margin-top:-20px;`}>
											<Dash></Dash>
											{transitInfo[item].type == 'airport' ? (
												<SvgAirPortIngIcon></SvgAirPortIngIcon>
											) : (
												<SVGTrainCardIcon
													width={widthPercentage(18)}
													height={widthPercentage(18)}
													color={'black'}
												/>
											)}
										</HStack>
										<PretendardSemiBoldText
											size={8}
											lineHeight={12}
											color={colors.Gray4}
											deco={'text-align:center;'}>
											{Math.floor(
												moment(transitInfo[item].arrivalTime).diff(
													transitInfo[item].departureTime,
													'minutes',
												) / 60,
											) != 0 &&
												Math.floor(
													moment(transitInfo[item].arrivalTime).diff(
														transitInfo[item].departureTime,
														'minutes',
													) / 60,
												) + '시간'}
											{moment(transitInfo[item].arrivalTime).diff(
												transitInfo[item].departureTime,
												'minutes',
											) %
												60 !=
												0 &&
												(moment(transitInfo[item].arrivalTime).diff(
													transitInfo[item].departureTime,
													'minutes',
												) %
													60) +
													'분'}
										</PretendardSemiBoldText>
									</VStack>
									<VStack width={widthPercentage(92)}>
										<PretendardSemiBoldText
											size={32}
											lineHeight={36}
											color={colors.Black}
											deco={'text-align:right;'}>
											{transitInfo[item]?.type == 'airport'
												? '공항'
												: transitInfo[item]?.type == 'train'
												? '기차'
												: '도착'}
										</PretendardSemiBoldText>
										<PretendardSemiBoldText
											size={12}
											lineHeight={16}
											color={colors.Gray4}
											deco={'text-align:right;'}>
											{transitInfo[item].arrivalAirport}
										</PretendardSemiBoldText>
									</VStack>
								</HStack>
								<HStack gap={widthPercentage(13)}>
									<PretendardSemiBoldText size={14} lineHeight={18} color={colors.Gray4}>
										출발 정보
									</PretendardSemiBoldText>
									<PretendardSemiBoldText size={14} lineHeight={18} color={colors.Black}>
										{moment(new Date(transitInfo[item]?.departureTime)).format('YYYY-MM-DD')}
									</PretendardSemiBoldText>
									<PretendardSemiBoldText size={14} lineHeight={18} color={colors.Black}>
										{new Date(transitInfo[item]?.departureTime).getHours()}시
									</PretendardSemiBoldText>
								</HStack>
								<HStack gap={widthPercentage(13)}>
									<PretendardSemiBoldText size={14} lineHeight={18} color={colors.Gray4}>
										도착 정보
									</PretendardSemiBoldText>
									<PretendardSemiBoldText size={14} lineHeight={18} color={colors.Black}>
										{moment(new Date(transitInfo[item]?.arrivalTime)).format('YYYY-MM-DD')}
									</PretendardSemiBoldText>
									<PretendardSemiBoldText size={14} lineHeight={18} color={colors.Black}>
										{new Date(transitInfo[item]?.arrivalTime).getHours()}시
									</PretendardSemiBoldText>
								</HStack>
							</TransitBox>
						)}
					</>
				))}
			</>
		);
	};
	const accommodationScreen = () => {
		return (
			<>
				<PretendardSemiBoldText size={22} lineHeight={26} color={colors.Black} deco='margin-bottom:10px;'>
					어디서 머무시나요?
				</PretendardSemiBoldText>
				{nDay == 0 ? (
					<PretendardSemiBoldText
						size={20}
						lineHeight={25}
						color={colors.PointYellow}
						textAlign={'center'}
						marginTop={70}>
						당일치기는 숙소 등록이 불가합니다
					</PretendardSemiBoldText>
				) : (
					timetable.slice(0, timetable.length - 1).map((item, index) => (
						<VStack deco={`margin-top:${widthPercentage(32)}px;`}>
							<HStack justifyContent='space-between;' deco='margin-bottom:10px;'>
								<HStack gap={3}>
									<LeftBar color={colors.Pink1} />
									<VStack>
										<PretendardSemiBoldText size={19} lineHeight={23} color={colors.Black}>
											{index + 1}일 차
										</PretendardSemiBoldText>
										<PretendardSemiBoldText size={13} lineHeight={17} color={colors.PlannerGray}>
											{moment(day[index == 0 ? index : nDay]).format('YYYY-MM-DD')}
										</PretendardSemiBoldText>
									</VStack>
								</HStack>
								<RegistButton
									color={colors.Pink1}
									onPress={() => {
										console.log(item);
										navigation.navigate('TimetableAddPlace', {
											x: index,
											y: [],
											status: 'accommodation',
										});
									}}>
									<PretendardSemiBoldText size={13} lineHeight={18} color={colors.backgroundWhite}>
										숙소 등록
									</PretendardSemiBoldText>
								</RegistButton>
							</HStack>
							{item?.find(acc => acc?.category === 4 && acc?.name?.trim() !== '' && acc?.y == 36) && (
								<GrayBox>
									<VStack width={widthPercentage(243)}>
										<PretendardSemiBoldText
											size={18}
											lineHeight={22}
											color={colors.Black}
											numberOfLines={1}>
											{
												item?.find(
													acc =>
														acc?.category === 4 && acc?.name?.trim() !== '' && acc?.y == 36,
												)?.name
											}
										</PretendardSemiBoldText>
										<PretendardSemiBoldText
											size={13}
											lineHeight={18}
											color={colors.Black}
											numberOfLines={1}>
											{
												item?.find(
													acc =>
														acc?.category === 4 &&
														acc?.formatted_address?.trim() !== '' &&
														acc?.y == 36,
												)?.formatted_address
											}
										</PretendardSemiBoldText>
									</VStack>
								</GrayBox>
							)}
						</VStack>
					))
				)}
			</>
		);
	};
	const timeTableScreen = () => {
		return (
			<>
				<StartContainer
					onPress={() => {
						setShow(true);
					}}>
					<PretendardSemiBoldText size={16} lineHeight={20} color={colors.Black} numberOfLines={1}>
						{step - 1}일 차 일정은{' '}
						<PretendardSemiBoldText size={16} lineHeight={20} color={colors.PointYellow} numberOfLines={1}>
							{Math.floor(((startTime[step - 2]?.time ?? 0) * 30 + 360) / 60)}시{''}
							{((startTime[step - 2]?.time ?? 0) * 30 + 360) % 60 != 0 &&
								' ' +
									String(((startTime[step - 2]?.time ?? 0) * 30 + 360) % 60).padStart(2, '0') +
									'분'}
							에{' '}
						</PretendardSemiBoldText>
						시작할게요!
					</PretendardSemiBoldText>
					<SVGRightAdd transform={90} color={'black'} style={{marginLeft: 20}}></SVGRightAdd>
				</StartContainer>
				<WhiteContainer
					deco={`border-width:1px;border-color:${colors.Gray200};padding:${widthPercentage(
						20,
					)}px ${widthPercentage(24)}px;z-index:0;`}>
					<HStack>
						<PretendardSemiBoldText size={16} lineHeight={20} color={colors.Black} numberOfLines={1}>
							DAY {step - 1}{' '}
						</PretendardSemiBoldText>
						<PretendardVariableText size={14} lineHeight={20} color={colors.Title} numberOfLines={1}>
							{moment(day[step - 2]).format('YYYY-MM-DD')}
						</PretendardVariableText>
					</HStack>
					{timetable[step - 2].map((item, index) => (
						<>
							{timetable[step - 2].at(-1)?.category === 4 &&
								timetable[step - 2].length === 1 &&
								timetable[step - 2].at(-1)?.y === 36 && (
									<HStack gap={20} marginHorizon={widthPercentage(30)} marginVertical={10}>
										<PlusBox
											onPress={() => {
												navigation.navigate('AddCategory', {
													info: {
														day: step - 2,
														index: timetable[step - 2].length,
														startTime: startTime[step - 2]?.time,
													},
												});
											}}>
											<SVGPlus color={colors.Gray400} />
										</PlusBox>
										<PressBox>
											<LeftTriangle />
											<LinearGradient
												start={{x: 0, y: 0}}
												end={{x: 1, y: 0}}
												colors={['#5350FF', 'rgba(83, 80, 255, 0.8) ']}
												style={{
													zIndex: 101,
													position: 'absolute',
													width: '100%',
													height: '100%',
													alignItems: 'center',
													justifyContent: 'center',
													borderRadius: 18,
												}}>
												<PretendardSemiBoldText
													color={colors.backgroundWhite}
													size={14}
													lineHeight={18}>
													버튼을 눌러 추가하세요
												</PretendardSemiBoldText>
											</LinearGradient>
										</PressBox>
									</HStack>
								)}
							<HStack>
								<VStack deco='z-index:0;'>
									<HStack gap={widthPercentage(10)} marginVertical={widthPercentage(10)}>
										<DashLineContainer justifyContent='start'>
											<MarkerContainer
												backgroundColor={item.category == 4 ? colors.Pink1 : colors.Green5}>
												<PretendardSemiBoldText
													size={13}
													lineHeight={19}
													color={colors.backgroundWhite}>
													{index + 1}
												</PretendardSemiBoldText>
											</MarkerContainer>
											{/* <DashLine
												status={idx == value.length - 1 ? 'end' : 'center'}></DashLine> */}
										</DashLineContainer>
										<InsideGrayContainer
											// onLongPress={() => {
											// 	dispatch(
											// 		modalSliceActions.setOpenModal({
											// 			modalTitle: '편집 모드에서 여행 일정을 편집하시겠어요?',
											// 			modalFunction: () => {
											// 				// setModify(true);
											// 			},
											// 		}),
											// 	);
											// }}
											onPress={() => {
												console.log('category', timetable[step - 2]?.at(-1)?.category);
												console.log('length', timetable[step - 2]?.length);
												console.log('y', timetable[step - 2]?.at(-1)?.y);

												// moveRegion(idx, index);
											}}>
											<HStack justifyContent='space-between;'>
												<VStack>
													<PretendardVariableText
														size={12}
														lineHeight={18}
														color={colors.Gray2}>
														{categoryTitle[item.category]}{' '}
														{Math.floor(((item.y ?? 0) * 30 + 360) / 60)}:
														{String(((item.y ?? 0) * 30 + 360) % 60).padStart(2, '0')}{' '}
														{!(item.category == 4 || item.category == 6) &&
															`~ ${
																Math.floor(
																	(((item.y ?? 0) + item.takenTime / 30) * 30 + 360) /
																		60,
																) < 25 &&
																Math.floor(
																	(((item.y ?? 0) + item.takenTime / 30) * 30 + 360) /
																		60,
																) +
																	':' +
																	String(
																		(((item.y ?? 0) + item.takenTime / 30) * 30 +
																			360) %
																			60,
																	).padStart(2, '0')
															}`}
													</PretendardVariableText>
													<PretendardSemiBoldText
														maxWidth={widthPercentage(200)}
														size={14}
														lineHeight={18.9}
														numberOfLines={2}
														color={colors.Gray5}>
														{item.name}
													</PretendardSemiBoldText>
												</VStack>
												<VStack deco='z-index:1000;'>
													<DotBox
														deco='align-items:center; justify-content:center;'
														onPress={() =>
															setOpen({
																status: !open.status,
																index: index,
																day: step - 2,
																type: 'essential',
															})
														}>
														<SvgTripleDot />
													</DotBox>
													{open.status &&
														open.index == index &&
														open.day == step - 2 &&
														open.type == 'essential' && (
															<Dropdown>
																<DropdownElement
																	onPress={() => {
																		setOpen({...open, status: false});
																		setTimeValue(item?.takenTime / 60 - 1);
																		setModify(true);
																		// openModal(item.x, idx);
																	}}>
																	<PretendardSemiBoldText
																		color={colors.Gray5}
																		size={14}
																		lineHeight={18}>
																		편집
																	</PretendardSemiBoldText>
																</DropdownElement>
																<DropdownElement
																	onPress={() => {
																		// deleteEssential(data);
																	}}>
																	<PretendardSemiBoldText
																		color={colors.Gray5}
																		size={14}
																		lineHeight={18}>
																		삭제
																	</PretendardSemiBoldText>
																</DropdownElement>
															</Dropdown>
														)}
												</VStack>
											</HStack>
										</InsideGrayContainer>
									</HStack>
								</VStack>
							</HStack>
							{((timetable[step - 2].at(-1)?.category == 4 && timetable[step - 2].length - 2 == index) ||
								(timetable[step - 2].at(-1)?.category == 4 && timetable[step - 2].at(-1)?.y == 6)) && (
								<HStack gap={20} marginHorizon={widthPercentage(30)} marginVertical={10}>
									<PlusBox
										onPress={() => {
											navigation.navigate('AddCategory', {
												info: {
													day: step - 2,
													index: index,
													startTime: startTime[step - 2]?.time,
												},
											});
										}}>
										<SVGPlus color={colors.Gray400} />
									</PlusBox>
									<PressBox>
										<LeftTriangle />
										<LinearGradient
											start={{x: 0, y: 0}}
											end={{x: 1, y: 0}}
											colors={['#5350FF', 'rgba(83, 80, 255, 0.8) ']}
											style={{
												zIndex: 101,
												position: 'absolute',
												width: '100%',
												height: '100%',
												alignItems: 'center',
												justifyContent: 'center',
												borderRadius: 18,
											}}>
											<PretendardSemiBoldText
												color={colors.backgroundWhite}
												size={14}
												lineHeight={18}>
												버튼을 눌러 추가하세요
											</PretendardSemiBoldText>
										</LinearGradient>
									</PressBox>
								</HStack>
							)}
						</>
					))}
					{timetable[step - 2].at(-1)?.category != 4 && (
						<HStack gap={20} marginHorizon={widthPercentage(30)} marginVertical={10}>
							<PlusBox
								onPress={() => {
									navigation.navigate('AddCategory', {
										info: {
											day: step - 2,
											index: timetable[step - 2].length,
											startTime: startTime[step - 2]?.time,
										},
									});
								}}>
								<SVGPlus color={colors.Gray400} />
							</PlusBox>

							<PressBox>
								<LeftTriangle />
								<LinearGradient
									start={{x: 0, y: 0}}
									end={{x: 1, y: 0}}
									colors={['#5350FF', 'rgba(83, 80, 255, 0.8) ']}
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
										버튼을 눌러 추가하세요
									</PretendardSemiBoldText>
								</LinearGradient>
							</PressBox>
						</HStack>
					)}
				</WhiteContainer>
			</>
		);
	};
	return (
		<>
			<BottomSheet
				ref={sheetRef}
				snapPoints={snapPoints}
				enableDynamicSizing={false}
				onChange={handleSheetChange}
				index={1}>
				<SheetContent />
				<CustomBottomSheetScrollView
					showsVerticalScrollIndicator={false}
					style={{marginBottom: heightPercentage(100)}}>
					{step == 0 ? transitScreen() : step == 1 ? accommodationScreen() : timeTableScreen()}
				</CustomBottomSheetScrollView>
			</BottomSheet>
			{btnVisible && (
				<RouteButton
					navigation={navigation}
					nextText={nDay + 2 == step ? '저장하기' : '다음으로'}
					leftText='이전으로'
					type={'planner'}
					btnFunction={() => {
						nDay + 2 == step ? firstSave() : setStep(step + 1);
					}}
					LeftBtnFunction={() => {
						step == 0 ? navigation.goBack() : setStep(step - 1);
					}}></RouteButton>
			)}
			<Modal
				animationType={'fade'}
				transparent={true}
				visible={modify}
				onRequestClose={() => {
					// setShow(false);
				}}>
				<ModalBackground
					onPress={() => {
						setModify(false);
						// setPlaceState(null);
						// clearInput();
					}}>
					<ModalBottomSheet flex={0.4}>
						<BottomContainer height={heightPercentage(230)} gap={20}>
							<ElementContainer color={colors.backgroundGray}>
								<VStack width={widthPercentage(243)}>
									<PretendardSemiBoldText size={16} color={colors.Gray5} lineHeight={21.6}>
										{/* {
												essentialPlaces.filter(place => place.day === open.day + 1)?.[
													open.index
												]?.name
											} */}
										{timetable[open.day]?.[open.index]?.name}
									</PretendardSemiBoldText>
									<PretendardVariableText
										size={12}
										lineHeight={18}
										color={colors.Gray2}
										numberOfLines={1}>
										{/* {
												essentialPlaces.filter(place => place.day === open.day + 1)?.[
													open.index
												]?.formatted_address
											} */}
										{timetable[open.day]?.[open.index]?.formatted_address}
									</PretendardVariableText>
								</VStack>
							</ElementContainer>
							<HStack justifyContent='space-around'>
								<PretendardSemiBoldText size={16} color={colors.Gray5} lineHeight={24}>
									머무를 시간
								</PretendardSemiBoldText>
								<HStack justifyContent='space-around' width={widthPercentage(182)}>
									<SVGContainer
										disabled={timeValue < 1}
										onPress={() => {
											setTimeValue(timeValue - 1);
										}}
										color={timeValue < 1 ? colors.backgroundWhite : colors.Gray1}>
										{timeValue >= 1 && (
											<SVGMinus
												width={widthPercentage(23)}
												height={widthPercentage(23)}
												color={colors.Gray2}
											/>
										)}
									</SVGContainer>

									<PretendardSemiBoldText size={16} color={colors.PointYellow} lineHeight={21.6}>
										{timeValue + 1}시간
									</PretendardSemiBoldText>
									<SVGContainer
										disabled={timeValue > 1}
										onPress={() => {
											setTimeValue(timeValue + 1);
										}}
										color={timeValue > 1 ? colors.backgroundWhite : colors.Gray5}>
										{timeValue <= 1 && (
											<SVGPlus
												width={widthPercentage(25)}
												height={widthPercentage(25)}
												color={colors.Primary}
											/>
										)}
									</SVGContainer>
								</HStack>
							</HStack>
							<PrimaryButton
								label={'수정 완료'}
								width={widthPercentage(327)}
								height={heightPercentage(60)}
								onPress={
									() => {
										let copy = [...timetable];
										let copy2 = timetable[open.day].map((item, idx) =>
											idx == open.index ? {...item, takenTime: (timeValue + 1) * 60} : item,
										);
										copy[open.day] = copy2;
										dispatch(travelSliceActions.changeTimetable(copy));
										setTimeValue(0);
										setModify(false);
									}
									// modifyEssential(
									// 	essentialPlaces.filter(place => place.day === open.day + 1)?.[open.index],
									// )
								}
								backgroundColor={colors.Gray5}
								textColor={colors.backgroundWhite}></PrimaryButton>
						</BottomContainer>
					</ModalBottomSheet>
				</ModalBackground>
			</Modal>
		</>
	);
}
const CustomBottomSheetScrollView = styled(BottomSheetScrollView)`
	padding: 0px ${widthPercentage(24)}px;
`;
const TransitBox = styled.View`
	width: ${widthPercentage(327)}px;
	height: ${widthPercentage(203)}px;
	border-radius: 12px;
	border-width: 1px;
	border-color: ${colors.Gray200};
	padding: ${widthPercentage(17)}px ${widthPercentage(24)}px;
	gap: ${widthPercentage(10)}px;
	margin-bottom: ${widthPercentage(10)}px;
`;
const IconContainer = styled.View`
	width: ${widthPercentage(28)}px;
	height: ${widthPercentage(28)}px;
	border-radius: 99px;
	background-color: ${colors.Blue1};
	align-items: center;
	justify-content: center;
`;
const Dash = styled.View`
	width: ${widthPercentage(50)}px;
	height: ${widthPercentage(1)}px;
	border-width: 1px;
	border-style: dashed;
`;
const GrayBox = styled.View`
	width: ${widthPercentage(327)}px;
	height: ${widthPercentage(72)}px;
	border-radius: 12px;
	background-color: ${colors.backgroundGray};
	margin-top: ${widthPercentage(17)}px;
	padding: ${widthPercentage(15)}px ${widthPercentage(16)}px;
`;
const StartContainer = styled(HStack).attrs({as: Pressable})`
	width: ${widthPercentage(327)}px;
	height: ${widthPercentage(60)}px;
	border-radius: 8px;
	border-width: 1px;
	border-color: ${colors.Gray200};
	align-items: center;
	justify-content: center;
	margin-bottom: ${widthPercentage(20)}px;
`;
const PressBox = styled.View`
	width: ${widthPercentage(160)}px;
	height: ${widthPercentage(30)}px;
	border-radius: 18px;
	align-items: center;
	justify-content: center;
`;
const LeftTriangle = styled.View`
	width: 0;
	height: 0;
	background-color: transparent;
	border-style: solid;
	border-right-width: ${widthPercentage(8)}px;
	border-top-width: ${widthPercentage(4)}px;
	border-bottom-width: ${widthPercentage(4)}px;
	border-top-color: transparent;
	border-bottom-color: transparent;
	border-right-color: rgba(83, 80, 255, 1);
	position: absolute;
	left: -${widthPercentage(7)}px;
`;
export default memo(PlannerBottomSheet);
