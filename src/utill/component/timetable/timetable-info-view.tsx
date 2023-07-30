import {useState} from 'react';
import {Text, Box, ScrollView, VStack, Divider, Slider, Center, HStack, Spacer} from 'native-base';
import {useAppSelector} from '../../../redux';
export default function TimetableInfoView({navigation}: any) {
	const {timetable} = useAppSelector(state => state.travelSlice);
	return (
		<HStack position='absolute' my='3' zIndex='1'>
			<Box w='60px'></Box>
			{timetable.map((item, idx) => {
				return item.map((value, index) => {
					return (
						<Box
							w='70px'
							h={35 * Math.ceil(value.takenTime / 30) + 'px'}
							// top={'70px'}
							key={index}
							bgColor='black'
							p='0'
							m='0'>
							{/* h= takenTime top=시간위치 */}
							<Text>{idx + '날'}</Text>
						</Box>
					);
				});
			})}
		</HStack>
	);
}
