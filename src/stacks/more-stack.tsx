import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {Fragment} from 'react';
import ChangeProfile from '../screens/more/change-profile';
import MoreInfo from '../screens/more/more-info';
import Payment from '../screens/more/payment';
import PolicyMain from '../screens/more/policy-main';
import Terms from '../screens/more/terms';
import Coupon from '../screens/more/coupon';
import Inquire from '../screens/more/inquire';
import NoteList from '../screens/more/note-list';
import TokenLog from '../screens/more/token-log';
const Stack = createNativeStackNavigator();
export default function MoreStack() {
	return (
		<Fragment>
			<Stack.Screen
				name='MoreInfo'
				component={MoreInfo}
				options={{
					title: '마이페이지',
				}}
			/>
			<Stack.Screen
				name='ChangeProfile'
				component={ChangeProfile}
				options={{
					title: '프로필변경',
				}}
			/>
			<Stack.Screen
				name='Payment'
				component={Payment}
				options={{
					title: '결제관련',
				}}
			/>
			<Stack.Screen
				name='Terms'
				component={Terms}
				options={{
					title: '개인정보처리방침',
				}}
			/>
			<Stack.Screen
				name='PolicyMain'
				component={PolicyMain}
				options={{
					title: '이용약관',
				}}
			/>
			<Stack.Screen
				name='Coupon'
				component={Coupon}
				options={{
					title: '쿠폰 입력',
				}}
			/>
			<Stack.Screen
				name='Inquire'
				component={Inquire}
				options={{
					title: '문의 하기',
				}}
			/>
			<Stack.Screen
				name='NoteList'
				component={NoteList}
				options={{
					title: '문의 하기',
				}}
			/>
			<Stack.Screen
				name='TokenLog'
				component={TokenLog}
				options={{
					title: '이용 기록',
				}}
			/>
		</Fragment>
	);
}
