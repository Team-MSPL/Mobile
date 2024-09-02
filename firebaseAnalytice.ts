import analytics from '@react-native-firebase/analytics';

// Firebase Analytics 함수

// 이벤트 로깅 함수
export const logEvent = async (eventName: string, eventParameters: {[key: string]: any}) => {
	try {
		await analytics().logEvent(eventName, eventParameters);
	} catch (e) {
		console.error('Failed to log event:', e);
	}
};

// 사용자 속성 설정 함수
export const setUserProperty = async (propertyName: string, propertyValue: string) => {
	try {
		await analytics().setUserProperty(propertyName, propertyValue);
	} catch (e) {
		console.error('Failed to set user property:', e);
	}
};

// User ID 설정 함수
export const setUserId = async (userId: string) => {
	try {
		await analytics().setUserId(userId);
	} catch (e) {
		console.error('Failed to set user ID:', e);
	}
};

// 화면 조회 함수
export const logScreenView = async (title: string, url: string, params: {[key: string]: any}) => {
	try {
		if (params) {
			await analytics().setDefaultEventParameters(params);
		}

		await analytics().logScreenView({
			screen_name: title,
			screen_class: url,
		});
	} catch (e) {
		console.error('Failed to log screen view:', e);
	}
};
