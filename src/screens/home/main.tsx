import {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useAppDispatch, useAppSelector} from '../../redux';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import {userSliceActions} from '../../redux/user/user.slice';
import {regionRecommendSliceActions} from '../../redux/travel-info/region-recommend.slice';
import {eventSliceActions, getEventList} from '../../redux/event/event.slice';
import {changeLanguage, getHomeRegionInfo, getPlaceRecommendInMainScreen} from '../../redux/setting/settingSlice';

import {colors} from '../../utill/colors';
import {HStack, PretendardBoldText, PretendardSemiBoldText, PretendardVariable} from '../../utill/layout/layout';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {SVGCalendarRecommend, SVGGood, SVGRegionRecommend, SVGRightAdd, SVGSearch} from '../../utill/svg/svg';
import styled from 'styled-components/native';
import {cityViewList} from '../enroll-info/select-city';

import {useAppsflyer} from '../../utill/hooks/useAppsflyer';
import {useBackHandler} from '../../utill/hooks/useBackhandler';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';
import {Modal, Platform, SafeAreaView} from 'react-native';
import ViewPager from '../../utill/view-pager';
import {useViewPager} from '../../utill/hooks/useViewPager';
import {logEvent, setUserId, setUserProperty} from '../../../firebaseAnalytice';
import {useTranslation} from 'react-i18next';
export default function Main({navigation}: any) {
	const {homeRegionImage, appLanguages} = useAppSelector(state => state.settingSlice);
	const {userName, signUpReward, reLogin, userId, analyticeFlag} = useAppSelector(state => state.userSlice);
	const {selectStartDate, shareLoginFlag, aiList} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const {appsflyerLogEvent} = useAppsflyer();
	const [mainScreens, setMainScreens] = useState<mainScreensType[]>([]);
	const {t, i18n} = useTranslation();

	const regionRecommend = async () => {
		appsflyerLogEvent({name: 'region_recommend', value: {id: 'danim'}});
		dispatch(regionRecommendSliceActions.reset());
		dispatch(travelSliceActions.reset());
		navigation.navigate('RegionSelectWho');
		await logEvent('place_step1', {});
	};
	const goEnroll = () => {
		appsflyerLogEvent({name: 'travel_recommend', value: {id: 'danim'}});
		let season = Array(4).fill(0);
		let index = Math.floor((selectStartDate.month() + 1) / 3) - 1;
		index < 0 ? (season[3] = 1) : (season[index] = 1);
		dispatch(travelSliceActions.setTravelStart({makeMode: 'recommend', season: season}));
		navigation.navigate('EnrollTravelTitle');
	};

	const selectPopularity = (e: {id: number; subTitle: string}) => {
		let season = Array(4).fill(0);
		let index = Math.floor((selectStartDate.month() + 1) / 3) - 1;
		index < 0 ? (season[3] = 1) : (season[index] = 1);
		let region = metropolitanCheckList.includes(e.subTitle) ? ['전체'] : [e.subTitle.split(' ')[1]];
		let cityDistance = metropolitanCheckList.includes(e.subTitle)
			? 0
			: cityViewList[e.id].sub.findIndex(item => item.subTitle == e.subTitle.split(' ')[1]);
		dispatch(
			travelSliceActions.setPopuarityClickStart({
				makeMode: 'recommend',
				season: season,
				cityIndex: e.id,
				region: region,
				cityDistance: [cityViewList[e.id].sub[cityDistance].id],
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
	const goTokenLog = () => {
		navigation.navigate('TokenLog');
	};

	const pushPermission = async () => {
		const authStatus = await messaging().requestPermission();
		dispatch(userSliceActions.setPushNotify(authStatus ? true : false));
	};
	const checkEvent = async () => {
		const eventExist = await dispatch(getEventList()).unwrap();
		const state = await AsyncStorage.getItem('eventState');
		if (state != moment().format('DD').toString() && eventExist.eventList.length != 0) {
			dispatch(eventSliceActions.setEventState(true));
		}
	};
	const getMainScreen = async () => {
		try {
			const data = await dispatch(getPlaceRecommendInMainScreen()).unwrap();
			setMainScreens(data);
		} catch (err) {}
	};
	useFocusEffect(
		useCallback(() => {
			recursionCall();
		}, []),
	);
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
		await logEvent('login', {});
		await setUserId(userId ?? '');
		await setUserProperty('user_id', userId ?? '');
		dispatch(userSliceActions.setAnalyticeFlag(true));
	};
	useLayoutEffect(() => {
		getMainScreen();
		getFirstRegion();
	}, []);
	useEffect(() => {
		shareLoginFlag && navigation.navigate('Timetable');
		!analyticeFlag && handleGoogleAnalytics();
	}, []);

	useEffect(() => {
		pushPermission();
		getMainViewPager();
		checkCache();
		if (signUpReward) {
			navigation.navigate('HomeModal', {status: '회원가입'});
		} else if (reLogin) {
			navigation.navigate('HomeModal', {status: '재가입'});
		}
		checkEvent();
	}, [signUpReward]);

	useBackHandler({type: 'exit'});
	const buttonList: ButtonListType[] = [
		{
			id: 1,
			onPress: regionRecommend,
			image: (
				<SVGRegionRecommend width={widthPercentage(200)} height={heightPercentage(150)}></SVGRegionRecommend>
			),
			text: '여행 지역 ',
		},
		{
			id: 2,
			onPress: goEnroll,
			image: (
				<SVGCalendarRecommend
					width={widthPercentage(200)}
					height={heightPercentage(150)}></SVGCalendarRecommend>
			),
			text: '여행 코스 ',
		},
	];
	const randomRegion = regionList[Math.floor(Math.random() * regionList.length)];
	const setPreset = (data: {
		preset: any;
		presetTendency: any;
		day: any;
		nDay: any;
		transit: any;
		tendency: any;
		travelName: any;
		region: any;
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
			}),
		);
		navigation.navigate('Preset');
	};
	const {getMainViewPager, deleteMainViewPager, viewPagerState} = useViewPager({title: 'mainViewPager'});
	const checkCache = async () => {
		let [preset, presetTendency, day, nDay, transit, tendency, travelName, region] = await AsyncStorage.multiGet([
			'preset',
			'presetTendency',
			'day',
			'nDay',
			'transit',
			'tendency',
			'travelName',
			'region',
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
						}),
					modalLeft: true,
				}),
			);
		}
		AsyncStorage.multiRemove(['preset', 'presetTendency', 'day', 'nDay', 'transit', 'tendency', 'travelName']);
	};
	return (
		<SafeAreaView>
			<HomeContainer showsVerticalScrollIndicator={false}>
				<BackgroundImage source={{uri: homeRegionImage.photo}}>
					<BrighnessBox>
						{/* <TicketTouchable onPress={goSearch}>
							<SVGSearch />
							<PretendardSemiBoldText size={12} lineHeight={18} color={colors.Gray5}>
								{t('이용권')}
							</PretendardSemiBoldText>
						</TicketTouchable> */}
						<HomeTextContainer
							onPress={() => {
								selectPopularity({
									id: regionList.find(item => item.subTitle == homeRegionImage.name).id,
									subTitle: regionList.find(item => item.subTitle == homeRegionImage.name).subTitle,
								});
							}}>
							<PretendardSemiBoldText
								size={23}
								lineHeight={34.5}
								color={
									colors.backgroundWhite
								}>{`${userName} 님,\n현재 인기 여행지`}</PretendardSemiBoldText>
							<HStack>
								<PretendardBoldText size={23} lineHeight={34.5} color={colors.Primary}>
									{homeRegionImage.name + ' '}
								</PretendardBoldText>
								<PretendardSemiBoldText size={23} lineHeight={34.5} color={colors.backgroundWhite}>
									여행은 어때요?
								</PretendardSemiBoldText>
								<SVGRightAdd
									color='white'
									width={heightPercentage(24)}
									height={heightPercentage(24)}
									style={{marginLeft: 10}}></SVGRightAdd>
							</HStack>
						</HomeTextContainer>
					</BrighnessBox>
				</BackgroundImage>
				<HomeBottomContainer>
					<HStack gap={5}>
						<SVGGood width={widthPercentage(25)} height={widthPercentage(25)} />
						<PretendardSemiBoldText size={18} lineHeight={21.6} color={colors.Gray5}>
							다님 AI에게 추천받기
						</PretendardSemiBoldText>
					</HStack>
					{buttonList.map(item => (
						<RecommendContainer onPress={item.onPress} key={item.id}>
							<RecommendTextContainer>
								<PretendardSemiBoldText size={20} lineHeight={28} color={colors.PointYellow}>
									{item.text}
									<PretendardSemiBoldText size={20} lineHeight={28} color={colors.Gray5}>
										추천
									</PretendardSemiBoldText>
								</PretendardSemiBoldText>
							</RecommendTextContainer>
							{item.image}
						</RecommendContainer>
					))}
					<CollectionContainer>
						<PretendardSemiBoldText size={18} lineHeight={21.6} color={colors.Gray5}>
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
										<PretendardSemiBoldText
											size={20}
											lineHeight={26}
											color={colors.backgroundWhite}>
											{item.name}
										</PretendardSemiBoldText>
									</ImageContainer>
								</CollectionTouchableOpacity>
							))}
						</CollectionContentContainer>
					</CollectionContainer>
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
const RecommendContainer = styled.Pressable`
	width: ${widthPercentage(327)}px;
	height: ${heightPercentage(88)}px;
	background-color: ${colors.Gray1};
	border-radius: 12px;
	top: ${heightPercentage(18)}px;
	margin: 0px 0px ${heightPercentage(9)}px -${widthPercentage(24)}px;
	flex-direction: row;
	overflow: hidden;
	align-self: center;
`;

