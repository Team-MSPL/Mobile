import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {Fragment} from 'react';
import AddCategory from '../screens/enroll-info/planner/add-category';
import AddInPerson from '../screens/enroll-info/planner/add-in-person';
import AddSearchRecommend from '../screens/enroll-info/planner/add-search-recommend';
import AiRecommned from '../screens/enroll-info/planner/ai-recommend';
import ChoiceTransit from '../screens/enroll-info/planner/choice-transit';
import Passport from '../screens/enroll-info/planner/passport';
import Planner from '../screens/enroll-info/planner/planner';
import RegistTransit from '../screens/enroll-info/planner/regist-transit';
const Stack = createNativeStackNavigator();
export default function PlannerStack() {
	return (
		<Fragment>
			<Stack.Screen
				name='Planner'
				component={Planner}
				options={{
					title: '',
				}}
			/>
			<Stack.Screen
				name='RegistTransit'
				component={RegistTransit}
				options={{
					title: '',
				}}
			/>
			<Stack.Screen
				name='Passport'
				component={Passport}
				options={{
					title: '',
				}}
			/>
			<Stack.Screen
				name='AddInPerson'
				component={AddInPerson}
				options={{
					title: '직접 추가',
				}}
			/>
			<Stack.Screen
				name='ChoiceTransit'
				component={ChoiceTransit}
				options={{
					title: '교통 등록하기',
				}}
			/>
			<Stack.Screen
				name='AddCategory'
				component={AddCategory}
				options={{
					title: '여행지 추가',
				}}
			/>
			<Stack.Screen
				name='AddSearchRecommend'
				component={AddSearchRecommend}
				options={{
					title: '여행지 추가',
				}}
			/>
			<Stack.Screen
				name='AiRecommned'
				component={AiRecommned}
				options={{
					title: '여행지 추가',
				}}
			/>
		</Fragment>
	);
}
