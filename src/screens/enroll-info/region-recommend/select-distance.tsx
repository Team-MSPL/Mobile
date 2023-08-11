import {useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../redux';
import CustomButton from '../../../utill/component/custom-button';
import {Text, Box, ScrollView, VStack, Divider, Slider, Center} from 'native-base';
import {
	RegionRecommendSliceActions,
	reverseGeocoding,
	geocoding,
} from '../../../redux/travel-info/region-recommend.slice';
import Geolocation from 'react-native-geolocation-service';
import {Platform, TouchableOpacity, PermissionsAndroid} from 'react-native';
export default function SelectDistance({navigation}: any) {
	const dispatch = useAppDispatch();
	const [range, setRange] = useState(5);
	const [geoInfo, setGeoInfo] = useState({lat: 0, lng: 0, name: ''});

	const goNext = () => {
		const data = {distance: range, lat: geoInfo.lat, lng: geoInfo.lng};
		dispatch(RegionRecommendSliceActions.enrollDistanceAndLatLng(data));
		navigation.navigate('RegionSelectPopularity');
	};
	const requestPermission = async () => {
		try {
			if (Platform.OS === 'ios') {
				return await Geolocation.requestAuthorization('always');
			}
			// 안드로이드 위치 정보 수집 권한 요청
			if (Platform.OS === 'android') {
				return await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
			}
		} catch (e) {
			console.log(e);
		}
	};
	const goReverseGeocoding = async () => {
		// const a = await dispatch(geocoding({region: '김해시'})).unwrap();
		// console.log(a.results);
		try {
			requestPermission().then(result => {
				if (result === 'granted') {
					Geolocation.getCurrentPosition(
						async position => {
							const {latitude, longitude} = position.coords;
							const latlng = latitude + ',' + longitude;
							const result = await dispatch(reverseGeocoding({latlng: latlng})).unwrap();
							const latlngData = {
								lat: result.results[0].geometry.location.lat,
								lng: result.results[0].geometry.location.lng,
								name: result.results[0].formatted_address,
							};
							setGeoInfo(latlngData);
						},
						error => {
							// See error code charts below.
							console.log(error.code, error.message);
						},
						{enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
					);
				}
			});
		} catch (err) {
			console.log('에러요', err);
		}
	};
	return (
		<ScrollView bgColor='#EFFBFB' p='2'>
			<VStack space='5'>
				<Text>가고자하는 범위</Text>
				<Divider my='1' />

				<Text>ㅇㄷ서 출발함?</Text>
				<TouchableOpacity onPress={goReverseGeocoding}>
					<Text>내 위치</Text>
				</TouchableOpacity>
				<Text>{geoInfo.name}</Text>
				<Divider my='1' />
				<Text fontSize='md' color='grey'>
					거리 민감도가 높아질수록 멀리가도 ㄱㅊ
				</Text>
				<Text>{range}</Text>
				<Center>
					<Slider
						w='4/5'
						defaultValue={5}
						minValue={0}
						maxValue={10}
						step={1}
						onChange={item => {
							setRange(item);
						}}>
						<Slider.Track>
							<Slider.FilledTrack />
						</Slider.Track>
						<Slider.Thumb />
					</Slider>
				</Center>

				<CustomButton label='다음 단계' onPress={goNext}></CustomButton>
			</VStack>
		</ScrollView>
	);
}
