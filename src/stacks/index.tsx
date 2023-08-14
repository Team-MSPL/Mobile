import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import Main from '../screens/home/main';
import LoginScreen from '../screens/login/login-screen';
import CommunityStack from './community-stack';
import MyTravelListStack from './my-travel-list-stack';
import RegionRecommendStack from './region-recommend-stack';
import TimetableStack from './timetable-stack';
const Stack = createNativeStackNavigator();
export default function StackNavigator() {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name='LoginScreen' component={LoginScreen} options={{headerShown: false}} />
				<Stack.Screen
					name='Home'
					component={Main}
					options={{title: 'DANIM', headerStyle: {backgroundColor: '#EFFBFB'}, headerShadowVisible: false}}
				/>
				{TimetableStack()}
				{CommunityStack()}
				{RegionRecommendStack()}
				{MyTravelListStack()}
			</Stack.Navigator>
		</NavigationContainer>
	);
}
