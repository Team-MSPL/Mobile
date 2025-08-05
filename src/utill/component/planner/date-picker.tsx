import React, {useState, useRef, useEffect} from 'react';
import {Modal, FlatList, View, NativeSyntheticEvent, NativeScrollEvent, InteractionManager} from 'react-native';
import styled from 'styled-components/native';
import RouteButton from '../route-button';

export default function TimePickerModal({
	visible,
	onClose,
	onConfirm,
	navigation,
	minuteDivide,
	handleAllApply,
	hour,
	minute,
	leftText,
	leftFunction,
	rightText,
	rightFunction,
}) {
	const [ampmIndex, setAmpmIndex] = useState(0);
	const [hourIndex, setHourIndex] = useState(8); // default: 9시
	const [minuteIndex, setMinuteIndex] = useState(0);
	const ITEM_HEIGHT = 40;
	const VISIBLE_ITEMS = 5;

	const hours = Array.from({length: 12}, (_, i) => i + 1);
	const minutes = Array.from({length: minuteDivide ? 2 : 60}, (_, i) =>
		minuteDivide ? i * 30 : i.toString().padStart(2, '0'),
	);
	const ampmList = ['오전', '오후'];
	const flatListRef = {
		ampm: useRef(null),
		hour: useRef(null),
		minute: useRef(null),
	};

	const onScrollEnd = (type: 'ampm' | 'hour' | 'minute') => (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		const y = e.nativeEvent.contentOffset.y;
		const index = Math.round(y / ITEM_HEIGHT);

		if (type === 'ampm') setAmpmIndex(index);
		if (type === 'hour') setHourIndex(index);
		if (type === 'minute') setMinuteIndex(index);
	};

	const getSelectedValue = () => ({
		ampm: ampmList[ampmIndex],
		hour: hours[hourIndex],
		minute: minutes[minuteIndex],
	});
	useEffect(() => {
		setAmpmIndex(Math.floor(hour / 12));
		setHourIndex(hour == 0 ? 11 : (hour - 1) % 12);
		setMinuteIndex(minuteDivide ? minute / 30 : minute);
	}, []);
	useEffect(() => {
		if (visible) {
			InteractionManager.runAfterInteractions(() => {
				setTimeout(() => {
					flatListRef.hour.current?.scrollToOffset({offset: hourIndex * ITEM_HEIGHT, animated: false});
					flatListRef.minute.current?.scrollToOffset({offset: minuteIndex * ITEM_HEIGHT, animated: false});
					flatListRef.ampm.current?.scrollToOffset({offset: ampmIndex * ITEM_HEIGHT, animated: false});
				}, 50);
			});
		}
	}, [visible, hourIndex, minuteIndex, ampmIndex]);

	return (
		<>
			<PickerContainer>
				{/* AMPM */}
				<PickerFlatList
					ref={flatListRef.ampm}
					data={ampmList}
					keyExtractor={(item, index) => `${item}-${index}`}
					showsVerticalScrollIndicator={false}
					snapToInterval={ITEM_HEIGHT}
					decelerationRate='fast'
					onMomentumScrollEnd={onScrollEnd('ampm')}
					contentContainerStyle={{paddingVertical: ITEM_HEIGHT * 2}}
					renderItem={({item, index}) => (
						<PickerItem height={ITEM_HEIGHT}>
							<PickerText selected={index === ampmIndex}>{item}</PickerText>
						</PickerItem>
					)}
				/>
				{/* Hour */}
				<PickerFlatList
					ref={flatListRef.hour}
					data={hours}
					keyExtractor={(item, index) => `${item}-${index}`}
					showsVerticalScrollIndicator={false}
					snapToInterval={ITEM_HEIGHT}
					decelerationRate='fast'
					onMomentumScrollEnd={onScrollEnd('hour')}
					contentContainerStyle={{paddingVertical: ITEM_HEIGHT * 2}}
					initialNumToRender={20}
					renderItem={({item, index}) => (
						<PickerItem height={ITEM_HEIGHT}>
							<PickerText selected={index === hourIndex}>{item}</PickerText>
						</PickerItem>
					)}
				/>
				{/* Minute */}
				<PickerFlatList
					ref={flatListRef.minute}
					data={minutes}
					keyExtractor={(item, index) => `${item}-${index}`}
					showsVerticalScrollIndicator={false}
					snapToInterval={ITEM_HEIGHT}
					decelerationRate='fast'
					onMomentumScrollEnd={onScrollEnd('minute')}
					contentContainerStyle={{paddingVertical: ITEM_HEIGHT * 2}}
					initialNumToRender={60}
					renderItem={({item, index}) => (
						<PickerItem height={ITEM_HEIGHT}>
							<PickerText selected={index === minuteIndex}>{item}</PickerText>
						</PickerItem>
					)}
				/>
			</PickerContainer>
			<RouteButton
				navigation={navigation}
				type={'planner'}
				leftText={leftText || '전체 일정에 적용하기'}
				LeftBtnFunction={() => {
					if (typeof leftFunction === 'function') {
						leftFunction({
							ampm: ampmList[ampmIndex],
							hour: hours[hourIndex],
							minute: minutes[minuteIndex],
						});
					} else {
						handleAllApply({
							ampm: ampmList[ampmIndex],
							hour: hours[hourIndex],
							minute: minutes[minuteIndex],
						});
					}
				}}
				btnFunction={() => {
					if (typeof rightFunction === 'function') {
						rightFunction({
							ampm: ampmList[ampmIndex],
							hour: hours[hourIndex],
							minute: minutes[minuteIndex],
						});
					} else {
						onConfirm({
							ampm: ampmList[ampmIndex],
							hour: hours[hourIndex],
							minute: minutes[minuteIndex],
						});
					}
				}}
				nextText={rightText || '완료'}></RouteButton>
		</>
	);
}

const PickerContainer = styled.View`
	flex-direction: row;
	justify-content: space-around;
	height: 200px;
	margin-bottom: 20px;
`;

const PickerFlatList = styled(FlatList).attrs(() => ({
	bounces: false,
}))`
	width: 33%;
`;

const PickerItem = styled.Pressable<{height: number}>`
	height: ${({height}) => height}px;
	justify-content: center;
	align-items: center;
`;

const PickerText = styled.Text.attrs({
	allowFontScaling: false,
})<{selected: boolean}>`
	font-size: ${({selected}) => (selected ? '32px' : '28px')};
	color: ${({selected}) => (selected ? '#000' : '#aaa')};
	font-weight: ${({selected}) => (selected ? 'bold' : 'normal')};
`;
