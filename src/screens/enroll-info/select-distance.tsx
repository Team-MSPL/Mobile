import {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import CustomButton from '../../utill/component/custom-button';
import {BackHandler, TouchableOpacity} from 'react-native';
import {Text, Box, ScrollView, VStack, Divider, Center} from 'native-base';
import Slider from '@react-native-community/slider';
export default function SelectDistance({navigation}: any) {
	const {distance} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const [range, setRange] = useState(distance);

	const goNext = () => {
		dispatch(travelSliceActions.enrollDistance(range));
		navigation.navigate('SelectTendency');
	};
	useEffect(() => {
		const backAction = () => {
			if (navigation.isFocused()) {
				dispatch(travelSliceActions.enrollDistance(range));
				navigation.goBack();
				return true;
			}
		};
		const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
		return () => backHandler.remove();
	}, [range]);
	return (
		<ScrollView bgColor='#EFFBFB' p='2'>
			<VStack space='5'>
				<Text fontSize='2xl' bold color='black'>
					거리민감도 설정
				</Text>
				<Text fontSize='md' color='grey'>
					거리 민감도가 높아질수록 이동경로가 가까워집니다.
				</Text>
				<Text>{range}</Text>
				<Divider my='1' />
				<Center>
					<Slider
						style={{width: '80%', height: 40}}
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
				</Center>
				<Center>
					<Box w={300 - range * 3 + 'px'} h={300 - range * 3 + 'px'} bgColor='amber.300'></Box>
				</Center>

				<CustomButton label='다음 단계' onPress={goNext}></CustomButton>
			</VStack>
		</ScrollView>
	);
}
