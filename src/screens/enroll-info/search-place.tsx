import {useState} from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {useAppDispatch} from '../../redux';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import {Box} from 'native-base';
import {GOOGLE_API_KEY} from '@env';
export default function SearchPlace({navigation, route}: any) {
	const [select, setSelect] = useState(false);
	const dispatch = useAppDispatch();

	return (
		<Box p='5' bgColor='#EFFBFB' flex='1'>
			<GooglePlacesAutocomplete
				placeholder='장소를 검색해보세요!'
				query={{
					key: GOOGLE_API_KEY,
					language: 'ko',
					components: 'country:kr',
				}}
				fetchDetails={true}
				onPress={async (data, details) => {
					const placeId = details?.place_id;
					const response = await fetch(
						`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${GOOGLE_API_KEY}`,
					);
					const responseToJson = await response.json();
					let imageUrl;
					if (responseToJson.result.photos) {
						const photoReference = responseToJson.result?.photos[0]?.photo_reference;
						imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${GOOGLE_API_KEY}`;
					} else {
						imageUrl =
							'https://ssl.pstatic.net/melona/libs/1458/1458328/a3d169ecc295102274f4_20230718175149113.jpg';
					}
					const datas = {
						name: details?.name,
						lat: details?.geometry.location.lat,
						lng: details?.geometry.location.lng,
						imageUrl: imageUrl,
					};

					dispatch(travelSliceActions.enrollPlace(datas));
					setSelect(!select);
					navigation.goBack();
					route.params.id === 0
						? navigation.navigate('AddAccommodation', {idx: route.params.idx})
						: navigation.navigate('AddEssential', {idx: route.params.idx});
				}}
				onFail={error => console.log(error)}
				onNotFound={() => console.log('no results')}
				//keepResultsAfterBlur={true}
				//enablePoweredByContainer={false}
			></GooglePlacesAutocomplete>
		</Box>
	);
}
