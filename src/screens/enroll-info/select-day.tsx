import {useRef, useState, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import DatePicker from 'react-native-date-picker';
import CalendarPicker from 'react-native-calendar-picker';
import CustomButton from '../../utill/component/custom-button';
import {Text, Box, ScrollView, VStack, HStack, Divider, Spacer, Pressable} from 'native-base';
import moment, {Moment} from 'moment';
import {Alert} from 'react-native';

export default function SelectDay({navigation}: any) {
	const dateFlag = useRef(0);
	const [visible, setVisible] = useState(false);
	const {day, Place, timeLimitArray, minuteLimitArray} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();

	const weekdays = ['월', '화', '수', '목', '금', '토', '일'];
	const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
	const [selectedStartDate, setSelectedStartDate] = useState(moment());
	const [selectedEndDate, setSelectedEndDate] = useState<null | Moment>(null);

	const onConfirm = (selectedDate: Date) => {
		if (selectedDate.getHours() < 6) {
			Alert.alert('놉');
		} else {
			console.log(selectedDate.getHours());
			// 날짜 또는 시간 선택 시
			setVisible(false); // 모달 close
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
		const data = [...Array(nDay + 2)].map(item => {
			return Place;
		});
		let season = Array(4).fill(false);
		let index = Math.floor((selectedStartDate.month() + 1) / 3) - 1;
		index < 0 ? (season[3] = true) : (season[index] = true);
		let dateArray = [];
		let count = 0;
		let copySelectedStartDate = moment({...selectedStartDate});
		while (nDay > 4 ? copySelectedStartDate.isSameOrBefore(selectedEndDate) : count < 5) {
			dateArray.push(copySelectedStartDate.clone());
			copySelectedStartDate.add(1, 'day');
			count += 1;
		}
		dispatch(
			travelSliceActions.enrollDayInfo({
				day: dateArray,
				nDay: nDay,
				accommodations: data,
				season: season,
			}),
		);
		navigation.navigate('SelectMulti');
	};

	const onDateChange = (date: any, type: string) => {
		if (type === 'END_DATE') {
			setSelectedEndDate(date);
		} else {
			setSelectedStartDate(date);
			setSelectedEndDate(null);
		}
	};

	const calculateDateDifference = () => {
		if (selectedStartDate && selectedEndDate) {
			const diffInMilliseconds = selectedEndDate.diff(selectedStartDate);
			const duration = moment.duration(diffInMilliseconds);
			const days = duration.asDays();
			return Math.abs(days); // 절대값으로 반환 (음수 값 제거)
		}
		return 0;
	};

	const nDay = calculateDateDifference();
	const nowTime = new Date();

	const viewDate =
		selectedStartDate.format('YY-MM-DD') +
		'>' +
		(selectedEndDate ? selectedEndDate : selectedStartDate).format('YY-MM-DD');
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
							{nDay ? `${nDay}박 ${nDay + 1}일` : '당일'}
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
					startFromMonday={true}
					allowRangeSelection={true}
					onDateChange={onDateChange}
					minDate={nowTime}
					showDayStragglers={true}
					previousTitle='이전 달'
					nextTitle='다음 달'
					allowBackwardRangeSelect={true}
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
