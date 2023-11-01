import styled from 'styled-components/native';
import {ClearTouchableOpacity, InputWrap, MainContainer} from '../../utill/layout/layout';
import {useState} from 'react';
import {SvgCancel} from '../../utill/svg/svg';
import SelectButton from '../../utill/component/select-button';
import {Keyboard, Pressable} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {couponCheck} from '../../redux/user/user.slice';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';

export default function Coupon({navigation}: any) {
	const [text, setText] = useState('');
	const changeText = (e: string) => {
		setText(e);
	};
	const {functionToken} = useAppSelector(state => state.userSlice);
	const dispatch = useAppDispatch();
	const goBack = () => {
		navigation.goBack();
	};
	const checkCoupon = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			const a = await dispatch(couponCheck({couponCode: text, functionToken: functionToken})).unwrap();
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '등록완료',
					modalSubTitle: '쿠폰 등록이 완료되었습니다.',
					modalFunction: goBack,
				}),
			);
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: err.message,
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
			<InputWrap>
				<CouponInput
					value={text}
					placeholder='ex) DANIM'
					placeholderTextColor={'grey'}
					onChangeText={(value: string) => changeText(value)}></CouponInput>
				{text && (
					<ClearTouchableOpacity
						onPress={() => {
							changeText('');
						}}>
						<SvgCancel width='20' height='20' color='black' />
					</ClearTouchableOpacity>
				)}
			</InputWrap>
			<InfoText>{`⦁ 유효 기간이 지난 쿠폰은 등록이 불가합니다.\n\n⦁ 쿠폰으로 지급받은 아이템은 환불 및 교환이 불가능합니다.`}</InfoText>
			<SelectButton label={'쿠폰 등록'} onPress={checkCoupon}></SelectButton>
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
`;
const InfoText = styled.Text`
	font-size: 15px;
	font-weight: 500;
	color: grey;
	margin: 20px 0px;
`;
