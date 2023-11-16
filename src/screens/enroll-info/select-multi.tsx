import {useState} from 'react';
import CustomButton from '../../utill/component/custom-button';
import {MainContainer, VStack, HStack, devicesWidth} from '../../utill/layout/layout';
import StepText from '../../utill/component/enroll-info/step-text';
import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import {useAppDispatch, useAppSelector} from '../../redux';
import {EssentialPlaceType, travelSliceActions} from '../../redux/travel-info/travel.slice';
import {Pressable} from 'react-native';
import {SvgCancel, SvgPlace, SvgHome} from '../../utill/svg/svg';

export default function SelectMulti({viewComponent, navigation, goNextStep}: any) {
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
		{title: '여행지 추가하기', logo: '2', function: goSearchPlace},
		{title: '숙소 추가하기', logo: '1', function: goSearchPlace},
	];
	const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
	const goNext = () => {
		navigation.navigate('SelectDistance');
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
				<StepText mainText='미리 정한 장소가 있나요?' subText='정해놓은 장소는 먼저 추가할 수 있어요.' />
				<VStack>
					{[...Array(nDay + 1)].map((item, idx) => {
						const filteredPlaces = essentialPlaces.filter(place => place.day === idx + 1);

						return (
							<DayViewContainer key={idx}>
								<HStack>
									<DayText>{'Day ' + (idx + 1)}</DayText>
									<DayInfoText>
										{day[idx].format('YYYY-MM-DD') + ',' + weekdays[day[idx].days()] + '요일'}
									</DayInfoText>
								</HStack>
								<HStack>
									{MultiViewList.map(
										(value, index) =>
											!(idx == nDay && index == 1) && (
												<ElementContainer
													key={index}
													onPress={() => {
														value.function({idx: idx, index: index});
													}}>
													<HStack>
														{index == 0 ? (
															<SvgPlace color='white' />
														) : (
															<SvgHome color='white' />
														)}
														<ElementText>
															{accommodations[idx + 1]?.name && index == 1
																? '숙소 변경하기'
																: value.title}
														</ElementText>
													</HStack>
												</ElementContainer>
											),
									)}
								</HStack>
								{accommodations[idx + 1].name && (
									<MultiAllContainer>
										<MultiText>숙소</MultiText>
										<MultiContainer>
											<SvgHome color={colors.selectButton} />
											<MultiElementText>{accommodations[idx + 1].name}</MultiElementText>
											<Pressable
												onPress={() => {
													deleteAccommodation(idx + 1);
												}}>
												<SvgCancel color={colors.selectButton} />
											</Pressable>
										</MultiContainer>
									</MultiAllContainer>
								)}
								{filteredPlaces.length != 0 && (
									<MultiAllContainer>
										<MultiText>여행지</MultiText>
										{filteredPlaces.map((data, index) => (
											<MultiContainer key={index}>
												<SvgPlace color={colors.selectButton} />
												<MultiElementText>{data.name}</MultiElementText>
												<Pressable
													onPress={() => {
														deleteEssential(data);
													}}>
													<SvgCancel color={colors.selectButton} />
												</Pressable>
											</MultiContainer>
										))}
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
					label={`다음 (${viewComponent + 1}/${regionRecommendFlag ? 3 : 5})`}
					onPress={goNextStep}></CustomButton>
			</ButtonContainer>
		</>
	);
}
export const MarginContainder = styled.View`
	margin: 0px 0px 130px 0px;
`;

export const DayViewContainer = styled.View`
	width: 100%;
	border-radius: 20px;
	border-width: 1px;
	border-color: ${colors.selectButton};
	padding: 15px;
	margin: 5px 0px 5px 0px;
`;

const DayText = styled.Text`
	font-size: 18px;
	font-weight: 500;
	color: ${colors.selectButton};
	margin: 0px 10px 0px 0px;
`;
const DayInfoText = styled.Text`
	font-size: 18px;
	font-weight: 500;
	color: black;
`;
const ElementContainer = styled.TouchableOpacity`
	width: 50%;
	border-radius: 10px;
	background-color: ${colors.selectButton};
	align-items: center;
	padding: 10px;
	margin: 10px 4px 10px 0px;
`;
const ElementText = styled.Text`
	color: white;
	font-size: 15px;
	font-weight: bold;
`;
const MultiAllContainer = styled.View`
	width: 100%;
	margin: 5px 0px 5px 0px;
`;
const MultiText = styled.Text`
	font-size: 15px;
	font-weight: 500;
	color: black;
`;
const MultiContainer = styled.View`
	border-width: 2px;
	border-radius: 10px;
	border-color: ${colors.selectButton};
	width: 60%;
	padding: 10px;
	justify-content: space-between;
	align-items: center;
	flex-direction: row;
	margin: 3px 0px 3px 0px;
	flex-wrap: wrap;
`;
const MultiElementText = styled.Text`
	font-size: 15px;
	font-weight: 500;
	color: ${colors.selectButton};
`;
export const ButtonContainer = styled.View`
	width: ${devicesWidth}px;
	background-color: rgba(250, 250, 255, 0.8);
	position: absolute;
	bottom: 0;
`;
