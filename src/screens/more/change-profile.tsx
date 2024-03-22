import styled from 'styled-components/native';
import React, {useRef, useState} from 'react';
import {TouchableOpacity, Pressable, Keyboard} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {updateProfile, userSliceActions} from '../../redux/user/user.slice';
import {colors} from '../../utill/colors';
import CustomButton from '../../utill/component/custom-button';
import ImageCropPicker from 'react-native-image-crop-picker';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {BackgroundGray, Center, PretendardSemiBoldText} from '../../utill/layout/layout';
import Icon from 'react-native-vector-icons/AntDesign';
import {SVGCamera, SvgCancel} from '../../utill/svg/svg';
import {FilterList} from '../../utill/filter';
import {getStorage, ref, getDownloadURL, uploadBytes} from 'firebase/storage';
import {storage, firebase} from '../../../config';
import {useUriToBlob} from '../../utill/hooks/useUriToBlob';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {fontPercentage, heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {ButtonContainer} from '../enroll-info/select-multi';
// import firebase from '../../../';

export default function ChangeProfile({navigation}: any) {
	const {userName, userProfileImage, userId} = useAppSelector(state => state.userSlice);
	const [image, setImage] = useState(userProfileImage);
	const uploadImageRef = useRef('');
	const dispatch = useAppDispatch();
	const uploadImage = async (e: string) => {
		const response = await useUriToBlob(e);
		var ref = firebase.storage().ref('profile').child(`${userId}/profile.png`).put(response);
		//var ref = firebase.storage().ref('test').child(`test/photo1.png`).delete();
		try {
			await ref;
			let copy = await getImage();
			return copy;
		} catch (e) {
			console.log(e);
		}
	};

	const getImage = async () => {
		const storage = getStorage();
		const reference = ref(storage, `profile/${userId}/profile.png`);
		let downloadUrl = '';
		await getDownloadURL(reference).then(x => {
			downloadUrl = x;
		});
		return downloadUrl;
	};
	const handleImagePickerLaunch = () => {
		ImageCropPicker.openPicker({
			width: 300,
			height: 400,
			size: 1000,
			multiple: false,
			mediaType: 'photo',
			croppingQuality: 0.6,
			compressImageQuality: 0.3,
			cropping: true,
			includeBase64: true,
		}).then(response => {
			//setPostImage(prevImages => [...prevImages, ...selectedImageUris]);
			uploadImageRef.current = response.path;
			setImage(`data:${response.mime};base64,${response?.data}`);

			//setImage(response?.sourceURL);
			//uploadImage(response.path);
		});
	};
	const goChangeProfile = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			if (FilterList.includes(nickname)) {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '사용불가',
						modalSubTitle: '사용 불가한 닉네임입니다.',
					}),
				);
			} else {
				let userProfileImage =
					uploadImageRef.current != '' ? (await uploadImage(uploadImageRef.current)) ?? '' : image;
				dispatch(
					updateProfile({
						userName: nickname,
						userProfileImage: userProfileImage,
					}),
				);
				dispatch(
					userSliceActions.setNicknameAndImage({
						userName: nickname,
						userProfileImage: userProfileImage,
					}),
				);

				navigation.goBack();
			}
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '프로필 변경이 실패하였습니다.',
					modalSubTitle: '잠시후 다시 시도해주세요',
					modalFunction: () => {},
				}),
			);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const [nickname, setNickname] = useState(userName);
	const changeNickname = (e: string) => {
		setNickname(e);
	};
	return (
		<ProfileContainer
			onPress={() => {
				Keyboard.dismiss();
			}}>
			<ImageContainer>
				<TouchableOpacity onPress={handleImagePickerLaunch}>
					{image && <ImageElement source={{uri: image}} />}
					<ImageBottom>
						<SVGCamera color='white' />
					</ImageBottom>
				</TouchableOpacity>
			</ImageContainer>
			<InputProfileContainer>
				<PretendardSemiBoldText size={14} lineHeight={21} color={colors.Gray4}>
					닉네임
				</PretendardSemiBoldText>
				<CustomTextInput
					text={nickname}
					placeholderTextColor={colors.Gray2}
					placeholder='ex)홍길동 최대 8자이내 '
					value={nickname}
					onChangeText={(value: string) => changeNickname(value)}
					maxLength={8}
				/>
			</InputProfileContainer>
			<ButtonContainer>
				<CustomButton
					label={'변경'}
					isDisabled={nickname == '' || nickname.startsWith(' ')}
					onPress={goChangeProfile}
				/>
			</ButtonContainer>
		</ProfileContainer>
	);
}

const ImageContainer = styled.View`
	width: ${widthPercentage(327)}px;
	height: ${heightPercentage(125)}px;
	align-items: center;
	margin-top: ${widthPercentage(4)}px;
`;
const InputProfileContainer = styled.View`
	gap: ${heightPercentage(10)}px;
`;
const ProfileContainer = styled(BackgroundGray).attrs({as: Pressable})`
	flex: 1;
	padding-top: ${heightPercentage(10)}px;
	gap: ${heightPercentage(40)}px;
`;

const CustomTextInput = styled.TextInput<{text: string}>`
	width: ${widthPercentage(327)}px;
	height: ${heightPercentage(52)}px;
	align-items: center;
	font-size: ${fontPercentage(14)}px;
	font-weight: 400;
	background-color: ${colors.backgroundWhite};
	border-radius: 12px;
	color: ${colors.Black};
	padding: 0px ${widthPercentage(10)}px;
`;
const ImageElement = styled.Image`
	width: ${widthPercentage(90)}px;
	height: ${widthPercentage(90)}px;
	border-radius: 12px;
	overflow: hidden;
`;
const ImageBottom = styled.View`
	position: absolute;
	bottom: -${widthPercentage(12)}px;
	right: -${widthPercentage(12)}px;
	width: ${widthPercentage(24)}px;
	height: ${widthPercentage(24)}px;
	align-items: center;
	justify-content: center;
	border-radius: 6px;
	background-color: ${colors.Black};
`;
