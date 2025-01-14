import styled from 'styled-components/native';
import {BackgroundGray, PretendardSemiBoldText} from '../../utill/layout/layout';
import {useState} from 'react';
import {Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {userSliceActions, userWithdraw} from '../../redux/user/user.slice';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {colors} from '../../utill/colors';
import {fontPercentage, heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import StepText from '../../utill/component/enroll-info/step-text';
import {SelectButtonsContainer} from '../enroll-info/region-recommend/select-who';
import TendencyButton from '../../utill/component/tendency-button';
import CustomButton from '../../utill/component/custom-button';
import useFirebaseStorage from '../../utill/hooks/useFirebaseStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Withdraw({navigation}: any) {
	const {socialloginProvider, userId} = useAppSelector(state => state.userSlice);
	const [text, setText] = useState('');
	const changeText = (e: string) => {
		setText(e);
	};
	const dispatch = useAppDispatch();
	const checkHandle = () => {
		Keyboard.dismiss();
		dispatch(
			modalSliceActions.setOpenModal({
				modalTitle: '계정 삭제 하시겠습니까?',
				modalSubTitle: `탈퇴하면 더 이상 다님의 여행 추천 서비스를\n 받을 수 없고 여행기록도 사라지게 되어요.`,
				modalTopText: '다님과 계속 여행하기',
				modalBottomText: '아쉽지만 계정 삭제',
				modalBottomFunction: goWithdraw,
				modalBottomFunctionUse: true,
				modalLeft: true,
			}),
		);
	};
	const [select, setSelect] = useState([
		{selected: false, title: 'AI의 결과가 만족스럽지 못해서'},
		{selected: false, title: '이용이 불편하고 장애가 많아서'},
		{selected: false, title: '다른 사이트가 더 좋아서'},
		{selected: false, title: '사용 빈도가 낮아서'},
		{selected: false, title: '개인 정보를 삭제하고 싶어서'},
		{selected: false, title: '기타'},
	]);
	const {firebaseImageRemove} = useFirebaseStorage();
	const exceptionKeys = ['isFirstLaunch', 'noPermission'];
	const goWithdraw = async () => {
		try {
			await firebaseImageRemove({pictureList: ['profile'], id: userId, category: 'profile'});
		} catch (err) {
			console.log('이유', err);
		}
		try {
			const reason = select.filter((item, idx) => item.selected).map((value, index) => value.title);
			reason.push(text);
			let signUpFirebase = false;
			const data = {userId: userId, signUpFirebase: !signUpFirebase, withdrawReasonList: reason};
			await dispatch(userWithdraw(data));
			await AsyncStorage.getAllKeys().then(allKeys => {
				const removeList = allKeys.filter(k => !exceptionKeys.some(ek => ek === k));
				AsyncStorage.multiRemove(removeList);
			});
			dispatch(userSliceActions.reset());
			navigation.reset({index: 0, routes: [{name: 'LoginScreen'}]});
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '회원탈퇴가 완료됐습니다.',
				}),
			);
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '회원 탈퇴가 실패했습니다',
					modalSubTitle: '잠시후 다시 시도해주세요',
				}),
			);
		}
	};
	return (
		<ScrollView>
			<CouponContainer
				onPress={() => {
					Keyboard.dismiss();
				}}>
				<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
					<ScrollView showsVerticalScrollIndicator={false}>
						<StepText
							marginTop={heightPercentage(10)}
							styleText='계정 삭제 사유가 궁금해요'
							mainText='무엇이 불편하셨나요?'></StepText>
						<SelectButtonsContainer>
							{select.map((item, idx) => (
								<TendencyButton
									bgColor={item.selected}
									label={item.title}
									key={idx}
									divide={true}
									onPress={() => {
										let copy = [...select];
										copy[idx].selected = !copy[idx].selected;
										setSelect(copy);
									}}></TendencyButton>
							))}
						</SelectButtonsContainer>
						<PretendardSemiBoldText
							size={12}
							lineHeight={21}
							color={colors.Gray3}
							marginTop={heightPercentage(20)}
							marginBottom={heightPercentage(10)}>
							탈퇴 사유를 적어주시면, 다님에게 큰 도움이 될 거에요!
						</PretendardSemiBoldText>
						<CouponInput
							multiline={true}
							value={text}
							placeholder='문의 사항을 적어주세요.'
							placeholderTextColor={colors.Gray2}
							blurOnSubmit={true}
							onChangeText={(value: string) => changeText(value)}></CouponInput>

						<CustomButton
							label={'계정 삭제하기'}
							onPress={checkHandle}
							width={widthPercentage(327)}
							marginTop={20}
							marginBottom={10}></CustomButton>
					</ScrollView>
				</KeyboardAvoidingView>
			</CouponContainer>
		</ScrollView>
	);
}
const CouponContainer = styled(BackgroundGray).attrs({as: Pressable})`
	gap: ${heightPercentage(15)}px;
	padding-top: ${heightPercentage(10)}px;
`;
const CouponInput = styled.TextInput`
	width: ${widthPercentage(326)}px;
	height: ${heightPercentage(125)}px;
	background-color: ${colors.Gray1};
	border-radius: 8px;
	padding: ${heightPercentage(14)}px ${widthPercentage(20)}px;
	font-size: ${fontPercentage(14)}px;
	font-weight: 500;
	color: ${colors.Black};
	text-align-vertical: top;
`;
