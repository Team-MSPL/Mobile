import {JSX, JSXElementConstructor, ReactElement, useEffect, useLayoutEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {Alert, Platform, TextInput, TouchableOpacity, Image} from 'react-native';
import {Text, Box, ScrollView, VStack, Divider, Slider, Center, HStack, Spacer} from 'native-base';

import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import moment from 'moment';
import CustomButton from '../../utill/component/custom-button';
import ImageCropPicker from 'react-native-image-crop-picker';
import {updateDiary} from '../../redux/travel-info/travel.slice';
export default function InputDiary({navigation}: any) {
	const {travelId, region, diary, picture, reviewCheck} = useAppSelector(state => state.travelSlice);
	const {userId} = useAppSelector(state => state.userSlice);
	const dispatch = useAppDispatch();
	const [diaryValue, setDiaryValue] = useState(diary);

	const [pictureValue, setpictureValue] = useState<string[]>(picture);
	const changeDiary = (e: string) => {
		setDiaryValue(e);
	};
	const goSaveDiary = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			const data = {travelId: travelId, diary: diaryValue, picture: pictureValue};
			await dispatch(updateDiary(data));
			navigation.goBack();
		} catch (err) {
			Alert.alert('업로드 중 에러가 발생했습니다.');
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const handelGetImage = async () => {
		ImageCropPicker.openPicker({
			width: 300,
			height: 400,
			size: 1000,
			multiple: true,
			mediaType: 'photo',
			croppingQuality: 0.6,
			compressImageQuality: 0.3,
			cropping: true,
			includeBase64: true,
		}).then(response => {
			let temporaryList = [];
			for (let i = 0; i < response.length; i++) {
				temporaryList.push(`data:${response[i].mime};base64,${response[i]?.data}`);
			}
			//setPostImage(prevImages => [...prevImages, ...selectedImageUris]);
			setpictureValue(temporaryList);
		});
	};
	return (
		<ScrollView bgColor='#EFFBFB'>
			<Text>입력 하면됨{pictureValue.length}</Text>
			<TextInput
				style={{borderWidth: 1}}
				value={diaryValue}
				onChangeText={(value: string) => changeDiary(value)}></TextInput>
			{pictureValue.length != 0 ? (
				<>
					{pictureValue.map((item, idx) => (
						<Image key={idx} source={{uri: item}} style={{width: 100, height: 100}}></Image>
					))}
					<TouchableOpacity onPress={handelGetImage}>
						<Text>사진바꿔치기!</Text>
					</TouchableOpacity>
				</>
			) : (
				<TouchableOpacity onPress={handelGetImage}>
					<Text>사진추가하기요</Text>
				</TouchableOpacity>
			)}
			<CustomButton label={diary == '' ? '저장' : '수정'} onPress={goSaveDiary}></CustomButton>
		</ScrollView>
	);
}
