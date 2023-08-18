import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {useAppSelector} from '../redux';
import CommunityMainScreen from '../screens/community/community-main-screen';
import Main from '../screens/home/main';
import LoginScreen from '../screens/login/login-screen';
import MoreInfo from '../screens/more/more-info';
import CommunityStack from './community-stack';
import JoinStack from './join-stack';
import MoreStack from './more-stack';
import MyTravelListStack from './my-travel-list-stack';
import RegionRecommendStack from './region-recommend-stack';
import TimetableStack from './timetable-stack';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
export default function StackNavigator() {
	const {isLogin} = useAppSelector(state => state.userSlice);
	const {anonymous} = useAppSelector(state => state.loginSlice);
	return (
		<NavigationContainer>
			<Stack.Navigator>
				{isLogin || anonymous ? (
					<Stack.Screen name='Tab' component={TabBar} options={{headerShown: false}} />
				) : (
					<Stack.Screen name='LoginScreen' component={LoginScreen} options={{headerShown: false}} />
				)}
				{TimetableStack()}
				{CommunityStack()}
				{RegionRecommendStack()}
				{MyTravelListStack()}
				{MoreStack()}
				{JoinStack()}
				{/* <Tab.Navigator>
					<Tab.Screen name='First' component={LoginScreen} />
					<Tab.Screen name='Second' component={LoginScreen} />
					<Tab.Screen name='Third' component={LoginScreen} />
				</Tab.Navigator> */}
			</Stack.Navigator>
		</NavigationContainer>
	);
}

function TabBar() {
	return (
		<Tab.Navigator>
			<Tab.Screen
				name='Home'
				component={Main}
				options={{
					title: '홈',
					headerShown: false,
					// tabBarIcon: ({color, size}) => (
					//   <Icon name="search" color={color} size={size} />
					// ),
				}}
			/>
			<Tab.Screen
				name='TravelList'
				component={Main}
				options={{
					title: '내여행',
					headerShown: false,
					// tabBarIcon: ({color, size}) => (
					//   <Icon name="search" color={color} size={size} />
					// ),
				}}
			/>
			<Tab.Screen
				name='Cummunity'
				component={CommunityMainScreen}
				options={{
					title: '커뮤니티',
					headerShown: false,
					// tabBarIcon: ({color, size}) => (
					//   <Icon name="search" color={color} size={size} />
					// ),
				}}
			/>
			<Tab.Screen
				name='More'
				component={MoreInfo}
				options={{
					title: '내정보',
					headerShown: false,
					// tabBarIcon: ({color, size}) => (
					//   <Icon name="search" color={color} size={size} />
					// ),
				}}
			/>
		</Tab.Navigator>
	);
}
