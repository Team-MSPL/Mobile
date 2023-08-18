import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import styled from 'styled-components/native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Touchable, TouchableOpacity, Linking, Alert} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {logout, updateFunctionToken, updateProfile, userSliceActions, userWithdraw} from '../../redux/user/user.slice';
import {colors} from '../../utill/colors';
import CustomButton from '../../utill/component/custom-button';
export default function ChangeProfile({navigation}: any) {
	const {isLogin, userName, socialloginProvider, functionToken, userId, userProfileImage} = useAppSelector(
		state => state.userSlice,
	);

	const dispatch = useAppDispatch();

	const goChangeProfile = () => {
		try {
			dispatch(
				updateProfile({
					userName: nickname,
					userProfileImage:
						'https://naverpa-phinf.pstatic.net/MjAyMzA1MjZfMjI2/MDAxNjg1MDMwMTg5MDU2.zej54mE4TStb2IrcE-vLsXWayvuo8nTvAGhOVWiDUAsg.qzYeQ7uNjoGe5k9xNtA6tbdop3jPIX9VOMu0t6wdUp4g.JPEG/%EB%B0%95%EC%A7%84%ED%9D%AC-%EC%9F%81%EC%97%AC%EB%91%90%EB%8A%94-342x228_16850301890417666851636843119293.jpg',
				}),
			);
			dispatch(
				userSliceActions.setNicknameAndImage({
					userName: nickname,
					userProfileImage:
						'https://naverpa-phinf.pstatic.net/MjAyMzA1MjZfMjI2/MDAxNjg1MDMwMTg5MDU2.zej54mE4TStb2IrcE-vLsXWayvuo8nTvAGhOVWiDUAsg.qzYeQ7uNjoGe5k9xNtA6tbdop3jPIX9VOMu0t6wdUp4g.JPEG/%EB%B0%95%EC%A7%84%ED%9D%AC-%EC%9F%81%EC%97%AC%EB%91%90%EB%8A%94-342x228_16850301890417666851636843119293.jpg',
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
