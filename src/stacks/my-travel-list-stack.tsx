import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {Fragment} from 'react';
import DetailInfo from '../screens/my-travel-list/detail-info';
import InputDiary from '../screens/my-travel-list/input-diary';
import InputReviewAndPoint from '../screens/my-travel-list/input-review-and-point';
import MyTravelList from '../screens/my-travel-list/my-travel-list';
import {colors} from '../utill/colors';
import {SvgShare} from '../utill/svg/svg';
const Stack = createNativeStackNavigator();
export default function MyTravelListStack() {
	return (
		<Fragment>
			<Stack.Screen
				name='MyTravelList'
				component={MyTravelList}
				options={{
					headerTitle: '내 여행',
				}}
			/>
			<Stack.Screen
				name='DetailInfo'
				component={DetailInfo}
				options={{
					headerTitle: '내 여행',
				}}
			/>
			<Stack.Screen
				name='InputDiary'
				component={InputDiary}
				options={{
					headerTitle: '내 여행',
				}}
			/>
			<Stack.Screen
				name='InputReviewAndPoint'
				component={InputReviewAndPoint}
				options={{
					headerTitle: '내 여행',
				}}
			/>
		</Fragment>
	);
}
