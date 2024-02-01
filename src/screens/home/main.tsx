import {useEffect, useLayoutEffect, useState} from 'react';
import {Dimensions, Platform, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icons from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';
import {RootState, useAppDispatch, useAppSelector} from '../../redux';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {getTourTest, travelSliceActions} from '../../redux/travel-info/travel.slice';
import {updateFunctionToken, userSliceActions} from '../../redux/user/user.slice';
import {colors} from '../../utill/colors';
import {useAppsflyer} from '../../utill/hooks/useAppsflyer';
import {useBackHandler} from '../../utill/hooks/useBackhandler';
import {HStack, HeaderContianer, MainContainer, devicesHeight, devicesWidth} from '../../utill/layout/layout';
import messaging from '@react-native-firebase/messaging';
import {regionRecommendSliceActions} from '../../redux/travel-info/region-recommend.slice';
import {eventSliceActions, getEventList} from '../../redux/event/event.slice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {cityViewList} from '../enroll-info/select-city';
import {getPlaceRecommendInMainScreen} from '../../redux/setting/settingSlice';
import {tendencyList} from '../enroll-info/select-tendency';
import {fontPercentage, heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {SVGCalendarRecommend, SVGRegionRecommend, SVGRightAdd} from '../../utill/svg/svg';
export default function Main({navigation}: any) {
	const {appsflyerLogEvent} = useAppsflyer();
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
		let region = metropolitanCheckList.includes(e.subTitle) ? ['전체'] : [e.subTitle];
		let cityDistance = metropolitanCheckList.includes(e.subTitle)
			? 0
			: cityViewList[e.id].sub.findIndex(item => item.subTitle == e.subTitle);
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

	const {userName, functionToken, signUpReward, reLogin} = useAppSelector(state => state.userSlice);
	const {selectStartDate, shareLoginFlag} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const regionRecommend = () => {
		appsflyerLogEvent({name: 'region_recommend', value: {id: 'danim'}});
		dispatch(regionRecommendSliceActions.reset());
		//dispatch(regionRecommendSliceActions.enrollCheckStep(0));
		navigation.navigate('RegionEnrollInfo');
	};
	const checkSignUpReward = () => {
		dispatch(userSliceActions.setSignUpReward(false));
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
	const goTokenLog = () => {
		navigation.navigate('TokenLog');
	};
	useEffect(() => {
		shareLoginFlag && navigation.navigate('Timetable');
	}, []);

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<HeaderHStack onPress={goTokenLog}>
					<Ticket name='ticket' size={26} color={colors.selectButton} />
					<BannerColoredText>{functionToken}</BannerColoredText>
				</HeaderHStack>
			),
		});
	}, [functionToken]);

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
	const [mainScreens, setMainScreens] = useState<mainScreensType[]>([]);
	const getMainScreen = async () => {
		try {
			const data = await dispatch(getPlaceRecommendInMainScreen()).unwrap();
			setMainScreens(data);
		} catch (err) {}
	};
	useLayoutEffect(() => {
		getMainScreen();
	}, []);
	useEffect(() => {
		pushPermission();
		checkCache();
		if (signUpReward) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '회원가입 축하드립니다',
					modalSubTitle: `회원가입 기념 이용권을 드렸습니다. ${functionToken}개 입니다.\n이용권은 추천 기능에 사용됩니다.`,
					modalFunction: checkSignUpReward,
				}),
			);
		} else if (reLogin) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '보고싶었어요',
					modalSubTitle: `다시 오신 것을 환영합니다! ${userName}님!`,
					modalFunction: checkSignUpReward,
				}),
			);
		}
		checkEvent();
	}, []);
	useBackHandler();
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
		{id: 10, subTitle: '강릉시'},
		{id: 10, subTitle: '속초시'},
		{id: 15, subTitle: '경주시'},
		{id: 15, subTitle: '포항시'},
		{id: 14, subTitle: '여수시'},
	];
	const buttonList: ButtonListType[] = [
		{
			id: 1,
			onPress: regionRecommend,
			image: <SVGRegionRecommend></SVGRegionRecommend>,
			text: '여행 지역 ',
		},
		{
			id: 2,
			onPress: goEnroll,
			image: <SVGCalendarRecommend></SVGCalendarRecommend>,
			text: '여행 일정 ',
		},
	];
	function tendencyMake(list: number[]) {
		let copy = [...tendencyList[1].list, ...tendencyList[2].list, ...tendencyList[3].list];
		let result: any[] = [];
		list.forEach((item, idx) => {
			if (item >= 80) {
				result.push(
					<TagElement key={idx}>
						<HStack>
							<TagShopText># </TagShopText>
							<TagText>{copy[idx]}</TagText>
						</HStack>
					</TagElement>,
				);
			}
		});

		return result;
	}
	const randomRegion = regionList[Math.floor(Math.random() * regionList.length)];
	const setPreset = (data: {
		preset: any;
		presetTendency: any;
		day: any;
		nDay: any;
		transit: any;
		tendency: any;
		travelName: any;
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
			}),
		);
		navigation.navigate('Preset');
	};
	const checkCache = async () => {
		let [preset, presetTendency, day, nDay, transit, tendency, travelName] = await AsyncStorage.multiGet([
			'preset',
			'presetTendency',
			'day',
			'nDay',
			'transit',
			'tendency',
			'travelName',
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
						}),
					modalLeft: true,
				}),
			);
		}
		AsyncStorage.multiRemove(['preset', 'presetTendency', 'day', 'nDay', 'transit', 'tendency', 'travelName']);
	};
	return (
		<HomeContainer>
			<BackgroundImage source={require('../../../public/images/home-image.png')}>
				<BrighnessBox>
					<TicketTouchable onPress={goTokenLog}>
						<TicketText>이용권</TicketText>
					</TicketTouchable>
					<HomeTextContainer
						onPress={() => {
							selectPopularity({id: randomRegion.id, subTitle: randomRegion.subTitle});
						}}>
						<HomeText>{userName} 님,</HomeText>
						<HomeText>현재 인기 여행지</HomeText>
						<HStack>
							<HomePrimaryText>{randomRegion.subTitle}</HomePrimaryText>
							<HomeText> 여행은 어때요?</HomeText>
							<SVGRightAdd
								color='white'
								width={heightPercentage(24)}
								height={heightPercentage(24)}
								style={{marginLeft: 10}}></SVGRightAdd>
						</HStack>
					</HomeTextContainer>
				</BrighnessBox>
			</BackgroundImage>
			{/* <BlackFence /> */}
			<HomeBottomContainer>
				<HomeRecommendText>다님에게 추천받기</HomeRecommendText>
				{buttonList.map(item => (
					<RecommendContainer onPress={item.onPress} key={item.id}>
						<RecommendContainerText>
							{item.text}
							<HomeRecommendText>추천</HomeRecommendText>
						</RecommendContainerText>
						{item.image}
					</RecommendContainer>
				))}
				<CollectionContainer>
					<HomeRecommendText>다님이 추천하는 여행지</HomeRecommendText>
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
									<ImageRegionText>{item.region + '\n'}</ImageRegionText>
									<ImageTargetText>{item.name}</ImageTargetText>
								</ImageContainer>
								{/* <CollectionRecommendContentItem width={DeviceWidth * 0.9}>
									<CollectionRecommendContentItemDescriptionContainer>
			
										<CollectionContentItemHashtagText>
											#{tendencyMake([...item.concept, ...item.play, ...item.tour]).join(' #')}
										</CollectionContentItemHashtagText>
									</CollectionRecommendContentItemDescriptionContainer>
									<RightArrowIcon name='right' size={16} color={'#ccc'} />
								</CollectionRecommendContentItem> */}
								<TagContainer>
									{tendencyMake([...item.concept, ...item.play, ...item.tour])}
								</TagContainer>
							</CollectionTouchableOpacity>
						))}
					</CollectionContentContainer>
				</CollectionContainer>
			</HomeBottomContainer>
		</HomeContainer>
	);
}
export const metropolitanCheckList = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '제주'];

