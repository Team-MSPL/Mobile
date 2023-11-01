/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useLayoutEffect} from 'react';
import {BackHandler, Linking, StatusBar, useColorScheme} from 'react-native';

import {Appsflyer_ios_id, Appsflyer_key, KAKAO_NATIVE_KEY} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import {NavigationContainer} from '@react-navigation/native';
import appsFlyer from 'react-native-appsflyer';
import CodePush from 'react-native-code-push';
import LottieSplashScreen from 'react-native-lottie-splash-screen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {RootState, useAppDispatch, useAppSelector} from './src/redux';
import {LoadingSliceActions} from './src/redux/loading/loading.slice';
import {modalSliceActions} from './src/redux/modal/modalSlice';
import {networkSliceActions} from './src/redux/network/networkSlice';
import {getOneTravelCourse, travelSliceActions} from './src/redux/travel-info/travel.slice';
import {socialConnect} from './src/redux/user/login.slice';
import {userSliceActions} from './src/redux/user/user.slice';
import Connection from './src/screens/network/connection';
import StackNavigator from './src/stacks';
import BaseModal from './src/utill/base-modal';
import usePermission from './src/utill/hooks/usePermisson';
import Loading from './src/utill/loading';
import NeedPermissions from './src/utill/need-permissions';
import ViewPager from './src/utill/view-pager';
import useVersion from './src/utill/hooks/useVersion';
function App(): JSX.Element {
	const isDarkMode = useColorScheme() === 'dark';
	const {isLoading} = useAppSelector((state: RootState) => state.loadingSlice);
	const {isFirstLaunch} = useAppSelector((state: RootState) => state.userSlice);
	const {networkConn, serverConn} = useAppSelector(state => state.networkSlice);
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
	const setNetInfoEvent = () => {
		NetInfo.addEventListener(state => {
			const networkConnection = !!state.isConnected;
			dispatch(networkSliceActions.setNetworkConn(networkConnection));
		});
	};
	appsFlyer.initSdk(
		{
			devKey: Appsflyer_key,
			isDebug: false,
			appId: Appsflyer_ios_id,
			onInstallConversionDataListener: false, //Optional
			onDeepLinkListener: true, //Optional
			timeToWaitForATTUserAuthorization: 10, //for iOS 14.5
		},
		result => {
			console.log(result);
		},
		error => {
			console.error(error);
		},
	);
	const {hasPermission, noPermission} = useAppSelector((state: RootState) => state.settingSlice);
	const lottieHide = () => {
		setTimeout(() => LottieSplashScreen.hide(), 3000);
	};
	const {checkVersion} = useVersion();
	useEffect(() => {
		checkInitialPermission();
	}, [hasPermission, noPermission]);
	useLayoutEffect(() => {
		getDeepLink();
	}, []);
	useEffect(() => {
		getAllKeys();
		checkFirstLaunch();
		lottieHide();
		checkVersion();
		setNetInfoEvent();
		// return () => {
		// 	setNetInfoEvent();
		// };
	}, []);
	const linking = {
		prefixes: [`kakao${KAKAO_NATIVE_KEY}://`],
		config: {
			screens: {
				Timetable: 'kakaolink',
			},
		},
	};
	const handleFirstLaunch = async () => {
		dispatch(userSliceActions.setIsFirstLaunch('false'));
		await AsyncStorage.setItem('isFirstLaunch', 'true');
	};
	return (
		<SafeAreaProvider>
			<StatusBar
				animated={true}
				barStyle={isDarkMode ? 'light-content' : 'dark-content'}
				backgroundColor={backgroundStyle.backgroundColor}
			/>
			<NavigationContainer linking={linking}>
				{isFirstLaunch == 'true' ? (
					<ViewPager handleFunction={handleFirstLaunch} />
				) : hasPermission || noPermission ? (
					<StackNavigator />
				) : (
					<NeedPermissions />
				)}
				{!(networkConn && serverConn) && <Connection />}
				{<BaseModal />}
				{Boolean(isLoading) && <Loading />}
			</NavigationContainer>
		</SafeAreaProvider>
	);
}
const codePushOptions = {
	checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
	updateDialog: {
		title: '내부 업데이트가 존재합니다.',
		optionalUpdateMessage: '보다 안정적인 서비스 사용을 위해 내부 업데이트 후 재실행 합니다.',
		optionalInstallButtonLabel: '업데이트',
		optionalIgnoreButtonLabel: '나중에',
	},
	installMode: CodePush.InstallMode.IMMEDIATE,
};
export default CodePush(codePushOptions)(App);
