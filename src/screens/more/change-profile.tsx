import styled from 'styled-components/native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TouchableOpacity, Image, View, Pressable, Keyboard} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {updateProfile, userSliceActions} from '../../redux/user/user.slice';
import {colors} from '../../utill/colors';
import CustomButton from '../../utill/component/custom-button';
import ImageCropPicker from 'react-native-image-crop-picker';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {Center, ClearTouchableOpacity, InputWrap, MainContainer} from '../../utill/layout/layout';
import Icon from 'react-native-vector-icons/AntDesign';
import {SvgCancel} from '../../utill/svg/svg';
import {FilterList} from '../../utill/filter';
export default function ChangeProfile({navigation}: any) {
	const {userName, userProfileImage} = useAppSelector(state => state.userSlice);
	const [image, setImage] = useState(userProfileImage);
	const dispatch = useAppDispatch();
	//애뮬레이터 확인 불가
	const IconContainer = styled(Icon)`
		background-color: ${colors.regionNormal};
		margin: 0px 0px 0px 0px;
		border-radius: 10px;
		padding: 3px;
	`;
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
			setImage(`data:${response.mime};base64,${response?.data}`);
			console.log('이미지 주소', response.path);
		});
	};
	const goChangeProfile = () => {
		try {
			if (FilterList.includes(nickname)) {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '사용불가',
						modalSubTitle: '사용 불가한 닉네임입니다.',
					}),
				);
			} else {
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
			}
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '프로필 변경 중 에러가 발생했습니다.',
					modalFunction: () => {},
				}),
			);
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
			<Center>
				<TouchableOpacity onPress={handleImagePickerLaunch}>
					{image && <ImageElement source={{uri: image}} />}
					<ImageBottom>
						<IconContainer name={'camera'} size={20} color={'grey'} />
					</ImageBottom>
				</TouchableOpacity>
			</Center>
			<InputProfileContainer>
				<NicknameText>닉네임</NicknameText>
				<InputWrap>
					<CustomTextInput
						text={nickname}
						style={{color: 'black'}}
						placeholderTextColor={'grey'}
						placeholder='ex)홍길동 최대 8자이내 '
						value={nickname}
						onChangeText={(value: string) => changeNickname(value)}
						maxLength={8}
					/>
					{nickname && (
						<ClearTouchableOpacity
							onPress={() => {
								setNickname('');
							}}>
							<SvgCancel width='20' height='20' color='black' />
						</ClearTouchableOpacity>
					)}
				</InputWrap>
				<CustomButton
					label={'변경'}
					isDisabled={nickname == '' || nickname.startsWith(' ')}
					onPress={goChangeProfile}
				/>
			</InputProfileContainer>
		</ProfileContainer>
	);
}

const InputProfileContainer = styled.View`
	display: flex;
	background-color: ${colors.main};
`;
const ProfileContainer = styled(MainContainer).attrs({as: Pressable})`
	flex: 1;
	justify-content: center;
`;

const NicknameText = styled.Text`
	font-size: 15px;
	font-weight: bold;
	color: black;
	margin: 30px 0px 20px 0px;
`;
const CustomTextInput = styled.TextInput<{text: string}>`
	flex: 1;
	padding: 8px;
	font-size: 16px;
	font-weight: 400;
`;
const ImageElement = styled.Image`
	width: 100px;
	height: 100px;
	border-radius: 99px;
	overflow: hidden;
`;
const ImageBottom = styled.View`
	position: absolute;
	bottom: 0;
	right: 0;
`;
