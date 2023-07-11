import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SelectCity from '../screens/enroll-info/select-city';
import SelectDay from '../screens/enroll-info/select-day';
import Main from '../screens/home/main';
const Stack = createNativeStackNavigator();
export default function StackNavigator() {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen
					name='Home'
					component={Main}
					options={{title: 'DANIM', headerStyle: {backgroundColor: '#EFFBFB'}, headerShadowVisible: false}}
				/>
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
			</Stack.Navigator>
		</NavigationContainer>
	);
}
