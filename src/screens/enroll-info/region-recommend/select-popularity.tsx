import {useMemo, useState} from 'react';
import {useAppDispatch} from '../../../redux';
import CustomButton from '../../../utill/component/custom-button';
import {Text, Box, ScrollView, VStack, Divider} from 'native-base';
import {RadioButtonProps, RadioGroup} from 'react-native-radio-buttons-group';
import {RegionRecommendSliceActions} from '../../../redux/travel-info/region-recommend.slice';
export default function SelectPopularity({navigation}: any) {
	const dispatch = useAppDispatch();

	const [selectedId, setSelectedId] = useState<string | undefined>();
	const goNext = () => {
		dispatch(RegionRecommendSliceActions.enrollPopularity(selectedId));
		navigation.navigate('RegionViewResult');
	};
	const radioButtons: RadioButtonProps[] = useMemo(
		() => [
			{
				id: '1',
				label: '완전 유명하지않은',
				value: 'option1',
				labelStyle: {color: 'black', fontSize: 18},
			},
			{
				id: '2',
				label: '조금 유명하지않은',
				value: 'option2',
				labelStyle: {color: 'black', fontSize: 18},
			},
			{
				id: '3',
				label: '보통',
				value: 'option2',
				labelStyle: {color: 'black', fontSize: 18},
			},
			{
				id: '4',
				label: '적당히 유명한',
				value: 'option2',
				labelStyle: {color: 'black', fontSize: 18},
			},
			{
				id: '5',
				label: '굉장히 유명한',
				value: 'option2',
				labelStyle: {color: 'black', fontSize: 18},
			},
		],
		[],
	);

	return (
		<ScrollView bgColor='#EFFBFB' p='2'>
			<VStack space='5'>
				<Text fontSize='2xl' bold color='black'>
					인기도
				</Text>
				<Divider my='1' />
				<Text fontSize='lg'>가고자 하는 여행지 느낌 선택해보삼</Text>
				<RadioGroup
					radioButtons={radioButtons}
					onPress={setSelectedId}
					selectedId={selectedId}
					containerStyle={{alignItems: 'flex-start'}}
				/>

				<CustomButton label='다음 단계' isDisabled={selectedId ? false : true} onPress={goNext}></CustomButton>
			</VStack>
		</ScrollView>
	);
}
