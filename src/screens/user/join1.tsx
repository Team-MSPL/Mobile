import {TouchableOpacity, Alert} from 'react-native';
import {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import {useAppDispatch} from '../../redux';
import {loginSliceActions, socialConnect} from '../../redux/user/login.slice';
import CustomButton from '../../utill/component/custom-button';
import {colors} from '../../utill/colors';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';

export default function Join1({navigation, route}: any) {
	const [allCheck, setAllCheck] = useState(false);
	const [check, setCheck] = useState([false, false]);
	const dispatch = useAppDispatch();
	const [nickname, setNickname] = useState('');
	const goSignUp = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			const data = {
				userName: nickname,
				userProfileImage: route.params.profileImage,
				userToken: route.params.userToken,
				loginProvider: route.params.loginProvider,
				signUpFlag: true,
			};
			const result = await dispatch(socialConnect(data));
			console.log(navigation);
			navigation.replace('Home');
		} catch (err) {
			Alert.alert('회원가입중 에러가 발생했습니다');
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
	return (
		<SafeAreaView style={{backgroundColor: colors.main}}>
			<Text>닉네임이요</Text>
			<InputProfileContainer>
				<InputWrap>
					<CustomTextInput
						text={nickname}
						placeholder='ex)홍길동 최대 6자이내 '
						value={nickname}
						onChangeText={(value: string) => chageNickname(value)}
						maxLength={6}
						clearButtonMode='while-editing'
					/>
					{nickname && (
						<TouchableOpacity
							style={{position: 'absolute', right: 8, top: 8}}
							onPress={() => {
								setNickname('');
							}}>
							<Text>claer</Text>
						</TouchableOpacity>
					)}
				</InputWrap>
				<TermsContainer>
					<CheckContainer>
						<TouchableOpacity style={{backgroundColor: allCheck ? 'red' : 'black'}} onPress={clickAllCheck}>
							<Text>dd</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => {}}>
							<Text>약관 전체동의요</Text>
						</TouchableOpacity>
					</CheckContainer>
					<CheckContainer>
						<TouchableOpacity
							style={{backgroundColor: check[0] ? 'red' : 'black'}}
							onPress={() => {
								checkClick(0);
							}}>
							<Text>ㅇㅇ</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => {}}>
							<Text>이용 약관 동의 더보기</Text>
						</TouchableOpacity>
					</CheckContainer>
					<CheckContainer>
						<TouchableOpacity
							style={{backgroundColor: check[1] ? 'red' : 'black'}}
							onPress={() => {
								checkClick(1);
							}}>
							<Text>ㅇㅇ</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => {}}>
							<Text>개인정보 더보기</Text>
						</TouchableOpacity>
					</CheckContainer>
				</TermsContainer>
				<CustomButton label={'회원가입'} onPress={goSignUp} isDisabled={!(allCheck && nickname.length != 0)} />
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

const TermsContainer = styled.View`
	width: 80%;
	padding: 10px;
	border-radius: 1px;
	border-color: black;
	border-width: 1px;
	margin: 10px;
`;
const CheckContainer = styled.View`
	flex-direction: row;
	width: 100%;
`;
