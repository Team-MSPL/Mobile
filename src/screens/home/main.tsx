import {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

import {useAppDispatch, useAppSelector} from '../../redux';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {getSellingProduct, travelSliceActions} from '../../redux/travel-info/travel.slice';
import {getNoteList, userSliceActions} from '../../redux/user/user.slice';
import {regionRecommendSliceActions} from '../../redux/travel-info/region-recommend.slice';
import {eventSliceActions, getEventList} from '../../redux/event/event.slice';
import {getHomeRegionInfo, getPlaceRecommendInMainScreen} from '../../redux/setting/settingSlice';

import {colors} from '../../utill/colors';
import {
	HStack,
	PretendardBoldText,
	PretendardSemiBoldText,
	PretendardVariable,
	PretendardVariableText,
	VStack,
} from '../../utill/layout/layout';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import styled from 'styled-components/native';

import {useBackHandler} from '../../utill/hooks/useBackhandler';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';
import {Button, FlatList, Linking, Modal, Platform, SafeAreaView, StyleSheet, View, Text} from 'react-native';
import ViewPager from '../../utill/view-pager';
import {useViewPager} from '../../utill/hooks/useViewPager';
import {logEvent, setUserId, setUserProperty} from '../../../firebaseAnalytice';
import {useTranslation} from 'react-i18next';
import Carousel from 'react-native-reanimated-carousel';

import ImageRecursion from '../../utill/component/home/imageRecursion';

import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';

export default function Main({navigation}: any) {
	const {homeRegionImage, appLanguages} = useAppSelector(state => state.settingSlice);
	const {userName, signUpReward, reLogin, userId, analyticeFlag, socialloginProvider} = useAppSelector(
		state => state.userSlice,
	);
	const {eventList} = useAppSelector(state => state.eventSlice);

	const {selectStartDate, shareLoginFlag, recommendProducts, hotProducts} = useAppSelector(
		state => state.travelSlice,
	);
	const dispatch = useAppDispatch();
	const [mainScreens, setMainScreens] = useState<mainScreensType[]>([]);
	const {t, i18n} = useTranslation();
	const [bannerIndex, setBannerIndex] = useState(0);
	const regionRecommend = async () => {
		dispatch(regionRecommendSliceActions.reset());
		dispatch(travelSliceActions.reset());
		navigation.navigate('SelectCountry');
		await logEvent('place_step1', {});
	};
	const goEnroll = async e => {
		let season = Array(4).fill(0);
		let index = Math.floor((selectStartDate.month() + 1) / 3) - 1;
		index < 0 ? (season[3] = 1) : (season[index] = 1);
		dispatch(travelSliceActions.setTravelStart({makeMode: e, season: season, globalFlag: false}));
		navigation.navigate('EnrollTravelTitle');

		await logEvent(e, {});
	};
	const goCourseDetaile = (e: any) => {
		let metropolitanStatus = metropolitanCheckList.includes(e.region);
		const data = {
			name: e.name,
			lat: e.lat,
			lng: e.lng,
			region: e.region,
			metropolitan: metropolitanStatus,
			mainFlag: true,
			photo: e.photo,
		};
		navigation.navigate('CourseDetail', {value: data});
	};

	const pushPermission = async () => {
		const authStatus = await messaging().requestPermission();
		dispatch(userSliceActions.setPushNotify(authStatus ? true : false));
	};
	const checkEvent = async () => {
		if (eventState == null) {
			const eventExist = await dispatch(getEventList()).unwrap();
			const state = await AsyncStorage.getItem('eventState');
			if (state != moment().format('DD').toString() && eventExist.eventList.length != 0) {
				dispatch(eventSliceActions.setEventState(true));
			}
		}
	};
	const getMainScreen = async () => {
		try {
			const data = await dispatch(getPlaceRecommendInMainScreen()).unwrap();
			setMainScreens(data);
		} catch (err) {}
	};
	// useFocusEffect(
	// 	useCallback(() => {
	// 		recursionCall();
	// 	}, []),
	// );
	const countRef = useRef(0);
	const recursionCall = () => {
		const tick = setTimeout(async () => {
			countRef.current += 1;
			let randomKey = Math.floor(Math.random() * regionList.length);
			let searchRegion = regionList[randomKey].subTitle;
			await dispatch(getHomeRegionInfo({region: searchRegion.trimStart()}));
			recursionCall();
		}, 5000);
		if (countRef.current < 5) {
			tick;
		} else {
			clearTimeout(tick);
		}
	};
	const getFirstRegion = async () => {
		await dispatch(getHomeRegionInfo({region: '경북 경주시'}));
	};
	const handleGoogleAnalytics = async () => {
		if (socialloginProvider == 'anonymous') {
			await logEvent('anonymous_login', {});
			await setUserId(userId ?? '');
			await setUserProperty('anonymous_user_id', userId ?? '');
		} else {
			await logEvent('login', {});
			await setUserId(userId ?? '');
			await setUserProperty('user_id', userId ?? '');
		}

		dispatch(userSliceActions.setAnalyticeFlag(true));
	};
	const [noteList, setNoteList] = useState([]);

	const {eventState} = useAppSelector(state => state.eventSlice);
	const getNoteListData = async () => {
		try {
			const dataList = await dispatch(getNoteList()).unwrap();
			setNoteList(dataList);
		} catch (err) {
			dispatch(modalSliceActions.setOpenModal({modalTitle: '잠시후 다시 시도해주세요'}));
		} finally {
		}
	};
	const handleProduct = async () => {
		const type = {
			country: '베트남',
			company: '(주)수호천사컴퍼니',
			regions: '나트랑,다낭', // 예) regions=나트랑,다낭 <- 이런식으로 ,로 구분해서
			type: 'package', //투어 : "tour", 패키지 : "package"
			period: 3, // 여행 기간, 예) 3 -> 2박 3일 (투어 상품일 경우 필요x)
			places: '쩐꾸옥 사원, 공항', // AI 실행 결과 중 숙소 제외하고
			// 예) places=쩐꾸옥 사원, 공항 <- 이런식으로 ,로 구분해서 string으로 주면 됨
		};
		const result = await dispatch(getSellingProduct(type)).unwrap();
		dispatch(travelSliceActions.enrollRecommendProducts(result.data.results));
	};
	const handleHotProduct = async () => {
		//TODO핫플레이스 변경하기
		const type = {
			country: '베트남',
			company: '(주)수호천사컴퍼니',
			regions: '나트랑,다낭', // 예) regions=나트랑,다낭 <- 이런식으로 ,로 구분해서
			type: 'package', //투어 : "tour", 패키지 : "package"
			period: 3, // 여행 기간, 예) 3 -> 2박 3일 (투어 상품일 경우 필요x)
			places: '쩐꾸옥 사원, 공항', // AI 실행 결과 중 숙소 제외하고
			// 예) places=쩐꾸옥 사원, 공항 <- 이런식으로 ,로 구분해서 string으로 주면 됨
		};
		const result = await dispatch(getSellingProduct(type)).unwrap();
		dispatch(travelSliceActions.enrollHotProducts(result.data.results));
	};
	useFocusEffect(
		useCallback(() => {
			getNoteListData();
		}, []),
	);
	useLayoutEffect(() => {
		checkEvent();
		getMainScreen();
		getFirstRegion();
		handleProduct();
		handleHotProduct();
	}, []);
	useEffect(() => {
		shareLoginFlag && navigation.navigate('Timetable');
		!analyticeFlag && handleGoogleAnalytics();
	}, []);
	useEffect(() => {
		if (eventState == false) {
			socialloginProvider != 'anonymous' && checkCache();
		}
	}, [eventState, socialloginProvider]);
	useEffect(() => {
		pushPermission();
		getMainViewPager();
		if (
			navigation.getState().routes[navigation.getState().index].name != 'FinalCheck' &&
			navigation.getState().routes[navigation.getState().index].name != 'RegionSelectDistance' &&
			signUpReward
		) {
			navigation.navigate('HomeModal', {status: '회원가입'});
		} else if (reLogin) {
			navigation.navigate('HomeModal', {status: '재가입'});
		}
	}, [signUpReward, socialloginProvider]);

	useBackHandler({type: 'exit'});
	const buttonList: ButtonListType[] = [
		{
			id: 1,
			onPress: regionRecommend,
			image: <ImgContainer resizeMode='cover' source={require('../../../public/main/region.png')}></ImgContainer>,
			text: `여행은 가고 싶은데,${`\n`}어디로 가야 할지 모르겠다면? `,
			title: '여행 지역 추천',
		},
		{
			id: 2,
			onPress: () => goEnroll('recommend'),
			image: <ImgContainer resizeMode='cover' source={require('../../../public/main/course.png')}></ImgContainer>,
			text: `여행지는 정했는데,${`\n`}계획 세우기 귀찮다면?`,
			title: '여행 코스 추천',
		},
		{
			id: 3,
			onPress: () => goEnroll('planner'),
			image: (
				<ImgContainer resizeMode='cover' source={require('../../../public/main/planner.png')}></ImgContainer>
			),
			text: `자유롭게 여행 계획을 세워보세요!`,
			title: '여행 플래너',
		},
	];
	const hanldeCooperation = async (e: {title: string; link: string; photo: any}) => {
		if (e.title == 'travleMedic') {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '다님 이용자만을 위한 할인쿠폰이에요!',
					modalTopText: '쿠폰 사용하러 가기 (홈페이지 이동)',
					modalFunction: async () => {
						await logEvent('home ' + e?.title, {});
						Linking.openURL(e.link);
					},
					travleMedic: true,
					modalSubTitle: '* 해외3개월이하 보험가입시 적용됩니다.',
				}),
			);
		} else {
			await logEvent('home ' + e?.title, {});
			Linking.openURL(e.link);
		}
	};

	const setPreset = (data: {
		preset: any;
		presetTendency: any;
		day: any;
		nDay: any;
		transit: any;
		tendency: any;
		travelName: any;
		region: any;
		aiId: any;
	}) => {
		dispatch(
			travelSliceActions.setCache({
				presetDatas: JSON.parse(data.preset),
				presetTendency: JSON.parse(data.presetTendency),
				day: JSON.parse(data.day),
				nDay: Number(data.nDay),
				transit: Number(data.transit),
				tendency: JSON.parse(data.tendency),
				travelName: data.travelName,
				region: data.region.split(','),
				aiId: data.aiId,
			}),
		);
		navigation.navigate('Preset');
	};
	const {getMainViewPager, deleteMainViewPager, viewPagerState} = useViewPager({title: 'mainViewPager'});
	const checkCache = async () => {
		let [preset, presetTendency, day, nDay, transit, tendency, travelName, region, aiId] =
			await AsyncStorage.multiGet([
				'preset',
				'presetTendency',
				'day',
				'nDay',
				'transit',
				'tendency',
				'travelName',
				'region',
				'aiId',
			]);
		if (preset[1] != null) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '코스추천',
					modalSubTitle: '저장되지않은 추천결과가 있습니다. 확인하러가시겠습니까?',
					modalFunction: () =>
						setPreset({
							preset: preset[1],
							presetTendency: presetTendency[1],
							day: day[1],
							nDay: nDay[1],
							transit: transit[1],
							tendency: tendency[1],
							travelName: travelName[1],
							region: region[1],
							aiId: aiId[1],
						}),
					modalLeft: true,
				}),
			);
		}
		AsyncStorage.multiRemove([
			'preset',
			'presetTendency',
			'day',
			'nDay',
			'transit',
			'tendency',
			'travelName',
			'aiId',
		]);
	};
	const vividList = [
		{
			name: '쥬쥬',
			region: '전남 순천시 여행',
			title: '친구의 추천으로 한번 사용해봤습니다. 여행 계획 짜는걸 굉장히 싫어하는데 대신 짜주니 굉장히 편리하네요 특히 제가 처한 상황이나 특징을 고려해서 짜주는게 좋았습니다.',
			photo: require('../../../public/main/zoo.png'),
		},
		{
			name: '카우준',
			region: '경남 김해시 여행',
			title: '여행 계획 짤때마다 다 비슷해서 싫었는데 이 앱은 제가 원하는 조건을 입력하면 그에따른 결과 값을 줘서 좋은거같아요',
			photo: require('../../../public/main/jun.png'),
		},
		// {
		// 	name: '맨유맨',
		// 	region: '강원 원주시 여행',
		// 	title: '여행 계획 짜기 귀찮았는데 ,클릭 몇 번으로 여행 계획 만들어줘서 좋았다 다음에 여행 계획 짤때 또 사용할 듯 하다',
		// },
	];
	const displayList = [
		...eventList.filter(item => !!item?.eventBannerImage),
		{
			type: 'instagram',
			eventLink: 'https://www.instagram.com/danim_kr/',
			eventImage:
				'https://firebasestorage.googleapis.com/v0/b/danim-image/o/event%2F%E1%84%83%E1%85%A1%E1%84%82%E1%85%B5%E1%86%B7%E1%84%8B%E1%85%B5%E1%86%AB%E1%84%89%E1%85%B3%E1%84%90%E1%85%A1.png?alt=media&token=1fb05468-5a33-4737-acfb-e90be34dd378',
			eventBannerImage:
				'https://firebasestorage.googleapis.com/v0/b/danim-image/o/event%2F%E1%84%83%E1%85%A1%E1%84%82%E1%85%B5%E1%86%B7%E1%84%8B%E1%85%B5%E1%86%AB%E1%84%89%E1%85%B3%E1%84%90%E1%85%A1.png?alt=media&token=1fb05468-5a33-4737-acfb-e90be34dd378',
		},
	];

	const sheetRef = useRef<BottomSheet>(null);

	// variables
	const snapPoints: ReadonlyArray<string | number> = useMemo(() => [Platform.OS == 'ios' ? '50%' : '50%', '99%'], []);

	// callbacks
	const handleSheetChange = useCallback((index: number) => {
		console.log('handleSheetChange', index);
	}, []);
	const renderItem = useCallback(
		() => (
			<HomeBottomContainer>
				<VStack gap={5}>
					<PretendardSemiBoldText size={20} lineHeight={26.6} color={colors.Black}>
						성향에 딱 맞는 여행,{' '}
						<PretendardSemiBoldText
							size={20}
							lineHeight={26.6}
							color={colors.Black}
							deco={`background-color:${colors.Green1}`}>
							다님 AI
						</PretendardSemiBoldText>
						가 추천 해줘요
					</PretendardSemiBoldText>
					<PretendardSemiBoldText size={16} lineHeight={21.6} color={colors.PointYellow}>
						1분 투자로 하루를 아껴보세요!
					</PretendardSemiBoldText>
				</VStack>
				<VStack justifyContent='space-around'>
					{buttonList.map(item => (
						<RecommendContainer onPress={item.onPress} key={item.id}>
							<View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
								{item.image}
							</View>
							<LinearGradient
								start={{x: 0, y: 0}}
								end={{x: 0, y: 1}}
								colors={['rgba(255,255,255,0)', 'black']}
								style={{
									zIndex: 101,
									position: 'absolute',
									width: '100%',
									paddingHorizontal: widthPercentage(10),
									height: '100%',
									alignItems: 'center',
									justifyContent: 'flex-end',
									gap: heightPercentage(15),
									paddingBottom: heightPercentage(10),
								}}>
								<PretendardSemiBoldText
									size={20}
									lineHeight={25}
									color={colors.backgroundWhite}
									deco={'text-align:center'}>
									{item.text}
								</PretendardSemiBoldText>
								<StartButton onPress={item.onPress}>
									<PretendardSemiBoldText
										size={20}
										lineHeight={30}
										color={colors.Primary}
										numberOfLines={1}
										adjustsFontSizeToFit
										minimumFontScale={0.5}
										style={{
											width: '100%',
											textAlign: 'center',
											includeFontPadding: false,
										}}>
										{item.title}
									</PretendardSemiBoldText>
								</StartButton>
							</LinearGradient>
						</RecommendContainer>
					))}
				</VStack>
				{recommendProducts.length > 0 && (
					<>
						<VStack deco={`margin-top:40px;margin-left:${widthPercentage(12)}`}>
							<PretendardSemiBoldText size={20} lineHeight={23.6} color={colors.Black}>
								맞춤 여행 상품
							</PretendardSemiBoldText>
							<PretendardVariableText size={16} lineHeight={20} color={colors.Gray4}>
								선택하신 일정과 관련된 여행 상품을 모아봤어요!
							</PretendardVariableText>
							<Carousel
								style={{
									marginTop: 18,
									marginBottom: 50,
								}}
								width={widthPercentage(375)}
								height={widthPercentage(335)}
								autoPlay={true}
								data={recommendProducts}
								autoPlayInterval={2000}
								renderItem={({index}) => (
									<CollectionTouchableOpacity
										onPress={() => {
											Linking.openURL(recommendProducts[index]?.product?.sellingProductLink);
											// goCourseDetaile(mainScreens[index]);
										}}>
										<ImageContainer width={335} height={335}>
											<CollectionRecommendContentItemImage
												width={335}
												height={335}
												source={{
													uri: recommendProducts[index]?.product?.sellingProductImage[0],
												}}></CollectionRecommendContentItemImage>
											<LinearGradient
												start={{x: 0, y: 0}}
												end={{x: 0, y: 1}}
												colors={['rgba(255,255,255,0)', 'black']}
												style={{
													zIndex: 101,
													position: 'absolute',
													width: '100%',
													paddingHorizontal: widthPercentage(24),
													paddingBottom: widthPercentage(20),
													height: '100%',
													alignItems: 'flex-start',
													justifyContent: 'flex-end',
													borderRadius: 12,
												}}>
												<PretendardSemiBoldText
													size={20}
													lineHeight={26}
													numberOfLines={1}
													color={colors.backgroundWhite}>
													{recommendProducts[index]?.product?.sellingProductName}
												</PretendardSemiBoldText>
												<PretendardVariableText
													size={16}
													lineHeight={20}
													numberOfLines={1}
													color={colors.Primary}>
													{recommendProducts[index]?.product?.sellingProductContent}
												</PretendardVariableText>
												<PretendardVariableText
													size={24}
													lineHeight={28}
													numberOfLines={1}
													color={colors.backgroundWhite}>
													{recommendProducts[index]?.product?.sellingProductPrice}원~
												</PretendardVariableText>
											</LinearGradient>
										</ImageContainer>
									</CollectionTouchableOpacity>
								)}
							/>
						</VStack>
					</>
				)}
				<CollectionContainer>
					<PretendardSemiBoldText size={20} lineHeight={24.6} color={colors.Gray5}>
						다님이 추천하는 여행지
					</PretendardSemiBoldText>
					<Carousel
						style={{
							marginTop: 18,
							marginBottom: 50,
						}}
						width={widthPercentage(375)}
						height={widthPercentage(300)}
						autoPlay={true}
						data={mainScreens}
						autoPlayInterval={2000}
						mode='parallax'
						modeConfig={{
							parallaxScrollingScale: 1, // 옆 아이템 크기 비율
							parallaxScrollingOffset: widthPercentage(60), // 옆 아이템이 보여질 정도
						}}
						renderItem={({index}) => (
							<CollectionTouchableOpacity
								onPress={() => {
									goCourseDetaile(mainScreens[index]);
								}}>
								<ImageContainer width={300} height={300}>
									<CollectionRecommendContentItemImage
										width={300}
										height={300}
										source={{uri: mainScreens[index].photo}}></CollectionRecommendContentItemImage>
									<LinearGradient
										start={{x: 0, y: 0}}
										end={{x: 0, y: 1}}
										colors={['rgba(255,255,255,0)', 'black']}
										style={{
											zIndex: 101,
											position: 'absolute',
											width: '100%',
											paddingHorizontal: widthPercentage(24),
											paddingBottom: widthPercentage(20),
											height: '100%',
											alignItems: 'flex-start',
											justifyContent: 'flex-end',
											borderRadius: 12,
										}}>
										<PretendardSemiBoldText
											size={20}
											lineHeight={26}
											numberOfLines={1}
											color={colors.backgroundWhite}>
											{mainScreens[index].name}
										</PretendardSemiBoldText>
										<PretendardVariableText
											size={18}
											lineHeight={24}
											numberOfLines={1}
											color={colors.backgroundWhite}>
											{mainScreens[index]?.subTitle}
										</PretendardVariableText>
									</LinearGradient>
								</ImageContainer>
							</CollectionTouchableOpacity>
						)}
					/>
				</CollectionContainer>
				<Carousel
					loop={displayList.length > 1}
					autoPlay={displayList.length > 1}
					scrollAnimationDuration={displayList.length > 1 ? 300 : 0}
					autoPlayInterval={displayList.length > 1 ? 4000 : 0}
					mode={displayList.length > 1 ? 'parallax' : 'default'}
					modeConfig={
						displayList.length > 1
							? {
									parallaxScrollingScale: 0.9,
									parallaxScrollingOffset: 40,
							  }
							: undefined
					}
					style={{
						alignSelf: displayList.length == 1 ? 'center' : undefined,
						marginBottom: widthPercentage(40),
					}}
					width={widthPercentage(327)}
					height={widthPercentage(160)}
					data={displayList}
					onSnapToItem={e => {}}
					renderItem={({index}) => (
						<EventContainer
							onPress={() => {
								if (displayList[index]?.eventLink == '') {
								} else {
									if (displayList[index]?.eventLink.includes('http')) {
										Linking.openURL(displayList[index]?.eventLink);
									} else {
										navigation.navigate(displayList[index]?.eventLink);
									}
								}
							}}>
							<EventImage
								resizeMode='contain'
								source={
									displayList[index]?.type == 'instagram'
										? require('../../../public/main/instagram.png')
										: {
												uri: displayList[index]?.eventBannerImage,
										  }
								}></EventImage>
							<EventIndex>
								<PretendardVariableText size={14} lineHeight={18} color={colors.backgroundWhite}>
									{index + 1} /{' '}
									<PretendardVariableText size={14} lineHeight={18} color={'#9F9F9F'}>
										{displayList.length}
									</PretendardVariableText>
								</PretendardVariableText>
							</EventIndex>
						</EventContainer>
					)}
				/>
				{hotProducts.length > 0 && (
					<>
						<VStack>
							<LinearGradient
								start={{x: 0, y: 0}}
								end={{x: 0, y: 1}}
								colors={['#ffffff', '#cfe1a5', '#cfe1a5', '#ffffff']}
								locations={[0, 0.18, 0.88, 1]} // ✅ 위치 지정 (0 ~ 1 사이의 값)
								style={{
									width: widthPercentage(375),
									paddingTop: widthPercentage(70),
									paddingBottom: widthPercentage(70),
									alignItems: 'flex-start',
									justifyContent: 'flex-end',
									borderRadius: 12,
									paddingLeft: widthPercentage(20),
									marginLeft: -widthPercentage(8),
								}}>
								<PretendardSemiBoldText size={20} lineHeight={23.6} color={colors.Black}>
									요즘 뜨는 여행 상품
								</PretendardSemiBoldText>
								<PretendardVariableText
									size={16}
									lineHeight={20}
									color={colors.Gray4}
									deco={`margin-bottom:${widthPercentage(5)}px;`}>
									많은 사람들이 찾는 여행 상품이에요
								</PretendardVariableText>
								{hotProducts.slice(0, 3)?.map((item, index) => (
									<HotProductBox>
										<HStack>
											<CollectionRecommendContentItemImage
												width={93}
												height={93}
												source={{
													uri: item?.product?.sellingProductImage[0],
												}}></CollectionRecommendContentItemImage>
											<VStack flex={1} deco={`margin-left:${widthPercentage(15)}px;`}>
												<VStack>
													<PretendardSemiBoldText
														size={20}
														lineHeight={26}
														numberOfLines={1}
														color={colors.Black}>
														{item?.product?.sellingProductName}
													</PretendardSemiBoldText>
													<PretendardVariableText
														size={16}
														lineHeight={20}
														numberOfLines={1}
														color={'#6F853D'}>
														{item?.product?.sellingProductContent}
													</PretendardVariableText>
												</VStack>
												<PretendardVariableText
													size={18}
													lineHeight={21}
													numberOfLines={1}
													color={colors.Black}
													deco={'margin-top:10px;'}>
													{item?.product?.sellingProductPrice}원~
												</PretendardVariableText>
											</VStack>
										</HStack>
									</HotProductBox>
								))}
								<HotMoreButton
									onPress={() => {
										navigation.navigate('Products');
									}}>
									<PretendardSemiBoldText
										size={20}
										lineHeight={24}
										numberOfLines={1}
										color={colors.Gray4}>
										여행 상품 더보기
									</PretendardSemiBoldText>
								</HotMoreButton>
							</LinearGradient>
						</VStack>
					</>
				)}
				<PretendardSemiBoldText
					size={20}
					lineHeight={24.6}
					color={colors.Gray5}
					deco={`margin-left:${widthPercentage(6)}`}>
					다님 사용자들의 생생한 후기
				</PretendardSemiBoldText>
				<Carousel
					loop
					style={{
						marginTop: 18,
						marginBottom: 50,
					}}
					width={widthPercentage(337)}
					height={widthPercentage(245)}
					autoPlay={true}
					data={[1, 2]}
					scrollAnimationDuration={300}
					onSnapToItem={() => {}}
					autoPlayInterval={5000}
					// mode='parallax'
					// modeConfig={{
					// 	parallaxScrollingScale: 0.9, // 옆 아이템 크기 비율
					// 	parallaxScrollingOffset: 50, // 옆 아이템이 보여질 정도
					// }}
					renderItem={({index}) => (
						<VividReviewContainer>
							<HStack gap={10}>
								<VividImage source={vividList[index]?.photo}></VividImage>
								<PretendardSemiBoldText size={20} lineHeight={24} color={colors.Black}>
									{vividList[index].name}
								</PretendardSemiBoldText>
							</HStack>
							<PretendardVariableText
								deco='font-weight:600;margin-top:5px;'
								size={16}
								lineHeight={23}
								color={colors.Black}>
								{vividList[index].title}
							</PretendardVariableText>
							<VividRegionBox>
								<PretendardSemiBoldText size={14} lineHeight={19} color={colors.Gray3}>
									{vividList[index].region}
								</PretendardSemiBoldText>
							</VividRegionBox>
						</VividReviewContainer>
					)}
				/>

				<PretendardSemiBoldText
					size={20}
					lineHeight={24.6}
					color={colors.Black}
					deco={`margin-left:${widthPercentage(6)}`}>
					{userName}님을 위한 혜택
				</PretendardSemiBoldText>
				<FlatList
					data={cooperationList}
					numColumns={2}
					style={{
						marginVertical: 20,
					}}
					columnWrapperStyle={{
						gap: widthPercentage(5),
						marginBottom: 10,
					}} // 각 행의 아래 간격
					renderItem={({item}) => {
						return (
							<CooperationContainer onPress={() => hanldeCooperation(item)}>
								<CooperationImage resizeMode='cover' source={item.photo} />
							</CooperationContainer>
						);
					}}></FlatList>
			</HomeBottomContainer>
		),
		[userName, cooperationList, mainScreens, displayList],
	);
	return (
		<>
			<ImageRecursion navigation={navigation} />
			<BottomSheet
				containerStyle={{zIndex: 10}}
				handleIndicatorStyle={{backgroundColor: colors.backgroundGray, width: widthPercentage(61)}}
				handleStyle={{borderRadius: 30}}
				backgroundStyle={{borderRadius: 30}}
				ref={sheetRef}
				snapPoints={snapPoints}
				enableDynamicSizing={false}
				onChange={handleSheetChange}>
				<BottomSheetScrollView showsVerticalScrollIndicator={false}>{renderItem()}</BottomSheetScrollView>
			</BottomSheet>
			<Modal
				animationType={'fade'}
				transparent={true}
				visible={viewPagerState}
				onRequestClose={deleteMainViewPager}>
				<ViewPager sliceNumber={1} handleFunction={deleteMainViewPager} />
			</Modal>
		</>
	);
}
//바텀시트안에 글자 위치, 사진글자 누르고 스크롤, 여행지 스크롤
export const metropolitanCheckList = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '제주'];

