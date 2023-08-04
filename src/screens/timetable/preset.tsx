import {JSX, JSXElementConstructor, ReactElement, useEffect, useState, useRef} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import CustomButton from '../../utill/component/custom-button';
import {Text, Box, ScrollView, VStack, Center} from 'native-base';
import MapView, {Polyline, Marker} from 'react-native-maps';
import SelectButton from '../../utill/component/select-button';
import {localSearchAI, enoughPlace} from '../../ai/local_search_ai';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';

export default function Preset({navigation}: any) {
	const {
		region,
		accommodations,
		nDay,
		day,
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

	const getAi = async () => {
		try {
			const data = await localSearchAI({
				regionList: region,
				accomodationList: accommodations,
				selectList: tendency,
				essentialPlaceList: essentialPlaces,
				timeLimitArray: timeLimitArray,
				nDay: nDay + 1,
				transit: transit,
				distanceSensitivity: distance,
			});
			if (!enoughPlace) {
				console.log('관광지 부족');
			} else {
				console.log('다시다시');
				if (data) {
					dispatch(travelSliceActions.enrollPreset(data));
				}
			}
		} catch (error) {
			console.log(error);
		} finally {
			console.log('ㅇㅇㅂㅇㅂㅈㅈㄷ');
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	useEffect(() => {
		getAi();
	}, []);
	const goNext = () => {
		dispatch(travelSliceActions.enrollTimetable(select));
		navigation.popToTop();
		navigation.navigate('Timetable');
	};

	const change = (idx: number) => {
		if (mapRef.current) {
			mapRef.current.animateToRegion(
				{
					latitude: presetDatas[idx][0][0].lat, // 목표 지점의 위도
					longitude: presetDatas[idx][0][0].lng, // 목표 지점의 경도
					latitudeDelta: 0.6,
					longitudeDelta: 0.6,
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
					region={{
						latitude: presetDatas[select][0][0].lat,
						longitude: presetDatas[select][0][0].lng,
						latitudeDelta: 0.6,
						longitudeDelta: 0.6,
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
