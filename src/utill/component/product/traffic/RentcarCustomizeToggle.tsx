import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View, StyleSheet, Text} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../../../redux';
import {setTrafficField} from '../../../../redux/product/bookingSlice';
import {colors} from '../../../colors';
import {SvgCheck} from '../../../svg/svg';
type Props = {
	trafficType: string;
	spec?: any;
	specIndex?: number;
	label?: string;
	onValueChange?: (v: boolean) => void;
};

export default function RentcarCustomizeToggle({trafficType, spec, specIndex, label, onValueChange}: Props) {
	// Do not render if spec does not declare is_rent_customize
	if (spec && !spec?.is_rent_customize) return null;

	const {trafficArray} = useAppSelector(state => state.bookingSlice);
	const stored = trafficArray?.find(it => String(it?.traffic_type) === String(trafficType))?.arrival_airport ?? null;
	const dispatch = useAppDispatch();

	// helper to read stored boolean for this traffic entry
	const findStoredRaw = () => {
		const arr = trafficArray ?? [];
		const entry = arr.find((it: any) => {
			if (String(it?.traffic_type) !== String(trafficType)) return false;
			if (typeof specIndex === 'number') return Number(it?.spec_index) === specIndex;
			return true;
		});
		if (!entry) return undefined;
		if (typeof entry.is_rent_customize === 'undefined') return undefined;
		const raw = entry.is_rent_customize;
		return raw === true || raw === 'true';
	};

	const initialFromSpec = spec?.is_rent_customize?.default === true || spec?.is_rent_customize?.default === 'true';
	const initialStored = findStoredRaw();
	const [value, setValue] = useState<boolean>(() => {
		if (typeof initialStored !== 'undefined') return initialStored;
		return !!initialFromSpec;
	});

	// sync local state when store changes (guarded)
	useEffect(() => {
		const storedVal = findStoredRaw();
		if (typeof storedVal !== 'undefined') {
			if (storedVal !== value) setValue(storedVal);
		} else {
			const specDefault =
				spec?.is_rent_customize?.default === true || spec?.is_rent_customize?.default === 'true';
			if (specDefault !== value) setValue(!!specDefault);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(trafficArray), trafficType, specIndex, JSON.stringify(spec?.is_rent_customize ?? {})]);

	// persist to store when user toggles (guarded)
	useEffect(() => {
		// read current stored one more time to avoid redundant writes
		const arr = trafficArray ?? [];
		const entry = arr.find((it: any) => {
			if (String(it?.traffic_type) !== String(trafficType)) return false;
			if (typeof specIndex === 'number') return Number(it?.spec_index) === specIndex;
			return true;
		});
		const current = entry ? entry.is_rent_customize : undefined;
		const nextVal = value ? true : false;
		if ((current === true || current === 'true') === nextVal) {
			// identical -> skip writing
			onValueChange?.(nextVal);
			return;
		}
		dispatch(
			setTrafficField({
				trafficTypeValue: trafficType,
				fieldId: 'is_rent_customize',
				value: nextVal,
				specIndex: specIndex,
			}),
		);
		onValueChange?.(nextVal);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, trafficType, specIndex, trafficArray]);

	const displayLabel = label ?? spec?.is_rent_customize?.label ?? '직접 주소 입력 여부';

	return (
		<TouchableOpacity
			onPress={() => setValue(v => !v)}
			style={styles.row}
			accessibilityRole='button'
			accessibilityState={{checked: value}}>
			<View style={[styles.checkbox, value && styles.checkboxChecked]}>{value && <SvgCheck color='#fff' />}</View>
			<Text style={{marginLeft: 8}}>{displayLabel}</Text>
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
