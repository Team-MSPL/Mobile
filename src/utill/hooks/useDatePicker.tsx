import {Dispatch, SetStateAction, useEffect, useRef, useState} from 'react';
import {Dimensions, ScrollView} from 'react-native';
import styled from 'styled-components/native';
import {HStack, MainContainer} from '../layout/layout';
import {colors} from '../colors';

export default function UseDatePicker({
	hourData,
	ampmData,
	minuteData,
	visible,
	setVisible,
	title,
	goConfirm,
}: PickerType) {
	const ampmList = ['', '오전', '오후', ''];
	const hourList = ['', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', ''];
	const minuteList = ['', '0', '30', ''];
	const [ampm, setAmpm] = useState(0);
	const [hour, setHour] = useState(0);
	const [minute, setMinute] = useState(0);
	const deviceHeight = Dimensions.get('window').height;
	const deviceWidth = Dimensions.get('window').width;
	const ampmRef = useRef<ScrollView>();
	const hourRef = useRef<ScrollView>();
	const minuteRef = useRef<ScrollView>();
	useEffect(() => {
		console.log(minuteData, 'qwp');
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
	const goConfirms = () => {
		const timeData: {
			ampm: string;
			hour: string;
			minute: string;
		} = {ampm: ampmList[ampm], hour: hourList[hour], minute: minuteList[minute]};
		goConfirm(timeData);
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
				<StateText>{title}</StateText>
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
					<StatusTouchableOpacity onPress={goConfirms}>
						<StatusText>확인</StatusText>
					</StatusTouchableOpacity>
				</StatusHstack>
			</ModalContainer>
		</Container>
	);
}
interface PickerType {
	hourData: number;
	ampmData: number;
	minuteData: number;
	visible: boolean;
	setVisible: Dispatch<SetStateAction<boolean>>;
	title: string;
	goConfirm: (timeData: {hour: string; ampm: string; minute: string}) => void;
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
	background-color: rgba(250, 250, 255, 0.9);
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
