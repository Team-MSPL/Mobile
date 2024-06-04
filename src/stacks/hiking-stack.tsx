import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {Fragment} from 'react';
import HikingSelectPlay from '../screens/enroll-info/hiking-recommend/select-play';
import HikingSelectSeason from '../screens/enroll-info/hiking-recommend/select-seasion';
import HikingSelectDifficulty from '../screens/enroll-info/hiking-recommend/select-difficulty';
import HikingViewResult from '../screens/enroll-info/hiking-recommend/view-result';
import HikingDetailResult from '../screens/enroll-info/hiking-recommend/detail-result';
const Stack = createNativeStackNavigator();
export default function HikingStack() {
	return (
		<Fragment>
			<Stack.Screen
				name='HikingSelectPlay'
				component={HikingSelectPlay}
				options={{
					title: '탐방 코스 추천',
				}}
			/>
			<Stack.Screen
				name='HikingSelectSeason'
				component={HikingSelectSeason}
				options={{
					title: '탐방 코스 추천',
				}}
			/>
			<Stack.Screen
				name='HikingSelectDifficulty'
				component={HikingSelectDifficulty}
				options={{
					title: '탐방 코스 추천',
				}}
			/>
			<Stack.Screen
				name='HikingViewResult'
				component={HikingViewResult}
				options={{
					title: '탐방 코스 추천',
				}}
			/>
			<Stack.Screen
				name='HikingDetailResult'
				component={HikingDetailResult}
				options={{
					title: '탐방 코스 추천',
				}}
			/>
		</Fragment>
	);
}
