import {Platform} from 'react-native';
import {PERMISSIONS, checkMultiple, Permission} from 'react-native-permissions';
import {useAppDispatch} from '../../redux';
import {setPermission} from '../../redux/setting/settingSlice';

const usePermission = () => {
	const dispatch = useAppDispatch();
	// OS별 필수 권한
	const androidPermissions = [
		PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
		PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
		// PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
		// PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
	];
	const iosPermissions = [
		PERMISSIONS.IOS.CAMERA,
		PERMISSIONS.IOS.PHOTO_LIBRARY,
		PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
	];
	const needPermission = Platform.OS === 'android' ? androidPermissions : iosPermissions;

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

		checkResult = props || (await checkMultiple(needPermission));
		console.log(checkResult);
		for (let permission in checkResult) {
			if (checkResult[permission] === 'denied') {
				deniedList.push(permission as PermissionStatus);
			} else if (checkResult[permission] === 'blocked') {
				hasBlocked = true;
			}
		}
		console.log('번', hasBlocked, '게', deniedList);
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
