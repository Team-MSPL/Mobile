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
import {ClearTouchableOpacity, MainContainer, PretendardVariable} from '../../utill/layout/layout';

import Icon from 'react-native-vector-icons/AntDesign';
import {SvgCancel, SvgCheck} from '../../utill/svg/svg';
import {fontPercentage, heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
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
							style={{position: 'absolute', right: 0, height: heightPercentage(52)}}
							onPress={() => {
								setNickname('');
							}}>
							<SvgCancel width={heightPercentage(20)} height={heightPercentage(20)} color='black' />
						</ClearTouchableOpacity>
					)}
				</InputWrap>
				<TermsContainer>
					{checkList.map((item, idx) => (
						<CheckContainer key={idx}>
							<CheckTouchableOpacity onPress={item.checkFunction}>
								<SvgCheck
									width={widthPercentage(18)}
									height={widthPercentage(14)}
									color={check[idx - 1] || allCheck ? colors.Primary : 'grey'}></SvgCheck>
								<CheckBoxText>{item.title}</CheckBoxText>
							</CheckTouchableOpacity>
							{idx != 0 && (
								<PlusTouchableOpacity onPress={item.detaileFunction}>
									<CheckBoxText>(약관보기)</CheckBoxText>
								</PlusTouchableOpacity>
							)}
						</CheckContainer>
					))}
				</TermsContainer>
			</InputProfileContainer>
			<ButtonContainer>
				<CustomButton label={'회원가입'} onPress={goSignUp} isDisabled={!(allCheck && nickname.length != 0)} />
			</ButtonContainer>
		</JoinContainer>
	);
}
const ButtonContainer = styled.View`
	width: ${widthPercentage(375)}px;
	position: absolute;
	bottom: ${heightPercentage(20)}px;
	align-items: center;
`;
const PlusTouchableOpacity = styled.TouchableOpacity`
	padding: 5px;
`;
const JoinContainer = styled(MainContainer).attrs({as: Pressable})`
	flex: 1;
	padding: 0px ${widthPercentage(25)}px;
`;
const CheckBoxText = styled.Text`
	margin-left: ${widthPercentage(5)}px;
	font-size: ${fontPercentage(14)}px;
	color: ${colors.Gray4};
	font-weight: 500;
	line-weight: ${fontPercentage(17.47)}px;
`;

const CheckTouchableOpacity = styled.TouchableOpacity`
	width: 80%;
	flex-direction: row;
	margin: 0px 0px 0px 5px;
	align-items: center;
`;
const InputProfileContainer = styled.View`
	display: flex;
	background-color: ${colors.main};
	margin-top: ${heightPercentage(20)}px;
	margin-bottom: ${heightPercentage(40)}px;
`;

const InputWrap = styled.View`
	flex-direction: row;
	display: flex;
	width: ${widthPercentage(326)}px;
	background-color: ${colors.backgroundWhite};
	border-radius: 8px;
	align-items: center;
`;
const Text = styled(PretendardVariable)`
	font-size: ${fontPercentage(16)}px;
	line-height: ${heightPercentage(24)}px;
	font-weight: 500;
	color: ${colors.Black};
`;

const CustomTextInput = styled.TextInput<{text: string}>`
	width: 80%;
	height: ${heightPercentage(52)}px;
	padding: ${heightPercentage(15)}px ${widthPercentage(20)}px ${heightPercentage(15)}px ${widthPercentage(20)}px;
	font-size: ${heightPercentage(16)}px;
	font-weight: 500;
	border-radius: 8px;
	border-color: ${({text}: {text: string}) => (text == '' ? colors.Gray3 : 'black')};
	background-color: ${colors.backgroundWhite};
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
