import {useLayoutEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';

import {Text, ScrollView} from 'native-base';
import CustomButton from '../../utill/component/custom-button';
import SelectButton from '../../utill/component/select-button';
import {Image} from 'react-native';
export default function AddAccommodation({navigation, route}: any) {
	const {Place, nDay, accommodations} = useAppSelector(state => state.travelSlice);
	const [select, setSelect] = useState(Array(nDay).fill(false));
	const dispatch = useAppDispatch();

	const addInn = () => {
		let copy = [...accommodations];
		select.map((item, idx) => {
			console.log(Place);
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
	useLayoutEffect(() => {
		route.params.idx && selectDay(route.params.idx - 1);
	}, []);
	return (
		<ScrollView p='5' bgColor='#EFFBFB' flex='1'>
			<Text fontSize='2xl' bold color='black'>
				여행 숙소 날짜 등록
			</Text>
			<Text fontSize='md' color='grey'>
				이 숙소에는 언제 숙박하실 예정인가요?
			</Text>
			<Text fontSize='lg' bold>
				{Place.name}
			</Text>
			<Image
				source={{
					uri: Place.imageUrl,
				}}
				style={{width: '100%', height: 300}}
				alt='Place Image'
			/>
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
		</ScrollView>
	);
}
