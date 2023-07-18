import {useAppDispatch, useAppSelector} from '../../../redux';
import {EssentialPlaceType, travelSliceActions} from '../../../redux/travel-info/travel.slice';

import {Text, Box, HStack, Button} from 'native-base';
import CustomButton from '../custom-button';

export default function SelectEssential({navigation}: any) {
	const {nDay, essentialPlaces} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();

	const goSearchPlace = () => {
		navigation.navigate('SearchPlace', {id: 1});
	};

	const deleteEssential = (e: EssentialPlaceType) => {
		const updatedPlaces = essentialPlaces.filter(item => item.id !== e.id);
		dispatch(travelSliceActions.enrollessentialPlaces(updatedPlaces));
	};

	return (
		<Box>
			<CustomButton label='필수추가' onPress={goSearchPlace} />
			{[...Array(nDay + 1)].map((item, idx) => {
				const filteredPlaces = essentialPlaces.filter(place => place.day === idx + 1);

				return (
					<Box key={idx} my='3'>
						<Text fontSize='lg' bold>
							day {idx + 1}
						</Text>
						{filteredPlaces.map((data, idx) => (
							<HStack key={data.id}>
								<Text fontSize='lg' bold>
									{data.name}
								</Text>
								<Button onPress={() => deleteEssential(data)}>x</Button>
							</HStack>
						))}
					</Box>
				);
			})}
		</Box>
	);
}
