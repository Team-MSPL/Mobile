import {ActivityIndicator, Platform, TouchableOpacity} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {getWatchADTime, setWatchADTime, updateFunctionToken} from '../../redux/user/user.slice';
import {
	BackgroundGray,
	HStack,
	PretendardBoldText,
	PretendardSemiBoldText,
	PretendardVariableText,
	VStack,
} from '../../utill/layout/layout';
import {RewardedAd, RewardedAdEventType, TestIds} from 'react-native-google-mobile-ads';
import {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import styled from 'styled-components/native';
import {Google_Ads_Key} from '@env';
import {useShopping} from '../../utill/hooks/useShopping';
import {colors} from '../../utill/colors';
import {SVGCoin} from '../../utill/svg/svg';
import Toast from 'react-native-toast-message';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {useFocusEffect} from '@react-navigation/native';
export default function Payment({navigation}: any) {
	const {functionToken} = useAppSelector(state => state.userSlice);
	const {purchaseItems, requestItemPurchase} = useShopping();
	const [watchAD, setWatchAD] = useState(0);
	useShopping();
	const dispatch = useAppDispatch();
	const adUnitId = __DEV__ ? TestIds.REWARDED : Google_Ads_Key;
	const rewardedRef = useRef<RewardedAd | null>(null);
	const viewList = [
		{title: '5', before: 5000, after: 1000},
		{title: '10', before: 10000, after: 2000},
		{title: '20', before: 20000, after: 3000},
	];
	const getWatchData = async () => {
		const data = await dispatch(getWatchADTime()).unwrap();
		setWatchAD(data.watchADTime);
	};

	useFocusEffect(
		useCallback(() => {
			getWatchData();
		}, []),
	);
	useEffect(() => {
		// 광고 생성
		const rewarded = RewardedAd.createForAdRequest(adUnitId, {
			requestNonPersonalizedAdsOnly: true, // 맞춤형 광고 여부
			keywords: ['fashion', 'clothing'], // 광고 카테고리 고르기
		});
		//생성된 광고는 ref 변수로 관리
		rewardedRef.current = rewarded;

		// 광고 로드 이벤트 리스너
		const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
			// setLoaded(true);
		});

		// 라워드를 받았을 때 이벤트 리스너
		const unsubscribeEarned = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, reward => {
			rewarded.removeAllListeners();
			dispatch(modalSliceActions.setOpenModal({modalTitle: '이용권 1개가 지급되었습니다.'}));
			dispatch(updateFunctionToken({functionToken: functionToken + 1}));
			console.log('dddddd', watchAD, watchAD + 1);
			dispatch(setWatchADTime({watchADTime: watchAD + 1}));
			navigation.goBack();
		});

		rewarded.load();

		return () => {
			unsubscribeLoaded();
			unsubscribeEarned();
		};
	}, [watchAD]);
	const [adload, setAdload] = useState(true);
	let adCount = useRef(0);
	const tick = () => {
		const timer = setTimeout(() => {
			if (adCount.current > 3) {
				Toast.show({
					type: 'error',
					text1: '준비된 광고가 없습니다. 잠시 후 다시 시도해주세요',
					position: 'bottom',
				});
				setAdload(true);
				adCount.current = 0;
				clearTimeout(timer);
			} else if (rewardedRef?.current?.loaded) {
				setAdload(true);
				adCount.current = 0;
				clearTimeout(timer);
				rewardedRef.current.show();
			} else {
				adCount.current += 1;
				clearTimeout(timer);
				tick();
			}
		}, 2000);
	};

	const openAd = () => {
		if (rewardedRef.current !== null) {
			rewardedRef?.current?.loaded ? rewardedRef.current.show() : (setAdload(false), tick());
			//Toast.show({type: 'error', text1: '광고 준비중이니 잠시만 기다려 주세요', position: 'bottom'});
		}
	};
	const itemSkus: any = Platform.select({
		android: ['danim_function_token_05', 'danim_function_token_10', 'danim_function_token_20'],
		ios: ['danim_function_token_05', 'danim_function_token_10', 'danim_function_token_20'],
	});
	return (
		<BackgroundGray>
			<PretendardVariableText size={20} lineHeight={27} color={colors.Black}>
				다님 이용권 구매
			</PretendardVariableText>
			<PretendardVariableText size={14} lineHeight={21} color={colors.Black}>
				이용권을 구매하거나 광고를 시청하여 다님의 다양한 기능을 즐겨보세요.{`\n`}여행 지역 추천 AI 또는 여행
				코스 추천 AI를 사용하실 수 있어요!
			</PretendardVariableText>
			<PaymentContainer>
				<HStack justifyContent='space-between'>
					<VStack>
						<HStack>
							<SVGCoin width={widthPercentage(22)} height={widthPercentage(22)} />
							<PretendardSemiBoldText size={16} lineHeight={19} color={colors.backgroundWhite}>
								이용권 1개 - 광고 보상
							</PretendardSemiBoldText>
						</HStack>
						<PretendardVariableText size={12} lineHeight={18} color={colors.backgroundWhite}>
							1일 최대 2회 수령 가능{`\n`}오늘 남은 횟수 {2 - watchAD}회
						</PretendardVariableText>
					</VStack>
					<TouchContainer onPress={openAd} disabled={watchAD > 1 || !adload} opacity={adload ? 1 : 0.7}>
						<PretendardSemiBoldText size={14} lineHeight={21} color={colors.Black}>
							광고시청
						</PretendardSemiBoldText>
						{!adload && (
							<ActivityIndicatorContainer>
								<ActivityIndicator color={colors.PointYellow} size={'large'} />
							</ActivityIndicatorContainer>
						)}
					</TouchContainer>
				</HStack>
			</PaymentContainer>
			{viewList?.map((item, idx) => (
				<PaymentContainer key={idx}>
					<HStack justifyContent='space-between'>
						<VStack>
							<HStack>
								<SVGCoin width={widthPercentage(22)} height={widthPercentage(22)} />
								<PretendardSemiBoldText size={16} lineHeight={19} color={colors.backgroundWhite}>
									이용권 {item.title}개
								</PretendardSemiBoldText>
							</HStack>
							<PretendardBoldText size={12} lineHeight={18} color={colors.Primary}>
								{`\n`}출시 기념 {((item.before - item.after) / item.before) * 100}% 할인 진행 중
							</PretendardBoldText>
						</VStack>
						<TouchContainer onPress={() => requestItemPurchase(itemSkus[idx])}>
							<PretendardSemiBoldText
								size={14}
								lineHeight={21}
								color={colors.Gray4}
								textDecoration='line-through'>
								{Platform.OS == 'ios' ? Math.floor(item.before * 1.1) : item.before}원
							</PretendardSemiBoldText>
							<PretendardSemiBoldText size={14} lineHeight={21} color={colors.Black}>
								{Platform.OS == 'ios' ? Math.floor(item.after * 1.1) : item.after}원
							</PretendardSemiBoldText>
						</TouchContainer>
					</HStack>
				</PaymentContainer>
			))}
		</BackgroundGray>
	);
}

const PaymentContainer = styled.View`
	width: ${widthPercentage(327)}px;
	height: ${heightPercentage(92)}px;
	background-color: ${colors.Gray5};
	border-radius: 12px;
	padding-left: ${widthPercentage(10)}px;
	margin-top: ${heightPercentage(24)}px;
`;
const TouchContainer = styled.TouchableOpacity<{opacity?: number}>`
	width: ${widthPercentage(80)}px;
	height: ${heightPercentage(92)}px;
	background-color: ${colors.Primary};
	align-items: center;
	justify-content: center;
	border-top-right-radius: 8px;
	border-bottom-right-radius: 8px;
	opacity: ${props => props.opacity ?? 1};
`;
const ActivityIndicatorContainer = styled.View`
	position: absolute;
`;
