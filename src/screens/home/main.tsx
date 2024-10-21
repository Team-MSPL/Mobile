import {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useAppDispatch, useAppSelector} from '../../redux';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import {getNoteList, userSliceActions} from '../../redux/user/user.slice';
import {regionRecommendSliceActions} from '../../redux/travel-info/region-recommend.slice';
import {eventSliceActions, getEventList} from '../../redux/event/event.slice';
import {getHomeRegionInfo, getPlaceRecommendInMainScreen} from '../../redux/setting/settingSlice';

import {colors} from '../../utill/colors';
import {HStack, PretendardBoldText, PretendardSemiBoldText, PretendardVariable} from '../../utill/layout/layout';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {SVGCalendarRecommend, SVGGood, SVGNoteList, SVGRegionRecommend, SVGRightAdd} from '../../utill/svg/svg';
import styled from 'styled-components/native';
import {cityViewList} from '../enroll-info/select-city';

import {useBackHandler} from '../../utill/hooks/useBackhandler';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';
import {Modal, Platform, SafeAreaView} from 'react-native';
import ViewPager from '../../utill/view-pager';
import {useViewPager} from '../../utill/hooks/useViewPager';
import {logEvent, setUserId, setUserProperty} from '../../../firebaseAnalytice';
import {useTranslation} from 'react-i18next';
import Carousel from 'react-native-reanimated-carousel';
import {NoteCount} from '../more/more-info';
import LoadingTimetable from '../../utill/component/timetable/loading-timetable';
export default function Main({navigation}: any) {
	const {homeRegionImage, appLanguages} = useAppSelector(state => state.settingSlice);
	const {userName, signUpReward, reLogin, userId, analyticeFlag, socialloginProvider} = useAppSelector(
		state => state.userSlice,
	);
	const {selectStartDate, shareLoginFlag, aiList} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const [mainScreens, setMainScreens] = useState<mainScreensType[]>([]);
	const {t, i18n} = useTranslation();

	const regionRecommend = async () => {
		dispatch(regionRecommendSliceActions.reset());
		dispatch(travelSliceActions.reset());
		navigation.navigate('RegionSelectWho');
		await logEvent('place_step1', {});
	};
	const goEnroll = () => {
		let season = Array(4).fill(0);
		let index = Math.floor((selectStartDate.month() + 1) / 3) - 1;
		index < 0 ? (season[3] = 1) : (season[index] = 1);
		dispatch(travelSliceActions.setTravelStart({makeMode: 'recommend', season: season, globalFlag: false}));
		navigation.navigate('EnrollTravelTitle');
	};
	const goGlobal = () => {
		let season = Array(4).fill(0);
		let index = Math.floor((selectStartDate.month() + 1) / 3) - 1;
		index < 0 ? (season[3] = 1) : (season[index] = 1);
		dispatch(travelSliceActions.setTravelStart({makeMode: 'recommend', season: season, globalFlag: true}));
		navigation.navigate('EnrollTravelTitle');
	};
	// useEffect(() => {
	// 	const japanList =
	// 		'도쿄,후쿠오카,오사카,삿포로,오키나와,교토,나고야,유후,고베,요코하마,나가사키,나라,히로시마,가고시마,오타루,요이치,샤코탄,노보리베츠,무로란,도야코,쿄고쿠,니세코,굿찬,시라오이,아사히카와,우베,아바시리,소베츠,하코다테,우라호로,샤리,왓카나이,도요토미,토마마에,루모이,호쿠류,다키카와,아시베츠,우타시나이,비바이,토마코마이,니캇푸,신히다카,우라카와,에리모,타카스,오토이넷푸,오비히로,메무로,마쿠베츠,오토후케,시미즈,히다카,비라토리,란코시,쿠로마츠나이,세타나,오토베,에사시,카미노쿠니,마츠마에,후쿠시마,시리우치,키코나이,호쿠토,후쿠이,치바,시카베,모리,야쿠모,이와나이,에베쓰,이와미자와,미카사,우라우스,비에이,가미후라노,나카후라노,가루이자와마치,구사쓰,쓰마고이,다카야마,후라노,아카비라,스나가와,토마,히가시카와,몬베츠,나요로,가미시호로,가미카와,엔가루,키타미,타키노우에,유베츠,오조라,츠베츠,테시카가,시베차,코시미즈,기요사토,나카시베츠,쓰루이,구시로,앗케시,남포로,유니,나가누마,에니와,니키,다카마쓰,마루가메,가마쿠라시,야마토,마츠다,토요타,마츠모토,우에다,아즈미노,스와,시오지리,토미오카,안나카,다카사키,치치부,고후,하코네,타마,오야마,후지노미야,미시마,칸나미,아타미,이즈,이토,니시이즈,누마즈,아시카가,칸라,코가,마츠도,후나바시,이시오카,오시노,치요다,후지요시다,고토,쿠와나,타치카와,분쿄,세타가야,세키,한노,미하마,스미다,사가미하라,히가시쿠루메,후지사와,기타,하치오지,가쓰시카,코가네이,후지카와구치코,히타치오타,도코로자와,도요하시,미야즈,조후,닛코,마이즈루,하마마츠,야마나카코,시바야마,안조,네리마,히라츠카,사쿠라가와,토다,다카시마,나루사와,오츠키,케이힌지마,오카자키,나스,이비가와,요로,코시가야,요시미,가와사키,이즈노쿠니,후추,미노부,시모츠마,이타바시,이나베,이케다,히라카타,이가,다카토리,도베,야나가와,야마구치,마쓰에,야스기,사카이미나토,히메지,기시와다,사카이,가시하라,우쓰노미야,미토,히타치,시로이시,야마가타,요코테,히로사키,고쇼가와라,아오모리,코사카,히라이즈미,이치노세키,오사키,카미,이시노마키,마츠시마,리후,센다이,다가조,카미노야마,요네자와,기타카타,아이즈와카마츠,가타시나,아사고,이카루가,나가토,내 거,난토,다카오카,구리하라,가나자와,코야,와카야마,나루토,시부카와,요시오카,나가노,다테야마,이미즈,오쓰,야스,와카사,오바마,이네,구라요시,이즈모,구레,타마노,오카야마,아카이와,코카,모리야마,쓰루,와카야마현,치바현,미야기,미야기현';
	// 	const asd = japanList.split(',');
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
	const getNoteListData = async () => {
		try {
			const dataList = await dispatch(getNoteList()).unwrap();
			setNoteList(dataList);
		} catch (err) {
			dispatch(modalSliceActions.setOpenModal({modalTitle: '잠시후 다시 시도해주세요'}));
		} finally {
		}
	};
	useLayoutEffect(() => {
		getNoteListData();
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
		socialloginProvider != 'anonymous' && checkCache();
		if (
			navigation.getState().routes[navigation.getState().index].name != 'FinalCheck' &&
			navigation.getState().routes[navigation.getState().index].name != 'RegionSelectDistance' &&
			signUpReward
		) {
			navigation.navigate('HomeModal', {status: '회원가입'});
		} else if (reLogin) {
			navigation.navigate('HomeModal', {status: '재가입'});
		}
		checkEvent();
	}, [signUpReward, socialloginProvider]);

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
	return (
		<SafeAreaView>
			<HomeContainer showsVerticalScrollIndicator={false}>
				<BackgroundImage source={{uri: homeRegionImage.photo}}>
					<BrighnessBox>
						{socialloginProvider != 'anonymous' && (
							<TicketTouchable>
								<NoteCount>
									<PretendardSemiBoldText size={9} lineHeight={13} color={colors.backgroundWhite}>
										{noteList.length}
									</PretendardSemiBoldText>
								</NoteCount>
								<SVGNoteList
									onPress={() => {
										navigation.navigate('NoteList');
									}}
									width={widthPercentage(33)}
									height={widthPercentage(33)}></SVGNoteList>
							</TicketTouchable>
						)}
						<HomeTextContainer
							heightFlag={socialloginProvider == 'anonymous'}
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
					<PretendardSemiBoldText size={18} lineHeight={21.6} color={colors.Gray5}>
						다님 사용자들의 생생한 후기
					</PretendardSemiBoldText>
					<Carousel
						loop
						style={{
							marginTop: 18,
						}}
						width={widthPercentage(337)}
						height={heightPercentage(160)}
						autoPlay={true}
						data={[1, 2, 3]}
						scrollAnimationDuration={1000}
						onSnapToItem={() => {}}
						autoPlayInterval={4000}
						renderItem={({index}) => (
							<VividReviewContainer>
								<HStack>
									<PretendardBoldText size={16} lineHeight={20} color={colors.Black}>
										{vividList[index].name} 님{' '}
									</PretendardBoldText>
									<PretendardBoldText size={14} lineHeight={18} color={colors.Black}>
										( {vividList[index].region} ) 📝
									</PretendardBoldText>
								</HStack>
								<PretendardBoldText size={12} lineHeight={18} color={colors.Gray3}>
									{vividList[index].title}
								</PretendardBoldText>
							</VividReviewContainer>
						)}
					/>
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
	left: ${widthPercentage(305)}px;
	width: ${widthPercentage(50)}px;
	height: ${widthPercentage(50)}px;
	align-items: center;
	justify-content: center;
`;
const HomeTextContainer = styled.Pressable<{heightFlag: boolean}>`
	top: ${props => heightPercentage(props.heightFlag ? 275 : 225)}px;
	left: ${widthPercentage(26)}px;
`;

const CollectionContainer = styled.View`
	margin-top: ${heightPercentage(36)}px;
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
const VividReviewContainer = styled.View`
	width: ${widthPercentage(326)}px;
	height: ${heightPercentage(160)}px;
	padding-horizontal: ${widthPercentage(30)}px;
	padding-top: ${widthPercentage(15)}px;
	gap: ${widthPercentage(10)}px;
	background-color: ${colors.backgroundWhite};
	border-width: 2px;
	border-radius: 12px;
	border-color: ${colors.Gray2};
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
