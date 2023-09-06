import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {Fragment} from 'react';
import SelectDistance from '../screens/enroll-info/region-recommend/select-distance';
import SelectPopularity from '../screens/enroll-info/region-recommend/select-popularity';
import SelectTendency from '../screens/enroll-info/region-recommend/select-tendency';
import ViewResult from '../screens/enroll-info/region-recommend/view-result';
const Stack = createNativeStackNavigator();
export default function RegionRecommendStack() {
	return (
		<Fragment>
			<Stack.Screen
				name='RegionSelectTendency'
				component={SelectTendency}
				options={{
					title: '지역 추천 1',
					headerStyle: {backgroundColor: '#EFFBFB'},
					headerShadowVisible: false,
				}}
			/>
			<Stack.Screen
				name='RegionSelectDistance'
				component={SelectDistance}
				options={{
					title: '지역 추천 2',
					headerStyle: {backgroundColor: '#EFFBFB'},
					headerShadowVisible: false,
				}}
			/>
			<Stack.Screen
				name='RegionSelectPopularity'
				component={SelectPopularity}
				options={{
					title: '지역 추천 3',
					headerStyle: {backgroundColor: '#EFFBFB'},
					headerShadowVisible: false,
				}}
			/>
			<Stack.Screen
				name='RegionViewResult'
				component={ViewResult}
				options={{
					title: '추천 결과',
					headerStyle: {backgroundColor: '#EFFBFB'},
					headerShadowVisible: false,
					headerBackVisible: false,
				}}
			/>
		</Fragment>
	);
}
