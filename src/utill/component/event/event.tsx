import styled from 'styled-components/native';
import {colors} from '../../colors';
import {HStack, devicesHeight, devicesWidth} from '../../layout/layout';
import {useAppDispatch, useAppSelector} from '../../../redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {eventSliceActions} from '../../../redux/event/event.slice';
import {ScrollView} from 'react-native';
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
	const qwe = [
		'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=AWU5eFjhd8dO8D_7Ohgb9BWzyWC37gMHjNaKbKf_tOICN-xa2gFegcZRXJ4JFO9tPxwCrLnpE0eSgJuWVg5QrIG-T16S1iUV1DB5tmGhAXm9zZcZiRR09cnWAGoztizWrtldSiWVGymLWlbYZUrW6iHpqgJxmm8Z1KcgnHsiNzqkDDxJvk6l&key=AIzaSyA_nsvAajvyiWj-FeJO6u1-yZYsOBkoPOk',
		'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=AWU5eFgajhssT3jS86mSMU4TFN2R3xK47aZyCjSQfWN0vql3LOWVnVou_vV1Qzle2Kd7ir_xqv_36OkbbB9KC1xX7qNsMf_n1ndRDIUjsm2UlSW0om8FplIMnkaaPQCsP5qzoXqIy7HHj9QQcafqvxOUOvRyHcbNKqfPzrXihQCq4qU4HarG&key=AIzaSyA_nsvAajvyiWj-FeJO6u1-yZYsOBkoPOk',
		'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=AWU5eFjhd8dO8D_7Ohgb9BWzyWC37gMHjNaKbKf_tOICN-xa2gFegcZRXJ4JFO9tPxwCrLnpE0eSgJuWVg5QrIG-T16S1iUV1DB5tmGhAXm9zZcZiRR09cnWAGoztizWrtldSiWVGymLWlbYZUrW6iHpqgJxmm8Z1KcgnHsiNzqkDDxJvk6l&key=AIzaSyA_nsvAajvyiWj-FeJO6u1-yZYsOBkoPOk',
	];
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
					{qwe.map((item, idx) => (
						<ScrollContainer key={idx}>
							<EventImage
								source={{
									uri: item,
								}}></EventImage>
						</ScrollContainer>
					))}
				</Scroll>
				<IndexHStack>
					{qwe.map((item, idx) => (
						<Ball index={viewIndex == idx} />
					))}
				</IndexHStack>
				<EventHStack>
					<TextPressable onPress={closeModalOneDay}>
						<Guide>오늘 그만 보기</Guide>
					</TextPressable>
					<TextPressable onPress={closeModal}>
						<Guide>닫기</Guide>
					</TextPressable>
				</EventHStack>
			</ViewContaniner>
		</Container>
	);
}
const ScrollContainer = styled.View`
	width: ${devicesWidth}px;
	height: 100%;
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
const Guide = styled.Text`
	font-size: 16px;
	text-align: center;
	line-height: 24.5px;
	font-weight: 500;
	color: black;
`;
const EventImage = styled.Image`
	width: 100%;
	height: 90%;
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
`;
const Ball = styled.View<{index: boolean}>`
	width: ${devicesWidth * 0.02}px;
	height: ${devicesWidth * 0.02}px;
	border-radius: 99px;
	background-color: ${props => (props.index ? colors.selectButton : 'white')};
	margin: 0px 1px;
	border-width: 1px;
	border-color: grey;
`;
