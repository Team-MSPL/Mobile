import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {Fragment} from 'react';
import ChangeProfile from '../screens/more/change-profile';
import MoreInfo from '../screens/more/more-info';
import Payment from '../screens/more/payment';
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
			<Stack.Screen
				name='ChangeProfile'
				component={ChangeProfile}
				options={{
					title: '프로필변경',
					headerStyle: {backgroundColor: '#EFFBFB'},
					headerShadowVisible: false,
				}}
			/>
			<Stack.Screen
				name='Payment'
				component={Payment}
				options={{
					title: '결제관련',
					headerStyle: {backgroundColor: '#EFFBFB'},
					headerShadowVisible: false,
				}}
			/>
		</Fragment>
	);
}
