import {Linking} from 'react-native';
import VersionCheck from 'react-native-version-check';
import {useAppDispatch} from '../../redux';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {setVersion} from '../../redux/setting/settingSlice';

const useVersion = () => {
	const dispatch = useAppDispatch();
	const checkVersion = () => {
		VersionCheck.needUpdate({
			depth: 2,
		}).then(res => {
			if (res.isNeeded) {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '업데이트',
						modalSubTitle: '새로운 여행을 위해 업데이트가 필요해요!',
						modalFunction: () => {
							Linking.openURL(res.storeUrl);
						},
					}),
				);
			}
			dispatch(setVersion({nowVersion: res.currentVersion, latestVersion: res.latestVersion}));
		});
	};
	return {checkVersion};
};
export default useVersion;
