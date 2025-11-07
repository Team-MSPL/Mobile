import React, {useEffect, useState} from 'react';
import {View, TextInput, StyleSheet, Text} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../../../redux';
import {setCustomField} from '../../../../redux/product/bookingSlice';
import {colors} from '../../../colors';
type Props = {
	cusType: string; // "cus_01" | "cus_02" | "contact" | "send"
	initialValue?: string;
	required?: boolean;
	onValueChange?: (value: string) => void;
};

export default function NativeFirstNameInput({cusType, initialValue = '', required = false, onValueChange}: Props) {
	const {customMap} = useAppSelector(state => state.bookingSlice);
	const storedValue = customMap?.[cusType]?.native_first_name ?? null;
	const dispatch = useAppDispatch();

	const [value, setValue] = useState<string>(initialValue || storedValue || '');

	useEffect(() => {
		if (storedValue && storedValue !== value) setValue(storedValue);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [storedValue]);

	useEffect(() => {
		dispatch(setCustomField({cusType, fieldId: 'native_first_name', value: value}));
		onValueChange?.(value);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, cusType]);

	return (
		<View style={{marginBottom: 12}}>
			<Text style={{marginBottom: 6, color: colors.grey800, fontSize: 24}}>
				이름(현지어) {required ? <Text style={{color: colors.red400}}>*</Text> : null}
			</Text>

			<TextInput
				placeholder='예) 길동'
				placeholderTextColor={colors.grey400}
				value={value}
				onChangeText={setValue}
				style={styles.input}
				accessibilityLabel={`${cusType}-native-first-name`}
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
