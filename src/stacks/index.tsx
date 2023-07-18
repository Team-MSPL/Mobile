import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AddEssential from '../screens/enroll-info/add-essential';
import AddAccommodation from '../screens/enroll-info/add-accommodation';
import SearchPlace from '../screens/enroll-info/search-place';
import SelectCity from '../screens/enroll-info/select-city';
import SelectDay from '../screens/enroll-info/select-day';
import SelectMulti from '../screens/enroll-info/select-multi';
import Main from '../screens/home/main';
import LoginScreen from '../screens/login/login-screen';
import SelectDistance from '../screens/enroll-info/select-distance';
import SelectTendency from '../screens/enroll-info/select-tendency';
import FinalCheck from '../screens/enroll-info/final-check';
const Stack = createNativeStackNavigator();
export default function StackNavigator() {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name='LoginScreen' component={LoginScreen} options={{headerShown: false}} />
				<Stack.Screen
					name='Home'
					component={Main}
					options={{title: 'DANIM', headerStyle: {backgroundColor: '#EFFBFB'}, headerShadowVisible: false}}
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
			</Stack.Navigator>
		</NavigationContainer>
	);
}
