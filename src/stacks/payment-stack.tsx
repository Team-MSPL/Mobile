import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {Fragment} from 'react';
import CheckoutPage from '../screens/payments/checkout';
const Stack = createNativeStackNavigator();
export default function PaymentStack() {
	return (
		<Fragment>
			<Stack.Screen name='PaymentStack' component={CheckoutPage} />
		</Fragment>
	);
}
