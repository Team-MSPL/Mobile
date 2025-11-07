import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../../../redux';
import {setCustomField} from '../../../../redux/product/bookingSlice';
import {colors} from '../../../colors';
type Props = {
	cusType: string; // "cus_01" or "cus_02"
	required?: boolean;
	onValueChange?: (v: string) => void;
};

/**
 * GenderSelector
 * - shows two option buttons (여성 / 남성)
 * - stores "F" for female and "M" for male under zustand.customMap[cusType].gender
 */
export default function GenderSelector({cusType, required = false, onValueChange}: Props) {
	const {customMap} = useAppSelector(state => state.bookingSlice);
	const stored = customMap?.[cusType]?.gender ?? '';
	const dispatch = useAppDispatch();

	// local: "M" | "F" | ""
	const [value, setValue] = useState<string>(stored || '');

	useEffect(() => {
		// keep local in sync with store if it changes externally
		if ((stored || '') !== value) setValue(stored || '');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stored]);

	useEffect(() => {
		dispatch(setCustomField({cusType, fieldId: 'gender', value}));
		onValueChange?.(value);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, cusType]);

	return (
		<View style={{marginBottom: 12}}>
			<Text style={{marginBottom: 6, color: colors.grey800, fontSize: 24}}>
				성별 {required ? <Text style={{color: colors.red400}}>*</Text> : null}
			</Text>

			<View style={{flexDirection: 'row', marginTop: 8, gap: 8}}>
				<TouchableOpacity
					onPress={() => setValue('F')}
					style={[styles.smallOption, value === 'F' ? styles.smallOptionActive : undefined, {marginRight: 8}]}
					accessibilityRole='button'
					accessibilityState={{selected: value === 'F'}}>
					<Text style={value === 'F' ? styles.smallOptionActiveText : undefined}>여성</Text>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={() => setValue('M')}
					style={[styles.smallOption, value === 'M' ? styles.smallOptionActive : undefined]}
					accessibilityRole='button'
					accessibilityState={{selected: value === 'M'}}>
					<Text style={value === 'M' ? styles.smallOptionActiveText : undefined}>남성</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	smallOption: {
		flex: 1,
		height: 56,
		borderRadius: 12,
		paddingVertical: 10,
		paddingHorizontal: 14,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: colors.greyOpacity100,
		backgroundColor: colors.grey50,
	},
	smallOptionActive: {
		borderWidth: 1,
		borderColor: colors.blue500,
		backgroundColor: colors.blue50 || '#eef5ff',
	},
	smallOptionActiveText: {
		color: colors.blue500,
	},
});
