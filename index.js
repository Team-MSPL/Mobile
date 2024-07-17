/**
 * @format
 */

import {AppRegistry, Vibration} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {store} from './src/redux/index';
import {Provider} from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import './src/i18n/i18n';
messaging().setBackgroundMessageHandler(async msg => {
	Vibration.vibrate(400);
});
const appRedux = ({isHeadless}) => {
	if (isHeadless) {
		return null;
	}
	return (
		<Provider store={store}>
			<App />
		</Provider>
	);
};
AppRegistry.registerComponent(appName, () => appRedux);
