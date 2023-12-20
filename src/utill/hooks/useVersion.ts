import VersionCheck from 'react-native-version-check';
import {useAppDispatch} from '../../redux';
import {setNeedVersionUpdate, setVersion} from '../../redux/setting/settingSlice';

const useVersion = () => {
	const dispatch = useAppDispatch();
	const checkVersion = () => {
		VersionCheck.needUpdate({
			depth: 2,
		}).then(res => {
			if (res.isNeeded) {
				dispatch(setNeedVersionUpdate({status: true, storeUrl: res.storeUrl}));
			}
			dispatch(setVersion({nowVersion: res.currentVersion, latestVersion: res.latestVersion}));
		});
	};
	return {checkVersion};
};
export default useVersion;
