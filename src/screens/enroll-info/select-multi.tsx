import {
	MainContainer,
	VStack,
	HStack,
	devicesWidth,
	FlexWrap,
	BackgroundGray,
	PretendardSemiBoldText,
	PretendardVariableText,
} from '../../utill/layout/layout';
import StepText from '../../utill/component/enroll-info/step-text';
import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import {useAppDispatch, useAppSelector} from '../../redux';
import {EssentialPlaceType, travelSliceActions} from '../../redux/travel-info/travel.slice';
import {SVGMinus, SVGPlus, SvgTripleDot} from '../../utill/svg/svg';
import Stepper from '../../utill/component/enroll-info/stepper';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import RouteButton from '../../utill/component/route-button';
import {useRef, useState} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Modal} from 'react-native';
import {ModalBackground, ModalBottomSheet} from './planner/regist-transit';
import {BottomContainer} from './search-place';
import PrimaryButton from '../../utill/component/primary-button';
import {useHeaderHeight} from '@react-navigation/elements';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function SelectMulti({navigation}: any) {
	const {nDay, day, accommodations, essentialPlaces, regionRecommendFlag} = useAppSelector(
		state => state.travelSlice,
	);
	const dispatch = useAppDispatch();
	const goSearchPlace = (data: {idx: number; index: number}) => {
		navigation.navigate('SearchPlace', {id: data.index, idx: data.idx});
	};
	const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

	const deleteAccommodation = (e: number) => {
		let copy = [...accommodations];
		copy[e] = {name: '', lat: 0, lng: 0, category: 4, takenTime: 30, photo: ''};
		dispatch(travelSliceActions.enrollAccommodations(copy));
		setOpen({
			...open,
			status: false,
		});
	};
	const deleteEssential = () => {
		const filteredPlaces = essentialPlaces.filter(place => place.day === open.day + 1);
		const data = filteredPlaces.find((item, idx) => idx == open.index);
		const updatedPlaces = essentialPlaces.filter(item => item.id !== data?.id);
		dispatch(travelSliceActions.enrollessentialPlaces(updatedPlaces));
		setOpen({
			...open,
			status: false,
		});
	};

	const modifyEssential = (e: EssentialPlaceType) => {
		let copy = [...essentialPlaces];
		const updatedPlaces = copy.map(item => (item.id == e.id ? {...item, takenTime: (timeValue + 1) * 60} : item));
		dispatch(travelSliceActions.enrollessentialPlaces(updatedPlaces));
		setModify(false);
	};
	const [open, setOpen] = useState({day: 0, index: 0, status: false, type: '', x: 0, y: 0});
	const [timeValue, setTimeValue] = useState(0);
	const [modify, setModify] = useState(false);
	const dotRefs = useRef<Record<string, TouchableOpacity | null>>({});

	const headerHeight = useHeaderHeight();
	const {top: statusBarHeight} = useSafeAreaInsets();

	const totalTopHeight = headerHeight + statusBarHeight;
	return (
		<>
			<MainContainer
				backgroundColor={colors.backgroundWhite}
				onScroll={() => {
					open.status && setOpen({...open, status: false});
				}}>
				<BackgroundGray>
					<Stepper total={13} now={6}></Stepper>
					<StepText
						styleText='1.여행 계획을 알려주세요.'
						mainText='미리 정해놓은 장소가 있나요?'
						subTextSize={13}
						subText={`숙소는 최대 1개, 여행지는 최대 3개까지 추가할 수 있어요.`}></StepText>
					<VStack deco={`margin-top:${widthPercentage(24)}px;z-index:0;`}>
						{[...Array(nDay + 1)].map((item, idx) => {
							const filteredPlaces = essentialPlaces.filter(place => place.day === idx + 1);

							return (
								<DayViewContainer key={idx}>
									<HStack>
										<PretendardSemiBoldText size={16} lineHeight={19.7} color={colors.Black}>
											{'DAY' + (idx + 1)}
										</PretendardSemiBoldText>
										<PretendardSemiBoldText size={14} lineHeight={16.7} color={colors.Gray4}>
											{'   '}
											{day[idx].format('YY.MM.DD') + ' (' + weekdays[day[idx].days()] + ')'}
										</PretendardSemiBoldText>
									</HStack>
									<MultiAllContainer isActive={filteredPlaces.length != 0}>
										{filteredPlaces.length != 0 && (
											<FlexWrap gap={10} deco={'z-index:10;'}>
												<PretendardSemiBoldText
													size={14}
													lineHeight={16.7}
													color={colors.Gray2}
													deco={`margin-left:${widthPercentage(20)}px;`}>
													여행지
												</PretendardSemiBoldText>
												{filteredPlaces.map((data, index) => {
													const refKey = `${idx}_${index}_key`;
													return (
														<ElementContainer color={colors.backgroundGray} key={index}>
															<VStack width={widthPercentage(233)}>
																<HStack gap={3}>
																	<PretendardSemiBoldText
																		size={16}
																		lineHeight={21.6}
																		width={widthPercentage(200)}
																		color={colors.Gray5}>
																		{data.name}
																	</PretendardSemiBoldText>
																	<PretendardSemiBoldText
																		size={12}
																		lineHeight={16.2}
																		color={colors.PointYellow}>
																		{data.takenTime / 60}시간
																	</PretendardSemiBoldText>
																</HStack>
																<PretendardVariableText
																	color={colors.Gray2}
																	size={12}
																	lineHeight={18}>
																	{data.formatted_address}
																</PretendardVariableText>
															</VStack>

															<VStack deco='z-index:1000'>
																<DotBox
																	ref={ref => {
																		dotRefs.current[refKey] = ref;
																	}}
																	onPress={() =>
																		dotRefs?.current[refKey]?.measure(
																			(fx, fy, width, height, px, py) => {
																				setOpen({
																					status: !open.status,
																					index: index,
																					day: idx,
																					type: 'essential',
																					x: px - width,
																					y: py - height,
																				});
																			},
																		)
																	}>
																	<SvgTripleDot />
																</DotBox>
															</VStack>
														</ElementContainer>
													);
												})}
											</FlexWrap>
										)}
										<ElementContainer
											color={colors.backgroundGray}
											height={widthPercentage(43)}
											onPress={() => {
												goSearchPlace({idx: idx, index: 0});
											}}>
											<SVGContainer
												disabled={filteredPlaces.length >= 3}
												color={
													filteredPlaces.length >= 3 ? colors.Gray1 : colors.PrimarySecondary
												}
												onPress={() => {
													goSearchPlace({idx: idx, index: 0});
												}}>
												<SVGPlus
													width={widthPercentage(16)}
													height={widthPercentage(16)}
													color={filteredPlaces.length >= 3 ? colors.Gray2 : '#6F853D'}
												/>
											</SVGContainer>
											<PretendardSemiBoldText size={14} lineHeight={16.7} color={colors.Gray2}>
												여행지 추가하기
											</PretendardSemiBoldText>
										</ElementContainer>
									</MultiAllContainer>
									{idx != nDay && (
										<MultiAllContainer
											marginBottom={15}
											isActive={accommodations[idx + 1].name != ''}>
											{accommodations[idx + 1].name && (
												<>
													<PretendardSemiBoldText
														deco={`margin-left:${widthPercentage(20)}px;`}
														size={14}
														lineHeight={16.7}
														color={colors.Gray2}>
														숙소
													</PretendardSemiBoldText>
													<ElementContainer color={colors.backgroundGray} marginBottom={20}>
														<VStack width={widthPercentage(243)}>
															<PretendardSemiBoldText
																size={16}
																lineHeight={21.6}
																width={widthPercentage(200)}
																color={colors.Gray5}>
																{accommodations[idx + 1].name}
															</PretendardSemiBoldText>
															<PretendardVariableText
																color={colors.Gray2}
																size={12}
																lineHeight={18}>
																{accommodations[idx + 1].formatted_address}
															</PretendardVariableText>
														</VStack>

														<VStack deco='z-index:1000'>
															<DotBox
																ref={ref => (dotRefs.current[`acc_${idx}`] = ref)}
																onPress={() =>
																	dotRefs?.current[`acc_${idx}`]?.measure(
																		(fx, fy, width, height, px, py) => {
																			setOpen({
																				status: !open.status,
																				index: idx,
																				day: idx,
																				type: 'accommodation',
																				x: px - width,
																				y: py - height,
																			});
																		},
																	)
																}>
																<SvgTripleDot />
															</DotBox>
														</VStack>
													</ElementContainer>
												</>
											)}
											<ElementContainer
												color={colors.backgroundGray}
												height={widthPercentage(43)}
												onPress={() => {
													goSearchPlace({idx: idx, index: 1});
												}}>
												<SVGContainer
													disabled={accommodations[idx + 1].name != ''}
													color={
														accommodations[idx + 1].name
															? colors.Gray1
															: colors.PrimarySecondary
													}
													onPress={() => {
														goSearchPlace({idx: idx, index: 1});
													}}>
													<SVGPlus
														width={widthPercentage(16)}
														height={widthPercentage(16)}
														color={accommodations[idx + 1].name ? colors.Gray2 : '#6F853D'}
													/>
												</SVGContainer>
												<PretendardSemiBoldText
													size={14}
													lineHeight={16.7}
													color={colors.Gray2}>
													숙소 추가하기
												</PretendardSemiBoldText>
											</ElementContainer>
										</MultiAllContainer>
									)}
								</DayViewContainer>
							);
						})}
					</VStack>
				</BackgroundGray>
				<Modal
					animationType={'fade'}
					transparent={true}
					visible={modify}
					onRequestClose={() => {
						// setShow(false);
					}}>
					<ModalBackground
						onPress={() => {
							setModify(false);
							// setPlaceState(null);
							// clearInput();
						}}>
						<ModalBottomSheet flex={0.4}>
							<BottomContainer height={heightPercentage(230)} gap={20}>
								<ElementContainer color={colors.backgroundGray}>
									<VStack width={widthPercentage(243)}>
										<PretendardSemiBoldText size={16} color={colors.Gray5} lineHeight={21.6}>
											{
												essentialPlaces.filter(place => place.day === open.day + 1)?.[
													open.index
												]?.name
											}
										</PretendardSemiBoldText>
										<PretendardVariableText
											size={12}
											lineHeight={18}
											color={colors.Gray2}
											numberOfLines={1}>
											{
												essentialPlaces.filter(place => place.day === open.day + 1)?.[
													open.index
												]?.formatted_address
											}
										</PretendardVariableText>
									</VStack>
								</ElementContainer>
								<HStack justifyContent='space-around'>
									<PretendardSemiBoldText size={16} color={colors.Gray5} lineHeight={24}>
										머무를 시간
									</PretendardSemiBoldText>
									<HStack justifyContent='space-around' width={widthPercentage(182)}>
										<SVGContainer
											disabled={timeValue < 1}
											onPress={() => {
												setTimeValue(timeValue - 1);
											}}
											color={timeValue < 1 ? colors.backgroundWhite : colors.Gray1}>
											{timeValue >= 1 && (
												<SVGMinus
													width={widthPercentage(23)}
													height={widthPercentage(23)}
													color={colors.Gray2}
												/>
											)}
										</SVGContainer>

										<PretendardSemiBoldText size={16} color={colors.PointYellow} lineHeight={21.6}>
											{timeValue + 1}시간
										</PretendardSemiBoldText>
										<SVGContainer
											disabled={timeValue > 1}
											onPress={() => {
												setTimeValue(timeValue + 1);
											}}
											color={timeValue > 1 ? colors.backgroundWhite : colors.Gray5}>
											{timeValue <= 1 && (
												<SVGPlus
													width={widthPercentage(25)}
													height={widthPercentage(25)}
													color={colors.Primary}
												/>
											)}
										</SVGContainer>
									</HStack>
								</HStack>
								<PrimaryButton
									label={'수정 완료'}
									width={widthPercentage(327)}
									height={heightPercentage(60)}
									onPress={() =>
										modifyEssential(
											essentialPlaces.filter(place => place.day === open.day + 1)?.[open.index],
										)
									}
									backgroundColor={colors.Gray5}
									textColor={colors.backgroundWhite}></PrimaryButton>
							</BottomContainer>
						</ModalBottomSheet>
					</ModalBackground>
				</Modal>
				<MarginContainder></MarginContainder>
			</MainContainer>

			<RouteButton navigation={navigation} nextTitle='RecommendSelectWho'></RouteButton>
			{open.status && (
				<Dropdown x={open.x} y={open.y - totalTopHeight}>
					{open.type == 'essential' && (
						<DropdownElement
							onPress={() => {
								setOpen({
									...open,
									status: false,
								});
								setModify(true);
							}}>
							<PretendardSemiBoldText color={colors.Gray5} size={14} lineHeight={18}>
								편집
							</PretendardSemiBoldText>
						</DropdownElement>
					)}
					<DropdownElement
						onPress={() => {
							open.type == 'essential' ? deleteEssential() : deleteAccommodation(open.day + 1);
						}}>
						<PretendardSemiBoldText color={colors.Gray5} size={14} lineHeight={18}>
							삭제
						</PretendardSemiBoldText>
					</DropdownElement>
				</Dropdown>
			)}
		</>
	);
}
export const MarginContainder = styled.View`
	margin: 0px 0px 130px 0px;
`;

