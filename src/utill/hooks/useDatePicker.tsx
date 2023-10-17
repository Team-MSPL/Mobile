import {Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState} from 'react';
import {Modal, Dimensions, ScrollView} from 'react-native';
import styled from 'styled-components/native';
import {HStack, MainContainer, VStack} from '../layout/layout';
import {useAppDispatch, useAppSelector} from '../../redux';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {colors} from '../colors';

export default function UseDatePicker({visible, setVisible, when}: PickerType) {
	const ampmList = ['', '오전', '오후', ''];
	const hourList = ['', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', ''];
	const minuteList = ['', '0', '30', ''];
	const [ampm, setAmpm] = useState(0);
	const [hour, setHour] = useState(0);
	const [minute, setMinute] = useState(0);
	const dispatch = useAppDispatch();
	const deviceHeight = Dimensions.get('window').height;
	const deviceWidth = Dimensions.get('window').width;
	const ampmRef = useRef<ScrollView>();
	const hourRef = useRef<ScrollView>();
	const minuteRef = useRef<ScrollView>();
	const {timeLimitArray, minuteLimitArray} = useAppSelector(state => state.travelSlice);
	useEffect(() => {
		let hourData = (timeLimitArray[when] < 12 ? timeLimitArray[when] : timeLimitArray[when] - 12) + 1;
		let ampmData = timeLimitArray[when] < 12 ? 1 : 2;
		let minuteData = minuteLimitArray[when] / 30 + 1;
		console.log(hourData, minuteData);
		setMinute(minuteData);
		setAmpm(ampmData);
		setHour(hourData);
		hourRef.current?.scrollTo({y: (hourData - 1) * 50});
		minuteRef.current?.scrollTo({y: (minuteData - 1) * 50});
		ampmRef.current?.scrollTo({y: (ampmData - 1) * 50});
	}, [visible]);
	const hoursCalculate = (e: any) => {
		setHour(Math.round(e.nativeEvent.contentOffset.y / 50 + 1));
	};
	const minuteCalculate = (e: any) => {
		setMinute(Math.round(e.nativeEvent.contentOffset.y / 50 + 1));
	};
	const ampmCalculate = (e: any) => {
		setAmpm(Math.ceil(e.nativeEvent.contentOffset.y / 50 + 1));
	};
	const goConfirm = () => {
		if (when == 1 && ampmList[ampm] == '오전') {
			dispatch(modalSliceActions.setOpenModal({modalTitle: '13시 이전은 불가능합니다.'}));
		} else {
			let timeCopy = [...timeLimitArray];
			let ampmCheck = ampmList[ampm] == '오후' ? 12 : 0;
			timeCopy[when] = parseInt(hourList[hour]) + ampmCheck;
			let minuteCopy = [...minuteLimitArray];
			minuteCopy[when] = parseInt(minuteList[minute]);
			dispatch(travelSliceActions.setTimeAndMinute({time: timeCopy, minute: minuteCopy}));
			setVisible(false);
		}
	};
	const viewList = [
		{value: ampm, list: ampmList, ref: ampmRef, function: ampmCalculate},
		{value: hour, list: hourList, ref: hourRef, function: hoursCalculate},
		{value: minute, list: minuteList, ref: minuteRef, function: minuteCalculate},
	];
	const onCancel = () => {
		setVisible(false);
	};
	if (!visible) return <MainContainer></MainContainer>;
	return (
		<Container height={deviceHeight} width={deviceWidth}>
			<ModalContainer>
				<StateText>{when == 0 ? '시작 시간' : '종료시간'}</StateText>
				<ModalHstack>
					{viewList.map((value, index) => (
						<ModalElementWidthContainer key={index}>
							<ModalElement
								nestedScrollEnabled={true}
								pagingEnabled
								snapToInterval={50}
								ref={value.ref}
								decelerationRate={'fast'}
								onScroll={e => value.function(e)}
								showsVerticalScrollIndicator={false}>
								{value.list.map((item, idx) => (
									<ModalElementContainer key={idx}>
										<Text color={idx == value.value} key={idx}>
											{item}
										</Text>
									</ModalElementContainer>
								))}
							</ModalElement>
						</ModalElementWidthContainer>
					))}
				</ModalHstack>

				<StatusHstack>
					<StatusTouchableOpacity onPress={onCancel}>
						<StatusText>취소</StatusText>
					</StatusTouchableOpacity>
					<StatusTouchableOpacity onPress={goConfirm}>
						<StatusText>확인</StatusText>
					</StatusTouchableOpacity>
				</StatusHstack>
			</ModalContainer>
		</Container>
	);
}
interface PickerType {
	visible: boolean;
	setVisible: Dispatch<SetStateAction<boolean>>;
	when: number;
}
const StatusText = styled.Text`
	font-size: 20px;
	font-weight: bold;
	color: black;
`;
const StateText = styled(StatusText)`
	align-self: flex-start;
	margin: 0px 0px 20px 10px;
`;
const StatusTouchableOpacity = styled.TouchableOpacity`
	width: 40%;
	align-items: center;
`;
const StatusHstack = styled(HStack)`
	width: 100%;
	justify-content: center;
	margin: 10px 0px 0px 0px;
`;

const Container = styled.View<{height: number; width: number}>`
	z-index: 1;
	width: ${props => props.width}px;
	position: absolute;
	align-items: center;
	justify-content: center;
	height: ${props => props.height}px;
	background-color: rgba(255, 255, 255, 0.9);
`;
const ModalContainer = styled.View`
	width: 90%;
	align-items: center;
	justify-content: center;
	flex-directrion: row;
	background-color: white;
	border-width: 1px;
	border-radius: 5px;
	padding: 10px;
	z-index: 3;
`;
const ModalElementWidthContainer = styled.View`
	width: 25%;
`;
const ModalElement = styled.ScrollView``;
const ModalElementContainer = styled.View`
	widht: 100%;
	height: 50px;
	align-items: center;
`;
const ModalHstack = styled(HStack)`
	width: 100%;
	height: 150px;
	justify-content: center;
	align-items: center;
`;
const Text = styled.Text<{color: boolean}>`
	font-size: 20px;
	font-weight: ${props => (props.color ? 900 : 500)};
	color: ${props => (props.color ? 'black' : colors.regionNormal)};
`;
