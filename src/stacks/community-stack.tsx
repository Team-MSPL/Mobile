import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {Fragment} from 'react';
import CommunityMainScreen from '../screens/community/community-main-screen';
import CommunityReadingScreen from '../screens/community/community-reading-screen';
import CommunityWritingScreen from '../screens/community/community-writing-screen';
const Stack = createNativeStackNavigator();
export default function CommunityStack() {
	return (
		<Fragment>
			<Stack.Screen name='CommunityMainScreen' component={CommunityMainScreen} />
			<Stack.Screen
				name='CommunityReadingScreen'
				component={CommunityReadingScreen}
				options={{
					headerBackVisible: true,
					headerBackTitleVisible: true,
					headerTitle: '커뮤니티',
					headerTitleAlign: 'center',
				}}
			/>
			<Stack.Screen
				name='CommunityWritingScreen'
				component={CommunityWritingScreen}
				options={{
					title: '커뮤니티 글 작성',
					headerStyle: {backgroundColor: '#EFFBFB'},
					headerShadowVisible: false,
				}}
			/>
		</Fragment>
	);
}
