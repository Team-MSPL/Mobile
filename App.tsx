/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useLayoutEffect} from 'react';
import {BackHandler, Linking, StatusBar, useColorScheme} from 'react-native';

import {KAKAO_NATIVE_KEY} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {NativeBaseProvider} from 'native-base';
import LottieSplashScreen from 'react-native-lottie-splash-screen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootState, useAppDispatch, useAppSelector} from './src/redux';
import {LoadingSliceActions} from './src/redux/loading/loading.slice';
import {modalSliceActions} from './src/redux/modal/modalSlice';
import {getOneTravelCourse, travelSliceActions} from './src/redux/travel-info/travel.slice';
import {socialConnect} from './src/redux/user/login.slice';
import {userSliceActions} from './src/redux/user/user.slice';
import StackNavigator from './src/stacks';
import BaseModal from './src/utill/base-modal';
import usePermission from './src/utill/hooks/usePermisson';
import Loading from './src/utill/loading';
import NeedPermissions from './src/utill/need-permissions';
import ViewPager from './src/utill/view-pager';
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
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '로그인 중 에러가 발생했습니다.',
				}),
			);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const goOffApp = () => {
		BackHandler.exitApp();
	};
	const getDeepLink = async () => {
		Linking.getInitialURL().then(async res => {
			try {
				console.log(res);
				if (res == null || res == undefined || res == '') {
					console.log('첫번째 if요', res);
					// 그냥 앱을 켰을때

					return;
				} else {
					console.log('첫번쨰 else요', res);
					//앱이 꺼져있는데 켰을때
					const pattern = /whatId=([a-zA-Z0-9]+)/;
					const match = res.match(pattern) ?? '';
					console.log(match);
					const q = await dispatch(getOneTravelCourse({travelId: match[1]}));
					if (q.payload == 0) {
						dispatch(
							modalSliceActions.setOpenModal({
								modalTitle: '타임 테이블 로딩 중 에러가 발생했습니다.',
								modalFunction: goOffApp,
							}),
						);
					} else {
						console.log('두번쨰 else요', res);
						dispatch(travelSliceActions.setMakeMode('share'));
					}
				}
			} catch (err) {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '타임 테이블 로딩 중 에러가 발생했습니다.',
						modalFunction: goOffApp,
					}),
				);
			}
		});
		Linking.addEventListener('url', async e => {
			try {
				//앱이 켜져있는데 켰을때
				console.log('1', e);
				const pattern = /whatId=([a-zA-Z0-9]+)/;
				const match = e.url.match(pattern) ?? '';
				const q = await dispatch(getOneTravelCourse({travelId: match[1]}));
				if (q.payload == 0) {
					dispatch(
						modalSliceActions.setOpenModal({
							modalTitle: '타임 테이블 로딩 중 에러가 발생했습니다.',
							modalFunction: goOffApp,
						}),
					);
				} else {
					console.log('3', e);
					dispatch(travelSliceActions.setMakeMode('share'));
				}
			} catch (err) {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '타임 테이블 로딩 중 에러가 발생했습니다.',
						modalFunction: goOffApp,
					}),
				);
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
	const lottieHide = () => {
		setTimeout(() => LottieSplashScreen.hide(), 3000);
	};
	useEffect(() => {
		checkInitialPermission();
	}, [hasPermission]);
	useLayoutEffect(() => {
		getDeepLink();
	}, []);
	useEffect(() => {
		getAllKeys();
		checkFirstLaunch();
		lottieHide();
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
					{<BaseModal />}
					{Boolean(isLoading) && <Loading />}
				</NavigationContainer>
			</NativeBaseProvider>
		</SafeAreaProvider>
	);
}

export default App;