export const TagElement = styled.View<{opacityStatus: boolean; height?: number; backgroundColor?: string}>`
	height: ${props => props.height ?? widthPercentage(22)}px;
	align-items: center;
	justify-content: center;
	background-color: ${props => (props.opacityStatus ? 'rgba(248, 249, 252, 0.4)' : props.backgroundColor)};
	border-radius: 4px;
	padding: 0px ${widthPercentage(6)}px;
	margin: ${widthPercentage(2)}px;
`;
export const TagShopText = styled(PretendardVariable)<{size?: number; color?: string}>`
	font-size: ${props => props.size ?? heightPercentage(12)}px;
	color: ${props => props.color ?? colors.Primary};
	line-height: ${props => props.size ?? heightPercentage(12)}px;
`;
export const TagText = styled(PretendardVariable)<{color: string; size?: number}>`
	font-size: ${props => props.size ?? heightPercentage(12)}px;
	color: ${props => props.color};
	font-weight: 600;
	line-height: ${props => props.size ?? heightPercentage(12)}px;
`;
const RecommendContainer = styled.Pressable`
	width: ${widthPercentage(335)}px;
	height: ${widthPercentage(152)}px;
	background-color: ${colors.Gray1};
	border-radius: 8px;
	top: ${heightPercentage(18)}px;
	margin: 0px 0px ${heightPercentage(9)}px 0px;
	flex-direction: row;
	overflow: hidden;
	align-self: center;
	align-items: center;
	justify-content: center;
`;
const CooperationContainer = styled.TouchableOpacity`
	width: ${widthPercentage(161)}px;
	height: ${widthPercentage(176)}px;
	border-radius: 8px;
	overflow: hidden; /* ✅ 중요 */
`;

