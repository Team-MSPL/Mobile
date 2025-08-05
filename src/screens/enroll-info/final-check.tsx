import {BackHandler, Modal, TouchableOpacity} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {EssentialPlaceType, getTravelAi, travelSliceActions} from '../../redux/travel-info/travel.slice';
import CustomButton from '../../utill/component/custom-button';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {useCallback, useEffect, useRef, useState} from 'react';
import {
	MainContainer,
	VStack,
	HStack,
	PretendardVariableText,
	PretendardSemiBoldText,
	TagContainer,
	BackgroundGray,
	FlexWrap,
} from '../../utill/layout/layout';
import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import {
	SVGFall,
	SVGFlag,
	SVGPlus,
	SVGSpring,
	SVGSummer,
	SVGWinter,
	SvgCancel,
	SvgTripleDot,
	SVGMinus,
} from '../../utill/svg/svg';
import LoadingTimetable from '../../utill/component/timetable/loading-timetable';

import {
	ButtonContainer,
	DayViewContainer,
	DeleteContainer,
	DotBox,
	Dropdown,
	DropdownElement,
	ElementContainer,
	SVGContainer,
} from './select-multi';
import {useTendencyHandler} from '../../utill/hooks/useTendencyHandler';
import {TagShopText} from '../home/main';
import {fontPercentage, heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {MarginContainer} from '../timetable/preset-detail';
import {logEvent} from '../../../firebaseAnalytice';
import StepText from '../../utill/component/enroll-info/step-text';
import TendencyButton from '../../utill/component/tendency-button';
import {SelectButtonsContainer} from './region-recommend/select-who';
import {userSliceActions} from '../../redux/user/user.slice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {cityViewList} from '../../utill/component/enroll-info/city-list';
import LinearGradient from 'react-native-linear-gradient';
import PrimaryButton from '../../utill/component/primary-button';
import {ModalBackground, ModalBottomSheet} from './planner/regist-transit';
import {BottomContainer} from './search-place';
import {ScrollView} from 'react-native';
import RouteButton from '../../utill/component/route-button';
import {DistanceCenter, DistanceSpace, MapContainer, Qwe} from './select-distance';
import MapView, {Circle} from 'react-native-maps';
import Slider from '@react-native-community/slider';
import {useHeaderHeight} from '@react-navigation/elements';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function FinalCheck({navigation}: any) {
	const {handleButtonClick, tendencyList, countryList} = useTendencyHandler();
	const {
		day,
		region,
		accommodations,
		nDay,
		cityIndex,
		essentialPlaces,
		tendency,
		timeLimitArray,
		transit,
		distance,
		season,
		bandwidth,
		freeTicket,
		regionInfo,
		travelName,
		country,
		cityDistance,
	} = useAppSelector(state => state.travelSlice);
	const {socialloginProvider} = useAppSelector(state => state.userSlice);
	const [loading, setLoading] = useState(false);
	const dispatch = useAppDispatch();

	const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
	const [tendencyModify, setTendencyModify] = useState({status: false, index: 0, type: ''});
	const handleTendencyModify = (index: number, type: string) => {
		setTendencyModify({status: true, index: index, type: type});
	};
	const handleClose = () => {
		setTendencyModify({status: false, index: 0, type: tendencyModify.type});
	};

	const BinaryList = [
		[
			{
				name: '자동차 렌트카',
				function: () => dispatch(travelSliceActions.enrollTransit(0)),
				image: (
					<MoveImage resizeMode='contain' source={require('../../../public/images/test1.png')}></MoveImage>
				),
			},
			{
				name: '대중교통',
				function: () => dispatch(travelSliceActions.enrollTransit(1)),
				image: (
					<MoveImage resizeMode='contain' source={require('../../../public/images/test2.png')}></MoveImage>
				),
			},
		],
		[
			{
				name: '알찬 일정',
				function: () => dispatch(travelSliceActions.enrollBandwidth(false)),
				photo: require('../../../public/tendency/busy.png'),
			},
			{
				name: '여유있는 일정',
				function: () => dispatch(travelSliceActions.enrollBandwidth(true)),
				photo: require('../../../public/tendency/non-busy.png'),
			},
		],
	];
	const checkToken = () => {
		handleNext();
	};
	useEffect(() => {
		const backAction = () => {
			if (navigation.isFocused() && loading) {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: 'AI가 실행 중입니다. 잠시만 기다려주세요.',
						modalFunction: () => {},
						modalSingleUse: true,
					}),
				);
				return true;
			}
		};
		const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
		return () => backHandler.remove();
	}, [loading]);
	const exceptionKeys = ['isFirstLaunch', 'noPermission'];

	const handleLogin = async () => {
		handleAnonymousLogin();
		dispatch(userSliceActions.setAnonymousKeep(true));
		await AsyncStorage.getAllKeys().then(allKeys => {
			const removeList = allKeys.filter(k => !exceptionKeys.some(ek => ek === k));
			AsyncStorage.multiRemove(removeList);
		});
		dispatch(userSliceActions.loginFalse());
		navigation.navigate('LoginScreen');
	};
	const handleModifyModalFunction = () => {
		if (tendencyModify.status) {
			if (tendencyModify.type == 'tendency') {
				tendencyModify.index == 0
					? handleTendencyModify(0, 'binary')
					: tendencyModify.index == 4
					? handleClose()
					: handleTendencyModify(tendencyModify.index + 1, 'tendency');
			} else {
				tendencyModify.index == 1 ? handleClose() : handleTendencyModify(tendencyModify.index + 1, 'binary');
			}
		}
	};
	const handleModifyModalBackFunction = () => {
		if (tendencyModify.status) {
			if (tendencyModify.type == 'tendency') {
				handleTendencyModify(tendencyModify.index - 1, 'tendency');
			} else {
				tendencyModify.index == 0
					? handleTendencyModify(0, 'tendency')
					: handleTendencyModify(tendencyModify.index - 1, 'binary');
			}
		}
	};
	const handleNext = () => {
		socialloginProvider == 'anonymous'
			? dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '지금 로그인하시고 \n맞춤 여행 추천을 받아보세요!',
						modalTopText: '좋아요!',
						modalBottomText: '다음에 할게요',
						modalFunction: handleLogin,
					}),
			  )
			: goNext(3);
	};
	const goNext = useCallback(
		async (e: number) => {
			try {
				setLoading(true);
				if (travelName == '신나는 여행' && tendencyList[0]?.list[tendency[0].findIndex(item => item == 1)]) {
					let changeName =
						tendencyList[0]?.list[tendency[0].findIndex(item => item == 1)] +
						(tendency[0].findIndex(item => item == 1) == 0 || tendency[0].findIndex(item => item == 1) == 4
							? ' '
							: ' 함께하는 ') +
						seasonList[season.findIndex(item => item == 1)].title +
						'여행';
					dispatch(travelSliceActions.enrollTravelName(changeName));
				}
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
				// //["해외/Vietnam/나트랑", "해외/Vietnam/다낭"]
				if (country == 0 && cityIndex == 2) {
					a = [region[0] + ' 전체'];
				}
				let copy = [...tendency];
				copy.push(season);
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
				console.log(a);
				const result = await dispatch(
					getTravelAi({
						regionList: a,
						accomodationList: accommodations,
						selectList: copy,
						essentialPlaceList: essentialPlaces,
						timeLimitArray: timeLimitArray,
						nDay: nDay + 1,
						transit: transit,
						distanceSensitivity: distance,
						bandwidth: bandwidth,
						freeTicket: freeTicket,
						version: 3,
						password: '(주)나그네들_g5hb87r8765rt68i7ur78',
					}),
				).unwrap();

				dispatch(travelSliceActions.selectRegion(a));
				if (result) {
					navigation.popToTop();
					navigation.navigate('Preset');
					!result.data.enoughPlace &&
						dispatch(
							modalSliceActions.setOpenModal({
								modalTitle: `해당 지역의 관광지 중 선택하신 성향의 \n 관광지가 부족하여,일정을 다 채울 수가 없었어요 ㅠㅠ`,
								modalTextSize: 17,
								modalSingleUse: true,
							}),
						);
				} else {
					dispatch(
						modalSliceActions.setOpenModal({
							modalTitle: '네트워크 연결이 불안정합니다',
							modalSubTitle: '확인후 다시 시도해주세요',
						}),
					);
				}
			} catch (error) {
				console.log(error);
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '네트워크 연결이 불안정합니다',
						modalSubTitle: '확인후 다시 시도해주세요',
					}),
				);
			} finally {
				setLoading(false);
			}
		},
		[essentialPlaces, accommodations],
	);
	const checkDeleteAccommodation = (e: number) => {
		dispatch(
			modalSliceActions.setOpenModal({
				modalTitle: '삭제하시겠습니까?',
				modalTopText: '삭제할래요',
				modalBottomText: '그냥 둘래요',
				modalFunction: () => deleteAccommodation(e),
			}),
		);
	};
	const checkDeleteEssential = (e: EssentialPlaceType) => {
		dispatch(
			modalSliceActions.setOpenModal({
				modalTitle: '삭제하시겠습니까?',
				modalTopText: '삭제할래요',
				modalBottomText: '그냥 둘래요',
				modalFunction: () => deleteEssential(e),
			}),
		);
	};
	const deleteAccommodation = (e: number) => {
		let copy = [...accommodations];
		copy[e] = {name: '', lat: 0, lng: 0, category: 4, takenTime: 30, photo: ''};
		dispatch(travelSliceActions.enrollAccommodations(copy));
		setOpen({
			...open,
			status: false,
		});
	};
	const deleteEssential = (e: EssentialPlaceType) => {
		const filteredPlaces = essentialPlaces.filter(place => place.day === open.day + 1);
		const data = filteredPlaces.find((item, idx) => idx == open.index);

		const updatedPlaces = essentialPlaces.filter(item => item.id !== data.id);
		dispatch(travelSliceActions.enrollessentialPlaces(updatedPlaces));
		setOpen({
			...open,
			status: false,
		});
	};
	const handleAnonymousLogin = async () => {
		await logEvent('anonymous_course_login', {});
	};
	const handleGoogleAnalytics = async () => {
		socialloginProvider == 'anonymous'
			? await logEvent('anonymous_course_step6', {})
			: await logEvent('course_step6', {});
	};
	useEffect(() => {
		handleGoogleAnalytics();
	}, []);
	const seasonList = [
		{title: '봄', svg: <SVGSpring width={widthPercentage(24)} height={widthPercentage(27)} />},
		{title: '여름', svg: <SVGSummer width={widthPercentage(24)} height={widthPercentage(27)} />},
		{title: '가을', svg: <SVGFall width={widthPercentage(24)} height={widthPercentage(27)} />},
		{title: '겨울', svg: <SVGWinter width={widthPercentage(24)} height={widthPercentage(27)} />},
	];
	const handleSelect = (item: number) => {
		handleButtonClick({index: tendencyModify.index, region: false, item: item});
	};
	const goSearchPlace = (data: {idx: number; index: number}) => {
		navigation.navigate('SearchPlace', {id: data.index, idx: data.idx});
	};
	const modifyEssential = (e: EssentialPlaceType) => {
		let copy = [...essentialPlaces];
		const updatedPlaces = copy.map(item => (item.id == e.id ? {...item, takenTime: (timeValue + 1) * 60} : item));
		dispatch(travelSliceActions.enrollessentialPlaces(updatedPlaces));
		setModify(false);
		setTimeValue(0);
	};
	const [open, setOpen] = useState({day: 0, index: 0, status: false, type: '', x: 0, y: 0});
	const [timeValue, setTimeValue] = useState(0);
	const [modify, setModify] = useState(false);
	const [viewType, setViewType] = useState(0);
	const dotRefs = useRef<Record<string, TouchableOpacity | null>>({});

	const headerHeight = useHeaderHeight();
	const {top: statusBarHeight} = useSafeAreaInsets();

	const totalTopHeight = headerHeight + statusBarHeight;
	if (loading) return <LoadingTimetable navigation={navigation} />;
	return (
		<>
			<BackgroundGray backgroundColor={colors.backgroundWhite}>
				<MainContainer
					onScroll={() => {
						open.status && setOpen({...open, status: false});
					}}
					showsVerticalScrollIndicator={false}
					backgroundColor={colors.backgroundWhite}>
					<ImageContainer>
						<BackgroundImage resizeMode='stretch' source={{uri: regionInfo.photo}}></BackgroundImage>
						<LinearGradient
							start={{x: 0, y: 0}}
							end={{x: 0, y: 1}}
							colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.5)']}
							style={{
								zIndex: 101,
								position: 'absolute',
								width: '100%',
								paddingHorizontal: widthPercentage(24),
								paddingVertical: widthPercentage(20),
								justifyContent: 'space-between',
								height: '100%',
								borderRadius: 8,
							}}>
							<ModifyTouchable
								onPress={() => {
									handleTendencyModify(0, 'tendency');
								}}>
								<PretendardVariableText size={14} lineHeight={18} color={colors.backgroundWhite}>
									편집
								</PretendardVariableText>
							</ModifyTouchable>
							<VStack>
								<PretendardVariableText size={12} lineHeight={18} color={colors.backgroundWhite}>
									{day[0].format('YY.MM.DD') + ' - ' + day[nDay].format('YY.MM.DD')}
								</PretendardVariableText>
								<HStack gap={widthPercentage(5)}>
									<PretendardSemiBoldText
										size={26}
										lineHeight={30}
										color={colors.backgroundWhite}
										width={widthPercentage(150)}>
										{cityViewList[country][cityIndex].title + ' ' + region}
									</PretendardSemiBoldText>
								</HStack>
							</VStack>
							<WhoContainer>
								<HStack width={widthPercentage(182)} gap={widthPercentage(9)}>
									<SvgContainer>{seasonList[season.findIndex(item => item == 1)].svg}</SvgContainer>
									<PretendardSemiBoldText
										size={18}
										lineHeight={22}
										color={colors.backgroundWhite}
										width={widthPercentage(113)}>
										{tendencyList[0]?.list[tendency[0].findIndex(item => item == 1)]}
										{tendency[0].find(item => item == 1) == undefined
											? ''
											: tendency[0].findIndex(item => item == 1) == 0 ||
											  tendency[0].findIndex(item => item == 1) == 4
											? ' '
											: ' 함께하는 '}
										{seasonList[season.findIndex(item => item == 1)].title} 여행
									</PretendardSemiBoldText>
								</HStack>
							</WhoContainer>
							<HStack gap={5}>
								<TouchTagContainer
									height={widthPercentage(28)}
									onPress={() => {
										handleTendencyModify(0, 'tendency');
									}}
									backgroundColor={colors.backgroundWhite}>
									<TagShopText color={colors.Primary} size={fontPercentage(15)}>
										#
									</TagShopText>
									<PretendardSemiBoldText size={16} lineHeight={20} color={colors.backgroundWhite}>
										{!transit ? '자동차·렌트카' : '대중교통'}
									</PretendardSemiBoldText>
								</TouchTagContainer>
								<TouchTagContainer
									height={widthPercentage(28)}
									onPress={() => {
										handleTendencyModify(1, 'tendency');
									}}
									backgroundColor={colors.backgroundWhite}>
									<TagShopText color={colors.Primary} size={fontPercentage(15)}>
										#
									</TagShopText>
									<PretendardSemiBoldText size={16} lineHeight={20} color={colors.backgroundWhite}>
										{bandwidth ? '여유있는 일정' : '알찬 일정'}
									</PretendardSemiBoldText>
								</TouchTagContainer>
							</HStack>
						</LinearGradient>
					</ImageContainer>

					<ScrollView
						horizontal={true}
						nestedScrollEnabled={true}
						showsHorizontalScrollIndicator={false}
						style={{marginVertical: widthPercentage(20)}}>
						{['내 여행 성향', ...Array.from({length: nDay + 1}, (item, index) => index)].map(
							(item, idx) => {
								return (
									<RegionItems
										key={idx}
										select={idx == viewType}
										onPress={() => {
											open.status && setOpen({...open, status: false});
											setViewType(idx);
										}}>
										<PretendardVariableText
											size={14}
											lineHeight={18.9}
											color={idx == viewType ? colors.backgroundWhite : colors.Gray400}>
											{idx == 0 ? item : `DAY ${item + 1}`}
										</PretendardVariableText>
									</RegionItems>
								);
							},
						)}
					</ScrollView>
					{viewType == 0 ? (
						<TendencyContainer>
							<ModifyTouchable
								onPress={() => {
									handleTendencyModify(1, 'tendency');
								}}>
								<PretendardVariableText size={14} lineHeight={18} color={colors.Black}>
									편집
								</PretendardVariableText>
							</ModifyTouchable>
							{tendency[1].find(item => item == 1) && (
								<TouchWhiteContainer
									width={widthPercentage(287)}
									onPress={() => {
										handleTendencyModify(0, 'tendency');
									}}>
									<PretendardSemiBoldText size={16} lineHeight={20.32} color={colors.Gray4}>
										여행테마
									</PretendardSemiBoldText>
									<FlexWrap gap={widthPercentage(4)} marginBottom={0}>
										{tendency[1].map((item, inx) => {
											return item ? (
												<TagContainer
													height={widthPercentage(28)}
													backgroundColor={colors.backgroundGray}
													key={inx}>
													<TagShopText color={colors.PointYellow} size={14}>
														#
													</TagShopText>
													<PretendardSemiBoldText
														size={14}
														lineHeight={18}
														color={colors.Gray5}>
														{tendencyList[1]?.list[inx]}
													</PretendardSemiBoldText>
												</TagContainer>
											) : null;
										})}
									</FlexWrap>
								</TouchWhiteContainer>
							)}
							{tendency[2].find(item => item == 1) && (
								<TouchWhiteContainer
									width={widthPercentage(287)}
									onPress={() => {
										handleTendencyModify(2, 'tendency');
									}}>
									<PretendardSemiBoldText size={16} lineHeight={20.32} color={colors.Gray4}>
										이런 걸 하고 싶어요
									</PretendardSemiBoldText>
									<FlexWrap gap={widthPercentage(4)} marginBottom={0}>
										{tendency[2].map((item, inx) => {
											return item ? (
												<TagContainer
													backgroundColor={colors.backgroundGray}
													key={inx}
													padding={widthPercentage(3)}
													height={heightPercentage(27)}>
													<PretendardSemiBoldText
														size={14}
														lineHeight={18}
														color={colors.PointYellow}>
														{tendencyList[2]?.list[inx]}
													</PretendardSemiBoldText>
												</TagContainer>
											) : null;
										})}
									</FlexWrap>
								</TouchWhiteContainer>
							)}
							{tendency[3].find(item => item == 1) && (
								<TouchWhiteContainer
									width={widthPercentage(287)}
									onPress={() => {
										handleTendencyModify(3, 'tendency');
									}}>
									<PretendardSemiBoldText size={16} lineHeight={20.32} color={colors.Gray4}>
										이런 곳에 가고 싶어요
									</PretendardSemiBoldText>
									<FlexWrap gap={widthPercentage(4)} marginBottom={0}>
										{tendency[3].map((item, inx) => {
											return item ? (
												<TagContainer
													backgroundColor={colors.backgroundGray}
													key={inx}
													padding={widthPercentage(3)}
													height={heightPercentage(27)}>
													<PretendardSemiBoldText
														size={14}
														lineHeight={18}
														color={colors.Gray5}>
														{tendencyList[3]?.list[inx]}
													</PretendardSemiBoldText>
												</TagContainer>
											) : null;
										})}
									</FlexWrap>
								</TouchWhiteContainer>
							)}

							<HStack marginHorizon={widthPercentage(10)} gap={10}>
								<PretendardSemiBoldText size={16} lineHeight={20.32} color={colors.Gray4}>
									여행지 반경
								</PretendardSemiBoldText>
								<TagContainer
									backgroundColor={colors.backgroundGray}
									padding={widthPercentage(3)}
									height={heightPercentage(27)}>
									<PretendardSemiBoldText size={14} lineHeight={18} color={colors.Gray5}>
										{distance}
									</PretendardSemiBoldText>
								</TagContainer>
							</HStack>
						</TendencyContainer>
					) : (
						(() => {
							const filteredPlaces = essentialPlaces.filter(place => place.day === viewType);
							return (
								<DayViewContainer>
									<HStack>
										<PretendardSemiBoldText size={14} lineHeight={16.7} color={colors.Primary}>
											{'DAY' + viewType}
										</PretendardSemiBoldText>
										<PretendardSemiBoldText size={14} lineHeight={16.7} color={colors.Gray5}>
											{'   '}
											{day[viewType - 1].format('YY.MM.DD') +
												' (' +
												weekdays[day[viewType - 1].days()] +
												')'}
										</PretendardSemiBoldText>
									</HStack>
									<MultiAllContainer>
										{filteredPlaces.length != 0 && (
											<FlexWrap gap={10} deco={'z-index:10;'}>
												<PretendardSemiBoldText
													size={14}
													lineHeight={16.7}
													color={colors.Gray2}
													deco={`margin-left:${widthPercentage(20)}px;`}>
													여행지
												</PretendardSemiBoldText>
												{filteredPlaces.map((data, index) => {
													const refKey = `${viewType}_${index}_key`;
													return (
														<ElementContainer color={colors.backgroundGray} key={index}>
															<VStack width={widthPercentage(233)}>
																<HStack gap={3}>
																	<PretendardSemiBoldText
																		size={16}
																		lineHeight={21.6}
																		color={colors.Gray5}
																		width={widthPercentage(200)}>
																		{data.name}
																	</PretendardSemiBoldText>
																	<PretendardSemiBoldText
																		size={12}
																		lineHeight={16.2}
																		color={colors.PointYellow}>
																		{data.takenTime / 60}시간
																	</PretendardSemiBoldText>
																</HStack>
																<PretendardVariableText
																	color={colors.Gray2}
																	size={12}
																	lineHeight={18}
																	numberOfLines={2}>
																	{data.formatted_address}
																</PretendardVariableText>
															</VStack>
															<VStack deco='z-index:1000'>
																<DotBox
																	ref={ref => {
																		dotRefs.current[refKey] = ref;
																	}}
																	onPress={() =>
																		dotRefs?.current[refKey]?.measure(
																			(fx, fy, width, height, px, py) => {
																				setOpen({
																					status: !open.status,
																					index: index,
																					day: viewType - 1,
																					type: 'essential',
																					x: px - width,
																					y: py - height,
																				});
																			},
																		)
																	}>
																	<SvgTripleDot />
																</DotBox>
															</VStack>
														</ElementContainer>
													);
												})}
											</FlexWrap>
										)}
										<ElementContainer color={colors.backgroundGray} height={heightPercentage(43)}>
											<SVGContainer
												disabled={filteredPlaces.length >= 3}
												onPress={() => {
													goSearchPlace({idx: viewType - 1, index: 0});
												}}
												color={
													filteredPlaces.length >= 3 ? colors.Gray1 : colors.PrimarySecondary
												}>
												<SVGPlus
													width={widthPercentage(16)}
													height={widthPercentage(16)}
													color={filteredPlaces.length >= 3 ? colors.Gray2 : '#6F853D'}
												/>
											</SVGContainer>
											<PretendardSemiBoldText size={14} lineHeight={16.7} color={colors.Gray2}>
												여행지 추가하기
											</PretendardSemiBoldText>
										</ElementContainer>
									</MultiAllContainer>
									{viewType - 1 != nDay && (
										<MultiAllContainer>
											<ElementContainer
												color={colors.backgroundGray}
												height={heightPercentage(43)}>
												{accommodations[viewType].name != '' ? (
													<PretendardSemiBoldText
														size={14}
														lineHeight={16.7}
														color={colors.Gray2}>
														숙소
													</PretendardSemiBoldText>
												) : (
													<>
														<SVGContainer
															onPress={() => {
																goSearchPlace({idx: viewType - 1, index: 1});
															}}
															color={
																accommodations[viewType].name
																	? colors.Gray1
																	: colors.PrimarySecondary
															}>
															<SVGPlus
																width={widthPercentage(16)}
																height={widthPercentage(16)}
																color={
																	accommodations[viewType].name
																		? colors.Gray2
																		: '#6F853D'
																}
															/>
														</SVGContainer>
														<PretendardSemiBoldText
															size={14}
															lineHeight={16.7}
															color={colors.Gray2}>
															숙소 추가하기
														</PretendardSemiBoldText>
													</>
												)}
											</ElementContainer>
											{accommodations[viewType].name && (
												<ElementContainer color={colors.backgroundGray}>
													<VStack width={widthPercentage(243)}>
														<PretendardSemiBoldText
															size={16}
															lineHeight={21.6}
															width={widthPercentage(200)}
															color={colors.Gray5}>
															{accommodations[viewType].name}
														</PretendardSemiBoldText>
														<PretendardVariableText
															color={colors.Gray2}
															size={12}
															lineHeight={18}
															numberOfLines={2}>
															{accommodations[viewType].formatted_address}
														</PretendardVariableText>
													</VStack>

													<VStack deco='z-index:1000'>
														<DotBox
															ref={ref => (dotRefs.current[`acc_${viewType}`] = ref)}
															onPress={() =>
																dotRefs?.current[`acc_${viewType}`]?.measure(
																	(fx, fy, width, height, px, py) => {
																		setOpen({
																			status: !open.status,
																			index: viewType - 1,
																			day: viewType - 1,
																			type: 'accommodation',
																			x: px - width,
																			y: py - height,
																		});
																	},
																)
															}>
															<SvgTripleDot />
														</DotBox>
													</VStack>
												</ElementContainer>
											)}
										</MultiAllContainer>
									)}
								</DayViewContainer>
							);
						})()
					)}
				</MainContainer>
				<MarginContainer />
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
											{
												essentialPlaces.filter(place => place.day === open.day + 1)?.[
													open.index
												]?.name
											}
										</PretendardSemiBoldText>
										<PretendardVariableText
											size={12}
											lineHeight={18}
											color={colors.Gray2}
											numberOfLines={1}>
											{
												essentialPlaces.filter(place => place.day === open.day + 1)?.[
													open.index
												]?.formatted_address
											}
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
									onPress={() =>
										modifyEssential(
											essentialPlaces.filter(place => place.day === open.day + 1)?.[open.index],
										)
									}
									backgroundColor={colors.Gray5}
									textColor={colors.backgroundWhite}></PrimaryButton>
							</BottomContainer>
						</ModalBottomSheet>
					</ModalBackground>
				</Modal>
			</BackgroundGray>
			<ButtonContainer>
				<CustomButton label='추천일정 조회' onPress={checkToken}></CustomButton>
			</ButtonContainer>
			<Modal animationType='fade' visible={tendencyModify.status} transparent={true}>
				<InModalContainer
					onPress={() => {
						handleClose();
					}}>
					{tendencyModify.type == 'tendency' ? (
						<InModal>
							{tendencyModify.index != 4 ? (
								<>
									<CancelBox onPress={() => handleClose()}>
										<SvgCancel
											style={{
												position: 'absolute',
												left: widthPercentage(301),
												top: widthPercentage(13),
											}}
											color={colors.Gray5}
											width={widthPercentage(18)}
											height={widthPercentage(18)}
										/>
									</CancelBox>
									<StepText
										mainText={tendencyList[tendencyModify.index].title}
										subText={
											tendencyList[tendencyModify.index].multi ? '* 중복 선택 가능' : '*단일선택'
										}></StepText>
									<ButtonsContainer>
										{tendencyList[tendencyModify.index]?.list.map((item, idx) => (
											<TendencyButton
												marginBottom={0}
												bgColor={tendency[tendencyModify.index][idx] == 1}
												label={item}
												key={idx}
												divide={true}
												imageUrl={tendencyList[tendencyModify.index]?.photo[idx]}
												onPress={() => {
													handleSelect(idx);
												}}></TendencyButton>
										))}
									</ButtonsContainer>
								</>
							) : (
								<>
									<CancelBox onPress={handleClose}>
										<SvgCancel
											style={{
												position: 'absolute',
												left: widthPercentage(301),
												top: widthPercentage(13),
											}}
											color={colors.Gray5}
											width={widthPercentage(18)}
											height={widthPercentage(18)}
										/>
									</CancelBox>
									<StepText
										mainText={'현재 위치에서 추천받고자 하는 여행 반경을 선택해 주세요'}
										subText={`그림은 이해를 돕기 위함으로\n실제 결과와는 차이가 있을 수 있습니다.`}></StepText>
									<MapContainer>
										<Qwe>
											<MapView
												//provider={PROVIDER_GOOGLE}
												showsMyLocationButton={false}
												showsUserLocation={false}
												style={{
													width: widthPercentage(327),
													height: heightPercentage(240),
													position: 'absolute',
												}}
												region={{
													latitude: cityViewList[country][cityIndex].sub[cityDistance[0]].lat,
													longitude:
														cityViewList[country][cityIndex].sub[cityDistance[0]].lng,
													latitudeDelta: cityDistance[0] == 0 ? 0.8 : 0.2,
													longitudeDelta: cityDistance[0] == 0 ? 0.8 : 0.2,
												}}>
												<Circle
													center={{
														latitude:
															cityViewList[country][cityIndex].sub[cityDistance[0]].lat,
														longitude:
															cityViewList[country][cityIndex].sub[cityDistance[0]].lng,
													}}
													style={{alignItems: 'center', justifyContent: 'center'}}
													fillColor='rgba(38, 152, 251, 0.3);'
													radius={distance * (cityDistance[0] == 0 ? 5000 : 1500)}></Circle>
											</MapView>
										</Qwe>
									</MapContainer>
									<DistanceCenter>
										<DistanceSpace>
											<PretendardSemiBoldText size={12} lineHeight={14.32} color={colors.Gray3}>
												내 근처
											</PretendardSemiBoldText>
											<PretendardSemiBoldText size={12} lineHeight={14.32} color={colors.Gray3}>
												전체
											</PretendardSemiBoldText>
										</DistanceSpace>
										<Slider
											style={{width: '100%', height: 40}}
											minimumValue={1}
											maximumValue={10}
											minimumTrackTintColor={colors.Primary}
											maximumTrackTintColor={colors.Gray2}
											thumbTintColor={colors.Primary}
											value={distance}
											step={1}
											onValueChange={item => {
												dispatch(travelSliceActions.enrollDistance(item));
											}}
										/>
									</DistanceCenter>
								</>
							)}

							{tendencyModify.index == 0 ? (
								<ButtonContainer>
									<CustomButton
										marginBottom={12}
										bgColor={colors.Primary}
										textColor={colors.Gray5}
										isDisabled={false}
										label='다음으로'
										onPress={handleModifyModalFunction}
									/>
								</ButtonContainer>
							) : (
								<RouteButton
									navigation={navigation}
									nextTitle='RecommendSelectMove'
									nextText={tendencyModify.index == 4 ? '완료' : undefined}
									LeftBtnFunction={handleModifyModalBackFunction}
									goNext={handleModifyModalFunction}></RouteButton>
							)}
						</InModal>
					) : (
						<InModal>
							<CancelBox onPress={handleClose}>
								<SvgCancel
									style={{
										position: 'absolute',
										left: widthPercentage(301),
										top: widthPercentage(13),
									}}
									color={colors.Gray5}
									width={widthPercentage(18)}
									height={widthPercentage(18)}
								/>
							</CancelBox>
							<StepText
								mainText={tendencyModify.index ? '어떻게 이동하시나요?' : '어떤 여행을 원하시나요?'}
								subText={'* 단일선택'}></StepText>
							{tendencyModify.index == 0 ? (
								<SelectMoveContainer>
									{BinaryList[tendencyModify.index]?.map((item, idx) => (
										<SelectButton
											color={idx == transit ? 'rgba(195,245,80,0.3)' : colors.Gray1}
											key={idx}
											onPress={item.function}>
											{item?.image}
											<PretendardSemiBoldText size={15} lineHeight={18} color={colors.Gray4}>
												{item.name}
											</PretendardSemiBoldText>
										</SelectButton>
									))}
								</SelectMoveContainer>
							) : (
								<SelectButtonsContainer>
									{BinaryList[tendencyModify.index].map((item, idx) => (
										<TendencyButton
											bgColor={bandwidth == Boolean(idx)}
											label={item.name}
											imageUrl={item?.photo}
											key={idx}
											onPress={item.function}></TendencyButton>
									))}
								</SelectButtonsContainer>
							)}
							<RouteButton
								navigation={navigation}
								nextTitle='RecommendSelectMove'
								nextText={tendencyModify.index == 1 ? '완료' : undefined}
								LeftBtnFunction={handleModifyModalBackFunction}
								goNext={handleModifyModalFunction}></RouteButton>
						</InModal>
					)}
				</InModalContainer>
			</Modal>
			{/* <Modal animationType='fade' visible={binaryModify.status} transparent={true}>
				<InModalContainer onPress={handleBinaryClose}>
					<InModal>
						<SvgCancel
							style={{alignSelf: 'flex-end'}}
							color={colors.Gray5}
							width={widthPercentage(18)}
							height={widthPercentage(18)}
						/>
						<StepText
							mainText={binaryModify.index ? '어떻게 이동하시나요?' : '어떤 여행을 원하시나요?'}
							subText={'* 단일선택'}></StepText>
						{binaryModify.index == 0 ? (
							<SelectMoveContainer>
								{BinaryList[binaryModify.index]?.map((item, idx) => (
									<SelectButton
										color={idx == transit ? 'rgba(195,245,80,0.3)' : colors.Gray1}
										key={idx}
										onPress={item.function}>
										{item?.image}
										<PretendardSemiBoldText size={15} lineHeight={18} color={colors.Gray4}>
											{item.name}
										</PretendardSemiBoldText>
									</SelectButton>
								))}
							</SelectMoveContainer>
						) : (
							<SelectButtonsContainer>
								{BinaryList[binaryModify.index].map((item, idx) => (
									<TendencyButton
										bgColor={bandwidth == Boolean(idx)}
										label={item.name}
										imageUrl={item?.photo}
										key={idx}
										onPress={item.function}></TendencyButton>
								))}
							</SelectButtonsContainer>
						)}
						<RouteButton
							navigation={navigation}
							nextTitle='RecommendSelectMove'
							nextText={binaryModify.index == 1 ? '완료' : undefined}
							LeftBtnFunction={handleModifyModalBackFunction}
							goNext={handleModifyModalFunction}></RouteButton>
					</InModal>
				</InModalContainer>
			</Modal> */}
			{open.status && (
				<Dropdown x={open.x} y={open.y - totalTopHeight}>
					{open.type == 'essential' && (
						<DropdownElement
							onPress={() => {
								setOpen({...open, status: false});
								setModify(true);
							}}>
							<PretendardSemiBoldText color={colors.Gray5} size={14} lineHeight={18}>
								편집
							</PretendardSemiBoldText>
						</DropdownElement>
					)}
					<DropdownElement
						onPress={() => {
							console.log(open, accommodations);
							open.type == 'essential' ? checkDeleteEssential() : checkDeleteAccommodation(open.day + 1);
						}}>
						<PretendardSemiBoldText color={colors.Gray5} size={14} lineHeight={18}>
							삭제
						</PretendardSemiBoldText>
					</DropdownElement>
				</Dropdown>
			)}
		</>
	);
}
const ButtonsContainer = styled.View`
	flex: 1;
	justify-content: center;
	flex-direction: row;
	flex-wrap: wrap;
	align-items: center;
	margin-top: ${heightPercentage(84)}px;
	gap: ${widthPercentage(8)}px;
`;
const InModal = styled.View`
	width: 100%;
	height: ${heightPercentage(688)}px;
	background-color: ${colors.backgroundWhite};
	border-top-left-radius: 30px;
	border-top-right-radius: 30px;
	padding: ${heightPercentage(17)}px ${widthPercentage(24)}px;
`;
const InModalContainer = styled.Pressable`
	flex: 1;
	justify-content: flex-end;
	align-items: center;
	background-color: rgba(0, 0, 0, 0.6);
`;
export const RegionImage = styled.Image`
	width: ${widthPercentage(50)}px;
	height: ${heightPercentage(50)}px;
	border-radius: 12px;
`;
const SvgContainer = styled.View`
	width: ${widthPercentage(46)}px;
	height: ${widthPercentage(46)}px;
	background-color: rgba(248, 249, 252, 0.4);
	border-radius: 6.4px;
	align-items: center;
	justify-content: center;
`;
export const WhiteContainer = styled.View<{
	width?: number;
	justifyContent?: string;
	alignItems?: string;
	deco?: string;
}>`
	width: ${props => props.width + 'px' ?? '100%'};
	background-color: ${colors.backgroundWhite};
	border-radius: 8px;
	align-items: ${props => props.alignItems ?? 'flex-start'};
	justify-content: ${props => props.justifyContent ?? 'center'};
	padding: ${heightPercentage(8)}px ${widthPercentage(10)}px;
	gap: ${widthPercentage(3)}px;
	margin-bottom: ${heightPercentage(10)}px;
	${props => props.deco}
`;
const TouchWhiteContainer = styled(WhiteContainer).attrs({as: TouchableOpacity})``;
const MultiAllContainer = styled.View`
	width: ${widthPercentage(300)}px;
	border-radius: 12px;
	background-color: ${colors.backgroundGray};
	gap: ${widthPercentage(3)}px;
	z-index: 0;
`;
const Parent = styled.View`
	flex-direction: row;
	overflow: hidden;
	position: relative;
	width: 100%;
	gap: ${widthPercentage(6)}px;
`;
const WhoContainer = styled.View``;
const MoveImage = styled.Image`
	width: ${widthPercentage(60)}px;
	height: ${heightPercentage(110)}px;
`;

