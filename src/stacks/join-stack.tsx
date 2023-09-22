import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {Fragment} from 'react';
import Join1 from '../screens/user/join1';
const Stack = createNativeStackNavigator();
export default function JoinStack() {
	return (
		<Fragment>
			<Stack.Screen
				name='Join1'
				component={Join1}
				options={{
					title: '회원가입',
				}}
			/>
		</Fragment>
	);
}
