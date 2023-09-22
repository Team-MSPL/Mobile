import AsyncStorage from '@react-native-async-storage/async-storage';
import {Box, Center, Image, Text} from 'native-base';
import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';
import styled from 'styled-components/native';
import {useAppDispatch} from '../redux';
import {userSliceActions} from '../redux/user/user.slice';
export default function ViewPager() {
	const dispatch = useAppDispatch();
	const handleFirstLaunch = async () => {
		dispatch(userSliceActions.setIsFirstLaunch('false'));
		await AsyncStorage.setItem('isFirstLaunch', 'true');
	};
	const [page, setPage] = useState(0);
	return (
		<ViewPagerContainer>
			<TouchableOpacity style={{backgroundColor: 'orange'}} onPress={handleFirstLaunch}>
				<Text>앱을 다운받아주셔서 감사합니다! </Text>
			</TouchableOpacity>
		</ViewPagerContainer>
	);
}
const ViewPagerContainer = styled.View`
	position: absolute;
	width: 100%;
	height: 100%;
	align-items: center;
	justify-content: center;
	background-color: rgba(0, 0, 0, 0.4);
`;
