import {Touchable, TouchableOpacity, Linking, Alert} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {logout, updateFunctionToken, updateProfile, userSliceActions, userWithdraw} from '../../redux/user/user.slice';
import {MainContainer, MainText} from '../../utill/layout/layout';
import {RewardedAd, RewardedAdEventType, TestIds} from 'react-native-google-mobile-ads';
import {useEffect, useRef} from 'react';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import styled from 'styled-components/native';
import {Google_Ads_Key} from '@env';
import {DayViewContainer} from '../enroll-info/select-multi';
import {useShopping} from '../../utill/hooks/useShopping';
export default function Payment({navigation}: any) {
	const {isLogin, userName, socialloginProvider, functionToken, userId, userProfileImage} = useAppSelector(
		state => state.userSlice,
	);
	useShopping();

	const {anonymous} = useAppSelector(state => state.loginSlice);
	const dispatch = useAppDispatch();

	const changeInfo = () => {
		navigation.navigate('ChangeProfile');
	};
	const handlePayment = (e: number) => {
		Alert.alert(`국민 950002-00-251241 ${e}원 보내세요.`);
	};
	const adUnitId = __DEV__ ? TestIds.REWARDED : Google_Ads_Key;
	const rewardedRef = useRef<RewardedAd | null>(null);

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
			dispatch(updateFunctionToken({functionToken: functionToken + 1}));
		});

		rewarded.load();

		return () => {
			unsubscribeLoaded();
			unsubscribeEarned();
		};
	}, []);
	const openAd = () => {
		if (rewardedRef.current !== null) {
			rewardedRef?.current?.loaded
				? rewardedRef.current.show()
				: dispatch(modalSliceActions.setOpenModal({modalTitle: '광고가 없습니다.'}));
		}
	};
	return (
		<MainContainer>
			<SettingElement onPress={openAd}>
				<MainText>광고보고 토큰 받기</MainText>
			</SettingElement>
			<DayViewContainer>
				<TouchableOpacity style={{marginVertical: 10}} onPress={openAd}>
					<MainText>광고보기</MainText>
					<MainText>1개 </MainText>
				</TouchableOpacity>
			</DayViewContainer>
			<MainText>출석시 하루마다 무료로 1개씩 추가됩니다! 결제는 빠른시일내에 적용할 예정입니다.</MainText>
			{paymentViewList.map((item, idx) => (
				<DayViewContainer>
					<TouchableOpacity
						key={idx}
						style={{marginVertical: 10}}
						onPress={() => {
							handlePayment(item.pay);
						}}>
						<MainText>{item.title}</MainText>
						<MainText>{item.pay}원 입니다</MainText>
					</TouchableOpacity>
				</DayViewContainer>
			))}
		</MainContainer>
	);
}
const paymentViewList = [
	{title: 5, pay: 1000},
	{title: 10, pay: 2000},
	{title: 20, pay: 3000},
];
const SettingElement = styled.TouchableOpacity`
	margin: 12px 0px 12px 0px;
`;
