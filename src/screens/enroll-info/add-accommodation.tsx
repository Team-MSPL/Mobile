import {useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';

import {Text, Box} from 'native-base';
import CustomButton from '../../utill/component/custom-button';
import SelectButton from '../../utill/component/select-button';
export default function AddAccommodation({navigation}: any) {
	const {Place, nDay, accommodations} = useAppSelector(state => state.travelSlice);
	const [select, setSelect] = useState(Array(nDay).fill(false));
	const dispatch = useAppDispatch();

	const addInn = () => {
		let copy = [...accommodations];
		select.map((item, idx) => {
			item && (copy[idx + 1] = Place);
		});
		dispatch(travelSliceActions.enrollAccommodations(copy));
		navigation.goBack();
	};

	const selectDay = (idx: number) => {
		let copy = [...select];
		copy[idx] = !copy[idx];
		setSelect(copy);
	};

	return (
		<Box p='5' bgColor='#EFFBFB' flex='1'>
			<Text fontSize='2xl' bold color='black'>
				여행 숙소 날짜 등록
			</Text>
			<Text fontSize='md' color='grey'>
				이 숙소에는 언제 숙박하실 예정인가요?
			</Text>
			<Text fontSize='lg' bold>
				{Place.name}
			</Text>
			{[...Array(nDay)].map((item, idx) => {
				return (
					<SelectButton
						key={idx}
						label={idx + 1 + '일 밤'}
						onPress={() => selectDay(idx)}
						bgColor={select[idx]}></SelectButton>
				);
			})}

			<CustomButton label='등록' onPress={addInn} isDisabled={!select.includes(true)}></CustomButton>
		</Box>
	);
}
