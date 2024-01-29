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
		const data = await dispatch(getPlaceRecommendInMainScreen()).unwrap();
		setMainScreens(data);
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
		boldText: string;
	}
	const emojiList = ['🏖', '🏕', '🍲', '📸', '🏃', '🗼', '🚅', '🛫', '🛳', '🚗', '🦐'];
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
			image: require('../../../public/images/map.png'),
			text: '지역 추천받을래요',
			boldText: '여행 지역 추천받기',
		},
		{
			id: 2,
			onPress: goEnroll,
			image: require('../../../public/images/destination.png'),
			text: '일정 추천받을래요',
			boldText: '여행 일정 추천받기',
		},
	];
	function tendencyMake(list: number[]) {
		let copy = [...tendencyList[1].list, ...tendencyList[2].list, ...tendencyList[3].list];
		let result: string[] = [];
		list.forEach((item, idx) => {
			if (item >= 80) {
				result.push(copy[idx]);
			}
		});
		return result;
	}
	const DeviceWidth = Dimensions.get('window').width;
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
		<SafeAreaView>
			<MainContainer>
				<TopBannerContainer>
					<BannerTextContainer>
						<HStack>
							<TouchableOpacity
								onPress={() => {
									navigation.navigate('More');
								}}>
								<BannerColoredText>{userName}</BannerColoredText>
							</TouchableOpacity>
							<BannerText>님,</BannerText>
						</HStack>
						<BannerText>현재 인기 여행지</BannerText>
						<HStack>
							<TouchableOpacity
								onPress={() => {
									selectPopularity({id: randomRegion.id, subTitle: randomRegion.subTitle});
								}}>
								<BannerColoredText>{randomRegion.subTitle}</BannerColoredText>
							</TouchableOpacity>
							<BannerText>여행은 어떠세요?</BannerText>
						</HStack>
					</BannerTextContainer>
					<BannerEmoji>{emojiList[Math.floor(Math.random() * emojiList.length)]}</BannerEmoji>
				</TopBannerContainer>

				<ButtonContainer>
					{buttonList.map(item => (
						<NewTravelButton onPress={item.onPress} key={item.id}>
							<NewTravelButtonTextContainer>
								<NewTravelButtonDescriptionText>{item.text}</NewTravelButtonDescriptionText>
							</NewTravelButtonTextContainer>
							<NewTravelButtonImage source={item.image} />
							<NewTravelButtonTitleText>{item.boldText}</NewTravelButtonTitleText>
						</NewTravelButton>
					))}
				</ButtonContainer>

				<CollectionContainer>
					<CollectionTitle>다님이 추천하는 여행지</CollectionTitle>
					<CollectionSubtitle>이곳으로 여행을 떠나보는건 어떠세요?</CollectionSubtitle>
					<CollectionContentContainer>
						{mainScreens.map((item, idx) => (
							<CollectionTouchableOpacity
								key={idx}
								onPress={() => {
									goCourseDetaile(item);
								}}>
								<CollectionRecommendContentItem width={DeviceWidth * 0.9}>
									<CollectionRecommendContentItemImage source={{uri: item.photo}} />
									<CollectionRecommendContentItemDescriptionContainer>
										<CollectionContentItemText>
											{item.region + '\n'}
											{item.name}
										</CollectionContentItemText>
										<CollectionContentItemHashtagText>
											#{tendencyMake([...item.concept, ...item.play, ...item.tour]).join(' #')}
										</CollectionContentItemHashtagText>
									</CollectionRecommendContentItemDescriptionContainer>
									<RightArrowIcon name='right' size={16} color={'#ccc'} />
								</CollectionRecommendContentItem>
							</CollectionTouchableOpacity>
						))}
					</CollectionContentContainer>
				</CollectionContainer>
			</MainContainer>
		</SafeAreaView>
	);
}
export const metropolitanCheckList = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '제주'];

