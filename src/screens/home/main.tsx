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
		let season = Array(4).fill(0);
		let index = Math.floor((selectStartDate.month() + 1) / 3) - 1;
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
					<NewTravelButton>
						<VStack>
							<ButtonText>{userName}님, 자유롭게 짜고 싶나요?</ButtonText>
							<ButtonBoldText>혼자 만들어보기</ButtonBoldText>
						</VStack>
						<Icon name={'pluscircle'} size={20} color={'white'} />
					</NewTravelButton>
					<NewTravelButton onPress={regionRecommend}>
						<VStack>
							<ButtonText>어디로 가실지 고민 중이신가요?</ButtonText>
							<ButtonBoldText>지역 추천 받기</ButtonBoldText>
						</VStack>
						<Icon name={'pluscircle'} size={20} color={'white'} />
					</NewTravelButton>
				</ButtonContainer>
				<CollectionContainer>
					<VStack>
						<CollectionTitle>I들이 조용히 머물 수 있는 곳</CollectionTitle>
						<CollectionSubtitle>숲과 바다를 감상할 수 있는 사색명소</CollectionSubtitle>
						<CollectionContentContainer>
							{viewList.map(item => (
								<CollectionContentItem key={item.id}>
									<CollectionContentItemImage source={{uri: item.url}} />
									<CollectionContentItemText>{item.title}</CollectionContentItemText>
								</CollectionContentItem>
							))}
						</CollectionContentContainer>
					</VStack>
				</CollectionContainer>
				<CollectionContainer>
					<VStack>
						<CollectionTitle>E들이 조용히 머물 수 있는 곳</CollectionTitle>
						<CollectionSubtitle>숲과 바다를 감상할 수 있는 사색명소</CollectionSubtitle>
						<CollectionContentContainer>
							{viewList.map(item => (
								<CollectionContentItem key={item.id}>
									<CollectionContentItemImage source={{uri: item.url}} />
									<CollectionContentItemText>{item.title}</CollectionContentItemText>
								</CollectionContentItem>
							))}
						</CollectionContentContainer>
					</VStack>
				</CollectionContainer>
			</MainContainer>
		</SafeAreaView>
	);
}
const viewList = [
	{id: 0, url: 'https://www.w3schools.com/css/img_lights.jpg', title: '제주,빛의벙커'},
	{id: 1, url: 'https://wallpaperaccess.com/full/317501.jpg', title: '만장굴'},
	{id: 2, url: 'https://www.w3schools.com/css/img_lights.jpg', title: '넥슨박물관'},
	{id: 3, url: 'https://www.w3schools.com/css/img_lights.jpg', title: '아몰라'},
];

const SafeAreaView = styled.SafeAreaView`
	height: 100%;
`;

const ButtonContainer = styled.View`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 400px;
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

const ButtonText = styled.Text`
	color: white;
`;
const ButtonBoldText = styled.Text`
	color: white;
	font-size: 18px;
	font-weight: bold;
`;

const CollectionContainer = styled.View`
	padding-horizontal: 24px;
	padding-vertical: 27px;
	margin-bottom: 12px;
	border-radius: 20px;
	border: ${colors.border};
	height: 500px;
`;
const CollectionTitle = styled.Text`
	font-size: 18px;
	font-weight: bold;
`;
const CollectionSubtitle = styled.Text`
	font-size: 14px;
	margin-bottom: 12px;
`;
const CollectionContentContainer = styled.View`
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-between;
`;
const CollectionContentItem = styled.View`
	width: 48%;
	aspect-ratio: 1;
	margin-bottom: 24px;
	border-radius: 12px;
	align-items: center;
`;
const CollectionContentItemImage = styled.Image`
	width: 100%;
	height: 100%;
	border-radius: 12px;
	margin-bottom: 4px;
`;
const CollectionContentItemText = styled.Text`
	font-size: 12px;
`;
