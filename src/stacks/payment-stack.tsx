import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {Fragment} from 'react';
import CheckoutPage from '../screens/payments/checkout';
import Success from '../screens/payments/success';
const Stack = createNativeStackNavigator();
export default function PaymentStack() {
	return (
		<Fragment>
			<Stack.Screen
				name='PaymentStack'
				component={CheckoutPage}
				options={{
					headerTitle: '상품 결제',
				}}
			/>
			<Stack.Screen
				name='Success'
				component={Success}
				options={{
					headerBackVisible: false,
					headerTitle: '결제 완료',
				}}
			/>
		</Fragment>
	);
}
