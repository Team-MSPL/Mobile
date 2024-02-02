import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {Fragment} from 'react';
import DetailResult from '../screens/enroll-info/region-recommend/detail-result';
import SelectDistance from '../screens/enroll-info/region-recommend/select-distance';
import SelectPopularity from '../screens/enroll-info/region-recommend/select-popularity';
import SelectTendency from '../screens/enroll-info/region-recommend/select-tendency';
import ViewResult from '../screens/enroll-info/region-recommend/view-result';
import EnrollInfo from '../screens/enroll-info/region-recommend/enroll-info';
import SelectWho from '../screens/enroll-info/region-recommend/select-who';
import SelectSeason from '../screens/enroll-info/region-recommend/select-season';
import SelectConcept from '../screens/enroll-info/region-recommend/select-concept';
import SelectPlay from '../screens/enroll-info/region-recommend/select-play';
import SelectTour from '../screens/enroll-info/region-recommend/select-tour';
const Stack = createNativeStackNavigator();
export default function RegionRecommendStack() {
	return (
		<Fragment>
			<Stack.Screen
				name='RegionEnrollInfo'
				component={EnrollInfo}
				options={{
					title: '지역 추천',
				}}
			/>
			<Stack.Screen name='RegionSelectWho' component={SelectWho} options={{title: '여행 지역 추천'}} />
			<Stack.Screen name='RegionSelectSeason' component={SelectSeason} options={{title: '여행 지역 추천'}} />
			<Stack.Screen name='RegionSelectConcept' component={SelectConcept} options={{title: '여행 지역 추천'}} />
			<Stack.Screen name='RegionSelectPlay' component={SelectPlay} options={{title: '여행 지역 추천'}} />
			<Stack.Screen name='RegionSelectTour' component={SelectTour} options={{title: '여행 지역 추천'}} />

			<Stack.Screen
				name='RegionSelectTendency'
				component={SelectTendency}
				options={{
					title: '성향 선택',
				}}
			/>
			<Stack.Screen
				name='RegionSelectDistance'
				component={SelectDistance}
				options={{
					title: '여행 반경 설정',
				}}
			/>
			<Stack.Screen
				name='RegionSelectPopularity'
				component={SelectPopularity}
				options={{
					title: '인기도 설정',
				}}
			/>
			<Stack.Screen
				name='RegionViewResult'
				component={ViewResult}
				options={{
					gestureEnabled: false,
					headerBackVisible: false,
					title: '추천 결과',
				}}
			/>
			<Stack.Screen
				name='DetailResult'
				component={DetailResult}
				options={{
					title: '여행 지역 추천',
				}}
			/>
		</Fragment>
	);
}
