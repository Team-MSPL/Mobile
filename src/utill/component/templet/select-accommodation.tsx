import {TouchableOpacity, Image} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {travelSliceActions} from '../../../redux/travel-info/travel.slice';

import {Text, Box, HStack} from 'native-base';
import CustomButton from '../../../utill/component/custom-button';

export default function SelectAccommodation({navigation}: any) {
	const {nDay, accommodations} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();

	const goSearchPlace = (idx: number) => {
		navigation.navigate('SearchPlace', {id: 0, idx: idx});
	};

	const deleteAccommodation = (e: number) => {
		let copy = [...accommodations];

		//타입스크립트 빨간줄 추후 백엔드 연결시 성향 지울거라 사라질 예정
		copy[e] = {name: '', lat: 0, lng: 0, category: 4, takenTime: 30, imageUrl: ''};
		dispatch(travelSliceActions.enrollAccommodations(copy));
	};
	return (
		<Box>
			<CustomButton
				label='장소 추가'
				onPress={() => {
					goSearchPlace(0);
				}}></CustomButton>
			{[...Array(nDay)].map((item, idx) => {
				return (
					<TouchableOpacity
						key={idx}
						style={{marginVertical: 10}}
						onPress={() => {
							goSearchPlace(idx + 1);
						}}>
						<Text fontSize='lg' bold>
							day {idx + 1}
						</Text>
						<HStack>
							{accommodations[idx + 1].name && (
								<>
									{accommodations[idx + 1].imageUrl && (
										<Image
											source={{
												uri: accommodations[idx + 1].imageUrl,
											}}
											style={{width: 50, height: 50}}
											alt='Place Image'
										/>
									)}

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
					</TouchableOpacity>
				);
			})}
		</Box>
	);
}
