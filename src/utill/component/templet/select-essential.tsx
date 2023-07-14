import {useAppDispatch, useAppSelector} from '../../../redux';
import {EssentialPlaceType, travelSliceActions} from '../../../redux/travel-info/travel.slice';

import {Text, Box, HStack, Button} from 'native-base';
import CustomButton from '../custom-button';

export default function SelectEssential({navigation}: any) {
	const {nDay, essentialPlaces} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();

	const goSearchPlace = () => {
		console.log(navigation);
		navigation.navigate('SearchPlace', {id: 1});
	};

	const deleteEssential = (e: EssentialPlaceType) => {
		let copy = [...essentialPlaces];
		copy = copy.filter(item => item.id !== e.id);
		dispatch(travelSliceActions.enrollessentialPlaces(copy));
	};

	return (
		<Box>
			<CustomButton label='필수추가' onPress={goSearchPlace}></CustomButton>
			{[...Array(nDay + 1)].map((item, idx) => {
				return (
					<Box key={idx} my='3'>
						<Text fontSize='lg' bold>
							day {idx + 1}
						</Text>
						{essentialPlaces
							.filter(item => item.day === idx + 1)
							.map((data, idx) => {
								return (
									<HStack key={idx}>
										<Text fontSize='lg' bold>
											{data.name}
										</Text>
										<Button
											onPress={() => {
												deleteEssential(data);
											}}>
											x
										</Button>
									</HStack>
								);
							})}
					</Box>
				);
			})}
		</Box>
	);
}
