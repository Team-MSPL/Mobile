import AsyncStorage from '@react-native-async-storage/async-storage';
import {Box, Center, Image, Text} from 'native-base';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';
import {useAppDispatch} from '../redux';
import {userSliceActions} from '../redux/user/user.slice';
export default function ViewPager() {
	const dispatch = useAppDispatch();
	const handleFirstLaunch = async () => {
		dispatch(userSliceActions.setIsFirstLaunch('false'));
		await AsyncStorage.setItem('isFirstLaunch', 'true');
	};
	return (
		<Center position='absolute' display='flex' bgColor='rgba(0, 0, 0, 0.4)' w='100%' h='100%'>
			<Text>ㅋㅋㅋㅋ 우리앱 첨이네 ㅋㅋ</Text>
			<Text bold fontSize='lg'>
				앱 쓰고싶으면 국민 950002-00-241241 로 100,000원 보내세요
			</Text>
			<TouchableOpacity style={{backgroundColor: 'orange'}} onPress={handleFirstLaunch}>
				<Text>보냈습니당~!!!! </Text>
			</TouchableOpacity>
		</Center>
	);
}
