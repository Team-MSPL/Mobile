import {useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import shortId from 'shortid';

import {Text, ScrollView} from 'native-base';
import CustomButton from '../../utill/component/custom-button';
import SelectButton from '../../utill/component/select-button';
export default function AddEssential({navigation}: any) {
	const {Place, nDay, essentialPlaces} = useAppSelector(state => state.travelSlice);
	const [select, setSelect] = useState(Array(nDay).fill(false));
	const dispatch = useAppDispatch();

	const addInn = () => {
		let copy = [...essentialPlaces];
		select.map((item, idx) => {
			item && copy.push({...Place, day: idx + 1, id: shortId.generate()});
		});
		dispatch(travelSliceActions.enrollessentialPlaces(copy));
		navigation.goBack();
	};

	const selectDay = (idx: number) => {
		let copy = [...select];
		copy[idx] = !copy[idx];
		setSelect(copy);
	};

	return (
		<ScrollView p='5' bgColor='#EFFBFB' flex='1'>
			<Text fontSize='2xl' bold color='black'>
				필수여행지 날짜 등록
			</Text>
			<Text fontSize='md' color='grey'>
				이 여행지에는 언제 방문하실 예정인가요?
			</Text>
			<Text fontSize='lg' bold>
				{Place.name}
			</Text>
			{[...Array(nDay + 1)].map((item, idx) => {
				return (
					<SelectButton
						key={idx}
						label={idx + 1 + '일 차'}
						onPress={() => selectDay(idx)}
						bgColor={select[idx]}></SelectButton>
				);
			})}

			<CustomButton label='등록' onPress={addInn} isDisabled={!select.includes(true)}></CustomButton>
		</ScrollView>
	);
}
