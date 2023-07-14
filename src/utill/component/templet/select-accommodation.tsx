import {TouchableOpacity} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {travelSliceActions} from '../../../redux/travel-info/travel.slice';

import {Text, Box, HStack} from 'native-base';
import CustomButton from '../../../utill/component/custom-button';

export default function SelectAccommodation({navigation}: any) {
	const {nDay, accommodations} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();

	const goSearchPlace = () => {
		navigation.navigate('SearchPlace', {id: 0});
	};

	const deleteAccommodation = (e: number) => {
		let copy = [...accommodations];
		copy[e] = {name: '', lat: 0, lng: 0, category: 4, takenTime: 30};
		dispatch(travelSliceActions.enrollAccommodations(copy));
	};
	return (
		<Box>
			<CustomButton label='장소 추가' onPress={goSearchPlace}></CustomButton>
			{[...Array(nDay)].map((item, idx) => {
				return (
					<Box key={idx} my='3'>
						<Text fontSize='lg' bold>
							day {idx + 1}
						</Text>
						<HStack>
							{accommodations[idx + 1].name && (
								<>
									<Text fontSize='lg' bold>
										{accommodations[idx + 1].name}
									</Text>
									<TouchableOpacity
										style={{
											width: 30,
											height: 30,
											backgroundColor: 'red',
										}}
										onPress={() => {
											deleteAccommodation(idx + 1);
										}}>
										<Text>삭제</Text>
									</TouchableOpacity>
								</>
							)}
						</HStack>
					</Box>
				);
			})}
		</Box>
	);
}
