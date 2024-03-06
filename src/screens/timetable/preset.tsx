import {useEffect} from 'react';
import {Image, TouchableOpacity, Platform, ScrollView} from 'react-native';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {colors} from '../../utill/colors';
import {
	BackgroundGray,
	HStack,
	PretendardSemiBoldText,
	FlexWrap,
	TagContainer,
	PretendardVariableText,
} from '../../utill/layout/layout';
import {SVGCalendarRecommend, SVGFlag, SvgPlace} from '../../utill/svg/svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useBackHandler} from '../../utill/hooks/useBackhandler';
import StepText from '../../utill/component/enroll-info/step-text';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {WhiteContainer} from '../enroll-info/final-check';
import {cityViewList} from '../enroll-info/select-city';
import PrimaryButton from '../../utill/component/primary-button';
export default function Preset({navigation}: any) {
	const {nDay, presetDatas, tendency, presetTendencyList, day, transit, travelName, cityIndex, region} =
		useAppSelector(state => state.travelSlice);
	const {userName} = useAppSelector(state => state.userSlice);
	const dispatch = useAppDispatch();
	const goDetail = (e: number) => {
		navigation.navigate('PresetDetail', {index: e});
	};
	useEffect(() => {
		navigation.setOptions({
			headerLeft: () => (
				<TouchableOpacity
					onPress={() => {
						dispatch(
							modalSliceActions.setOpenModal({
								modalTitle: '홈으로 이동시 지역추천이 종료됩니다.',
								modalSubTitle: '그래도 나가시겠습니까?\n변경 사항이 있다면 저장하기 버튼을 눌러주세요.',
								modalFunction: () => {
									navigation.popToTop();
								},
								modalLeft: true,
							}),
						);
					}}
					style={{justifyContent: 'center'}}>
					<Image
						source={require('../../../public/images/danim_logo_row.png')}
						style={{height: 30, aspectRatio: 2.054}}
					/>
				</TouchableOpacity>
			),
		});
	}, []);
	const saveCache = async () => {
		const cacheValues: [string, string][] = [
			['preset', JSON.stringify(presetDatas)],
			['presetTendency', JSON.stringify(presetTendencyList)],
			['day', JSON.stringify(day)],
			['nDay', nDay.toString()],
			['transit', transit.toString()],
			['tendency', JSON.stringify(tendency)],
			['travelName', travelName.toString()],
		];
		AsyncStorage.multiSet(cacheValues);
	};

	useBackHandler({type: 'popToTop'});
	useEffect(() => {
		saveCache();
	}, []);
	return (
		<BackgroundGray>
			<ScrollView showsVerticalScrollIndicator={false}>
				<StepText
					mainTextSize={23}
					styleTextColor={colors.Gray4}
					styleText='일정 추천'
					mainText={`${userName} 님, \n이런 여행지는 어떠신가요?`}
					subText='순위가 낮은 일정은 간단한 동선을 우선시했어요!'
				/>
				<SvgContainer>
					<SVGCalendarRecommend
						width={widthPercentage(200)}
						height={heightPercentage(150)}></SVGCalendarRecommend>
				</SvgContainer>
				<WhiteContainer>
					<HStack>
						<SVGFlag />
						<PretendardSemiBoldText size={12} lineHeight={14} color={colors.Gray5}>
							{cityViewList[cityIndex].title}
						</PretendardSemiBoldText>
					</HStack>
					<FlexWrap gap={widthPercentage(4)} marginBottom={0}>
						{presetTendencyList[0].tendencyNameList.map((item, idx) => {
							return (
								<TagContainer backgroundColor={colors.backgroundGray} key={idx}>
									<PretendardSemiBoldText size={12} lineHeight={14} color={colors.Gray4}>
										{item}
									</PretendardSemiBoldText>
								</TagContainer>
							);
						})}
					</FlexWrap>
				</WhiteContainer>
				{presetDatas.map(
					(item, idx) =>
						item != null && (
							<WhiteContainer key={idx}>
								<HStack>
									<IndexContainer>
										<PretendardSemiBoldText size={14} lineHeight={16} color={colors.Gray5}>
											{idx + 1}
										</PretendardSemiBoldText>
									</IndexContainer>
									<PretendardSemiBoldText size={16} lineHeight={21.6} color={colors.Gray5}>
										{nDay == 0 ? '당일치기 ' : nDay + '박 ' + (nDay + 1) + '일 '}
									</PretendardSemiBoldText>
									<PretendardSemiBoldText size={16} lineHeight={21.6} color={colors.Gray3}>
										일정
									</PretendardSemiBoldText>
								</HStack>
								<FlexWrap gap={widthPercentage(4)} marginBottom={0}>
									{presetTendencyList[idx].tendencyNameList.map((item, index) => {
										return (
											<TagContainer
												backgroundColor={colors.backgroundGray}
												height={heightPercentage(28)}
												key={index}>
												<PretendardSemiBoldText size={14} lineHeight={17} color={colors.Gray4}>
													{item}
												</PretendardSemiBoldText>
												<PretendardSemiBoldText
													size={14}
													lineHeight={17}
													color={colors.PointYellow}>
													{presetTendencyList[idx].tendencyPointList[index]}점
												</PretendardSemiBoldText>
											</TagContainer>
										);
									})}
								</FlexWrap>
								{item.map((value, index) =>
									value.map((target, targetIndex) => {
										if (
											(index == 0 && targetIndex == 0) ||
											index % value.length == targetIndex ||
											(target.category == 4 && targetIndex != 0) ||
											target.category == 5 ||
											(index == item.length - 1 && targetIndex == value.length - 1)
										) {
											return (
												<HStack gap={widthPercentage(10)} key={targetIndex}>
													<DashLineContainer>
														{target.category == 4 ? (
															<Triangle />
														) : (
															<Circle
																color={
																	target.category == 5
																		? colors.PointYellow
																		: colors.Gray5
																}
															/>
														)}
														<DashLine
															status={
																index == 0 && targetIndex == 0
																	? 'start'
																	: index == item.length - 1 &&
																	  targetIndex == value.length - 1
																	? 'end'
																	: 'center'
															}
														/>
													</DashLineContainer>
													<PretendardVariableText
														size={16}
														lineHeight={19}
														color={
															target.category == 5 ? colors.PointYellow : colors.Gray5
														}>
														{target.name}
													</PretendardVariableText>
													<PretendardVariableText
														size={14}
														lineHeight={17}
														color={colors.Gray2}>
														{index + 1}일차
													</PretendardVariableText>
												</HStack>
											);
										}
									}),
								)}
								<PrimaryButton
									width={290}
									height={50}
									label='일정 자세히 보기'
									backgroundColor={colors.backgroundGray}
									textColor={colors.PointYellow}
									onPress={() => goDetail(idx)}></PrimaryButton>
							</WhiteContainer>
						),
				)}
			</ScrollView>
		</BackgroundGray>
	);
}
export const DashLineContainer = styled.View`
	width: ${widthPercentage(20)}px;
	min-height: ${heightPercentage(46)}px;
	justify-content: center;
	align-items: center;
`;
export const Circle = styled.View<{color: string}>`
	width: ${widthPercentage(10)}px;
	height: ${widthPercentage(10)}px;
	border-radius: 99px;
	background-color: ${props => props.color};
	z-index: 2;
`;
export const Triangle = styled.View`
	width: 0;
	height: 0;
	background-color: transparent;
	border-style: solid;
	border-left-width: ${widthPercentage(8)}px;
	border-right-width: ${widthPercentage(8)}px;
	border-top-width: ${widthPercentage(16)}px;
	border-left-color: transparent;
	border-right-color: transparent;
	border-top-color: black;
`;
export const DashLine = styled.View<{status: string; dash?: boolean}>`
	width: 1px;
	height: ${props => (props.status == 'center' ? '100%' : '50%')};
	border: ${props => (props.dash ?? true ? 'dashed' : '')} ${colors.Gray5};
	position: absolute;
	left: ${widthPercentage(9)}px;
	bottom: 0;
	${props => (props.status == 'start' ? 'bottom:0' : props.status == 'end' ? 'top:0' : '')};
`;
const IndexContainer = styled.View`
	width: ${widthPercentage(24)}px;
	height: ${widthPercentage(24)}px;
	border-radius: 6px;
	background-color: ${colors.Primary};
	align-items: center;
	justify-content: center;
	margin-right: ${widthPercentage(10)}px;
`;
const SvgContainer = styled.View`
	z-index: 0;
	position: absolute;
	width: ${widthPercentage(329.19)}px;
	height: ${heightPercentage(204.14)}px;
	align-items: center;
	justify-content: center;
	left: ${widthPercentage(122)}px;
	top: ${heightPercentage(51)}px;
`;
export const PresetButton = styled.TouchableOpacity<{select: boolean}>`
	background-color: ${props => (props.select ? colors.selectButton : colors.normalButton)};
	border-radius: 20px;
	padding: 10px;
	margin: 10px 5px 0px 5px;
`;
