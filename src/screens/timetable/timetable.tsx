import {JSX, JSXElementConstructor, ReactElement, useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import CustomButton from '../../utill/component/custom-button';
import {Text, Box, ScrollView, VStack, Divider, Slider, Center} from 'native-base';
import MapView, {Polyline, Marker} from 'react-native-maps';
import SelectButton from '../../utill/component/select-button';
import {localSearchAI, enoughPlace} from '../../ai/local_search_ai';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';

export default function Timetable({navigation}: any) {
	const {timetable} = useAppSelector(state => state.travelSlice);
	const {isLoading} = useAppSelector(state => state.loadingSlice);
	const dispatch = useAppDispatch();
	const [select, setSelect] = useState(0);

	const goNext = () => {
		dispatch(travelSliceActions.enrollTimetable(select));
		navigation.navigate('SelectTendency');
	};

	const change = (idx: number) => {
		setSelect(idx);
	};

	return (
		<ScrollView bgColor='#EFFBFB' p='2'>
			{timetable.map((item, idx) => item.map((value, index) => <Text key={index}>{value.name}</Text>))}
		</ScrollView>
	);
}
