import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {useAppSelector} from '../redux';
import Main from '../screens/home/main';
import LoginScreen from '../screens/login/login-screen';
import CommunityStack from './community-stack';
import JoinStack from './join-stack';
import MoreStack from './more-stack';
import RegionRecommendStack from './region-recommend-stack';
import TimetableStack from './timetable-stack';
const Stack = createNativeStackNavigator();
export default function StackNavigator() {
	const {isLogin} = useAppSelector(state => state.userSlice);
	const {anonymous} = useAppSelector(state => state.loginSlice);
	return (
		<NavigationContainer>
			<Stack.Navigator>
				{isLogin || anonymous ? (
					<Stack.Screen
						name='Home'
						component={Main}
						options={{
							title: 'DANIM',
							headerStyle: {backgroundColor: '#EFFBFB'},
							headerShadowVisible: false,
						}}
					/>
				) : (
					<Stack.Screen name='LoginScreen' component={LoginScreen} options={{headerShown: false}} />
				)}

				{TimetableStack()}
				{CommunityStack()}
				{RegionRecommendStack()}
				{MoreStack()}
				{JoinStack()}
			</Stack.Navigator>
		</NavigationContainer>
	);
}
