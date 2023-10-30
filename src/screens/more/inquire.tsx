import styled from 'styled-components/native';
import {InputWrap, MainContainer} from '../../utill/layout/layout';
import {useState} from 'react';
import {Keyboard, Pressable} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {couponCheck, inquiryEnroll} from '../../redux/user/user.slice';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import CustomButton from '../../utill/component/custom-button';

export default function Inquire({navigation}: any) {
	const [text, setText] = useState('');
	const changeText = (e: string) => {
		setText(e);
	};
	const {userName} = useAppSelector(state => state.userSlice);
	const dispatch = useAppDispatch();
	const goBack = () => {
		navigation.goBack();
	};
	const checkCoupon = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			const a = await dispatch(inquiryEnroll({userName: userName, inquire: text})).unwrap();
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '문의완료',
					modalSubTitle: '빠른 시일 내에 답변드리겠습니다.',
					modalFunction: goBack,
				}),
			);
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: err,
				}),
			);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	return (
		<CouponContainer
			onPress={() => {
				Keyboard.dismiss();
			}}>
			<InputContainer>
				<CouponInput
					multiline={true}
					value={text}
					placeholder='문의 사항을 적어주세요.'
					placeholderTextColor={'grey'}
					onChangeText={(value: string) => changeText(value)}></CouponInput>
			</InputContainer>
			<CustomButton
				label={'문의 하기'}
				onPress={checkCoupon}
				width={80}
				isDisabled={text.length == 0}></CustomButton>
		</CouponContainer>
	);
}
const CouponContainer = styled(MainContainer).attrs({as: Pressable})`
	flex: 1;
`;
const CouponInput = styled.TextInput`
	flex: 1;
	padding: 8px;
	font-size: 16px;
	font-weight: 400;
	color: black;
	text-align-vertical: top;
`;
const InputContainer = styled(InputWrap)`
	height: 300px;
`;
