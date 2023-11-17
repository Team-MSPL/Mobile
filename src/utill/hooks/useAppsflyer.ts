import appsFlyer from 'react-native-appsflyer';

export const useAppsflyer = () => {
	const appsflyerLogEvent = ({name, value}: {name: string; value: {id: string}}) => {
		appsFlyer.logEvent(
			name,
			value,
			res => {
				console.log(res);
			},
			err => {
				console.error(err);
			},
		);
	};
	return {appsflyerLogEvent};
};
