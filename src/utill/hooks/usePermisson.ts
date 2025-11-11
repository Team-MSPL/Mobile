import {AppState, Platform} from 'react-native';
import {
	PERMISSIONS,
	checkMultiple,
	Permission,
	requestMultiple,
	request,
	requestNotifications,
} from 'react-native-permissions';
import {useAppDispatch} from '../../redux';
import {setNopermission, setPermission} from '../../redux/setting/settingSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const usePermission = () => {
	const dispatch = useAppDispatch();
	// OS별 필수 권한
	const androidPermissions = [
		//33버전 이후부터는 얘만
		PERMISSIONS.ANDROID.RECEIVE_WAP_PUSH,
		PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
		PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, // 그 전 버전들은 아래 애들
		PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
	];
	const iosPermissions = [
		// PERMISSIONS.IOS.PHOTO_LIBRARY,
		// PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
		PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY,
	];
	const androidSDKVersion = Platform.Version;
	const needPermission =
		Platform.OS === 'android'
			? androidSDKVersion >= 33
				? androidPermissions.splice(0, 2)
				: androidPermissions.splice(0, 3)
			: iosPermissions;

	// 앱 실행했을 때 혹은 로그아웃 이후 권한 체크
	const checkInitialPermission = async () => {
		const {hasBlocked, deniedList} = await checkPermissions();
		if (hasBlocked || deniedList.length) dispatch(setPermission(false));
		else dispatch(setPermission(true));
	};

	// Partial<Record<Partial<Permission>, PermissionStatus>>
	const checkPermissions = async (props?: {[key: string]: string}) => {
		let checkResult: {[key: string]: string} = {};
		let hasBlocked = false; // blocked가 있으면 설정창 이동 모달 오픈
		let deniedList: Permission[] = [];
		const noPermissionCheck = await AsyncStorage.getItem('noPermission');
		if (noPermissionCheck == 'true') {
			dispatch(setNopermission(true));
		} else {
			const listener = AppState.addEventListener('change', status => {
				if (Platform.OS === 'ios' && status === 'active') {
					request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY)
						.then(result => console.log(result))
						.catch(error => console.log(error));
				}
			});
			await requestNotifications(['alert', 'sound']);
			// await requestMultiple(needPermission);
			checkResult = props || (await checkMultiple(needPermission));
			for (let permission in checkResult) {
				if (checkResult[permission] === 'denied') {
					deniedList.push(permission as PermissionStatus);
				} else if (checkResult[permission] === 'blocked') {
					hasBlocked = true;
				}
			}
		}
		return {hasBlocked, deniedList};
	};

	return {
		needPermission,
		checkInitialPermission,
		checkPermissions,
	};
};

type PermissionStatus =
	| 'android.permission.CAMERA'
	| 'android.permission.READ_EXTERNAL_STORAGE'
	| 'android.permission.WRITE_EXTERNAL_STORAGE'
	| 'ios.permission.CAMERA'
	| 'ios.permission.PHOTO_LIBRARY';

export default usePermission;
