import React, {useEffect, useState} from 'react';
import {View, TextInput, StyleSheet, Text} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../../../redux';
import {setTrafficField} from '../../../../redux/product/bookingSlice';
import {colors} from '../../../colors';
type Props = {
	trafficType: string;
	label?: string;
	placeholder?: string;
	required?: boolean;
	onValueChange?: (v: number | null) => void;
};

export default function SafetyseatSupChildInput({
	trafficType,
	label = '유아 보조석(대여) 수',
	placeholder = '0',
	required = false,
	onValueChange,
}: Props) {
	const {trafficArray} = useAppSelector(state => state.bookingSlice);
	const stored =
		trafficArray?.find(it => String(it?.traffic_type) === String(trafficType))?.safetyseat_sup_child ?? '';
	const [value, setValue] = useState<string>(stored !== undefined && stored !== null ? String(stored) : '');

	const dispatch = useAppDispatch();

	useEffect(() => {
		const storedStr = stored !== undefined && stored !== null ? String(stored) : '';
		if (storedStr !== value) setValue(storedStr);
	}, [stored]);

	useEffect(() => {
		const num = value === '' ? null : parseInt(value.replace(/[^0-9]/g, ''), 10);
		dispatch(
			setTrafficField({
				trafficTypeValue: trafficType,
				fieldId: 'safetyseat_sup_child',
				value: num === null || isNaN(num) ? '' : num,
			}),
		);
		onValueChange?.(num === null || isNaN(num) ? null : num);
	}, [value, trafficType]);

	return (
		<View style={{marginBottom: 12}}>
			<Text style={{marginBottom: 6, color: colors.grey800, fontSize: 24}}>
				{label} {required ? <Text style={{color: colors.red400}}>*</Text> : null}
			</Text>
			<TextInput
				placeholder={placeholder}
				placeholderTextColor={colors.grey400}
				value={value}
				onChangeText={t => setValue(t.replace(/[^0-9]/g, ''))}
				style={styles.input}
				keyboardType='numeric'
				accessibilityLabel={`safetyseat-sup-child-${trafficType}`}
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
