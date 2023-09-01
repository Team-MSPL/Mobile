import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {Fragment} from 'react';
import AddEssential from '../screens/enroll-info/add-essential';
import AddAccommodation from '../screens/enroll-info/add-accommodation';
import SearchPlace from '../screens/enroll-info/search-place';
import SelectCity from '../screens/enroll-info/select-city';
import SelectDay from '../screens/enroll-info/select-day';
import SelectMulti from '../screens/enroll-info/select-multi';
import SelectDistance from '../screens/enroll-info/select-distance';
import SelectTendency from '../screens/enroll-info/select-tendency';
import FinalCheck from '../screens/enroll-info/final-check';
import Preset from '../screens/timetable/preset';
import Timetable from '../screens/timetable/timetable';
import CourseDetail from '../screens/timetable/course-detail';
import TimetableAddPlace from '../screens/timetable/timetable-add-place';
import Recommend from '../screens/timetable/recommend';
import Modify from '../screens/timetable/modify';
import MapInfo from '../screens/timetable/map-info';
const Stack = createNativeStackNavigator();
export default function TimetableStack() {
	return (
		<Fragment>
			<Stack.Screen
				name='SelectCity'
				component={SelectCity}
				options={{
					title: '새 여행 (1/5)',
					headerStyle: {backgroundColor: '#EFFBFB'},
					headerShadowVisible: false,
				}}
			/>
			<Stack.Screen
				name='SelectDay'
				component={SelectDay}
				options={{
					title: '새 여행 (2/5)',
					headerStyle: {backgroundColor: '#EFFBFB'},
					headerShadowVisible: false,
				}}
			/>
			<Stack.Screen
				name='SelectMulti'
				component={SelectMulti}
				options={{
					title: '새 여행 (3/5)',
					headerStyle: {backgroundColor: '#EFFBFB'},
					headerShadowVisible: false,
				}}
			/>
			<Stack.Screen name='SearchPlace' component={SearchPlace} options={{headerShown: false}} />
			<Stack.Screen
				name='AddAccommodation'
				component={AddAccommodation}
				options={{
					title: '',
					headerStyle: {backgroundColor: '#EFFBFB'},
					headerShadowVisible: false,
				}}
			/>
			<Stack.Screen
				name='AddEssential'
				component={AddEssential}
				options={{
					title: '',
					headerStyle: {backgroundColor: '#EFFBFB'},
					headerShadowVisible: false,
				}}
			/>
			<Stack.Screen
				name='SelectDistance'
				component={SelectDistance}
				options={{
					title: '새 여행 (4/5)',
					headerStyle: {backgroundColor: '#EFFBFB'},
					headerShadowVisible: false,
				}}
			/>
			<Stack.Screen
				name='SelectTendency'
				component={SelectTendency}
				options={{
					title: '새 여행 (5/5)',
					headerStyle: {backgroundColor: '#EFFBFB'},
					headerShadowVisible: false,
				}}
			/>
			<Stack.Screen
				name='FinalCheck'
				component={FinalCheck}
				options={{
					title: '선택 사항 확인',
					headerStyle: {backgroundColor: '#EFFBFB'},
					headerShadowVisible: false,
				}}
			/>
			<Stack.Screen
				name='Preset'
				component={Preset}
				options={{
					title: '다님의 제안이에요',
					headerStyle: {backgroundColor: '#EFFBFB'},
					headerShadowVisible: false,
					headerBackVisible: false,
				}}
			/>
			<Stack.Screen
				name='Timetable'
				component={Timetable}
				options={{
					title: '타임.....ㅌ..',
					headerStyle: {backgroundColor: '#EFFBFB'},
					headerShadowVisible: false,
				}}
			/>
			<Stack.Screen
				name='CourseDetail'
				component={CourseDetail}
				options={{
					title: '설명고고',
					headerStyle: {backgroundColor: '#EFFBFB'},
					headerShadowVisible: false,
				}}
			/>
			<Stack.Screen
				name='TimetableAddPlace'
				component={TimetableAddPlace}
				options={{
					title: '추가고고',
					headerStyle: {backgroundColor: '#EFFBFB'},
					headerShadowVisible: false,
				}}
			/>
			<Stack.Screen
				name='Recommend'
				component={Recommend}
				options={{
					title: '선택해보삼',
					headerStyle: {backgroundColor: '#EFFBFB'},
					headerShadowVisible: false,
				}}
			/>
			<Stack.Screen
				name='Modify'
				component={Modify}
				options={{
					title: '수정해보삼',
					headerStyle: {backgroundColor: '#EFFBFB'},
					headerShadowVisible: false,
				}}
			/>
			<Stack.Screen
				name='MapInfo'
				component={MapInfo}
				options={{
					title: '지도요',
					headerStyle: {backgroundColor: '#EFFBFB'},
					headerShadowVisible: false,
				}}
			/>
		</Fragment>
	);
}
