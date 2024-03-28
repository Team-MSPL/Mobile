/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useLayoutEffect} from 'react';
import {Alert, BackHandler, Linking, StatusBar, useColorScheme, Vibration} from 'react-native';

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
import Toast from 'react-native-toast-message';
import messaging from '@react-native-firebase/messaging';
import Event from './src/utill/component/event/event';
import moment from 'moment';
import {eventSliceActions, getEventList} from './src/redux/event/event.slice';
import NeedVersionUpdate from './src/screens/network/needVersionUpdate';
//import messaging from '@react-native-firebase/messaging';
function App(): JSX.Element {
	const isDarkMode = useColorScheme() === 'dark';
	const {isLoading} = useAppSelector((state: RootState) => state.loadingSlice);
	const {isFirstLaunch} = useAppSelector((state: RootState) => state.userSlice);
	const {networkConn, serverConn} = useAppSelector(state => state.networkSlice);
	const {eventState} = useAppSelector(state => state.eventSlice);
	const {needVersionUpdate} = useAppSelector(state => state.settingSlice);
	const dispatch = useAppDispatch();
	const backgroundStyle = {
		backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
	};

	const getAllKeys = async () => {
		try {
			// await AsyncStorage.clear();
			dispatch(LoadingSliceActions.onLoading());
			let [userName, userProfileImage, userToken, loginProvider] = await AsyncStorage.multiGet([
				'userName',
				'userProfileImage',
				'userToken',
				'loginProvider',
			]);
			const fcmToken = await getFcmToken();
			if (userToken && userName && loginProvider) {
				dispatch(
					socialConnect({
						userName: userName[1],
						userProfileImage: userProfileImage[1],
						userToken: userToken[1],
						loginProvider: loginProvider[1] ?? '',
						fcmToken: fcmToken ?? '',
						signUpFlag: false,
						version: 2,
					}),
				);
			}
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '네트워크 연결이 불안정합니다',
					modalSubTitle: '확인후 다시 시도해주세요',
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
				if (res == null || res == undefined || res == '') {
					// 그냥 앱을 켰을때

					return;
				} else {
					//앱이 꺼져있는데 켰을때
					const pattern = /whatId=([a-zA-Z0-9]+)/;
					const match = res.match(pattern) ?? '';
					const q = await dispatch(getOneTravelCourse({travelId: match[1]}));
					if (q.payload == 'ERR_BAD_REQUEST') {
						dispatch(
							modalSliceActions.setOpenModal({
								modalTitle: '일정 소유자가 일정을 삭제했어요!',
								modalFunction: goOffApp,
							}),
						);
					} else {
						dispatch(travelSliceActions.setMakeMode({shareViewWithStartFlag: false, makeMode: 'share'}));
					}
				}
			} catch (err) {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '일정 소유자가 일정을 삭제했어요!',
						modalFunction: goOffApp,
					}),
				);
			}
		});
		Linking.addEventListener('url', async e => {
			try {
				//앱이 켜져있는데 켰을때
				const pattern = /whatId=([a-zA-Z0-9]+)/;
				const match = e.url.match(pattern) ?? '';
				const q = await dispatch(getOneTravelCourse({travelId: match[1]}));
				if (q.payload == 0) {
					dispatch(
						modalSliceActions.setOpenModal({
							modalTitle: '일정 소유자가 일정을 삭제했어요!',
							modalFunction: goOffApp,
						}),
					);
				} else {
					dispatch(travelSliceActions.setMakeMode({shareViewWithStartFlag: false, makeMode: 'share'}));
				}
			} catch (err) {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '일정 소유자가 일정을 삭제했어요!',
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

	const getFcmToken = async () => {
		const fcmToken = await messaging().getToken();
		console.log(fcmToken);
		dispatch(userSliceActions.setFcmToken({fcmToken: fcmToken}));
		return fcmToken;
		//console.log('[FCM Token] ', fcmToken);
	};
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
		//getFcmToken();
		const unsubscribe = messaging().onMessage(async remoteMessage => {
			Vibration.vibrate(400);
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: remoteMessage.notification?.title,
					modalSubTitle: remoteMessage.notification?.body,
				}),
			);
		});

		return unsubscribe;
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
				{
					// isFirstLaunch == 'true' ? (
					// 	<ViewPager handleFunction={handleFirstLaunch} />
					//
					<StackNavigator />
					// isFirstLaunch == 'true' ? <ViewPager handleFunction={handleFirstLaunch} /> : <StackNavigator />
					// hasPermission || noPermission ? (

					// ) : (
					// 	<NeedPermissions />
					// )
				}
				{needVersionUpdate && <NeedVersionUpdate />}
				{eventState && <Event />}
				{!(networkConn && serverConn) && <Connection />}
				{<BaseModal />}
				{Boolean(isLoading) && <Loading />}
				<Toast />
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
