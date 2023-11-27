/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {store} from './src/redux/index';
import {Provider} from 'react-redux';
import messaging from '@react-native-firebase/messaging';
// messaging().setBackgroundMessageHandler(async msg => {
// 	console.log(msg);
// });
const appRedux = () => (
	<Provider store={store}>
		<App />
	</Provider>
);
AppRegistry.registerComponent(appName, () => appRedux);
