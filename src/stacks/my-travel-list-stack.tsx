import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {Fragment} from 'react';
import DetailInfo from '../screens/my-travel-list/detail-info';
import InputDiary from '../screens/my-travel-list/input-diary';
import InputReviewAndPoint from '../screens/my-travel-list/input-review-and-point';
import MyTravelList from '../screens/my-travel-list/my-travel-list';
const Stack = createNativeStackNavigator();
export default function MyTravelListStack() {
	return (
		<Fragment>
			<Stack.Screen
				name='MyTravelList'
				component={MyTravelList}
				options={{
					headerBackVisible: true,
					headerBackTitleVisible: true,
					headerTitle: '내 여행',
					headerTitleAlign: 'center',
				}}
			/>
			<Stack.Screen
				name='DetailInfo'
				component={DetailInfo}
				options={{
					headerBackVisible: true,
					headerBackTitleVisible: true,
					headerTitle: '내 여행',
					headerTitleAlign: 'center',
				}}
			/>
			<Stack.Screen
				name='InputDiary'
				component={InputDiary}
				options={{
					headerBackVisible: true,
					headerBackTitleVisible: true,
					headerTitle: '내 여행',
					headerTitleAlign: 'center',
				}}
			/>
			<Stack.Screen
				name='InputReviewAndPoint'
				component={InputReviewAndPoint}
				options={{
					headerBackVisible: true,
					headerBackTitleVisible: true,
					headerTitle: '내 여행',
					headerTitleAlign: 'center',
				}}
			/>
		</Fragment>
	);
}
