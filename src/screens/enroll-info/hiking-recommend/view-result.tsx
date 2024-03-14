import {Fragment, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {Image, TouchableOpacity} from 'react-native';
import {modalSliceActions} from '../../../redux/modal/modalSlice';
import {
	BackgroundGray,
	HStack,
	MainContainer,
	PretendardSemiBold,
	PretendardSemiBoldText,
	PretendardVariableText,
} from '../../../utill/layout/layout';
import StepText from '../../../utill/component/enroll-info/step-text';
import styled from 'styled-components/native';
import {colors} from '../../../utill/colors';
import {SVGRegionRecommend, SvgLoginLogo} from '../../../utill/svg/svg';
import {ScrollView} from 'react-native';
import {fontPercentage, heightPercentage, widthPercentage} from '../../../utill/layout/responsive-size';
import {TagElement} from '../../home/main';
import {useBackHandler} from '../../../utill/hooks/useBackhandler';
import {RecommendContainer} from '../region-recommend/view-result';
export default function HikingViewResult({navigation}: any) {
	const dispatch = useAppDispatch();
	const {userName} = useAppSelector(state => state.userSlice);
	const {isLoading} = useAppSelector(state => state.loadingSlice);
	const {hikingList} = useAppSelector(state => state.hikingSlice);
	const difficultyKorean = ['하', '중', '중상', '상', '고급'];
	useBackHandler({type: 'popToTop'});
	useEffect(() => {
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
	}, []);
	if (isLoading) return <MainContainer></MainContainer>;
	return (
		<BackgroundGray paddingHorizental={0}>
			<ScrollView showsVerticalScrollIndicator={false}>
				<StepText
					marginLeft={widthPercentage(24)}
					mainTextSize={23}
					styleTextColor={colors.Gray4}
					styleText='지역 추천'
					mainText={`${userName} 님, \n이런 탐방코스는 어떠신가요?`}
					subText='여행 성향을 기반으로 추천된 여행지에요!'
				/>
				<SvgContainer>
					<SVGRegionRecommend
						transform={true}
						width={widthPercentage(200)}
						height={heightPercentage(150)}></SVGRegionRecommend>
				</SvgContainer>
				<RecommendBorderContainer>
					{hikingList.map((item, idx) => (
						<Fragment key={idx}>
							{(item.difficulty != hikingList[idx - 1]?.difficulty ?? 0) && (
								<DayRecommendContainer>
									<HStack>
										<PretendardSemiBoldText size={16} lineHeight={21.6} color={colors.Black}>
											난이도
										</PretendardSemiBoldText>
										<PretendardSemiBoldText size={16} lineHeight={21.6} color={colors.PointGreen1}>
											{' ' + difficultyKorean[item.difficulty - 1] + ' '}
										</PretendardSemiBoldText>
										<PretendardSemiBoldText size={16} lineHeight={21.6} color={colors.Black}>
											추천
										</PretendardSemiBoldText>
									</HStack>
								</DayRecommendContainer>
							)}
							<RecommendContainer
								onPress={() => {
									navigation.navigate('HikingDetailResult', {item: item});
								}}>
								<ImageContainer>
									{item.photo[0] != '' ? (
										<RecommendImage source={{uri: item.photo[0]}}></RecommendImage>
									) : (
										<LogoCOntainer>
											<SvgLoginLogo color={'white'} width={40} />
										</LogoCOntainer>
									)}
									<GraientBackground>
										<RegionText>{item.name}</RegionText>
										<TagContainer>
											{item.tendency.map((value, index) => (
												<TagElement key={index} opacityStatus={true}>
													<HStack>
														<PretendardVariableText
															size={12}
															lineHeight={14}
															color={colors.Primary}>
															{'# '}
														</PretendardVariableText>
														<PretendardVariableText
															size={10}
															lineHeight={12}
															color={colors.backgroundWhite}>
															{value}
														</PretendardVariableText>
													</HStack>
												</TagElement>
											))}
										</TagContainer>
									</GraientBackground>
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
	top: ${heightPercentage(51)}px;
`;
const RecommendBorderContainer = styled.View`
	border-radius: 30px 30px 0px 0px;
	background-color: ${colors.backgroundWhite};
	padding: 0px ${widthPercentage(24)}px 0px ${widthPercentage(24)}px;
	margin-top: ${heightPercentage(52)}px;
`;
const DayRecommendContainer = styled.View`
	width: ${widthPercentage(125)}px;
	height: ${heightPercentage(35)}px;
	align-items: center;
	justify-content: center;
	background-color: ${colors.Gray1};
	border-radius: 12px 12px 0px 0px;
	margin-bottom: ${widthPercentage(12)}px;
	top: -${heightPercentage(17.5)}px;
`;
const ImageContainer = styled.View`
	width: ${widthPercentage(327)}px;
	height: ${widthPercentage(200)}px;
	margin-top: ${widthPercentage(12)}px;
`;
const RegionText = styled(PretendardSemiBold)`
	font-size: ${fontPercentage(20)}px;
	font-weight: 600;
	line-height: ${heightPercentage(27)}px;
	color: ${colors.backgroundWhite};
	bottom: ${heightPercentage(10)}px;
	left: ${widthPercentage(10)}px;
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
const RecommendImage = styled.Image`
	width: 100%;
	height: 100%;
	border-radius: 10px;
`;
const GraientBackground = styled.View`
	position: absolute;
	bottom: 0px;
	width: ${widthPercentage(327)}px;
	height: ${widthPercentage(100)}px;
	background-color: rgba(0, 0, 0, 0.3);
	justify-content: flex-end;
	border-bottom-right-radius: 12px;
	border-bottom-left-radius: 12px;
`;
