import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {Fragment} from 'react';
import MyTravelListMainScreen from '../screens/my-travel-list/my-travel-list-main-screen';
const Stack = createNativeStackNavigator();
export default function MyTravelListStack() {
	return (
		<Fragment>
			<Stack.Screen
				name='MyTravelListMainScreen'
				component={MyTravelListMainScreen}
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
