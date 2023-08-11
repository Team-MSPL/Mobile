/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, StatusBar, useColorScheme} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import StackNavigator from './src/stacks';
import {NativeBaseProvider} from 'native-base';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {RootState, useAppSelector} from './src/redux';
import Loading from './src/utill/loading';

function App(): JSX.Element {
	const isDarkMode = useColorScheme() === 'dark';
	const {isLoading} = useAppSelector((state: RootState) => state.loadingSlice);

	const backgroundStyle = {
		backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
	};

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