const HomeContainer = styled.ScrollView`
	background-color: ${colors.backgroundWhite};
	width: 100%;
`;
const HomeBottomContainer = styled.View`
	width: 100%;
	border-radius: 30px 30px 0px 0px;
	background-color: ${colors.backgroundGray};
	padding: 0px ${widthPercentage(24)}px 0px ${widthPercentage(24)}px;
`;
const CollectionContainer = styled.View`
	margin-top: ${widthPercentage(60)}px;
	margin-bottom: ${heightPercentage(26)}px;
`;
const CollectionContentContainer = styled.ScrollView`
	margin-top: ${heightPercentage(18)}px;
	width: 100%;
`;
const CollectionTouchableOpacity = styled.Pressable``;
const CollectionRecommendContentItemImage = styled.Image<{position?: boolean; width: number; height: number}>`
	${props => !!props.position && 'position: absolute;'}
	width: ${props => widthPercentage(props.width)}px;
	height: ${props => widthPercentage(props.height)}px;
	border-radius: 8px;
	resize-mode: stretch;
`;
const ImageContainer = styled.View<{width: number; height: number}>`
	width: ${props => widthPercentage(props.width)}px;
	height: ${props => widthPercentage(props.height)}px;
	align-items: start;
	justify-content: flex-end;
	margin-bottom: ${heightPercentage(10)}px;
`;
const VividReviewContainer = styled.View`
	width: ${widthPercentage(326)}px;
	height: ${widthPercentage(245)}px;
	padding-horizontal: ${widthPercentage(20)}px;
	padding-top: ${widthPercentage(15)}px;
	gap: ${widthPercentage(10)}px;
	background-color: ${colors.backgroundWhite};
	border-radius: 8px;
	border-color: #dddddd;
`;
const VividRegionBox = styled.View`
	border-radius: 20px;
	padding: ${widthPercentage(8)}px ${widthPercentage(23)}px;
	background-color: #f2ffd4;
	align-self: flex-start;
	margin-top: auto;
	margin-bottom: ${widthPercentage(20)}px;
`;
const VividImage = styled.Image`
	width: ${widthPercentage(40)}px;
	height: ${widthPercentage(40)}px;
	border-radius: 99px;
	resize-mode: contain;
`;
const StartButton = styled.TouchableOpacity`
	width: ${widthPercentage(160)}px;
	height: ${heightPercentage(40)}px;
	align-items: center;
	justify-content: center;
	border-radius: 20px;
	background-color: rgba(255, 255, 255, 0.2);
`;
const EventImage = styled.Image`
	width: ${widthPercentage(327)}px;
	height: ${widthPercentage(152)}px;
	object-fit: fill;
	border-radius: 8px;
`;
const EventIndex = styled.View`
	position: absolute;
	top: ${widthPercentage(118)}px;
	left: ${widthPercentage(254)}px;
	width: ${widthPercentage(52)}px;
	height: ${widthPercentage(19)}px;
	background-color: rgba(0, 0, 0, 0.5);
	border-radius: 12px;
	align-items: center;
	justify-content: center;
`;
const EventContainer = styled.TouchableOpacity`
	width: ${widthPercentage(327)}px;
	height: ${widthPercentage(160)}px;
	border-radius: 8px;
	overflow: hidden;
`;
const ImgContainer = styled.Image`
	width: 100%;
	height: 100%;
`;
const CooperationImage = styled.Image`
	width: ${widthPercentage(161)}px;
	height: ${widthPercentage(176)}px;
	border-radius: 8px;
`;
const HotProductBox = styled.TouchableOpacity`
	width: ${widthPercentage(335)}px;
	height: ${widthPercentage(120)}px;
	border-radius: 12px;
	background-color: ${colors.backgroundWhite};
	padding: ${widthPercentage(14)}px ${widthPercentage(20)}px;
	margin-top: ${widthPercentage(14)}px;
`;
const HotMoreButton = styled.TouchableOpacity`
	width: ${widthPercentage(335)}px;
	padding: ${widthPercentage(8)}px;
	align-items: center;
	justify-content: center;
	border-radius: 12px;
	background-color: #f2ffd4;
	margin-top: ${widthPercentage(20)}px;
`;
interface mainScreensType {
	region: string;
	name: string;
	lat: number;
	lng: number;
	takenTime: number;
	popular: number;
	partner: number[];
	concept: number[];
	play: number[];
	tour: number[];
	season: number[];
	category: number;
	photo: string;
	subTitle?: string;
}

