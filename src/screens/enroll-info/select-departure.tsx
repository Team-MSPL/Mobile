import StepText from '../../utill/component/enroll-info/step-text';
import Stepper from '../../utill/component/enroll-info/stepper';
import {
	BackgroundGray,
	BackgroundGrayScrollView,
	HStack,
	PretendardBoldText,
	PretendardSemiBoldText,
	VStack,
} from '../../utill/layout/layout';
import TendencyButton from '../../utill/component/tendency-button';
import {useAppDispatch, useAppSelector} from '../../redux';
import {handleNearBySearch, travelSliceActions} from '../../redux/travel-info/travel.slice';
import {SelectButtonsContainer} from './region-recommend/select-who';
import {fontPercentage, heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import RouteButton from '../../utill/component/route-button';
import {SvgAirPort, SVGSearch, SvgTrain} from '../../utill/svg/svg';
import {colors} from '../../utill/colors';
import {GooglePlacesAutocomplete, GooglePlacesAutocompleteRef} from 'react-native-google-places-autocomplete';
import {GOOGLE_API_KEY} from '@env';
import {MutableRefObject, useEffect, useRef, useState} from 'react';
import {Keyboard, Pressable} from 'react-native';
import styled from 'styled-components/native';
import {cityViewList} from '../../utill/component/enroll-info/city-list';
import {ButtonContainer} from './select-multi';

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
		makeMode,
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
		<>
			<DepartureBackground
				onPress={() => {
					Keyboard.dismiss();
				}}>
				<Stepper total={regionRecommendFlag ? 4 : 13} now={regionRecommendFlag ? 3 : 5}></Stepper>
				<StepText
					marginTop={heightPercentage(10)}
					styleText='1.여행 계획을 알려주세요.'
					mainText='여행 출발지는 어디인가요?'
					subText='선택하신 지역 근처의 공항과 기차역을 찾아봤어요.'></StepText>
				<AutoContainer height={departure.name != ''}>
					<GooglePlacesAutocomplete
						placeholder='검색어를 입력하세요.'
						disableScroll={false}
						keepResultsAfterBlur
						enablePoweredByContainer={false}
						ref={autocompleteRef as MutableRefObject<GooglePlacesAutocompleteRef | null>}
						query={{
							key: GOOGLE_API_KEY,
							language: 'ko',
						}}
						renderLeftButton={() => {
							return (
								<SVGSearch
									width={widthPercentage(20)}
									height={widthPercentage(20)}
									color={colors.Primary}
								/>
							);
						}}
						textInputProps={{placeholderTextColor: colors.Gray2, allowFontScaling: false}}
						styles={{
							container: {alignItems: 'center'},
							textInputContainer: {
								width: widthPercentage(327),
								height: widthPercentage(52),
								borderRadius: 99,
								backgroundColor: colors.backgroundWhite,
								alignItems: 'center',
								borderWidth: 1,
								borderColor: colors.Primary,
								paddingLeft: 20,
							},
							listView: {width: widthPercentage(327), maxHeight: heightPercentage(100), zIndex: 1000},
							textInput: {
								color: 'black',

								backgroundColor: 'transparent',
								flex: 0.9,
								fontSize: fontPercentage(18),
							},
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
							dispatch(
								travelSliceActions.setDepartureSelected(
									'departure' == departureSelected ? '' : 'departure',
								),
							);
						}}
						onFail={error => console.log(error)}
						onNotFound={() => console.log('no results')}></GooglePlacesAutocomplete>
					{departure.name != '' && (
						<TendencyButton
							marginBottom={10}
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
						<VStack gap={20} deco={`margin-bottom:${widthPercentage(10)}`}>
							<HStack gap={10}>
								{item.photo}
								<PretendardSemiBoldText size={20} lineHeight={24} color={colors.Black}>
									{item.name}
								</PretendardSemiBoldText>
							</HStack>
							<TendencyButton
								marginBottom={10}
								bgColor={item.title == departureSelected}
								label={
									item.text.name == ''
										? `선택하신 지역 근처에서${item.name}을 찾지 못했어요 `
										: item.text.name
								}
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
				<PretendardSemiBoldText size={12} lineHeight={18} color={colors.Gray2} deco={'margin-bottom:70px;'}>
					* 검색에 오차가 있을 수 있어요
				</PretendardSemiBoldText>
			</DepartureBackground>
			<ButtonContainer>
				<RouteButton
					nextText={departureSelected == '' ? '건너뛰기' : '다음'}
					navigation={navigation}
					nextTitle={
						regionRecommendFlag
							? 'SelectDistance'
							: makeMode == 'planner'
							? 'RecommendSelectWho'
							: 'SelectMulti'
					}></RouteButton>
			</ButtonContainer>
		</>
	);
}

const DepartureBackground = styled(BackgroundGrayScrollView)``;
const AutoContainer = styled.View<{height: boolean}>`
	width: 100%;
	height: ${props => (props.height ? heightPercentage(202) : heightPercentage(152))}px;
	margin-bottom: ${heightPercentage(10)}px;
	margin-top: ${widthPercentage(20)}px;
`;
