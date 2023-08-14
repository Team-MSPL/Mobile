import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {Fragment} from 'react';
import MoreInfo from '../screens/more/more-info';
const Stack = createNativeStackNavigator();
export default function MoreStack() {
	return (
		<Fragment>
			<Stack.Screen
				name='MoreInfo'
				component={MoreInfo}
				options={{
					title: '마이페이지',
					headerStyle: {backgroundColor: '#EFFBFB'},
					headerShadowVisible: false,
				}}
			/>
		</Fragment>
	);
}
