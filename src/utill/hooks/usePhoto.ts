import ImageCropPicker from 'react-native-image-crop-picker';
import {useAppDispatch} from '../../redux';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {openSettings} from 'react-native-permissions';
import {useRef} from 'react';

export const usePhoto = () => {
	const dispatch = useAppDispatch();
	const goPermission = async () => {
		await openSettings();
	};
	const imageDataRef = useRef<string[]>([]);
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
		console.log('a');
		ImageCropPicker.openPicker({
			width: 300,
			height: 400,
			size: 1000,
			multiple: true,
			maxFiles: 5,
			mediaType: 'photo',
			croppingQuality: 0.6,
			compressImageQuality: 0.25,
			cropping: true,
			//includeBase64: true,
		})
			.then(response => {
				console.log('cc');
				if (response.length + photoData.length <= 5) {
					let temporaryList = [];
					for (let i = 0; i < response.length; i++) {
						temporaryList.push(response[i].path);
						// temporaryList.push(`data:${response[i].mime};base64,${response[i]?.data}`);
						// imageDataRef.current.push(response[i].path);
					}
					changeFunction([...photoData, ...temporaryList]);
					(!saveCheck ?? false) && setSaveCheck && setSaveCheck(true);
					return imageDataRef.current;
				} else {
					dispatch(modalSliceActions.setOpenModal({modalTitle: '최대 5장까지 선택가능합니다.'}));
					return false;
				}
			})
			.catch(re => {
				console.log('l', re);
				re == 'Error: User did not grant library permission.' &&
					dispatch(
						modalSliceActions.setOpenModal({
							modalTitle: '권한 설정',
							modalSubTitle: '현재 권한이 거부된 상태입니다.\n위치 정보 권한을 설정하러 가시겠습니까?',
							modalLeft: true,
							modalFunction: goPermission,
						}),
					);
			});
	};

	return {handleImagePickerLaunch};
};
