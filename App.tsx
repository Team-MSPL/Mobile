/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
	StatusBar,
	useColorScheme,
} from 'react-native';

import {
	Colors,
} from 'react-native/Libraries/NewAppScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StackNavigator from './src/stacks';
import { NativeBaseProvider } from 'native-base';


function App(): JSX.Element {
	const isDarkMode = useColorScheme() === 'dark';

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
				<StackNavigator/>
			</NativeBaseProvider>
		</SafeAreaProvider>
	);
}



export default App;
