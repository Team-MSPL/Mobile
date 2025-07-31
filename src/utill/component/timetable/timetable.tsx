import {memo, useCallback, useEffect, useState} from 'react';
import {WhiteContainer} from '../../../screens/enroll-info/final-check';
import {heightPercentage, widthPercentage} from '../../layout/responsive-size';
import {HStack, PretendardSemiBoldText, PretendardVariableText, VStack} from '../../layout/layout';
import moment from 'moment';
import {colors} from '../../colors';
import {DashLine, DashLineContainer} from '../../../screens/timetable/preset';
import {
	NestableScrollContainer,
	NestableDraggableFlatList,
	ScaleDecorator,
	RenderItemParams,
} from 'react-native-draggable-flatlist';
import {MarkerContainer} from '../../../screens/timetable/preset-detail';
import PrimaryButton from '../primary-button';
import {useDispatch} from 'react-redux';
import {Image, Pressable} from 'react-native';
import styled from 'styled-components/native';
import InfoView from './info-view';
import {modalSliceActions} from '../../../redux/modal/modalSlice';
import {useAppSelector} from '../../../redux';
import {SvgCarIcon, SVGPlus, SvgPolygon, SvgTripleDot} from '../../svg/svg';
import {DotBox, Dropdown, DropdownElement} from '../../../screens/enroll-info/select-multi';
function Timetable({
	modify,
	scrollRef,
	changeViewState,
	scrollhandle,
	changeLocation,
	changeLocationRef,
	openModal,
	navigation,
	CancelModify,
	goNavigation,
	setModify,
	viewMap,
	select,
}) {
	const dispatch = useDispatch();
	const {timetable, day, region} = useAppSelector(state => state.travelSlice);
	const categoryTitle = ['여행지', '식당', '', '카페', '숙소', '필수여행지', '여행 시작', '여행 종료'];
	const excludeNames = ['점심 추천', '저녁 추천', '숙소 추천'];
	const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
	const goSearchPlace = (data: {index: number; idx: number; category: string}) => {
		navigation.navigate('SearchRecommend', {index: data.index, idx: data.idx, category: data.category});
	};

	const moveRegion = async (e: number, index: number) => {
		let copy = {
			...timetable[index][e],
			region: region[timetable[index][e].regionIndex],
		};
		navigation.navigate('CourseDetail', {value: copy});
	};
	const restaurantRecommend = useCallback((e: {value: any; index: number; idx: number}) => {
		CancelModify();
		let lat = 0;
		let lng = 0;
		let radius = 2000;
		let status = timetable[e.idx][e.index - 1];
		let goCheck = true;
		if (timetable[e.idx].length == 1) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '추천이 불가합니다.',
					modalSubTitle: '앞,뒤 관광지를 바탕으로 추천을 해드려요\n관광지를 추가한 후 시도해주세요',
				}),
			);
		} else {
			if (e.index == timetable[e.idx].length - 1) {
				if (timetable[e.idx][timetable[e.idx].length - 2].name.includes('추천')) {
					goCheck = false;
				} else {
					lat = timetable[e.idx][timetable[e.idx].length - 2].lat;
					lng = timetable[e.idx][timetable[e.idx].length - 2].lng;
					status = timetable[e.idx][timetable[e.idx].length - 2];
				}
			} else if (e.index == 0) {
				if (timetable[e.idx][1].name.includes('추천')) {
					goCheck = false;
				} else {
					lat = timetable[e.idx][1].lat;
					lng = timetable[e.idx][1].lng;
					status = timetable[e.idx][1];
				}
			} else {
				const departure = {lat: timetable[e.idx][e.index - 1].lat, lng: timetable[e.idx][e.index - 1].lng};
				const arrival = {lat: timetable[e.idx][e.index + 1].lat, lng: timetable[e.idx][e.index + 1].lng};
				const distance = Math.ceil(useDistance({departure: departure, arrival: arrival}));
				lat = (timetable[e.idx][e.index - 1].lat + timetable[e.idx][e.index + 1].lat) / 2;
				lng = (timetable[e.idx][e.index - 1].lng + timetable[e.idx][e.index + 1].lng) / 2;
				radius = distance >= 20 ? 20000 : distance == 0 ? 2000 : distance * 1000;
				if (
					timetable[e.idx][e.index - 1].name.includes('추천') &&
					timetable[e.idx][e.index + 1].name.includes('추천')
				) {
					goCheck = false;
				} else if (timetable[e.idx][e.index - 1].name.includes('추천')) {
					status = timetable[e.idx][e.index + 1];
				} else if (timetable[e.idx][e.index + 1].name.includes('추천')) {
					status = timetable[e.idx][e.index - 1];
				}
			}
			if (goCheck) {
				const startNumber = e.value.y; // 시작 숫자
				const count = e.value.takenTime / 30; // 원하는 갯수

				const sequentialArray = Array.from({length: count}, (_, index) => startNumber + index);

				navigation.navigate('Recommend', {
					name: '식당 추천',
					x: e.value.x,
					index: e.index,
					y: sequentialArray,
					category: e.value.category,
					lat: lat,
					lng: lng,
					//TODO 해외랑 국내 차이 두기
					apiCategory: region[0].startsWith('해외') ? 'restaurants' : 'FD6',
					// apiCategory: 'restaurants',
					radius: radius,
					backupLat: timetable[e.idx][e.index - 1]?.lat ?? 0,
					backupLng: timetable[e.idx][e.index - 1]?.lng ?? 0,
					status: status,
				});
			} else {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '추천이 불가합니다.',
						modalSubTitle: '앞,뒤 관광지를 바탕으로 추천을 해드려요\n관광지를 추가한 후 시도해주세요',
					}),
				);
			}
		}
	}, []);
	const accommodationRecommend = useCallback((e: {value: any; index: number; idx: number}) => {
		CancelModify();
		if (timetable[e.idx].length < 2) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '추천이 불가합니다.',
					modalSubTitle: '앞,뒤 관광지를 바탕으로 추천을 해드려요\n관광지를 추가한 후 시도해주세요',
				}),
			);
		} else {
			let lat = 0;
			let lng = 0;
			let goCheck = true;
			if (e.index == 0) {
				if (timetable[e.idx][e.index + 1].name.includes('추천')) {
					goCheck = false;
				} else {
					lat = timetable[e.idx][e.index + 1].lat;
					lng = timetable[e.idx][e.index + 1].lng;
				}
			} else {
				if (timetable[e.idx][e.index - 1].name.includes('추천')) {
					goCheck = false;
				} else {
					lat = timetable[e.idx][e.index - 1].lat;
					lng = timetable[e.idx][e.index - 1].lng;
				}
			}
			if (goCheck) {
				const startNumber = e.value.y; // 시작 숫자
				const count = e.value.takenTime / 30; // 원하는 갯수
				const sequentialArray = Array.from({length: count}, (_, index) => startNumber + index);
				navigation.navigate('Recommend', {
					name: '숙소 추천',
					x: e.value?.x ?? e.idx,
					index: e.index,
					y: sequentialArray,
					category: e.value.category,
					lat: lat,
					lng: lng,
					//TODO 해외랑 국내 차이 두기
					//apiCategory: 'AD5',
					apiCategory: region[0].startsWith('해외') ? 'hotels' : 'AD5',
					radius: 2000,
					backupLat: e.index != 0 ? timetable[e.idx][e.index - 1].lat : timetable[e.idx][e.index + 1].lat,
					backupLng: e.index != 0 ? timetable[e.idx][e.index - 1].lng : timetable[e.idx][e.index + 1].lng,
					status: e.index != 0 ? timetable[e.idx][e.index - 1] : timetable[e.idx][e.index + 1],
				});
			} else {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '추천이 불가합니다.',
						modalSubTitle: '앞,뒤 관광지를 바탕으로 추천을 해드려요\n관광지를 추가한 후 시도해주세요',
					}),
				);
			}
		}
	}, []);
	useEffect(() => {
		console.log('qwe');
	}, []);
	const [open, setOpen] = useState({day: 0, index: 0, status: false, type: ''});

	const renderItem = ({item, drag, isActive, getIndex}: RenderItemParams<Item>) => {
		let idx = getIndex() ?? 0;
		return (
			<ScaleDecorator>
				{!excludeNames.includes(item.name) ? (
					<DragHstack
						gap={widthPercentage(10)}
						onLongPress={() => {
							if (item.category != 4) {
								changeLocationRef.current.before = idx;
								drag();
							}
						}}>
						{/* <VStack gap={8} style={{opacity: item.category == 4 ? 0 : 1}}>
							<SvgPolygon width={widthPercentage(20)} height={heightPercentage(15)} />
							<SvgPolygon width={widthPercentage(20)} height={heightPercentage(15)} transform={180} />
						</VStack> */}

						<InsideGrayContainer
							onLongPress={() => {
								if (item.category != 4) {
									changeLocationRef.current.before = idx;
									drag();
								}
							}}
							onPress={() => {
								// moveRegion(idx);
							}}>
							<HStack justifyContent='space-between'>
								<VStack>
									<PretendardVariableText size={12} lineHeight={18} color={colors.Gray2}>
										{categoryTitle[item.category]} {Math.floor(((item.y ?? 0) * 30 + 360) / 60)}:
										{String(((item.y ?? 0) * 30 + 360) % 60).padStart(2, '0')} ~{' '}
										{Math.floor((((item.y ?? 0) + item.takenTime / 30) * 30 + 360) / 60) < 25 &&
											Math.floor((((item.y ?? 0) + item.takenTime / 30) * 30 + 360) / 60) +
												':' +
												String(
													(((item.y ?? 0) + item.takenTime / 30) * 30 + 360) % 60,
												).padStart(2, '0')}
									</PretendardVariableText>
									<PretendardSemiBoldText
										maxWidth={widthPercentage(200)}
										numberOfLines={2}
										size={14}
										lineHeight={18.9}
										color={colors.Gray5}>
										{item.name}
									</PretendardSemiBoldText>
								</VStack>
								<Pressable
									onPress={() => {
										openModal(item.x, idx);
									}}>
									<PretendardSemiBoldText size={14} lineHeight={18.9} color={colors.PointYellow}>
										편집
									</PretendardSemiBoldText>
								</Pressable>
							</HStack>
						</InsideGrayContainer>
					</DragHstack>
				) : (
					<HStack>
						<InfoView
							navigation={navigation}
							test={item}
							index={idx}
							idx={item.x}
							modify={false}
							CancelModify={CancelModify}
						/>
					</HStack>
				)}
			</ScaleDecorator>
		);
	};
	return (
		<>
			{modify == 'ㅂㅈㄷ' ? (
				<DayScrollView
					ref={modify ? scrollRef : null}
					onMomentumScrollEnd={e => {
						changeViewState(e), scrollhandle(e);
					}}>
					{timetable.map(
						(value, index) =>
							value.length != 0 && (
								<WhiteContainer width={widthPercentage(327)} key={index} alignItems='center'>
									<PretendardSemiBoldText
										style={{alignSelf: 'flex-start'}}
										marginBottom={heightPercentage(10)}
										size={14}
										lineHeight={16.71}
										color={colors.Gray5}>
										{moment(day[index]).format('YY.MM.DD')} ({weekdays[moment(day[index]).day()]})
									</PretendardSemiBoldText>

									<NestableDraggableFlatList
										onPlaceholderIndexChange={qwe => (changeLocationRef.current.after = qwe)}
										containerStyle={{
											height:
												heightPercentage(76) * value.length + widthPercentage(3) * value.length,
										}}
										data={value}
										onDragEnd={({data}) => changeLocation(data)}
										keyExtractor={item => item.id}
										renderItem={renderItem}
									/>
								</WhiteContainer>
							),
					)}
				</DayScrollView>
			) : (
				<DayScrollViews
					ref={modify ? null : scrollRef}
					onScroll={e => {
						scrollhandle(e);
						changeViewState(e);
					}}
					// onMomentumScrollEnd={e => {
					// 	console.log(e);
					// 	// scrollhandle(e);
					// 	// changeViewState(e);
					// }}
					// onScrollEndDrag={e => {
					// 	scrollhandle(e);
					// 	changeViewState(e);
					// }}
					viewMap={viewMap}>
					{timetable.map(
						(value, index) =>
							value.length != 0 &&
							index == select && (
								<WhiteContainer
									width={widthPercentage(327)}
									key={index}
									deco={`border-width:1px;border-color:${colors.Gray200};padding:${widthPercentage(
										20,
									)}px ${widthPercentage(24)}px;z-index:0;`}>
									<HStack>
										<PretendardSemiBoldText
											marginBottom={heightPercentage(10)}
											size={16}
											lineHeight={20.71}
											color={colors.Gray5}>
											DAY {index + 1}{' '}
										</PretendardSemiBoldText>
										<PretendardVariableText
											marginBottom={heightPercentage(10)}
											size={14}
											lineHeight={16.71}
											color={colors.Title}>
											{moment(day[index]).format('YYYY-MM-DD')} (
											{weekdays[moment(day[index]).day()]})
										</PretendardVariableText>
									</HStack>

									{value.map((item, idx) =>
										!excludeNames.includes(item.name) ? (
											<VStack>
												<HStack
													gap={widthPercentage(10)}
													key={idx}
													marginVertical={widthPercentage(10)}>
													<DashLineContainer justifyContent='start'>
														<MarkerContainer
															backgroundColor={
																item.category == 4 ? colors.Pink1 : colors.Green5
															}>
															<PretendardSemiBoldText
																size={13}
																lineHeight={19}
																color={colors.backgroundWhite}>
																{idx + 1}
															</PretendardSemiBoldText>
														</MarkerContainer>
														{/* <DashLine
														status={idx == value.length - 1 ? 'end' : 'center'}></DashLine> */}
													</DashLineContainer>
													<InsideGrayContainer
														onLongPress={() => {
															dispatch(
																modalSliceActions.setOpenModal({
																	modalTitle:
																		'편집 모드에서 여행 일정을 편집하시겠어요?',
																	modalFunction: () => {
																		setModify(true);
																	},
																}),
															);
														}}
														onPress={() => {
															moveRegion(idx, index);
														}}>
														<HStack justifyContent='space-between;'>
															<VStack>
																<PretendardVariableText
																	size={12}
																	lineHeight={18}
																	color={colors.Gray2}>
																	{categoryTitle[item.category]}{' '}
																	{Math.floor(((item.y ?? 0) * 30 + 360) / 60)}:
																	{String(((item.y ?? 0) * 30 + 360) % 60).padStart(
																		2,
																		'0',
																	)}{' '}
																	~{' '}
																	{Math.floor(
																		(((item.y ?? 0) + item.takenTime / 30) * 30 +
																			360) /
																			60,
																	) < 25 &&
																		Math.floor(
																			(((item.y ?? 0) + item.takenTime / 30) *
																				30 +
																				360) /
																				60,
																		) +
																			':' +
																			String(
																				(((item.y ?? 0) + item.takenTime / 30) *
																					30 +
																					360) %
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
																			index: idx,
																			day: index,
																			type: 'essential',
																		})
																	}>
																	<SvgTripleDot />
																</DotBox>
																{open.status &&
																	open.index == idx &&
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
																					openModal(item.x, idx);
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
															{/* {idx != 0 &&
															(item.category == 1 || item.category == 4 ? (
																<VStack gap={5}>
																	{!region[0].startsWith('해외') && (
																		<PrimaryButton
																			onPress={() => {
																				goNavigation(idx);
																			}}
																			label='길찾기'
																			textSize={12}
																			lineHeight={18}
																			width={widthPercentage(62)}
																			height={heightPercentage(22)}
																			backgroundColor={colors.Primary}
																			textColor={colors.Gray5}></PrimaryButton>
																	)}
																	<PrimaryButton
																		onPress={() => {
																			dispatch(
																				modalSliceActions.setOpenModal({
																					modalTitle: `변경하실 ${
																						item.category == 1
																							? '식당을'
																							: '숙소를'
																					} 추천해드릴까요?`,
																					modalTopText: '네, 추천해주세요',
																					modalBottomText:
																						'아니요, 직접 추가할게요',
																					modalFunction: () => {
																						item.category == 1
																							? restaurantRecommend({
																									value: item,
																									index: idx,
																									idx: index,
																							  })
																							: accommodationRecommend({
																									value: item,
																									index: idx,
																									idx: index,
																							  });
																					},
																					modalBottomFunctionUse: true,
																					modalBottomFunction: () => {
																						goSearchPlace({
																							index: index,
																							idx: idx,
																							category:
																								item.category == 1
																									? '식당'
																									: '숙소',
																						});
																					},
																				}),
																			);
																			// item.category == 1
																			// 	? restaurantRecommend({
																			// 			value: item,
																			// 			index: idx,
																			// 			idx: index,
																			// 	  })
																			// 	: accommodationRecommend({
																			// 			value: item,
																			// 			index: idx,
																			// 			idx: index,
																			// 	  });
																		}}
																		label={
																			item.category == 1 ? '식당변경' : '숙소변경'
																		}
																		textSize={12}
																		lineHeight={18}
																		width={widthPercentage(62)}
																		height={heightPercentage(22)}
																		backgroundColor={colors.Primary}
																		textColor={colors.Gray5}></PrimaryButton>
																</VStack>
															) : (
																!region[0].startsWith('해외') && (
																	<PrimaryButton
																		deco='z-index:1;'
																		onPress={() => {
																			goNavigation(idx);
																		}}
																		label='길찾기'
																		textSize={12}
																		lineHeight={18}
																		width={widthPercentage(62)}
																		height={heightPercentage(22)}
																		backgroundColor={colors.Primary}
																		textColor={colors.Gray5}></PrimaryButton>
																)
															))} */}
														</HStack>
													</InsideGrayContainer>
												</HStack>
												{modify && (
													<HStack
														gap={20}
														marginHorizon={widthPercentage(30)}
														marginVertical={10}>
														<SvgCarIcon />
														<PretendardSemiBoldText
															size={13}
															lineHeight={19}
															color={colors.Gray400}>
															1시간
														</PretendardSemiBoldText>
														<PlusBox
															onPress={() => {
																navigation.navigate('AddCategory', {
																	info: {
																		day: index,
																		index: idx + 1,
																		startTime: 9,
																	},
																});
															}}>
															<SVGPlus color={colors.Gray400} />
														</PlusBox>
													</HStack>
												)}
											</VStack>
										) : (
											<HStack key={idx}>
												<DashLineContainer justifyContent='start'>
													{item.category == 4 || item.category == 1 ? (
														<Image
															source={
																item.category == 4
																	? require('../../../../public/images/hotel.png')
																	: require('../../../../public/images/defalutFood.png')
															}
															style={{
																width: widthPercentage(30),
																height: widthPercentage(30),
																zIndex: 200,
															}}></Image>
													) : (
														<MarkerContainer
															backgroundColor={
																item.category == 4 ? colors.PointGreen1 : undefined
															}>
															<PretendardSemiBoldText
																size={13}
																lineHeight={19}
																color={colors.backgroundWhite}>
																{idx + 1}
															</PretendardSemiBoldText>
														</MarkerContainer>
													)}
													{/* <DashLine
														status={idx == value.length - 1 ? 'end' : 'center'}></DashLine> */}
												</DashLineContainer>
												<InsideGrayContainer backgroundColor={colors.backgroundWhite}>
													<InfoView
														navigation={navigation}
														test={item}
														index={idx}
														idx={index}
														modify={false}
														CancelModify={CancelModify}
													/>
												</InsideGrayContainer>
											</HStack>
										),
									)}
								</WhiteContainer>
							),
					)}
				</DayScrollViews>
			)}
		</>
	);
}

export default memo(Timetable);
const DayScrollViews = styled.View<{viewMap: boolean}>`
	width: ${widthPercentage(375)}px;
	margin-top: ${widthPercentage(20)}px;
	z-index: 0;
`;
const DayScrollView = styled(NestableScrollContainer)`
	width: ${widthPercentage(375)}px;
	height: ${heightPercentage(500)}px;
`;

export const InsideGrayContainer = styled.TouchableOpacity<{backgroundColor?: string}>`
	width: ${widthPercentage(262)}px;
	height: ${heightPercentage(66)}px;
	border-radius: 8px;
	background-color: ${props => props.backgroundColor ?? colors.backgroundGray};
	justify-content: center;
	padding-horizontal: ${widthPercentage(10)}px;
	margin-bottom: ${heightPercentage(10)}px;
	z-index: 0;
`;

const DragHstack = styled(HStack).attrs({as: Pressable})``;
export const PlusBox = styled.TouchableOpacity`
	width: ${widthPercentage(22)}px;
	height: ${widthPercentage(22)}px;
	border-radius: 7px;
	background-color: ${colors.backgroundWhite};
	border-color: #a3a1a1;
	border-width: 1px;
	justify-content: center;
	align-items: center;
`;
