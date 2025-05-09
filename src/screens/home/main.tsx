import {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

import {useAppDispatch, useAppSelector} from '../../redux';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
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
	devicesWidth,
} from '../../utill/layout/layout';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {
	SVGCalendarRecommend,
	SVGGood,
	SVGNoteList,
	SVGRegionRecommend,
	SVGRightAdd,
	SvgMainCourse,
	SvgMainInstagram,
	SvgMainRegion,
	SvgPillgram,
	SvgTravleMedic,
} from '../../utill/svg/svg';
import styled from 'styled-components/native';

import {useBackHandler} from '../../utill/hooks/useBackhandler';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';
import {FlatList, Linking, Modal, Platform, SafeAreaView, View} from 'react-native';
import ViewPager from '../../utill/view-pager';
import {useViewPager} from '../../utill/hooks/useViewPager';
import {logEvent, setUserId, setUserProperty} from '../../../firebaseAnalytice';
import {useTranslation} from 'react-i18next';
import Carousel from 'react-native-reanimated-carousel';
import {NoteCount} from '../more/more-info';
import LoadingTimetable from '../../utill/component/timetable/loading-timetable';
import {cityViewList} from '../../utill/component/enroll-info/city-list';
import ImageRecursion from '../../utill/component/home/imageRecursion';

