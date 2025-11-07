import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View, StyleSheet, Text} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../../../redux';
import {setTrafficField} from '../../../../redux/product/bookingSlice';
import {colors} from '../../../colors';
import {SvgCheck} from '../../../svg/svg';
type Props = {
	trafficType: string;
	label?: string;
	onValueChange?: (v: boolean) => void;
};

export default function ArrivalVisaToggle({trafficType, label = '비자 필요 여부', onValueChange}: Props) {
	const {trafficArray} = useAppSelector(state => state.bookingSlice);
	const stored = trafficArray?.find(it => String(it?.traffic_type) === String(trafficType))?.arrival_visa ?? null;
	const dispatch = useAppDispatch();

	const [value, setValue] = useState<boolean>(!!stored);

	useEffect(() => {
		if (!!stored !== value) setValue(!!stored);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stored]);

	useEffect(() => {
		dispatch(
			setTrafficField({
				trafficTypeValue: trafficType,
				fieldId: 'arrival_visa',
				value: value,
			}),
		);
		onValueChange?.(value);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, trafficType]);

	return (
		<TouchableOpacity
			onPress={() => setValue(v => !v)}
			style={styles.row}
			accessibilityRole='button'
			accessibilityState={{checked: value}}>
			<View style={[styles.checkbox, value && styles.checkboxChecked]}>{value && <SvgCheck color='#fff' />}</View>
			<Text style={{marginLeft: 8}}>{label}</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 8,
		marginBottom: 12,
	},
	checkbox: {
		width: 20,
		height: 20,
		borderRadius: 4,
		borderWidth: 1,
		borderColor: colors.grey300,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fff',
	},
	checkboxChecked: {
		backgroundColor: colors.blue500,
		borderColor: colors.blue500,
	},
});