const TouchTagContainer = styled(TagContainer).attrs({as: TouchableOpacity})`
	background-color: rgba(248, 249, 252, 0.4);
	padding: ${widthPercentage(4)}px;
	height: auto;
`;
const SelectMoveContainer = styled.View`
	flex: 1;
	flex-direction: row;
	align-items: center;
	justify-content: space-around;
`;
const SelectButton = styled.TouchableOpacity<{color: string}>`
	background-color: ${props => props.color};
	border-radius: 16px;
	width: ${widthPercentage(137)}px;
	height: ${widthPercentage(137)}px;
	align-items: center;
	justify-content: center;
	padding-bottom: ${heightPercentage(5)}px;
	gap: ${heightPercentage(10)}px;
`;

const ImageContainer = styled.View`
	width: ${widthPercentage(327)}px;
	height: ${widthPercentage(195)}px;
	border-radius: 8px;
`;
const BackgroundImage = styled.Image`
	position: absolute;
	width: ${widthPercentage(327)}px;
	height: ${widthPercentage(195)}px;
	border-radius: 8px;
`;
const TendencyContainer = styled.View`
	width: ${widthPercentage(327)}px;
	border-radius: 8px;
	border-width: 1px;
	border-color: ${colors.Gray200};
	padding: ${widthPercentage(20)}px ${widthPercentage(24)}px;
	background-color: ${colors.backgroundWhite};
`;

const RegionItems = styled.TouchableOpacity<{select: boolean}>`
	justify-content: center;
	align-items: center;
	padding: ${heightPercentage(8)}px ${widthPercentage(16)}px;
	background-color: ${props => (props.select ? colors.Gray5 : colors.backgroundWhite)};
	border-radius: 99px;
`;
const ModifyTouchable = styled.TouchableOpacity`
	position: absolute;
	left: ${widthPercentage(278)}px;
	top: ${widthPercentage(20)}px;
	z-index: 102;
`;

const CancelBox = styled.TouchableOpacity``;
