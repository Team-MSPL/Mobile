import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// 타입 정의
export interface BookingState {
	guideLangCode: string | null;

	customMap: Record<string, Record<string, any>>;

	buyer_first_name: string;
	buyer_last_name: string;
	buyer_Email: string;
	buyer_tel_country_code: string | number;
	buyer_tel_number: string;
	buyer_country: string;

	trafficArray: Array<Record<string, any>>;
}

const initialState: BookingState = {
	guideLangCode: null,
	customMap: {},

	buyer_first_name: '',
	buyer_last_name: '',
	buyer_Email: '',
	buyer_tel_country_code: '',
	buyer_tel_number: '',
	buyer_country: '',

	trafficArray: [],
};

const bookingSlice = createSlice({
	name: 'booking',
	initialState,
	reducers: {
		// === guide language ===
		setGuideLangCode: (state, action: PayloadAction<string | null>) => {
			state.guideLangCode = action.payload;
		},

		// === custom map ===
		setCustomField: (state, action: PayloadAction<{cusType: string; fieldId: string; value: any}>) => {
			const {cusType, fieldId, value} = action.payload;
			const nextGroup = {...(state.customMap[cusType] ?? {}), [fieldId]: value};
			state.customMap = {...state.customMap, [cusType]: nextGroup};
		},

		setCustomGroup: (state, action: PayloadAction<{cusType: string; values: Record<string, any>}>) => {
			const {cusType, values} = action.payload;
			state.customMap[cusType] = {...(state.customMap[cusType] ?? {}), ...values};
		},

		resetCustomGroup: (state, action: PayloadAction<string>) => {
			const cusType = action.payload;
			const next = {...state.customMap};
			delete next[cusType];
			state.customMap = next;
		},

		// === buyer info ===
		setBuyerFirstName: (state, action: PayloadAction<string>) => {
			state.buyer_first_name = action.payload;
		},
		setBuyerLastName: (state, action: PayloadAction<string>) => {
			state.buyer_last_name = action.payload;
		},
		setBuyerEmail: (state, action: PayloadAction<string>) => {
			state.buyer_Email = action.payload;
		},
		setBuyerTelCountryCode: (state, action: PayloadAction<string | number>) => {
			state.buyer_tel_country_code = action.payload;
		},
		setBuyerTelNumber: (state, action: PayloadAction<string>) => {
			state.buyer_tel_number = action.payload;
		},
		setBuyerCountry: (state, action: PayloadAction<string>) => {
			state.buyer_country = action.payload;
		},

		// === traffic ===
		setTrafficArray: (state, action: PayloadAction<Array<Record<string, any>>>) => {
			state.trafficArray = action.payload;
		},

		setTrafficField: (
			state,
			action: PayloadAction<{trafficTypeValue: string; fieldId: string; value: any; specIndex?: number}>,
		) => {
			const {trafficTypeValue, fieldId, value, specIndex} = action.payload;
			const next = [...(state.trafficArray || [])];
			const isEmpty = (v: any) => v === '' || v === null || typeof v === 'undefined';

			let idx = -1;
			if (typeof specIndex === 'number') {
				idx = next.findIndex(
					it => String(it?.traffic_type) === String(trafficTypeValue) && Number(it?.spec_index) === specIndex,
				);
			} else {
				idx = next.findIndex(it => String(it?.traffic_type) === String(trafficTypeValue));
			}

			if (idx >= 0) {
				const existing = next[idx] ?? {};
				const existingVal = existing[fieldId];
				const existingIsEmpty = isEmpty(existingVal);
				const requestedIsEmpty = isEmpty(value);

				if (existingIsEmpty && requestedIsEmpty) return;
				if (!existingIsEmpty && !requestedIsEmpty && String(existingVal) === String(value)) return;

				const item = {...existing};
				if (requestedIsEmpty) {
					delete item[fieldId];
				} else {
					item[fieldId] = value;
				}
				next[idx] = item;
			} else {
				if (isEmpty(value)) return;
				const newItem: Record<string, any> = {traffic_type: trafficTypeValue};
				if (typeof specIndex === 'number') newItem.spec_index = specIndex;
				newItem[fieldId] = value;
				next.push(newItem);
			}

			state.trafficArray = next;
		},

		removeTrafficByType: (state, action: PayloadAction<string>) => {
			const trafficTypeValue = action.payload;
			state.trafficArray = state.trafficArray.filter(it => String(it?.traffic_type) !== String(trafficTypeValue));
		},

		resetAll: () => initialState,
	},
});

// === selectors ===
export const getBuyerObject = (state: BookingState): Record<string, any> => {
	const b: Record<string, any> = {};
	if (state.buyer_first_name.trim()) b.buyer_first_name = state.buyer_first_name;
	if (state.buyer_last_name.trim()) b.buyer_last_name = state.buyer_last_name;
	if (state.buyer_Email.trim()) b.buyer_Email = state.buyer_Email;
	if (String(state.buyer_tel_country_code).trim()) b.buyer_tel_country_code = state.buyer_tel_country_code;
	if (state.buyer_tel_number.trim()) b.buyer_tel_number = state.buyer_tel_number;
	if (state.buyer_country.trim()) b.buyer_country = state.buyer_country;
	return b;
};

export const getCustomArray = (state: BookingState): Array<Record<string, any>> => {
	const arr: Array<Record<string, any>> = [];
	Object.entries(state.customMap).forEach(([cusType, fields]) => {
		if (!fields) return;
		const cleaned: Record<string, any> = {};
		Object.entries(fields).forEach(([k, v]) => {
			if (v !== undefined && v !== null && String(v).trim() !== '') {
				cleaned[k] = v;
			}
		});
		if (Object.keys(cleaned).length > 0) arr.push({cus_type: cusType, ...cleaned});
	});
	return arr;
};

export const getTrafficArray = (state: BookingState): Array<Record<string, any>> => {
	return state.trafficArray
		.map(a => {
			const copy: Record<string, any> = {...(a ?? {})};
			delete copy.spec_index;
			const cleaned: Record<string, any> = {};
			Object.entries(copy).forEach(([k, v]) => {
				if (v === undefined || v === null) return;
				if (typeof v === 'string' && v.trim() === '') return;
				cleaned[k] = v;
			});
			return cleaned;
		})
		.filter(t => Object.keys(t).length > 0);
};
export const getRawTrafficArray = (state: BookingState): Array<Record<string, any>> => {
	return state.trafficArray.map(a => ({...(a ?? {})}));
};

export const {
	setGuideLangCode,
	setCustomField,
	setCustomGroup,
	resetCustomGroup,
	setBuyerFirstName,
	setBuyerLastName,
	setBuyerEmail,
	setBuyerTelCountryCode,
	setBuyerTelNumber,
	setBuyerCountry,
	setTrafficArray,
	setTrafficField,
	removeTrafficByType,
	resetAll,
} = bookingSlice.actions;

export default bookingSlice.reducer;
