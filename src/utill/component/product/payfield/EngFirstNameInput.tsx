import React, {useEffect, useState} from 'react';
import {View, TextInput, StyleSheet, Text} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../../../redux';
import {setCustomField} from '../../../../redux/product/bookingSlice';
import {colors} from '../../../colors';

type Props = {
	cusType: string; // e.g. "cus_01" or "cus_02"
	initialValue?: string;
	required?: boolean;
	onValueChange?: (value: string) => void; // optional parent callback
};

/**
 * EngFirstNameInput
 * - Manages local state for "english_first_name" and persists to zustand.
 * - Reads existing value from zustand on mount so edits persist.
 * - Notifies parent via onValueChange if provided.
 */
export default function EngFirstNameInput({cusType, initialValue = '', required = false, onValueChange}: Props) {
	const {customMap} = useAppSelector(state => state.bookingSlice);
	const storedValue = customMap?.[cusType]?.english_first_name ?? '';

	const [value, setValue] = useState<string>(initialValue || storedValue || '');
	const dispatch = useAppDispatch();
	// sync store -> local if store has a value different than local
	useEffect(() => {
		if (storedValue && storedValue !== value) {
			setValue(storedValue);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [storedValue]);

	// write to zustand and notify parent on change
	useEffect(() => {
		dispatch(setCustomField({cusType, fieldId: 'english_first_name', value}));

		onValueChange?.(value);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, cusType]);

	return (
		<View style={{marginBottom: 12}}>
			<Text style={{marginBottom: 6, color: colors.grey800, fontSize: 24}}>
				이름(영문) {required ? <Text style={{color: colors.red400}}>*</Text> : null}
			</Text>

			<TextInput
				placeholder='예) GILDONG'
				placeholderTextColor={colors.grey400}
				value={value}
				onChangeText={setValue}
				style={styles.input}
				accessibilityLabel={`${cusType}-english-first-name`}
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
