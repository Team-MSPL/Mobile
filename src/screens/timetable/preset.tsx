import {useEffect, useState} from 'react';
import {Image, TouchableOpacity, ScrollView, Pressable, Modal} from 'react-native';
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
import {SVGCalendarRecommend, SVGFlag, SVGRightAdd} from '../../utill/svg/svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useBackHandler} from '../../utill/hooks/useBackhandler';
import StepText from '../../utill/component/enroll-info/step-text';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {WhiteContainer} from '../enroll-info/final-check';
import PrimaryButton from '../../utill/component/primary-button';
import {useViewPager} from '../../utill/hooks/useViewPager';
import ViewPager from '../../utill/view-pager';
import {deleteAI, saveAI} from '../../redux/travel-info/travel.slice';
export default function Preset({navigation}: any) {
	const {
		enoughPlace,
		timeLimitArray,
		nDay,
		presetDatas,
		tendency,
		presetTendencyList,
		day,
		transit,
		travelName,
		region,
		aiFlag,
		aiID,
	} = useAppSelector(state => state.travelSlice);
	const {userName} = useAppSelector(state => state.userSlice);
	const dispatch = useAppDispatch();
	const goDetail = (e: number) => {
		navigation.navigate('PresetDetail', {index: e});
	};
	const checkDelete = () => {
		dispatch(
			modalSliceActions.setOpenModal({
				modalTitle: '이 여행 코스들을 삭제할까요?',
				modalSubTitle: '여행 코스를 삭제하면 되돌릴 수 없습니다.',
				modalFunction: handleDeleteAi,
				modalLeft: true,
				modalTopText: '삭제할래요',
				modalBottomText: '취소',
			}),
		);
	};
	const handleDeleteAi = async () => {
		try {
			await dispatch(deleteAI({aiId: aiID}));
			navigation.goBack();
		} catch (e) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '네트워크 연결이 불안정합니다.',
					modalSubTitle: '확인 후 다시 시도해주세요.',
					modalFunction: () => {},
					modalLeft: true,
					modalSingleUse: true,
				}),
			);
		}
	};
	const [tendencyViewIndex, setTendencyViewIndex] = useState<boolean[]>(Array(presetDatas.length).fill(true));
	useEffect(() => {
		navigation.setOptions({
			headerLeft: () => (
				<TouchableOpacity
					onPress={() => {
						dispatch(
							modalSliceActions.setOpenModal({
								modalTitle: '홈으로 이동시 코스 추천이 종료됩니다.',
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
						resizeMode='contain'
						source={require('../../../public/images/danim_logo_row.png')}
						style={{height: heightPercentage(36), aspectRatio: 2.054}}
					/>
				</TouchableOpacity>
			),
			headerRight: () =>
				aiFlag && (
					<TouchableOpacity onPress={checkDelete} style={{justifyContent: 'center'}}>
						<PretendardVariableText size={16} lineHeight={24} color={colors.PointGreen1}>
							삭제
						</PretendardVariableText>
					</TouchableOpacity>
				),
		});
	}, [aiFlag]);
	const saveCache = async () => {
		try {
			let data = {
				region: region,
				day: day.slice(0, nDay + 1),
				nDay: nDay + 1,
				transit: transit,
				timeLimitArray: timeLimitArray,
				tendency: tendency,
				preset: presetDatas,
				enoughPlace: enoughPlace,
				bestPointList: presetTendencyList,
				travelName: travelName,
			};
			await dispatch(saveAI(data)).unwrap();
			const cacheValues: [string, string][] = [
				['preset', JSON.stringify(presetDatas)],
				['presetTendency', JSON.stringify(presetTendencyList)],
				['day', JSON.stringify(day.slice(0, nDay + 1))],
				['nDay', nDay.toString()],
				['transit', transit.toString()],
				['tendency', JSON.stringify(tendency)],
				['travelName', travelName.toString()],
				['region', region.toString()],
			];
			AsyncStorage.multiSet(cacheValues);
		} catch (err) {
			console.log(err, '에러');
		}
	};
	const {getMainViewPager, deleteMainViewPager, viewPagerState} = useViewPager({title: 'presetViewPager'});
	useEffect(() => {
		getMainViewPager();
	}, []);
	useBackHandler({type: 'popToTop'});
	useEffect(() => {
		!aiFlag && saveCache();
	}, [aiFlag]);
	return (
		<BackgroundGray>
			<ScrollView showsVerticalScrollIndicator={false}>
				<StepText
					mainTextSize={23}
					styleTextColor={colors.Gray4}
					styleText='일정 추천'
					mainText={`${userName} 님, \n이런 여행지는 어떠신가요?`}
					subText='점수가 낮은 일정은 간단한 동선을 우선시했어요!'
				/>
				<SvgContainer>
					<SVGCalendarRecommend
						style={{zIndex: 0}}
						width={widthPercentage(200)}
						height={heightPercentage(150)}
					/>
				</SvgContainer>
				<WhiteContainer>
					<RegionTextContainer gap={widthPercentage(4)}>
						<SVGFlag width={widthPercentage(12)} height={widthPercentage(15)} color='#DDF2FE' />
						<PretendardSemiBoldText size={12} lineHeight={14} color={colors.Gray5}>
							{region[0]}
							{region.length >= 2 ? ` 외 ${region.length - 1}지역` : ''}
						</PretendardSemiBoldText>
					</RegionTextContainer>
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
								<HStack marginVertical={heightPercentage(10)}>
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
								<HStack>
									<FlexWrap
										width={widthPercentage(280)}
										gap={widthPercentage(10)}
										marginBottom={10}
										onPress={() => {
											let copy = {...tendencyViewIndex};
											copy[idx] = !copy[idx];
											setTendencyViewIndex(copy);
										}}>
										{presetTendencyList[idx].tendencyNameList
											.slice(
												0,
												tendencyViewIndex[idx]
													? 4
													: presetTendencyList[idx].tendencyNameList.length,
											)
											.map((item, index) => {
												return (
													<TagContainer
														backgroundColor={colors.backgroundGray}
														height={heightPercentage(28)}
														key={index}>
														<PretendardSemiBoldText
															size={14}
															lineHeight={17}
															color={colors.Gray4}>
															{item + ' '}
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
									{presetTendencyList[idx].tendencyNameList.length > 4 && (
										<TouchableOpacity
											style={{height: 'auto', justifyContent: 'flex-end', marginLeft: 4}}
											onPress={() => {
												let copy = {...tendencyViewIndex};
												copy[idx] = !copy[idx];
												setTendencyViewIndex(copy);
											}}>
											<SVGRightAdd
												width={widthPercentage(20)}
												height={widthPercentage(20)}
												color='black'
												transform={tendencyViewIndex[idx] ? 90 : 270}
											/>
										</TouchableOpacity>
									)}
								</HStack>
								{item.map((value, index) =>
									value.map((target, targetIndex) => {
										if (targetIndex == 0) {
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
																	: index == item.length - 1
																	? 'end'
																	: 'center'
															}
														/>
													</DashLineContainer>
													<PretendardVariableText
														maxWidth={widthPercentage(200)}
														size={16}
														lineHeight={19}
														color={
															target.category == 5 ? colors.PointYellow : colors.Gray5
														}>
														{target.name}
													</PretendardVariableText>
													<PretendardVariableText
														size={16}
														lineHeight={16}
														color={colors.Primary}>
														+{value.length - 1}
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
									alignSelf='center'
									marginBottom={heightPercentage(10)}
									marginTop={heightPercentage(10)}
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
			<Modal
				animationType={'fade'}
				transparent={true}
				visible={viewPagerState}
				onRequestClose={deleteMainViewPager}>
				<ViewPager sliceNumber={2} handleFunction={deleteMainViewPager} />
			</Modal>
		</BackgroundGray>
	);
}
const RegionTextContainer = styled(HStack).attrs({as: Pressable})``;
export const DashLineContainer = styled.View<{justifyContent?: string}>`
	width: ${widthPercentage(20)}px;
	min-height: ${heightPercentage(46)}px;
	justify-content: ${props => props.justifyContent ?? 'center'};
	align-items: center;
	height: 100%;
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
