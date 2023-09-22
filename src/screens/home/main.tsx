import {useEffect} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import {userSliceActions} from '../../redux/user/user.slice';
import {colors} from '../../utill/colors';
import {useBackHandler} from '../../utill/hooks/useBackhandler';
import {MainContainer, VStack} from '../../utill/layout/layout';
export default function Main({navigation}: any) {
	const goEnroll = () => {
		const season = Array(4).fill(0);
		const index = Math.floor((selectStartDate.month() + 1) / 3) - 1;
		index < 0 ? (season[3] = 1) : (season[index] = 1);
		dispatch(travelSliceActions.setTravelStart({makeMode: 'recommend', season: season}));
		navigation.navigate('EnrollTravelTitle');
	};
	const {userProfileImage, userName, dailyReward, functionToken, signUpReward} = useAppSelector(
		state => state.userSlice,
	);
	const {selectStartDate} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const zxc = () => {
		// dispatch(
		// 	modalSliceActions.setOpenModal({
		// 		modalTitle: '안내창',
		// 		modalSubTitle: '지역 선택을 안하셨습니다.',
		// 	}),
		// );
		dispatch(travelSliceActions.setSingleMode());
		navigation.navigate('Timetable');
	};
	const regionRecommend = () => {
		navigation.navigate('RegionSelectTendency');
	};
	const checkDailyReward = () => {
		dispatch(userSliceActions.setCheckDailyReward());
	};
	const checkSignUpReward = () => {
		dispatch(userSliceActions.setSignUpReward(false));
	};
	useEffect(() => {
		if (signUpReward) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '회원가입 축하드립니다',
					modalSubTitle: `회원가입 기념 토큰을 드렸습니다. ${functionToken}개 입니다.`,
					modalFunction: checkSignUpReward,
				}),
			);
		} else {
			dailyReward &&
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '데일리 보상!',
						modalSubTitle: `토큰이 하나 추가됐습니다. ${functionToken}개 입니다.`,
						modalFunction: checkDailyReward,
					}),
				);
		}
	}, []);
	useBackHandler();
	return (
		<SafeAreaView>
			<MainContainer>
				<ButtonContainer>
					<NewTravelButton onPress={goEnroll}>
						<VStack>
							<ButtonText>{userName}, 다님과 떠나볼까요?</ButtonText>
							<ButtonBoldText>여행 일정 만들기</ButtonBoldText>
						</VStack>
						<Icon name={'pluscircle'} size={20} color={'white'} />
					</NewTravelButton>
				</ButtonContainer>
				<AloneRecommendButtonContainer>
					<NewTravelAloneButton>
						<VStack>
							<ButtonText>자유롭게 짜고 싶나요?</ButtonText>
							<ButtonBoldText>혼자 만들어보기</ButtonBoldText>
						</VStack>
					</NewTravelAloneButton>
					<TravelRecommendButton onPress={regionRecommend}>
						<VStack>
							<ButtonText>여행지를 추천해드려요</ButtonText>
							<ButtonBoldText>지역 추천 받기</ButtonBoldText>
						</VStack>
					</TravelRecommendButton>
				</AloneRecommendButtonContainer>

				<CollectionContainer>
					<CollectionTitle>다님이 추천하는 이색 여행지</CollectionTitle>
					<CollectionSubtitle>이곳으로 여행을 떠나보는건 어떠세요?</CollectionSubtitle>
					<CollectionContentContainer>
						{uniqueTravelList.map(item => (
							<CollectionContentItem key={item.id}>
								<CollectionContentItemImage source={item.imagePath} />
								<CollectionContentItemText>{item.title}</CollectionContentItemText>
								<CollectionContentItemHashtag>
									<CollectionContentItemHashtagText>{item.hashtag}</CollectionContentItemHashtagText>
								</CollectionContentItemHashtag>
							</CollectionContentItem>
						))}
					</CollectionContentContainer>
				</CollectionContainer>
			</MainContainer>
		</SafeAreaView>
	);
}
const uniqueTravelList = [
	{
		id: 0,
		imagePath: require('../../../public/images/uniqueTravelImage/danyang.jpeg'),
		title: '단양 패러글라이딩',
		hashtag: '#레저스포츠',
	},
	{
		id: 1,
		imagePath: require('../../../public/images/uniqueTravelImage/daejeon.jpeg'),
		title: '대전 성심당',
		hashtag: '#맛있는',
	},
	{
		id: 2,
		imagePath: require('../../../public/images/uniqueTravelImage/donghae.jpeg'),
		title: '동해 목포항',
		hashtag: '#바다',
	},
	{
		id: 3,
		imagePath: require('../../../public/images/uniqueTravelImage/sejong.jpeg'),
		title: '세종 고복자연공원',
		hashtag: '#공원',
	},
	{
		id: 4,
		imagePath: require('../../../public/images/uniqueTravelImage/asan.jpeg'),
		title: '아산 지중해마을',
		hashtag: '#시티투어',
	},
	{
		id: 5,
		imagePath: require('../../../public/images/uniqueTravelImage/osan.jpeg'),
		title: '오산 반려동물테마파크',
		hashtag: '#반려견',
	},
	{
		id: 6,
		imagePath: require('../../../public/images/uniqueTravelImage/jangsu.jpeg'),
		title: '장수 의암주논개생가지',
		hashtag: '#유적지',
	},
	{
		id: 7,
		imagePath: require('../../../public/images/uniqueTravelImage/chungdo.jpeg'),
		title: '청도 프로방스',
		hashtag: '#이색체험',
	},
];

