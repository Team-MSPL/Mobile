import React, {useEffect, useState} from 'react';
import {Button, Alert} from 'react-native';
import {
	PaymentWidgetProvider,
	usePaymentWidget,
	AgreementWidget,
	PaymentMethodWidget,
} from '@tosspayments/widget-sdk-react-native';
import type {AgreementWidgetControl, PaymentMethodWidgetControl} from '@tosspayments/widget-sdk-react-native';
import {styled} from 'styled-components/native';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {useAppDispatch, useAppSelector} from '../../redux';
import {handleBooking, handleBookingSave, handleTossConfirm, tossCancel} from '../../redux/travel-info/travel.slice';
import shortid from 'shortid';
import {TossPayment_Live_Key} from '@env';
import {logEvent} from '../../../firebaseAnalytice';

const BackgroundScrollView = styled.ScrollView`
	flex: 1;
`;
// ---------------------------
// ✅ 최상위 컴포넌트
// ---------------------------
export default function CheckoutPage({navigation, route}: any) {
	const {userId} = useAppSelector(state => state.userSlice);
	return (
		<BackgroundScrollView>
			<PaymentWidgetProvider clientKey={TossPayment_Live_Key} customerKey={userId}>
				<CheckoutInner navigation={navigation} route={route} />
			</PaymentWidgetProvider>
		</BackgroundScrollView>
	);
}

// ---------------------------
// ✅ 실제 결제 로직 (Provider 내부)
// ---------------------------
function CheckoutInner({navigation, route}: any) {
	const paymentWidgetControl = usePaymentWidget(); // ✅ Provider 내부에서 호출됨
	const [paymentMethodWidgetControl, setPaymentMethodWidgetControl] = useState<PaymentMethodWidgetControl | null>(
		null,
	);
	const [agreementWidgetControl, setAgreementWidgetControl] = useState<AgreementWidgetControl | null>(null);
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (!route.params?.info) {
			navigation.goBack();
		}
	}, [route.params?.info]);

	// ✅ 결제 성공 시 처리 함수
	const handleBookingFnt = async (e: any) => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			const bookingData = {
				...route?.params?.info?.productinfo,
				booking_key: e?.paymentKey,
			};
			console.log('결제 결과:', e);

			// 1️⃣ Toss 서버 결제 승인 요청
			const a = await dispatch(
				handleTossConfirm({
					paymentKey: e?.paymentKey,
					orderId: e?.orderId,
					amount: e?.amount,
					version: 'live',
				}),
			).unwrap();

			if (!!a?.code) {
				// 승인 실패 시 → 결제 취소 및 DB 저장
				await dispatch(
					tossCancel({
						paymentKey: e?.paymentKey,
						cancelAmount: route.params?.info?.value,
					}),
				);
				await dispatch(
					handleBookingSave({
						...route?.params?.info?.productinfo,
						isActive: false,
						product: {...route?.params?.info?.productinfo},
					}),
				);
				navigation.replace('Fail');
				return;
			}

			// 2️⃣ 예약 처리
			const q = await dispatch(
				handleBooking({...route?.params?.info?.productinfo, booking_key: e?.paymentKey}),
			).unwrap();

			if (!!q?.error) {
				await dispatch(
					tossCancel({
						paymentKey: e?.paymentKey,
						cancelAmount: route.params?.info?.value,
					}),
				);
				await dispatch(
					handleBookingSave({
						...route?.params?.info?.productinfo,
						isActive: false,
						product: {...route?.params?.info?.productinfo},
					}),
				);
				navigation.replace('Fail');
			} else {
				await dispatch(
					handleBookingSave({
						...route?.params?.info?.productinfo,
						product: {
							...route?.params?.info?.productinfo,
							data: q?.data,
							booking_key: e?.paymentKey,
						},
					}),
				);
				navigation.replace('Success');
			}
		} catch (error: any) {
			console.log('결제 처리 에러:', error);
			await dispatch(
				tossCancel({
					paymentKey: e?.paymentKey,
					cancelAmount: route.params?.info?.value,
				}),
			);
			await dispatch(
				handleBookingSave({
					...route?.params?.info?.productinfo,
					isActive: false,
					product: {
						...route?.params?.info?.productinfo,
						reason: error?.result_msg,
					},
				}),
			);
			navigation.replace('Fail');
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};

	// ---------------------------
	// ✅ 실제 화면 UI
	// ---------------------------
	return (
		<>
			{/* 결제수단 위젯 */}
			<PaymentMethodWidget
				selector='payment-methods'
				onLoadEnd={() => {
					paymentWidgetControl
						.renderPaymentMethods(
							'payment-methods',
							{value: route.params?.info?.value},
							{variantKey: 'DEFAULT'},
						)
						.then(control => setPaymentMethodWidgetControl(control));
				}}
			/>

			{/* 약관 위젯 */}
			<AgreementWidget
				selector='agreement'
				onLoadEnd={() => {
					paymentWidgetControl
						.renderAgreement('agreement', {variantKey: 'DEFAULT'})
						.then(control => setAgreementWidgetControl(control));
				}}
			/>

			{/* 결제 버튼 */}
			<Button
				title={`${route.params?.info?.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원 결제요청`}
				onPress={async () => {
					if (!paymentWidgetControl || !agreementWidgetControl) {
						Alert.alert('주문 정보가 초기화되지 않았습니다.');
						return;
					}
					const agreement = await agreementWidgetControl.getAgreementStatus();
					if (!agreement.agreedRequiredTerms) {
						Alert.alert('약관에 동의하지 않았습니다.');
						return;
					}

					await logEvent(`payment_handle_click`, {title: route.params?.info?.name});
					paymentWidgetControl
						.requestPayment?.({
							orderId: shortid.generate(),
							orderName: route.params?.info?.name,
						})
						.then(result => {
							if (result?.success) {
								handleBookingFnt(result.success);
							} else {
								navigation.replace('Fail');
							}
						});
				}}
			/>
		</>
	);
}
