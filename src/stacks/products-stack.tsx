import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {Fragment} from 'react';
import HomeProductList from '../screens/home/home-product-list';
import HomeProductCountry from '../screens/home/select-product-country';
import PackageSelect from '../screens/product/packge-selete';
import ProductPay from '../screens/product/pay';
import ProductPeople from '../screens/product/people';
import ProductDetail from '../screens/product/product-detail';
import ProductSelectDay from '../screens/product/product-select-day';
import Products from '../screens/product/products';
import ProductReservation from '../screens/product/reservation';
import Reserve from '../screens/product/reserve';
import ReserveCancel from '../screens/product/reserve-cance';
import ReserveDetail from '../screens/product/reserve-detail';
import ReserveList from '../screens/product/reserve-list';
import SearchProductList from '../screens/product/search-product-list';
import ProductSelectSpec from '../screens/product/select-spec';
import ProductGoodProduct from '../screens/product/test';
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
					headerBackVisible: false,
					headerTitle: '상품',
				}}
			/>
			<Stack.Screen
				name='PackageSelect'
				component={PackageSelect}
				options={{
					title: '예약하기',
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

			<Stack.Screen
				name='ReserveCancel'
				component={ReserveCancel}
				options={{
					title: '예약 상세내역',
				}}
			/>

			<Stack.Screen
				name='HomeProductCountry'
				component={HomeProductCountry}
				options={{
					title: '나라선택',
				}}
			/>

			<Stack.Screen
				name='HomeProductList'
				component={HomeProductList}
				options={{
					title: '상품리스트',
				}}
			/>

			<Stack.Screen
				name='ProductGoodProduct'
				component={ProductGoodProduct}
				options={{
					title: '상품예약',
				}}
			/>
			<Stack.Screen
				name='ProductSelectSpec'
				component={ProductSelectSpec}
				options={{
					title: '상품예약',
				}}
			/>
			<Stack.Screen
				name='ProductReservation'
				component={ProductReservation}
				options={{
					title: '상품예약',
				}}
			/>
			<Stack.Screen
				name='ProductPeople'
				component={ProductPeople}
				options={{
					title: '상품예약',
				}}
			/>
			<Stack.Screen
				name='ProductPay'
				component={ProductPay}
				options={{
					title: '상품예약',
				}}
			/>
			<Stack.Screen
				name='SearchProductList'
				component={SearchProductList}
				options={{
					headerBackVisible: true,
					title: '상품검색',
				}}
			/>
		</Fragment>
	);
}
