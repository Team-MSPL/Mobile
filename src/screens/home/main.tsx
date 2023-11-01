import {useEffect} from 'react';
import {Dimensions, Platform} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/AntDesign';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import {userSliceActions} from '../../redux/user/user.slice';
import {colors} from '../../utill/colors';
import {useAppsflyer} from '../../utill/hooks/useAppsflyer';
import {useBackHandler} from '../../utill/hooks/useBackhandler';
import {MainContainer, devicesHeight, devicesWidth} from '../../utill/layout/layout';
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
	const {userName, functionToken, signUpReward} = useAppSelector(state => state.userSlice);
	const {selectStartDate} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const soloMaking = () => {
		appsflyerLogEvent({name: 'solo_make', value: {id: 'danim'}});
		dispatch(travelSliceActions.setSingleMode());
		navigation.navigate('EnrollTravelTitle');
	};
	const regionRecommend = () => {
		appsflyerLogEvent({name: 'region_recommend', value: {id: 'danim'}});
		navigation.navigate('RegionSelectTendency');
	};
	const checkSignUpReward = () => {
		dispatch(userSliceActions.setSignUpReward(false));
	};
	const goCourseDetaile = (e: any) => {
		const data = {name: e.city + e.title, lat: e.lat, lng: e.lng};
		navigation.navigate('CourseDetail', {value: data});
	};
	useEffect(() => {
		if (signUpReward) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '회원가입 축하드립니다',
					modalSubTitle: `회원가입 기념 이용권을 드렸습니다. ${functionToken}개 입니다.`,
					modalFunction: checkSignUpReward,
				}),
			);
		}
	}, []);
	useBackHandler();

	interface ButtonListType {
		id: number;
		onPress: () => void;
		image: any;
		text: string;
		boldText: string;
		icon: string;
	}
	const emojiList = ['🏖', '🏕', '🍲', '📸', '🏃', '🗼', '🚅', '🛫', '🛳', '🚗', '🦐'];
	const regionList = ['서울', '부산', '제주', '강릉', '단양', '여수', '울산', '대전', '광주', '경주'];
	const uniqueTravelList = [
		{
			id: 0,
			imagePath: require('../../../public/images/uniqueTravelImage/danyang.jpeg'),
			city: '단양',
			title: '패러글라이딩',
			hashtag: '#레저스포츠',
			lat: 36.9966,
			lng: 128.3965,
		},
		{
			id: 1,
			imagePath: require('../../../public/images/uniqueTravelImage/daejeon.jpeg'),
			city: '대전',
			title: '성심당 본점',
			hashtag: '#맛있는',
			lat: 36.3277,
			lng: 127.4273,
		},
		{
			id: 2,
			imagePath: require('../../../public/images/uniqueTravelImage/donghae.jpeg'),
			city: '목포',
			title: '목포항',
			hashtag: '#바다',
			lat: 34.7807,
			lng: 126.383,
		},
		{
			id: 3,
			imagePath: require('../../../public/images/uniqueTravelImage/sejong.jpeg'),
			city: '세종',
			title: '고복자연공원',
			hashtag: '#공원',
			lat: 36.6113,
			lng: 127.2385,
		},
		{
			id: 4,
			imagePath: require('../../../public/images/uniqueTravelImage/asan.jpeg'),
			city: '아산',
			title: '지중해마을',
			hashtag: '#시티투어',
			lat: 36.7975,
			lng: 127.0605,
		},
		{
			id: 5,
			imagePath: require('../../../public/images/uniqueTravelImage/osan.jpeg'),
			city: '오산',
			title: '반려동물테마파크',
			hashtag: '#반려견',
			lat: 37.1396,
			lng: 127.064,
		},
		{
			id: 6,
			imagePath: require('../../../public/images/uniqueTravelImage/jangsu.jpeg'),
			city: '장수',
			title: '의암주논개생가지',
			hashtag: '#유적지',
			lat: 35.6802,
			lng: 127.6208,
		},
		{
			id: 7,
			imagePath: require('../../../public/images/uniqueTravelImage/chungdo.jpeg'),
			city: '청도',
			title: '프로방스',
			hashtag: '#이색체험',
			lat: 35.6843,
			lng: 128.7182,
		},
	];
	const buttonList: ButtonListType[] = [
		{
			id: 1,
			onPress: soloMaking,
			image: require('../../../public/images/han_river.png'),
			text: `${userName}님, \n직접 만들고 싶나요?`,
			boldText: '직접 일정 만들기',
			icon: 'pluscircle',
		},
		{
			id: 2,
			onPress: goEnroll,
			image: require('../../../public/images/bukchon_hanok.png'),
			text: `${userName}님, \n다님과 떠나볼까요?`,
			boldText: '여행 일정 만들기',
			icon: 'pluscircle',
		},
		{
			id: 3,
			onPress: regionRecommend,
			image: require('../../../public/images/busan.jpg'),
			text: '어디로 떠날지\n고민중이신가요?',
			boldText: '지역 추천 받기',
			icon: 'arrowright',
		},
	];
	const DeviceWidth = Dimensions.get('window').width;
	const buttonRenderItem = ({item}: {item: ButtonListType}) => {
		return (
			<NewTravelButton onPress={item.onPress} key={item.id}>
				<NewTravelButtonImage source={item.image}>
					<ButtonGradient
						start={{x: 0.5, y: 1}}
						end={{x: 0.5, y: 0.5}}
						colors={[`${colors.selectButton}`, 'transparent']}>
						<NewTravelButtonText>{item.text}</NewTravelButtonText>
						<NewTravelButtonBoldText>{item.boldText}</NewTravelButtonBoldText>
					</ButtonGradient>
				</NewTravelButtonImage>
			</NewTravelButton>
		);
	};

	return (
		<SafeAreaView>
			<MainContainer>
				<TopBannerContainer>
					<BannerTextContainer>
						<BannerText>
							<BannerColoredText>{userName}</BannerColoredText>님,{'\n'}현재 인기 여행지{'\n'}
							<BannerColoredText>
								{regionList[Math.floor(Math.random() * regionList.length)]}
							</BannerColoredText>
							여행은 어떠세요?
						</BannerText>
					</BannerTextContainer>
					<BannerEmoji>{emojiList[Math.floor(Math.random() * emojiList.length)]}</BannerEmoji>
				</TopBannerContainer>
				<ButtonContainer>
					<Carousel
						data={buttonList}
						renderItem={buttonRenderItem}
						sliderWidth={devicesWidth * 0.9}
						itemWidth={devicesHeight * 0.3}
						loop={false}
						firstItem={1}
					/>
				</ButtonContainer>
				{/* <BoldDivider></BoldDivider> */}
				<CollectionContainer>
					<CollectionTitle>다님이 추천하는 이색 여행지</CollectionTitle>
					<CollectionSubtitle>이곳으로 여행을 떠나보는건 어떠세요?</CollectionSubtitle>
					<CollectionContentContainer>
						{uniqueTravelList.map(item => (
							<CollectionTouchableOpacity
								key={item.id}
								onPress={() => {
									goCourseDetaile(item);
								}}>
								<CollectionRecommendContentItem width={DeviceWidth * 0.9} key={item.id}>
									<CollectionRecommendContentItemImage source={item.imagePath} />
									<CollectionRecommendContentItemDescriptionContainer>
										<CollectionContentItemText>
											{item.city + '\n'}
											{item.title}
										</CollectionContentItemText>
										<CollectionContentItemHashtagText>
											{item.hashtag}
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

const SafeAreaView = styled.SafeAreaView`
	height: 100%;
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
	align-items: center;
	margin-bottom: 48px;
`;
const ButtonGradient = styled(LinearGradient)`
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	height: 100%;
	padding: 12px;
	justify-content: flex-end;
`;
const NewTravelButton = styled.TouchableOpacity`
	border-radius: 12px;
	overflow: hidden;
`;
const NewTravelButtonImage = styled.ImageBackground`
	width: ${devicesHeight * 0.4}px;
	aspect-ratio: 1;
	border-radius: 12px;
	overflow: hidden;
`;
const NewTravelButtonText = styled.Text`
	color: white;
	font-size: ${devicesWidth * 0.04}px;
	font-weight: thin;
`;
const NewTravelButtonBoldText = styled.Text`
	color: white;
	font-size: ${devicesWidth * 0.05}px;
	font-weight: bold;
`;
const NewTravelButtonIcon = styled(Icon)`
	margin-left: auto;
	margin-right: 12px;
`;

const RightArrowIcon = styled(Icon)``;

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
const CollectionTouchableOpacity = styled.TouchableOpacity``;
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
