import {useEffect, useState} from 'react';
import {Alert, Keyboard, Pressable, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {socialConnect} from '../../redux/user/login.slice';
import {userSliceActions} from '../../redux/user/user.slice';
import {colors} from '../../utill/colors';
import CustomButton from '../../utill/component/custom-button';
import {ClearTouchableOpacity, MainContainer} from '../../utill/layout/layout';

import Icon from 'react-native-vector-icons/AntDesign';
import {SvgCancel, SvgRight} from '../../utill/svg/svg';
export default function Join1({navigation, route}: any) {
	const [allCheck, setAllCheck] = useState(false);
	const [check, setCheck] = useState([false, false]);
	const dispatch = useAppDispatch();
	const [nickname, setNickname] = useState('');
	const {shareLoginFlag} = useAppSelector(state => state.travelSlice);
	const {fcmToken} = useAppSelector(state => state.userSlice);
	const CheckLogoContainer = styled(Icon)`
		border-radius: 5px;
		margin: 0px 5px 0px 0px;
	`;
	const goSignUp = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			const data = {
				userName: nickname,
				userProfileImage: route.params.profileImage,
				userToken: route.params.userToken,
				loginProvider: route.params.loginProvider,
				signUpFlag: true,
				fcmToken: fcmToken,
				version: 2,
			};
			const result = await dispatch(socialConnect(data));
			dispatch(userSliceActions.setSignUpReward(true));
			// : (navigation.goBack(), navigation.replace('Tab'));
		} catch (err) {
			console.log('왜 이래', err);
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '회원가입에 실패했습니다',
					modalSubTitle: '잠시후 다시 시도해주세요',
				}),
			);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const chageNickname = (e: string) => {
		setNickname(e);
	};
	const clickAllCheck = () => {
		let copy = [...check];
		allCheck ? copy.fill(false) : copy.fill(true);
		setCheck(copy);
		setAllCheck(!allCheck);
	};
	const checkClick = (e: number) => {
		let copy = [...check];
		copy[e] = !copy[e];
		const allEqual = copy.every(item => item === copy[0]);
		if (allEqual && copy[0]) {
			setAllCheck(true);
		} else {
			setAllCheck(false);
		}
		setCheck(copy);
	};
	const goPolicy = () => {
		navigation.navigate('PolicyMain');
	};
	const goTerms = () => {
		navigation.navigate('Terms');
	};
	useEffect(() => {
		setNickname(route.params.nickname);
	}, []);
	const checkList = [
		{title: '전체 동의', checkFunction: clickAllCheck, detaileFunction: () => null},
		{
			title: '이용 약관 동의',
			checkFunction: () => {
				checkClick(0);
			},
			detaileFunction: goPolicy,
		},
		{
			title: '개인정보처리방침',
			checkFunction: () => {
				checkClick(1);
			},
			detaileFunction: goTerms,
		},
	];
	return (
		<JoinContainer
			onPress={() => {
				Keyboard.dismiss();
			}}>
			<Text>닉네임을 입력해주세요</Text>
			<InputProfileContainer>
				<InputWrap>
					<CustomTextInput
						text={nickname}
						placeholderTextColor={'grey'}
						style={{color: 'black'}}
						placeholder='ex)홍길동 최대 8자이내 '
						value={nickname}
						onChangeText={(value: string) => chageNickname(value)}
						maxLength={8}
					/>
					{nickname && (
						<ClearTouchableOpacity
							style={{position: 'absolute', right: 8, top: 8}}
							onPress={() => {
								setNickname('');
							}}>
							<SvgCancel width='20' height='20' color='black' />
						</ClearTouchableOpacity>
					)}
				</InputWrap>
				<TermsContainer>
					{checkList.map((item, idx) => (
						<CheckContainer key={idx}>
							<CheckTouchableOpacity onPress={item.checkFunction}>
								<CheckLogoContainer
									name={'checkcircleo'}
									size={25}
									color={check[idx - 1] || allCheck ? colors.selectButton : 'grey'}
								/>
								<Text>{item.title}</Text>
							</CheckTouchableOpacity>
							{idx != 0 && (
								<PlusTouchableOpacity onPress={item.detaileFunction}>
									<SvgRight color={'grey'} />
								</PlusTouchableOpacity>
							)}
						</CheckContainer>
					))}
				</TermsContainer>
				<CustomButton label={'회원가입'} onPress={goSignUp} isDisabled={!(allCheck && nickname.length != 0)} />
			</InputProfileContainer>
		</JoinContainer>
	);
}
const PlusTouchableOpacity = styled.TouchableOpacity`
	padding: 5px;
`;
const JoinContainer = styled(MainContainer).attrs({as: Pressable})`
	flex: 1;
`;

const CheckTouchableOpacity = styled.TouchableOpacity`
	width: 80%;
	flex-direction: row;
	margin: 0px 0px 0px 5px;
	align-items: center;
`;
const InputProfileContainer = styled.View`
	display: flex;
	margin-top: 10px;
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

const TermsContainer = styled.View`
	width: 100%;
	padding: 10px;
	border-radius: 1px;
	border-color: black;
	margin: 20px 0px 20px 0px;
`;
const CheckContainer = styled.View`
	flex-direction: row;
	width: 100%;
	align-items: center;
	margin: 0px 0px 20px 0px;
	justify-content: space-between;
`;