export default function Main({navigation}: any) {
	const {homeRegionImage, appLanguages} = useAppSelector(state => state.settingSlice);
	const {userName, signUpReward, reLogin, userId, analyticeFlag, socialloginProvider} = useAppSelector(
		state => state.userSlice,
	);
	const {eventList} = useAppSelector(state => state.eventSlice);

	const {selectStartDate, shareLoginFlag, country} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const [mainScreens, setMainScreens] = useState<mainScreensType[]>([]);
	const {t, i18n} = useTranslation();

	const regionRecommend = async () => {
		dispatch(regionRecommendSliceActions.reset());
		dispatch(travelSliceActions.reset());
		navigation.navigate('SelectCountry');
		await logEvent('place_step1', {});
	};
	const goEnroll = () => {
		let season = Array(4).fill(0);
		let index = Math.floor((selectStartDate.month() + 1) / 3) - 1;
		index < 0 ? (season[3] = 1) : (season[index] = 1);
		dispatch(travelSliceActions.setTravelStart({makeMode: 'recommend', season: season, globalFlag: false}));
		navigation.navigate('EnrollTravelTitle');
	};
	// useEffect(() => {
	// 	const japanList =
	// 		'호치민시, 푸꾸옥 섬, 콘다오, 무이네, 빈증, 동탑, 바리아붕타우, 벤트레, 푸토, 동나이, 마이 토, 깐토, 바리아붕타우, 남딘, 까오란, 랑코, 바리아붕타우';
	// 	const asd = japanList.split(', ');
	// 	let zxc = [];
	// 	asd.map((itema, aindex) => {
	// 		zxc.push({id: aindex, subTitle: itema, lat: 0, lng: 0});
	// 	});
	// 	console.log(zxc);
	// }, []);
	const selectPopularity = (e: {id: number; subTitle: string}) => {
		let season = Array(4).fill(0);
		let index = Math.floor((selectStartDate.month() + 1) / 3) - 1;
		index < 0 ? (season[3] = 1) : (season[index] = 1);
		let region = metropolitanCheckList.includes(e.subTitle) ? ['전체'] : [e.subTitle.split(' ')[1]];
		let cityDistance = metropolitanCheckList.includes(e.subTitle)
			? 0
			: cityViewList[0][e.id].sub.findIndex(item => item.subTitle == e.subTitle.split(' ')[1]);
		dispatch(
			travelSliceActions.setPopuarityClickStart({
				makeMode: 'recommend',
				season: season,
				cityIndex: e.id,
				region: region,
				cityDistance: [cityViewList[0][e.id].sub[cityDistance].id],
			}),
		);
		navigation.navigate('EnrollTravelTitle');
	};
	const goSearch = useCallback(() => {
		navigation.navigate('Search');
	}, []);
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
	useFocusEffect(
		useCallback(() => {
			getNoteListData();
		}, []),
	);
	useLayoutEffect(() => {
		checkEvent();
		getMainScreen();
		getFirstRegion();
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
			image: <SvgMainRegion width={widthPercentage(176)} preserveAspectRatio='xMidYMid slice' />,
			text: `여행은 가고 싶은데,${`\n`}어디로 가야 할지 모르겠다면? `,
			title: '여행 지역 추천받기',
		},
		{
			id: 2,
			onPress: goEnroll,
			image: <SvgMainCourse width={widthPercentage(176)} preserveAspectRatio='xMidYMid slice' />,
			text: `여행지는 정했는데,${`\n`}계획 세우기 귀찮다면?`,
			title: '여행 코스 추천받기',
		},
		// {
		// 	id: 2,
		// 	onPress: goGlobal,
		// 	image: (
		// 		<SVGCalendarRecommend
		// 			width={widthPercentage(200)}
		// 			height={heightPercentage(150)}></SVGCalendarRecommend>
		// 	),
		// 	text: '해외 여행 코스 ',
		// },
	];
	const hanldeCooperation = async (e: {title: string; link: string; photo: any}) => {
		if (e.title == 'travleMedic') {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '다님 이용자만을 위한 할인쿠폰이에요!',
					modalTopText: '쿠폰 사용하러 가기 (홈페이지 이동)',
					modalFunction: async () => {
						await logEvent(e?.title, {});
						Linking.openURL(e.link);
					},
					travleMedic: true,
					modalSubTitle: '* 해외3개월이하 보험가입시 적용됩니다.',
				}),
			);
		} else {
			await logEvent(e?.title, {});
			Linking.openURL(e.link);
		}
	};
	const cooperationList = [
		{
			title: 'travleMedic',
			link: 'https://travelmedic.co.kr/mypage/event_view.php?idx=29',
			photo: (
				<SvgTravleMedic
					width={widthPercentage(115)}
					height={widthPercentage(131)}
					preserveAspectRatio='xMidYMid slice'
				/>
			),
		},
		{
			title: 'pillgram',
			link: 'https://pillgram.kr/Promotion/PackageLanding.aspx?promotionId=75AA4035-779F-43A1-8C26-E3FBAE0CCE40&utm_source=danim&utm_medium=event',
			photo: (
				<SvgPillgram
					width={widthPercentage(115)}
					height={widthPercentage(131)}
					preserveAspectRatio='xMidYMid slice'
				/>
			),
		},
	];
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
			region: '전남 순천시, 여수시 여행',
			title: '친구의 추천으로 한번 사용해봤습니다. 여행 계획 짜는걸 굉장히 싫어하는데 대신 짜주니 굉장히 편리하네요 특히 제가 처한 상황이나 특징을 고려해서 짜주는게 좋았습니다.',
		},
		{
			name: '카우준',
			region: '경남 김해시 여행',
			title: '여행 계획 짤때마다 다 비슷해서 싫었는데 이 앱은 제가 원하는 조건을 입력하면 그에따른 결과 값을 줘서 좋은거같아요',
		},
		{
			name: '맨유맨',
			region: '강원 원주시, 횡성군 여행',
			title: '여행 계획 짜기 귀찮았는데 ,클릭 몇 번으로 여행 계획 만들어줘서 좋았다 다음에 여행 계획 짤때 또 사용할 듯 하다',
		},
	];
	const displayList = [
		...eventList,
		{
			type: 'instagram',
			eventLink: 'https://www.instagram.com/danim_kr/',
			eventImage:
				'https://firebasestorage.googleapis.com/v0/b/danim-image/o/event%2F%E1%84%83%E1%85%A1%E1%84%82%E1%85%B5%E1%86%B7%E1%84%8B%E1%85%B5%E1%86%AB%E1%84%89%E1%85%B3%E1%84%90%E1%85%A1.png?alt=media&token=1fb05468-5a33-4737-acfb-e90be34dd378',
		},
	];
	return (
		<SafeAreaView>
			<HomeContainer showsVerticalScrollIndicator={false}>
				<ImageRecursion navigation={navigation} />
				<HomeBottomContainer>
					<VStack gap={5} deco='padding:0px 12px;'>
						<PretendardBoldText size={16} lineHeight={21.6} color={colors.Black}>
							{userName}님의 성향을 토대로,{`\n`}
							<PretendardBoldText size={16} lineHeight={21.6} color={colors.Primary}>
								다님 AI
							</PretendardBoldText>
							가 여행을 추천해 줘요!
						</PretendardBoldText>
						<PretendardBoldText size={14} lineHeight={21.6} color={colors.PointYellow}>
							1분 투자로 하루를 아껴보세요
						</PretendardBoldText>
					</VStack>
					<HStack justifyContent='space-around'>
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
										gap: 30,
									}}>
									<PretendardSemiBoldText
										size={16}
										lineHeight={20}
										color={colors.backgroundWhite}
										deco={`top:${heightPercentage(140)}`}>
										{item.text}
									</PretendardSemiBoldText>
									<StartButton onPress={item.onPress}>
										<PretendardSemiBoldText
											size={14}
											lineHeight={28}
											color={colors.Black}
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

								{/* <RecommendTextContainer>
									<PretendardSemiBoldText size={20} lineHeight={28} color={colors.PointYellow}>
										{item.text}
										<PretendardSemiBoldText size={20} lineHeight={28} color={colors.Gray5}>
											추천
										</PretendardSemiBoldText>
									</PretendardSemiBoldText>
								</RecommendTextContainer> */}
							</RecommendContainer>
						))}
					</HStack>
					<CollectionContainer>
						<PretendardSemiBoldText
							size={18}
							lineHeight={21.6}
							color={colors.Gray5}
							deco={`margin-left:${widthPercentage(6)}`}>
							다님이 추천하는 여행지
						</PretendardSemiBoldText>
						<CollectionContentContainer horizontal={true} showsHorizontalScrollIndicator={false}>
							{mainScreens.map((item, idx) => (
								<CollectionTouchableOpacity
									key={idx}
									onPress={() => {
										goCourseDetaile(item);
									}}>
									<ImageContainer>
										<CollectionRecommendContentItemImage
											source={{uri: item.photo}}></CollectionRecommendContentItemImage>
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
												alignItems: 'flex-start',
												justifyContent: 'flex-end',
												gap: 10,
												borderRadius: 12,
											}}>
											<PretendardSemiBoldText
												size={20}
												lineHeight={26}
												numberOfLines={2}
												color={colors.backgroundWhite}>
												{item.name}
											</PretendardSemiBoldText>
										</LinearGradient>
									</ImageContainer>
								</CollectionTouchableOpacity>
							))}
						</CollectionContentContainer>
					</CollectionContainer>
					<PretendardSemiBoldText
						size={18}
						lineHeight={21.6}
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
						height={heightPercentage(170)}
						autoPlay={true}
						data={[1, 2, 3]}
						scrollAnimationDuration={1000}
						onSnapToItem={() => {}}
						autoPlayInterval={5000}
						mode='parallax'
						modeConfig={{
							parallaxScrollingScale: 0.9, // 옆 아이템 크기 비율
							parallaxScrollingOffset: 50, // 옆 아이템이 보여질 정도
						}}
						renderItem={({index}) => (
							<VividReviewContainer>
								<HStack>
									<PretendardBoldText size={16} lineHeight={20} color={colors.Black}>
										{vividList[index].name} 님{' '}
									</PretendardBoldText>
									<PretendardBoldText size={14} lineHeight={18} color={colors.Black}>
										( {vividList[index].region} )
									</PretendardBoldText>
								</HStack>
								<PretendardSemiBoldText size={12} lineHeight={18} color={colors.Gray3}>
									{vividList[index].title}
								</PretendardSemiBoldText>
							</VividReviewContainer>
						)}
					/>
					<Carousel
						loop={displayList.length > 1}
						autoPlay={displayList.length > 1}
						scrollAnimationDuration={displayList.length > 1 ? 1000 : 0}
						autoPlayInterval={displayList.length > 1 ? 4000 : 0}
						mode={displayList.length > 1 ? 'parallax' : 'default'}
						modeConfig={
							displayList.length > 1
								? {
										parallaxScrollingScale: 0.9,
										parallaxScrollingOffset: 50,
								  }
								: undefined
						}
						style={{
							alignSelf: displayList.length == 1 ? 'center' : undefined,
						}}
						width={widthPercentage(337)}
						height={heightPercentage(160)}
						data={displayList}
						onSnapToItem={() => {}}
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
									source={{
										uri: displayList[index]?.eventImage,
									}}></EventImage>
							</EventContainer>
							// <InstagramContainer
							// 	onPress={() => {
							// 		Linking.openURL('https://www.instagram.com/danim_kr/');
							// 	}}>
							// 	<SvgMainInstagram width={widthPercentage(326)} />
							// </InstagramContainer>
						)}
					/>
					<PretendardSemiBoldText
						size={18}
						lineHeight={21.6}
						color={colors.Black}
						deco={`margin-left:${widthPercentage(6)}`}>
						{userName}님을 위한 혜택
					</PretendardSemiBoldText>
					<FlatList
						data={cooperationList}
						numColumns={3}
						style={{
							marginVertical: 20,
						}}
						columnWrapperStyle={{gap: 7, marginBottom: 10}} // 각 행의 아래 간격
						renderItem={({item}) => {
							return (
								<CooperationContainer onPress={() => hanldeCooperation(item)}>
									{item.photo}
								</CooperationContainer>
							);
						}}></FlatList>

					{/* {cooperationList.map(cooItem => (
						<MouCouponTouchable
							onPress={() => {
								hanldeCooperation(cooItem);
							}}>
							{cooItem.photo}
						</MouCouponTouchable>
					))} */}
				</HomeBottomContainer>
			</HomeContainer>
			<Modal
				animationType={'fade'}
				transparent={true}
				visible={viewPagerState}
				onRequestClose={deleteMainViewPager}>
				<ViewPager sliceNumber={1} handleFunction={deleteMainViewPager} />
			</Modal>
		</SafeAreaView>
	);
}
export const metropolitanCheckList = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '제주'];

