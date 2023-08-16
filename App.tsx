/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {Alert, StatusBar, useColorScheme} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeBaseProvider} from 'native-base';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {RootState, useAppDispatch, useAppSelector} from './src/redux';
import {LoadingSliceActions} from './src/redux/loading/loading.slice';
import {socialConnect} from './src/redux/user/login.slice';
import StackNavigator from './src/stacks';
import Loading from './src/utill/loading';

function App(): JSX.Element {
	const isDarkMode = useColorScheme() === 'dark';
	const {isLoading} = useAppSelector((state: RootState) => state.loadingSlice);
	const dispatch = useAppDispatch();
	const backgroundStyle = {
		backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
	};
	const getAllKeys = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			// const q = await AsyncStorage.getAllKeys();
			// AsyncStorage.multiRemove(q);
			const userId = await AsyncStorage.getItem('userId'); //소셜아이디
			const userName = await AsyncStorage.getItem('userName'); //사용자이름
			const userJwtToken = await AsyncStorage.getItem('userJwtToken');
			const userToken = await AsyncStorage.getItem('userToken');

			const popop = await AsyncStorage.getItem('loginProvider'); //사용자이름
			console.log(userName, userId);
			console.log('토토토ㅗ토', popop);
			// const provider = await AsyncStorage.getItem('provider'); //플랫폼
			// const userId = await AsyncStorage.getItem('userId'); //소셜아이디
			// const userName = await AsyncStorage.getItem('userName'); //사용자이름
			console.log('pp', userJwtToken, 'yy', userId, 'na', userName);
			if (userId && userName) {
				dispatch(
					socialConnect({
						userName: userName,
						userToken: userToken,
						loginProvider: popop,
						signUpFlag: false,
						userProfileImage: 'qwe',
					}),
				);
			}
		} catch (err) {
			Alert.alert('로그인 오류', '로그인을 하는 도중 오류가 발생하였습니다.');
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	useEffect(() => {
		getAllKeys();
	}, []);

	return (
		<SafeAreaProvider>
			<StatusBar
				animated={true}
				barStyle={isDarkMode ? 'light-content' : 'dark-content'}
				backgroundColor={backgroundStyle.backgroundColor}
			/>
			<NativeBaseProvider>
				<StackNavigator />
				{Boolean(isLoading) && <Loading />}
			</NativeBaseProvider>
		</SafeAreaProvider>
	);
}

export default App;
