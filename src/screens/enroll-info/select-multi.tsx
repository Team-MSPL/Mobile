import {useState} from 'react';
import CustomButton from '../../utill/component/custom-button';
import {MainContainer, VStack, HStack, devicesWidth, PretendardSemiBold, FlexWrap} from '../../utill/layout/layout';
import StepText from '../../utill/component/enroll-info/step-text';
import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import {useAppDispatch, useAppSelector} from '../../redux';
import {EssentialPlaceType, travelSliceActions} from '../../redux/travel-info/travel.slice';
import {SVGPlus} from '../../utill/svg/svg';
import Stepper from '../../utill/component/enroll-info/stepper';
import {fontPercentage, heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';

export default function SelectMulti({navigation}: any) {
	const [accommodation, setAccommodation] = useState(false);
	const [essential, setEssential] = useState(false);
	const {nDay, day, accommodations, essentialPlaces, regionRecommendFlag} = useAppSelector(
		state => state.travelSlice,
	);
	const dispatch = useAppDispatch();
	const goSearchPlace = (data: {idx: number; index: number}) => {
		console.log(navigation);
		navigation.navigate('SearchPlace', {id: data.index, idx: data.idx});
	};
	const MultiViewList = [
		{title: '여행지 추가', logo: '2', function: goSearchPlace},
		{title: '숙소 추가', logo: '1', function: goSearchPlace},
	];
	const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
	const goNext = () => {
		navigation.navigate('RecommendSelectWho');
	};

	const openAccommodation = () => {
		setAccommodation(!accommodation);
	};
	const deleteAccommodation = (e: number) => {
		let copy = [...accommodations];
		copy[e] = {name: '', lat: 0, lng: 0, category: 4, takenTime: 30, photo: ''};
		dispatch(travelSliceActions.enrollAccommodations(copy));
	};
	const deleteEssential = (e: EssentialPlaceType) => {
		const updatedPlaces = essentialPlaces.filter(item => item.id !== e.id);
		dispatch(travelSliceActions.enrollessentialPlaces(updatedPlaces));
	};
	const openEssential = () => {
		setEssential(!essential);
	};
	return (
		<>
			<MainContainer>
				<Stepper total={11} now={3}></Stepper>
				<StepText
					styleText='1.여행 계획을 알려주세요.'
					mainText='미리 정해놓은 장소가 있나요?'
					subText='일정에 포함시키고 싶은 곳들을 추가해주세요.'></StepText>
				<VStack>
					{[...Array(nDay + 1)].map((item, idx) => {
						const filteredPlaces = essentialPlaces.filter(place => place.day === idx + 1);

						return (
							<DayViewContainer key={idx}>
								<HStack>
									<DayText>{'DAY' + (idx + 1)}</DayText>
									<DayInfoText>
										{'   '}
										{day[idx].format('YY.MM.DD') + ' (' + weekdays[day[idx].days()] + ')'}
									</DayInfoText>
								</HStack>
								<HStack>
									{MultiViewList.map(
										(value, index) =>
											!(idx == nDay && index == 1) && (
												<ElementContainer
													color={colors.PointYellow}
													key={index}
													onPress={() => {
														value.function({idx: idx, index: index});
													}}>
													<ElementText>
														{accommodations[idx + 1]?.name && index == 1
															? '숙소 변경'
															: value.title}
													</ElementText>
													<SVGPlus color={colors.Primary} />
												</ElementContainer>
											),
									)}
								</HStack>
								{filteredPlaces.length != 0 && (
									<MultiAllContainer>
										<MultiText>여행지</MultiText>
										<FlexWrap>
											{filteredPlaces.map((data, index) => (
												<ElementContainer
													onPress={() => {
														deleteEssential(data);
													}}
													color={colors.Gray5}
													key={index}>
													<ElementText>{data.name}</ElementText>
													<SVGPlus color={colors.Primary} rotate={45} />
												</ElementContainer>
											))}
										</FlexWrap>
									</MultiAllContainer>
								)}
								{accommodations[idx + 1].name && (
									<MultiAllContainer>
										<MultiText>숙소</MultiText>
										<FlexWrap>
											<ElementContainer
												onPress={() => {
													deleteAccommodation(idx + 1);
												}}
												color={colors.Gray5}>
												<ElementText>{accommodations[idx + 1].name}</ElementText>
												<SVGPlus color={colors.Primary} rotate={45} />
											</ElementContainer>
										</FlexWrap>
									</MultiAllContainer>
								)}
							</DayViewContainer>
						);
					})}
				</VStack>

				<MarginContainder></MarginContainder>
			</MainContainer>
			<ButtonContainer>
				<CustomButton
					label={`${
						accommodations.find(value => value.name != '') || essentialPlaces.length != 0
							? '다음'
							: '건너뛰기'
					}`}
					onPress={goNext}></CustomButton>
			</ButtonContainer>
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
	margin-top: ${heightPercentage(12)}px;
	gap: ${widthPercentage(8)}px;
`;

const DayText = styled(PretendardSemiBold)`
	font-size: ${fontPercentage(14)}px;
	color: ${colors.PointYellow};
	line-height: ${heightPercentage(16.8)}px;
`;
const DayInfoText = styled(DayText)`
	color: ${colors.Gray5};
`;
const ElementContainer = styled.TouchableOpacity<{color: string}>`
	border-radius: 99px;
	background-color: ${props => props.color};
	align-items: center;
	padding: ${widthPercentage(5)}px ${widthPercentage(8)}px;
	gap: ${widthPercentage(4)}px;
	flex-direction: row;
	margin-right: ${widthPercentage(5)}px;
	margin-bottom: ${widthPercentage(5)}px;
`;
const ElementText = styled.Text`
	color: white;
	font-size: 15px;
	font-weight: bold;
`;
const MultiAllContainer = styled.View`
	width: ${widthPercentage(300)}px;
	border-radius: 12px;
	background-color: ${colors.backgroundGray};
	padding: ${widthPercentage(11)}px ${widthPercentage(15)}px;
	gap: ${widthPercentage(3)}px;
`;
const MultiText = styled(PretendardSemiBold)`
	font-size: ${fontPercentage(14)}px;
	color: ${colors.Gray5};
`;
export const ButtonContainer = styled.View`
	width: ${devicesWidth}px;
	background-color: rgba(250, 250, 255, 0.8);
	position: absolute;
	bottom: 0;
`;
