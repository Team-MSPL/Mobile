import {Fragment, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {travelSliceActions} from '../../../redux/travel-info/travel.slice';
import {BackHandler} from 'react-native';
import {cityViewList} from '../select-city';
import {modalSliceActions} from '../../../redux/modal/modalSlice';
import {MainContainer} from '../../../utill/layout/layout';
import StepText from '../../../utill/component/enroll-info/step-text';
import styled from 'styled-components/native';
import {colors} from '../../../utill/colors';
import {SvgLoginLogo, SvgRight} from '../../../utill/svg/svg';
export default function ViewResult({navigation}: any) {
	const dispatch = useAppDispatch();
	const {selectStartDate} = useAppSelector(state => state.travelSlice);
	const {isLoading} = useAppSelector(state => state.loadingSlice);
	const {recommendList} = useAppSelector(state => state.regionRecommendSlice);
	const goEnrollInfo = (e: string) => {
		let region: string[] = [];
		if (e.includes(' ')) {
			region = e.split(' ');
		} else {
			region = [e, '전체'];
		}
		const cityIndex = cityViewList.find(city => city.title == region[0])?.id;
		const data = {cityIndex: cityIndex, region: [region[1]]};

		let season = Array(4).fill(0);
		let index = Math.floor((selectStartDate.month() + 1) / 3) - 1;
		index < 0 ? (season[3] = 1) : (season[index] = 1);
		dispatch(travelSliceActions.setTravelStart({makeMode: 'recommend', season: season}));
		dispatch(travelSliceActions.setRecommendRegion(data));
		navigation.navigate('EnrollTravelTitle');
	};
	useEffect(() => {
		const backAction = () => {
			if (navigation.isFocused()) {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '뒤로 이동시 데이터는 날라갑니다.',
						modalSubTitle: '그래도 나가시겠습니까?',
						modalLeft: true,
						modalFunction: () => {
							navigation.popToTop();
						},
					}),
				);
				return true;
			}
		};

		const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

		return () => backHandler.remove();
	}, []);
	if (isLoading) return <MainContainer></MainContainer>;
	return (
		<MainContainer>
			<StepText mainText='지역 추천' subText='당신의 성향을 기반으로, 여행 지역을 찾아왔어요' />
			<RecommendAllContainer>
				{recommendList.map((item, idx) => (
					<RecommendContainer
						key={idx}
						onPress={() => {
							navigation.navigate('DetailResult', {item: item});
							//goEnrollInfo(item.name);
						}}>
						{item.photo != '' ? (
							<RecommendImage source={{uri: item.photo}}></RecommendImage>
						) : (
							<LogoCOntainer>
								<SvgLoginLogo color={'white'} width={40} />
							</LogoCOntainer>
						)}
						<RecommendElement>
							<TitleText>{item.name}</TitleText>
							<TendencyTextContainer>
								<TendencyText>
									{item.tendency.map((value, index) => (
										<Fragment key={index}>#{value}</Fragment>
									))}
								</TendencyText>
							</TendencyTextContainer>
							<RightLogoContainer>
								<LogoCircle>
									<SvgRight color={'black'} width={15} />
								</LogoCircle>
							</RightLogoContainer>
						</RecommendElement>
						<TakenDayContainer>
							<TakenText>
								{item.takenDay == 0
									? '당일치기추천'
									: item.takenDay + '박 ' + (item.takenDay + 1) + '일 추천'}{' '}
							</TakenText>
						</TakenDayContainer>
					</RecommendContainer>
				))}
			</RecommendAllContainer>
		</MainContainer>
	);
}
const TakenText = styled.Text`
	font-size: 17px;
	font-weight: bold;
	color: white;
`;
const TakenDayContainer = styled.View`
	position: absolute;
	top: 0px;
	left: 0px;
	background-color: ${colors.selectButton};
	width: 40%;
	padding: 5px;
	border-top-left-radius: 10px;
	border-bottom-right-radius: 10px;
`;
const LogoCOntainer = styled.View`
	width: 100%;
	height: 200px;
	align-items: center;
	border-radius: 10px;
	justify-content: center;
	background-color: ${colors.regionNormal};
`;
const RecommendAllContainer = styled.View`
	width: 100%;
	border-radius: 10px;
	align-items: center;
	justify-content: center;
	margin: 0px 0px 30px 0px;
`;
export const RecommendContainer = styled.TouchableOpacity`
	width: 90%;
	border-radius: 10px;
	align-items: center;
	justify-content: center;
	margin: 10px 0px 10px 0px;
`;
const RecommendImage = styled.Image`
	width: 100%;
	height: 200px;
	border-radius: 10px;
`;
export const RecommendElement = styled.View`
	width: 100%;
	background-color: ${colors.selectButton};
	flex-direction: row;
	border-bottom-right-radius: 10px;
	border-bottom-left-radius: 10px;
	position: absolute;
	bottom: 0px;
	align-items: center;
	padding: 10px;
`;
const TendencyTextContainer = styled.View`
	width: 50%;
	flex-direction: row;
`;
const RightLogoContainer = styled.View`
	width: 20%;
	align-items: center;
	justify-content: center;
`;
const TitleText = styled.Text`
	font-size: 16px;
	font-weight: bold;
	color: white;
	width: 30%;
`;
const TendencyText = styled.Text`
	font-weight: bold;
	color: white;
	font-size: 9px;
`;
const LogoCircle = styled.View`
	border-radius: 99px;
	padding: 10px;
	align-items: center;
	justify-content: center;
	background-color: white;
`;
