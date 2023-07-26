import {JSX, JSXElementConstructor, ReactElement, ReactNode, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import CustomButton from '../../utill/component/custom-button';
import {Text, Box, ScrollView, VStack, Divider, Slider, Center} from 'native-base';
import MapView, {Polyline, Marker} from 'react-native-maps';
import SelectButton from '../../utill/component/select-button';

export default function Preset({navigation}: any) {
	const {distance} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const [select, setSelect] = useState(0);

	const goNext = () => {
		navigation.navigate('SelectTendency');
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
	dummyData[select].forEach((value, index) => {
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
						latitude: dummyData[select][0][0].lat,
						longitude: dummyData[select][0][0].lng,
						latitudeDelta: 1,
						longitudeDelta: 1,
					}}>
					{markers}
					{polylines}
				</MapView>
				{dummyData.map((item, idx) => (
					<SelectButton
						key={idx}
						label={idx}
						bgColor={idx === select}
						onPress={() => change(idx)}></SelectButton>
				))}

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
