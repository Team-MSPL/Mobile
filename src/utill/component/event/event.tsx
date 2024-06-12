import styled from 'styled-components/native';
import {colors} from '../../colors';
import {HStack, PretendardVariableText, devicesWidth} from '../../layout/layout';
import {useAppDispatch, useAppSelector} from '../../../redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {eventSliceActions} from '../../../redux/event/event.slice';
import {useState} from 'react';

export default function Event() {
	const dispatch = useAppDispatch();
	const closeModal = () => {
		dispatch(eventSliceActions.setEventState(false));
	};
	const {eventList} = useAppSelector(state => state.eventSlice);
	const closeModalOneDay = async () => {
		await AsyncStorage.setItem('eventState', moment().format('DD').toString());
		closeModal();
	};
	const [viewIndex, setViewIndex] = useState(0);
	const newPage = (e: any) => {
		setViewIndex(Math.round(e.nativeEvent.contentOffset.x / devicesWidth));
	};
	return (
		<Container>
			<ViewContaniner>
				<Scroll
					pagingEnabled
					snapToInterval={devicesWidth}
					scrollEventThrottle={devicesWidth / 2}
					decelerationRate={'fast'}
					disableIntervalMomentum={true}
					horizontal={true}
					onScroll={e => {
						newPage(e);
					}}
					showsHorizontalScrollIndicator={false}>
					{eventList.map((item, idx) => (
						<ScrollContainer key={idx}>
							<EventImage
								source={{
									uri: item.eventImage,
								}}></EventImage>
						</ScrollContainer>
					))}
				</Scroll>
				<IndexHStack>
					{eventList.map((item, idx) => (
						<Ball key={idx} index={viewIndex == idx} />
					))}
				</IndexHStack>
				<EventHStack>
					<TextPressable onPress={closeModalOneDay}>
						<PretendardVariableText size={15} lineHeight={21.6} color={colors.Black}>
							오늘 그만 보기
						</PretendardVariableText>
					</TextPressable>
					<TextPressable onPress={closeModal}>
						<PretendardVariableText size={15} lineHeight={21.6} color={colors.Black}>
							닫기
						</PretendardVariableText>
					</TextPressable>
				</EventHStack>
			</ViewContaniner>
		</Container>
	);
}
const ScrollContainer = styled.View`
	width: ${devicesWidth * 0.95}px;
	align-items: center;
	justify-content: center;
`;
const Scroll = styled.ScrollView``;
const TextPressable = styled.Pressable`
	width: 50%;
	align-items: center;
	height: 100%;
	justify-content: center;
`;
const Container = styled.View`
	position: absolute;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	background-color: rgba(128, 128, 128, 0.9);
`;
const EventImage = styled.Image`
	width: ${devicesWidth * 0.95}px;
	height: ${devicesWidth * 0.95}px;
	object-fit: contain;
`;
const ViewContaniner = styled.View`
	background-color: white;
	width: 95%;
	height: 60%;
	border-radius: 5px;
`;
const EventHStack = styled(HStack)`
	justify-content: space-around;
	height: 10%;
`;
const IndexHStack = styled(HStack)`
	align-items: center;
	justify-content: center;
	height: 10%;
`;
const Ball = styled.View<{index: boolean}>`
	width: ${devicesWidth * 0.02}px;
	height: ${devicesWidth * 0.02}px;
	border-radius: 99px;
	background-color: ${props => (props.index ? colors.PointYellow : 'white')};
	margin: 0px 1px;
	border-width: 1px;
	border-color: grey;
`;
