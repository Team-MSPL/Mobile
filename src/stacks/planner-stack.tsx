import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {Fragment} from 'react';
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
		</Fragment>
	);
}
