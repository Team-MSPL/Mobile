import {useState, useRef} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {TouchableOpacity, Image} from 'react-native';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import {Alert, View} from 'react-native';
import styled from 'styled-components/native';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {colors} from '../../utill/colors';
import {
	ASD,
	DayPressable,
	TimeContainer,
	TimeItemContainer,
	TimeItemText,
	TimeStepText,
} from '../enroll-info/select-day';
import {Center, HStack, MainContainer} from '../../utill/layout/layout';
import CustomButton from '../../utill/component/custom-button';
import {DayButton, DayContainer, DaySubTitle, DayTitle} from './map-info';
export default function Modify({navigation, route}: any) {
	const {nDay, timetable, day} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const [visible, setVisible] = useState(false);

	const [changeDay, setChangeDay] = useState(route.params.item.value.x);
	const onConfirm = (data: any) => {
		flag.current
			? ((startTime.current.hours = data.getHours()), (startTime.current.minute = data.getMinutes()))
			: ((endTime.current.hours = data.getHours()), (endTime.current.minute = data.getMinutes()));
		setVisible(false);
	};
	const onCancel = () => {
		setVisible(false);
	};

	const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
	const startTime = useRef({
		hours: Math.floor((route.params.item.value.y * 30 + 360) / 60),
		minute: (((route.params.item.value.y * 30 + 360) / 60) % 1) * 60,
	});
	const endTime = useRef({
		hours: Math.floor(((route.params.item.value.y + route.params.item.value.takenTime / 30) * 30 + 360) / 60),
		minute: ((((route.params.item.value.y + route.params.item.value.takenTime / 30) * 30 + 360) / 60) % 1) * 60,
	});
	const DaySelectInfoList = [
		{
			step: 'Start',
			title: '시작 시간',
			hours: startTime.current.hours,
			minute: startTime.current.minute,
			function: () => {
				flag.current = true;
				setVisible(true);
			},
		},
		{
			step: 'End',
			title: '종료 시간',
			hours: endTime.current.hours,
			minute: endTime.current.minute,
			function: () => {
				flag.current = false;
				setVisible(true);
			},
		},
	];
	const flag = useRef(false);
	const goModify = () => {
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
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: `${changeFlag.name}과 겹치는 시간입니다!`,
				}),
			);
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
			let addCopy = [...changeCopy[changeDay]];
			addCopy.splice(changeInputIndex, 0, copyValue);
			changeCopy[changeDay] = addCopy;
			dispatch(travelSliceActions.changeTimetable(changeCopy));
			navigation.goBack();
		}
	};

	return (
		<MainContainer>
			<Center>
				<TimeItemText>{route.params.item.value.name}</TimeItemText>
			</Center>
			<DayContainer>
				{[...Array(nDay + 1)].map((item, idx) => (
					<DayButton
						key={idx}
						select={idx === changeDay}
						onPress={() => {
							setChangeDay(idx);
						}}>
						<DayTitle select={idx === changeDay}>{idx + 1 + '일차'}</DayTitle>
						<DaySubTitle select={idx === changeDay}>
							{moment(day[idx]).format('M월 D일')}({weekdays[moment(day[idx]).day()]})
						</DaySubTitle>
					</DayButton>
				))}
			</DayContainer>
			<TimeContainer>
				<ASD>
					{DaySelectInfoList.map((item, idx) => (
						<>
							<TimeItemContainer key={idx}>
								<TimeStepText>{item.step}</TimeStepText>
								<TimeItemText>{item.title}</TimeItemText>
								<HStack>
									<DayElementContainer onPress={item.function}>
										<TimeItemText>
											{String(item.hours).padStart(2, '0')}:{String(item.minute).padStart(2, '0')}
										</TimeItemText>
									</DayElementContainer>
								</HStack>
							</TimeItemContainer>
						</>
					))}
				</ASD>
			</TimeContainer>
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
			<CustomButton label='수정하기' onPress={goModify}></CustomButton>
		</MainContainer>
	);
}
const DayElementContainer = styled(DayPressable)`
	width: 80%;
`;
