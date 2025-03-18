import StepText from '../../utill/component/enroll-info/step-text';
import Stepper from '../../utill/component/enroll-info/stepper';
import {BackgroundGray, HStack, PretendardBoldText, PretendardSemiBoldText, VStack} from '../../utill/layout/layout';
import TendencyButton from '../../utill/component/tendency-button';
import {useAppDispatch, useAppSelector} from '../../redux';
import {handleNearBySearch, travelSliceActions} from '../../redux/travel-info/travel.slice';
import {SelectButtonsContainer} from './region-recommend/select-who';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import RouteButton from '../../utill/component/route-button';
import {SvgAirPort, SvgTrain} from '../../utill/svg/svg';
import {colors} from '../../utill/colors';
import {GooglePlacesAutocomplete, GooglePlacesAutocompleteRef} from 'react-native-google-places-autocomplete';
import {GOOGLE_API_KEY} from '@env';
import {MutableRefObject, useEffect, useRef, useState} from 'react';
import {Keyboard, Pressable} from 'react-native';
import styled from 'styled-components/native';
import {cityViewList} from '../../utill/component/enroll-info/city-list';

export default function SelectDeparture({navigation}: any) {
	const {bandwidth, country, cityIndex, cityDistance, departure} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();

	const handleNearBySearchApi = async () => {
		const e = await dispatch(
			handleNearBySearch({
				lat: cityViewList[country][cityIndex].sub[cityDistance[0]]?.lat,
				lng: cityViewList[country][cityIndex].sub[cityDistance[0]]?.lng,
				type: 'airport', //airport||train_station
			}),
		).unwrap();
		dispatch(
			travelSliceActions.setDeparture({
				search: false,
				name: e.data?.results[0].name,
				lat: e.data?.results[0].geometry.location.lat,
				lng: e.data?.results[0].geometry.location.lng,
			}),
		);
	};
	useEffect(() => {
		handleNearBySearchApi();
	}, []);
	const moveList = [
		{
			name: '공항',
			function: () => dispatch(travelSliceActions.enrollBandwidth(false)),
			photo: <SvgAirPort />,
		},
		{
			name: '기차역',
			function: () => dispatch(travelSliceActions.enrollBandwidth(true)),
			photo: <SvgTrain />,
		},
	];
	const autocompleteRef = useRef<GooglePlacesAutocompleteRef | null>();
	return (
		<DepartureBackground
			onPress={() => {
				Keyboard.dismiss();
			}}>
			<Stepper total={13} now={5}></Stepper>
			<StepText
				marginTop={heightPercentage(10)}
				styleText='1.여행 계획을 알려주세요.'
				mainText='여행을 시작하려는 장소가 있나요?'
				subText='선택하신 지역 근처의 공항과 기차역을 찾아봤어요.'></StepText>
			<AutoContainer height={departure.search && departure.name != ''}>
				<GooglePlacesAutocomplete
					placeholder='검색어를 입력하세요.'
					disableScroll={false}
					enablePoweredByContainer={false}
					ref={autocompleteRef as MutableRefObject<GooglePlacesAutocompleteRef | null>}
					query={{
						key: GOOGLE_API_KEY,
						language: 'ko',
					}}
					textInputProps={{placeholderTextColor: colors.Gray2}}
					styles={{
						container: {alignItems: 'center'},
						textInputContainer: {
							width: widthPercentage(327),
							height: heightPercentage(52),
							borderRadius: 8,
							backgroundColor: colors.backgroundWhite,
							alignItems: 'center',
						},
						listView: {width: widthPercentage(327), maxHeight: heightPercentage(100)},
						textInput: {margin: 1, color: 'black', backgroundColor: colors.backgroundWhite},
						description: {color: 'black'},
					}}
					fetchDetails={true}
					onPress={async (data, details) => {
						dispatch(
							travelSliceActions.setDeparture({
								search: true,
								name: details?.name,
								lat: details?.geometry.location.lat,
								lng: details?.geometry.location.lng,
							}),
						);
					}}
					onFail={error => console.log(error)}
					onNotFound={() => console.log('no results')}></GooglePlacesAutocomplete>
				{departure.search && departure.name != '' && (
					<TendencyButton
						marginBottom={0}
						bgColor={false}
						label={departure.name}
						onPress={() => {}}></TendencyButton>
				)}
			</AutoContainer>
			{moveList.map((item, index) => {
				return (
					<VStack gap={5}>
						<HStack gap={10}>
							{item.photo}
							<PretendardSemiBoldText size={20} lineHeight={24} color={colors.Black}>
								{item.name}
							</PretendardSemiBoldText>
						</HStack>
						<TendencyButton
							marginBottom={0}
							bgColor={false}
							label={'qwe'}
							key={index}
							onPress={() => {}}></TendencyButton>
					</VStack>
				);
			})}
			<RouteButton nextText={'건너뛰기'} navigation={navigation} nextTitle='SelectMulti'></RouteButton>
		</DepartureBackground>
	);
}

const DepartureBackground = styled(BackgroundGray).attrs({as: Pressable})``;
const AutoContainer = styled.View<{height: boolean}>`
	width: 100%;
	height: ${props => (props.height ? heightPercentage(202) : heightPercentage(152))}px;
`;
