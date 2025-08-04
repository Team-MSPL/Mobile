import {useEffect, useRef, useState} from 'react';
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
	VStack,
	BackgroundGrayScrollView,
} from '../../utill/layout/layout';
import {SVGCalendarRecommend, SVGFlag, SvgHomeIcon, SVGRightAdd} from '../../utill/svg/svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useBackHandler} from '../../utill/hooks/useBackhandler';
import StepText from '../../utill/component/enroll-info/step-text';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {WhiteContainer} from '../enroll-info/final-check';
import PrimaryButton from '../../utill/component/primary-button';
import {useViewPager} from '../../utill/hooks/useViewPager';
import ViewPager from '../../utill/view-pager';
import {deleteAI, saveAI} from '../../redux/travel-info/travel.slice';
import {logEvent} from '../../../firebaseAnalytice';
import LinearGradient from 'react-native-linear-gradient';
import {FlatList} from 'react-native';
import {FlatList as FlatListType} from 'react-native';
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
		regionInfo,
	} = useAppSelector(state => state.travelSlice);
	const {userName, socialloginProvider} = useAppSelector(state => state.userSlice);
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
								modalTitle: '저장되지 않았어요',
								modalSubTitle:
									'홈으로 이동시 지역 추천이 종료돼요.\n일정 선택 후에 종료해야 저장할 수 있어요.',
								// modalFunction: () => {
								// 	navigation.popToTop();
								// },
								modalTopText: '일정 선택하러 가기',
								modalBottomText: '종료하기',
								modalBottomFunctionUse: true,
								modalBottomFunction: () => {
									navigation.popToTop();
								},
								modalLeft: true,
							}),
						);
					}}
					style={{justifyContent: 'center', paddingLeft: 10}}>
					<SvgHomeIcon />
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
			const aiIdData = await dispatch(saveAI(data)).unwrap();

			console.log(aiIdData.aiId);
			const cacheValues: [string, string][] = [
				['preset', JSON.stringify(presetDatas)],
				['presetTendency', JSON.stringify(presetTendencyList)],
				['day', JSON.stringify(day.slice(0, nDay + 1))],
				['nDay', nDay.toString()],
				['transit', transit.toString()],
				['tendency', JSON.stringify(tendency)],
				['travelName', travelName.toString()],
				['region', region.toString()],
				['aiId', aiIdData.aiId],
			];
			console.log(aiIdData.aiId);
			AsyncStorage.multiSet(cacheValues);
		} catch (err) {
			console.log(err, '에러');
		}
	};
	const handleGoogleAnalytics = async () => {
		let copy = {};
		presetDatas.map((item, idx) => {
			const keyName = 'recommand_result' + (idx + 1);
			copy[keyName] = item[0][0].name;
		});
		await logEvent('course_complete', copy);
	};
	useEffect(() => {
		handleGoogleAnalytics();
	}, []);
	const {getMainViewPager, deleteMainViewPager, viewPagerState} = useViewPager({title: 'presetViewPager'});
	useEffect(() => {
		getMainViewPager();
	}, []);
	useBackHandler({type: 'popToTop'});
	useEffect(() => {
		if (socialloginProvider != 'anonymous') {
			console.log('zzzzzz', aiFlag, socialloginProvider);
			!aiFlag && saveCache();
		}
	}, [aiFlag, socialloginProvider]);
	const calculateTendency = (e: any) => {
		let copy = [];
		let copy2 = [];
		e?.tendencyNameList?.forEach((item, idx) => {
			if (!['봄', '여름', '가을', '겨울'].includes(item)) {
				copy.push(item);
				copy2.push(e.tendencyRanking[idx]);
			}
		});
		let min = 100;
		let minIndex = -1;
		let nextMin = 100;
		let nextMinIndex = -1;
		console.log(copy, copy2);
		copy2.forEach((item, idx) => {
			if (item <= min) {
				nextMin = min;
				nextMinIndex = minIndex;
				min = item;
				minIndex = idx;
			} else if (item <= nextMin) {
				nextMin = item;
				nextMinIndex = idx;
			}
		});
		let result =
			(e?.tendencyNameList[minIndex] ?? '') +
			(e?.tendencyNameList[nextMinIndex] ? ', ' + e?.tendencyNameList[nextMinIndex] : '');
		return result;
	};
	const [viewType, setViewType] = useState(0);
	const scrollRef = useRef<FlatListType<any>>(null);
	const moveScroll = idx => {
		scrollRef.current?.scrollToIndex({
			index: idx,
			animated: false,
		});
	};
	const onViewableItemsChanged = useRef(items => {
		setViewType(items[0]?.index);
	});

	const renderItem = ({item, idx}) => {
		return (
			<>
				<HStack
					deco={`background-color:${colors.Green1};width:${widthPercentage(
						130,
					)}px;border-top-right-radius:8px;border-top-left-radius:8px;height:${widthPercentage(
						48,
					)}px;align-items:center;justify-content:center;`}>
					{/* <IndexContainer>
					<PretendardSemiBoldText size={14} lineHeight={16} color={colors.Gray5}>
						{idx + 1}
					</PretendardSemiBoldText>
				</IndexContainer> */}
					<PretendardSemiBoldText size={18} lineHeight={22.6} color={colors.Gray5}>
						{nDay == 0 ? '당일치기 ' : nDay + '박 ' + (nDay + 1) + '일 '}
					</PretendardSemiBoldText>
					{/* <PretendardSemiBoldText size={16} lineHeight={21.6} color={colors.Gray3}>
					일정
				</PretendardSemiBoldText> */}
				</HStack>
				<WhiteContainer
					key={idx}
					deco={`border-width:1px;border-color:${colors.Gray200};padding:${widthPercentage(
						20,
					)}px ${widthPercentage(24)}px;`}>
					{presetTendencyList[idx]?.tendencyNameList.length >= 1 && (
						<>
							{presetTendencyList[idx]?.tendencyNameList.length >= 2 && presetDatas.length >= 2 && (
								<HStack>
									<PretendardSemiBoldText size={14} lineHeight={20.6} color={colors.Black}>
										다른 코스에 비해{' '}
										<PretendardSemiBoldText size={14} lineHeight={20.6} color={colors.PointYellow}>
											[{calculateTendency(presetTendencyList[idx])}]
										</PretendardSemiBoldText>{' '}
										성향이 더 높아요
									</PretendardSemiBoldText>
								</HStack>
							)}
							<HStack>
								<FlexWrap
									width={widthPercentage(250)}
									gap={widthPercentage(10)}
									marginBottom={10}
									onPress={() => {
										let copy = {...tendencyViewIndex};
										copy[idx] = !copy[idx];
										setTendencyViewIndex(copy);
									}}>
									{presetTendencyList[idx]?.tendencyNameList
										.slice(
											0,
											tendencyViewIndex[idx]
												? 4
												: presetTendencyList[idx]?.tendencyNameList.length,
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
								{presetTendencyList[idx]?.tendencyNameList.length > 4 && (
									<TouchableOpacity
										style={{
											height: 'auto',
											justifyContent: 'flex-end',
											marginLeft: 4,
										}}
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
						</>
					)}
					{item.map((value, index) => {
						return (
							<HStack gap={widthPercentage(10)} key={index} deco={'width:100%;'}>
								<HStack deco='width:30%;'>
									<DashLineContainer>
										{value[value[0].name == '숙소 추천' ? 1 : 0].category == 4 ? (
											<Triangle />
										) : (
											<Circle
												color={
													value[value[0].name == '숙소 추천' ? 1 : 0].category == 5
														? colors.PointYellow
														: colors.Gray5
												}
											/>
										)}
										<DashLine
											status={index == 0 ? 'start' : index == item.length - 1 ? 'end' : 'center'}
										/>
									</DashLineContainer>
									<PretendardVariableText size={14} lineHeight={17} color={colors.Title}>
										{index + 1}일차
									</PretendardVariableText>
								</HStack>
								<VStack deco='width:50%;' justifyContent='center'>
									<PretendardVariableText
										maxWidth={widthPercentage(150)}
										numberOfLines={1}
										size={16}
										lineHeight={19}
										color={
											value[value[0].category == 4 ? 1 : 0].category == 5
												? colors.PointYellow
												: colors.Gray5
										}>
										{value[value[0].category == 4 ? 1 : 0].name}
									</PretendardVariableText>
									{value.filter(itemValue => !itemValue.name.includes('추천')).length - 1 >= 1 && (
										<PretendardVariableText size={16} lineHeight={16} color={colors.Title}>
											+{value.filter(itemValue => !itemValue.name.includes('추천')).length - 1}개
											장소
										</PretendardVariableText>
									)}
								</VStack>
							</HStack>
						);
					})}
					<PrimaryButton
						alignSelf='center'
						marginBottom={heightPercentage(10)}
						marginTop={heightPercentage(10)}
						width={widthPercentage(290)}
						height={heightPercentage(50)}
						label='일정 자세히 보기'
						backgroundColor={colors.backgroundGray}
						textColor={colors.PointYellow}
						onPress={async () => {
							goDetail(idx);
							await logEvent('view_course_result_detail', {
								place: item[0][0].name,
							});
						}}></PrimaryButton>
				</WhiteContainer>
			</>
		);
	};
	return (
		<BackgroundGrayScrollView>
			<StepText
				mainTextSize={23}
				styleTextColor={colors.Gray4}
				styleTextSize={14}
				styleText='다님의 일정 추천!'
				mainText={`${userName} 님, \n이런 여행 일정은 어떠신가요?`}
				subText='점수가 낮은 일정은 간단한 동선을 우선시했어요!'
			/>
			{/* <SvgContainer>
					<SVGCalendarRecommend
						style={{zIndex: 0}}
						width={widthPercentage(200)}
						height={heightPercentage(150)}
					/>
				</SvgContainer> */}
			<BackgroundContainer>
				<BackgroundImage resizeMode='stretch' source={{uri: regionInfo.photo}}></BackgroundImage>
				<LinearGradient
					start={{x: 0, y: 0}}
					end={{x: 0, y: 1}}
					colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.5)']}
					style={{
						zIndex: 101,
						position: 'absolute',
						width: '100%',
						paddingHorizontal: widthPercentage(24),
						justifyContent: 'center',
						height: '100%',
						borderRadius: 12,
					}}>
					<VStack>
						<PretendardSemiBoldText size={22} lineHeight={26} color={colors.backgroundWhite}>
							{region[0].split('/').at(-1)}
							{region.length >= 2 ? ` 외 ${region.length - 1}지역` : ''}
						</PretendardSemiBoldText>
						<FlexWrap gap={widthPercentage(4)} marginBottom={0}>
							{presetTendencyList[0]?.tendencyNameList.slice(0, 3).map((item, idx) => {
								return (
									<TagContainer backgroundColor={'rgba(195,245,80,0.3)'} key={idx}>
										<PretendardSemiBoldText
											size={14}
											lineHeight={18}
											color={colors.backgroundWhite}>
											{item}
										</PretendardSemiBoldText>
									</TagContainer>
								);
							})}
							{presetTendencyList[0]?.tendencyNameList.length >= 4 && (
								<PretendardSemiBoldText size={14} lineHeight={18} color={colors.Primary}>
									+{presetTendencyList[0]?.tendencyNameList.length - 3}
								</PretendardSemiBoldText>
							)}
						</FlexWrap>
					</VStack>
				</LinearGradient>
			</BackgroundContainer>
			<ScrollView
				horizontal={true}
				nestedScrollEnabled={true}
				showsHorizontalScrollIndicator={false}
				style={{marginVertical: widthPercentage(10)}}>
				{[...Array.from({length: presetDatas.length}, (item, index) => index)].map((item, idx) => {
					return (
						<RegionItems
							key={idx}
							select={idx == viewType}
							onPress={() => {
								moveScroll(idx);
								setViewType(idx);
							}}>
							<PretendardSemiBoldText
								size={16}
								lineHeight={20}
								color={idx == viewType ? colors.backgroundWhite : colors.Gray400}>
								{idx + 1}
							</PretendardSemiBoldText>
						</RegionItems>
					);
				})}
			</ScrollView>
			<FlatList
				keyExtractor={(_, index) => index.toString()}
				style={{height: heightPercentage(300)}}
				ref={scrollRef}
				data={presetDatas}
				onScrollToIndexFailed={info => {
					setTimeout(() => {
						scrollRef.current?.scrollToIndex({
							index: info.index,
							animated: true,
						});
					}, 500); // 일정 시간 후 재시도
				}}
				showsVerticalScrollIndicator={false}
				onViewableItemsChanged={onViewableItemsChanged.current}
				viewabilityConfig={{
					itemVisiblePercentThreshold: 50, // 50% 이상 보이면 감지
				}}
				renderItem={renderItem}></FlatList>

			<Modal
				animationType={'fade'}
				transparent={true}
				visible={viewPagerState}
				onRequestClose={deleteMainViewPager}>
				<ViewPager sliceNumber={2} handleFunction={deleteMainViewPager} />
			</Modal>
		</BackgroundGrayScrollView>
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
export const DashLine = styled.View<{status: string; dash?: boolean; color?: string}>`
	width: 1px;
	height: ${props => (props.status == 'center' ? '100%' : '50%')};
	border: ${props => (props.dash ?? true ? 'dashed' : '')} ${props => props.color ?? colors.Gray5};
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
const BackgroundImage = styled.Image`
	position: absolute;
	width: ${widthPercentage(327)}px;
	height: ${heightPercentage(89)}px;
	border-radius: 8px;
`;

const BackgroundContainer = styled.View`
	width: ${widthPercentage(327)}px;
	height: ${heightPercentage(89)}px;
	border-radius: 8px;
	margin-vertical: ${widthPercentage(10)}px;
`;
const RegionItems = styled.TouchableOpacity<{select: boolean}>`
	justify-content: center;
	align-items: center;
	width: ${widthPercentage(48)}px;
	height: ${widthPercentage(48)}px;
	background-color: ${props => (props.select ? colors.Gray5 : colors.backgroundWhite)};
	border-radius: 99px;
	margin-right: ${widthPercentage(12)}px;
`;
