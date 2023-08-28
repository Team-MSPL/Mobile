import React, {useEffect, useLayoutEffect, useState, useRef, memo} from 'react';
import {Alert, TouchableOpacity, View} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {travelSliceActions} from '../../../redux/travel-info/travel.slice';
import TimeView from './time-view';

const Background = ({navigation, addList, setAddList, x, setX}: any) => {
	const {editMode, nDay, makeMode} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();

	const handleCellPress = (inx: number, index: number) => {
		if (editMode === 'add' && inx <= nDay) {
			if (inx === x) {
				let copy = [...addList];
				if (copy.includes(index)) {
					if (index === copy[0] || index === copy[copy.length - 1]) {
						copy = copy.filter(item => item !== index);
					} else {
						copy = [];
					}
				} else {
					if (index === copy[0] - 1 || index === copy[copy.length - 1] + 1) {
						index < copy[0] ? copy.unshift(index) : copy.push(index);
					} else {
						copy = [index];
					}
				}
				copy.length == 0 && dispatch(travelSliceActions.editModeChange(''));
				setAddList(copy);
			} else {
				setX(inx);
				setAddList([index]);
			}
		}
	};

	const handleCellLongPress = (inx: number, index: number) => {
		if (inx <= nDay) {
			if (editMode === 'add') {
				setAddList([]);
				dispatch(travelSliceActions.editModeChange(''));
			} else {
				setX(inx);
				const copy = [...addList, index];
				setAddList(copy);
				dispatch(travelSliceActions.editModeChange('add'));
			}
		} else {
			Alert.alert('니가 선택한 시간이 아니잖아');
		}
	};
	//테스트에서는 36개로 했음
	return (
		<View style={{flexDirection: 'row'}}>
			<TimeView />
			{[...Array(5)].map((item, inx) => (
				<View key={inx}>
					{[...Array(48)].map((value, index) => (
						<TouchableOpacity
							key={index}
							style={{
								width: 70,
								height: 35,
								borderLeftWidth: 1,
								borderTopWidth: index % 2 ? 0 : 1,
								borderRightWidth: inx === 4 ? 1 : 0,
								borderBottomWidth: index === 47 ? 1 : 0,
								backgroundColor:
									editMode === 'add' && x === inx && addList.includes(index) ? 'black' : 'white',
							}}
							activeOpacity={makeMode == 'share' ? 1 : 0.2}
							onPress={() => makeMode != 'share' && handleCellPress(inx, index)}
							onLongPress={() => makeMode != 'share' && handleCellLongPress(inx, index)}
						/>
					))}
				</View>
			))}
		</View>
	);
};

export default memo(Background);
