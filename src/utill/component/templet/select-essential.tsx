import {Alert, Image, TouchableOpacity} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {EssentialPlaceType, travelSliceActions} from '../../../redux/travel-info/travel.slice';

import {Text, Box, HStack, Button} from 'native-base';
import CustomButton from '../custom-button';

export default function SelectEssential({navigation}: any) {
	const {nDay, essentialPlaces} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();

	const goSearchPlace = (idx: number) => {
		navigation.navigate('SearchPlace', {id: 1, idx: idx});
	};

	const deleteEssential = (e: EssentialPlaceType) => {
		const updatedPlaces = essentialPlaces.filter(item => item.id !== e.id);
		dispatch(travelSliceActions.enrollessentialPlaces(updatedPlaces));
	};

	return (
		<Box>
			<CustomButton
				label='필수추가'
				onPress={() => {
					goSearchPlace(0);
				}}
			/>
			{[...Array(nDay + 1)].map((item, idx) => {
				const filteredPlaces = essentialPlaces.filter(place => place.day === idx + 1);

				return (
					<TouchableOpacity
						key={idx}
						style={{marginVertical: 10}}
						onPress={() => {
							filteredPlaces.length < 3 ? goSearchPlace(idx + 1) : Alert.alert('3개까지만 가능합니다.');
						}}>
						<Text fontSize='lg' bold>
							day {idx + 1}
						</Text>
						{filteredPlaces.map((data, idx) => (
							<HStack key={data.id}>
								<Image
									source={{
										uri: data.photo,
									}}
									style={{width: 50, height: 50}}
									alt='Place Image'
								/>
								<Text fontSize='lg' bold>
									{data.name}
								</Text>
								<TouchableOpacity
									style={{
										width: 30,
										height: 30,
										backgroundColor: 'red',
									}}
									onPress={() => {
										deleteEssential(data);
									}}>
									<Text>삭제</Text>
								</TouchableOpacity>
							</HStack>
						))}
					</TouchableOpacity>
				);
			})}
		</Box>
	);
}
