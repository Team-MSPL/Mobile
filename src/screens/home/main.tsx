import {useEffect} from 'react';
import {Dimensions, Platform, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icons from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import {updateFunctionToken, userSliceActions} from '../../redux/user/user.slice';
import {colors} from '../../utill/colors';
import {useAppsflyer} from '../../utill/hooks/useAppsflyer';
import {useBackHandler} from '../../utill/hooks/useBackhandler';
import {HStack, HeaderContianer, MainContainer, devicesHeight, devicesWidth} from '../../utill/layout/layout';
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
	const checkList = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '제주'];
	const selectPopularity = (e: {id: number; subTitle: string}) => {
		let season = Array(4).fill(0);
		let index = Math.floor((selectStartDate.month() + 1) / 3) - 1;
		index < 0 ? (season[3] = 1) : (season[index] = 1);
		let region = checkList.includes(e.subTitle) ? ['전체'] : [e.subTitle];
		dispatch(
			travelSliceActions.setPopuarityClickStart({
				makeMode: 'recommend',
				season: season,
				cityIndex: e.id,
				region: region,
			}),
		);
		navigation.navigate('EnrollTravelTitle');
	};

	const {userName, functionToken, signUpReward} = useAppSelector(state => state.userSlice);
	const {selectStartDate} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
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
		navigation.setOptions({
			headerRight: () => (
				<HeaderHStack>
					<Ticket name='ticket' size={26} color={colors.selectButton} />
					<BannerColoredText>{functionToken}</BannerColoredText>
				</HeaderHStack>
			),
		});
	}, [functionToken]);
	useEffect(() => {
		if (signUpReward) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '회원가입 축하드립니다',
					modalSubTitle: `회원가입 기념 이용권을 드렸습니다. ${functionToken}개 입니다.\n이용권은 추천 기능에 사용됩니다.`,
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
	const uniqueTravelList = [
		{
			id: 0,
			imagePath: require('../../../public/images/uniqueTravelImage/danyang.jpeg'),
			city: '단양',
			title: '패러글라이딩',
			hashtag: '#액티비티 #교통이편한 #나홀로\n#연인과 #친구와 #레저스포츠',
			lat: 36.9966,
			lng: 128.3965,
		},
		{
			id: 1,
			imagePath: require('../../../public/images/uniqueTravelImage/daejeon.jpeg'),
			city: '대전',
			title: '성심당 본점',
			hashtag: '#쇼핑 #실내여행지 #맛있는\n#교통이편한 #이색체험',
			lat: 36.3277,
			lng: 127.4273,
		},
		{
			id: 2,
			imagePath: require('../../../public/images/uniqueTravelImage/donghae.jpeg'),
			city: '동해',
			title: '묵호항',
			hashtag: '#교통이편한#쇼핑#연인과#친구와#산책',
			lat: 37.5519,
			lng: 129.1149,
		},
		{
			id: 3,
			imagePath: require('../../../public/images/uniqueTravelImage/sejong.jpeg'),
			city: '세종',
			title: '고복자연공원',
			hashtag: '#알뜰한 #반려동물과 #공원\n#산책 #사진명소',
			lat: 36.6113,
			lng: 127.2385,
		},
		{
			id: 4,
			imagePath: require('../../../public/images/uniqueTravelImage/asan.jpeg'),
			city: '아산',
			title: '지중해마을',
			hashtag: '#알뜰한 #가족과 #사진명소\n#시티투어 #산책',
			lat: 36.7975,
			lng: 127.0605,
		},
		{
			id: 5,
			imagePath: require('../../../public/images/uniqueTravelImage/osan.jpeg'),
			city: '오산',
			title: '반려동물테마파크',
			hashtag: '#힐링 #교통이편한 #반려동물과\n#이색체험 #산책',
			lat: 37.1396,
			lng: 127.064,
		},
		{
			id: 6,
			imagePath: require('../../../public/images/uniqueTravelImage/jangsu.jpeg'),
			city: '장수',
			title: '의암주논개생가지',
			hashtag: '#교통이편한 #알뜰한 #유적지\n#전통한옥',
			lat: 35.6802,
			lng: 127.6208,
		},
		{
			id: 7,
			imagePath: require('../../../public/images/uniqueTravelImage/chungdo.jpeg'),
			city: '청도',
			title: '프로방스',
			hashtag: '#교통이편한 #사진명소 #산책',
			lat: 35.6843,
			lng: 128.7182,
		},
	];
	const buttonList: ButtonListType[] = [
		{
			id: 1,
			onPress: goEnroll,
			image: require('../../../public/images/destination.png'),
			text: '일정 추천받을래요',
			boldText: '여행 일정 만들기',
		},
		{
			id: 2,
			onPress: regionRecommend,
			image: require('../../../public/images/map.png'),
			text: '지역 추천받을래요',
			boldText: '여행 지역 추천받기',
		},
	];
	const DeviceWidth = Dimensions.get('window').width;
	const randomRegion = regionList[Math.floor(Math.random() * regionList.length)];
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
const HeaderHStack = styled(HStack)`
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
