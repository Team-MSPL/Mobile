import {useState, memo} from 'react';
import {Text, Box, Center, HStack, Spacer} from 'native-base';
import {useAppSelector} from '../../../redux';
import {TouchableOpacity, Alert} from 'react-native';
import moment from 'moment';
const DayView = ({viewDayIndex, setViewDayIndex, navigation}: any) => {
	const {day, nDay, timetable} = useAppSelector(state => state.travelSlice);
	const dayList = ['일', '월', '화', '수', '목', '금', '토'];

	const goRight = () => {
		viewDayIndex + 10 > nDay ? setViewDayIndex(nDay - 4) : setViewDayIndex(viewDayIndex + 5);
	};
	const goLeft = () => {
		viewDayIndex - 5 < 0 ? setViewDayIndex(0) : setViewDayIndex(viewDayIndex - 4);
	};
	const goMapInfo = (e: number) => {
		nDay < e || timetable[e].length == 0
			? Alert.alert('보여줄게없어유')
			: navigation.navigate('MapInfo', {mapIndex: e});
	};
	return (
		<Box>
			<HStack bgColor='blue.400'>
				<TouchableOpacity disabled={viewDayIndex == 0} onPress={goLeft}>
					<Text>왼쪽 </Text>
				</TouchableOpacity>
				<Spacer />
				<Text fontSize='xl' bold>
					{moment(day[0]).format('YYYY-MM-DD') + '~' + moment(day[nDay]).format('YYYY-MM-DD')}
				</Text>
				<Spacer />

				<TouchableOpacity disabled={viewDayIndex + 5 > nDay} onPress={goRight}>
					<Text>오른쪽 </Text>
				</TouchableOpacity>
			</HStack>
			<HStack>
				<Box w='60px'></Box>
				{day.map(
					(item, idx) =>
						idx >= viewDayIndex &&
						idx <= viewDayIndex + 4 && (
							<TouchableOpacity
								onPress={() => {
									goMapInfo(idx);
								}}
								style={{width: 70, height: 70, alignItems: 'center', justifyContent: 'center'}}
								key={idx}>
								<Text>{moment(item).date() + '일 ' + dayList[moment(item).day()]}</Text>
							</TouchableOpacity>
						),
				)}
			</HStack>
		</Box>
	);
};

export default memo(DayView);
