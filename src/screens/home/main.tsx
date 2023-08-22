import {Box, Button, Center, Image, ScrollView, Text, VStack} from 'native-base';
import {useEffect} from 'react';
import {Alert, Linking, TouchableOpacity} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {getPostList} from '../../redux/community/community.slice';
import {axiosAuth, getMyTravelList, travelSliceActions} from '../../redux/travel-info/travel.slice';
import {colors} from '../../utill/colors';

export default function Main({navigation}: any) {
	const goEnroll = () => {
		dispatch(travelSliceActions.setMakeMode(true));
		navigation.navigate('SelectCity');
	};
	const {userProfileImage, userName} = useAppSelector(state => state.userSlice);
	const dispatch = useAppDispatch();
	const zxc = () => {
		dispatch(travelSliceActions.setSingleMode());
		navigation.navigate('Timetable');
	};
	const regionRecommend = () => {
		navigation.navigate('RegionSelectTendency');
	};
	const zkrhdrhrh = async () => {
		try {
			const message = {
				defaultTemplate: 'feed',
				content: {
					title: '카카오 공유 테스트',
					imageUrl:
						'https://mud-kage.kakao.com/dn/Q2iNx/btqgeRgV54P/VLdBs9cvyn8BJXB3o7N8UK/kakaolink40_original.png',
					link: {
						webUrl: 'http://danim.me/',
						mobileWebUrl: 'http://danim.me/',
					},
					attachment: {
						linkver: '4.0', // 사용 중인 카카오 링크 API 버전 정보
					},
					description: '카카오 링크로 공유합니다.',
				},
			};

			const encodedMessage = encodeURIComponent(JSON.stringify(message));
			await Linking.openURL(`kakaolink://send?${encodedMessage}`);

			// const response = await KaKaoShareLink.sendFeed({
			// 	content: {
			// 		title: '다님인데용',
			// 		imageUrl: 'http://danim.me/logo.png',
			// 		link: {
			// 			webUrl: 'http://danim.me/',
			// 			mobileWebUrl: 'http://danim.me/',
			// 		},
			// 		description: '다님인가?',
			// 	},
			// 	buttons: [
			// 		{
			// 			title: '앱에서 보기',
			// 			link: {
			// 				androidExecutionParams: [],
			// 				iosExecutionParams: [{key: 'openUrl', value: 'http://danim.me/'}],
			// 			},
			// 		},
			// 	],
			// });
		} catch (err) {
			console.log(err);
			Alert.alert('카공중에 에러가 뜨다니');
		}
	};
	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity
					onPress={() => {
						navigation.navigate('MoreInfo');
					}}>
					<Text>고</Text>
				</TouchableOpacity>
			),
		});
	}, []);
	useEffect(() => {
		//axiosAuth.defaults.headers.Authorization = `Bearer qwe`;
		dispatch(getMyTravelList());
		dispatch(getPostList());
	}, []);
	return (
		<ScrollView bgColor='#EFFBFB' p='2'>
			<Image source={{uri: userProfileImage}} style={{width: 100, height: 100}}></Image>
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
			<TouchableOpacity onPress={() => navigation.goBack()}>
				<Text>로그아웃</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={zkrhdrhrh}>
				<Text>카공</Text>
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