interface ButtonListType {
	id: number;
	onPress: () => void;
	image: any;
	text: string;
	title: string;
}

const regionList = [
	{id: 1, subTitle: '서울'},
	{id: 2, subTitle: '부산'},
	{id: 11, subTitle: '제주'},
	{id: 2, subTitle: '인천'},
	{id: 2, subTitle: '대구'},
	{id: 2, subTitle: '광주'},
	{id: 2, subTitle: '대전'},
	{id: 2, subTitle: '울산'},
	{id: 4, subTitle: '강원 강릉시'},
	{id: 4, subTitle: '강원 속초시'},
	{id: 9, subTitle: '경북 경주시'},
	{id: 9, subTitle: '경북 포항시'},
	{id: 8, subTitle: '전남 여수시'},
];
export const cooperationList = [
	{
		title: 'travleMedic',
		link: 'https://travelmedic.co.kr/mypage/event_view.php?idx=29',
		photo: require('../../../public/mou/travleMedic.png'),
	},
	{
		title: 'carmoa',
		link: 'https://carmore.kr/home/?tak=eyqdjgde&utm_source=danim&utm_medium=affiliate&utm_campaign=outlink&utm_content=202505',
		photo: require('../../../public/mou/carmoa.png'),
	},
	{
		title: 'pillgram',
		link: 'https://pillgram.kr/Promotion/PackageLanding.aspx?promotionId=75AA4035-779F-43A1-8C26-E3FBAE0CCE40&utm_source=danim&utm_medium=event',
		photo: require('../../../public/mou/pillgram.png'),
	},
];
