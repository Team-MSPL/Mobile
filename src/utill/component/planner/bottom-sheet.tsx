import BottomSheet, {BottomSheetScrollView, useBottomSheetInternal} from '@gorhom/bottom-sheet';
import moment from 'moment';
import {memo, useCallback, useMemo, useRef, useState} from 'react';
import {styled} from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {colors} from '../../colors';
import {BackgroundGray, HStack, PretendardSemiBoldText, PretendardVariableText, VStack} from '../../layout/layout';
import {heightPercentage, widthPercentage} from '../../layout/responsive-size';
import {cityViewList} from '../enroll-info/city-list';
import RouteButton from '../route-button';
import {LeftBar, RegistButton} from './components';
import Animated, {useAnimatedReaction, runOnJS} from 'react-native-reanimated';
import {SvgAirPort, SvgAirPortIcon, SvgAirPortIngIcon, SvgCarIcon, SVGPlus, SvgTripleDot} from '../../svg/svg';
import {WhiteContainer} from '../../../screens/enroll-info/final-check';
import {InsideGrayContainer, PlusBox} from '../timetable/timetable';
import {DashLineContainer} from '../../../screens/timetable/preset';
import {MarkerContainer} from '../../../screens/timetable/preset-detail';
import {modalSliceActions} from '../../../redux/modal/modalSlice';
import {DotBox, Dropdown, DropdownElement} from '../../../screens/enroll-info/select-multi';
function PlannerBottomSheet({navigation, step, setStep}: any) {
	const {day, region, cityIndex, country, nDay, timetable} = useAppSelector(state => state.travelSlice);
	const sheetRef = useRef<BottomSheet>(null);
	const [btnVisible, setBtnVisible] = useState(true);
	// variables
	const snapPoints: ReadonlyArray<string | number> = useMemo(() => ['10%', '65%', '90%'], []);
	// callbacks
	const handleSheetChange = useCallback((index: number) => {
		console.log('handleSheetChange', index);
	}, []);

	const [open, setOpen] = useState({day: 0, index: 0, status: false, type: ''});

	const categoryTitle = ['관광지', '식당', '', '카페', '숙소', '필수여행지'];
	function SheetContent() {
		const {animatedIndex} = useBottomSheetInternal();

		useAnimatedReaction(
			() => animatedIndex.value,
			(curr, prev) => {
				if (curr !== prev && prev != null) {
					runOnJS(setBtnVisible)(!((curr < prev && Math.floor(curr) <= 0) || Math.floor(curr) <= 0));
				}
			},
			[animatedIndex],
		);

		return <></>;
	}
	const dispatch = useAppDispatch();
	const transitScreen = () => {
		return (
			<>
				<PretendardSemiBoldText size={22} lineHeight={26} color={colors.Black} deco='margin-bottom:10px;'>
					{region[0] == '전체' ? cityViewList[country][cityIndex].title : region[0]}까지 어떻게 가시나요?
				</PretendardSemiBoldText>
				{['가는', '오는'].map((item, index) => (
					<>
						<HStack justifyContent='space-between;' deco='margin-bottom:10px;'>
							<HStack gap={3}>
								<LeftBar color={colors.Blue1} />
								<VStack>
									<PretendardSemiBoldText size={19} lineHeight={23} color={colors.Black}>
										{item}편
									</PretendardSemiBoldText>
									<PretendardSemiBoldText size={13} lineHeight={17} color={colors.PlannerGray}>
										{moment(day[index == 0 ? index : nDay]).format('YYYY-MM-DD')}
									</PretendardSemiBoldText>
								</VStack>
							</HStack>
							<RegistButton
								color={colors.Blue1}
								onPress={() => {
									navigation.navigate('ChoiceTransit');
								}}>
								<PretendardSemiBoldText size={13} lineHeight={18} color={colors.backgroundWhite}>
									{item} 편 등록
								</PretendardSemiBoldText>
							</RegistButton>
						</HStack>
						<TransitBox>
							<HStack>
								<IconContainer>
									<SvgAirPortIcon />
								</IconContainer>
								<PretendardSemiBoldText size={14} lineHeight={18} color={colors.Black}>
									대한항공 /asldnsakl
								</PretendardSemiBoldText>
							</HStack>
							<HStack justifyContent='space-between'>
								<VStack>
									<PretendardSemiBoldText size={32} lineHeight={36} color={colors.Black}>
										ICN
									</PretendardSemiBoldText>
									<PretendardSemiBoldText size={12} lineHeight={16} color={colors.Gray4}>
										인천 국제 공항
									</PretendardSemiBoldText>
								</VStack>
								<VStack>
									<HStack deco={`margin-top:-20px;`}>
										<Dash></Dash>
										<SvgAirPortIngIcon></SvgAirPortIngIcon>
									</HStack>
									<PretendardSemiBoldText
										size={8}
										lineHeight={12}
										color={colors.Gray4}
										deco={'text-align:center;'}>
										1시간
									</PretendardSemiBoldText>
								</VStack>
								<VStack>
									<PretendardSemiBoldText
										size={32}
										lineHeight={36}
										color={colors.Black}
										deco={'text-align:right;'}>
										HAN
									</PretendardSemiBoldText>
									<PretendardSemiBoldText size={12} lineHeight={16} color={colors.Gray4}>
										노이 바이 국제 공항
									</PretendardSemiBoldText>
								</VStack>
							</HStack>
							<HStack gap={widthPercentage(13)}>
								<PretendardSemiBoldText size={12} lineHeight={16} color={colors.Gray4}>
									출발 정보
								</PretendardSemiBoldText>
								<PretendardSemiBoldText size={12} lineHeight={16} color={colors.Gray4}>
									{moment(day[index == 0 ? index : nDay]).format('YYYY-MM-DD')}
								</PretendardSemiBoldText>
								<PretendardSemiBoldText size={12} lineHeight={16} color={colors.Gray4}>
									시간
								</PretendardSemiBoldText>
							</HStack>
							<HStack gap={widthPercentage(13)}>
								<PretendardSemiBoldText size={12} lineHeight={16} color={colors.Gray4}>
									도착 정보
								</PretendardSemiBoldText>
								<PretendardSemiBoldText size={12} lineHeight={16} color={colors.Gray4}>
									{moment(day[index == 0 ? index : nDay]).format('YYYY-MM-DD')}
								</PretendardSemiBoldText>
								<PretendardSemiBoldText size={12} lineHeight={16} color={colors.Gray4}>
									시간
								</PretendardSemiBoldText>
							</HStack>
						</TransitBox>
					</>
				))}
			</>
		);
	};
	const accommodationScreen = () => {
		return (
			<>
				<PretendardSemiBoldText size={22} lineHeight={26} color={colors.Black} deco='margin-bottom:10px;'>
					어디서 머무시나요?
				</PretendardSemiBoldText>
				{timetable.slice(0, timetable.length - 1).map((item, index) => (
					<VStack deco={`margin-top:${widthPercentage(32)}px;`}>
						<HStack justifyContent='space-between;' deco='margin-bottom:10px;'>
							<HStack gap={3}>
								<LeftBar color={colors.Pink1} />
								<VStack>
									<PretendardSemiBoldText size={19} lineHeight={23} color={colors.Black}>
										{index + 1}일 차
									</PretendardSemiBoldText>
									<PretendardSemiBoldText size={13} lineHeight={17} color={colors.PlannerGray}>
										{moment(day[index == 0 ? index : nDay]).format('YYYY-MM-DD')}
									</PretendardSemiBoldText>
								</VStack>
							</HStack>
							<RegistButton
								color={colors.Pink1}
								onPress={() => {
									console.log(item);
									navigation.navigate('TimetableAddPlace', {
										x: index,
										y: [],
										status: 'accommodation',
									});
								}}>
								<PretendardSemiBoldText size={13} lineHeight={18} color={colors.backgroundWhite}>
									숙소 등록
								</PretendardSemiBoldText>
							</RegistButton>
						</HStack>
						{item?.find(acc => acc?.category === 4 && acc?.name?.trim() !== '' && acc?.y == 36) && (
							<GrayBox>
								<VStack width={widthPercentage(243)}>
									<PretendardSemiBoldText
										size={18}
										lineHeight={22}
										color={colors.Black}
										numberOfLines={1}>
										{
											item?.find(
												acc => acc?.category === 4 && acc?.name?.trim() !== '' && acc?.y == 36,
											)?.name
										}
									</PretendardSemiBoldText>
									<PretendardSemiBoldText
										size={13}
										lineHeight={18}
										color={colors.Black}
										numberOfLines={1}>
										{
											item?.find(
												acc =>
													acc?.category === 4 &&
													acc?.formatted_address?.trim() !== '' &&
													acc?.y == 36,
											)?.formatted_address
										}
									</PretendardSemiBoldText>
								</VStack>
							</GrayBox>
						)}
					</VStack>
				))}
			</>
		);
	};
	const timeTableScreen = () => {
		return (
			<>
				<StartContainer>
					<PretendardSemiBoldText size={16} lineHeight={20} color={colors.Black} numberOfLines={1}>
						{step - 1}일 차 일정은{' '}
						<PretendardSemiBoldText size={16} lineHeight={20} color={colors.PointYellow} numberOfLines={1}>
							오전 9시에
						</PretendardSemiBoldText>
						시작할게요!
					</PretendardSemiBoldText>
				</StartContainer>
				<WhiteContainer
					deco={`border-width:1px;border-color:${colors.Gray200};padding:${widthPercentage(
						20,
					)}px ${widthPercentage(24)}px;`}>
					<HStack>
						<PretendardSemiBoldText size={16} lineHeight={20} color={colors.Black} numberOfLines={1}>
							DAY {step - 1}{' '}
						</PretendardSemiBoldText>
						<PretendardVariableText size={14} lineHeight={20} color={colors.Title} numberOfLines={1}>
							{moment(day[step - 2]).format('YYYY-MM-DD')}
						</PretendardVariableText>
					</HStack>
					{timetable[step - 2].map((item, index) => (
						<>
							{timetable[step - 2].at(-1)?.category === 4 &&
								timetable[step - 2].length === 1 &&
								timetable[step - 2].at(-1)?.y === 36 && (
									<HStack gap={20} marginHorizon={widthPercentage(30)} marginVertical={10}>
										<PlusBox
											onPress={() => {
												navigation.navigate('AddCategory', {
													info: {day: step - 2, index: timetable[step - 2].length},
												});
											}}>
											<SVGPlus color={colors.Gray400} />
										</PlusBox>
									</HStack>
								)}
							<HStack>
								<VStack>
									<HStack gap={widthPercentage(10)} marginVertical={widthPercentage(10)}>
										<DashLineContainer justifyContent='start'>
											<MarkerContainer
												backgroundColor={item.category == 4 ? colors.Pink1 : colors.Green5}>
												<PretendardSemiBoldText
													size={13}
													lineHeight={19}
													color={colors.backgroundWhite}>
													{index + 1}
												</PretendardSemiBoldText>
											</MarkerContainer>
											{/* <DashLine
												status={idx == value.length - 1 ? 'end' : 'center'}></DashLine> */}
										</DashLineContainer>
										<InsideGrayContainer
											onLongPress={() => {
												dispatch(
													modalSliceActions.setOpenModal({
														modalTitle: '편집 모드에서 여행 일정을 편집하시겠어요?',
														modalFunction: () => {
															// setModify(true);
														},
													}),
												);
											}}
											onPress={() => {
												console.log('category', timetable[step - 2]?.at(-1)?.category);
												console.log('length', timetable[step - 2]?.length);
												console.log('y', timetable[step - 2]?.at(-1)?.y);

												// moveRegion(idx, index);
											}}>
											<HStack justifyContent='space-between;'>
												<VStack>
													<PretendardVariableText
														size={12}
														lineHeight={18}
														color={colors.Gray2}>
														{categoryTitle[item.category]}{' '}
														{Math.floor(((item.y ?? 0) * 30 + 360) / 60)}:
														{String(((item.y ?? 0) * 30 + 360) % 60).padStart(2, '0')} ~{' '}
														{Math.floor(
															(((item.y ?? 0) + item.takenTime / 30) * 30 + 360) / 60,
														) < 25 &&
															Math.floor(
																(((item.y ?? 0) + item.takenTime / 30) * 30 + 360) / 60,
															) +
																':' +
																String(
																	(((item.y ?? 0) + item.takenTime / 30) * 30 + 360) %
																		60,
																).padStart(2, '0')}
													</PretendardVariableText>
													<PretendardSemiBoldText
														maxWidth={widthPercentage(200)}
														size={14}
														lineHeight={18.9}
														numberOfLines={2}
														color={colors.Gray5}>
														{item.name}
													</PretendardSemiBoldText>
												</VStack>
												<VStack deco='z-index:1000;'>
													<DotBox
														deco='align-items:center; justify-content:center;'
														onPress={() =>
															setOpen({
																status: !open.status,
																index: index,
																day: index,
																type: 'essential',
															})
														}>
														<SvgTripleDot />
													</DotBox>
													{open.status &&
														open.index == index &&
														open.day == index &&
														open.type == 'essential' && (
															<Dropdown>
																<DropdownElement
																	onPress={() => {
																		setOpen({
																			day: 0,
																			index: 0,
																			status: false,
																		});
																		// setModify(true);
																		//openModal(item.x, idx);
																	}}>
																	<PretendardSemiBoldText
																		color={colors.Gray5}
																		size={14}
																		lineHeight={18}>
																		편집
																	</PretendardSemiBoldText>
																</DropdownElement>
																{/* <DropdownElement
																	onPress={() => {
																		// deleteEssential(data);
																	}}>
																	<PretendardSemiBoldText
																		color={colors.Gray5}
																		size={14}
																		lineHeight={18}>
																		삭제
																	</PretendardSemiBoldText>
																</DropdownElement> */}
															</Dropdown>
														)}
												</VStack>
											</HStack>
										</InsideGrayContainer>
									</HStack>
								</VStack>
							</HStack>
							{((timetable[step - 2].at(-1)?.category == 4 && timetable[step - 2].length - 2 == index) ||
								(timetable[step - 2].at(-1)?.category == 4 && timetable[step - 2].at(-1)?.y == 6)) && (
								<HStack gap={20} marginHorizon={widthPercentage(30)} marginVertical={10}>
									<PlusBox
										onPress={() => {
											navigation.navigate('AddCategory', {
												info: {day: step - 2, index: index},
											});
										}}>
										<SVGPlus color={colors.Gray400} />
									</PlusBox>
								</HStack>
							)}
						</>
					))}
					{timetable[step - 2].at(-1)?.category != 4 && (
						<HStack gap={20} marginHorizon={widthPercentage(30)} marginVertical={10}>
							<PlusBox
								onPress={() => {
									navigation.navigate('AddCategory', {
										info: {day: step - 2, index: timetable[step - 2].length},
									});
								}}>
								<SVGPlus color={colors.Gray400} />
							</PlusBox>
						</HStack>
					)}
				</WhiteContainer>
			</>
		);
	};
	return (
		<>
			<BottomSheet
				ref={sheetRef}
				snapPoints={snapPoints}
				enableDynamicSizing={false}
				onChange={handleSheetChange}
				index={1}>
				<SheetContent />
				<CustomBottomSheetScrollView
					showsVerticalScrollIndicator={false}
					style={{marginBottom: heightPercentage(100)}}>
					{step == 0 ? transitScreen() : step == 1 ? accommodationScreen() : timeTableScreen()}
				</CustomBottomSheetScrollView>
			</BottomSheet>
			{btnVisible && (
				<RouteButton
					navigation={navigation}
					nextText='다음으로'
					leftText='건너뛰기'
					type={'planner'}
					btnFunction={() => {
						setStep(step + 1);
					}}
					LeftBtnFunction={() => {
						setStep(step + 1);
					}}></RouteButton>
			)}
		</>
	);
}
const CustomBottomSheetScrollView = styled(BottomSheetScrollView)`
	padding: 0px ${widthPercentage(24)}px;
`;
const TransitBox = styled.View`
	width: ${widthPercentage(327)}px;
	height: ${widthPercentage(203)}px;
	border-radius: 12px;
	border-width: 1px;
	border-color: ${colors.Gray2};
	padding: ${widthPercentage(17)}px ${widthPercentage(24)}px;
	gap: ${widthPercentage(10)}px;
	margin-bottom: ${widthPercentage(10)}px;
`;
const IconContainer = styled.View`
	width: ${widthPercentage(28)}px;
	height: ${widthPercentage(28)}px;
	border-radius: 99px;
	background-color: ${colors.Blue1};
	align-items: center;
	justify-content: center;
`;
const Dash = styled.View`
	width: ${widthPercentage(50)}px;
	height: ${widthPercentage(1)}px;
	border-width: 1px;
	border-style: dashed;
`;
const GrayBox = styled.View`
	width: ${widthPercentage(327)}px;
	height: ${widthPercentage(72)}px;
	border-radius: 12px;
	background-color: ${colors.backgroundGray};
	margin-top: ${widthPercentage(17)}px;
	padding: ${widthPercentage(15)}px ${widthPercentage(16)}px;
`;
const StartContainer = styled.View`
	width: ${widthPercentage(327)}px;
	height: ${widthPercentage(60)}px;
	border-radius: 8px;
	border-width: 1px;
	border-color: ${colors.Gray200};
	align-items: center;
	justify-content: center;
`;
export default memo(PlannerBottomSheet);
