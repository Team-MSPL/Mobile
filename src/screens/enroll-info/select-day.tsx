import {useRef, useState, useLayoutEffect, Fragment} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {PlaceType, travelSliceActions} from '../../redux/travel-info/travel.slice';
import CalendarPicker from 'react-native-calendar-picker';
import CustomButton from '../../utill/component/custom-button';
import moment, {Moment} from 'moment';
import StepText from '../../utill/component/enroll-info/step-text';
import {VStack, HStack, BackgroundGray, PretendardSemiBold, PretendardVariable} from '../../utill/layout/layout';
import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import {Modal, Pressable, View} from 'react-native';

import {ButtonContainer, MarginContainder} from './select-multi';
import UseDatePicker from '../../utill/hooks/useDatePicker';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import Stepper from '../../utill/component/enroll-info/stepper';
import {fontPercentage, heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
export default function SelectDay({navigation}: any) {
	const dateFlag = useRef(0);
	const [visible, setVisible] = useState(false);
	const {Place, timeLimitArray, minuteLimitArray, accommodations, selectStartDate, selectEndDate} = useAppSelector(
		state => state.travelSlice,
	);
	const dispatch = useAppDispatch();

	const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
	const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

	const onPressTime = (e: number) => {
		if (visible) {
			setVisible(false);
		} else {
			dateFlag.current = e;
			setVisible(true);
		}
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
		if (dateFlag.current == 0 && timeData.ampm == '오전' && parseInt(timeData.hour) < 6) {
			dispatch(modalSliceActions.setOpenModal({modalTitle: '첫날 시작은 06시 이후부터 가능합니다.'}));
			return false;
		} else if (dateFlag.current == 1 && timeData.ampm == '오전') {
			dispatch(modalSliceActions.setOpenModal({modalTitle: '13시 이전은 불가능합니다.'}));
			return false;
		} else {
			let timeCopy = [...timeLimitArray];
			let ampmCheck = timeData.ampm == '오후' ? 12 : 0;
			timeCopy[dateFlag.current] = parseInt(timeData.hour) + ampmCheck;
			let minuteCopy = [...minuteLimitArray];
			minuteCopy[dateFlag.current] = parseInt(timeData.minute);
			dispatch(travelSliceActions.setTimeAndMinute({time: timeCopy, minute: minuteCopy}));
			return true;
			// setVisible(false);
		}
	};
	const onDateChange = (date: any, type: string) => {
		if (type == 'END_DATE') {
			dispatch(travelSliceActions.enrollSelectEndDate(date));
		} else {
			selectEndDate && selectEndDate.diff(date) <= 0 && dispatch(travelSliceActions.enrollSelectEndDate(date));
			dispatch(travelSliceActions.enrollSelectStartDate(date));
		}
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
	const DaySelectInfoList = [
		{step: '출발', title: '여행 시작', day: selectStartDate},
		{step: '도착', title: '여행 종료', day: selectEndDate == null ? selectStartDate : selectEndDate},
	];

	return (
		<DayBackground
			onPress={() => {
				setVisible(false);
			}}>
			<Stepper total={11} now={3}></Stepper>
			<StepText
				marginTop={heightPercentage(10)}
				styleText='1.여행 계획을 알려주세요.'
				mainText='언제 떠나시나요?'
				subText='여행을 떠날 출발일과 도착일을 선택해주세요.'></StepText>
			<VStack>
				<TimeContainer>
					{DaySelectInfoList.map((item, idx) => (
						<TimeItemContainer key={idx}>
							<TimeStepText>{item.step}</TimeStepText>
							<SelectContainer>
								<SelectText>
									{item.day.format('YY.MM.DD')} ({weekdays[item.day.day()]})
								</SelectText>
							</SelectContainer>
							<SelectContainer
								onPress={() => {
									onPressTime(idx);
								}}>
								<HStack justifyContent='space-between'>
									<SelectText>{timeLimitArray[idx] < 12 ? 'AM' : 'PM'}</SelectText>
									<SelectText>{String(timeLimitArray[idx]).padStart(2, '0')}</SelectText>
									<SelectText>:</SelectText>
									<SelectText>{String(minuteLimitArray[idx]).padStart(2, '0')}</SelectText>
								</HStack>
							</SelectContainer>
							{dateFlag.current == idx && (
								<SelectAbsolute>
									<UseDatePicker
										title={dateFlag.current == 0 ? '시작 시간' : '종료 시간'}
										goConfirm={goConfirm}
										minuteData={minuteLimitArray[dateFlag.current] / 30}
										ampmData={timeLimitArray[dateFlag.current] < 12 ? 0 : 1}
										hourData={
											timeLimitArray[dateFlag.current] < 12
												? timeLimitArray[dateFlag.current]
												: timeLimitArray[dateFlag.current] - 12
										}
										visible={visible}
										setVisible={setVisible}></UseDatePicker>
								</SelectAbsolute>
							)}
						</TimeItemContainer>
					))}
				</TimeContainer>
			</VStack>
			<CalendarContainer>
				<CalendarPicker
					weekdays={weekdays}
					months={months}
					minDate={new Date()}
					startFromMonday={false}
					onDateChange={onDateChange}
					showDayStragglers={false}
					allowRangeSelection={true}
					selectedRangeStartStyle={{backgroundColor: colors.Primary}}
					selectedRangeStyle={{backgroundColor: colors.PointGreen3}}
					selectedRangeEndStyle={{backgroundColor: colors.Primary}}
					selectedDayColor={colors.Primary}
					previousTitle='이전 달'
					nextTitle='다음 달'
					previousTitleStyle={{color: 'black'}}
					nextTitleStyle={{color: 'black'}}
					allowBackwardRangeSelect={true}
					selectYearTitle='년도 선택'
				/>
			</CalendarContainer>
			<CustomButton
				label={`다음`}
				onPress={() => {
					navigation.navigate('SelectMulti');
				}}></CustomButton>
		</DayBackground>
	);
}
const CalendarContainer = styled.View`
	flex: 1;
	justify-content: center;
`;
const DayBackground = styled(BackgroundGray).attrs({as: Pressable})``;
const SelectAbsolute = styled.View`
	z-index: 2;
	position: absolute;
	bottom: -${heightPercentage(122)}px;
`;
const SelectContainer = styled.Pressable`
	width: ${widthPercentage(157)}px;
	height: ${heightPercentage(40)}px;
	background-color: ${colors.backgroundWhite};
	border-radius: 12px;
	padding: 0px ${widthPercentage(16)}px;
	justify-content: center;
	margin-bottom: ${heightPercentage(6)}px;
`;
const SelectText = styled(PretendardSemiBold)`
	font-size: ${fontPercentage(13)}px;
	color: ${colors.Black};
`;
export const TimeContainer = styled.View`
	flex-direction: row;
	margin-top: ${heightPercentage(10)}px;
`;
export const TimeItemContainer = styled.View`
	width: 50%;
	gap: ${heightPercentage(5)}px;
`;
export const TimeItemText = styled.Text`
	font-size: 15px;
	color: black;
	font-weight: bold;
	margin: 0px 12px 0px 0px;
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
export const TimeStepText = styled(PretendardVariable)`
	color: ${colors.PointYellow};
	font-size: ${fontPercentage(12)}px;
	margin-left: ${widthPercentage(10)}px;
`;
