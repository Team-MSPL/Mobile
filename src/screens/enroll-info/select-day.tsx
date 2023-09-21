import {useRef, useState, useEffect, useCallback} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {PlaceType, travelSliceActions} from '../../redux/travel-info/travel.slice';
import DatePicker from 'react-native-date-picker';
import CalendarPicker from 'react-native-calendar-picker';
import CustomButton from '../../utill/component/custom-button';
import {Text, Spacer} from 'native-base';
import moment, {Moment} from 'moment';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import StepText from '../../utill/component/enroll-info/step-text';
import {Divider, VStack, HStack, MainContainer} from '../../utill/layout/layout';
import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import {Modal, View} from 'react-native';

export default function SelectDay({setViewComponent, viewComponent}: any) {
	const dateFlag = useRef(0);
	const [visible, setVisible] = useState(false);
	const {day, Place, timeLimitArray, minuteLimitArray, nDay, accommodations, selectStartDate, selectEndDate} =
		useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();

	const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
	const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

	const onConfirm = (selectedDate: Date) => {
		setVisible(false); // 모달 close
		if (dateFlag.current == 1 && selectedDate.getHours() < 13) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '13시 이전은 불가능합니다.',
					modalFunction: () => {},
				}),
			);
		} else {
			console.log(selectedDate.getHours());
			// 날짜 또는 시간 선택 시
			let timeCopy = [...timeLimitArray];
			timeCopy[dateFlag.current] = selectedDate.getHours();
			let minuteCopy = [...minuteLimitArray];
			minuteCopy[dateFlag.current] = selectedDate.getMinutes();
			dispatch(travelSliceActions.setTimeAndMinute({time: timeCopy, minute: minuteCopy}));
		}
	};

	const onCancel = () => {
		// 취소 시
		setVisible(false); // 모달 close
	};

	const onPressTime = (e: number) => {
		dateFlag.current = e;
		setVisible(true);
	};
	useEffect(() => {
		goNext();
	}, [selectStartDate, selectEndDate]);
	const goNext = () => {
		let data: PlaceType[] = [];
		const checkDays = calculateDateDifference();

		console.log('하위요ㅕ', checkDays);
		if (Object.keys(accommodations).length) {
			let copy = [...accommodations];
			if (checkDays + 2 < Object.keys(accommodations).length) {
				copy.splice(checkDays + 2, Object.keys(accommodations).length - checkDays);
				data = copy;
			} else if (checkDays + 2 > Object.keys(accommodations).length) {
				for (let i = 0; i < checkDays + 2 - Object.keys(accommodations).length; i++) {
					copy.push({
						name: '',
						lat: 0,
						lng: 0,
						category: 4,
						takenTime: 30,
						photo: '',
					});
				}
				data = copy;
			}
		} else {
			data = [...Array(checkDays + 2)].map(item => {
				return Place;
			});
		}

		let season = Array(4).fill(0);
		let index = Math.floor((selectStartDate.month() + 1) / 3) - 1;
		index < 0 ? (season[3] = 1) : (season[index] = 1);
		let dateArray = [];
		let count = 0;
		let copySelectedStartDate = moment({...selectStartDate});
		while (checkDays > 4 ? copySelectedStartDate.isSameOrBefore(selectEndDate) : count < 5) {
			dateArray.push(copySelectedStartDate.clone());
			copySelectedStartDate.add(1, 'day');
			count += 1;
		}
		console.log('ㅂㅈㄷ', dateArray, checkDays);
		dispatch(
			travelSliceActions.enrollDayInfo({
				day: dateArray,
				nDay: checkDays,
				accommodations: data.length == 0 ? accommodations : data,
				season: season,
			}),
		);
	};

	const onDateChange = (date: any, type: string) => {
		console.log(selectStartDate.format('YY-DD-MM-HH-mm-ss'));
		console.log(date.format('YY-DD-MM-HH-mm-ss'));
		if (calendarView.when == 0) {
			selectEndDate && selectEndDate.diff(date) <= 0 && dispatch(travelSliceActions.enrollSelectEndDate(date));
			dispatch(travelSliceActions.enrollSelectStartDate(date));
		} else {
			dispatch(travelSliceActions.enrollSelectEndDate(date));
		}
		setCalendarView({...calendarView, visible: false});
	};

	const calculateDateDifference = () => {
		if (selectStartDate && selectEndDate) {
			console.log(selectEndDate.diff(selectStartDate));
			const diffInMilliseconds = selectEndDate.diff(selectStartDate);
			const duration = moment.duration(diffInMilliseconds);
			const days = duration.asDays();
			console.log('우ㅜㅜㅜㅜㅜㅜㅜ', days, selectEndDate.diff(selectStartDate, 'days'));
			return Math.ceil(Math.abs(days)); // 절대값으로 반환 (음수 값 제거)
		}
		return 0;
	};

	const calendarContainerRef = useRef<View>(null);
	const nDays = calculateDateDifference();
	const DaySelectInfoList = [
		{step: 'Start', title: '여행 시작', day: selectStartDate},
		{step: 'End', title: '여행 종료', day: selectEndDate == null ? selectStartDate : selectEndDate},
	];
	const [calendarView, setCalendarView] = useState({visible: false, x: 0, y: 0, when: 0});
	return (
		<MainContainer showsVerticalScrollIndicator={false}>
			<StepText mainText='언제 여행을 계획하고 계신가요?' subText='여행 지역을 알려주세요.' />
			<VStack>
				<TimeContainer>
					<ASD>
						{[...Array(2)].map((item, idx) => (
							<>
								<TimeItemContainer key={idx}>
									<TimeStepText>{DaySelectInfoList[idx].step}</TimeStepText>
									<TimeItemText>{DaySelectInfoList[idx].title}</TimeItemText>
									<HStack>
										<DayPressable
											ref={calendarContainerRef}
											onPress={() => {
												calendarContainerRef.current?.measure(
													(x, y, width, height, pageX, pageY) => {
														console.log(pageX, pageY);
														setCalendarView({visible: true, x: pageX, y: pageY, when: idx});
													},
												);
											}}>
											<TimeItemText>
												{DaySelectInfoList[idx].day.format('YYYY-MM-DD')}
											</TimeItemText>
										</DayPressable>
										<TimePressable
											onPress={() => {
												onPressTime(idx);
											}}>
											<TimeItemText>
												{String(timeLimitArray[idx]).padStart(2, '0') +
													':' +
													String(minuteLimitArray[idx]).padStart(2, '0')}
											</TimeItemText>
										</TimePressable>
									</HStack>
								</TimeItemContainer>
							</>
						))}
					</ASD>
				</TimeContainer>
				<PreviewContainer>
					<PreviewText>이번여행은,</PreviewText>
					<PreviewText>
						<PreviewBoldText>
							{nDays == 0 ? '당일치기' : nDays + '박' + Number(nDays + 1) + '일'}
						</PreviewBoldText>
						{nDays == 0 ? ' ' : '동안'}여행할거에요 ✈
					</PreviewText>
					<PreviewText>
						<PreviewBoldText>
							{weekdays[selectStartDate.day()] +
								'요일 ' +
								String(timeLimitArray[0]).padStart(2, '0') +
								'시'}
						</PreviewBoldText>
						에 출발하고 👉
					</PreviewText>
					<PreviewText>
						<PreviewBoldText>
							{selectEndDate == null
								? weekdays[selectStartDate.day()] +
								  '요일 ' +
								  String(timeLimitArray[1]).padStart(2, '0') +
								  '시'
								: weekdays[selectEndDate.day()] +
								  '요일 ' +
								  String(timeLimitArray[1]).padStart(2, '0') +
								  '시'}
						</PreviewBoldText>
						에 돌아와요 👈
					</PreviewText>
				</PreviewContainer>
				<CustomButton
					label={'다음 (' + (viewComponent + 1) + '/5)'}
					onPress={() => {
						setViewComponent(viewComponent + 1);
					}}></CustomButton>
			</VStack>
			<DatePicker
				modal
				open={visible}
				mode='time'
				date={moment()
					.hours(timeLimitArray[dateFlag.current])
					.minutes(minuteLimitArray[dateFlag.current])
					.toDate()}
				onConfirm={onConfirm}
				onCancel={onCancel}
				minuteInterval={30}
				title={dateFlag.current ? '종료 시간' : '시작 시간'}
				cancelText='취소'
				confirmText='확인'
			/>
			<Modal
				animationType='fade'
				transparent={true}
				visible={calendarView.visible}
				onRequestClose={() => {
					setCalendarView({...calendarView, visible: false});
				}}>
				<ModalContainer
					onPress={() => {
						setCalendarView({...calendarView, visible: false});
					}}>
					<CalendarContainer x={calendarView.x} y={calendarView.y} when={calendarView.when}>
						<CalendarPicker
							width={300}
							weekdays={weekdays}
							months={months}
							minDate={calendarView.when == 1 ? selectStartDate.toDate() : new Date()}
							startFromMonday={false}
							onDateChange={onDateChange}
							showDayStragglers={false}
							previousTitle='이전 달'
							nextTitle='다음 달'
							allowBackwardRangeSelect={true}
							selectYearTitle='년도 선택'
						/>
					</CalendarContainer>
				</ModalContainer>
			</Modal>
		</MainContainer>
	);
}

