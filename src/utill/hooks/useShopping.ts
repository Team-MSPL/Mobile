import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import * as RNIap from 'react-native-iap';
import {
	ProductPurchase,
	PurchaseError,
	finishTransaction,
	purchaseUpdatedListener,
	SubscriptionPurchase,
	purchaseErrorListener,
	Product,
	RequestPurchase,
	getProducts,
	flushFailedPurchasesCachedAsPendingAndroid,
} from 'react-native-iap';
import {useAppDispatch, useAppSelector} from '../../redux';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {updateFunctionToken} from '../../redux/user/user.slice';
export const useShopping = () => {
	const itemSkus: any = Platform.select({
		android: ['danim_function_token_05', 'danim_function_token_10', 'danim_function_token_20'],
		ios: ['danim_function_token_05', 'danim_function_token_10', 'danim_function_token_20'],
	});
	const {functionToken} = useAppSelector(state => state.userSlice);
	const dispatch = useAppDispatch();
	let purchaseUpdateSubscription: any;
	let purchaseErrorSubscription: any;
	const [purchaseItems, setPurchaseItems] = useState<Product[]>();
	const navigation = useNavigation();
	const goBack = () => {
		navigation.goBack();
	};
	useEffect(() => {
		const connection = async () => {
			try {
				dispatch(LoadingSliceActions.onLoading());
				const init = await RNIap.initConnection();
				const initCompleted = init === true;
				if (initCompleted) {
					if (Platform.OS === 'android') {
						try {
							await flushFailedPurchasesCachedAsPendingAndroid();
						} catch (err) {
							console.log(err, init);
						}
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
								dispatch(LoadingSliceActions.onLoading());
								const ackResult = await finishTransaction({purchase, isConsumable: true});
								// 구매이력 저장 및 상태 갱신
								if (purchase) {
									dispatch(
										updateFunctionToken({
											functionToken:
												functionToken +
												parseInt(purchase.productId.slice(21, purchase.productId.length)),
										}),
									);
									dispatch(
										modalSliceActions.setOpenModal({
											modalTitle: '구매 완료',
											modalFunction: goBack,
										}),
									);
								}
							} catch (error) {
								console.log('ackError: ', error);
							} finally {
								dispatch(LoadingSliceActions.offLoading());
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
				//getItems();
			} catch (error) {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '문제가 발생했습니다',
						modalSubTitle: '잠시 후 시도해주세요',
						modalFunction: goBack,
					}),
				);
			} finally {
				dispatch(LoadingSliceActions.offLoading());
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
	// const getItems = async () => {
	// 	try {
	// 		dispatch(LoadingSliceActions.onLoading());
	// 		const items = await getProducts({skus: itemSkus});
	// 		setPurchaseItems(items);
	// 	} catch (error) {
	// 		dispatch(
	// 			modalSliceActions.setOpenModal({
	// 				modalTitle: '문제가 발생했습니다.',
	// 				modalSubTitle: '잠시 후 시도해주세요',
	// 				modalFunction: goBack,
	// 			}),
	// 		);
	// 	} finally {
	// 		dispatch(LoadingSliceActions.offLoading());
	// 	}
	// };
	const requestItemPurchase = async (sku: string) => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			await getProducts({skus: itemSkus});
			Platform.OS == 'android' ? await RNIap.requestPurchase({skus: [sku]}) : await RNIap.requestPurchase({sku});
		} catch (error) {
			console.log('request purchase error: ', error);
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '취소',
					modalSubTitle: '구매가 취소되었습니다.',
					modalFunction: goBack,
				}),
			);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	return {purchaseItems, requestItemPurchase};
};

interface PurchaseType {
	currency: string;
	description: string;
	localizedPrice: string;
	oneTimePurchaseOfferDetails: {
		formattedPrice: string;
		priceAmountMicros: string;
		priceCurrencyCode: string;
	};
	price: string;
	productId: string;
	productType: string;
	title: string;
}