const SafeAreaView = styled.SafeAreaView`
	height: 100%;
`;
const HeaderHStack = styled(HStack).attrs({as: TouchableOpacity})`
	padding: 0px 24px;
`;

const TopBannerContainer = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	margin-vertical: 24px;
	width: 100%;
`;
const BannerTextContainer = styled.View`
	flex-direction: column;
`;
const BannerColoredText = styled.Text`
	font-size: 24px;
	font-weight: bold;
	color: ${colors.TextPrimary};
`;
const BannerText = styled.Text`
	font-size: 24px;
	font-weight: bold;
	color: black;
`;
const BannerEmoji = styled.Text`
	font-size: 88px;
`;

const ButtonContainer = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-around;
	align-self: center;
	width: ${devicesWidth * 0.9}px;
	aspect-ratio: 2.4;
	margin-bottom: 48px;
`;

const NewTravelButton = styled.TouchableOpacity`
	width: ${devicesWidth * 0.36}px;
	aspect-ratio: 1;
	align-items: center;
	border-radius: ${devicesWidth * 0.04}px;
	background-color: ${colors.main};
	${Platform.OS === 'android' ? 'elevation: 4;' : 'box-shadow: 0px 2px 4px #ccc;'}
`;
const NewTravelButtonTextContainer = styled.View`
	align-items: center;
	justify-content: center;
	background-color: ${colors.selectButton};
	border-top-left-radius: ${devicesWidth * 0.04}px;
	border-top-right-radius: ${devicesWidth * 0.04}px;
	width: ${devicesWidth * 0.36}px;
	aspect-ratio: 5;
	margin-bottom: ${devicesWidth * 0.05}px;
`;
const NewTravelButtonDescriptionText = styled.Text`
	color: ${colors.main};
	font-size: ${devicesWidth * 0.032}px;
	font-weight: 600;
	font-family: '';
`;
const NewTravelButtonImage = styled.ImageBackground`
	width: ${devicesHeight * 0.05}px;
	aspect-ratio: 1;
	overflow: hidden;
	margin-bottom: ${devicesWidth * 0.05}px;
`;
const NewTravelButtonTitleText = styled.Text`
	color: black;
	font-size: ${devicesWidth * 0.04}px;
	font-weight: bold;
`;

const RightArrowIcon = styled(Icon)``;
const Ticket = styled(Icons)`
	margin: 0px 5px 0px 0px;
`;

const CollectionContainer = styled.View`
	margin-bottom: 12px;
`;
const CollectionTitle = styled.Text`
	font-size: 18px;
	font-weight: bold;
	margin-bottom: 4px;
	color: black;
`;
const CollectionSubtitle = styled.Text`
	font-size: 14px;
	margin-bottom: 12px;
`;
const CollectionContentContainer = styled.View`
	align-items: center;
	justify-content: space-between;
	width: 100%;
`;
const CollectionTouchableOpacity = styled.Pressable``;
const CollectionRecommendContentItem = styled.View<{width: number}>`
	width: ${props => props.width}px;
	flex-direction: row;
	padding-vertical: 8px;
	padding-horizontal: 16px;
	align-items: center;
	border-radius: 16px;
	background-color: ${colors.main};
	${Platform.OS === 'android' ? 'elevation: 4;' : 'box-shadow: 0px 2px 4px #ccc;'}
	margin-bottom: 12px;
`;
const CollectionRecommendContentItemImage = styled.Image`
	width: ${devicesWidth * 0.2}px;
	aspect-ratio: 1;
	margin-right: 24px;
	border-radius: 12px;
`;
const CollectionRecommendContentItemDescriptionContainer = styled.View`
	flex-direction: column;
	width: ${devicesWidth * 0.5}px;
	padding: 8px;
`;
const CollectionContentItemText = styled.Text`
	font-size: 16px;
	font-weight: bold;
	color: black;
	margin-bottom: 4px;
`;

const CollectionContentItemHashtagText = styled.Text`
	font-size: 12px;
	color: ${colors.TextPrimary};
`;
