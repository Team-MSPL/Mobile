import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import styled from 'styled-components/native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Touchable, TouchableOpacity, Image, Alert, Platform} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {logout, updateFunctionToken, updateProfile, userSliceActions, userWithdraw} from '../../redux/user/user.slice';
import {colors} from '../../utill/colors';
import CustomButton from '../../utill/component/custom-button';
import ImageCropPicker from 'react-native-image-crop-picker';
export default function ChangeProfile({navigation}: any) {
	const {isLogin, userName, socialloginProvider, functionToken, userId, userProfileImage} = useAppSelector(
		state => state.userSlice,
	);
	const [image, setImage] = useState('');
	const dispatch = useAppDispatch();
	//애뮬레이터 확인 불가
	const handleImagePickerLaunch = () => {
		ImageCropPicker.openPicker({
			multiple: false,
			mediaType: 'photo',
			cropping: true,
			includeBase64: Platform.OS == 'android',
		}).then(response => {
			//setPostImage(prevImages => [...prevImages, ...selectedImageUris]);
			setImage(response.path);
			console.log('이미지 주소', response.path);
		});
	};
	const goChangeProfile = () => {
		try {
			dispatch(
				updateProfile({
					userName: nickname,
					userProfileImage: image,
				}),
			);
			dispatch(
				userSliceActions.setNicknameAndImage({
					userName: nickname,
					userProfileImage: image,
				}),
			);

			navigation.goBack();
		} catch (err) {
			Alert.alert('프로필 변경 중 에러가 발생했습니다.');
		}
	};
	const [nickname, setNickname] = useState(userName);
	const changeNickname = (e: string) => {
		setNickname(e);
	};
	return (
		<SafeAreaView style={{backgroundColor: colors.main}}>
			<Text>닉네임이요</Text>
			<InputProfileContainer>
				<InputWrap>
					<CustomTextInput
						text={nickname}
						placeholder='ex)홍길동 최대 8자이내 '
						value={nickname}
						onChangeText={(value: string) => changeNickname(value)}
						maxLength={8}
						clearButtonMode='while-editing'
					/>
					{nickname && (
						<TouchableOpacity
							style={{position: 'absolute', right: 8, top: 8}}
							onPress={() => {
								setNickname('');
							}}>
							<Text>clear</Text>
						</TouchableOpacity>
					)}
				</InputWrap>

				<Text>사진 바꾸세유유유ㅜ우</Text>
				<TouchableOpacity onPress={handleImagePickerLaunch}>
					<Text>사진이요</Text>
				</TouchableOpacity>
				{image && <Image source={{uri: image}} style={{width: 100, height: 100}}></Image>}
				<CustomButton label={'변경'} onPress={goChangeProfile} />
			</InputProfileContainer>
		</SafeAreaView>
	);
}

const InputProfileContainer = styled.View`
	display: flex;
	margin-top: 24px;
	background-color: ${colors.main};
	padding: 10px;
`;

const InputWrap = styled.View`
	flex-direction: row;
	display: flex;
	width: 100%;
`;
const Text = styled.Text`
	font-size: 20px;
	line-height: 30px;
	color: black;
`;

const CustomTextInput = styled.TextInput<{text: string}>`
	width: 100%;
	padding: 8px;
	font-size: 16px;
	font-weight: 400;
	border-width: 1px;
	border-radius: 8px;
	border-color: ${({text}: {text: string}) => (text == '' ? 'grey' : 'black')};
`;
