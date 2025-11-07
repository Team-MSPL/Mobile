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
	onValueChange?: (v: string) => void;
};

export default function DepartureAirlineInput({
	trafficType,
	label = '출발 항공사',
	placeholder = '예) eva airline',
	required = false,
	onValueChange,
}: Props) {
	const {trafficArray} = useAppSelector(state => state.bookingSlice);
	const stored =
		trafficArray?.find(it => String(it?.traffic_type) === String(trafficType))?.departure_airlineName ?? null;
	const dispatch = useAppDispatch();

	const [value, setValue] = useState<string>(stored ?? '');

	useEffect(() => {
		if ((stored ?? '') !== value) setValue(stored ?? '');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stored]);

	useEffect(() => {
		dispatch(
			setTrafficField({
				trafficTypeValue: trafficType,
				fieldId: 'departure_airlineName',
				value: value,
			}),
		);
		onValueChange?.(value);
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
				onChangeText={setValue}
				style={styles.input}
				accessibilityLabel={`departure-airline-${trafficType}`}
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