const TagElement = styled.View`
	height: ${heightPercentage(22)}px;
	align-items: center;
	justify-content: center;
	background-color: ${colors.Gray1};
	border-radius: 4px;
	padding: 0px ${widthPercentage(6)}px;
	margin: 2px;
`;
const TagShopText = styled.Text`
	font-size: ${heightPercentage(12)}px;
	color: ${colors.Primary};
	line-height: ${heightPercentage(12)}px;
`;
const TagText = styled.Text`
	font-size: ${heightPercentage(12)}px;
	color: ${colors.Gray5};
	font-weight: 600;
	line-height: ${heightPercentage(12)}px;
`;
const ImageRegionText = styled.Text`
	font-size: ${fontPercentage(14)}px;
	font-weight: 400;
	color: ${colors.backgroundWhite};
	line-height: ${heightPercentage(16.8)}px;
`;
const ImageTargetText = styled.Text`
	width: ${widthPercentage(152)}px;
	font-size: ${fontPercentage(20)}px;
	font-weight: 600;
	color: ${colors.backgroundWhite};
	line-height: ${heightPercentage(24)}px;
`;
const TagContainer = styled.View`
	width: ${widthPercentage(152)}px;
	flex-direction: row;
	flex-wrap: wrap;
`;
const RecommendContainer = styled.Pressable`
	width: ${widthPercentage(327)}px;
	height: ${heightPercentage(88)}px;
	background-color: ${colors.Gray1};
	border-radius: 12px;
	top: ${heightPercentage(18)}px;
	margin: 0px 0px ${heightPercentage(9)}px 0px;
	flex-direction: row;
	overflow: hidden;
`;

