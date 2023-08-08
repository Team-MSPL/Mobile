import {useState, useRef} from 'react';
import {Text, Box, ScrollView, VStack, Divider, Slider, Center, HStack, Spacer} from 'native-base';
import {useAppDispatch, useAppSelector} from '../../redux';
import {TouchableOpacity, Image} from 'react-native';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
export default function Modify({navigation, route}: any) {
	const {nDay, timetable, day} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const [visible, setVisible] = useState(false);

	const [changeDay, setChangeDay] = useState(route.params.item.value.x);
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
		let copy = [...timetable[changeDay]];
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
		let changeInputIndex = copy.findIndex(item => item.y >= newY);
		changeInputIndex = changeInputIndex == -1 ? copy.length : changeInputIndex;
		if (changeFlag) {
			console.log(changeFlag.name, '이랑 겹친다');
		} else {
			let copyValue = {
				...changeCopy[route.params.item.value.x][route.params.item.index],
				y: newY,
				x: changeDay,
				takenTime: (newEnd - newY) * 30,
			};
			let deleteCopy = [...timetable[route.params.item.value.x]];
			deleteCopy.splice(route.params.item.index, 1);
			changeCopy[route.params.item.value.x] = deleteCopy;
			console.log(changeCopy, '1');
			let addCopy = [...changeCopy[changeDay]];
			addCopy.splice(changeInputIndex, 0, copyValue);
			console.log('2', addCopy);
			changeCopy[changeDay] = addCopy;
			dispatch(travelSliceActions.changeTimetable(changeCopy));
			navigation.goBack();
		}
	};

	return (
		<Box>
			<Text>{route.params.item.value.name}</Text>
			{[...Array(nDay + 1)].map((item, idx) => (
				<TouchableOpacity
					style={{height: 100, alignItems: 'center'}}
					onPress={() => {
						setChangeDay(idx);
					}}>
					<Text>{visible ? 'dd' : 'ww'}</Text>
					<Text>날짜도 바꿔볼랭?</Text>
					<Text>{day[idx].format('YY-MM-DD')}눌러서 수정 ㄱ</Text>
				</TouchableOpacity>
			))}

			<TouchableOpacity
				style={{height: 100, alignItems: 'center'}}
				onPress={() => {
					flag.current = true;
					setVisible(true);
				}}>
				<Text>{visible ? 'dd' : 'ww'}</Text>
				<Text>
					앞에 시간 {startTime.current.hours}시 {startTime.current.minute}
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
			<DatePicker
				modal
				open={visible}
				mode='time'
				date={
					flag.current
						? moment().hours(startTime.current.hours).minutes(startTime.current.minute).toDate()
						: moment().hours(endTime.current.hours).minutes(endTime.current.minute).toDate()
				}
				onConfirm={onConfirm}
				onCancel={onCancel}
				minuteInterval={30}
				title={flag.current ? '시작 시간' : '종료 시간'}
				cancelText='취소'
				confirmText='확인'
			/>

			<TouchableOpacity onPress={goModify}>
				<Text>수정이요</Text>
			</TouchableOpacity>
		</Box>
	);
}
