import {JSX, JSXElementConstructor, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import CustomButton from '../../utill/component/custom-button';
import {Text, Box, ScrollView, VStack, Center} from 'native-base';
import MapView, {Polyline, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {TouchableOpacity, Linking} from 'react-native';
import SelectButton from '../../utill/component/select-button';

export default function MapInfo({navigation}: any) {
	const {timetable} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const [select, setSelect] = useState(0);
	const a = useRef(false);
	const viewRef = useRef(0);
	const change = (idx: number) => {
		setSelect(idx);
	};
	const moveRegion = (e: number) => {
		console.log(timetable[select][e]);
		if (mapRef.current) {
			mapRef.current.animateToRegion(
				{
					latitude: timetable[select][e].lat, // 목표 지점의 위도
					longitude: timetable[select][e].lng, // 목표 지점의 경도
					latitudeDelta: 0.04,
					longitudeDelta: 0.04,
				},
				1000,
			); // 1000ms 동안 목표 지점으로 애니메이션 이동
		}
	};
	const goNavigation = (e: number) => {
		Linking.openURL(
			`nmap://route/car?slat=${timetable[select][e].lat}&slng=${timetable[select][e].lng}&sname=${
				timetable[select][e].name
			}&dlat=${timetable[select][e + 1].lat}&dlng=${timetable[select][e + 1].lng}&dname=${
				timetable[select][e + 1].name
			}&appname=com.example.myapp`,
		);
	};
	const mapRef = useRef<MapView>(null);
	const polylineCoordinates = timetable[select].map((item, value) => ({latitude: item.lat, longitude: item.lng}));
	const markers = timetable[select].map((value, idx) => (
		<Marker key={`marker_${idx}`} coordinate={{latitude: value.lat, longitude: value.lng}} title={value.name} />
	));
	const polylines = timetable[select].map((val, ind) => (
		<Polyline
			key={`polyline_${ind}`}
			coordinates={polylineCoordinates}
			strokeColor={'red'}
			strokeWidth={5} // You can change the width of the line here
		/>
	));

	const minLatitude = Math.min(...polylineCoordinates.map(marker => marker.latitude));
	const maxLatitude = Math.max(...polylineCoordinates.map(marker => marker.latitude));
	const minLongitude = Math.min(...polylineCoordinates.map(marker => marker.longitude));
	const maxLongitude = Math.max(...polylineCoordinates.map(marker => marker.longitude));

	// 경계 상자의 중심 좌표 계산
	const centerLatitude = (maxLatitude + minLatitude) / 2;
	const centerLongitude = (maxLongitude + minLongitude) / 2;

	// 경계 상자의 너비와 높이 계산
	const deltaLatitude = maxLatitude - minLatitude;
	const deltaLongitude = maxLongitude - minLongitude;

	// 너비와 높이 중 큰 값을 기준으로 줌 레벨 계산
	const maxDelta = Math.max(deltaLatitude, deltaLongitude);
	const zoomLevel = Math.log2(360 / maxDelta) + 1;

	useEffect(() => {
		for (let i = 0; i < timetable.length; i++) {
			if (timetable[i].length != 0) {
				a.current = true;
				setSelect(i);
				break;
			}
		}
		console.log(a.current, 'ㅋㅋ');
	}, []);
	if (polylineCoordinates.length == 0) {
		return (
			<Box>
				<Text>보여줄거 없음 ㅋ</Text>
			</Box>
		);
	}
	return (
		<ScrollView bgColor='#EFFBFB' px='2'>
			<VStack space='5'>
				<Box flexDir='row' flexWrap='wrap'>
					{timetable.map(
						(item, idx) =>
							item.length != 0 && (
								<SelectButton
									key={idx}
									label={idx + 1 + '일차요'}
									bgColor={idx === select}
									onPress={() => change(idx)}></SelectButton>
							),
					)}
				</Box>
				{timetable.map(
					(item, idx) =>
						select == idx && (
							<MapView
								ref={mapRef}
								provider={PROVIDER_GOOGLE}
								showsMyLocationButton={true}
								style={{width: '100%', height: 300}}
								showsUserLocation={true}
								region={{
									latitude: centerLatitude,
									longitude: centerLongitude,
									latitudeDelta: deltaLatitude + 0.03,
									longitudeDelta: deltaLongitude + 0.03,
								}}>
								{markers}
								{polylines}
							</MapView>
						),
				)}
				{/* {a.current && (
					<MapView
						ref={mapRef}
						style={{width: '100%', height: 300}}
						provider={PROVIDER_GOOGLE}
						showsMyLocationButton={true}
						region={{
							latitude: centerLatitude,
							longitude: centerLongitude,
							latitudeDelta: deltaLatitude + 0.01,
							longitudeDelta: deltaLongitude + 0.01,
						}}>
						{markers}
						{polylines}
					</MapView>
				)} */}
				{timetable[select].map((value, index) =>
					index != timetable[select].length - 1 ? (
						<Box key={index}>
							<TouchableOpacity
								onPress={() => {
									moveRegion(index);
								}}>
								<Text>{value.name}</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => {
									goNavigation(index);
								}}
								style={{marginTop: 20}}>
								<Text>이동</Text>
							</TouchableOpacity>
						</Box>
					) : (
						<Box key={index}>
							<TouchableOpacity
								onPress={() => {
									moveRegion(index);
								}}>
								<Text>{value.name}</Text>
							</TouchableOpacity>
						</Box>
					),
				)}
			</VStack>
		</ScrollView>
	);
}

const mapColor = ['black', 'blue', 'red', 'orange', 'pink'];
