import {useLayoutEffect, useRef, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import {Calendar, DateData, LocaleConfig} from 'react-native-calendars';
import DateTimePicker from 'react-native-modal-datetime-picker';
import CustomButton from '../../utill/component/custom-button';
import {Text, Box, ScrollView, VStack, HStack, Divider, Spacer, Pressable} from 'native-base';
export default function SelectDay({navigation}: any) {
	LocaleConfig.locales['fr'] = {
		monthNames: [
			'Janvier',
			'Février',
			'Mars',
			'Avril',
			'Mai',
			'Juin',
			'Juillet',
			'Août',
			'Septembre',
			'Octobre',
			'Novembre',
			'Décembre',
		],
		monthNamesShort: [
			'Janv.',
			'Févr.',
			'Mars',
			'Avril',
			'Mai',
			'Juin',
			'Juil.',
			'Août',
			'Sept.',
			'Oct.',
			'Nov.',
			'Déc.',
		],
		dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
		dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
		today: "Aujourd'hui",
	};
	LocaleConfig.defaultLocale = 'fr';
	const currentTime = new Date();
	currentTime.setMinutes(0);
	currentTime.setHours(10);
	const [startdate, onstartChangeDate] = useState(currentTime); // 선택 날짜
	const [enddate, onendChangeDate] = useState(currentTime);
	const dateFlag = useRef(0);
	const dayFlag = useRef(0);
	const [visible, setVisible] = useState(false);
	const {day, Place} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const nDay = day[1]?.timestamp - day[0]?.timestamp > 0 ? (day[1].timestamp - day[0].timestamp) / 86400000 : 0;

	const onConfirm = (selectedDate: Date) => {
		// 날짜 또는 시간 선택 시
		setVisible(false); // 모달 close
		let copy = [...day];
		copy[dateFlag.current] = {
			...day[dateFlag.current],
			hours: selectedDate.getHours(),
			minute: selectedDate.getMinutes(),
		};
		dispatch(travelSliceActions.selectDay(copy));
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
		dispatch(travelSliceActions.setNDay(nDay));
		const data = [...Array(nDay + 2)].map(item => {
			return Place;
		});
		let copy = [day[0].hours, day[1].hours];
		dispatch(travelSliceActions.enrollTimeLimitArray(copy));
		dispatch(travelSliceActions.enrollAccommodations(data));
		navigation.navigate('SelectMulti');
	};

	const addDay = (e: DateData) => {
		if (dayFlag.current > 1) {
			dayFlag.current = 0;
		}
		let copy = [...day];
		copy[dayFlag.current] = {...day[dayFlag.current], day: e.dateString, timestamp: e.timestamp, month: e.month};
		dayFlag.current += 1;
		dispatch(travelSliceActions.selectDay(copy));
	};

	const getNowTime = () => {
		let now = new Date();
		let year = now.getFullYear();
		let month = now.getMonth() + 1;
		let date = now.getDate();
		const nowTime = year + '-' + month + '-' + date;
		const nowTimes = [
			{...day[0], day: nowTime, hours: 10, minute: 0, month: month},
			{...day[1], day: nowTime, hours: 20, minute: 0, month: month},
		];
		dispatch(travelSliceActions.setDay(nowTimes));
	};
	const a = {
		[day[0]?.day]: {selected: true, color: 'blue', startingDay: true},
		[day[1]?.day]: {selected: true, color: 'blue', endingDay: true},
	};
	useLayoutEffect(() => {
		getNowTime();
	}, []);
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
							{day[0]?.day + '>' + day[1]?.day}
						</Text>
						<Spacer />
						<Text fontSize='lg' bold>
							{nDay + '박' + (nDay + 1) + '일'}
						</Text>
					</HStack>
				</Box>
				<Box>
					<HStack>
						{day.map((item, idx) => {
							return (
								<Box w='1/2' key={idx}>
									<Text bold fontSize='lg' mb='2'>
										{idx == 0 ? '시작 시간' : '종료 시간'}
									</Text>
									<Pressable
										onPress={() => {
											onPressTime(idx);
										}}
										borderWidth='1px'
										alignItems='center'
										w='80%'
										borderColor='grey'
										borderRadius='3px'>
										<Text fontSize='xl'>{item.hours + '시' + item.minute + '분'}</Text>
									</Pressable>
								</Box>
							);
						})}
					</HStack>
				</Box>
				<Divider my='1' />
				<Calendar
					current={day[0]?.day}
					minDate={day[0]?.day}
					monthFormat={'yyyy MM'}
					firstDay={1}
					disableAllTouchEventsForDisabledDays={false}
					onDayPress={day => {
						addDay(day);
					}}
					markingType='period'
					markedDates={a}
					//markedDates={{[Object.values(day)]: {selected: true, disableTouchEvent: true, color: 'red'}}}
				/>
				<CustomButton label='다음단계' onPress={goNext} />
			</VStack>

			<DateTimePicker
				isVisible={visible}
				mode='time'
				onConfirm={onConfirm}
				onCancel={onCancel}
				minuteInterval={30}
				date={dateFlag.current === 0 ? startdate : enddate}></DateTimePicker>
		</ScrollView>
	);
}
