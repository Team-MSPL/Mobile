import {Fragment, MutableRefObject, useRef, useState} from 'react';
import {GooglePlacesAutocomplete, GooglePlacesAutocompleteRef} from 'react-native-google-places-autocomplete';
import {useAppDispatch, useAppSelector} from '../../redux';
import {googleDetailApi, PlaceType, travelSliceActions} from '../../redux/travel-info/travel.slice';

import shortId from 'shortid';
import {GOOGLE_API_KEY} from '@env';
import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import {Divider, HStack, VStack, devicesWidth} from '../../utill/layout/layout';
import {Keyboard, TouchableOpacity} from 'react-native';
import {SvgLoginLogo} from '../../utill/svg/svg';
import CustomButton from '../../utill/component/custom-button';
import Icon from 'react-native-vector-icons/AntDesign';
export default function SearchPlace({navigation, route}: any) {
	const [select, setSelect] = useState(false);
	const IconElement = styled(Icon)``;
	const dispatch = useAppDispatch();
	const {Place, accommodations, essentialPlaces} = useAppSelector(state => state.travelSlice);
	const [placeState, setPlaceState] = useState<{
		name: string | undefined;
		lat: number | undefined;
		lng: number | undefined;
		photo: string;
		category: number;
		takenTime: number;
		formatted_address: string | undefined;
	} | null>();
	const SearchList = [
		{
			title: '방문 예정인 여행지를 등록해 주세요',
			subTitle: '여행지 검색',
			variable: essentialPlaces,
			function: travelSliceActions.enrollessentialPlaces,
		},
		{
			title: '예정된 숙소 정보를 등록해주세요',
			subTitle: '숙소 검색',
			variable: accommodations,
			function: travelSliceActions.enrollAccommodations,
		},
	];
	const autocompleteRef = useRef<GooglePlacesAutocompleteRef | null>();
	const addPlace = () => {
		let copy = [...SearchList[route.params.id].variable];
		route.params.id == 1
			? placeState && (copy[route.params.idx + 1] = placeState)
			: copy.push({
					...placeState,
					day: route.params.idx + 1,
					id: shortId.generate(),
					category: 5,
					takenTime: (timeValue + 1) * 60,
			  });
		dispatch(SearchList[route.params.id].function(copy));
		navigation.goBack();
	};
	const clearInput = () => {
		autocompleteRef.current?.setAddressText('');
	};
	const clearButton = () => (
		<SearchClearContainer>
			<TouchableOpacity onPress={clearInput}>
				<SearchClearButton>취소</SearchClearButton>
			</TouchableOpacity>
		</SearchClearContainer>
	);
	const clearPlace = () => {
		setPlaceState(null);
	};
	const selectTime = (e: number) => {
		setTimeValue(e);
		setAction(false);
	};
	const [action, setAction] = useState(false);
	const [timeValue, setTimeValue] = useState(0);
	return (
		<SearchPlaceContainer
			onPress={() => {
				Keyboard.dismiss();
			}}>
			<SearchPlaceText>{SearchList[route.params.id].title}</SearchPlaceText>
			<SearchPlaceSecondText>{SearchList[route.params.id].subTitle}</SearchPlaceSecondText>
			{placeState ? (
				<>
					<SearchPlaceElement>
						{placeState.photo != null ? (
							<SearchPlaceImage
								source={{
									uri: placeState.photo,
								}}
								alt='Place Image'
							/>
						) : (
							<DefalutLogoContainer>
								<SvgLoginLogo width={80} height={80} color='white' />
							</DefalutLogoContainer>
						)}

						<SearchTextContainer>
							<SearchPlaceElementText>{placeState.name}</SearchPlaceElementText>
							<SearchPlaceElementText>{placeState.formatted_address}</SearchPlaceElementText>
						</SearchTextContainer>
						<SearchClearContainer>
							<TouchableOpacity onPress={clearPlace}>
								<SearchClearButton>취소</SearchClearButton>
							</TouchableOpacity>
						</SearchClearContainer>
					</SearchPlaceElement>
					{route.params.id == 0 && (
						<Fragment>
							<Divider></Divider>
							<TimeAllContainer>
								<SearchPlaceSecondText>머무르는 시간</SearchPlaceSecondText>
								<TimeContainer
									onPress={() => {
										setAction(true);
									}}>
									{!action ? (
										<TimeHStack>
											<TimeText>{timeValue + 1} 시간</TimeText>
											<IconElement
												name={'down'}
												size={devicesWidth * 0.05}
												color={colors.selectButton}
											/>
										</TimeHStack>
									) : (
										<TimeSelectContainer>
											{[...Array(4)].map((time, number) => (
												<TimeContainer onPress={() => selectTime(number)} key={number}>
													<SearchPlaceSecondText>{number + 1} 시간</SearchPlaceSecondText>
												</TimeContainer>
											))}
										</TimeSelectContainer>
									)}
								</TimeContainer>
							</TimeAllContainer>
						</Fragment>
					)}

					<CustomButton label='추가하기' onPress={addPlace}></CustomButton>
				</>
			) : (
				<GooglePlacesAutocomplete
					placeholder='장소를 검색해보세요!'
					disableScroll={true}
					ref={autocompleteRef as MutableRefObject<GooglePlacesAutocompleteRef | null>}
					query={{
						key: GOOGLE_API_KEY,
						language: 'ko',
						components: 'country:kr',
					}}
					renderRightButton={clearButton}
					textInputProps={{placeholderTextColor: 'grey'}}
					styles={{
						textInputContainer: {
							borderWidth: 1,
							borderColor: colors.selectButton,
							borderRadius: 10,
							backgroundColor: colors.main,
						},
						textInput: {margin: 1, color: 'black', backgroundColor: colors.main},
						listView: {position: 'relative'},
					}}
					fetchDetails={true}
					onPress={async (data, details) => {
						const placeId = details?.place_id;
						const response = await dispatch(googleDetailApi({placeId: placeId}));
						let imageUrl;
						if (response.payload.result.photos) {
							const photoReference = response.payload.result?.photos[0]?.photo_reference;
							imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${GOOGLE_API_KEY}`;
						} else {
							imageUrl = null;
						}
						const datas = {
							...Place,
							name: details?.name,
							lat: details?.geometry.location.lat,
							lng: details?.geometry.location.lng,
							formatted_address: details?.formatted_address.replace('대한민국 ', ''),
							photo: imageUrl,
						};
						setPlaceState(datas);
						dispatch(travelSliceActions.enrollPlace(datas));
						setSelect(!select);
					}}
					onFail={error => console.log(error)}
					onNotFound={() => console.log('no results')}></GooglePlacesAutocomplete>
			)}
		</SearchPlaceContainer>
	);
}

const SearchPlaceElement = styled(HStack)`
	align-items: center;
	margin: 10px 0px 10px 0px;
	width: 100%;
`;

const SearchPlaceImage = styled.Image`
	width: 100px;
	height: 100px;
	border-radius: 10px;
`;
export const DefalutLogoContainer = styled.View`
	width: 100px;
	height: 100px;
	border-radius: 10px;
	background-color: ${colors.regionNormal};
	align-items: center;
	justify-content: center;
`;
const SearchPlaceContainer = styled.Pressable`
	width: 100%;
	padding: 10px;
	flex: 1;
	background-color: ${colors.main};
`;
const SearchPlaceText = styled.Text`
	font-size: 20px;
	font-weight: bold;
	color: black;
	margin: 20px 0px 70px 0px;
`;
const SearchPlaceSecondText = styled.Text`
	font-size: ${devicesWidth * 0.05}px;
	font-weight: bold;
	color: black;
	margin: 0px 0px 10px 0px;
`;
const SearchPlaceElementText = styled.Text`
	font-size: 15px;
	font-weight: bold;
	color: black;
	margin: 5px;
	flex-wrap: wrap;
`;

export const SearchClearButton = styled.Text`
	font-size: 17px;
	font-weight: bold;
	color: ${colors.selectButton};
`;
export const SearchClearContainer = styled.View`
	align-items: center;
	justify-content: center;
	margin: 0px 10px 0px 0px;
	width: 20%;
`;
const SearchTextContainer = styled(VStack)`
	width: 50%;
`;
const TimeContainer = styled.TouchableOpacity`
	padding: ${devicesWidth * 0.02}px;
	justify-content: center;
`;

const TimeSelectContainer = styled.View`
	padding: ${devicesWidth * 0.02}px;
	border-width: 1px;
	background-color: ${colors.main};
`;
const TimeText = styled.Text`
	font-size: ${devicesWidth * 0.05}px;
	font-weight: bold;
	color: ${colors.selectButton};
`;
const TimeHStack = styled(HStack)`
	border-bottom-color: ${colors.regionNormal};
	border-bottom-width: 1px;
`;
const TimeAllContainer = styled(HStack)`
	width: 100%;
	justify-content: space-between;
	align-items: flex-start;
`;
