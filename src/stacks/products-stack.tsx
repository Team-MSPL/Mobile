import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {Fragment} from 'react';
import Products from '../screens/product/products';
import Join1 from '../screens/user/join1';
const Stack = createNativeStackNavigator();
export default function ProductsStack() {
	return (
		<Fragment>
			<Stack.Screen
				name='Products'
				component={Products}
				options={{
					title: '',
				}}
			/>
		</Fragment>
	);
}
