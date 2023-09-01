import {useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import CustomButton from '../../utill/component/custom-button';
import {TouchableOpacity} from 'react-native';
import {Text, Box, ScrollView, VStack, Divider, Slider, Center} from 'native-base';
export default function SelectDistance({navigation}: any) {
	const {distance} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const [range, setRange] = useState(5);

	const goNext = () => {
		dispatch(travelSliceActions.enrollDistance(range));
		navigation.navigate('SelectTendency');
	};

	return (
		<ScrollView bgColor='#EFFBFB' p='2'>
			<VStack space='5'>
				<Text fontSize='2xl' bold color='black'>
					거리민감도 설정
				</Text>
				<Text fontSize='md' color='grey'>
					거리 민감도가 높아질수록 이동경로가 가까워집니다.
				</Text>
				<Text>{distance}</Text>
				<Divider my='1' />
				<Center>
					{/* <Slider
						w='4/5'
						defaultValue={5}
						minValue={1}
						maxValue={10}
						step={1}
						onChange={item => {
							setRange(item);
						}}>
						<Slider.Track>
							<Slider.FilledTrack />
						</Slider.Track>
						<Slider.Thumb />
					</Slider> */}
					<TouchableOpacity
						onPress={() => {
							dispatch(travelSliceActions.enrollDistance(distance + 1));
						}}>
						<Text>더하기</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							dispatch(travelSliceActions.enrollDistance(distance - 1));
						}}>
						<Text>빼기</Text>
					</TouchableOpacity>
				</Center>
				<Center>
					<Box w={300 - distance * 3 + 'px'} h={300 - distance * 3 + 'px'} bgColor='amber.300'></Box>
				</Center>

				<CustomButton label='다음 단계' onPress={goNext}></CustomButton>
			</VStack>
		</ScrollView>
	);
}
