import {useAppDispatch, useAppSelector} from '../../../redux';
import {travelSliceActions} from '../../../redux/travel-info/travel.slice';
import {cityViewList} from '../select-city';
import {Divider, HStack, PretendardSemiBoldText, PretendardVariableText} from '../../../utill/layout/layout';
import StepText from '../../../utill/component/enroll-info/step-text';
import styled from 'styled-components/native';
import {colors} from '../../../utill/colors';
import {SvgLoginLogo} from '../../../utill/svg/svg';
import ImageView from 'react-native-image-viewing';
import {useState} from 'react';
import {ImageViewFooterComponent} from '../../timetable/course-detail';
import {TagElement, metropolitanCheckList} from '../../home/main';
import CustomButton from '../../../utill/component/custom-button';
import {fontPercentage, heightPercentage, widthPercentage} from '../../../utill/layout/responsive-size';
import {ButtonContainer} from '../select-multi';
export default function DetailResult({navigation, route}: any) {
	const dispatch = useAppDispatch();
	const {selectStartDate} = useAppSelector(state => state.travelSlice);
	const {regionTendency} = useAppSelector(state => state.regionRecommendSlice);
	const goEnrollInfo = () => {
		let copy = [...regionTendency];
		let copy0 = [...regionTendency[0]];
		copy0.push(0);
		copy[0] = copy0;
		let copy2 = [...regionTendency[2]];
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
		let copy3 = [...regionTendency[3]];
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
			shareViewWithStartFlag: true,
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
				</RecommendMainContainer>
				<RecommendBorderContainer>
					<PretendardSemiBoldText size={24} lineHeight={28} color={colors.Gray5}>
						{route.params.item.name}
					</PretendardSemiBoldText>
					<Divider color={colors.Gray2} height={0.5}></Divider>
					<TagContainer>
						{route.params.item.tendency.map((tendency, index) => (
							<TagElement
								backgroundColor={colors.Gray5}
								key={index}
								opacityStatus={false}
								height={heightPercentage(26)}>
								<HStack>
									<PretendardSemiBoldText size={16} lineHeight={18} color={colors.Primary}>
										{'# '}
									</PretendardSemiBoldText>
									<PretendardVariableText size={14} lineHeight={16} color={colors.backgroundWhite}>
										{tendency}
									</PretendardVariableText>
								</HStack>
							</TagElement>
						))}
					</TagContainer>

					<StepText
						mainText='인기 관광지 Top 5'
						subText='해당 지역의 인기 관광지를 확인하세요'
						mainTextSize={fontPercentage(18)}
						subTextSize={fontPercentage(12)}
						marginLeft={0}
						marginTop={0}
						marginBottom={heightPercentage(14)}
					/>
					<RecommendAllContainer horizontal={true} showsHorizontalScrollIndicator={false}>
						{route.params.item.topPopularPlaceList.map((item, idx) => (
							<PopularityContainer
								key={idx}
								onPress={() => {
									goDetail(item);
								}}>
								<IndexContainer>
									<PretendardSemiBoldText size={14} lineHeight={16} color={colors.Gray5}>
										{idx + 1}
									</PretendardSemiBoldText>
								</IndexContainer>
								{item.photo != '' ? (
									<RecommendImage source={{uri: item.photo}}></RecommendImage>
								) : (
									<LogoCOntainer>
										<SvgLoginLogo color={'white'} width={20} />
									</LogoCOntainer>
								)}
								<PopularityInfoTitleTextContainer>
									<PretendardSemiBoldText size={20} lineHeight={26} color={colors.backgroundWhite}>
										{item.name}
									</PretendardSemiBoldText>
								</PopularityInfoTitleTextContainer>
							</PopularityContainer>
						))}
					</RecommendAllContainer>
				</RecommendBorderContainer>
				<MarginBottom></MarginBottom>
			</MainContainer>
			<ButtonContainer>
				<CustomButton label='이 지역의 여행코스 추천받기' onPress={goEnrollInfo}></CustomButton>
			</ButtonContainer>
			<ImageView
				images={[{uri: route.params.item.photo}]}
				onImageIndexChange={item => console.log(item)}
				imageIndex={0}
				visible={visible}
				onRequestClose={() => setVisible(false)}
				FooterComponent={index => {
					return (
						<ImageViewFooterComponent>
							<PretendardSemiBoldText size={14} lineHeight={16} color={colors.backgroundWhite}>
								{index.imageIndex + 1}/{1}
							</PretendardSemiBoldText>
						</ImageViewFooterComponent>
					);
				}}
			/>
		</>
	);
}
const PopularityInfoTitleTextContainer = styled.View`
	width: 80%;
	position: absolute;
	z-index: 1;
	align-self: flex-end;
	left: ${widthPercentage(12)}px;
	bottom: ${widthPercentage(12)}px;
`;
const IndexContainer = styled.View`
	width: ${widthPercentage(24)}px;
	height: ${widthPercentage(24)}px;
	background-color: ${colors.Primary};
	align-items: center;
	justify-content: center;
	position: absolute;
	z-index: 1;
	top: ${widthPercentage(12)}px;
	left: ${widthPercentage(12)}px;
	border-radius: 6px;
`;
const TagContainer = styled.View`
	width: 100%;
	flex-direction: row;
	flex-wrap: wrap;
`;
const MainContainer = styled.ScrollView`
	width: 100%;
	background-color: ${colors.backgroundWhite};
`;
const MarginBottom = styled.View`
	height: ${heightPercentage(100)}px;
`;
export const RecommendBorderContainer = styled.View<{height?: number; top?: number; paddingBottom?: boolean}>`
	width: 100%;
	height: ${props => props.height + 'px' ?? null};
	border-radius: 30px 30px 0px 0px;
	background-color: ${colors.backgroundWhite};
	padding: ${heightPercentage(38)}px ${widthPercentage(24)}px
		${props => (props.paddingBottom ? heightPercentage(100) : 0)}px ${widthPercentage(24)}px;
	margin-top: -30px;
`;
const RecommendMainContainer = styled.TouchableOpacity`
	width: ${widthPercentage(375)}px;
	height: ${heightPercentage(266)}px;
`;
const RecommendAllContainer = styled.ScrollView``;
const TitleImage = styled.Image`
	width: ${widthPercentage(375)}px;
	height: ${heightPercentage(266)}px;
	resize-mode: cover;
`;
const RecommendImage = styled.Image`
	width: ${widthPercentage(152)}px;
	height: ${heightPercentage(196)}px;
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
const PopularityContainer = styled.TouchableOpacity`
	margin: 0px ${widthPercentage(12)}px 0px 0px;
	display: inline-block;
	flex-direction: row;
	width: ${widthPercentage(152)}px;
	height: ${heightPercentage(196)}px;
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
export const ButtonHStack = styled(HStack)`
	justify-content: space-between;
`;
