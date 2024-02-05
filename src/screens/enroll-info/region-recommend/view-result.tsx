import {Fragment, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {BackHandler, Image, TouchableOpacity} from 'react-native';
import {modalSliceActions} from '../../../redux/modal/modalSlice';
import {BackgroundGray, HStack, MainContainer} from '../../../utill/layout/layout';
import StepText from '../../../utill/component/enroll-info/step-text';
import styled from 'styled-components/native';
import {colors} from '../../../utill/colors';
import {SVGRegionRecommend, SvgLoginLogo, SvgRight} from '../../../utill/svg/svg';
import {ScrollView} from 'react-native';
import {fontPercentage, heightPercentage, widthPercentage} from '../../../utill/layout/responsive-size';
import {TagElement, TagShopText, TagText} from '../../home/main';
export default function ViewResult({navigation}: any) {
	const dispatch = useAppDispatch();
	const {userName} = useAppSelector(state => state.userSlice);
	const {isLoading} = useAppSelector(state => state.loadingSlice);
	const {recommendList} = useAppSelector(state => state.regionRecommendSlice);
	useEffect(() => {
		const backAction = () => {
			if (navigation.isFocused()) {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '취소시 지역 추천이 종료됩니다.',
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

		navigation.setOptions({
			headerLeft: () => (
				<TouchableOpacity
					onPress={() => {
						dispatch(
							modalSliceActions.setOpenModal({
								modalTitle: '취소시 지역 추천이 종료됩니다.',
								modalSubTitle: '그래도 나가시겠습니까?',
								modalFunction: () => {
									navigation.popToTop();
								},
								modalLeft: true,
							}),
						);
					}}
					style={{justifyContent: 'center'}}>
					<Image
						source={require('../../../../public/images/danim_logo_row.png')}
						style={{height: 30, aspectRatio: 2.054}}
					/>
				</TouchableOpacity>
			),
		});
		return () => backHandler.remove();
	}, []);
	if (isLoading) return <MainContainer></MainContainer>;
	return (
		<BackgroundGray>
			<ScrollView showsVerticalScrollIndicator={false}>
				<StepText
					mainTextSize={23}
					styleTextColor={colors.PointYellow}
					styleText='지역 추천'
					mainText={`${userName} 님, \n이런 여행지는 어떠신가요?`}
					subText='여행 성향을 기반으로 추천된 여행지에요!'
				/>
				<SvgContainer>
					<SVGRegionRecommend
						transform={true}
						width={widthPercentage(200)}
						height={heightPercentage(150)}></SVGRegionRecommend>
				</SvgContainer>
				<RecommendBorderContainer>
					{recommendList.map((item, idx) => (
						<Fragment key={idx}>
							{(item.takenDay != recommendList[idx - 1]?.takenDay ?? 0) && (
								<DayRecommendContainer>
									<HStack>
										<DayRecommendText color={colors.PointYellow}>
											{item.takenDay == 0
												? '당일치기'
												: item.takenDay + '박 ' + (item.takenDay + 1) + '일 '}
										</DayRecommendText>
										<DayRecommendText color={colors.Black}>추천</DayRecommendText>
									</HStack>
								</DayRecommendContainer>
							)}
							<RecommendContainer
								onPress={() => {
									navigation.navigate('DetailResult', {item: item});
									//goEnrollInfo(item.name);
								}}>
								<ImageContainer>
									{item.photo != '' ? (
										<RecommendImage source={{uri: item.photo}}></RecommendImage>
									) : (
										<LogoCOntainer>
											<SvgLoginLogo color={'white'} width={40} />
										</LogoCOntainer>
									)}
									<RegionText>{item.name}</RegionText>
									<TagContainer>
										{item.tendency.map((value, index) => (
											<TagElement key={index} opacityStatus={true}>
												<HStack>
													<TagShopText># </TagShopText>
													<TagText color={colors.backgroundWhite}>{value}</TagText>
												</HStack>
											</TagElement>
										))}
									</TagContainer>
								</ImageContainer>
							</RecommendContainer>
						</Fragment>
					))}
				</RecommendBorderContainer>
			</ScrollView>
		</BackgroundGray>
	);
}
const SvgContainer = styled.View`
	z-index: 0;
	position: absolute;
	width: ${widthPercentage(329.19)}px;
	height: ${heightPercentage(204.14)}px;
	align-items: center;
	justify-content: center;
	left: ${widthPercentage(182)}px;
	top: ${heightPercentage(74)}px;
`;
const RecommendBorderContainer = styled.View`
	width: 100%;
	border-radius: 30px 30px 0px 0px;
	background-color: ${colors.backgroundWhite};
	padding: 0px ${widthPercentage(24)}px 0px ${widthPercentage(24)}px;
	margin-top: ${heightPercentage(52)}px;
`;
const DayRecommendContainer = styled.View`
	width: ${widthPercentage(111)}px;
	height: ${heightPercentage(35)}px;
	align-items: center;
	justify-content: center;
	background-color: ${colors.Blue2};
	border-radius: 12px 12px 0px 0px;
	margin-bottom: ${widthPercentage(12)}px;
`;
const DayRecommendText = styled.Text<{color: string}>`
	font-size: ${fontPercentage(16)}px;
	font-weight: 600;
	color: ${props => props.color};
	line-height: ${heightPercentage(21.6)}px;
`;
const ImageContainer = styled.View`
	width: ${widthPercentage(327)}px;
	height: ${widthPercentage(200)}px;
	margin-top: ${widthPercentage(12)}px;
`;
const RegionText = styled.Text`
	position: absolute;
	font-size: ${fontPercentage(20)}px;
	font-weight: 600;
	line-height: ${heightPercentage(27)}px;
	color: ${colors.backgroundWhite};
	left: ${widthPercentage(19)}px;
	top: ${widthPercentage(159)}px;
`;
const TagContainer = styled.View`
	position: absolute;
	width: 60%;
	height: ${widthPercentage(200)}px;
	flex-direction: row;
	flex-wrap: wrap-reverse;
	right: ${widthPercentage(17.8)}px;
	bottom: ${heightPercentage(19)}px;
	justify-content: flex-end;
`;
const LogoCOntainer = styled.View`
	width: 100%;
	height: 200px;
	align-items: center;
	border-radius: 10px;
	justify-content: center;
	background-color: ${colors.regionNormal};
`;
export const RecommendContainer = styled.TouchableOpacity`
	width: ${widthPercentage(327)}px;
	border-radius: 12px;
	margin: 0px 0px ${widthPercentage(12)}px 0px;
	top: -${heightPercentage(17.5)}px;
`;
const RecommendImage = styled.Image`
	width: 100%;
	height: 100%;
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
