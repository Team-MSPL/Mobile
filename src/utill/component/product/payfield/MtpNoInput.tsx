import React, {useEffect, useState} from 'react';
import {View, TextInput, StyleSheet, Text} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../../../redux';
import {setCustomField} from '../../../../redux/product/bookingSlice';
import {colors} from '../../../colors';
type Props = {
	cusType: string; // "cus_01" | "cus_02"
	initialValue?: string;
	required?: boolean;
	onValueChange?: (value: string) => void;
};

export default function MtpNoInput({cusType, initialValue = '', required = false, onValueChange}: Props) {
	const {customMap} = useAppSelector(state => state.bookingSlice);
	const stored = customMap?.[cusType]?.mtp_no ?? null;
	const dispatch = useAppDispatch();

	const [value, setValue] = useState<string>(initialValue || stored || '');

	useEffect(() => {
		if (stored && stored !== value) setValue(stored);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stored]);

	useEffect(() => {
		dispatch(setCustomField({cusType, fieldId: 'mtp_no', value: value}));
		onValueChange?.(value);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, cusType]);

	return (
		<View style={{marginBottom: 12}}>
			<Text style={{marginBottom: 6, color: colors.grey800, fontSize: 24}}>
				MTP 번호 {required ? <Text style={{color: colors.red400}}>*</Text> : null}
			</Text>
			<TextInput
				placeholder='예) MTP123456'
				placeholderTextColor={colors.grey400}
				value={value}
				onChangeText={setValue}
				style={styles.input}
				accessibilityLabel={`${cusType}-mtp-no`}
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
