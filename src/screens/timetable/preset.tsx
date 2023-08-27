import {Box, Center, ScrollView, Text, VStack} from 'native-base';
import {JSX, JSXElementConstructor, ReactElement, useEffect, useRef, useState} from 'react';
import MapView, {Marker, Polyline} from 'react-native-maps';
import {useAppDispatch, useAppSelector} from '../../redux';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {getTravelAi, travelSliceActions} from '../../redux/travel-info/travel.slice';
import CustomButton from '../../utill/component/custom-button';
import SelectButton from '../../utill/component/select-button';
import {cityViewList} from '../enroll-info/select-city';

export default function Preset({navigation}: any) {
	const {
		region,
		accommodations,
		nDay,
		cityIndex,
		essentialPlaces,
		tendency,
		timeLimitArray,
		transit,
		presetDatas,
		distance,
	} = useAppSelector(state => state.travelSlice);
	const {isLoading} = useAppSelector(state => state.loadingSlice);
	const dispatch = useAppDispatch();
	const [select, setSelect] = useState(0);
	const goNext = () => {
		dispatch(travelSliceActions.enrollTimetable(select));
		navigation.popToTop();
		navigation.navigate('Timetable');
	};
	let positions: {latitude: number; longitude: number}[] = [];

	const change = (idx: number) => {
		if (mapRef.current) {
			mapRef.current.animateToRegion(
				{
					latitude: centerLatitude,
					longitude: centerLongitude,
					latitudeDelta: deltaLatitude + 0.01,
					longitudeDelta: deltaLongitude + 0.01,
				},
				1000,
			); // 1000ms 동안 목표 지점으로 애니메이션 이동
		}
		setSelect(idx);
	};

	const mapRef = useRef<MapView>(null);

	const markers: ReactElement<any, string | JSXElementConstructor<any>> | JSX.Element[][] | null | undefined = [];
	const polylines:
		| string
		| number
		| boolean
		| JSX.Element[]
		| ReactElement<any, string | JSXElementConstructor<any>>
		| null
		| undefined = [];
	presetDatas[select].forEach((value, index) => {
		const polylineCoordinates = value.map(vvalue => ({
			latitude: vvalue.lat,
			longitude: vvalue.lng,
		}));
		value.map(vvalue =>
			positions.push({
				latitude: vvalue.lat,
				longitude: vvalue.lng,
			}),
		),
			markers.push(
				value.map((vvalue, iindex) => (
					<Marker
						key={`marker_${index}_${iindex}`}
						coordinate={{latitude: vvalue.lat, longitude: vvalue.lng}}
						title={vvalue.name}
					/>
				)),
			);

		polylines.push(
			<Polyline
				key={`polyline_${index}`}
				coordinates={polylineCoordinates}
				strokeColor={mapColor[index]}
				strokeWidth={5} // You can change the width of the line here
			/>,
		);
	});
	const minLatitude = Math.min(...positions.map(marker => marker.latitude));
	const maxLatitude = Math.max(...positions.map(marker => marker.latitude));
	const minLongitude = Math.min(...positions.map(marker => marker.longitude));
	const maxLongitude = Math.max(...positions.map(marker => marker.longitude));

	// 경계 상자의 중심 좌표 계산
	const centerLatitude = (maxLatitude + minLatitude) / 2;
	const centerLongitude = (maxLongitude + minLongitude) / 2;

	// 경계 상자의 너비와 높이 계산
	const deltaLatitude = maxLatitude - minLatitude;
	const deltaLongitude = maxLongitude - minLongitude;

	// 너비와 높이 중 큰 값을 기준으로 줌 레벨 계산
	const maxDelta = Math.max(deltaLatitude, deltaLongitude);
	const zoomLevel = Math.log2(360 / maxDelta) + 1;

	if (isLoading) {
		return (
			<Box>
				<Text>로딩중인데용?</Text>
			</Box>
		);
	}
	return (
		<ScrollView bgColor='#EFFBFB' p='2'>
			<VStack space='5'>
				<Center>
					<Text fontSize='xl' bold color='black'>
						아래의 여행 코스 중 하나를 골라주세요!
					</Text>
					<Text fontSize='md' color='grey'>
						마커를 눌러 관광지를 확인해보세요
					</Text>
				</Center>
				<MapView
					ref={mapRef}
					style={{width: '100%', height: 300}}
					//provider={PROVIDER_GOOGLE}
					showsMyLocationButton={true}
					region={{
						latitude: centerLatitude,
						longitude: centerLongitude,
						latitudeDelta: deltaLatitude + 0.03,
						longitudeDelta: deltaLongitude + 0.03,
					}}>
					{markers}
					{polylines}
				</MapView>
				<Box flexDir='row' flexWrap='wrap'>
					{presetDatas.map((item, idx) => (
						<SelectButton
							key={idx}
							label={idx + 1 + '번 후보'}
							bgColor={idx === select}
							onPress={() => change(idx)}></SelectButton>
					))}
				</Box>
				{presetDatas[select].map((vava, inin) => vava.map((qwe, asd) => <Text key={asd}>{qwe.name}</Text>))}

				<CustomButton label='다음 단계' onPress={goNext}></CustomButton>
			</VStack>
		</ScrollView>
	);
}

const mapColor = ['black', 'blue', 'red', 'orange', 'pink'];
