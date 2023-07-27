import {useEffect, useState} from 'react';
import {Image} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import CustomButton from '../../utill/component/custom-button';
import SelectButton from '../../utill/component/select-button';
import {Text, Box, ScrollView, VStack, HStack} from 'native-base';
import {tendencyList} from './select-tendency';

export default function FinalCheck({navigation}: any) {
	const {region, accommodations, nDay, day, essentialPlaces, tendency} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();

	const goReset = () => {
		navigation.navigate('SelectCity');
		dispatch(travelSliceActions.reset());
	};
	return (
		<ScrollView bgColor='#EFFBFB' p='2'>
			{/* 스테퍼 넣기 */}

			<Text>{region}</Text>
			<Text>출발: {day[0]}</Text>
			<Text>종료: {day[1]}</Text>
			{accommodations.map((item, idx) => {
				return (
					idx != 0 &&
					idx != accommodations.length - 1 && (
						<HStack key={idx}>
							{item.imageUrl && (
								<Image
									source={{
										uri: item.imageUrl,
									}}
									style={{width: 50, height: 50}}
									alt='Place Image'
								/>
							)}

							<Text>{item.name ? idx + ' 일밤 ' + item.name : idx + '일밤 안정함 ㅋ'}</Text>
						</HStack>
					)
				);
			})}

			{[...Array(nDay + 1)].map((item, indx) => {
				const filteredPlaces = essentialPlaces.filter(place => place.day === indx + 1);

				return (
					<Box key={indx} my='3'>
						{filteredPlaces.map(data => (
							<HStack key={data.id}>
								<Image
									source={{
										uri: data.imageUrl,
									}}
									style={{width: 50, height: 50}}
									alt='Place Image'
								/>
								<Text fontSize='lg' bold>
									{data.day}일차 {data.name}
								</Text>
							</HStack>
						))}
					</Box>
				);
			})}
			{tendency.map((item, inx) => {
				return (
					inx !== tendency.length - 1 &&
					item.map((q, a) => {
						return q ? <Text key={a}>{tendencyList[inx]?.list[a]}</Text> : null;
					})
				);
			})}
			<CustomButton label='다시 만들래' onPress={goReset}></CustomButton>
			<CustomButton label='다음 단계' onPress={() => {}}></CustomButton>
		</ScrollView>
	);
}
