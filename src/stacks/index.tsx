import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppSelector} from '../redux';
import CommunityMainScreen from '../screens/community/community-main-screen';
import Main from '../screens/home/main';
import LoginScreen from '../screens/login/login-screen';
import MoreInfo from '../screens/more/more-info';
import MyTravelList from '../screens/my-travel-list/my-travel-list';
import {SvgAirplain, SvgCalendar, SvgCommunity, SvgProfile} from '../utill/svg/svg';
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
		<Stack.Navigator
			screenOptions={({navigation}) => ({
				headerTitleAlign: 'center',
				headerTitleStyle: {
					fontFamily: 'SpoqaHanSansNeo-Bold',
					fontSize: 16,
					fontWeight: '900',
				},
				headerStyle: {backgroundColor: 'white'},
				headerShadowVisible: false,
			})}>
			{/* {isLogin ? (
				<Stack.Screen name='Tab' component={TabBar} options={{headerShown: false}} />
			) : (
				<Stack.Screen name='LoginScreen' component={LoginScreen} options={{headerShown: false}} />
			)} */}

			<Stack.Screen name='LoginScreen' component={LoginScreen} options={{headerShown: false}} />
			<Stack.Screen name='Tab' component={TabBar} options={{headerShown: false}} />

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
	);
}
function TabBar() {
	const insets = useSafeAreaInsets();
	return (
		<Tab.Navigator
			backBehavior='none'
			initialRouteName='Home'
			screenOptions={{
				tabBarStyle: {
					minHeight: 60 + insets.bottom,
				},
				headerTitleAlign: 'center',
				headerTitleStyle: {
					fontFamily: 'SpoqaHanSansNeo-Bold',
					fontSize: 16,
				},
			}}>
			<Tab.Screen
				name='Home'
				component={Main}
				options={{
					title: '다님',
					headerShown: true,
					tabBarIcon: ({color}) => <SvgAirplain color={color} />,
				}}
			/>
			<Tab.Screen
				name='MyTravelListStack'
				component={MyTravelList}
				options={{
					title: '내여행',
					headerShown: true,
					tabBarIcon: ({color}) => <SvgCalendar color={color} />,
				}}
			/>
			<Tab.Screen
				name='Community'
				component={CommunityMainScreen}
				options={{
					title: '커뮤니티',
					headerShown: true,
					tabBarIcon: ({color}) => <SvgCommunity color={color} />,
				}}
			/>
			<Tab.Screen
				name='More'
				component={MoreInfo}
				options={{
					title: '다님',
					headerShown: true,
					tabBarIcon: ({color}) => <SvgProfile color={color} />,
				}}
			/>
		</Tab.Navigator>
	);
}
