import {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import CustomButton from '../../utill/component/custom-button';
import SelectButton from '../../utill/component/select-button';
import {Text, Box, ScrollView, VStack, HStack, Divider, Button} from 'native-base';
import {tendencyList} from './select-tendency';

export default function FinalCheck({navigation}: any) {
	const {region, cityName, accommodations, nDay, day, essentialPlaces, timeLimitArray, tendency} = useAppSelector(
		state => state.travelSlice,
	);
	const dispatch = useAppDispatch();
	useEffect(() => {
		console.log(day);
	}, []);
	return (
		<ScrollView bgColor='#EFFBFB' p='2'>
			{/* 스테퍼 넣기 */}

			<Text>{cityName + ' ' + region}</Text>
			<Text>출발: {day[0].day}</Text>
			<Text>종료: {day[1].day}</Text>
			{accommodations.map((item, idx) => {
				return <Text key={idx}> {item.name ? idx + 1 + '일밤' + item.name : idx + 1 + '일밤 안정함 ㅋ'}:</Text>;
			})}

			{[...Array(nDay + 1)].map((item, idx) => {
				const filteredPlaces = essentialPlaces.filter(place => place.day === idx + 1);

				return (
					<Box key={idx} my='3'>
						{filteredPlaces.map((data, idx) => (
							<HStack key={data.id}>
								<Text fontSize='lg' bold>
									{data.day}일차 {data.name}
								</Text>
							</HStack>
						))}
					</Box>
				);
			})}
			{tendency.map((item, idx) => {
				return (
					idx !== tendency.length - 1 &&
					item.map((q, a) => {
						return q ? <Text key={idx}>{tendencyList[idx]?.list[a]}</Text> : null;
					})
				);
			})}
			<CustomButton label='다음 단계' onPress={() => {}}></CustomButton>
		</ScrollView>
	);
}
