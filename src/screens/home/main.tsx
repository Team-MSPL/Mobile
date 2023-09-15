import moment from 'moment';
import {Box, Button, Center, Image, ScrollView, Text, VStack} from 'native-base';
import {useEffect} from 'react';
import {Alert, BackHandler, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {getPostList} from '../../redux/community/community.slice';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {axiosAuth, getMyTravelList, travelSliceActions} from '../../redux/travel-info/travel.slice';
import {userSliceActions} from '../../redux/user/user.slice';
import {colors} from '../../utill/colors';
import {useBackHandler} from '../../utill/hooks/useBackhandler';
export default function Main({navigation}: any) {
	const goEnroll = () => {
		dispatch(travelSliceActions.reset());
		dispatch(travelSliceActions.setMakeMode('recommend'));
		navigation.navigate('EnrollInfo');
	};
	const {userProfileImage, userName, dailyReward, functionToken, signUpReward} = useAppSelector(
		state => state.userSlice,
	);
	const dispatch = useAppDispatch();
	const zxc = () => {
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
		<ScrollView bgColor='#EFFBFB' p='2'>
			<HStack>
				<Text>qwe</Text>
				<Text>asd</Text>
			</HStack>

			<Image
				source={{uri: userProfileImage == '' ? 'https://danim.me/lee.jpeg' : userProfileImage}}
				style={{width: 100, height: 100}}></Image>
			<Text fontSize='2xl' bold color={colors.TextSecondary}>
				{userName}
				<Text fontSize='2xl' color={colors.TextPrimary}>
					님,{'\n'}다님과 떠나볼까요?
				</Text>
			</Text>
			<Center my='5'>
				<Center bgColor='white' w='300' h='200' borderRadius='10px' borderWidth='1px' borderColor='grey'>
					<Button w='100' h='100' borderRadius='99px' bgColor='#58D3F7' onPress={goEnroll}>
						+{/* 플러스는 아이콘이나 svg하면 될듯 지금은 그냥 이걸로함 */}
					</Button>
					<Text mt='4' bold>
						새로운 일정 만들기
					</Text>
					<Text>새로운 여정을 추가해보세요</Text>
				</Center>
			</Center>
			<Center my='5'>
				<Center bgColor='white' w='300' h='200' borderRadius='10px' borderWidth='1px' borderColor='grey'>
					<Button w='100' h='100' borderRadius='99px' bgColor='#58D3F7' onPress={regionRecommend}>
						+{/* 플러스는 아이콘이나 svg하면 될듯 지금은 그냥 이걸로함 */}
					</Button>
					<Text mt='4' bold>
						지역 추천이요
					</Text>
					<Text>새로운 여정을 추가해보세요</Text>
				</Center>
			</Center>
			<VStack my='3'>
				<Text fontSize='md' bold>
					여긴 어때요?
				</Text>
				<Text fontSize='sm' color='grey'>
					다님에서 최대 검색지를 찾아봤어요
				</Text>
			</VStack>
			{/* <ScrollView horizontal>
				{viewList.map(item => {
					return (
						<Center m='5' key={item.id}>
							<Image size={150} borderRadius='10px' source={{uri: item.url}}></Image>
							<Text color='black' bold>
								{item.title}
							</Text>
						</Center>
					);
				})}
			</ScrollView> */}

			<Text fontSize='md' bold>
				여행 성향별 추천 코스
			</Text>
			<Text fontSize='sm' color='grey'>
				다님이 성향에 맞는 추천 코스를 찾아봤어요
			</Text>
			<TouchableOpacity onPress={() => navigation.navigate('MyTravelListMainScreen')}>
				<Text>내 여행</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => navigation.navigate('CommunityMainScreen')}>
				<Text>커뮤니티</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={zxc}>
				<Text>ㅂㅈㅂ</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => {}}>
				<Text>로그아웃</Text>
			</TouchableOpacity>
			<Box h='10'></Box>
		</ScrollView>
	);
}
const viewList = [
	{id: 0, url: 'https://www.w3schools.com/css/img_lights.jpg', title: '제주,빛의벙커'},
	{id: 1, url: 'https://wallpaperaccess.com/full/317501.jpg', title: '만장굴'},
	{id: 2, url: 'https://www.w3schools.com/css/img_lights.jpg', title: '넥슨박물관'},
];

const HStack = styled.View`
	display: inline-block;
	flex-direction: row;
`;
