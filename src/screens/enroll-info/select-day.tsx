import {useRef, useState, useLayoutEffect, Fragment} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {PlaceType, travelSliceActions} from '../../redux/travel-info/travel.slice';
import CalendarPicker from 'react-native-calendar-picker';
import CustomButton from '../../utill/component/custom-button';
import moment, {Moment} from 'moment';
import StepText from '../../utill/component/enroll-info/step-text';
import {Divider, VStack, HStack, MainContainer} from '../../utill/layout/layout';
import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import {Modal, View} from 'react-native';

import Icon from 'react-native-vector-icons/AntDesign';

import {ButtonContainer, MarginContainder} from './select-multi';
import UseDatePicker from '../../utill/hooks/useDatePicker';
import {modalSliceActions} from '../../redux/modal/modalSlice';
export default function SelectDay({setViewComponent, viewComponent, goNextStep}: any) {
	const IconElement = styled(Icon)``;
	const dateFlag = useRef(0);
	const [visible, setVisible] = useState(false);
	const {
		day,
		Place,
		timeLimitArray,
		minuteLimitArray,
		regionRecommendFlag,
		accommodations,
		selectStartDate,
		selectEndDate,
	} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();

	const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
	const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

	const onPressTime = (e: number) => {
		dateFlag.current = e;
		setVisible(true);
	};
	useLayoutEffect(() => {
		goNext();
	}, [selectStartDate, selectEndDate]);
	const goNext = () => {
		let data: PlaceType[] = [];
		const checkDays = calculateDateDifference();
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
		dispatch(
			travelSliceActions.enrollDayInfo({
				day: dateArray,
				nDay: checkDays,
				accommodations: data.length == 0 ? accommodations : data,
				season: season,
			}),
		);
	};
	const goConfirm = (timeData: {hour: string; ampm: string; minute: string}) => {
		console.log(timeData);
		if (dateFlag.current == 1 && timeData.ampm == '오전') {
			dispatch(modalSliceActions.setOpenModal({modalTitle: '13시 이전은 불가능합니다.'}));
		} else {
			let timeCopy = [...timeLimitArray];
			let ampmCheck = timeData.ampm == '오후' ? 12 : 0;
			timeCopy[dateFlag.current] = parseInt(timeData.hour) + ampmCheck;
			let minuteCopy = [...minuteLimitArray];
			minuteCopy[dateFlag.current] = parseInt(timeData.minute);
			dispatch(travelSliceActions.setTimeAndMinute({time: timeCopy, minute: minuteCopy}));
			setVisible(false);
		}
	};
	const onDateChange = (date: any, type: string) => {
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

	const customDate = [
		{
			date: calendarView.when == 1 ? DaySelectInfoList[1].day.clone() : selectStartDate.clone(),
			style: {backgroundColor: colors.regionNormal},
			allowDisabled: true,
		},
	];
	return (
		<>
			<MainContainer showsVerticalScrollIndicator={false}>
				<StepText mainText='언제 여행을 계획하고 계신가요?' subText='여행 일정을 알려주세요.' />
				<VStack>
					<TimeContainer>
						{[...Array(2)].map((item, idx) => (
							<Fragment key={idx}>
								<TimeItemContainer>
									<TimeStepText>{DaySelectInfoList[idx].step}</TimeStepText>
									<TimeItemText>{DaySelectInfoList[idx].title}</TimeItemText>
									<TiemSelectContainer>
										<DayPressable
											ref={calendarContainerRef}
											onPress={() => {
												calendarContainerRef.current?.measure(
													(x, y, width, height, pageX, pageY) => {
														console.log(pageX, pageY);
														setCalendarView({
															visible: true,
															x: pageX,
															y: pageY,
															when: idx,
														});
													},
												);
											}}>
											<TimeItemText>
												{DaySelectInfoList[idx].day.format('YYYY-MM-DD')}
											</TimeItemText>
											<IconElement name={'down'} size={16} color='black' />
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

											<IconElement name={'down'} size={16} color='black' />
										</TimePressable>
									</TiemSelectContainer>
								</TimeItemContainer>
							</Fragment>
						))}
					</TimeContainer>
					<PreviewContainer>
						<PreviewText>이번 여행은,</PreviewText>
						<PreviewText>
							<PreviewBoldText>
								{nDays == 0 ? '당일치기' : nDays + '박' + Number(nDays + 1) + '일'}
							</PreviewBoldText>
							{nDays == 0 ? ' ' : '동안 '}여행할 거에요 ✈
						</PreviewText>
						<PreviewText>
							<PreviewBoldText>
								{weekdays[selectStartDate.day()] +
									'요일 ' +
									String(timeLimitArray[0]).padStart(2, '0') +
									'시 ' +
									String(minuteLimitArray[0]).padStart(2, '0') +
									'분'}
							</PreviewBoldText>
							에 출발하고 👉
						</PreviewText>
						<PreviewText>
							<PreviewBoldText>
								{selectEndDate == null
									? weekdays[selectStartDate.day()]
									: weekdays[selectEndDate.day()]}
								{'요일 ' +
									String(timeLimitArray[1]).padStart(2, '0') +
									'시 ' +
									String(minuteLimitArray[1]).padStart(2, '0') +
									'분'}
							</PreviewBoldText>
							에 돌아와요 👈
						</PreviewText>
					</PreviewContainer>
				</VStack>
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
								todayBackgroundColor='white'
								customDatesStyles={customDate}
								weekdays={weekdays}
								months={months}
								minDate={calendarView.when == 1 ? selectStartDate.toDate() : new Date()}
								startFromMonday={false}
								onDateChange={onDateChange}
								showDayStragglers={false}
								previousTitle='이전 달'
								nextTitle='다음 달'
								previousTitleStyle={{color: 'black'}}
								nextTitleStyle={{color: 'black'}}
								allowBackwardRangeSelect={true}
								selectYearTitle='년도 선택'
							/>
						</CalendarContainer>
					</ModalContainer>
				</Modal>
				<MarginContainder />
			</MainContainer>
			<UseDatePicker
				title={dateFlag.current == 0 ? '시작 시간' : '종료 시간'}
				goConfirm={goConfirm}
				minuteData={minuteLimitArray[dateFlag.current] / 30 + 1}
				ampmData={timeLimitArray[dateFlag.current] < 12 ? 1 : 2}
				hourData={
					(timeLimitArray[dateFlag.current] < 12
						? timeLimitArray[dateFlag.current]
						: timeLimitArray[dateFlag.current] - 12) + 1
				}
				visible={visible}
				setVisible={setVisible}></UseDatePicker>

			<ButtonContainer>
				<CustomButton
					label={`다음 (${viewComponent + 1}/${regionRecommendFlag ? 3 : 5})`}
					onPress={goNextStep}></CustomButton>
			</ButtonContainer>
		</>
	);
}
const TiemSelectContainer = styled(HStack)`
	width: 100%;
	justify-content: space-around;
`;
const ModalContainer = styled.Pressable`
	flex-directrion: row;
	flex: 1;
`;
const CalendarContainer = styled.View<{x: number; y: number; when: number}>`
	background-color: ${colors.main};
	border-width: 1px;
	border-radius: 10px;
	padding: 10px 0px 10px 0px;
	top: ${props => props.y + 40}px;
`;
export const TimeContainer = styled.View`
	width: 100%;
	margin: 0px 0px 0px 0px;
`;
export const TimeItemContainer = styled.View`
	width: 100%;
	margin: 0px 0px 10px 0px;
`;
export const TimeItemText = styled.Text`
	font-size: 15px;
	color: black;
	font-weight: bold;
	margin: 0px 12px 0px 0px;
`;
const TimePressable = styled.Pressable`
	align-items: center;
	justify-content: center;
	height: 40px;
	margin: 5px 0px 0px 0px;
	flex-direction: row;
	border-bottom-color: ${colors.regionNormal};
	border-bottom-width: 1px;
`;
export const DayPressable = styled.Pressable`
	align-items: center;
	justify-content: center;
	height: 40px;
	margin: 5px 2px 0px 0px;
	flex-direction: row;
	border-bottom-width: 1px;
	border-bottom-color: ${colors.regionNormal};
`;
export const TimeStepText = styled.Text`
	color: ${colors.selectButton};
	font-size: 16px;
	font-weight: bold;
`;

const PreviewText = styled.Text`
	font-size: 23px;
	font-weight: 400;
	color: black;
`;
const PreviewBoldText = styled.Text`
	font-size: 23px;
	font-weight: bold;
	color: ${colors.selectButton};
`;

const PreviewContainer = styled.View`
	width: 100%;
	margin: 50px 0px 50px 0px;
`;
