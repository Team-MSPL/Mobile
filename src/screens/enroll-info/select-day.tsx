import {useRef, useState, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {PlaceType, travelSliceActions} from '../../redux/travel-info/travel.slice';
import DatePicker from 'react-native-date-picker';
import CalendarPicker from 'react-native-calendar-picker';
import CustomButton from '../../utill/component/custom-button';
import {Text, Box, ScrollView, VStack, HStack, Divider, Spacer, Pressable} from 'native-base';
import moment, {Moment} from 'moment';
import {Alert} from 'react-native';
import {modalSliceActions} from '../../redux/modal/modalSlice';

export default function SelectDay({navigation}: any) {
	const dateFlag = useRef(0);
	const [visible, setVisible] = useState(false);
	const {day, Place, timeLimitArray, minuteLimitArray, nDay, accommodations, selectStartDate, selectEndDate} =
		useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();

	const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
	const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
	// const [selectStartDate, setSelectedStartDate] = useState(day[0] ?? moment());
	// const [selectEndDate, setSelectedEndDate] = useState<null | Moment>(day[nDay] ?? null);
	const [stepCheck, setStepCheck] = useState(false);

	const onConfirm = (selectedDate: Date) => {
		setVisible(false); // 모달 close
		if (selectedDate.getHours() < 13) {
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
			data = [...Array(nDays + 2)].map(item => {
				return Place;
			});
		}

		let season = Array(4).fill(false);
		let index = Math.floor((selectStartDate.month() + 1) / 3) - 1;
		index < 0 ? (season[3] = true) : (season[index] = true);
		let dateArray = [];
		let count = 0;
		let copySelectedStartDate = moment({...selectStartDate});
		while (nDays > 4 ? copySelectedStartDate.isSameOrBefore(selectEndDate) : count < 5) {
			dateArray.push(copySelectedStartDate.clone());
			copySelectedStartDate.add(1, 'day');
			count += 1;
		}
		dispatch(
			travelSliceActions.enrollDayInfo({
				day: dateArray,
				nDay: nDays,
				accommodations: data.length == 0 ? accommodations : data,
				season: season,
			}),
		);
		navigation.navigate('SelectMulti');
	};

	const onDateChange = (date: any, type: string) => {
		if (type === 'END_DATE') {
			setStepCheck(true);
			// setSelectedEndDate(date);
			dispatch(travelSliceActions.enrollSelectEndDate(date));
		} else {
			dispatch(travelSliceActions.enrollSelectStartDate(date));
			// setSelectedStartDate(date);
			// setSelectedEndDate(null);
		}
	};

	const calculateDateDifference = () => {
		if (selectStartDate && selectEndDate) {
			const diffInMilliseconds = selectEndDate.diff(selectStartDate);
			const duration = moment.duration(diffInMilliseconds);
			const days = duration.asDays();
			return Math.abs(days); // 절대값으로 반환 (음수 값 제거)
		}
		return 0;
	};

	const nDays = calculateDateDifference();
	const nowTime = new Date();

	const viewDate =
		selectStartDate.format('YY-MM-DD') + '>' + (selectEndDate ? selectEndDate : selectStartDate).format('YY-MM-DD');
	return (
		<ScrollView bgColor='#EFFBFB' p='2'>
			{/* 스테퍼 넣기 */}
			<VStack>
				<Text fontSize='2xl' bold color='black'>
					여행 일정 등록
				</Text>
				<Text fontSize='md' color='grey'>
					여행 지역을 알려주세요.
				</Text>
			</VStack>
			<Divider my='5' />
			<VStack space='5'>
				<Box w='full' borderRadius='10px' h='60px' bgColor='blue.200'>
					<HStack>
						<Text mr='2'>시계</Text>
						<Text fontSize='lg' bold>
							{viewDate}
						</Text>
						<Spacer />
						<Text fontSize='lg' bold>
							{nDays ? `${nDays}박 ${nDays + 1}일` : '당일'}
						</Text>
					</HStack>
				</Box>
				<Box>
					<HStack>
						<Box w='1/2'>
							<Text bold fontSize='lg' mb='2'>
								시작 시간
							</Text>
							<Pressable
								onPress={() => {
									onPressTime(0);
								}}
								borderWidth='1px'
								alignItems='center'
								w='80%'
								borderColor='grey'
								borderRadius='3px'>
								<Text fontSize='xl'>{timeLimitArray[0] + '시' + minuteLimitArray[0] + '분'}</Text>
							</Pressable>
						</Box>
						<Box w='1/2'>
							<Text bold fontSize='lg' mb='2'>
								종료 시간
							</Text>
							<Pressable
								onPress={() => {
									onPressTime(1);
								}}
								borderWidth='1px'
								alignItems='center'
								w='80%'
								borderColor='grey'
								borderRadius='3px'>
								<Text fontSize='xl'>{timeLimitArray[1] + '시' + minuteLimitArray[1] + '분'}</Text>
							</Pressable>
						</Box>
					</HStack>
				</Box>
				<Divider my='1' />
				<CalendarPicker
					weekdays={weekdays}
					months={months}
					startFromMonday={false}
					allowRangeSelection={true}
					onDateChange={onDateChange}
					minDate={nowTime}
					showDayStragglers={false}
					previousTitle='이전 달'
					nextTitle='다음 달'
					allowBackwardRangeSelect={true}
					selectYearTitle='년도 선택'
					selectedStartDate={!stepCheck && !selectEndDate ? undefined : new Date(selectStartDate.toString())}
					selectedEndDate={selectEndDate ? new Date(selectEndDate?.toString()) : undefined}
				/>
				<CustomButton label='다음단계' onPress={goNext} />
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
		</ScrollView>
	);
}
