import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {Fragment} from 'react';
import AddInPerson from '../screens/enroll-info/planner/add-in-person';
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
					title: '',
				}}
			/>
		</Fragment>
	);
}
