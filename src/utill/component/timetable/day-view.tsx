import {useState, memo} from 'react';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {TouchableOpacity, Alert} from 'react-native';
import moment from 'moment';
import {modalSliceActions} from '../../../redux/modal/modalSlice';
import styled from 'styled-components/native';
import {HStack} from '../../layout/layout';
import {colors} from '../../colors';
import {SvgRight} from '../../svg/svg';
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
		<DayViewContainer>
			<TimetableDayContainer>
				<TouchableOpacity disabled={viewDayIndex == 0} onPress={goLeft}>
					<SvgRight color={'white'} transform={180} />
				</TouchableOpacity>
				<DayText>{moment(day[0]).format('YYYY-MM-DD') + '~' + moment(day[nDay]).format('YYYY-MM-DD')}</DayText>
				<TouchableOpacity disabled={viewDayIndex + 5 > nDay} onPress={goRight}>
					<SvgRight color={'white'} />
				</TouchableOpacity>
			</TimetableDayContainer>
			<DayHStack>
				<EmptyView></EmptyView>
				{day.map(
					(item, idx) =>
						idx >= viewDayIndex &&
						idx <= viewDayIndex + 4 && (
							<DayTouchableOpacity
								onPress={() => {
									goMapInfo(idx);
								}}
								key={idx}>
								<DaySubText>{dayList[moment(item).day()]}</DaySubText>
								<DayText>{moment(item).date()}</DayText>
							</DayTouchableOpacity>
						),
				)}
			</DayHStack>
		</DayViewContainer>
	);
};

export default memo(DayView);
const EmptyView = styled.View`
	flex: 0.1;
	background-color: red;
`;
const DayViewContainer = styled.View`
	flex: 0.15;
`;
const TimetableDayContainer = styled.View`
	display: inline-block;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	border-radius: 10px;
	padding: 10px;
	background-color: ${colors.selectButton};
	width: 100%;
`;

const DayHStack = styled(HStack)`
	flex: 1;
`;
const DayTouchableOpacity = styled.TouchableOpacity`
	flex: 0.18;
	height: 70px;
	align-items: center;
	justify-content: center;
`;

const DayText = styled.Text`
	font-size: 14px;
	font-weight: bold;
	color: black;
`;
const DaySubText = styled(DayText)`
	font-weight: 500;
`;
