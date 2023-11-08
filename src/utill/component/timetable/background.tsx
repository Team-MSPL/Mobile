import React, {memo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {modalSliceActions} from '../../../redux/modal/modalSlice';
import {travelSliceActions} from '../../../redux/travel-info/travel.slice';
import TimeView from './time-view';
import {Dimensions} from 'react-native';
import {colors} from '../../colors';

const Background = ({navigation, addList, setAddList, x, setX}: any) => {
	const {editMode, nDay, makeMode} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const WINDOW_WIDTH = Dimensions.get('window').width;
	const WINDOW_HEIGHT = Dimensions.get('window').height;

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
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '선택한 날짜가 아니라 불가합니다.',
				}),
			);
		}
	};
	//테스트에서는 36개로 했음
	return (
		<BackgroundContainer>
			<TimeView />
			{[...Array(5)].map((item, inx) => (
				<BackgroundElementContainer key={inx}>
					{[...Array(48)].map((value, index) => (
						<BackgroundTouchable
							key={index}
							background={
								editMode === 'add' && x === inx && addList.includes(index) ? 'black' : colors.main
							}
							valueIndex={index}
							borderColor={
								editMode === 'add' && x === inx && addList.includes(index)
									? 'black'
									: colors.regionNormal
							}
							valueInx={inx}
							top={(WINDOW_HEIGHT / 20) * (index ?? 1)}
							height={WINDOW_HEIGHT / 10}
							activeOpacity={makeMode == 'share' ? 1 : 0.2}
							onPress={() => makeMode != 'share' && handleCellPress(inx, index)}
							onLongPress={() => makeMode != 'share' && handleCellLongPress(inx, index)}
						/>
					))}
				</BackgroundElementContainer>
			))}
		</BackgroundContainer>
	);
};
const BackgroundContainer = styled.View`
	flex-direction: row;
	z-index: 2;
	flex: 1;
`;
const BackgroundElementContainer = styled.View`
	flex: 0.18;
`;

const BackgroundTouchable = styled.TouchableOpacity<{
	background: string;
	valueIndex: number;
	valueInx: number;
	height: number;
	top: number;
	borderColor: string;
}>`
	width: 100%;
	height: ${props => props.height}px;
	border-color: ${props => props.borderColor};
	border-left-width: 1px;
	border-right-width: ${props => (props.valueInx === 4 ? 1 : 0)}px;
	border-top-width: ${props => (props.valueIndex % 2 ? 0 : 1)}px;
	border-bottom-width: ${props => (props.valueIndex === 47 ? 1 : 0)}px;
	position: absolute;
	z-index: 2;
	background-color: ${props => props.background};
	top: ${props => props.top}px;
`;

export default memo(Background);
