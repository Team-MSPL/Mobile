import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {Fragment} from 'react';
import SearchPlace from '../screens/enroll-info/search-place';
import SelectCity from '../screens/enroll-info/select-city';
import SelectDay from '../screens/enroll-info/select-day';
import SelectMulti from '../screens/enroll-info/select-multi';
import SelectDistance from '../screens/enroll-info/select-distance';
import FinalCheck from '../screens/enroll-info/final-check';
import Preset from '../screens/timetable/preset';
import Timetable from '../screens/timetable/timetable';
import CourseDetail from '../screens/timetable/course-detail';
import TimetableAddPlace from '../screens/timetable/timetable-add-place';
import Recommend from '../screens/timetable/recommend';
import Modify from '../screens/timetable/modify';
import MapInfo from '../screens/timetable/map-info';
import EnrollTravelTitle from '../screens/enroll-info/enroll-travel-title';
import {colors} from '../utill/colors';
import {CourseReview} from '../utill/component/timetable/course-review';
import RecommendSelectWho from '../screens/enroll-info/select-who';
import RecommendSelectMove from '../screens/enroll-info/select-move';
import RecommendSelectBusy from '../screens/enroll-info/select-busy';
import RecommendSelectConcept from '../screens/enroll-info/select-concept';
import RecommendSelectPlay from '../screens/enroll-info/select-play';
import RecommendSelectTour from '../screens/enroll-info/select-tour';
import PresetDetail from '../screens/timetable/preset-detail';
const Stack = createNativeStackNavigator();
export default function TimetableStack() {
	return (
		<Fragment>
			<Stack.Screen
				name='SelectCity'
				component={SelectCity}
				options={{
					title: '새 여행 (1/5)',
					headerStyle: {backgroundColor: colors.main},
					headerShadowVisible: false,
				}}
			/>
			<Stack.Screen
				name='SelectDay'
				component={SelectDay}
				options={{
					title: '새 여행 (2/5)',
					headerStyle: {backgroundColor: colors.main},
					headerShadowVisible: false,
				}}
			/>
			<Stack.Screen
				name='SelectMulti'
				component={SelectMulti}
				options={{
					title: '새 여행 (3/5)',
					headerStyle: {backgroundColor: colors.main},
					headerShadowVisible: false,
				}}
			/>
			<Stack.Screen
				name='SearchPlace'
				component={SearchPlace}
				options={{
					title: '요소 추가하기',
					headerStyle: {backgroundColor: colors.main},
					headerShadowVisible: false,
					headerTitleAlign: 'center',
				}}
			/>
			<Stack.Screen
				name='SelectDistance'
				component={SelectDistance}
				options={{
					title: '여행일정추천',
					headerStyle: {backgroundColor: colors.main},
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
					headerBackVisible: false,
					gestureEnabled: false,
					title: '다님의 제안이에요',
				}}
			/>
			<Stack.Screen
				name='Timetable'
				component={Timetable}
				options={{
					title: '여행 코스',
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
					title: '새 여행',
				}}
			/>
			<Stack.Screen
				name='CourseReview'
				component={CourseReview}
				options={{
					title: '리뷰작성',
				}}
			/>
			<Stack.Screen
				name='RecommendSelectWho'
				component={RecommendSelectWho}
				options={{
					title: '여행일정추천',
				}}
			/>
			<Stack.Screen
				name='RecommendSelectMove'
				component={RecommendSelectMove}
				options={{
					title: '여행일정추천',
				}}
			/>
			<Stack.Screen
				name='RecommendSelectBusy'
				component={RecommendSelectBusy}
				options={{
					title: '여행일정추천',
				}}
			/>
			<Stack.Screen
				name='RecommendSelectConcept'
				component={RecommendSelectConcept}
				options={{
					title: '여행일정추천',
				}}
			/>
			<Stack.Screen
				name='RecommendSelectPlay'
				component={RecommendSelectPlay}
				options={{
					title: '여행일정추천',
				}}
			/>
			<Stack.Screen
				name='RecommendSelectTour'
				component={RecommendSelectTour}
				options={{
					title: '여행일정추천',
				}}
			/>
			<Stack.Screen
				name='PresetDetail'
				component={PresetDetail}
				options={{
					title: '일정 자세히 보기',
				}}
			/>
		</Fragment>
	);
}
