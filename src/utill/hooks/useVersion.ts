import VersionCheck from 'react-native-version-check';
import {useAppDispatch} from '../../redux';
import {setNeedVersionUpdate, setVersion} from '../../redux/setting/settingSlice';
import {Platform} from 'react-native';

const useVersion = () => {
	const dispatch = useAppDispatch();
	const checkVersion = () => {
		VersionCheck.needUpdate({
			depth: 2,
		}).then(res => {
			if (res.isNeeded) {
				dispatch(
					setNeedVersionUpdate({
						status: true,
						storeUrl:
							Platform.OS == 'android'
								? 'https://play.google.com/store/apps/details?id=com.danimmobile&hl=en&gl=US'
								: 'itms-apps://apps.apple.com/KR/app/id6467421025',
					}),
				);
			}
			dispatch(setVersion({nowVersion: res.currentVersion, latestVersion: res.latestVersion}));
		});
	};
	return {checkVersion};
};
export default useVersion;