export const TagElement = styled.View<{opacityStatus: boolean; height?: number; backgroundColor?: string}>`
	height: ${props => props.height ?? widthPercentage(22)}px;
	align-items: center;
	justify-content: center;
	background-color: ${props => (props.opacityStatus ? 'rgba(235, 236, 242, 0.6)' : props.backgroundColor)};
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
const InstagramContainer = styled.TouchableOpacity`
	width: ${widthPercentage(326)}px;
	margin: 10px 0px;
`;
const RecommendContainer = styled.Pressable`
	width: ${widthPercentage(176)}px;
	height: ${heightPercentage(328)}px;
	background-color: ${colors.Gray1};
	border-radius: 12px;
	top: ${heightPercentage(18)}px;
	margin: 0px 0px ${heightPercentage(9)}px 0px;
	flex-direction: row;
	overflow: hidden;
	align-self: center;
	align-items: center;
	justify-content: center;
`;
const CooperationContainer = styled.TouchableOpacity`
	width: ${widthPercentage(115)}px;
	height: ${widthPercentage(131)}px;
	border-radius: 10px;
	overflow: hidden; /* ✅ 중요 */
`;

const HomeContainer = styled.ScrollView`
	background-color: ${colors.backgroundWhite};
	width: 100%;
`;
const HomeBottomContainer = styled.View`
	width: 100%;
	border-radius: 30px 30px 0px 0px;
	background-color: ${colors.backgroundWhite};
	padding: ${widthPercentage(35)}px ${widthPercentage(8)}px 0px ${widthPercentage(8)}px;
	top: -${heightPercentage(50)}px;
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
const CollectionRecommendContentItemImage = styled.Image`
	position: absolute;
	width: ${widthPercentage(Platform.isPad ? 101 : 152)}px;
	height: ${heightPercentage(226)}px;
	border-radius: 12px;
`;
const ImageContainer = styled.View`
	width: ${widthPercentage(Platform.isPad ? 101 : 152)}px;
	height: ${heightPercentage(226)}px;
	margin-right: ${widthPercentage(12)}px;
	align-items: start;
	justify-content: flex-end;
	margin-bottom: ${heightPercentage(10)}px;
`;
const VividReviewContainer = styled.View`
	width: ${widthPercentage(326)}px;
	height: ${heightPercentage(170)}px;
	padding-horizontal: ${widthPercentage(30)}px;
	padding-top: ${widthPercentage(15)}px;
	gap: ${widthPercentage(10)}px;
	background-color: ${colors.backgroundWhite};
	border-width: 1px;
	border-radius: 12px;
	border-color: #dddddd;
`;