const RecommendTextContainer = styled.View`
	width: 50%;
	justify-content: center;
	left: ${widthPercentage(21)}px;
`;
const HomeContainer = styled.ScrollView`
	background-color: ${colors.backgroundWhite};
	width: 100%;
`;
const HomeBottomContainer = styled.View`
	width: 100%;
	border-radius: 30px 30px 0px 0px;
	background-color: ${colors.backgroundWhite};
	padding: ${widthPercentage(35)}px 0px 0px ${widthPercentage(24)}px;
	top: -${heightPercentage(20)}px;
`;
const BrighnessBox = styled.View`
	flex: 1;
	background-color: rgba(0, 0, 0, 0.3);
	top: -${heightPercentage(20)}px;
`;
const BackgroundImage = styled.ImageBackground`
	width: 100%;
	height: ${heightPercentage(408)}px;
`;
const TicketTouchable = styled.TouchableOpacity`
	border-radius: 99px;
	top: ${heightPercentage(39)}px;
	left: ${widthPercentage(325)}px;
	width: ${widthPercentage(31)}px;
	height: ${heightPercentage(31)}px;
	background-color: ${colors.Primary};
	align-items: center;
	justify-content: center;
`;
const HomeTextContainer = styled.Pressable`
	top: ${heightPercentage(275)}px;
	left: ${widthPercentage(26)}px;
`;