const HomeRecommendText = styled.Text`
	font-size: ${fontPercentage(18)}px;
	font-weight: 600;
	color: ${colors.Black};
`;
const RecommendContainerText = styled(HomeRecommendText)`
	color: #5350ff;
	width: 50%;
	top: ${heightPercentage(48)}px;
	left: ${widthPercentage(21)}px;
`;
const HomeContainer = styled.ScrollView`
	background-color: ${colors.Black};
	width: 100%;
`;
const HomeBottomContainer = styled.View`
	width: 100%;
	border-radius: 30px 30px 0px 0px;
	background-color: ${colors.backgroundWhite};
	padding: ${widthPercentage(35)}px ${widthPercentage(24)}px 0px ${widthPercentage(24)}px;
`;
const BrighnessBox = styled.View`
	flex: 1;
	background-color: rgba(0, 0, 0, 0.3);
`;
const BackgroundImage = styled.ImageBackground`
	width: 100%;
	height: ${heightPercentage(408)}px;
`;
const TicketText = styled.Text`
	color: ${colors.Black};
	font-size: ${fontPercentage(15)}px;
	font-weight: 600;
`;
const TicketTouchable = styled.TouchableOpacity`
	border-radius: 99px;
	top: ${heightPercentage(59)}px;
	left: ${widthPercentage(295)}px;
	width: ${widthPercentage(63)}px;
	height: ${heightPercentage(31)}px;
	background-color: ${colors.Primary};
	align-items: center;
	justify-content: center;
`;
const HomeTextContainer = styled.Pressable`
	top: ${heightPercentage(244)}px;
	left: ${widthPercentage(26)}px;
`;
const HomeText = styled.Text`
	font-size: ${fontPercentage(23)}px;
	font-weight: 600;
	color: ${colors.backgroundWhite};
	line-height: ${heightPercentage(34.5)}px;
`;
const HomePrimaryText = styled(HomeText)`
	color: ${colors.Primary};
	font-weight: 700;
`;
const HeaderHStack = styled(HStack).attrs({as: TouchableOpacity})`
	padding: 0px 24px;
`;
const BannerColoredText = styled.Text`
	font-size: 24px;
	font-weight: bold;
	color: ${colors.TextPrimary};
`;
const Ticket = styled(Icons)`
	margin: 0px 5px 0px 0px;
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
	width: ${widthPercentage(152)}px;
	height: ${heightPercentage(196)}px;
	border-radius: 12px;
`;
const ImageContainer = styled.View`
	width: ${widthPercentage(152)}px;
	height: ${heightPercentage(196)}px;
	margin-right: 24px;
	padding: ${widthPercentage(6)}px;
	align-items: start;
	justify-content: flex-end;
	margin-bottom: ${heightPercentage(10)}px;
`;
