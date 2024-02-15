import {Dispatch, SetStateAction, useEffect, useRef, useState} from 'react';
import {ScrollView} from 'react-native';
import styled from 'styled-components/native';
import {HStack, PretendardSemiBold} from '../layout/layout';
import {colors} from '../colors';
import {fontPercentage, heightPercentage, widthPercentage} from '../layout/responsive-size';

export default function UseDatePicker({hourData, minuteData, ampmData, visible, setVisible, goConfirm}: PickerType) {
	const ampmList = ['오전', '오후'];
	const hourList = ['12', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'];
	const minuteList = ['0', '30'];
	const [ampm, setAmpm] = useState(0);
	const [hour, setHour] = useState(0);
	const [minute, setMinute] = useState(0);
	const ampmRef = useRef<ScrollView>();
	const hourRef = useRef<ScrollView>();
	const minuteRef = useRef<ScrollView>();
	useEffect(() => {
		setHour(hourData);
		setAmpm(ampmData);
		setMinute(minuteData);
		hourRef.current?.scrollTo({y: hourData * 50});
	}, [visible]);
	const hoursCalculate = (e: any) => {
		goConfirms({status: 'hour', value: e}) && setHour(e);
	};
	const minuteCalculate = (e: any) => {
		goConfirms({status: 'minute', value: e}) && setMinute(e);
	};
	const ampmCalculate = (e: any) => {
		goConfirms({status: 'ampm', value: e}) && setAmpm(e);
	};
	const goConfirms = ({status, value}: {status: string; value: number}) => {
		const timeData: {
			ampm: string;
			hour: string;
			minute: string;
		} = {
			ampm: ampmList[status == 'ampm' ? value : ampm],
			hour:
				hourList[status == 'hour' ? value : hour] == '12'
					? String(parseInt(hourList[status == 'hour' ? value : hour]) - 12)
					: hourList[status == 'hour' ? value : hour],
			minute: minuteList[status == 'minute' ? value : minute],
		};
		return goConfirm(timeData);
	};
	const viewList = [
		{value: ampm, list: ampmList, ref: ampmRef, function: ampmCalculate},
		{value: hour, list: hourList, ref: hourRef, function: hoursCalculate},
		{value: minute, list: minuteList, ref: minuteRef, function: minuteCalculate},
	];
	const onCancel = () => {
		setVisible(false);
	};
	if (!visible) return <></>;
	return (
		<Container width={widthPercentage(157)}>
			<ModalHstack>
				{viewList.map((value, index) => (
					<ModalElementWidthContainer key={index} height={value.list.length}>
						<ModalElement
							nestedScrollEnabled={true}
							ref={value.ref}
							decelerationRate={'fast'}
							showsVerticalScrollIndicator={false}>
							{value.list.map((item, idx) => (
								<ModalElementContainer
									onPress={() => value.function(idx)}
									key={idx}
									color={idx == value.value ? colors.PointYellow : colors.backgroundWhite}>
									<Text
										color={idx == value.value ? colors.backgroundWhite : colors.PointYellow}
										key={idx}>
										{item}
									</Text>
								</ModalElementContainer>
							))}
						</ModalElement>
					</ModalElementWidthContainer>
				))}
			</ModalHstack>
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
	goConfirm: (timeData: {hour: string; ampm: string; minute: string}) => boolean;
}
const Container = styled.View<{width: number}>`
	width: ${props => props.width}px;
	align-items: center;
	justify-content: center;
	background-color: rgba(250, 250, 255, 0.9);
`;
const ModalElementWidthContainer = styled.View<{height: number}>`
	width: ${widthPercentage(48)}px;
	height: ${props => props.height * widthPercentage(22)}px;
	max-height: ${heightPercentage(122)}px;
	background-color: ${colors.backgroundWhite};
	border-radius: 6px;
`;
const ModalElement = styled.ScrollView`
	width: 100%;
`;
const ModalElementContainer = styled.Pressable<{color: string}>`
	widht: ${widthPercentage(48)}px;
	height: ${widthPercentage(22)}px;
	align-items: center;
	background-color: ${props => props.color};
	border-radius: 6px;
`;
const ModalHstack = styled(HStack)`
	width: 100%;
	justify-content: space-between;
	align-items: start;
`;
const Text = styled(PretendardSemiBold)<{color: string}>`
	font-size: ${fontPercentage(12)}px;
	color: ${props => props.color};
`;