const GraientBackground = styled.View`
	position: absolute;
	bottom: 0px;
	width: 100%;
	height: ${widthPercentage(80)}px;
	background-color: rgba(0, 0, 0, 0.3);
	justify-content: flex-end;
	border-bottom-right-radius: 12px;
	border-bottom-left-radius: 12px;
	padding: ${widthPercentage(12)}px;
`;
const MouCouponTouchable = styled.TouchableOpacity`
	margin-top: ${widthPercentage(20)}px;
	width: ${widthPercentage(326)}px;
	height: ${widthPercentage(300)}px;
	border-radius: 12px;
`;
const StartButton = styled.TouchableOpacity`
	width: ${widthPercentage(143)}px;
	padding: ${widthPercentage(4)}px ${widthPercentage(11)}px;
	align-items: center;
	justify-content: center;
	border-radius: 20px;
	background-color: ${colors.backgroundWhite};
	position: absolute;
	bottom: ${heightPercentage(30)}px;
`;
const EventImage = styled.Image`
	width: ${widthPercentage(337)}px;
	height: ${heightPercentage(70)}px;
	object-fit: fill;
`;
const EventContainer = styled.TouchableOpacity`
	width: ${widthPercentage(337)}px;
	height: ${heightPercentage(70)}px;
	border-radius: 10px;
	overflow: hidden;
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
