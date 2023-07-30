import {useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {Text, Box, ScrollView, VStack, Divider, Slider, Center, HStack, Spacer} from 'native-base';
export default function TimetableDayView({navigation}: any) {
	return (
		<HStack>
			<Box w='60px'></Box>
			{[...Array(5)].map((item, idx) => (
				<Center w='70px' h='70px' key={idx}>
					<Text>{idx + '날'}</Text>
				</Center>
			))}
		</HStack>
	);
}
