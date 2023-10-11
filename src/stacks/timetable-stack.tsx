import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {Fragment} from 'react';
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
import EnrollInfo from '../screens/enroll-info/enroll-info';
import EnrollTravelTitle from '../screens/enroll-info/enroll-travel-title';
import {View, Image} from 'react-native';
const Stack = createNativeStackNavigator();
export default function TimetableStack() {
	return (
		<Fragment>
			<Stack.Screen
				name='EnrollInfo'
				component={EnrollInfo}
				options={{
					title: '새 여행',
				}}
			/>
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
			<Stack.Screen
				name='SearchPlace'
				component={SearchPlace}
				options={{
					title: '숙소 추가하기',
					headerStyle: {backgroundColor: 'white'},
					headerShadowVisible: false,
					headerTitleAlign: 'center',
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
				}}
			/>
			<Stack.Screen
				name='Preset'
				component={Preset}
				options={{
					headerLeft: () => (
						<View style={{justifyContent: 'center'}}>
							<Image
								source={require('../../public/images/danim_logo_row.png')}
								style={{height: 30, aspectRatio: 2.054}}
							/>
						</View>
					),
					headerBackVisible: false,
					title: '다님의 제안이에요',
				}}
			/>
			<Stack.Screen
				name='Timetable'
				component={Timetable}
				options={{
					title: '여행 스케줄',
				}}
			/>
			<Stack.Screen
				name='CourseDetail'
				component={CourseDetail}
				options={{
					title: '관광지 상세정보',
				}}
			/>
			<Stack.Screen
				name='TimetableAddPlace'
				component={TimetableAddPlace}
				options={{
					title: '추가하기',
				}}
			/>
			<Stack.Screen
				name='Recommend'
				component={Recommend}
				options={{
					title: '추천',
				}}
			/>
			<Stack.Screen
				name='Modify'
				component={Modify}
				options={{
					title: '수정',
				}}
			/>
			<Stack.Screen
				name='MapInfo'
				component={MapInfo}
				options={{
					title: '지도',
				}}
			/>
			<Stack.Screen
				name='EnrollTravelTitle'
				component={EnrollTravelTitle}
				options={{
					title: '새여행',
				}}
			/>
		</Fragment>
	);
}
