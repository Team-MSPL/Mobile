import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {Fragment} from 'react';
import PackageSelect from '../screens/product/packge-selete';
import ProductDetail from '../screens/product/product-detail';
import ProductSelectDay from '../screens/product/product-select-day';
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
			<Stack.Screen
				name='PackageSelect'
				component={PackageSelect}
				options={{
					title: '',
				}}
			/>

			<Stack.Screen
				name='ProductSelectDay'
				component={ProductSelectDay}
				options={{
					title: '',
				}}
			/>
		</Fragment>
	);
}
