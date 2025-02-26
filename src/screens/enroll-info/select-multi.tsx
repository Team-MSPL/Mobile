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
import {SVGPlus} from '../../utill/svg/svg';
import Stepper from '../../utill/component/enroll-info/stepper';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import RouteButton from '../../utill/component/route-button';

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
	};
	const deleteEssential = (e: EssentialPlaceType) => {
		const updatedPlaces = essentialPlaces.filter(item => item.id !== e.id);
		dispatch(travelSliceActions.enrollessentialPlaces(updatedPlaces));
	};
	return (
		<>
			<MainContainer>
				<BackgroundGray>
					<Stepper total={11} now={3}></Stepper>
					<StepText
						styleText='1.여행 계획을 알려주세요.'
						mainText='미리 정해놓은 장소가 있나요?'
						subText={`1일당 숙소는 1개, 여행지는 3개까지 추가할 수 있어요.\n마지막날은 숙소를 설정할 수 없어요.`}></StepText>
					<VStack>
						{[...Array(nDay + 1)].map((item, idx) => {
							const filteredPlaces = essentialPlaces.filter(place => place.day === idx + 1);

							return (
								<DayViewContainer key={idx}>
									<HStack>
										<PretendardSemiBoldText size={14} lineHeight={16.7} color={colors.PointYellow}>
											{'DAY' + (idx + 1)}
										</PretendardSemiBoldText>
										<PretendardSemiBoldText size={14} lineHeight={16.7} color={colors.Gray5}>
											{'   '}
											{day[idx].format('YY.MM.DD') + ' (' + weekdays[day[idx].days()] + ')'}
										</PretendardSemiBoldText>
									</HStack>
									<MultiAllContainer>
										<ElementContainer color={colors.backgroundGray} height={heightPercentage(43)}>
											<PretendardSemiBoldText size={14} lineHeight={16.7} color={colors.Gray2}>
												여행지
											</PretendardSemiBoldText>
											<SVGContainer
												disabled={filteredPlaces.length >= 3}
												onPress={() => {
													goSearchPlace({idx: idx, index: 0});
												}}
												color={filteredPlaces.length >= 3 ? colors.Gray1 : colors.PointYellow}>
												<SVGPlus
													width={widthPercentage(16)}
													height={widthPercentage(16)}
													color={filteredPlaces.length >= 3 ? colors.Gray2 : colors.Primary}
												/>
											</SVGContainer>
										</ElementContainer>
										{filteredPlaces.length != 0 && (
											<FlexWrap gap={10}>
												{filteredPlaces.map((data, index) => (
													<ElementContainer color={colors.backgroundGray} key={index}>
														<VStack width={widthPercentage(243)}>
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
														<DeleteContainer
															onPress={() => {
																deleteEssential(data);
															}}>
															<PretendardSemiBoldText
																size={12}
																lineHeight={18}
																color={colors.Gray5}>
																취소
															</PretendardSemiBoldText>
														</DeleteContainer>
													</ElementContainer>
												))}
											</FlexWrap>
										)}
									</MultiAllContainer>
									{idx != nDay && (
										<MultiAllContainer marginBottom={15}>
											<ElementContainer
												color={colors.backgroundGray}
												height={heightPercentage(43)}>
												<PretendardSemiBoldText
													size={14}
													lineHeight={16.7}
													color={colors.Gray2}>
													숙소
												</PretendardSemiBoldText>
												<SVGContainer
													disabled={accommodations[idx + 1].name != ''}
													onPress={() => {
														goSearchPlace({idx: idx, index: 1});
													}}
													color={
														accommodations[idx + 1].name ? colors.Gray1 : colors.PointYellow
													}>
													<SVGPlus
														width={widthPercentage(16)}
														height={widthPercentage(16)}
														color={
															accommodations[idx + 1].name ? colors.Gray2 : colors.Primary
														}
													/>
												</SVGContainer>
											</ElementContainer>
											{accommodations[idx + 1].name && (
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

													<DeleteContainer
														onPress={() => {
															deleteAccommodation(idx + 1);
														}}>
														<PretendardSemiBoldText
															size={12}
															lineHeight={18}
															color={colors.Gray5}>
															취소
														</PretendardSemiBoldText>
													</DeleteContainer>
												</ElementContainer>
											)}
										</MultiAllContainer>
									)}
								</DayViewContainer>
							);
						})}
					</VStack>
				</BackgroundGray>

				<MarginContainder></MarginContainder>
			</MainContainer>
			<RouteButton navigation={navigation} nextTitle='RecommendSelectWho'></RouteButton>
		</>
	);
}
export const MarginContainder = styled.View`
	margin: 0px 0px 130px 0px;
`;

export const DayViewContainer = styled.View`
	width: ${widthPercentage(327)}px;
	align-self: center;
	border-radius: 12px;
	background-color: ${colors.backgroundWhite};
	padding: 15px;
	gap: ${widthPercentage(8)}px;
`;

export const SVGContainer = styled.TouchableOpacity<{color: string}>`
	width: ${widthPercentage(20)}px;
	height: ${widthPercentage(20)}px;
	background-color: ${props => props.color};
	border-radius: 99px;
	align-items: center;
	justify-content: center;
`;
export const ElementContainer = styled.View<{color: string; height?: number; marginBottom?: number}>`
	border-radius: 8px;
	background-color: ${props => props.color};
	align-items: center;
	justify-content: space-between;
	padding: 0px ${widthPercentage(8)}px;
	gap: ${widthPercentage(4)}px;
	flex-direction: row;
	margin-right: ${widthPercentage(5)}px;
	margin-bottom: ${props => props.marginBottom ?? widthPercentage(5)}px;
	width: ${widthPercentage(300)}px;
	height: ${props => props.height + 'px' ?? 'auto'};
`;
const MultiAllContainer = styled.View<{marginBottom?: number}>`
	width: ${widthPercentage(300)}px;
	border-radius: 12px;
	background-color: ${colors.backgroundGray};
	gap: ${widthPercentage(3)}px;
`;
export const ButtonContainer = styled.View`
	width: ${devicesWidth}px;
	background-color: rgba(250, 250, 255, 0.8);
	position: absolute;
	bottom: 10px;
`;
export const DeleteContainer = styled.TouchableOpacity`
	width: ${widthPercentage(41)}px;
	height: ${heightPercentage(22)}px;
	border-radius: 99px;
	background-color: ${colors.Primary};
	align-items: center;
	justify-content: center;
`;