const CollectionContainer = styled.View`
	margin-top: ${heightPercentage(36)}px;
	margin-bottom: 12px;
`;
const CollectionContentContainer = styled.ScrollView`
	margin-top: ${heightPercentage(18)}px;
	width: 100%;
`;
const CollectionTouchableOpacity = styled.Pressable``;
const CollectionRecommendContentItemImage = styled.Image`
	position: absolute;
	width: ${widthPercentage(Platform.isPad ? 101 : 152)}px;
	height: ${heightPercentage(196)}px;
	border-radius: 12px;
`;
const ImageContainer = styled.View`
	width: ${widthPercentage(Platform.isPad ? 101 : 152)}px;
	height: ${heightPercentage(196)}px;
	margin-right: ${widthPercentage(12)}px;
	padding: ${widthPercentage(12)}px;
	align-items: start;
	justify-content: flex-end;
	margin-bottom: ${heightPercentage(10)}px;
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
}

const regionList = [
	{id: 1, subTitle: '서울'},
	{id: 2, subTitle: '부산'},
	{id: 17, subTitle: '제주'},
	{id: 4, subTitle: '인천'},
	{id: 3, subTitle: '대구'},
	{id: 5, subTitle: '광주'},
	{id: 6, subTitle: '대전'},
	{id: 7, subTitle: '울산'},
	{id: 10, subTitle: '강원 강릉시'},
	{id: 10, subTitle: '강원 속초시'},
	{id: 15, subTitle: '경북 경주시'},
	{id: 15, subTitle: '경북 포항시'},
	{id: 14, subTitle: '전남 여수시'},
];
