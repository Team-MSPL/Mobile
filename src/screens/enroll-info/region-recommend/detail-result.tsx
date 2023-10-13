import {useAppDispatch, useAppSelector} from '../../../redux';
import {travelSliceActions} from '../../../redux/travel-info/travel.slice';
import {View} from 'react-native';
import {cityViewList} from '../select-city';
import {MainContainer, HStack, VStack} from '../../../utill/layout/layout';
import StepText from '../../../utill/component/enroll-info/step-text';
import styled from 'styled-components/native';
import {colors} from '../../../utill/colors';
import {SvgLoginLogo, SvgRight} from '../../../utill/svg/svg';
import {RecommendContainer, RecommendElement} from './view-result';
import {
	SelectListContainer,
	SelectListText,
	SelectTendencyListContainer,
	SelectTendencyContainer,
	SelectTendencyText,
} from '../final-check';
export default function DetailResult({navigation, route}: any) {
	const dispatch = useAppDispatch();
	const {selectStartDate} = useAppSelector(state => state.travelSlice);
	const goEnrollInfo = () => {
		let region: string[] = [];
		if (route.params.item.name.includes(' ')) {
			region = route.params.item.name.split(' ');
		} else {
			region = [route.params.item.name, '전체'];
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
	return (
		<>
			<MainContainer>
				<RecommendMainContainer>
					{route.params.item.photo != '' ? (
						<TitleImage source={{uri: route.params.item.photo}}></TitleImage>
					) : (
						<LogoCOntainer>
							<SvgLoginLogo color={'white'} width={40} />
						</LogoCOntainer>
					)}

					<TitleTextContainer>
						<TitleText>{route.params.item.name}</TitleText>
					</TitleTextContainer>
				</RecommendMainContainer>
				<ListContainer>
					<SelectListText>여행 성향</SelectListText>
					<SelectTendencyListContainer>
						{route.params.item.tendency.map((tendency, index) => (
							<SelectTendencyContainer key={index}>
								<TendencyText># {tendency}</TendencyText>
							</SelectTendencyContainer>
						))}
					</SelectTendencyListContainer>
				</ListContainer>
				<StepText mainText='인기 관광지 Top 5' subText='해당 지역의 인기 관광지를 확인하세요' />
				<RecommendAllContainer>
					{route.params.item.topPopularPlaceList.map((item, idx) => (
						<PopularityContainer key={idx}>
							<IndexText>{idx + 1}</IndexText>
							{item.photo != '' ? (
								<RecommendImage source={{uri: item.photo}}></RecommendImage>
							) : (
								<LogoCOntainer>
									<SvgLoginLogo color={'white'} width={20} />
								</LogoCOntainer>
							)}
							<PopularityInfoTitleText>{item.name}</PopularityInfoTitleText>
						</PopularityContainer>
					))}
				</RecommendAllContainer>
			</MainContainer>
			<GoRecommendButton onPress={goEnrollInfo}>
				<ButtonHStack>
					<ButtonText>이 지역의 여행 코스 추천 받기</ButtonText>
					<SvgRight color={colors.selectButton} />
				</ButtonHStack>
			</GoRecommendButton>
		</>
	);
}

const RecommendMainContainer = styled(RecommendContainer).attrs({as: View})`
	width: 100%;
	margin: 0px 0px 20px 0px;
`;
const RecommendAllContainer = styled.View`
	width: 100%;
	margin: 0px 0px 90px 0px;
`;
const TitleImage = styled.Image`
	width: 100%;
	height: 200px;
	border-radius: 10px;
`;
const RecommendImage = styled.Image`
	width: 50px;
	height: 50px;
	margin: 0px 10px 0px 0px;
	border-radius: 10px;
`;
const LogoCOntainer = styled.View`
	width: 50px;
	height: 50px;
	align-items: center;
	border-radius: 10px;
	justify-content: center;
	background-color: ${colors.regionNormal};
	margin: 0px 10px 0px 0px;
`;
const TitleTextContainer = styled(RecommendElement)`
	justify-content: center;
`;
const TitleText = styled.Text`
	font-size: 16px;
	font-weight: bold;
	color: white;
`;
const IndexText = styled(TitleText)`
	font-size: 22px;
	font-weight: bold;
	color: black;
	width: 15%;
	text-align: center;
`;
const PopularityContainer = styled(HStack)`
	margin: 0px 0px 10px 0px;
`;
const PopularityInfoTitleText = styled(TitleText)`
	color: black;
`;
const TendencyText = styled(SelectTendencyText)`
	font-size: 14px;
`;
const ListContainer = styled(SelectListContainer)`
	margin: 0px 0px 40px 0px;
`;
const GoRecommendButton = styled.TouchableOpacity`
	width: 85%;
	align-self: center;
	border-radius: 20px;
	border-width: 1px;
	border-color: ${colors.selectButton};
	padding: 15px;
	position: absolute;
	bottom: 20px;
	background-color: white;
`;
const ButtonText = styled(TitleText)`
	color: ${colors.selectButton};
`;
const ButtonHStack = styled(HStack)`
	justify-content: space-between;
`;
