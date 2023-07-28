import {JSX, JSXElementConstructor, ReactElement, useEffect, useState} from 'react';
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
				if (data) {
					dispatch(travelSliceActions.enrollPreset(data));
				}
			}
		} catch {
		} finally {
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
		setSelect(idx);
	};

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
					style={{width: '100%', height: 300}}
					region={{
						latitude: presetDatas[select][0][0].lat,
						longitude: presetDatas[select][0][0].lng,
						latitudeDelta: 1,
						longitudeDelta: 1,
					}}>
					{markers}
					{polylines}
				</MapView>
				<Box flexDir='row' flexWrap='wrap'>
					{presetDatas.map((item, idx) => (
						<SelectButton
							key={idx}
							label={idx + 1 + '일차'}
							bgColor={idx === select}
							onPress={() => change(idx)}></SelectButton>
					))}
				</Box>
				{presetDatas[select].map((vava, inin) => vava.map((qwe, asd) => <Text>{qwe.name}</Text>))}

				<CustomButton label='다음 단계' onPress={goNext}></CustomButton>
			</VStack>
		</ScrollView>
	);
}

const mapColor = ['black', 'blue', 'red', 'orange', 'pink'];

const dummyData = [
	[
		[
			{category: 5, lat: 35.51243, lng: 127.5436, name: '필수여행지1', takenTime: 60},
			{category: 5, lat: 35.53243, lng: 127.54364, name: '필수여행지1', takenTime: 60},
			{category: 5, lat: 35.53424, lng: 127.43221, name: '필수여행지1', takenTime: 60},
			{category: 5, lat: 35.65644, lng: 127.53243, name: '필수여행지1', takenTime: 60},
		],
		[
			{category: 5, lat: 35.22211, lng: 127.532332, name: '필수여행지1', takenTime: 60},
			{category: 5, lat: 35.12312, lng: 127.534242, name: '필수여행지1', takenTime: 60},
			{category: 5, lat: 35.12221, lng: 127.6234, name: '필수여행지1', takenTime: 60},
			{category: 5, lat: 35.65644, lng: 127.53243, name: '필수여행지1', takenTime: 60},
		],
		[
			{category: 5, lat: 35.51211, lng: 127.5436, name: '필수여행지1', takenTime: 60},
			{category: 5, lat: 35.53212, lng: 127.54364, name: '필수여행지1', takenTime: 60},
			{category: 5, lat: 35.53413, lng: 127.43221, name: '필수여행지1', takenTime: 60},
			{category: 5, lat: 35.65614, lng: 127.53243, name: '필수여행지1', takenTime: 60},
		],
		[
			{category: 5, lat: 35.51215, lng: 127.5436, name: '필수여행지1', takenTime: 60},
			{category: 5, lat: 35.3216, lng: 127.54364, name: '필수여행지1', takenTime: 60},
			{category: 5, lat: 35.5417, lng: 127.43221, name: '필수여행지1', takenTime: 60},
			{category: 5, lat: 35.65618, lng: 127.53243, name: '필수여행지1', takenTime: 60},
		],
		[
			{category: 5, lat: 35.1219, lng: 127.5436, name: '필수여행지1', takenTime: 60},
			{category: 5, lat: 35.5322, lng: 127.54364, name: '필수여행지1', takenTime: 60},
			{category: 5, lat: 35.53421, lng: 127.43221, name: '필수여행지1', takenTime: 60},
			{category: 5, lat: 35.5622, lng: 127.53243, name: '필수여행지1', takenTime: 60},
		],
	],
	[
		[
			{category: 5, lat: 36.51243, lng: 127.5436, name: '필수여행지1', takenTime: 60},
			{category: 5, lat: 35.53243, lng: 127.54364, name: '필수여행지1', takenTime: 60},
			{category: 5, lat: 35.53424, lng: 127.43221, name: '필수여행지1', takenTime: 60},
			{category: 5, lat: 35.65644, lng: 127.53243, name: '필수여행지1', takenTime: 60},
		],
		[
			{category: 5, lat: 35.22211, lng: 127.532332, name: '필수여행지1', takenTime: 60},
			{category: 5, lat: 35.12312, lng: 127.534242, name: '필수여행지1', takenTime: 60},
			{category: 5, lat: 35.12221, lng: 127.6234, name: '필수여행지1', takenTime: 60},
			{category: 5, lat: 35.65644, lng: 127.53243, name: '필수여행지1', takenTime: 60},
		],
		[
			{category: 5, lat: 35.51243, lng: 127.5436, name: '필수여행지1', takenTime: 60},
			{category: 5, lat: 35.53243, lng: 127.54364, name: '필수여행지1', takenTime: 60},
			{category: 5, lat: 35.53424, lng: 127.43221, name: '필수여행지1', takenTime: 60},
			{category: 5, lat: 35.65644, lng: 127.53243, name: '필수여행지1', takenTime: 60},
		],
		[
			{category: 5, lat: 35.51243, lng: 127.5436, name: '필수여행지1', takenTime: 60},
			{category: 5, lat: 35.53243, lng: 127.54364, name: '필수여행지1', takenTime: 60},
			{category: 5, lat: 35.53424, lng: 127.43221, name: '필수여행지1', takenTime: 60},
			{category: 5, lat: 35.65644, lng: 127.53243, name: '필수여행지1', takenTime: 60},
		],
		[
			{category: 5, lat: 35.51243, lng: 127.5436, name: '필수여행지1', takenTime: 60},
			{category: 5, lat: 35.53243, lng: 127.54364, name: '필수여행지1', takenTime: 60},
			{category: 5, lat: 35.53424, lng: 127.43221, name: '필수여행지1', takenTime: 60},
			{category: 5, lat: 35.65644, lng: 127.53243, name: '필수여행지1', takenTime: 60},
		],
	],
];
