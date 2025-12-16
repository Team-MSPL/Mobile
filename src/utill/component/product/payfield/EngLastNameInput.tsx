import React, {useEffect, useState} from 'react';
import {View, TextInput, StyleSheet, Text} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../../../redux';
import {setCustomField} from '../../../../redux/product/bookingSlice';
import {colors} from '../../../colors';
import {ProductInfoInput} from '../../../layout/layout';

type Props = {
	cusType: string; // e.g. "cus_01" or "cus_02"
	initialValue?: string;
	required?: boolean;
	onValueChange?: (value: string) => void; // optional parent callback
};

export default function EngLastNameInput({cusType, initialValue = '', required = false, onValueChange}: Props) {
	const {customMap} = useAppSelector(state => state.bookingSlice);
	const storedValue = customMap?.[cusType]?.english_last_name ?? '';
	const [value, setValue] = useState<string>(initialValue || storedValue || '');

	// sync store -> local if store had a value
	useEffect(() => {
		if (storedValue && storedValue !== value) {
			setValue(storedValue);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [storedValue]);

	const dispatch = useAppDispatch();
	// write to zustand and notify parent on change
	useEffect(() => {
		// ensure we always write using the exact API field name "english_last_name"
		dispatch(setCustomField({cusType, fieldId: 'english_last_name', value}));
		onValueChange?.(value);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, cusType]);

	return (
		<View style={{marginBottom: 12}}>
			<Text style={{marginBottom: 6, color: colors.grey800, fontSize: 24}}>
				성(영문) {required ? <Text style={{color: colors.red400}}>*</Text> : null}
			</Text>

			<ProductInfoInput
				placeholder='예) HONG'
				placeholderTextColor={colors.grey400}
				value={value}
				onChangeText={setValue}
				accessibilityLabel={`${cusType}-english-last-name`}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	input: {
		height: 54,
		borderRadius: 14,
		backgroundColor: colors.greyOpacity100,
		paddingHorizontal: 12,
		color: colors.grey800,
	},
});
