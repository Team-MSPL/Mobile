import {useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../redux';
import CustomButton from '../../../utill/component/custom-button';
import {Text, Box, ScrollView, VStack, Divider, Slider, Center} from 'native-base';
import {RegionRecommendSliceActions} from '../../../redux/travel-info/region-recommend.slice';
export default function SelectDistance({navigation}: any) {
	const {distance} = useAppSelector(state => state.RegionRecommendSlice);
	const dispatch = useAppDispatch();
	const [range, setRange] = useState(5);

	const goNext = () => {
		dispatch(RegionRecommendSliceActions.enrollDistance(range));
		navigation.navigate('RegionSelectPopularity');
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
				<Text>{range}</Text>
				<Divider my='1' />
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
