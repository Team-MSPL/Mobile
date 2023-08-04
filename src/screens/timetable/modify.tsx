import {useState, useRef} from 'react';
import {Text, Box, ScrollView, VStack, Divider, Slider, Center, HStack, Spacer} from 'native-base';
import {useAppDispatch, useAppSelector} from '../../redux';
import {TouchableOpacity, Image} from 'react-native';

import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
export default function Modify({navigation, route}: any) {
	const {courseDetail, timetable} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const [visible, setVisible] = useState(false);
	const onConfirm = (data: any) => {
		console.log(data.getHours());
		flag.current
			? ((startTime.current.hours = data.getHours()), (startTime.current.minute = data.getMinutes()))
			: ((endTime.current.hours = data.getHours()), (endTime.current.minute = data.getMinutes()));
		setVisible(false);
	};
	const onCancel = () => {
		setVisible(false);
	};
	const startTime = useRef({
		hours: Math.floor((route.params.item.value.y * 30 + 360) / 60),
		minute: (((route.params.item.value.y * 30 + 360) / 60) % 1) * 60,
	});
	const endTime = useRef({
		hours: Math.floor(((route.params.item.value.y + route.params.item.value.takenTime / 30) * 30 + 360) / 60),
		minute: ((((route.params.item.value.y + route.params.item.value.takenTime / 30) * 30 + 360) / 60) % 1) * 60,
	});
	const flag = useRef(false);
	const goModify = () => {
		//console.log('d', startTime.current.minute);
		const newY = (startTime.current.hours * 60 - 360) / 30 + startTime.current.minute / 30;
		const newEnd = (endTime.current.hours * 60 - 360) / 30 + endTime.current.minute / 30;
		let copy = [...timetable[route.params.item.value.x]];
		let changeCopy = [...timetable];
		let changeFlag = null;
		//부터 가능
		for (let i = 0; i < copy.length; i++) {
			if (
				((newY <= copy[i]?.y && newEnd > copy[i]?.y) ||
					(newY <= copy[i]?.y + copy[i].takenTime / 30 - 1 &&
						newEnd > copy[i]?.y + copy[i].takenTime / 30 - 1)) &&
				copy[i].id != route.params.item.value.id
			) {
				changeFlag = copy[i];
				break;
			}
		}
		changeFlag
			? console.log(changeFlag.name, '이랑 겹친다')
			: ((copy[route.params.item.index] = {
					...copy[route.params.item.index],
					y: newY,
					takenTime: (newEnd - newY) * 30,
			  }),
			  (changeCopy[route.params.item.value.x] = copy),
			  dispatch(travelSliceActions.changeTimetable(changeCopy)),
			  navigation.goBack());
	};
	return (
		<Box>
			<Text>{route.params.item.value.name}</Text>
			<TouchableOpacity
				style={{height: 100, alignItems: 'center'}}
				onPress={() => {
					flag.current = true;
					setVisible(true);
				}}>
				<Text>{visible ? 'dd' : 'ww'}</Text>
				<Text>
					앞에 시간 {startTime.current.hours}시 {startTime.current.minute}{' '}
				</Text>
				<Text>눌러서 수정 ㄱ</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={{height: 100, alignItems: 'center'}}
				onPress={() => {
					flag.current = false;
					setVisible(true);
				}}>
				<Text>
					뒤에 시간 {endTime.current.hours}시 {endTime.current.minute}
				</Text>
				<Text>눌러서 수정 ㄱ</Text>
			</TouchableOpacity>
			<DateTimePicker
				isVisible={visible}
				mode='time'
				onConfirm={onConfirm}
				onCancel={onCancel}
				minuteInterval={30}
				date={
					flag.current
						? moment().hours(startTime.current.hours).minutes(startTime.current.minute).toDate()
						: moment().hours(endTime.current.hours).minutes(endTime.current.minute).toDate()
				}></DateTimePicker>
			<TouchableOpacity onPress={goModify}>
				<Text>수정이요</Text>
			</TouchableOpacity>
		</Box>
	);
}
