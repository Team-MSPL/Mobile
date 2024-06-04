import styled from 'styled-components/native';
import {HStack, PretendardSemiBoldText, PretendardVariableText} from '../../utill/layout/layout';
import {useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {couponCheck} from '../../redux/user/user.slice';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import PrimaryButton from '../../utill/component/primary-button';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {colors} from '../../utill/colors';
import {Keyboard} from 'react-native';

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
		<SettingElement bottomShow={true}>
			<HStack>
				<PretendardSemiBoldText size={14} lineHeight={21} color={colors.Black}>
					쿠폰 입력하기
				</PretendardSemiBoldText>
				<PretendardVariableText size={14} lineHeight={21} color={colors.Black}>
					{' '}
					(안드로이드 전용)
				</PretendardVariableText>
			</HStack>
			<CouponInputContainer>
				<CouponInput
					value={text}
					placeholder='ex) DANIM'
					placeholderTextColor={'grey'}
					onChangeText={(value: string) => changeText(value)}></CouponInput>

				<PrimaryButton
					label='확인'
					width={widthPercentage(45)}
					height={heightPercentage(32)}
					onPress={checkCoupon}
					backgroundColor={colors.Primary}
					textColor={colors.Black}></PrimaryButton>
			</CouponInputContainer>
		</SettingElement>
	);
}
const CouponInputContainer = styled.View`
	width: ${widthPercentage(303)}px;
	height: ${heightPercentage(52)}px;
	border-radius: 12px;
	background-color: ${colors.Gray1};
	flex-direction: row;
	align-items: center;
	padding: 0px ${widthPercentage(5)}px;
	margin-vertical: ${heightPercentage(10)}px;
`;
const CouponInput = styled.TextInput`
	flex: 1;
	padding: 8px;
	font-size: 16px;
	font-weight: 400;
	color: black;
`;
const SettingElement = styled.View<{bottomShow: boolean}>`
	width: 100%;
	min-height: ${heightPercentage(48)}px;
	justify-content: center;
	border-bottom-width: ${props => (props.bottomShow ? 1 : 0)}px;
	border-color: ${colors.Gray1};
`;
