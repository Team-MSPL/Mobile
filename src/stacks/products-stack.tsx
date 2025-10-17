import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {Fragment} from 'react';
import PackageSelect from '../screens/product/packge-selete';
import ProductDetail from '../screens/product/product-detail';
import ProductSelectDay from '../screens/product/product-select-day';
import Products from '../screens/product/products';
import Reserve from '../screens/product/reserve';
import ReserveDetail from '../screens/product/reserve-detail';
import ReserveList from '../screens/product/reserve-list';
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

			<Stack.Screen
				name='Reserve'
				component={Reserve}
				options={{
					title: '',
				}}
			/>

			<Stack.Screen
				name='ReserveList'
				component={ReserveList}
				options={{
					title: '내 예약',
				}}
			/>

			<Stack.Screen
				name='ReserveDetail'
				component={ReserveDetail}
				options={{
					title: '예약 상세내역',
				}}
			/>
		</Fragment>
	);
}
