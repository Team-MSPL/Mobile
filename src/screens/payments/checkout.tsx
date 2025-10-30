import React, {useEffect, useState} from 'react';
import {Button, Alert} from 'react-native';
import {
	PaymentWidgetProvider,
	usePaymentWidget,
	AgreementWidget,
	PaymentMethodWidget,
} from '@tosspayments/widget-sdk-react-native';
import type {
	AgreementWidgetControl,
	PaymentMethodWidgetControl,
	AgreementStatus,
} from '@tosspayments/widget-sdk-react-native';
import {styled} from 'styled-components/native';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {useAppDispatch} from '../../redux';
import {handleBooking, handleBookingSave, handleTossConfirm, tossCancel} from '../../redux/travel-info/travel.slice';
import shortid from 'shortid';
// ...

export default function CheckoutPage({navigation, route}: any) {
	const paymentWidgetControl = usePaymentWidget();
	const [paymentMethodWidgetControl, setPaymentMethodWidgetControl] = useState<PaymentMethodWidgetControl | null>(
		null,
	);
	const [agreementWidgetControl, setAgreementWidgetControl] = useState<AgreementWidgetControl | null>(null);
	const handleCheck = () => {
		if (route.params?.info == undefined) {
			navigation.goBack();
		}
	};
	useEffect(() => {
		handleCheck();
	}, []);
	const dispatch = useAppDispatch();
	const handleBookingFnt = async (e: any) => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			let bookingData = {
				...route?.params?.info?.productinfo,
				booking_key: e?.paymentKey,
			};
			console.log(e, {
				paymentKey: e?.paymentKey,
				orderId: e?.orderId,
				amount: e?.amount,
			});
			const a = await dispatch(
				handleTossConfirm({
					paymentKey: e?.paymentKey,
					orderId: e?.orderId,
					amount: e?.amount,
				}),
			).unwrap();
			console.log('자네', a);
			const q = await dispatch(
				handleBooking({...route?.params?.info?.productinfo, booking_key: e?.paymentKey}),
			).unwrap();
			console.log('안녕', q);
			if (!!q?.error) {
				console.log('에러21', q?.error);
				await dispatch(
					tossCancel({
						paymentKey: e?.paymentKey,
						cancelAmount: route.params?.info?.value,
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
		} catch (error) {
			console.log('에러', error);
			await dispatch(
				tossCancel({
					paymentKey: e?.paymentKey,
					cancelAmount: route.params?.info?.value,
				}),
			);
			navigation.replace('Fail');
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	return (
		<BackgroundScrollView>
			<PaymentMethodWidget
				selector='payment-methods'
				onLoadEnd={() => {
					paymentWidgetControl
						.renderPaymentMethods(
							'payment-methods',
							{value: route.params?.info?.value},
							{
								variantKey: 'DEFAULT',
							},
						)
						.then(control => {
							setPaymentMethodWidgetControl(control);
						});
				}}
			/>
			<AgreementWidget
				selector='agreement'
				onLoadEnd={() => {
					paymentWidgetControl
						.renderAgreement('agreement', {
							variantKey: 'DEFAULT',
						})
						.then(control => {
							setAgreementWidgetControl(control);
						});
				}}
			/>
			<Button
				title={`${route.params?.info?.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원 결제요청`}
				onPress={async () => {
					if (paymentWidgetControl == null || agreementWidgetControl == null) {
						Alert.alert('주문 정보가 초기화되지 않았습니다.');
						return;
					}
					const agreeement = await agreementWidgetControl.getAgreementStatus();
					if (agreeement.agreedRequiredTerms !== true) {
						Alert.alert('약관에 동의하지 않았습니다.');
						return;
					}
					paymentWidgetControl
						.requestPayment?.({
							orderId: shortid.generate(),
							orderName: route.params?.info?.name,
						})
						.then(result => {
							if (result?.success) {
								handleBookingFnt(result?.success);

								// 결제 성공 비즈니스 로직을 구현하세요.
								// result.success에 있는 값을 서버로 전달해서 결제 승인을 호출하세요.
							} else if (result?.fail) {
								navigation.replace('Fail');
								// 결제 실패 비즈니스 로직을 구현하세요.
							}
						});
				}}
			/>
			{/* <Button
				title='선택된 결제수단'
				onPress={async () => {
					if (paymentMethodWidgetControl == null) {
						Alert.alert('주문 정보가 초기화되지 않았습니다.');
						return;
					}
					Alert.alert(
						`선택된 결제수단: ${JSON.stringify(
							await paymentMethodWidgetControl.getSelectedPaymentMethod(),
						)}`,
					);
				}}
			/>
			<Button
				title='결제 금액 변경'
				onPress={() => {
					if (paymentMethodWidgetControl == null) {
						Alert.alert('주문 정보가 초기화되지 않았습니다.');
						return;
					}
					paymentMethodWidgetControl.updateAmount(100_000).then(() => {
						Alert.alert('결제 금액이 100000원으로 변경되었습니다.');
					});
				}}
			/> */}
		</BackgroundScrollView>
	);
}
const BackgroundScrollView = styled.ScrollView`
	flex: 1;
`;
