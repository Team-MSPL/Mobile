import {useState, useRef} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import moment from 'moment';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import styled from 'styled-components/native';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {DayPressable, TimeContainer, TimeItemContainer, TimeItemText, TimeStepText} from '../enroll-info/select-day';
import {Center, HStack, MainContainer} from '../../utill/layout/layout';
import CustomButton from '../../utill/component/custom-button';
import {DayButton, DayContainer, DaySubTitle, DayTitle} from './map-info';
import UseDatePicker from '../../utill/hooks/useDatePicker';
import Icon from 'react-native-vector-icons/AntDesign';
export default function Modify({navigation, route}: any) {
	const {nDay, timetable, day} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const [visible, setVisible] = useState(false);
	const Icons = styled(Icon)``;
	const [changeDay, setChangeDay] = useState(route.params.item.value.x);
	const onConfirm = (timeData: {hour: string; ampm: string; minute: string}) => {
		console.log(timeData.ampm, 'ndoasndkl');
		const ampm = timeData.ampm == '오전' ? 0 : 12;
		flag.current == 0
			? ((startTime.current.hours = parseInt(timeData.hour) + ampm),
			  (startTime.current.minute = parseInt(timeData.minute)))
			: ((endTime.current.hours = parseInt(timeData.hour) + ampm),
			  (endTime.current.minute = parseInt(timeData.minute)));
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
				flag.current = 0;
				setVisible(true);
			},
		},
		{
			step: 'End',
			title: '종료 시간',
			hours: endTime.current.hours,
			minute: endTime.current.minute,
			function: () => {
				flag.current = 1;
				setVisible(true);
			},
		},
	];
	const flag = useRef(0);
	const goModify = () => {
		const newY = (startTime.current.hours * 60 - 360) / 30 + startTime.current.minute / 30;
		const newEnd =
			((startTime.current.hours > endTime.current.hours ? endTime.current.hours + 24 : endTime.current.hours) *
				60 -
				360) /
				30 +
			endTime.current.minute / 30;
		console.log(newY, newEnd);
		if (newEnd >= 49) {
			dispatch(modalSliceActions.setOpenModal({modalTitle: '시간을 다시 설정해주세요.'}));
		} else {
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
			changeInputIndex =
				changeInputIndex == -1
					? copy.length
					: changeInputIndex - (changeDay == route.params.item.value.x ? 1 : 0);
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
		}
	};

	return (
		<>
			<MainContainer>
				<Center>
					<TimeItemText>{route.params.item.value.name}</TimeItemText>
				</Center>
				<DayContainer horizontal={true} showsHorizontalScrollIndicator={false}>
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
					{DaySelectInfoList.map((item, idx) => (
						<TimeItemContainer key={idx}>
							<TimeStepText>{item.step}</TimeStepText>
							<TimeItemText>{item.title}</TimeItemText>
							<HStack>
								<DayElementContainer onPress={item.function}>
									<TimeItemText>
										{String(item.hours >= 24 ? item.hours - 24 : item.hours).padStart(2, '0')}:
										{String(item.minute).padStart(2, '0')}
									</TimeItemText>
									<Icons name={'down'} size={20} color={'black'} />
								</DayElementContainer>
							</HStack>
						</TimeItemContainer>
					))}
				</TimeContainer>
				<CustomButton label='수정하기' onPress={goModify}></CustomButton>
			</MainContainer>
			<UseDatePicker
				title={flag.current == 0 ? '시작 시간' : '종료 시간'}
				goConfirm={onConfirm}
				minuteData={flag.current == 0 ? startTime.current.minute / 30 + 1 : endTime.current.minute / 30 + 1}
				ampmData={
					flag.current == 0 ? (startTime.current.hours < 12 ? 1 : 2) : endTime.current.hours < 12 ? 1 : 2
				}
				hourData={
					flag.current == 0
						? (startTime.current.hours < 12 ? startTime.current.hours : startTime.current.hours - 12) + 1
						: (endTime.current.hours < 12 ? endTime.current.hours : endTime.current.hours - 12) + 1
				}
				visible={visible}
				setVisible={setVisible}></UseDatePicker>
		</>
	);
}
const DayElementContainer = styled(DayPressable)`
	width: 100%;
`;
