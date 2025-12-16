import moment from 'moment';
import {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import shortid from 'shortid';
import {styled} from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import {colors} from '../../utill/colors';
import RouteButton from '../../utill/component/route-button';
import {
	BackgroundGray,
	HStack,
	PretendardSemiBoldText,
	PretendardVariableText,
	VStack,
} from '../../utill/layout/layout';
import {widthPercentage} from '../../utill/layout/responsive-size';
import {SvgCancel, SVGRightAdd} from '../../utill/svg/svg';

export default function AccommodationDay({navigation, route}: any) {
	const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
	const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
	const {day, nDay, timetable, accommodations} = useAppSelector(state => state.travelSlice);

	const [selectDateFlag, setSelectDateFlag] = useState(false);
	const [selectEndDate, setSelectEndDate] = useState(null);
	const [selectStartDate, setSelectStartDate] = useState();
	const [selectedDateFlag, setSelectedDateFlag] = useState(false);
	const {info} = route.params;
	useEffect(() => {
		setSelectStartDate(moment(new Date(day[route.params?.index])));
		setSelectEndDate(moment(new Date(day[route.params?.index])));
		setSelectedDateFlag(true);
	}, [route.params]);
	const onDateChange = (date: any, type: string) => {
		!selectDateFlag && setSelectDateFlag(true);
		if (type == 'END_DATE') {
			setSelectEndDate(date);
		} else {
			selectEndDate && selectEndDate?.diff(date) <= 0 && setSelectEndDate(date);
			setSelectStartDate(date);
			setSelectedDateFlag(true);
		}
	};
	const dispatch = useAppDispatch();
	const handleAllSelect = () => {
		setSelectStartDate(moment(new Date(day[0])));
		setSelectEndDate(moment(new Date(day[nDay])));
		setSelectedDateFlag(true);
	};
	const handleFinished = () => {
		// {"category": 4, "id": "SUDV5kkBz", "lat": 37.4852144611646, "lng": 127.012853494146, "name": "유원호텔", "takenTime": 360, "x": 0, "y": 36}
		let startIndex;
		let endIndex;
		day.forEach((item, idx) => {
			if (moment(new Date(item)).isSame(selectStartDate)) startIndex = idx;
			if (moment(new Date(item)).isSame(selectEndDate ?? selectStartDate)) endIndex = idx;
		});
		let copyTimetable = [...timetable];
		copyTimetable.forEach((item, index) => {
			if (index >= startIndex && index <= endIndex) {
				let data = [...item];
				if (data.length > 1 && data[data.length - 1]?.category === 4) {
					data.pop(); // 마지막 요소 제거
				}
				if (!(index == copyTimetable.length - 1)) {
					data.push({
						category: 4,
						id: shortid(),
						takenTime: 360,
						x: 0,
						y: 36,
						lat: info.lat,
						lng: info.lng,
						name: info.name,
					});
				}

				if (index != copyTimetable.length - 1) {
					let copy = [...copyTimetable[index + 1]];
					if (copyTimetable[index + 1][0]?.category == 4) {
						copy.shift();
					}
					copy.push({
						category: 4,
						id: shortid(),
						takenTime: 0,
						x: index + 1,
						y: 6,
						lat: info.lat,
						lng: info.lng,
						name: info.name,
					});
					copy = copy.sort((a, b) => a.y - b.y);
					copyTimetable[index + 1] = copy;
				}
				data = data.sort((a, b) => a.y - b.y);
				copyTimetable[index] = data;
			}
		});
		dispatch(travelSliceActions.changeTimetable(copyTimetable));
		navigation.pop(2);
	};
	return (
		<BackgroundGray backgroundColor={colors.backgroundWhite}>
			<InfoBox>
				<HStack>
					<VStack width={widthPercentage(243)}>
						<PretendardSemiBoldText size={16} color={colors.Gray5} lineHeight={21.6}>
							{info.name}
						</PretendardSemiBoldText>
						<PretendardVariableText size={12} lineHeight={18} color={colors.Gray4} numberOfLines={1}>
							{info.formatted_address}
						</PretendardVariableText>
					</VStack>
					<CanCelBox>
						<SvgCancel color='black' width={11} height={11} />
					</CanCelBox>
				</HStack>
			</InfoBox>
			<CalendarPicker
				width={widthPercentage(Platform.isPad ? 300 : 375)}
				weekdays={weekdays}
				months={months}
				monthYearHeaderWrapperStyle={{marginHorizontal: widthPercentage(30)}}
				headerWrapperStyle={{justifyContent: 'center'}}
				nextComponent={<SVGRightAdd color={colors.Gray5} />}
				previousComponent={<SVGRightAdd color={colors.Gray400} transform={180} />}
				minDate={new Date(day[0])}
				maxDate={new Date(day[nDay])}
				startFromMonday={false}
				initialDate={new Date(day[0])}
				onDateChange={onDateChange}
				showDayStragglers={false}
				previousTitle='이전'
				nextTitle='다음'
				previousTitleStyle={{color: 'black'}}
				nextTitleStyle={{color: 'black'}}
				allowBackwardRangeSelect={true}
				selectYearTitle='년도 선택'
				allowRangeSelection={true}
				selectedRangeStartStyle={{backgroundColor: colors.Primary}}
				selectedRangeStyle={{backgroundColor: colors.PointGreen3}}
				selectedRangeEndStyle={{backgroundColor: colors.Primary}}
				selectedDayColor={colors.Primary}
				selectedStartDate={selectedDateFlag ? selectStartDate?.toDate() : undefined}
				selectedEndDate={selectedDateFlag && selectEndDate != null ? selectEndDate?.toDate() : undefined}
			/>
			<RouteButton
				navigation={navigation}
				nextText='선택완료'
				leftText='전체선택'
				btnFunction={() => {
					handleFinished();
				}}
				isDisabled={selectStartDate == null}
				LeftBtnFunction={() => {
					handleAllSelect();
				}}></RouteButton>
		</BackgroundGray>
	);
}
const InfoBox = styled.View`
	width: ${widthPercentage(327)}px;
	height: ${widthPercentage(72)}px;
	background-color: ${colors.backgroundGray};
	border-radius: 12px;
	align-items: center;
	justify-content: center;
`;
const CanCelBox = styled.TouchableOpacity`
	width: ${widthPercentage(41)}px;
	height: ${widthPercentage(72)}px;
	justify-content: center;
	align-items: flex-end;
`;
