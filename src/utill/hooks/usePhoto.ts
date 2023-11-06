import ImageCropPicker from 'react-native-image-crop-picker';
import {useAppDispatch} from '../../redux';
import {modalSliceActions} from '../../redux/modal/modalSlice';

export const usePhoto = () => {
	const dispatch = useAppDispatch();
	const handleImagePickerLaunch = ({
		photoData,
		changeFunction,
		saveCheck,
		setSaveCheck,
	}: {
		photoData: any;
		changeFunction: any;
		saveCheck?: any;
		setSaveCheck?: any;
	}) => {
		ImageCropPicker.openPicker({
			width: 300,
			height: 400,
			size: 1000,
			multiple: true,
			maxFiles: 5,
			mediaType: 'photo',
			croppingQuality: 0.6,
			compressImageQuality: 0.3,
			cropping: true,
			includeBase64: true,
		}).then(response => {
			if (response.length + photoData.length <= 5) {
				let temporaryList = [];
				for (let i = 0; i < response.length; i++) {
					temporaryList.push(`data:${response[i].mime};base64,${response[i]?.data}`);
				}
				changeFunction([...photoData, ...temporaryList]);
				(!saveCheck ?? false) && setSaveCheck && setSaveCheck(true);
				return true;
			} else {
				dispatch(modalSliceActions.setOpenModal({modalTitle: '최대 5장까지 선택가능합니다.'}));
				return false;
			}
		});
	};

	return {handleImagePickerLaunch};
};
