// buildReservationPayloadPure.ts

import {unitForSkuOnDate} from './paymentHelpers';

export function buildReservationPayloadPure({
	params,
	pkgData,
	pdt,
	s_date,
	orderNote,
	buyerObj,
	customArray,
	trafficArr,
	guideLangCode,
}: {
	params: any;
	pkgData: any;
	pdt: any;
	s_date?: string | null;
	orderNote?: string | null;
	buyerObj?: any;
	customArray?: any[];
	trafficArr?: any[];
	guideLangCode?: string | null;
}) {
	const toNumberLocal = (v: any): number | undefined => {
		if (v === null || v === undefined) return undefined;
		const n = Number(String(v).replace(/,/g, ''));
		return Number.isFinite(n) ? n : undefined;
	};

	if ((buyerObj as any)?.buyer_Email && !(buyerObj as any)?.buyer_email) {
		(buyerObj as any).buyer_email = (buyerObj as any).buyer_Email;
		delete (buyerObj as any).buyer_Email;
	}

	const itemNo =
		Array.isArray(params?.item_no) && params.item_no.length > 0
			? params.item_no[0]
			: pkgData?.item?.[0]?.item_no ?? undefined;

	const selectedDate = params?.selected_date ?? s_date ?? null;

	const adultCount = Number(params?.adult ?? 1) || 0;
	const childCount = Number(params?.child ?? 0) || 0;
	const totalQty = adultCount + childCount;

	const preferredAdultUnit = toNumberLocal(params?.adult_price) ?? toNumberLocal(params?.display_price);
	const preferredChildUnit = toNumberLocal(params?.child_price) ?? preferredAdultUnit;

	const unitAdultFallback =
		toNumberLocal(pkgData?.item?.[0]?.b2c_min_price) ?? toNumberLocal(pkgData?.b2c_min_price) ?? 0;
	const unitChildFallback = preferredChildUnit ?? unitAdultFallback;

	const item = pkgData?.item?.[0] ?? null;

	const findSkuObjById = (skuId: any) => {
		if (!item || !Array.isArray(item.skus)) return null;
		return item.skus.find((s: any) => String(s?.sku_id ?? s?.id) === String(skuId)) ?? null;
	};

	// If params.skus provided, normalize and use
	if (Array.isArray(params?.skus) && params.skus.length > 0) {
		const normalized: Array<{sku_id: any; qty: number; price: number}> = [];

		for (const raw of params.skus) {
			if (!raw) continue;
			const skuId = raw.sku_id ?? raw.skuId ?? raw.id ?? null;
			if (!skuId) continue;
			const qty = Number(raw.qty ?? raw.quantity ?? raw.count ?? 0) || 0;

			let unit = toNumberLocal(raw.price ?? raw.unit_price ?? raw.unitPrice);
			const explicitTotal = toNumberLocal(raw.total_price ?? raw.totalPrice);
			if (unit === undefined && explicitTotal !== undefined && qty > 0) unit = explicitTotal / qty;

			if (unit === undefined) {
				const typeHint = (raw.type ?? raw.ticket_type ?? '').toString().toLowerCase();
				unit = typeHint.includes('child') ? preferredChildUnit : preferredAdultUnit;
			}

			if (unit === undefined) {
				const skuObj = findSkuObjById(skuId);
				if (skuObj) unit = unitForSkuOnDate(pkgData, skuObj, selectedDate);
			}

			if (unit === undefined) unit = unitAdultFallback;

			normalized.push({sku_id: skuId, qty: qty || totalQty, price: Number(unit)});
		}

		const payload: Record<string, any> = {
			guid: params?.pkgData?.guid ?? pkgData?.guid ?? undefined,
			pay_type: '01',
			partner_order_no: '1',
			prod_no: params?.prod_no ?? pdt?.prod_no ?? undefined,
			pkg_no: params?.pkg_no ?? undefined,
			item_no: itemNo,
			locale: 'ko',
			state: 'KR',
			...buyerObj,
			s_date: selectedDate ?? undefined,
			e_date: selectedDate ?? undefined,
			event_time: params?.selected_time ?? null,
			...(guideLangCode ? {guide_lang: guideLangCode} : {}),
			...(customArray && customArray.length ? {custom: customArray} : {}),
			...(trafficArr && trafficArr.length ? {traffic: trafficArr} : {}),
			...(orderNote ? {order_note: orderNote} : {}),
		};

		payload.skus = normalized.map(x => ({sku_id: x.sku_id, qty: x.qty, price: x.price}));

		if (params?.total !== undefined && params?.total !== null) {
			const totalNum = Number(params.total);
			payload.total_price = !Number.isNaN(totalNum)
				? totalNum
				: normalized.reduce((s, it) => s + it.qty * it.price, 0);
		} else {
			payload.total_price = normalized.reduce((s, it) => s + it.qty * it.price, 0);
		}

		return payload;
	}

	// Derive when params.skus not provided
	const derived: Array<{sku_id: any; qty: number; price: number}> = [];

	const buildSkuMapFromItem = (itemLocal: any) => {
		const map: Record<string, any[]> = {adult: [], child: [], other: []};
		if (!itemLocal || !Array.isArray(itemLocal.skus)) return map;
		itemLocal.skus.forEach((sku: any) => {
			const keys: string[] = [];
			if (sku?.ticket_rule_spec_item) keys.push(String(sku.ticket_rule_spec_item).toLowerCase());
			if (sku?.spec && typeof sku.spec === 'object')
				Object.values(sku.spec).forEach((v: any) => {
					if (typeof v === 'string') keys.push(v.toLowerCase());
				});
			if (Array.isArray(sku?.specs_ref)) {
				sku.specs_ref.forEach((r: any) => {
					if (r?.spec_value_id) keys.push(String(r.spec_value_id).toLowerCase());
					if (r?.spec_item_id) keys.push(String(r.spec_item_id).toLowerCase());
				});
			}
			let mapped = 'other';
			for (const c of keys) {
				if (!c) continue;
				if (c.includes('child') || c.includes('kid') || c.includes('youth') || c.includes('infant')) {
					mapped = 'child';
					break;
				}
				if (c.includes('adult') || c.includes('man') || c.includes('woman')) {
					mapped = 'adult';
					break;
				}
			}
			if (mapped === 'other' && itemLocal.skus.length === 1) mapped = 'adult';
			map[mapped] = map[mapped] || [];
			map[mapped].push(sku);
		});
		return map;
	};

	if (pkgData) {
		const skuMap = buildSkuMapFromItem(item);

		if (adultCount > 0) {
			const adultSku = skuMap.adult?.[0] ?? item?.skus?.[0] ?? null;
			const skuId = adultSku?.sku_id ?? adultSku?.id ?? null;
			let unitPrice = preferredAdultUnit !== undefined ? preferredAdultUnit : undefined;
			if (unitPrice === undefined && adultSku) unitPrice = unitForSkuOnDate(pkgData, adultSku, selectedDate);
			if (unitPrice === undefined) unitPrice = unitAdultFallback;
			if (skuId) derived.push({sku_id: skuId, qty: adultCount, price: Number(unitPrice)});
		}

		if (childCount > 0) {
			const childSku = skuMap.child?.[0] ?? null;
			if (childSku) {
				const skuId = childSku?.sku_id ?? childSku?.id ?? null;
				let unitPrice = preferredChildUnit !== undefined ? preferredChildUnit : undefined;
				if (unitPrice === undefined) unitPrice = unitForSkuOnDate(pkgData, childSku, selectedDate);
				if (unitPrice === undefined) unitPrice = unitChildFallback;
				if (skuId) derived.push({sku_id: skuId, qty: childCount, price: Number(unitPrice)});
			} else {
				if (derived.length > 0) {
					derived[0].qty += childCount;
				}
			}
		}
	}

	const payload: Record<string, any> = {
		guid: params?.pkgData?.guid ?? pkgData?.guid ?? undefined,
		pay_type: '01',
		partner_order_no: '1',
		prod_no: params?.prod_no ?? pdt?.prod_no ?? undefined,
		pkg_no: params?.pkg_no ?? undefined,
		item_no: itemNo,
		locale: 'ko',
		state: 'KR',
		...buyerObj,
		s_date: selectedDate ?? undefined,
		e_date: selectedDate ?? undefined,
		event_time: params?.selected_time ?? null,
		...(guideLangCode ? {guide_lang: guideLangCode} : {}),
		...(customArray && customArray.length ? {custom: customArray} : {}),
		...(trafficArr && trafficArr.length ? {traffic: trafficArr} : {}),
		...(orderNote ? {order_note: orderNote} : {}),
	};

	payload.skus = derived.map(d => ({sku_id: d.sku_id, qty: d.qty, price: d.price}));
	payload.total_price = payload.skus.reduce(
		(s: number, it: any) => s + Number(it.qty || 0) * Number(it.price || 0),
		0,
	);

	console.log('[buildReservationPayloadPure] derived skus:', payload.skus);
	console.log('[buildReservationPayloadPure] total_price:', payload.total_price);

	return payload;
}