const ModalContainer = styled.Pressable`
	flex-directrion: row;
	flex: 1;
`;
const CalendarContainer = styled.View<{x: number; y: number; when: number}>`
	background-color: white;
	border-width: 1px;
	border-radius: 10px;
	padding: 10px 0px 10px 0px;
	width: 300px;
	top: ${props => props.y + 40};
	left: ${props => (props.when == 0 ? props.x : props.x - 130)};
`;
export const TimeContainer = styled.View`
	width: 100%;
	margin: 50px 0px 0px 0px;
`;
export const TimeItemContainer = styled.View`
	width: 50%;
`;
export const TimeItemText = styled.Text`
	font-size: 16px;
	color: black;
	font-weight: bold;
`;
const TimePressable = styled.Pressable`
	border-width: 1px;
	align-items: center;
	justify-content: center;
	width: 30%;
	border-color: ${colors.border};
	border-radius: 10px;
	height: 40px;
	margin: 5px 0px 0px 0px;
`;
export const DayPressable = styled.Pressable`
	border-width: 1px;
	align-items: center;
	justify-content: center;
	width: 60%;
	border-color: ${colors.border};
	border-radius: 10px;
	height: 40px;
	margin: 5px 2px 0px 0px;
`;
export const TimeStepText = styled.Text`
	color: ${colors.selectButton};
	font-size: 16px;
	font-weight: bold;
`;

const PreviewText = styled.Text`
	font-size: 25px;
	font-weight: bold;
	color: black;
`;
const PreviewBoldText = styled.Text`
	font-size: 25px;
	font-weight: bold;
	color: ${colors.selectButton};
`;

const PreviewContainer = styled.View`
	width: 100%;
	margin: 50px 0px 50px 0px;
`;
const SelectDivide = styled.View`
	width: 2px;
	height: 50px;
	background-color: black;
	margin: 0px 0px 0px 0px;
`;

export const ASD = styled.View`
	display: inline-block;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`;
