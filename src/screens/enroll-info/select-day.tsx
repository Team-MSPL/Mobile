import {useNavigation} from '@react-navigation/native';
import {Text, Box, ScrollView, VStack, HStack, Divider, Spacer, Pressable} from 'native-base';
import {useLayoutEffect, useRef, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import CustomButton from '../../utill/component/custom-button';
import {Calendar, DateData, LocaleConfig} from 'react-native-calendars';
import DateTimePicker from 'react-native-modal-datetime-picker';
export default function SelectDay() {
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
	const [startdate, onstartChangeDate] = useState(currentTime); // 선택 날짜
	const [enddate, onendChangeDate] = useState(currentTime);
	const dateFlag = useRef('start');
	const [select, setSelect] = useState(0);
	const [visible, setVisible] = useState(false);
	const navigation = useNavigation();
	const {day} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();

	const onConfirm = (selectedDate: Date) => {
		// 날짜 또는 시간 선택 시
		setVisible(false); // 모달 close
		dateFlag.current === 'start' ? onstartChangeDate(selectedDate) : onendChangeDate(selectedDate);
	};

	const onCancel = () => {
		// 취소 시
		setVisible(false); // 모달 close
	};

	const onPressTime = (e: string) => {
		dateFlag.current = e;
		setVisible(true);
	};

	const goNext = () => {
		navigation.navigate('SelectDay');
	};

	const addDay = (e: DateData) => {
		// if (day.length) let copy = [...day];
		// copy = copy.push(e);
		// dispatch(travelSliceActions.selectDay(copy));
	};
	const getNowTime = () => {
		let now = new Date();
		let year = now.getFullYear();
		let month = now.getMonth() + 1;
		let date = now.getDate();
		const nowTime = year + '-' + month + '-' + date;
		const nowTimes = [nowTime, nowTime];
		dispatch(travelSliceActions.setDay(nowTimes));
	};
	const a = {
		'2023-07-11': {select: true, color: 'red', startingDay: true},
		'2023-07-13': {select: true, color: 'red', endingDay: true},
	};
	const viewDay =
		day[0] +
		'-' +
		startdate.getHours() +
		':' +
		startdate.getMinutes() +
		' > ' +
		day[1] +
		'-' +
		enddate.getHours() +
		':' +
		enddate.getMinutes();

	const startDataView = useLayoutEffect(() => {
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
							{viewDay}
						</Text>
						<Spacer />
						<Text>{enddate.getDay() - startdate.getDay()}</Text>
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
									onPressTime('start');
								}}
								borderWidth='1px'
								alignItems='center'
								w='80%'
								borderColor='grey'
								borderRadius='3px'>
								<Text fontSize='xl'>{startdate.getHours() + '시' + startdate.getMinutes() + '분'}</Text>
							</Pressable>
						</Box>
						<Box w='1/2'>
							<Text bold fontSize='lg' mb='2'>
								종료 시간
							</Text>
							<Pressable
								borderWidth='1px'
								alignItems='center'
								w='80%'
								borderColor='grey'
								borderRadius='3px'
								onPress={() => {
									onPressTime('end');
								}}>
								<Text fontSize='xl'>{enddate.getHours() + '시' + enddate.getMinutes() + '분'}</Text>
							</Pressable>
						</Box>
					</HStack>
				</Box>
				<Divider my='1' />
				<Calendar
					current={day[0]}
					minDate={day[0]}
					monthFormat={'yyyy MM'}
					firstDay={1}
					disableAllTouchEventsForDisabledDays={false}
					onDayPress={day => {
						addDay(day);
						console.log(day.timestamp);
						console.log(day.dateString);
						// addDay(day.dateString);
					}}
					markingType='period'
					markedDates={a}
				/>
				<CustomButton label='다음단계' onPress={goNext} />
			</VStack>

			<DateTimePicker
				isVisible={visible}
				mode='time'
				onConfirm={onConfirm}
				onCancel={onCancel}
				minuteInterval={30}
				date={dateFlag.current === 'start' ? startdate : enddate}></DateTimePicker>
		</ScrollView>
	);
}
