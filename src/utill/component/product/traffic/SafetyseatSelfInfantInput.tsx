import React, {useEffect, useState} from 'react';
import {View, TextInput, StyleSheet, Text} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../../../redux';
import {setTrafficField} from '../../../../redux/product/bookingSlice';
import {colors} from '../../../colors';
import {ProductInfoInput} from '../../../layout/layout';
type Props = {
	trafficType: string; // e.g. "psg_qty"
	label?: string;
	placeholder?: string;
	required?: boolean;
	onValueChange?: (v: number | null) => void;
};

export default function SafetyseatSelfInfantInput({
	trafficType,
	label = '유아 카시트(본인 소유) 수',
	placeholder = '0',
	required = false,
	onValueChange,
}: Props) {
	const {trafficArray} = useAppSelector(state => state.bookingSlice);
	const stored =
		trafficArray?.find((it: any) => String(it?.traffic_type) === String(trafficType))?.safetyseat_self_infant ?? '';
	const dispatch = useAppDispatch();

	const [value, setValue] = useState<string>(stored !== undefined && stored !== null ? String(stored) : '');

	useEffect(() => {
		const storedStr = stored !== undefined && stored !== null ? String(stored) : '';
		if (storedStr !== value) setValue(storedStr);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stored]);

	useEffect(() => {
		const num = value === '' ? null : parseInt(value.replace(/[^0-9]/g, ''), 10);
		dispatch(
			setTrafficField({
				trafficTypeValue: trafficType,
				fieldId: 'safetyseat_self_infant',
				value: num === null || isNaN(num) ? '' : num,
			}),
		);
		onValueChange?.(num === null || isNaN(num) ? null : num);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, trafficType]);

	return (
		<View style={{marginBottom: 12}}>
			<Text style={{marginBottom: 6, color: colors.grey800, fontSize: 24}}>
				{label} {required ? <Text style={{color: colors.red400}}>*</Text> : null}
			</Text>
			<ProductInfoInput
				placeholder={placeholder}
				placeholderTextColor={colors.grey400}
				value={value}
				onChangeText={t => setValue(t.replace(/[^0-9]/g, ''))}
				keyboardType='numeric'
				accessibilityLabel={`safetyseat-self-infant-${trafficType}`}
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
