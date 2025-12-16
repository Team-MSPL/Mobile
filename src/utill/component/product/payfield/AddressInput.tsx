import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';

import {useAppDispatch, useAppSelector} from '../../../../redux';
import {setCustomField} from '../../../../redux/product/bookingSlice';
import {colors} from '../../../colors';
import {ProductInfoInput} from '../../../layout/layout';
type Props = {
	cusType: string; // "send"
	initialValue?: string;
	required?: boolean;
	onValueChange?: (value: string) => void;
};

export default function AddressInput({cusType, initialValue = '', required = false, onValueChange}: Props) {
	const {customMap} = useAppSelector(state => state.bookingSlice);
	const stored = customMap?.[cusType]?.address ?? '';
	const dispatch = useAppDispatch();
	const [value, setValue] = useState<string>(initialValue || stored || '');

	useEffect(() => {
		if ((stored ?? '') !== value) setValue(stored ?? '');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stored]);

	useEffect(() => {
		dispatch(setCustomField({cusType, fieldId: 'address', value}));
		onValueChange?.(value);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, cusType]);

	return (
		<View style={{marginBottom: 12}}>
			<Text style={{marginBottom: 6, color: colors.grey800, fontSize: 24}}>
				주소 {required ? <Text style={{color: colors.red400}}>*</Text> : null}
			</Text>
			<ProductInfoInput
				deco={'height:80px;'}
				placeholder='예) No.88, Sec.2, Zhongshan N. Rd.'
				placeholderTextColor={colors.grey400}
				value={value}
				onChangeText={setValue}
				multiline
				accessibilityLabel={`${cusType}-address`}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	input: {
		borderRadius: 14,
		backgroundColor: colors.greyOpacity100,
		paddingHorizontal: 12,
		color: colors.grey800,
		paddingVertical: 10,
	},
});
