/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback, useEffect} from 'react';
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
function App(): JSX.Element {
	const isDarkMode = useColorScheme() === 'dark';
	const {isLoading} = useAppSelector((state: RootState) => state.loadingSlice);
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
		console.log('별별별별별별별별별별별별별별별별별별별별별별별별별별별별별별');
		console.log(await Linking.getInitialURL());
		Linking.getInitialURL().then(res => {
			if (res == null || res == undefined || res == '') {
				console.log('베베ㅔ');
				return;
			} else {
				console.log('하이요');
			}
		});
		Linking.addEventListener('url', e => {
			console.log('왔섭');
		});
	};
	useEffect(() => {
		getAllKeys();
		getDeepLink();
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
					<StackNavigator />
					{Boolean(isLoading) && <Loading />}
				</NavigationContainer>
			</NativeBaseProvider>
		</SafeAreaProvider>
	);
}

export default App;
