import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
<<<<<<< HEAD
import SelectCity from '../screens/enroll-info/select-city';
import SelectDay from '../screens/enroll-info/select-day';
=======
>>>>>>> 13f1331031fa821086ca28d0db07a7969fba9198
import Main from '../screens/home/main';
import LoginScreen from '../screens/login/login-screen';
const Stack = createNativeStackNavigator();
export default function StackNavigator() {
	return (
		<NavigationContainer>
			<Stack.Navigator>
<<<<<<< HEAD
=======
				<Stack.Screen name='LoginScreen' component={LoginScreen} options={{headerShown: false}} />
>>>>>>> 13f1331031fa821086ca28d0db07a7969fba9198
				<Stack.Screen
					name='Home'
					component={Main}
					options={{title: 'DANIM', headerStyle: {backgroundColor: '#EFFBFB'}, headerShadowVisible: false}}
				/>
<<<<<<< HEAD
				<Stack.Screen
					name='SelectCity'
					component={SelectCity}
					options={{
						title: '새 여행 (1/6)',
						headerStyle: {backgroundColor: '#EFFBFB'},
						headerShadowVisible: false,
					}}
				/>
				<Stack.Screen
					name='SelectDay'
					component={SelectDay}
					options={{
						title: '새 여행 (2/6)',
						headerStyle: {backgroundColor: '#EFFBFB'},
						headerShadowVisible: false,
					}}
				/>
=======
>>>>>>> 13f1331031fa821086ca28d0db07a7969fba9198
			</Stack.Navigator>
		</NavigationContainer>
	);
}
