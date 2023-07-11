import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Main from '../screens/home/main';
import LoginScreen from '../screens/login/login-screen';
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
			</Stack.Navigator>
		</NavigationContainer>
	);
}