const SafeAreaView = styled.SafeAreaView`
	height: 100%;
`;

const ButtonContainer = styled.View`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 120px;
`;

const NewTravelButton = styled.TouchableOpacity`
	width: 100%;
	height: 100px;
	padding: 6%;
	margin-bottom: 10px;
	border-radius: 24px;
	background-color: ${colors.selectButton};
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`;

const AloneRecommendButtonContainer = styled.View`
	flex-direction: row;
	justify-content: space-between;
	height: 150px;
`;
const NewTravelAloneButton = styled.TouchableOpacity`
	width: 48%;
	height: 100px;
	padding: 6%;
	margin-bottom: 10px;
	border-radius: 24px;
	background-color: #ff6b6b;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`;
const TravelRecommendButton = styled.TouchableOpacity`
	width: 48%;
	height: 100px;
	padding: 6%;
	margin-bottom: 10px;
	border-radius: 24px;
	background-color: #77dd77;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`;

const ButtonText = styled.Text`
	color: white;
`;
const ButtonBoldText = styled.Text`
	color: white;
	font-size: 18px;
	font-weight: bold;
`;

const CollectionContainer = styled.View`
	margin-bottom: 12px;
`;
const CollectionTitle = styled.Text`
	font-size: 18px;
	font-weight: bold;
	margin-bottom: 4px;
`;
const CollectionSubtitle = styled.Text`
	font-size: 14px;
	margin-bottom: 12px;
`;
const CollectionContentContainer = styled.View`
	align-items: center;
	justify-content: center;
	flex-direction: row;
	flex-wrap: wrap;
`;
const CollectionContentItem = styled.View`
	width: 120px;
	height: 160px;
	margin: 12px;
	border-radius: 12px;
	align-items: center;
	justify-content: center;
`;
const CollectionContentItemImage = styled.Image`
	width: 120px;
	height: 120;
	border-radius: 12px;
	margin-bottom: 4px;
`;
const CollectionContentItemText = styled.Text`
	font-size: 12px;
`;

const CollectionContentItemHashtag = styled.View`
	width: 80px;
	height: 32px;
	border-radius: 12px;
	padding: 8px;
	align-items: center;
	justify-content: center;
	background-color: #2698fa9f;
`;
const CollectionContentItemHashtagText = styled.Text`
	font-size: 12px;
	color: ${colors.main};
`;
