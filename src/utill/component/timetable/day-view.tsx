import {useState, memo} from 'react';
import {Text, Box, Center, HStack, Spacer} from 'native-base';
import {useAppSelector} from '../../../redux';
import {TouchableOpacity} from 'react-native';
import moment from 'moment';
const DayView = ({viewDayIndex, setViewDayIndex}: any) => {
	const {day, nDay} = useAppSelector(state => state.travelSlice);
	const dayList = ['일', '월', '화', '수', '목', '금', '토'];

	const goRight = () => {
		viewDayIndex + 10 > nDay ? setViewDayIndex(nDay - 4) : setViewDayIndex(viewDayIndex + 5);
	};
	const goLeft = () => {
		viewDayIndex - 5 < 0 ? setViewDayIndex(0) : setViewDayIndex(viewDayIndex - 4);
	};
	return (
		<Box>
			<HStack bgColor='blue.400'>
				<TouchableOpacity disabled={viewDayIndex == 0} onPress={goLeft}>
					<Text>왼쪽 </Text>
				</TouchableOpacity>
				<Spacer />
				<Text fontSize='xl' bold>
					{day[0].format('YYYY-MM-DD') + '~' + day[nDay].format('YYYY-MM-DD')}
				</Text>
				<Spacer />

				<TouchableOpacity disabled={viewDayIndex + 4 == nDay} onPress={goRight}>
					<Text>오른쪽 </Text>
				</TouchableOpacity>
			</HStack>
			<HStack>
				<Box w='60px'></Box>
				{day.map(
					(item, idx) =>
						idx >= viewDayIndex &&
						idx <= viewDayIndex + 4 && (
							<Center w='70px' h='70px' key={idx}>
								<Text>{item.date() + '일 ' + dayList[item.day()]}</Text>
							</Center>
						),
				)}
			</HStack>
		</Box>
	);
};

export default memo(DayView);
