import {useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../redux';
import CustomButton from '../../../utill/component/custom-button';
import {
	regionRecommendSliceActions,
	reverseGeocoding,
	geocoding,
} from '../../../redux/travel-info/region-recommend.slice';
import Geolocation from 'react-native-geolocation-service';
import {Platform, TouchableOpacity, PermissionsAndroid} from 'react-native';
import {MainContainer, Center, Divider, MainText, HStack} from '../../../utill/layout/layout';

import Slider from '@react-native-community/slider';
import StepText from '../../../utill/component/enroll-info/step-text';
import {LoadingSliceActions} from '../../../redux/loading/loading.slice';
import {DistanceExplain} from '../select-distance';
import styled from 'styled-components/native';
import {colors} from '../../../utill/colors';
import {modalSliceActions} from '../../../redux/modal/modalSlice';
export default function SelectDistance({navigation}: any) {
	const dispatch = useAppDispatch();
	const [range, setRange] = useState(5);
	const [geoInfo, setGeoInfo] = useState({lat: 0, lng: 0, name: ''});

	const checkDistance = () => {
		geoInfo.name == ''
			? dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '위치정보',
						modalSubTitle: '현재 위치가 설정되지 않아 위치기반 추천이 어렵습니다. 그래도 진행하시겠습니까?',
						modalLeft: true,
						modalFunction: goNext,
					}),
			  )
			: goNext();
	};
	const goNext = () => {
		const data = {distance: range, lat: geoInfo.lat, lng: geoInfo.lng};
		dispatch(regionRecommendSliceActions.enrollDistanceAndLatLng(data));
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
			dispatch(LoadingSliceActions.onLoading());
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
							dispatch(LoadingSliceActions.offLoading());
						},
						error => {
							// See error code charts below.
							dispatch(LoadingSliceActions.offLoading());
							console.log(error.code, error.message);
						},
						{enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
					);
				}
			});
		} catch (err) {
			console.log('에러요', err);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	return (
		<MainContainer>
			<StepText mainText='지역 추천 반경 설정' subText='Ai는 입력된 값을 통해 지역 코스를 추천해드려요' />
			<DistanceCenter>
				<DistanceText>{range}</DistanceText>
				<Slider
					style={{width: '100%', height: 40}}
					minimumValue={1}
					maximumValue={10}
					minimumTrackTintColor='#123123'
					maximumTrackTintColor='#000000'
					value={range}
					step={1}
					onValueChange={item => {
						setRange(item);
					}}
				/>
				<DistanceSpace>
					<DistanceExplain>내 근처</DistanceExplain>
					<DistanceExplain>한국 전체</DistanceExplain>
				</DistanceSpace>
			</DistanceCenter>
			<DistanceDivider />
			<StepText mainText='내 위치 정보' subText='내 위치를 기준으로 추천을 진행해요' />
			<Center>
				<GetContainer onPress={goReverseGeocoding}>
					<GetContainerText>위치정보 받아오기</GetContainerText>
				</GetContainer>
				<GetText>{geoInfo.name}</GetText>
			</Center>
			<DistanceDivider />

			<CustomButton label='다음 단계' onPress={checkDistance}></CustomButton>
		</MainContainer>
	);
}
const DistanceDivider = styled(Divider)`
	background-color: ${colors.regionNormal};
`;
const DistanceCenter = styled(Center)`
	margin: 20px 0px 20px 0px;
`;
const DistanceText = styled(MainText)`
	font-size: 14px;
	margin: 10px 0px 10px 0px;
`;
const GetContainer = styled.TouchableOpacity`
	padding: 10px;
	border-radius: 10px;
	align-items: center;
	background-color: ${colors.selectButton};
`;
const GetContainerText = styled.Text`
	font-size: 15px;
	font-weight: bold;
	color: white;
`;
const GetText = styled.Text`
	font-size: 15px;
	font-weight: bold;
	color: black;
	margin: 10px 0px 0px 0px;
`;
const DistanceSpace = styled.View`
	width: 100%;
	flex-direction: row;
	justify-content: space-between;
`;
