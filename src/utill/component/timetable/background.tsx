import {JSX, JSXElementConstructor, ReactElement, useEffect, useLayoutEffect, useState, useRef, memo} from 'react';
import shortId from 'shortid';
import {TouchableOpacity} from 'react-native';
import {Text, Box, ScrollView, VStack, Divider, Slider, Center, HStack, Spacer} from 'native-base';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {travelSliceActions} from '../../../redux/travel-info/travel.slice';
const Background = ({navigation, addList, setAddList, x, setX}: any) => {
	const {editMode, nDay} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	return (
		<HStack marginBottom='100'>
			<VStack>
				{[...Array(18)].map((time, times) => (
					<Box key={times} w='60px' h='70px' alignItems='center'>
						<Text fontSize='lg'>{times + 6}</Text>
					</Box>
				))}
			</VStack>
			{[...Array(5)].map((item, inx) => {
				return (
					<VStack key={inx}>
						{[...Array(36)].map((value, index) => (
							<TouchableOpacity
								key={index}
								style={{
									width: 70,
									height: 35,
									borderLeftWidth: 1,
									borderTopWidth: index % 2 ? 0 : 1,
									borderRightWidth: inx == 4 ? 1 : 0,
									borderBottomWidth: index == 35 ? 1 : 0,
									backgroundColor:
										editMode == 'add' && x == inx && addList.includes(index) ? 'black' : 'white',
								}}
								onPress={() => {
									if (editMode == 'add' && inx <= nDay) {
										if (inx == x) {
											let copy = [...addList];
											if (copy.includes(index)) {
												if (index == copy[0] || index == copy[copy.length - 1]) {
													copy = copy.filter(item => item != index);
													setAddList(copy);
												} else {
													setAddList([]);
												}
											} else {
												if (index == copy[0] - 1 || index == copy[copy.length - 1] + 1) {
													index < copy[0] ? copy.unshift(index) : copy.push(index);
													setAddList(copy);
												} else {
													setAddList([index]);
												}
											}
										} else {
											setX(inx);
											setAddList([index]);
										}
									}
								}}
								onLongPress={() => {
									if (inx <= nDay) {
										if (editMode == 'add') {
											setAddList([]);
											dispatch(travelSliceActions.editModeChange(''));
										} else {
											setX(inx);
											let copy = [...addList];
											copy.push(index);
											setAddList(copy);
											console.log(typeof addList);
											dispatch(travelSliceActions.editModeChange('add'));
										}
									} else {
										console.log('거긴...');
									}
								}}></TouchableOpacity>
						))}
					</VStack>
				);
			})}
		</HStack>
	);
};

export default memo(Background);
