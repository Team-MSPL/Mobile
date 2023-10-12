import {useEffect} from 'react';
import {Platform} from 'react-native';
import * as RNIap from 'react-native-iap';
import {
	ProductPurchase,
	PurchaseError,
	finishTransaction,
	purchaseUpdatedListener,
	SubscriptionPurchase,
	purchaseErrorListener,
} from 'react-native-iap';
import {useAppDispatch} from '../../redux';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {modalSliceActions} from '../../redux/modal/modalSlice';
export const useShopping = () => {
	const dispatch = useAppDispatch();
	let purchaseUpdateSubscription: any;
	let purchaseErrorSubscription: any;
	useEffect(() => {
		const connection = async () => {
			try {
				const init = await RNIap.initConnection();
				const initCompleted = init === true;
				if (initCompleted) {
					if (Platform.OS === 'android') {
						await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
					} else {
						await RNIap.clearTransactionIOS();
					}
				}
				purchaseUpdateSubscription = purchaseUpdatedListener(
					async (purchase: ProductPurchase | SubscriptionPurchase) => {
						const receipt = purchase.transactionReceipt
							? purchase.transactionReceipt
							: purchase.purchaseToken;

						if (receipt) {
							try {
								dispatch(LoadingSliceActions.offLoading());
								const ackResult = await finishTransaction({purchase, isConsumable: true});

								// 구매이력 저장 및 상태 갱신
								if (purchase) {
								}
							} catch (error) {
								console.log('ackError: ', error);
							}
						}
					},
				);
				purchaseErrorSubscription = purchaseErrorListener((error: PurchaseError) => {
					dispatch(LoadingSliceActions.offLoading());
					const USER_CANCEL = 'E_USER_CANCELLED';
					if (error && error.code == USER_CANCEL) {
						dispatch(
							modalSliceActions.setOpenModal({
								modalTitle: '구매취소',
								modalSubTitle: '구매를 취소하셨습니다.',
							}),
						);
					} else {
						dispatch(
							modalSliceActions.setOpenModal({
								modalTitle: '구매실패',
								modalSubTitle: '구매 중 오류가 발생했습니다.',
							}),
						);
					}
				});
			} catch (error) {
				console.log(error);
				dispatch(modalSliceActions.setOpenModal({modalTitle: '에러가 발생했습니다.'}));
			}
		};
		connection();
		return () => {
			if (purchaseUpdateSubscription) {
				purchaseUpdateSubscription.remove();
				purchaseUpdateSubscription = null;
			}
			if (purchaseErrorSubscription) {
				purchaseErrorSubscription.remove();
				purchaseErrorSubscription = null;
			}
			RNIap.endConnection();
		};
	}, []);
};
