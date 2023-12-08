import moment from 'moment';
import {memo} from 'react';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {modalSliceActions} from '../../../redux/modal/modalSlice';
import {colors} from '../../colors';
import {HStack, devicesWidth} from '../../layout/layout';
import {SvgRight} from '../../svg/svg';
const DayView = ({viewDayIndex, setViewDayIndex, navigation}: any) => {
	const {day, nDay, timetable, makeMode} = useAppSelector(state => state.travelSlice);
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
			<TimetableDayContainer center={nDay > 4}>
				{nDay > 4 && (
					<ArrowTouchableOpacity float='left' onPress={goLeft}>
						<SvgRight color={'white'} transform={180} />
					</ArrowTouchableOpacity>
				)}
				<DurationText>
					{moment(day[0]).format('YYYY.MM.DD') + '    ~    ' + moment(day[nDay]).format('YYYY.MM.DD')}
				</DurationText>
				{nDay > 4 && (
					<ArrowTouchableOpacity float='right' onPress={goRight}>
						<SvgRight color={'white'} />
					</ArrowTouchableOpacity>
				)}
			</TimetableDayContainer>
			<DayHStack>
				<EmptyView></EmptyView>
				{day.map(
					(item, idx) =>
						idx >= viewDayIndex &&
						idx <= viewDayIndex + 4 && (
							<DayTouchableOpacity key={idx}>
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
const ArrowTouchableOpacity = styled.TouchableOpacity<{float: string}>`
	width: 20%;
	align-items: ${props => (props.float == 'left' ? 'flex-start' : 'flex-end')};
	justify-content: cetner;
`;
const EmptyView = styled.View`
	flex: 0.1;
	background-color: red;
`;
const DayViewContainer = styled.View`
	flex: 0.15;
`;
const TimetableDayContainer = styled.View<{center: boolean}>`
	display: inline-block;
	flex-direction: row;
	align-items: center;
	justify-content: ${props => (props.center ? 'space-between' : 'center')};
	border-radius: 10px;
	padding: 10px;
	background-color: ${colors.selectButton};
	width: 100%;
`;

const DayHStack = styled(HStack)`
	flex: 1;
`;
const DayTouchableOpacity = styled.View`
	flex: 0.18;
	height: 70px;
	align-items: center;
	justify-content: center;
`;

const DurationText = styled.Text`
	font-size: ${devicesWidth * 0.04}px;
	font-weight: bold;
	color: white;
`;

const DayText = styled.Text`
	font-size: 14px;
	font-weight: bold;
	color: black;
`;
const DaySubText = styled(DayText)`
	font-weight: 500;
`;
