import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Image, Platform, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CommunityMainScreen from '../screens/community/community-main-screen';
import Main from '../screens/home/main';
import LoginScreen from '../screens/login/login-screen';
import MoreInfo from '../screens/more/more-info';
import MyTravelList from '../screens/my-travel-list/my-travel-list';
import {SvgAirplain, SvgCalendar, SvgCommunity, SVGProduct, SvgProfile} from '../utill/svg/svg';
import CommunityStack from './community-stack';
import JoinStack from './join-stack';
import MoreStack from './more-stack';
import MyTravelListStack from './my-travel-list-stack';
import RegionRecommendStack from './region-recommend-stack';
import TimetableStack from './timetable-stack';
import {colors} from '../utill/colors';
import HomeModal from '../screens/login/home-modal';
import HikingStack from './hiking-stack';
import {fontPercentage, heightPercentage, widthPercentage} from '../utill/layout/responsive-size';
import Search from '../screens/home/search';
import RecommendPlaces from '../screens/home/recommendPlaces';
import ProductsStack from './products-stack';
import PlannerStack from './planner-stack';
import PaymentStack from './payment-stack';
import HomeProductCountry from '../screens/home/select-product-country';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
export default function StackNavigator() {
	return (
		<Stack.Navigator
			screenOptions={({navigation}) => ({
				headerTitleAlign: 'center',
				headerTitleStyle: {
					fontFamily: 'SpoqaHanSansNeo-Bold',
					fontSize: fontPercentage(16),
					fontWeight: '900',
				},
				headerStyle: {backgroundColor: colors.backgroundWhite},
				headerShadowVisible: false,
			})}>
			<Stack.Screen
				name='LoginScreen'
				component={LoginScreen}
				options={{headerShown: false, gestureEnabled: false}}
			/>
			<Stack.Screen name='Tab' component={TabBar} options={{headerShown: false}} />
			<Stack.Screen name='HomeModal' component={HomeModal} options={{headerShown: false}} />
			<Stack.Screen
				name='Search'
				component={Search}
				options={{
					title: '검색',
				}}
			/>
			<Stack.Screen
				name='RecommendPlaces'
				component={RecommendPlaces}
				options={{
					title: '다님의 추천 여행지',
				}}
			/>

			{TimetableStack()}
			{CommunityStack()}
			{RegionRecommendStack()}
			{MyTravelListStack()}
			{MoreStack()}
			{JoinStack()}
			{HikingStack()}
			{ProductsStack()}
			{PlannerStack()}
			{PaymentStack()}
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
					...(Platform?.isPad && 'height:150'),
					height: heightPercentage(100),
					marginBottom: -insets.bottom,
				},
				tabBarItemStyle: {
					paddingBottom: heightPercentage(10),
				},
				headerTitleAlign: 'center',
				headerTitleStyle: {
					fontFamily: 'SpoqaHanSansNeo-Bold',
					fontSize: fontPercentage(20),
					fontWeight: '900',
				},
			}}>
			<Tab.Screen
				name='Home'
				component={Main}
				options={{
					headerLeft: () => (
						<View style={{justifyContent: 'center', paddingLeft: heightPercentage(24)}}>
							<Image
								resizeMode='contain'
								source={require('../../assets/images/danim_logo_row.png')}
								style={{height: heightPercentage(36), aspectRatio: 2.054}}
							/>
						</View>
					),
					title: '홈',
					tabBarLabelStyle: {
						fontSize: fontPercentage(10),
					},
					headerShown: false,
					headerStyle: {backgroundColor: colors.main},
					tabBarLabelPosition: 'below-icon',
					tabBarActiveTintColor: colors.PointYellow,
					tabBarIcon: ({color}) => (
						<SvgAirplain width={widthPercentage(18)} height={widthPercentage(18)} color={color} />
					),
				}}
			/>
			<Tab.Screen
				name='MyTravelListStack'
				component={MyTravelList}
				options={{
					headerLeft: () => (
						<View style={{justifyContent: 'center', marginLeft: heightPercentage(24)}}>
							<Image
								resizeMode='contain'
								source={require('../../assets/images/danim_logo_row.png')}
								style={{height: heightPercentage(36), aspectRatio: 2.054}}
							/>
						</View>
					),
					title: '내 여행',
					tabBarLabelStyle: {
						fontSize: fontPercentage(10),
					},
					headerStyle: {backgroundColor: colors.main},
					tabBarLabelPosition: 'below-icon',
					headerShown: true,
					tabBarActiveTintColor: colors.PointYellow,
					tabBarIcon: ({color}) => (
						<SvgCalendar width={widthPercentage(18)} height={widthPercentage(18)} color={'black'} />
					),
				}}
			/>
			<Tab.Screen
				name='HomeProductCountry'
				component={HomeProductCountry}
				options={{
					headerLeft: () => (
						<View style={{justifyContent: 'center', marginLeft: heightPercentage(24)}}>
							<Image
								resizeMode='contain'
								source={require('../../assets/images/danim_logo_row.png')}
								style={{height: heightPercentage(36), aspectRatio: 2.054}}
							/>
						</View>
					),
					title: '여행 상품',
					tabBarLabelStyle: {
						fontSize: fontPercentage(10),
					},
					headerStyle: {backgroundColor: colors.main},
					tabBarLabelPosition: 'below-icon',
					headerShown: true,
					tabBarActiveTintColor: colors.PointYellow,
					tabBarIcon: ({color}) => (
						<SVGProduct width={widthPercentage(18)} height={widthPercentage(18)} color={'black'} />
					),
				}}
			/>

			{/* <Tab.Screen
				name='Community'
				component={CommunityMainScreen}
				options={{
					headerLeft: () => (
						<View style={{justifyContent: 'center', paddingLeft: heightPercentage(24)}}>
							<Image
								resizeMode='contain'
								source={require('../../public/images/danim_logo_row.png')}
								style={{height: heightPercentage(36), aspectRatio: 2.054}}
							/>
						</View>
					),
					title: '커뮤니티',
					tabBarLabelStyle: {
						fontSize: fontPercentage(10),
					},
					headerShown: true,
					tabBarLabelPosition: 'below-icon',
					headerStyle: {backgroundColor: colors.main},
					tabBarActiveTintColor: colors.PointYellow,
					tabBarIcon: ({color}) => (
						<SvgCommunity width={widthPercentage(18)} height={widthPercentage(18)} color={color} />
					),
				}}
			/> */}
			<Tab.Screen
				name='More'
				component={MoreInfo}
				options={{
					headerLeft: () => (
						<View style={{justifyContent: 'center', paddingLeft: heightPercentage(24)}}>
							<Image
								resizeMode='contain'
								source={require('../../assets/images/danim_logo_row.png')}
								style={{height: heightPercentage(36), aspectRatio: 2.054}}
							/>
						</View>
					),
					title: '내 정보',
					tabBarLabelStyle: {
						fontSize: fontPercentage(10),
					},
					tabBarLabelPosition: 'below-icon',
					headerStyle: {backgroundColor: colors.main},
					headerShown: true,
					tabBarActiveTintColor: colors.PointYellow,
					tabBarIcon: ({color}) => (
						<SvgProfile width={widthPercentage(18)} height={widthPercentage(18)} color={color} />
					),
				}}
			/>
		</Tab.Navigator>
	);
}
