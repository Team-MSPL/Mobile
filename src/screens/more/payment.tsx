import {Platform, TouchableOpacity} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {updateFunctionToken} from '../../redux/user/user.slice';
import {HStack, MainContainer, MainText, VStack} from '../../utill/layout/layout';
import {RewardedAd, RewardedAdEventType, TestIds} from 'react-native-google-mobile-ads';
import {useEffect, useRef} from 'react';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import styled from 'styled-components/native';
import {Google_Ads_Key} from '@env';
import {DayViewContainer} from '../enroll-info/select-multi';
import {useShopping} from '../../utill/hooks/useShopping';
import {colors} from '../../utill/colors';
import {SvgRight, SvgRightAdd} from '../../utill/svg/svg';
export default function Payment({navigation}: any) {
	const {functionToken} = useAppSelector(state => state.userSlice);
	const {purchaseItems, requestItemPurchase} = useShopping();
	useShopping();
	const dispatch = useAppDispatch();
	const adUnitId = __DEV__ ? TestIds.REWARDED : Google_Ads_Key;
	const rewardedRef = useRef<RewardedAd | null>(null);
	const viewList = [
		{title: '5', before: 5000, after: 1000},
		{title: '10', before: 10000, after: 2000},
		{title: '20', before: 20000, after: 3000},
	];
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
			navigation.goBack();
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
				: dispatch(
						modalSliceActions.setOpenModal({
							modalTitle: '광고가 없습니다.',
							modalSubTitle: '잠시 후 다시 시도해주세요',
						}),
				  );
		}
	};
	return (
		<MainContainer>
			<TitleText>
				코인을 구매하고, 다님의 다양한 기능을 즐겨보세요!{'\n'}여행 지역 추천 또는 여행 코스 추천 AI를 사용하실
				수 있습니다.
			</TitleText>
			<DayViewContainer>
				<TouchableOpacity style={{marginVertical: 2}} onPress={openAd}>
					<HStack>
						<TotalContainer>
							<TotalText>1</TotalText>
						</TotalContainer>
						<InfoContainer>
							<InfoText>1개 - 광고보상</InfoText>
							<BonusText>수령 가능</BonusText>
						</InfoContainer>
						<SvgRightAdd width={30} height={30} color={'black'} />
					</HStack>
				</TouchableOpacity>
			</DayViewContainer>
			{viewList?.map((item, idx) => (
				<DayViewContainer key={idx}>
					<TouchableOpacity
						style={{marginVertical: 2}}
						onPress={() => {
							//console.log(item);
							requestItemPurchase(purchaseItems[idx].productId);
						}}>
						<HStack>
							<TotalContainer>
								<TotalText>{item.title}</TotalText>
							</TotalContainer>
							<InfoContainer>
								<HStack>
									<MoneyText>
										{Platform.OS == 'ios' ? Math.floor(item.before * 1.1) : item.before}원
									</MoneyText>
									<SvgRight color='black' />
									<InfoText>
										{Platform.OS == 'ios' ? Math.floor(item.after * 1.1) : item.after}원
									</InfoText>
								</HStack>
								<HStack>
									<BonusText>출시 오픈 기념 세일 진행 중</BonusText>
								</HStack>
							</InfoContainer>
							<SvgRightAdd width={30} height={30} color={'black'} />
						</HStack>
					</TouchableOpacity>
				</DayViewContainer>
			))}
		</MainContainer>
	);
}
const TotalContainer = styled.View`
	width: 20%;
	border-radius: 99px;
	padding: 5px;
	background-color: ${colors.selectButton};
	align-items: center;
	justify-content: center;
	border-width: 1px;
	border-color: ${colors.regionNormal};
	margin: 0px 10px 0px 0px;
`;
const TotalText = styled.Text`
	font-size: 25px;
	font-weight: bold;
	color: white;
`;
const InfoText = styled.Text`
	font-size: 17px;
	font-weight: bold;
	color: black;
`;
const MoneyText = styled(InfoText)`
	font-size: 13px;
	color: grey;
	text-decoration: line-through;
`;
const BonusText = styled.Text`
	font-size: 13px;
	font-weight: bold;
	color: ${colors.selectButton};
`;
const InfoContainer = styled(VStack)`
	width: 60%;
`;
const TitleText = styled(InfoText)`
	font-size: 13px;
	font-weight: 900;
	line-height: 20px;
	margin: 0px 0px 30px 0px;
`;
