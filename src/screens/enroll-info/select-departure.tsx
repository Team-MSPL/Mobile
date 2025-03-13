import StepText from '../../utill/component/enroll-info/step-text';
import Stepper from '../../utill/component/enroll-info/stepper';
import {BackgroundGray, HStack, PretendardBoldText, PretendardSemiBoldText, VStack} from '../../utill/layout/layout';
import TendencyButton from '../../utill/component/tendency-button';
import {useAppDispatch, useAppSelector} from '../../redux';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import {SelectButtonsContainer} from './region-recommend/select-who';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import RouteButton from '../../utill/component/route-button';
import {SvgAirPort, SvgTrain} from '../../utill/svg/svg';
import {colors} from '../../utill/colors';
import {GooglePlacesAutocomplete, GooglePlacesAutocompleteRef} from 'react-native-google-places-autocomplete';
import {GOOGLE_API_KEY} from '@env';
import {MutableRefObject, useRef} from 'react';

export default function SelectDeparture({navigation}: any) {
	const {bandwidth} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
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
		<BackgroundGray>
			<Stepper total={13} now={5}></Stepper>
			<StepText
				marginTop={heightPercentage(10)}
				styleText='1.여행 계획을 알려주세요.'
				mainText='여행을 시작하려는 장소가 있나요?'
				subText='선택하신 지역 근처의 공항과 기차역을 찾아봤어요.'></StepText>
			<GooglePlacesAutocomplete
				placeholder='검색어를 입력하세요.'
				disableScroll={true}
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
					listView: {width: widthPercentage(327)},
					textInput: {margin: 1, color: 'black', backgroundColor: colors.backgroundWhite},
					description: {color: 'black'},
				}}
				fetchDetails={true}
				onPress={async (data, details) => {
					// const placeId = details?.place_id;
					// const response = await dispatch(googleDetailApi({placeId: placeId}));
					// let imageUrl;
					// if (response.payload.result.photos) {
					// 	const photoReference = response.payload.result?.photos[0]?.photo_reference;
					// 	imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${GOOGLE_API_KEY}`;
					// } else {
					// 	imageUrl = null;
					// }
					// const datas = {
					// 	...Place,
					// 	name: details?.name,
					// 	lat: details?.geometry.location.lat,
					// 	lng: details?.geometry.location.lng,
					// 	formatted_address: details?.formatted_address.replace('대한민국 ', ''),
					// 	photo: imageUrl,
					// 	region:
					// 		regionOneList[details?.formatted_address.split(' ')[1]] +
					// 		' ' +
					// 		(regionList[details?.formatted_address.split(' ')[1]] ??
					// 			cityList[details?.formatted_address.split(' ')[2]]),
					// };
					// setPlaceState(datas);
					// dispatch(travelSliceActions.enrollPlace(datas));
					// setSelect(!select);
				}}
				onFail={error => console.log(error)}
				onNotFound={() => console.log('no results')}></GooglePlacesAutocomplete>

			{moveList.map((item, index) => {
				return (
					<VStack>
						<HStack gap={10}>
							{item.photo}
							<PretendardSemiBoldText size={20} lineHeight={24} color={colors.Black}>
								{item.name}
							</PretendardSemiBoldText>
						</HStack>
					</VStack>
				);
			})}
			<RouteButton nextText={'건너뛰기'} navigation={navigation} nextTitle='SelectMulti'></RouteButton>
		</BackgroundGray>
	);
}
