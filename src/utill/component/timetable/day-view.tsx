import {useState, memo} from 'react';
import {Text, Box} from 'native-base';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {TouchableOpacity, Alert} from 'react-native';
import moment from 'moment';
import {modalSliceActions} from '../../../redux/modal/modalSlice';
import styled from 'styled-components/native';
import {HStack} from '../../layout/layout';
const DayView = ({viewDayIndex, setViewDayIndex, navigation}: any) => {
	const {day, nDay, timetable} = useAppSelector(state => state.travelSlice);
	const dayList = ['일', '월', '화', '수', '목', '금', '토'];
	const dispatch = useAppDispatch();
	const goRight = () => {
		viewDayIndex + 10 > nDay ? setViewDayIndex(nDay - 4) : setViewDayIndex(viewDayIndex + 5);
	};
	const goLeft = () => {
		viewDayIndex - 5 < 0 ? setViewDayIndex(0) : setViewDayIndex(viewDayIndex - 4);
	};
	const goMapInfo = (e: number) => {
		nDay < e || timetable[e].length == 0
			? dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '볼수있는 관광지가 없습니다.',
					}),
			  )
			: navigation.navigate('MapInfo', {mapIndex: e});
	};
	return (
		<Box>
			<TimetableDayContainer>
				<TouchableOpacity disabled={viewDayIndex == 0} onPress={goLeft}>
					<Text>왼쪽 </Text>
				</TouchableOpacity>
				<Text fontSize='xl' bold>
					{moment(day[0]).format('YYYY-MM-DD') + '~' + moment(day[nDay]).format('YYYY-MM-DD')}
				</Text>
				<TouchableOpacity disabled={viewDayIndex + 5 > nDay} onPress={goRight}>
					<Text>오른쪽 </Text>
				</TouchableOpacity>
			</TimetableDayContainer>
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

const TimetableDayContainer = styled.View`
	display: inline-block;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	background-color: red;
	width: 100%;
	height: 30px;
`;