export const DayViewContainer = styled.View`
	width: ${widthPercentage(327)}px;
	align-self: center;
	border-radius: 8px;
	background-color: ${colors.backgroundWhite};
	padding: 15px;
	gap: ${widthPercentage(8)}px;
	border-width: 1px;
	border-color: ${colors.Gray200};
	margin-bottom: ${widthPercentage(10)}px;
	z-index: 0;
	position: relative;
`;

export const SVGContainer = styled.TouchableOpacity<{color: string; width?: number}>`
	width: ${props => widthPercentage(props.width ?? 33)}px;
	height: ${props => widthPercentage(props.width ?? 33)}px;
	background-color: ${props => props.color};
	border-radius: 99px;
	align-items: center;
	justify-content: center;
`;
export const ElementContainer = styled.Pressable<{
	width?: string;
	color: string;
	height?: number;
	marginBottom?: number;
}>`
	border-radius: 8px;
	background-color: ${props => props.color};
	align-items: center;
	padding: 0px ${widthPercentage(20)}px;
	gap: ${widthPercentage(10)}px;
	flex-direction: row;
	margin-right: ${widthPercentage(5)}px;
	margin-bottom: ${props => props.marginBottom ?? widthPercentage(5)}px;
	width: ${props => widthPercentage(props?.width ?? 300)}px;
	height: ${props => props.height + 'px' ?? 'auto'};
	z-index: -100;
	position: relative;
`;
const MultiAllContainer = styled.View<{marginBottom?: number; isActive: boolean}>`
	width: ${widthPercentage(300)}px;
	border-radius: 12px;
	background-color: ${colors.backgroundGray};
	gap: ${widthPercentage(3)}px;
	${props => props.isActive && 'padding:20px 0px;'}
	z-index:0;
	position: relative;
`;
export const ButtonContainer = styled.View`
	width: ${devicesWidth}px;
	height: ${heightPercentage(90)}px;
	background-color: ${colors.backgroundWhite};
	position: absolute;
	bottom: 0px;
`;
export const DeleteContainer = styled.TouchableOpacity`
	width: ${widthPercentage(41)}px;
	height: ${heightPercentage(22)}px;
	border-radius: 99px;
	background-color: ${colors.Primary};
	align-items: center;
	justify-content: center;
`;
export const Dropdown = styled.View<{x: number; y: number}>`
	width: ${widthPercentage(52)}px;
	border-width: 1px;
	position: absolute;
	left: ${props => widthPercentage((props.x ?? 0) - 40)}px;
	top: ${props => widthPercentage((props.y ?? 0) + 15)}px;
	border-radius: 12px;
	border-color: ${colors.Gray200};
	background-color: ${colors.backgroundWhite};
	z-index: 1111;
`;
export const DropdownElement = styled.TouchableOpacity`
	width: 100%;
	height: ${widthPercentage(48)}px;
	align-items: center;
	border-radius: 12px;
	justify-content: center;
	background-color: ${colors.backgroundWhite};
	z-index: 1111;
`;
export const DotBox = styled.TouchableOpacity<{deco?: string}>`
	width: ${widthPercentage(30)}px;
	height: ${widthPercentage(30)}px;
	${props => props.deco}
`;
