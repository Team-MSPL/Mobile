import {useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {travelSliceActions} from '../../../redux/travel-info/travel.slice';
import CustomButton from '../../../utill/component/custom-button';
import {Text, Box, ScrollView, VStack, Divider, Slider, Center} from 'native-base';
import {Platform, TouchableOpacity, PermissionsAndroid} from 'react-native';
import {cityViewList} from '../select-city';
export default function ViewResult({navigation}: any) {
	const dispatch = useAppDispatch();
	const [range, setRange] = useState(5);

	const goEnrollInfo = (e: string) => {
		let region: string[] = [];
		let city = '';
		if (e.includes(' ')) {
			region = e.split(' ');
		} else {
			region = [e, '전체'];
		}
		const cityIndex = cityViewList.find(city => city.title == region[0])?.id;
		console.log(cityIndex, region[1]);
		//dispatch(travelSliceActions.selectRegion(['전체']));

		navigation.navigate('SelectDay');
	};

	return (
		<ScrollView bgColor='#EFFBFB' p='2'>
			<VStack space='5'>
				<Text fontSize='2xl' bold color='black'>
					결과요
				</Text>
				{temporary.map((item, idx) => (
					<TouchableOpacity
						onPress={() => {
							goEnrollInfo(item);
						}}>
						<Text>{item}</Text>
					</TouchableOpacity>
				))}
				<CustomButton label='다음 단계' onPress={() => {}}></CustomButton>
			</VStack>
		</ScrollView>
	);
}

const temporary = [
	'경기 수원시',
	'전북 전주시',
	'경북 안동시',
	'경남 통영시',
	'경기 파주시',
	'충북 충주시',
	'충남 아산시',
	'대전',
	'경기 시흥시',
	'경기 용인시',
];
