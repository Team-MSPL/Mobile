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
import ImageView from 'react-native-image-viewing';
import {
	SelectListContainer,
	SelectListText,
	SelectTendencyListContainer,
	SelectTendencyContainer,
	SelectTendencyText,
} from '../final-check';
import {useState} from 'react';
import {ImageText, ImageViewFooterComponent} from '../../timetable/course-detail';
import {metropolitanCheckList} from '../../home/main';
export default function DetailResult({navigation, route}: any) {
	const dispatch = useAppDispatch();
	const {selectStartDate} = useAppSelector(state => state.travelSlice);
	const {tendency} = useAppSelector(state => state.regionRecommendSlice);
	const goEnrollInfo = () => {
		let copy = [...tendency];
		let copy2 = [...tendency[2]];
		if (copy2[4] == 1) {
			copy2.push(1);
			copy2.push(0);
			copy2.push(1);
			copy2.push(1);
		} else {
			copy2.push(0);
			copy2.push(0);
			copy2.push(0);
			copy2.push(0);
		}
		copy[2] = copy2;
		let copy3 = [...tendency[3]];
		if (copy3[5] == 1) {
			copy3[0] = 1;
			copy3[1] = 1;
			copy3[5] = 0;
		}
		copy[3] = copy3;
		let selectEndDate = selectStartDate.clone().add(route.params.item.takenDay, 'days');
		let region: string[] = [];
		if (route.params.item.name.includes(' ')) {
			region = route.params.item.name.split(' ');
		} else {
			region = [route.params.item.name, '전체'];
		}
		const cityIndex = cityViewList.find(city => city.title == region[0])?.id;
		let season = copy.pop();
		let cityDistance = cityViewList[cityIndex ?? 0].sub.findIndex(item => item.subTitle == region[1]);
		const data = {
			cityDistance: [cityDistance],
			cityIndex: cityIndex,
			region: [region[1]],
			tendency: copy,
			season: season,
			selectEndDate: selectEndDate,
		};
		dispatch(travelSliceActions.setRecommendRegion(data));
		navigation.navigate('EnrollTravelTitle');
	};
	const goDetail = (e: {name: string; lat: number; lng: number}) => {
		const metropolitanStatus = metropolitanCheckList.includes(route.params.item.name);
		const data = {
			name: e.name,
			lat: e.lat,
			lng: e.lng,
			region: route.params.item.name,
			metropolitan: metropolitanStatus,
		};
		navigation.navigate('CourseDetail', {value: data});
	};
	const [visible, setVisible] = useState(false);
	return (
		<>
			<MainContainer>
				<RecommendMainContainer
					onPress={() => {
						setVisible(true);
					}}>
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
						<PopularityContainer
							key={idx}
							onPress={() => {
								goDetail(item);
							}}>
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
			<GoRecommendButton onPress={goEnrollInfo} state={false}>
				<ButtonHStack>
					<ButtonText>이 지역의 여행 코스 추천 받기</ButtonText>
					<SvgRight color={colors.selectButton} />
				</ButtonHStack>
			</GoRecommendButton>
			<ImageView
				images={[{uri: route.params.item.photo}]}
				onImageIndexChange={item => console.log(item)}
				imageIndex={0}
				visible={visible}
				onRequestClose={() => setVisible(false)}
				FooterComponent={index => {
					return (
						<ImageViewFooterComponent>
							<ImageText>
								{index.imageIndex + 1}/{1}
							</ImageText>
						</ImageViewFooterComponent>
					);
				}}
			/>
		</>
	);
}

const RecommendMainContainer = styled(RecommendContainer)`
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
const PopularityContainer = styled.TouchableOpacity`
	margin: 0px 0px 10px 0px;
	display: inline-block;
	flex-direction: row;
	align-items: center;
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
export const GoRecommendButton = styled.TouchableOpacity<{state: boolean}>`
	width: ${props => (props.state ? '20%' : '85%')};
	align-self: ${props => (props.state ? 'flex-end' : 'center')};
	right: 20px;
	border-radius: 20px;
	border-width: 1px;
	border-color: ${colors.selectButton};
	padding: 15px;
	position: absolute;
	bottom: 20px;
	background-color: ${colors.main};
`;
export const ButtonText = styled(TitleText)`
	color: ${colors.selectButton};
`;
export const ButtonHStack = styled(HStack)`
	justify-content: space-between;
`;
