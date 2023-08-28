/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {Alert, SafeAreaView, StatusBar, useColorScheme, Linking} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import StackNavigator from './src/stacks';
import {NativeBaseProvider} from 'native-base';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {RootState, useAppDispatch, useAppSelector} from './src/redux';
import Loading from './src/utill/loading';
import {LoadingSliceActions} from './src/redux/loading/loading.slice';
import {loginSliceActions, socialConnect} from './src/redux/user/login.slice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {KAKAO_NATIVE_KEY} from '@env';
import {userSliceActions} from './src/redux/user/user.slice';
import ViewPager from './src/utill/view-pager';
import {getOneTravelCourse, travelSliceActions} from './src/redux/travel-info/travel.slice';
import usePermission from './src/utill/hooks/usePermisson';
import NeedPermissions from './src/utill/need-permissions';
function App(): JSX.Element {
	const isDarkMode = useColorScheme() === 'dark';
	const {isLoading} = useAppSelector((state: RootState) => state.loadingSlice);
	const {isFirstLaunch} = useAppSelector((state: RootState) => state.userSlice);
	const dispatch = useAppDispatch();
	const backgroundStyle = {
		backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
	};
	const getAllKeys = async () => {
		try {
			// await AsyncStorage.clear();
			dispatch(LoadingSliceActions.onLoading());
			const [userName, userProfileImage, userToken, loginProvider] = await AsyncStorage.multiGet([
				'userName',
				'userProfileImage',
				'userToken',
				'loginProvider',
			]);
			if (userToken && userName && loginProvider) {
				dispatch(
					socialConnect({
						userName: userName[1],
						userProfileImage: userProfileImage[1],
						userToken: userToken[1],
						loginProvider: loginProvider[1] ?? '',
						signUpFlag: false,
					}),
				);
			}
		} catch (err) {
			Alert.alert('로그인 오류', '로그인을 하는 도중 오류가 발생하였습니다.');
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const getDeepLink = async () => {
		Linking.getInitialURL().then(async res => {
			try {
				if (res == null || res == undefined || res == '') {
					// 그냥 앱을 켰을때

					return;
				} else {
					//앱이 꺼져있는데 켰을때
					const pattern = /whatId=([a-zA-Z0-9]+)/;
					const match = res.match(pattern) ?? '';
					const q = await dispatch(getOneTravelCourse({travelId: match[1]}));
					if (q.payload == 0) {
						Alert.alert('타임테이블 로딩 중 에러가 발생했습니다.');
					} else {
						dispatch(travelSliceActions.setMakeMode('share'));
					}
				}
			} catch (err) {
				Alert.alert('타임테이블 로딩 중 에러가 발생했습니다.');
			}
		});
		Linking.addEventListener('url', async e => {
			try {
				//앱이 켜져있는데 켰을때
				const pattern = /whatId=([a-zA-Z0-9]+)/;
				const match = e.url.match(pattern) ?? '';
				const q = await dispatch(getOneTravelCourse({travelId: match[1]}));
				if (q.payload == 0) {
					Alert.alert('타임테이블 로딩 중 에러가 발생했습니다.');
				} else {
					dispatch(travelSliceActions.setMakeMode('share'));
				}
			} catch (err) {
				Alert.alert('타임테이블 로딩 중 에러가 발생했습니다.');
			}
		});
	};
	const checkFirstLaunch = async () => {
		try {
			const firstLaunch = await AsyncStorage.getItem('isFirstLaunch');
			if (firstLaunch == null) {
				dispatch(userSliceActions.setIsFirstLaunch('true'));
				return true;
			} else {
				return false;
			}
		} catch {
			return false;
		}
	};
	const {checkInitialPermission} = usePermission();

	const {hasPermission} = useAppSelector((state: RootState) => state.settingSlice);
	useEffect(() => {
		checkInitialPermission();
	}, [hasPermission]);
	useLayoutEffect(() => {
		getDeepLink();
	}, []);
	useEffect(() => {
		getAllKeys();
		checkFirstLaunch();
	}, []);
	const linking = {
		prefixes: [`kakao${KAKAO_NATIVE_KEY}://`],
		config: {
			screens: {
				Timetable: 'kakaolink',
			},
		},
	};
	return (
		<SafeAreaProvider>
			<StatusBar
				animated={true}
				barStyle={isDarkMode ? 'light-content' : 'dark-content'}
				backgroundColor={backgroundStyle.backgroundColor}
			/>
			<NativeBaseProvider>
				<NavigationContainer linking={linking}>
					{isFirstLaunch == 'true' ? <ViewPager /> : hasPermission ? <StackNavigator /> : <NeedPermissions />}

					{Boolean(isLoading) && <Loading />}
				</NavigationContainer>
			</NativeBaseProvider>
		</SafeAreaProvider>
	);
}

export default App;
