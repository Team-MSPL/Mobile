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
					//TODO 좀따 env로 빼기
					language: 'ko',
					components: 'country:kr',
				}}
				fetchDetails={true}
				onPress={(data, details) => {
					const datas = {
						name: details?.name,
						lat: details?.geometry.location.lat,
						lng: details?.geometry.location.lng,
					};

					dispatch(travelSliceActions.enrollPlace(datas));
					setSelect(!select);
					navigation.goBack();
					route.params.id === 0
						? navigation.navigate('AddAccommodation')
						: navigation.navigate('AddEssential');
				}}
				onFail={error => console.log(error)}
				onNotFound={() => console.log('no results')}
				//keepResultsAfterBlur={true}
				//enablePoweredByContainer={false}
			></GooglePlacesAutocomplete>
		</Box>
	);
}
