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
	const {
		region,
		departureSelected,
		country,
		cityIndex,
		cityDistance,
		departure,
		departureAirport,
		departureTrain,
		regionRecommendFlag,
	} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const handleNearBySearchApi = async () => {
		const e = await dispatch(
			handleNearBySearch({
				region: cityViewList[country][cityIndex].title + region[0],
				name: '공항',
			}),
		).unwrap();
		dispatch(
			travelSliceActions.updateFiled({
				field: 'departureAirport',
				value: {
					name: e.data?.name,
					lat: e.data?.geometry.location.lat,
					lng: e.data?.geometry.location.lng,
				},
			}),
		);
		const e2 = await dispatch(
			handleNearBySearch({
				region: cityViewList[country][cityIndex].title + region[0],
				name: '고속철도',
			}),
		).unwrap();
		dispatch(
			travelSliceActions.updateFiled({
				field: 'departureTrain',
				value: {
					name: e2.data?.name,
					lat: e2.data?.geometry.location.lat,
					lng: e2.data?.geometry.location.lng,
				},
			}),
		);
	};
	useEffect(() => {
		handleNearBySearchApi();
	}, [cityIndex]);
	const moveList = [
		{
			name: '공항',
			function: () => dispatch(travelSliceActions.enrollBandwidth(false)),
			photo: <SvgAirPort />,
			text: departureAirport,
			title: 'departureAirport',
		},
		{
			name: '기차역',
			function: () => dispatch(travelSliceActions.enrollBandwidth(true)),
			photo: <SvgTrain />,
			text: departureTrain,
			title: 'departureTrain',
		},
	];
	const autocompleteRef = useRef<GooglePlacesAutocompleteRef | null>();
	return (
		<DepartureBackground
			onPress={() => {
				Keyboard.dismiss();
			}}>
			<Stepper total={regionRecommendFlag ? 4 : 13} now={regionRecommendFlag ? 3 : 5}></Stepper>
			<StepText
				marginTop={heightPercentage(10)}
				styleText='1.여행 계획을 알려주세요.'
				mainText='여행을 시작하려는 장소가 있나요?'
				subText='선택하신 지역 근처의 공항과 기차역을 찾아봤어요.'></StepText>
			<AutoContainer height={departure.name != ''}>
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
				{departure.name != '' && (
					<TendencyButton
						marginBottom={0}
						bgColor={'departure' == departureSelected}
						label={departure.name}
						onPress={() => {
							dispatch(
								travelSliceActions.setDepartureSelected(
									'departure' == departureSelected ? '' : 'departure',
								),
							);
						}}></TendencyButton>
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
							marginBottom={10}
							bgColor={item.title == departureSelected}
							label={item.text.name == '' ? '주변에 없습니다' : item.text.name}
							key={index}
							disabled={item.text.name == ''}
							onPress={() => {
								dispatch(
									travelSliceActions.setDepartureSelected(
										departureSelected == item.title ? '' : item.title,
									),
								);
							}}></TendencyButton>
					</VStack>
				);
			})}
			<PretendardSemiBoldText size={12} lineHeight={18} color={colors.Gray2}>
				* 검색에 오차가 있을 수 있어요
			</PretendardSemiBoldText>
			<RouteButton
				nextText={departureSelected == '' ? '건너뛰기' : '다음'}
				navigation={navigation}
				nextTitle={regionRecommendFlag ? 'SelectDistance' : 'SelectMulti'}></RouteButton>
		</DepartureBackground>
	);
}

const DepartureBackground = styled(BackgroundGray).attrs({as: Pressable})``;
const AutoContainer = styled.View<{height: boolean}>`
	width: 100%;
	height: ${props => (props.height ? heightPercentage(202) : heightPercentage(152))}px;
	margin-bottom: ${heightPercentage(10)}px;
`;
