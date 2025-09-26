import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {Fragment} from 'react';
import ProductDetail from '../screens/product/product-detail';
import Products from '../screens/product/products';
import PresetProduct from '../screens/timetable/preset-product';
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
			<Stack.Screen
				name='ProductDetail'
				component={ProductDetail}
				options={{
					title: '',
				}}
			/>

			<Stack.Screen
				name='PresetProduct'
				component={PresetProduct}
				options={{
					title: '',
				}}
			/>
		</Fragment>
	);
}
