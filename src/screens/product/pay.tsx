import React, {useEffect, useMemo, useState, useCallback} from 'react';
import {View, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Text, Image} from 'react-native';
import {MiniProductCard} from '../../utill/component/product/miniProductCard';
import {formatPrice} from '../../utill/component/product/pay-function';
import {useBookingFields} from '../../utill/kkday/kkdayBookingField';
import GuideLangSelector from '../../utill/component/product/payfield/GuideLangSelector';
import EngLastNameInput from '../../utill/component/product/payfield/EngLastNameInput';
import EngFirstNameInput from '../../utill/component/product/payfield/EngFirstNameInput';
import GenderSelector from '../../utill/component/product/payfield/GenderSelector';
import NationalitySelector from '../../utill/component/product/payfield/NationalitySelector';
import MtpNoInput from '../../utill/component/product/payfield/MtpNoInput';
import IdNoInput from '../../utill/component/product/payfield/IdNoInput';
import PassportNoInput from '../../utill/component/product/payfield/PassportNoInput';
import BirthDateInput from '../../utill/component/product/payfield/BirthDateInput';
import HeightInput from '../../utill/component/product/payfield/HeightInput';
import HeightUnitSelector from '../../utill/component/product/payfield/HeightUnitSelector';
import WeightInput from '../../utill/component/product/payfield/WeightInput';
import WeightUnitSelector from '../../utill/component/product/payfield/WeightUnitSelector';
import ShoeInput from '../../utill/component/product/payfield/ShoeInput';
import ShoeUnitSelector from '../../utill/component/product/payfield/ShoeUnitSelector';
import ShoeTypeSelector from '../../utill/component/product/payfield/ShoeTypeSelector';
import GlassDegreeSelector from '../../utill/component/product/payfield/GlassDegreeSelector';
import MealSelector from '../../utill/component/product/payfield/MealSelector';
import AllergyFoodSelector from '../../utill/component/product/payfield/AllergyFoodSelector';
import NativeLastNameInput from '../../utill/component/product/payfield/NativeLastNameInput';
import NativeFirstNameInput from '../../utill/component/product/payfield/NativeFirstNameInput';
import TelCountryCodeSelector from '../../utill/component/product/payfield/TelCountryCodeSelector';
import TelNumberInput from '../../utill/component/product/payfield/TelNumberInput';
import CountryCitiesSelector from '../../utill/component/product/payfield/CountryCitiesSelector';
import AddressInput from '../../utill/component/product/payfield/AddressInput';
import HotelNameInput from '../../utill/component/product/payfield/HotelNameInput';
import HotelTelNumberInput from '../../utill/component/product/payfield/HotelNumberInput';
import BookingOrderNoInput from '../../utill/component/product/payfield/BookingOrderNoInput';
import CheckInDateInput from '../../utill/component/product/payfield/CheckInDateInput';
import CheckOutDateInput from '../../utill/component/product/payfield/CheckOutDateInput';
import ContactAppSelector from '../../utill/component/product/payfield/ContactAppSelector';
import ContactAppAccountInput from '../../utill/component/product/payfield/ContactAppAccountInput';
import HaveAppToggle from '../../utill/component/product/payfield/HaveAppToggle';
import ArrivalFlightTypeSelector from '../../utill/component/product/traffic/ArrivalFlightTypeSelector';
import ArrivalAirportSelector from '../../utill/component/product/traffic/ArrivalAirportSelector';
import ArrivalFlightNoInput from '../../utill/component/product/traffic/ArrivalFlightNoInput';
import ArrivalTerminalInput from '../../utill/component/product/traffic/ArrivalTerminalInput';
import ArrivalVisaToggle from '../../utill/component/product/traffic/ArrivalVisaToggle';
import ArrivalDateInput from '../../utill/component/product/traffic/ArrivalDateInput';
import ArrivalTimeInput from '../../utill/component/product/traffic/ArrivalTimeInput';
import DepartureFlightTypeSelector from '../../utill/component/product/traffic/DepartureFlightTypeSelector';
import DepartureAirportSelector from '../../utill/component/product/traffic/DepartureAirportSelector';
import DepartureAirlineInput from '../../utill/component/product/traffic/DepartureAirlineInput';
import DepartureFlightNoInput from '../../utill/component/product/traffic/DepartureFlightNoInput';
import DepartureTerminalInput from '../../utill/component/product/traffic/DepartureTerminalInput';
import DepartureHaveBeenInCountryInput from '../../utill/component/product/traffic/DepartureHaveBeenInCountryInput';
import DepartureDateInput from '../../utill/component/product/traffic/DepartureDateInput';
import DepartureTimeInput from '../../utill/component/product/traffic/DepartureTimeInput';
import CarPsgAdultInput from '../../utill/component/product/traffic/CarPsgAdultInput';
import CarPsgChildInput from '../../utill/component/product/traffic/CarPsgChildInput';
import CarPsgInfantInput from '../../utill/component/product/traffic/CarPsgInfantInput';
import SafetyseatSupChildInput from '../../utill/component/product/traffic/SafetyseatSupChildInput';
import SafetyseatSelfChildInput from '../../utill/component/product/traffic/SafetyseatSelfChildInput';
import SafetyseatSupInfantInput from '../../utill/component/product/traffic/SafetyseatSupInfantInput';
import LuggageCarryInput from '../../utill/component/product/traffic/LuggageCarryInput';
import LuggageCheckInput from '../../utill/component/product/traffic/LuggageCheckInput';
import RentcarLocationSelector from '../../utill/component/product/traffic/RentcarLocationSelector';
import RentcarDateInput from '../../utill/component/product/traffic/RentcarDateInput';
import RentcarTimeInput from '../../utill/component/product/traffic/RentcarTimeInput';
import PickupLocationInput from '../../utill/component/product/traffic/PickupLocationInput';
import PickupDateInput from '../../utill/component/product/traffic/PickupDateInput';
import PickupTimeInput from '../../utill/component/product/traffic/PickupTimeInput';
import VoucherLocationInput from '../../utill/component/product/traffic/VoucherLocationInput';
import PassportExpDateInput from '../../utill/component/product/payfield/PassportExpDateInput';
import ZipcodeInput from '../../utill/component/product/payfield/ZipcodeInput';
import ArrivalAirlineInput from '../../utill/component/product/traffic/ArrivalAirlineInput';
import SafetyseatSelfInfantInput from '../../utill/component/product/traffic/SafetyseatSelfInfantInput';
import RentcarCustomizeToggle from '../../utill/component/product/traffic/RentcarCustomizeToggle';
import CollapsibleSection from '../../utill/component/product/collapsibleSection';
import BuyerInfoSection from '../../utill/component/product/sections/BuyerInfoSection';

import {useRoute} from '@react-navigation/native';
import {colors} from '../../utill/colors';
import {styled} from 'styled-components/native';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {useAppDispatch, useAppSelector} from '../../redux';
import {getCustomArray, resetAll, setGuideLangCode} from '../../redux/product/bookingSlice';
import {useBuildReservationPayload} from '../../utill/component/product/booking/useBuildReservationPayload';
import useBookingApi from '../../utill/hooks/useBookingApi';
import {useValidationHelpers} from '../../utill/component/product/booking/validationHelpers';
import {logEvent} from '../../../firebaseAnalytice';

type PaymentMethod = 'toss' | 'naver' | 'kakao' | 'card' | null;

function ProductPay({navigation}: any) {
	const route = useRoute();
	const params = route.params;
	const pkgData = params?.pkgData ?? null;

	// reset booking store when product or package changes
	useEffect(() => {
		resetAll();
	}, [params?.prod_no, params?.pkg_no]);

	const {pdt, s_date} = useAppSelector(state => state.travelSlice);
	if (!pdt) return null;

	const thumbnail = pdt?.prod_img_url ?? (pdt?.img_list && pdt.img_list[0]) ?? '';
	const title = pdt?.prod_name || pdt?.name;

	// reservation date from store

	const {
		fields: rawFields,
		loading: bfLoading,
		error: bfError,
	} = useBookingFields({
		prod_no: params?.prod_no ?? pdt?.prod_no,
		pkg_no: params?.pkg_no ?? null,
	});

	const uses: string[] = useMemo(() => {
		if (!rawFields || !rawFields.custom) return [];
		const cust = rawFields.custom.custom_type ?? rawFields.custom.cus_type ?? null;
		if (!cust) return [];
		if (Array.isArray(cust.use)) return cust.use;
		return [];
	}, [rawFields]);

	const hasCus01 = uses.includes('cus_01');
	const hasCus02 = uses.includes('cus_02');
	const hasContact = uses.includes('contact');
	const hasSend = uses.includes('send');

	const [openSections, setOpenSections] = useState<Record<number, boolean>>({0: true});
	const [completedSections, setCompletedSections] = useState<Record<number, boolean>>({});

	const [orderNote, setOrderNote] = useState<string>(params?.order_note ?? '');
	const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('toss');
	const [agreeAll, setAgreeAll] = useState<boolean>(false);
	const [agreePersonal, setAgreePersonal] = useState<boolean>(false);
	const [agreeService, setAgreeService] = useState<boolean>(false);
	const [agreeMarketing, setAgreeMarketing] = useState<boolean>(false);
	const {buyer_first_name, buyer_last_name, buyer_Email, buyer_tel_country_code, buyer_tel_number, buyer_country} =
		useAppSelector(state => state.bookingSlice);

	useEffect(() => {
		if (agreePersonal && agreeService && agreeMarketing) setAgreeAll(true);
		else if (agreeAll) setAgreeAll(false);
	}, [agreePersonal, agreeService, agreeMarketing]);

	const toggleAgreeAll = useCallback(() => {
		const next = !agreeAll;
		setAgreeAll(next);
		setAgreePersonal(next);
		setAgreeService(next);
		setAgreeMarketing(next);
	}, [agreeAll]);

	const toggleSection = useCallback((idx: number) => {
		setOpenSections(prev => ({...prev, [idx]: !prev[idx]}));
	}, []);

	function markCompleteAndNext(sectionIndex: number) {
		setCompletedSections(prev => ({...prev, [sectionIndex]: true}));
		setOpenSections(prev => ({...prev, [sectionIndex + 1]: true}));
		// const store = useBookingStore.getState();
		// console.log('[BookingStore] guideLangCode:', store.guideLangCode);
		// console.log('[BookingStore] customMap:', store.customMap);
		// console.log('[BookingStore] customArray:', store.getCustomArray());
		// console.log('[BookingStore] trafficArray:', store.getTrafficArray());
	}

	const adultPrice =
		params?.adult_price ??
		params?.display_price ??
		pkgData?.item?.[0]?.b2c_min_price ??
		pkgData?.b2c_min_price ??
		0;
	const productAmount = params?.total;

	const originalPerPerson =
		params?.original_price ?? pkgData?.item?.[0]?.b2c_min_price ?? pkgData?.b2c_min_price ?? undefined;
	const salePerPerson = params?.display_price ?? adultPrice;

	const engLastSpec = rawFields?.custom?.english_last_name ?? null;
	const engLastUse: string[] = engLastSpec && Array.isArray(engLastSpec.use) ? engLastSpec.use : [];

	const engFirstSpec = rawFields?.custom?.english_first_name ?? null;
	const engFirstUse: string[] = engFirstSpec && Array.isArray(engFirstSpec.use) ? engFirstSpec.use : [];

	const genderSpec = rawFields?.custom?.gender ?? null;
	const genderUse: string[] = genderSpec && Array.isArray(genderSpec.use) ? genderSpec.use : [];

	const nationalitySpec = rawFields?.custom?.nationality ?? null;
	const nationalityOptions = nationalitySpec?.list_option ?? [];
	const nationalityUse: string[] = nationalitySpec && Array.isArray(nationalitySpec.use) ? nationalitySpec.use : [];

	const trafficSpec = rawFields?.traffics ?? [];
	const availableTrafficTypes: string[] = useMemo(() => {
		if (!Array.isArray(trafficSpec)) return [];
		return Array.from(new Set(trafficSpec.map((t: any) => t?.traffic_type?.traffic_type_value).filter(Boolean)));
	}, [rawFields]);

	const {validateSectionBuilt, validateSection} = useValidationHelpers();
	const hasFlight = availableTrafficTypes.includes('flight');
	const hasPsgQty = availableTrafficTypes.includes('psg_qty');
	const hasVoucher = availableTrafficTypes.includes('voucher');
	const hasRentcar01 = availableTrafficTypes.includes('rentcar_01');
	const hasRentcar02 = availableTrafficTypes.includes('rentcar_02');
	const hasRentcar03 = availableTrafficTypes.includes('rentcar_03');
	const hasPickup03 = availableTrafficTypes.includes('pickup_03');
	const hasPickup04 = availableTrafficTypes.includes('pickup_04');

	// const {loading: bookingLoading, error: bookingError, run} = useBookingApi();
	const customArray = useAppSelector(state => getCustomArray(state.bookingSlice));
	const store = useAppSelector(state => state.bookingSlice);
	const buildReservationPayload = useBuildReservationPayload();
	const {loading: bookingLoading, error: bookingError, run} = useBookingApi();
	const onPay = async () => {
		// 기존 검증
		if (uses.includes('cus_01') && !customArray.some(c => c.cus_type === 'cus_01')) {
			await logEvent(`customValidate`, {pkgName: pdt?.prod_name});
			Alert.alert('입력 오류', '예약자 정보(필수)를 입력해주세요.');
			return;
		}
		const sendGroup = store.customMap?.['send'] ?? {};
		if (sendGroup?.check_in_date && sendGroup?.check_out_date) {
			const inT = new Date(sendGroup.check_in_date).getTime();
			const outT = new Date(sendGroup.check_out_date).getTime();
			if (!isNaN(inT) && !isNaN(outT) && inT > outT) {
				await logEvent(`checkinValidate`, {pkgName: pdt?.prod_name});
				Alert.alert('입력 오류', '체크인 날짜는 체크아웃 날짜 이전이어야 합니다.');
				return;
			}
		}
		// console.log(params, pkgData, pdt, s_date, orderNote);
		// 빌드 페이로드
		const payload = buildReservationPayload({params, pkgData, pdt, s_date, orderNote});
		// console.debug('[ProductPay] onPay - payload:', payload);
		// console.log(store);
		console.log(payload);
		await logEvent(`goPayMent`, {pkgName: pdt?.prod_name});
		navigation.navigate('PaymentStack', {
			info: {
				value: payload?.total_price,
				name: pdt?.prod_name,
				productinfo: {...payload, image: pdt?.img_list[0], name: pdt?.prod_name},
			},
		});
		// try {
		// 	// run은 useBookingApi().run
		// 	const res = await run(payload);
		// 	console.debug('[ProductPay] run result:', res);

		// 	// 멀티 스펙 결과 처리
		// 	if (res && Array.isArray(res.results)) {
		// 		const results = res.results;
		// 		// 성공 판정: bookingResponse에 order_no 존재 (또는 resp 형태)
		// 		const successes = results.filter(r => {
		// 			const br = r?.bookingResponse;
		// 			if (!br) return false;
		// 			// bookingResponse may be normalized resp already
		// 			return Boolean(br?.order_no ?? br?.orderNo ?? (br?.data && br.data.order_no));
		// 		});
		// 		const failures = results.filter(r => !successes.includes(r));
		// 		console.debug('[ProductPay] successes:', successes, 'failures:', failures);

		// 		if (failures.length === 0) {
		// 			// 모두 성공
		// 			navigation.replace('/product/pay-success');
		// 		} else {
		// 			// 일부 또는 전체 실패
		// 			navigation.replace('/product/pay-fail');
		// 		}
		// 		return;
		// 	}

		// 	// 단일 결과 처리 (기존 호환)
		// 	const bookingResp = res?.bookingResponse ?? res?.bookingResponse;
		// 	// bookingResp may be normalized already (resp)
		// 	const orderNo =
		// 		bookingResp?.order_no ?? bookingResp?.orderNo ?? (bookingResp?.data && bookingResp.data.order_no);

		// 	if (orderNo) {
		// 		navigation.replace('/product/pay-success');
		// 	} else {
		// 		navigation.replace('/product/pay-fail');
		// 	}
		// } catch (err: any) {
		// 	console.error('[ProductPay] onPay error:', err);
		// 	// 이미 useBookingApi에서 save API는 호출됨. 실패시 이동
		// 	navigation.replace('/product/pay-fail');
		// }
	};

	const requiredMap = useMemo(() => {
		const map: Record<number, Array<any>> = {};
		const pushField = (section: number, item: any) => {
			if (!map[section]) map[section] = [];
			map[section].push(item);
		};

		// buyer required
		map[1] = [
			{key: 'buyer_last_name', label: '구매자 성'},
			{key: 'buyer_first_name', label: '구매자 이름'},
			{key: 'buyer_Email', label: '이메일'},
			{key: 'buyer_tel_number', label: '전화번호'},
			{key: 'buyer_country', label: '국가 코드'},
		];

		if (rawFields?.guide_lang) {
			const isReq = String(rawFields.guide_lang?.is_require ?? 'true').toLowerCase() === 'true';
			if (isReq) pushField(2, {key: 'guide_lang', label: '가이드 언어'});
		}

		if (rawFields?.custom && typeof rawFields.custom === 'object') {
			Object.entries(rawFields.custom).forEach(([fieldId, specObj]: any) => {
				const useArr = specObj?.use ?? [];
				const isReq = String(specObj?.is_require ?? '').toLowerCase() === 'true';
				if (!isReq || !Array.isArray(useArr)) return;
				useArr.forEach((cusType: string) => {
					let sectionIndex = -1;
					if (cusType === 'cus_01') sectionIndex = 3;
					else if (cusType === 'cus_02') sectionIndex = 4;
					else if (cusType === 'contact') sectionIndex = 5;
					else if (cusType === 'send') sectionIndex = 6;
					if (sectionIndex > 0) {
						pushField(sectionIndex, {key: fieldId, label: specObj?.label ?? fieldId, cusType});
					}
				});
			});
		}

		if (Array.isArray(rawFields?.traffics)) {
			rawFields.traffics.forEach((spec: any, specIndex: number) => {
				const t = spec?.traffic_type?.traffic_type_value;
				if (!t) return;
				const sectionIndex =
					t === 'flight'
						? 7
						: t === 'psg_qty'
						? 8
						: t.startsWith('rentcar')
						? 9
						: t.startsWith('pickup')
						? 10
						: t === 'voucher'
						? 11
						: -1;
				if (sectionIndex === -1) return;

				Object.entries(spec).forEach(([fieldId, fieldSpec]: any) => {
					if (fieldId === 'traffic_type') return;
					if (!fieldSpec || typeof fieldSpec !== 'object') return;
					const isReq = String(fieldSpec?.is_require ?? '').toLowerCase() === 'true';
					if (!isReq) return;
					pushField(sectionIndex, {
						key: fieldId,
						label: fieldSpec?.label ?? fieldId,
						trafficType: t,
						specIndex,
					});
				});
			});
		}

		return map;
	}, [rawFields]);

	function onCompletePress(sectionIndex: number) {
		const validateSectionFn = validateSectionBuilt(rawFields, requiredMap);
		const missing =
			typeof validateSectionFn === 'function'
				? validateSectionFn(sectionIndex)
				: validateSection(rawFields, sectionIndex, {
						hasCus01,
						hasCus02,
						hasContact,
						hasSend,
						hasFlight,
						hasPsgQty,
						hasRentcar01,
						hasRentcar02,
						hasRentcar03,
						hasPickup03,
						hasPickup04,
						hasVoucher,
				  });

		if (missing.length > 0) {
			Alert.alert('입력 오류', `다음 항목이 비어있습니다:\n${missing.slice(0, 20).join('\n')}`);
			return false;
		}
		console.log('qwe');
		markCompleteAndNext(sectionIndex);
		return true;
	}
	const dispatch = useAppDispatch();
	if (bfLoading) {
		return (
			<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
				<Text>필드를 불러오는 중...</Text>
			</View>
		);
	}
	if (bfError) {
		return (
			<View style={{flex: 1, padding: 20}}>
				<Text style={{color: colors.red500}}>필드 로드 실패</Text>
			</View>
		);
	}

	return (
		<View style={{flex: 1, backgroundColor: '#fff'}}>
			<ScrollView>
				<View style={styles.container}>
					<Text style={{color: colors.grey800}}>예약/결제하기</Text>
				</View>

				<CollapsibleSection
					title='투어 정보'
					open={!!openSections[0]}
					onToggle={() => toggleSection(0)}
					completed={!!completedSections[0]}>
					<Text style={{color: colors.Black, fontWeight: 'bold', marginBottom: 12}}>{title}</Text>
					<Image source={{uri: thumbnail}} style={styles.tourImage} resizeMode='cover' />
				</CollapsibleSection>

				<CollapsibleSection
					title='구매자 정보'
					open={!!openSections[1]}
					onToggle={() => toggleSection(1)}
					completed={!!completedSections[1]}>
					<BuyerInfoSection onComplete={() => onCompletePress(1)} />
				</CollapsibleSection>

				{rawFields?.guide_lang && (
					<CollapsibleSection
						title='가이드 언어'
						open={!!openSections[2]}
						onToggle={() => toggleSection(2)}
						completed={!!completedSections[2]}>
						<GuideLangSelector rawFields={rawFields} onSelect={code => dispatch(setGuideLangCode(code))} />
						<Button height={53} onPress={() => onCompletePress(2)}>
							<Text style={{color: colors.backgroundWhite, fontSize: 17}}>작성 완료</Text>
						</Button>
					</CollapsibleSection>
				)}

				{hasCus01 && (
					<CollapsibleSection
						title='예약자 정보'
						open={!!openSections[3]}
						onToggle={() => toggleSection(3)}
						completed={!!completedSections[3]}>
						<View>
							{engLastUse.includes('cus_01') && (
								<EngLastNameInput
									cusType='cus_01'
									required={String(engLastSpec?.is_require ?? '').toLowerCase() === 'true'}
								/>
							)}
							{engFirstUse.includes('cus_01') && (
								<EngFirstNameInput
									cusType='cus_01'
									required={String(engFirstSpec?.is_require ?? '').toLowerCase() === 'true'}
								/>
							)}
							{genderUse.includes('cus_01') && (
								<GenderSelector
									cusType='cus_01'
									required={String(genderSpec?.is_require ?? '').toLowerCase() === 'true'}
								/>
							)}
							{nationalityUse.includes('cus_01') && (
								<NationalitySelector
									cusType='cus_01'
									options={nationalityOptions}
									required={String(nationalitySpec?.is_require ?? '').toLowerCase() === 'true'}
								/>
							)}
							{rawFields?.custom?.mtp_no &&
								Array.isArray(rawFields.custom.mtp_no.use) &&
								rawFields.custom.mtp_no.use.includes('cus_01') && (
									<MtpNoInput
										cusType='cus_01'
										required={
											String(rawFields.custom.mtp_no.is_require ?? '').toLowerCase() === 'true'
										}
									/>
								)}
							{rawFields?.custom?.id_no &&
								Array.isArray(rawFields.custom.id_no.use) &&
								rawFields.custom.id_no.use.includes('cus_01') && (
									<IdNoInput
										cusType='cus_01'
										required={
											String(rawFields.custom.id_no.is_require ?? '').toLowerCase() === 'true'
										}
									/>
								)}
							{rawFields?.custom?.passport_no &&
								Array.isArray(rawFields.custom.passport_no.use) &&
								rawFields.custom.passport_no.use.includes('cus_01') && (
									<PassportNoInput
										cusType='cus_01'
										required={
											String(rawFields.custom.passport_no.is_require ?? '').toLowerCase() ===
											'true'
										}
									/>
								)}
							{rawFields?.custom?.passport_expdate &&
								Array.isArray(rawFields.custom.passport_expdate.use) &&
								rawFields.custom.passport_expdate.use.includes('cus_01') && (
									<PassportExpDateInput
										cusType='cus_01'
										required={
											String(rawFields.custom.passport_expdate.is_require ?? '').toLowerCase() ===
											'true'
										}
									/>
								)}
							{rawFields?.custom?.birth &&
								Array.isArray(rawFields.custom.birth.use) &&
								rawFields.custom.birth.use.includes('cus_01') && (
									<BirthDateInput
										cusType='cus_01'
										required={
											String(rawFields.custom.birth.is_require ?? '').toLowerCase() === 'true'
										}
									/>
								)}
							{rawFields?.custom?.height &&
								Array.isArray(rawFields.custom.height.use) &&
								rawFields.custom.height.use.includes('cus_01') && (
									<HeightInput
										cusType='cus_01'
										required={
											String(rawFields.custom.height.is_require ?? '').toLowerCase() === 'true'
										}
									/>
								)}
							{rawFields?.custom?.height_unit &&
								Array.isArray(rawFields.custom.height_unit.use) &&
								rawFields.custom.height_unit.use.includes('cus_01') && (
									<HeightUnitSelector
										cusType='cus_01'
										options={rawFields.custom.height_unit.list_option}
										required={
											String(rawFields.custom.height_unit.is_require ?? '').toLowerCase() ===
											'true'
										}
									/>
								)}
							{rawFields?.custom?.weight &&
								Array.isArray(rawFields.custom.weight.use) &&
								rawFields.custom.weight.use.includes('cus_01') && (
									<WeightInput
										cusType='cus_01'
										required={
											String(rawFields.custom.weight.is_require ?? '').toLowerCase() === 'true'
										}
									/>
								)}
							{rawFields?.custom?.weight_unit &&
								Array.isArray(rawFields.custom.weight_unit.use) &&
								rawFields.custom.weight_unit.use.includes('cus_01') && (
									<WeightUnitSelector
										cusType='cus_01'
										options={rawFields.custom.weight_unit.list_option}
										required={
											String(rawFields.custom.weight_unit.is_require ?? '').toLowerCase() ===
											'true'
										}
									/>
								)}
							{rawFields?.custom?.shoe &&
								Array.isArray(rawFields.custom.shoe.use) &&
								rawFields.custom.shoe.use.includes('cus_01') && (
									<ShoeInput
										cusType='cus_01'
										required={
											String(rawFields.custom.shoe.is_require ?? '').toLowerCase() === 'true'
										}
									/>
								)}
							{rawFields?.custom?.shoe_unit &&
								Array.isArray(rawFields.custom.shoe_unit.use) &&
								rawFields.custom.shoe_unit.use.includes('cus_01') && (
									<ShoeUnitSelector
										cusType='cus_01'
										options={rawFields.custom.shoe_unit.list_option}
										required={
											String(rawFields.custom.shoe_unit.is_require ?? '').toLowerCase() === 'true'
										}
									/>
								)}
							{rawFields?.custom?.shoe_type &&
								Array.isArray(rawFields.custom.shoe_type.use) &&
								rawFields.custom.shoe_type.use.includes('cus_01') && (
									<ShoeTypeSelector
										cusType='cus_01'
										options={rawFields.custom.shoe_type.list_option}
										required={
											String(rawFields.custom.shoe_type.is_require ?? '').toLowerCase() === 'true'
										}
									/>
								)}
							{rawFields?.custom?.glass_degree &&
								Array.isArray(rawFields.custom.glass_degree.use) &&
								rawFields.custom.glass_degree.use.includes('cus_01') && (
									<GlassDegreeSelector
										cusType='cus_01'
										options={rawFields.custom.glass_degree.list_option}
										required={
											String(rawFields.custom.glass_degree.is_require ?? '').toLowerCase() ===
											'true'
										}
									/>
								)}
							{rawFields?.custom?.meal &&
								Array.isArray(rawFields.custom.meal.use) &&
								rawFields.custom.meal.use.includes('cus_01') && (
									<MealSelector
										cusType='cus_01'
										options={rawFields.custom.meal.list_option}
										required={
											String(rawFields.custom.meal.is_require ?? '').toLowerCase() === 'true'
										}
									/>
								)}
							{rawFields?.custom?.allergy_food &&
								Array.isArray(rawFields.custom.allergy_food.use) &&
								rawFields.custom.allergy_food.use.includes('cus_01') && (
									<AllergyFoodSelector
										cusType='cus_01'
										options={rawFields.custom.allergy_food.list_option}
										required={
											String(rawFields.custom.allergy_food.is_require ?? '').toLowerCase() ===
											'true'
										}
									/>
								)}
							{rawFields?.custom?.native_last_name &&
								Array.isArray(rawFields.custom.native_last_name.use) &&
								rawFields.custom.native_last_name.use.includes('cus_01') && (
									<NativeLastNameInput
										cusType='cus_01'
										required={
											String(rawFields.custom.native_last_name.is_require ?? '').toLowerCase() ===
											'true'
										}
									/>
								)}
							{rawFields?.custom?.native_first_name &&
								Array.isArray(rawFields.custom.native_first_name.use) &&
								rawFields.custom.native_first_name.use.includes('cus_01') && (
									<NativeFirstNameInput
										cusType='cus_01'
										required={
											String(
												rawFields.custom.native_first_name.is_require ?? '',
											).toLowerCase() === 'true'
										}
									/>
								)}

							<Button height={53} onPress={() => onCompletePress(3)}>
								<Text style={{color: colors.backgroundWhite, fontSize: 17}}>작성 완료</Text>
							</Button>
						</View>
					</CollapsibleSection>
				)}

				{hasCus02 && (
					<CollapsibleSection
						title='여행자 정보'
						open={!!openSections[4]}
						onToggle={() => toggleSection(4)}
						completed={!!completedSections[4]}>
						<View>
							{engLastUse.includes('cus_02') && (
								<EngLastNameInput
									cusType='cus_02'
									required={String(engLastSpec?.is_require ?? '').toLowerCase() === 'true'}
								/>
							)}
							{engFirstUse.includes('cus_02') && (
								<EngFirstNameInput
									cusType='cus_02'
									required={String(engFirstSpec?.is_require ?? '').toLowerCase() === 'true'}
								/>
							)}
							{genderUse.includes('cus_02') && (
								<GenderSelector
									cusType='cus_02'
									required={String(genderSpec?.is_require ?? '').toLowerCase() === 'true'}
								/>
							)}
							{nationalityUse.includes('cus_02') && (
								<NationalitySelector
									cusType='cus_02'
									options={nationalityOptions}
									required={String(nationalitySpec?.is_require ?? '').toLowerCase() === 'true'}
								/>
							)}
							{rawFields?.custom?.mtp_no &&
								Array.isArray(rawFields.custom.mtp_no.use) &&
								rawFields.custom.mtp_no.use.includes('cus_02') && (
									<MtpNoInput
										cusType='cus_02'
										required={
											String(rawFields.custom.mtp_no.is_require ?? '').toLowerCase() === 'true'
										}
									/>
								)}
							{rawFields?.custom?.id_no &&
								Array.isArray(rawFields.custom.id_no.use) &&
								rawFields.custom.id_no.use.includes('cus_02') && (
									<IdNoInput
										cusType='cus_02'
										required={
											String(rawFields.custom.id_no.is_require ?? '').toLowerCase() === 'true'
										}
									/>
								)}
							{rawFields?.custom?.passport_no &&
								Array.isArray(rawFields.custom.passport_no.use) &&
								rawFields.custom.passport_no.use.includes('cus_02') && (
									<PassportNoInput
										cusType='cus_02'
										required={
											String(rawFields.custom.passport_no.is_require ?? '').toLowerCase() ===
											'true'
										}
									/>
								)}
							{rawFields?.custom?.passport_expdate &&
								Array.isArray(rawFields.custom.passport_expdate.use) &&
								rawFields.custom.passport_expdate.use.includes('cus_02') && (
									<PassportExpDateInput
										cusType='cus_02'
										required={
											String(rawFields.custom.passport_expdate.is_require ?? '').toLowerCase() ===
											'true'
										}
									/>
								)}
							{rawFields?.custom?.birth &&
								Array.isArray(rawFields.custom.birth.use) &&
								rawFields.custom.birth.use.includes('cus_02') && (
									<BirthDateInput
										cusType='cus_02'
										required={
											String(rawFields.custom.birth.is_require ?? '').toLowerCase() === 'true'
										}
									/>
								)}
							{rawFields?.custom?.height &&
								Array.isArray(rawFields.custom.height.use) &&
								rawFields.custom.height.use.includes('cus_02') && (
									<HeightInput
										cusType='cus_02'
										required={
											String(rawFields.custom.height.is_require ?? '').toLowerCase() === 'true'
										}
									/>
								)}
							{rawFields?.custom?.height_unit &&
								Array.isArray(rawFields.custom.height_unit.use) &&
								rawFields.custom.height_unit.use.includes('cus_02') && (
									<HeightUnitSelector
										cusType='cus_02'
										options={rawFields.custom.height_unit.list_option}
										required={
											String(rawFields.custom.height_unit.is_require ?? '').toLowerCase() ===
											'true'
										}
									/>
								)}
							{rawFields?.custom?.weight &&
								Array.isArray(rawFields.custom.weight.use) &&
								rawFields.custom.weight.use.includes('cus_02') && (
									<WeightInput
										cusType='cus_02'
										required={
											String(rawFields.custom.weight.is_require ?? '').toLowerCase() === 'true'
										}
									/>
								)}
							{rawFields?.custom?.weight_unit &&
								Array.isArray(rawFields.custom.weight_unit.use) &&
								rawFields.custom.weight_unit.use.includes('cus_02') && (
									<WeightUnitSelector
										cusType='cus_02'
										options={rawFields.custom.weight_unit.list_option}
										required={
											String(rawFields.custom.weight_unit.is_require ?? '').toLowerCase() ===
											'true'
										}
									/>
								)}
							{rawFields?.custom?.shoe &&
								Array.isArray(rawFields.custom.shoe.use) &&
								rawFields.custom.shoe.use.includes('cus_02') && (
									<ShoeInput
										cusType='cus_02'
										required={
											String(rawFields.custom.shoe.is_require ?? '').toLowerCase() === 'true'
										}
									/>
								)}
							{rawFields?.custom?.shoe_unit &&
								Array.isArray(rawFields.custom.shoe_unit.use) &&
								rawFields.custom.shoe_unit.use.includes('cus_02') && (
									<ShoeUnitSelector
										cusType='cus_02'
										options={rawFields.custom.shoe_unit.list_option}
										required={
											String(rawFields.custom.shoe_unit.is_require ?? '').toLowerCase() === 'true'
										}
									/>
								)}
							{rawFields?.custom?.shoe_type &&
								Array.isArray(rawFields.custom.shoe_type.use) &&
								rawFields.custom.shoe_type.use.includes('cus_02') && (
									<ShoeTypeSelector
										cusType='cus_02'
										options={rawFields.custom.shoe_type.list_option}
										required={
											String(rawFields.custom.shoe_type.is_require ?? '').toLowerCase() === 'true'
										}
									/>
								)}
							{rawFields?.custom?.glass_degree &&
								Array.isArray(rawFields.custom.glass_degree.use) &&
								rawFields.custom.glass_degree.use.includes('cus_02') && (
									<GlassDegreeSelector
										cusType='cus_02'
										options={rawFields.custom.glass_degree.list_option}
										required={
											String(rawFields.custom.glass_degree.is_require ?? '').toLowerCase() ===
											'true'
										}
									/>
								)}
							{rawFields?.custom?.meal &&
								Array.isArray(rawFields.custom.meal.use) &&
								rawFields.custom.meal.use.includes('cus_02') && (
									<MealSelector
										cusType='cus_02'
										options={rawFields.custom.meal.list_option}
										required={
											String(rawFields.custom.meal.is_require ?? '').toLowerCase() === 'true'
										}
									/>
								)}
							{rawFields?.custom?.allergy_food &&
								Array.isArray(rawFields.custom.allergy_food.use) &&
								rawFields.custom.allergy_food.use.includes('cus_02') && (
									<AllergyFoodSelector
										cusType='cus_02'
										options={rawFields.custom.allergy_food.list_option}
										required={
											String(rawFields.custom.allergy_food.is_require ?? '').toLowerCase() ===
											'true'
										}
									/>
								)}
							{rawFields?.custom?.native_last_name &&
								Array.isArray(rawFields.custom.native_last_name.use) &&
								rawFields.custom.native_last_name.use.includes('cus_02') && (
									<NativeLastNameInput
										cusType='cus_02'
										required={
											String(rawFields.custom.native_last_name.is_require ?? '').toLowerCase() ===
											'true'
										}
									/>
								)}
							{rawFields?.custom?.native_first_name &&
								Array.isArray(rawFields.custom.native_first_name.use) &&
								rawFields.custom.native_first_name.use.includes('cus_02') && (
									<NativeFirstNameInput
										cusType='cus_02'
										required={
											String(
												rawFields.custom.native_first_name.is_require ?? '',
											).toLowerCase() === 'true'
										}
									/>
								)}
							<Button height={53} onPress={() => onCompletePress(4)}>
								<Text style={{color: colors.backgroundWhite, fontSize: 17}}>작성 완료</Text>
							</Button>
						</View>
					</CollapsibleSection>
				)}

				{hasContact && (
					<CollapsibleSection
						title='연락 수단'
						open={!!openSections[5]}
						onToggle={() => toggleSection(5)}
						completed={!!completedSections[5]}>
						<View>
							{rawFields?.custom?.native_last_name &&
								Array.isArray(rawFields.custom.native_last_name.use) &&
								rawFields.custom.native_last_name.use.includes('contact') && (
									<NativeLastNameInput
										cusType='contact'
										required={
											String(rawFields.custom.native_last_name.is_require ?? '').toLowerCase() ===
											'true'
										}
									/>
								)}
							{rawFields?.custom?.native_first_name &&
								Array.isArray(rawFields.custom.native_first_name.use) &&
								rawFields.custom.native_first_name.use.includes('contact') && (
									<NativeFirstNameInput
										cusType='contact'
										required={
											String(
												rawFields.custom.native_first_name.is_require ?? '',
											).toLowerCase() === 'true'
										}
									/>
								)}
							{rawFields?.custom?.tel_country_code &&
								Array.isArray(rawFields.custom.tel_country_code.use) &&
								rawFields.custom.tel_country_code.use.includes('contact') && (
									<TelCountryCodeSelector
										cusType='contact'
										options={rawFields.custom.tel_country_code.list_option}
										required={
											String(rawFields.custom.tel_country_code.is_require ?? '').toLowerCase() ===
											'true'
										}
									/>
								)}
							{rawFields?.custom?.tel_number &&
								Array.isArray(rawFields.custom.tel_number.use) &&
								rawFields.custom.tel_number.use.includes('contact') && (
									<TelNumberInput
										cusType='contact'
										required={
											String(rawFields.custom.tel_number.is_require ?? '').toLowerCase() ===
											'true'
										}
									/>
								)}
							{rawFields?.custom?.contact_app &&
								Array.isArray(rawFields.custom.contact_app.list_option) &&
								rawFields.custom.contact_app.use?.includes('contact') && (
									<ContactAppSelector
										cusType='contact'
										options={rawFields.custom.contact_app.list_option}
										required={
											String(rawFields.custom.contact_app.is_require ?? '').toLowerCase() ===
											'true'
										}
									/>
								)}
							{rawFields?.custom?.contact_app_account &&
								Array.isArray(rawFields.custom.contact_app_account.use) &&
								rawFields.custom.contact_app_account.use.includes('contact') && (
									<ContactAppAccountInput
										cusType='contact'
										required={
											String(
												rawFields.custom.contact_app_account.is_require ?? '',
											).toLowerCase() === 'true'
										}
									/>
								)}
							{rawFields?.custom?.have_app &&
								Array.isArray(rawFields.custom.have_app.use) &&
								rawFields.custom.have_app.use.includes('contact') && (
									<HaveAppToggle cusType='contact' label='연락 앱 설치 여부' />
								)}
							<Button height={53} onPress={() => onCompletePress(5)}>
								<Text style={{color: colors.backgroundWhite, fontSize: 17}}>작성 완료</Text>
							</Button>
						</View>
					</CollapsibleSection>
				)}

				{hasSend && (
					<CollapsibleSection
						title='투숙 정보'
						open={!!openSections[6]}
						onToggle={() => toggleSection(6)}
						completed={!!completedSections[6]}>
						<View>
							{rawFields?.custom?.native_last_name &&
								Array.isArray(rawFields.custom.native_last_name.use) &&
								rawFields.custom.native_last_name.use.includes('send') && (
									<NativeLastNameInput
										cusType='send'
										required={
											String(rawFields.custom.native_last_name.is_require ?? '').toLowerCase() ===
											'true'
										}
									/>
								)}
							{rawFields?.custom?.native_first_name &&
								Array.isArray(rawFields.custom.native_first_name.use) &&
								rawFields.custom.native_first_name.use.includes('send') && (
									<NativeFirstNameInput
										cusType='send'
										required={
											String(
												rawFields.custom.native_first_name.is_require ?? '',
											).toLowerCase() === 'true'
										}
									/>
								)}
							{rawFields?.custom?.tel_country_code &&
								Array.isArray(rawFields.custom.tel_country_code.use) &&
								rawFields.custom.tel_country_code.use.includes('send') && (
									<TelCountryCodeSelector
										cusType='send'
										options={rawFields.custom.tel_country_code.list_option}
										required={
											String(rawFields.custom.tel_country_code.is_require ?? '').toLowerCase() ===
											'true'
										}
									/>
								)}
							{rawFields?.custom?.tel_number &&
								Array.isArray(rawFields.custom.tel_number.use) &&
								rawFields.custom.tel_number.use.includes('send') && (
									<TelNumberInput
										cusType='send'
										required={
											String(rawFields.custom.tel_number.is_require ?? '').toLowerCase() ===
											'true'
										}
									/>
								)}
							{rawFields?.custom?.country_cities &&
								Array.isArray(rawFields.custom.country_cities.list_option) &&
								rawFields.custom.country_cities.use?.includes('send') && (
									<CountryCitiesSelector
										cusType='send'
										options={rawFields.custom.country_cities.list_option}
										required={
											String(rawFields.custom.country_cities.is_require ?? '').toLowerCase() ===
											'true'
										}
									/>
								)}
							{rawFields?.custom?.zipcode &&
								Array.isArray(rawFields.custom.zipcode.use) &&
								rawFields.custom.zipcode.use.includes('send') && (
									<ZipcodeInput
										cusType='send'
										required={
											String(rawFields.custom.zipcode.is_require ?? '').toLowerCase() === 'true'
										}
									/>
								)}
							{rawFields?.custom?.address &&
								Array.isArray(rawFields.custom.address.use) &&
								rawFields.custom.address.use.includes('send') && (
									<AddressInput
										cusType='send'
										required={
											String(rawFields.custom.address.is_require ?? '').toLowerCase() === 'true'
										}
									/>
								)}
							{rawFields?.custom?.hotel_name &&
								Array.isArray(rawFields.custom.hotel_name.use) &&
								rawFields.custom.hotel_name.use.includes('send') && (
									<HotelNameInput
										cusType='send'
										required={
											String(rawFields.custom.hotel_name.is_require ?? '').toLowerCase() ===
											'true'
										}
									/>
								)}
							{rawFields?.custom?.hotel_tel_number &&
								Array.isArray(rawFields.custom.hotel_tel_number.use) &&
								rawFields.custom.hotel_tel_number.use.includes('send') && (
									<HotelTelNumberInput
										cusType='send'
										required={
											String(rawFields.custom.hotel_tel_number.is_require ?? '').toLowerCase() ===
											'true'
										}
									/>
								)}
							{rawFields?.custom?.booking_order_no &&
								Array.isArray(rawFields.custom.booking_order_no.use) &&
								rawFields.custom.booking_order_no.use.includes('send') && (
									<BookingOrderNoInput
										cusType='send'
										required={
											String(rawFields.custom.booking_order_no.is_require ?? '').toLowerCase() ===
											'true'
										}
									/>
								)}
							{rawFields?.custom?.check_in_date &&
								Array.isArray(rawFields.custom.check_in_date.use) &&
								rawFields.custom.check_in_date.use.includes('send') && (
									<CheckInDateInput
										cusType='send'
										required={
											String(rawFields.custom.check_in_date.is_require ?? '').toLowerCase() ===
											'true'
										}
									/>
								)}
							{rawFields?.custom?.check_out_date &&
								Array.isArray(rawFields.custom.check_out_date.use) &&
								rawFields.custom.check_out_date.use.includes('send') && (
									<CheckOutDateInput
										cusType='send'
										required={
											String(rawFields.custom.check_out_date.is_require ?? '').toLowerCase() ===
											'true'
										}
									/>
								)}
							<Button height={53} onPress={() => onCompletePress(6)}>
								<Text style={{color: colors.backgroundWhite, fontSize: 17}}>작성 완료</Text>
							</Button>
						</View>
					</CollapsibleSection>
				)}

				{rawFields?.traffics &&
					Array.isArray(rawFields.traffics) &&
					rawFields.traffics.some((t: any) => t?.traffic_type?.traffic_type_value === 'flight') && (
						<CollapsibleSection
							title='항공편 정보'
							open={!!openSections[7]}
							onToggle={() => toggleSection(7)}
							completed={!!completedSections[7]}>
							{rawFields.traffics.find((t: any) => t?.traffic_type?.traffic_type_value === 'flight')
								?.arrival_flightType && (
								<ArrivalFlightTypeSelector
									trafficType='flight'
									rawFields={rawFields}
									trafficTypeValue='flight'
									required={
										String(
											rawFields.traffics.find(
												(t: any) => t?.traffic_type?.traffic_type_value === 'flight',
											)?.arrival_flightType?.is_require ?? '',
										).toLowerCase() === 'true'
									}
								/>
							)}
							{rawFields.traffics.find((t: any) => t?.traffic_type?.traffic_type_value === 'flight')
								?.arrival_airport && (
								<ArrivalAirportSelector
									trafficType='flight'
									rawFields={rawFields}
									trafficTypeValue='flight'
									required={
										String(
											rawFields.traffics.find(
												(t: any) => t?.traffic_type?.traffic_type_value === 'flight',
											)?.arrival_airport?.is_require ?? '',
										).toLowerCase() === 'true'
									}
								/>
							)}
							{rawFields.traffics.find((t: any) => t?.traffic_type?.traffic_type_value === 'flight')
								?.arrival_airlineName && (
								<ArrivalAirlineInput
									trafficType='flight'
									required={
										String(
											rawFields.traffics.find(
												(t: any) => t?.traffic_type?.traffic_type_value === 'flight',
											)?.arrival_airlineName?.is_require ?? '',
										).toLowerCase() === 'true'
									}
								/>
							)}
							{rawFields.traffics.find((t: any) => t?.traffic_type?.traffic_type_value === 'flight')
								?.arrival_flightNo && (
								<ArrivalFlightNoInput
									trafficType='flight'
									required={
										String(
											rawFields.traffics.find(
												(t: any) => t?.traffic_type?.traffic_type_value === 'flight',
											)?.arrival_flightNo?.is_require ?? '',
										).toLowerCase() === 'true'
									}
								/>
							)}
							{rawFields.traffics.find((t: any) => t?.traffic_type?.traffic_type_value === 'flight')
								?.arrival_terminalNo && (
								<ArrivalTerminalInput
									trafficType='flight'
									required={
										String(
											rawFields.traffics.find(
												(t: any) => t?.traffic_type?.traffic_type_value === 'flight',
											)?.arrival_terminalNo?.is_require ?? '',
										).toLowerCase() === 'true'
									}
								/>
							)}
							{rawFields.traffics.find((t: any) => t?.traffic_type?.traffic_type_value === 'flight')
								?.arrival_visa && <ArrivalVisaToggle trafficType='flight' />}
							{rawFields.traffics.find((t: any) => t?.traffic_type?.traffic_type_value === 'flight')
								?.arrival_date && (
								<ArrivalDateInput
									trafficType='flight'
									required={
										String(
											rawFields.traffics.find(
												(t: any) => t?.traffic_type?.traffic_type_value === 'flight',
											)?.arrival_date?.is_require ?? '',
										).toLowerCase() === 'true'
									}
								/>
							)}
							{rawFields.traffics.find((t: any) => t?.traffic_type?.traffic_type_value === 'flight')
								?.arrival_time && (
								<ArrivalTimeInput
									trafficType='flight'
									required={
										String(
											rawFields.traffics.find(
												(t: any) => t?.traffic_type?.traffic_type_value === 'flight',
											)?.arrival_time?.is_require ?? '',
										).toLowerCase() === 'true'
									}
								/>
							)}
							{rawFields.traffics.find((t: any) => t?.traffic_type?.traffic_type_value === 'flight')
								?.departure_flightType && (
								<DepartureFlightTypeSelector
									trafficType='flight'
									rawFields={rawFields}
									trafficTypeValue='flight'
									required={
										String(
											rawFields.traffics.find(
												(t: any) => t?.traffic_type?.traffic_type_value === 'flight',
											)?.departure_flightType?.is_require ?? '',
										).toLowerCase() === 'true'
									}
								/>
							)}
							{rawFields.traffics.find((t: any) => t?.traffic_type?.traffic_type_value === 'flight')
								?.departure_airport && (
								<DepartureAirportSelector
									trafficType='flight'
									rawFields={rawFields}
									trafficTypeValue='flight'
									required={
										String(
											rawFields.traffics.find(
												(t: any) => t?.traffic_type?.traffic_type_value === 'flight',
											)?.departure_airport?.is_require ?? '',
										).toLowerCase() === 'true'
									}
								/>
							)}
							{rawFields.traffics.find((t: any) => t?.traffic_type?.traffic_type_value === 'flight')
								?.departure_airlineName && (
								<DepartureAirlineInput
									trafficType='flight'
									required={
										String(
											rawFields.traffics.find(
												(t: any) => t?.traffic_type?.traffic_type_value === 'flight',
											)?.departure_airlineName?.is_require ?? '',
										).toLowerCase() === 'true'
									}
								/>
							)}
							{rawFields.traffics.find((t: any) => t?.traffic_type?.traffic_type_value === 'flight')
								?.departure_flightNo && (
								<DepartureFlightNoInput
									trafficType='flight'
									required={
										String(
											rawFields.traffics.find(
												(t: any) => t?.traffic_type?.traffic_type_value === 'flight',
											)?.departure_flightNo?.is_require ?? '',
										).toLowerCase() === 'true'
									}
								/>
							)}
							{rawFields.traffics.find((t: any) => t?.traffic_type?.traffic_type_value === 'flight')
								?.departure_terminalNo && (
								<DepartureTerminalInput
									trafficType='flight'
									required={
										String(
											rawFields.traffics.find(
												(t: any) => t?.traffic_type?.traffic_type_value === 'flight',
											)?.departure_terminalNo?.is_require ?? '',
										).toLowerCase() === 'true'
									}
								/>
							)}
							{rawFields.traffics.find((t: any) => t?.traffic_type?.traffic_type_value === 'flight')
								?.departure_haveBeenInCountry && (
								<DepartureHaveBeenInCountryInput
									trafficType='flight'
									required={
										String(
											rawFields.traffics.find(
												(t: any) => t?.traffic_type?.traffic_type_value === 'flight',
											)?.departure_haveBeenInCountry?.is_require ?? '',
										).toLowerCase() === 'true'
									}
								/>
							)}
							{rawFields.traffics.find((t: any) => t?.traffic_type?.traffic_type_value === 'flight')
								?.departure_date && (
								<DepartureDateInput
									trafficType='flight'
									required={
										String(
											rawFields.traffics.find(
												(t: any) => t?.traffic_type?.traffic_type_value === 'flight',
											)?.departure_date?.is_require ?? '',
										).toLowerCase() === 'true'
									}
								/>
							)}
							{rawFields.traffics.find((t: any) => t?.traffic_type?.traffic_type_value === 'flight')
								?.departure_time && (
								<DepartureTimeInput
									trafficType='flight'
									required={
										String(
											rawFields.traffics.find(
												(t: any) => t?.traffic_type?.traffic_type_value === 'flight',
											)?.departure_time?.is_require ?? '',
										).toLowerCase() === 'true'
									}
								/>
							)}
							<Button height={53} onPress={() => onCompletePress(7)}>
								<Text style={{color: colors.backgroundWhite, fontSize: 23}}>작성 완료</Text>
							</Button>
						</CollapsibleSection>
					)}

				{hasPsgQty && (
					<CollapsibleSection
						title='탑승자 수 (psg_qty)'
						open={!!openSections[8]}
						onToggle={() => toggleSection(8)}
						completed={!!completedSections[8]}>
						{rawFields.traffics.find((t: any) => t?.traffic_type?.traffic_type_value === 'psg_qty')
							?.carpsg_adult && (
							<CarPsgAdultInput
								trafficType='psg_qty'
								required={
									String(
										rawFields.traffics.find(
											(t: any) => t?.traffic_type?.traffic_type_value === 'psg_qty',
										)?.carpsg_adult?.is_require ?? '',
									).toLowerCase() === 'true'
								}
							/>
						)}
						{rawFields.traffics.find((t: any) => t?.traffic_type?.traffic_type_value === 'psg_qty')
							?.carpsg_child && (
							<CarPsgChildInput
								trafficType='psg_qty'
								required={
									String(
										rawFields.traffics.find(
											(t: any) => t?.traffic_type?.traffic_type_value === 'psg_qty',
										)?.carpsg_child?.is_require ?? '',
									).toLowerCase() === 'true'
								}
							/>
						)}
						{rawFields.traffics.find((t: any) => t?.traffic_type?.traffic_type_value === 'psg_qty')
							?.carpsg_infant && (
							<CarPsgInfantInput
								trafficType='psg_qty'
								required={
									String(
										rawFields.traffics.find(
											(t: any) => t?.traffic_type?.traffic_type_value === 'psg_qty',
										)?.carpsg_infant?.is_require ?? '',
									).toLowerCase() === 'true'
								}
							/>
						)}
						{rawFields.traffics.find((t: any) => t?.traffic_type?.traffic_type_value === 'psg_qty')
							?.safetyseat_sup_child && (
							<SafetyseatSupChildInput
								trafficType='psg_qty'
								required={
									String(
										rawFields.traffics.find(
											(t: any) => t?.traffic_type?.traffic_type_value === 'psg_qty',
										)?.safetyseat_sup_child?.is_require ?? '',
									).toLowerCase() === 'true'
								}
							/>
						)}
						{rawFields.traffics.find((t: any) => t?.traffic_type?.traffic_type_value === 'psg_qty')
							?.safetyseat_self_child && (
							<SafetyseatSelfChildInput
								trafficType='psg_qty'
								required={
									String(
										rawFields.traffics.find(
											(t: any) => t?.traffic_type?.traffic_type_value === 'psg_qty',
										)?.safetyseat_self_child?.is_require ?? '',
									).toLowerCase() === 'true'
								}
							/>
						)}
						{rawFields.traffics.find((t: any) => t?.traffic_type?.traffic_type_value === 'psg_qty')
							?.safetyseat_sup_infant && (
							<SafetyseatSupInfantInput
								trafficType='psg_qty'
								required={
									String(
										rawFields.traffics.find(
											(t: any) => t?.traffic_type?.traffic_type_value === 'psg_qty',
										)?.safetyseat_sup_infant?.is_require ?? '',
									).toLowerCase() === 'true'
								}
							/>
						)}
						{rawFields.traffics.find((t: any) => t?.traffic_type?.traffic_type_value === 'psg_qty')
							?.safetyseat_self_infant && (
							<SafetyseatSelfInfantInput
								trafficType='psg_qty'
								required={
									String(
										rawFields.traffics.find(
											(t: any) => t?.traffic_type?.traffic_type_value === 'psg_qty',
										)?.safetyseat_self_infant?.is_require ?? '',
									).toLowerCase() === 'true'
								}
							/>
						)}
						{rawFields.traffics.find((t: any) => t?.traffic_type?.traffic_type_value === 'psg_qty')
							?.luggage_carry && (
							<LuggageCarryInput
								trafficType='psg_qty'
								required={
									String(
										rawFields.traffics.find(
											(t: any) => t?.traffic_type?.traffic_type_value === 'psg_qty',
										)?.luggage_carry?.is_require ?? '',
									).toLowerCase() === 'true'
								}
							/>
						)}
						{rawFields.traffics.find((t: any) => t?.traffic_type?.traffic_type_value === 'psg_qty')
							?.luggage_check && (
							<LuggageCheckInput
								trafficType='psg_qty'
								required={
									String(
										rawFields.traffics.find(
											(t: any) => t?.traffic_type?.traffic_type_value === 'psg_qty',
										)?.luggage_check?.is_require ?? '',
									).toLowerCase() === 'true'
								}
							/>
						)}
						<Button height={53} onPress={() => onCompletePress(8)}>
							<Text style={{color: colors.backgroundWhite, fontSize: 17}}>작성 완료</Text>
						</Button>
					</CollapsibleSection>
				)}

				{(hasRentcar01 || hasRentcar02 || hasRentcar03) && (
					<CollapsibleSection
						title='렌터카 정보'
						open={!!openSections[9]}
						onToggle={() => toggleSection(9)}
						completed={!!completedSections[9]}>
						<View>
							{Array.isArray(rawFields?.traffics) &&
								rawFields.traffics.map((spec: any, specIndex: number) => {
									const t = spec?.traffic_type?.traffic_type_value;
									if (!t || !['rentcar_01', 'rentcar_02', 'rentcar_03'].includes(t)) return null;
									const requiredLabel = `렌터카 정보 ${specIndex + 1}`;
									return (
										<View key={`rentcar_${specIndex}`} style={{marginBottom: 12}}>
											<Text style={{color: colors.grey800, marginBottom: 8, fontSize: 24}}>
												{requiredLabel}
											</Text>
											{spec?.s_location && (
												<RentcarLocationSelector
													trafficType={t}
													field='s_location'
													rawFields={rawFields}
													specIndex={specIndex}
													required={
														String(spec.s_location?.is_require ?? '').toLowerCase() ===
														'true'
													}
												/>
											)}
											{spec?.e_location && (
												<RentcarLocationSelector
													trafficType={t}
													field='e_location'
													rawFields={rawFields}
													specIndex={specIndex}
													required={
														String(spec.e_location?.is_require ?? '').toLowerCase() ===
														'true'
													}
												/>
											)}
											{spec?.s_date && (
												<RentcarDateInput
													trafficType={t}
													field='s_date'
													rawFields={rawFields}
													specIndex={specIndex}
													required={
														String(spec.s_date?.is_require ?? '').toLowerCase() === 'true'
													}
												/>
											)}
											{spec?.s_time && (
												<RentcarTimeInput
													trafficType={t}
													field='s_time'
													rawFields={rawFields}
													specIndex={specIndex}
													required={
														String(spec.s_time?.is_require ?? '').toLowerCase() === 'true'
													}
												/>
											)}
											{spec?.e_date && (
												<RentcarDateInput
													trafficType={t}
													field='e_date'
													rawFields={rawFields}
													specIndex={specIndex}
													required={
														String(spec.e_date?.is_require ?? '').toLowerCase() === 'true'
													}
												/>
											)}
											{spec?.e_time && (
												<RentcarTimeInput
													trafficType={t}
													field='e_time'
													rawFields={rawFields}
													specIndex={specIndex}
													required={
														String(spec.e_time?.is_require ?? '').toLowerCase() === 'true'
													}
												/>
											)}
											{spec?.is_rent_customize && (
												<RentcarCustomizeToggle
													trafficType={t}
													spec={spec}
													specIndex={specIndex}
													label={spec.is_rent_customize?.label ?? '직접 주소 입력'}
													onValueChange={v => console.log('rent customize', v)}
												/>
											)}
										</View>
									);
								})}
							<Button height={53} onPress={() => onCompletePress(9)}>
								<Text style={{color: colors.backgroundWhite, fontSize: 17}}>작성 완료</Text>
							</Button>
						</View>
					</CollapsibleSection>
				)}

				{(hasPickup03 || hasPickup04) && (
					<CollapsibleSection
						title='픽업 정보'
						open={!!openSections[10]}
						onToggle={() => toggleSection(10)}
						completed={!!completedSections[10]}>
						<View>
							{Array.isArray(rawFields?.traffics) &&
								rawFields.traffics.map((spec: any, specIndex: number) => {
									const t = spec?.traffic_type?.traffic_type_value;
									if (!t || !['pickup_03', 'pickup_04'].includes(t)) return null;
									const label = `픽업 정보 ${specIndex + 1}`;
									return (
										<View key={`pickup_${specIndex}`} style={{marginBottom: 12}}>
											<Text style={{color: colors.grey800, marginBottom: 8, fontSize: 24}}>
												{label}
											</Text>
											{spec?.s_location && (
												<PickupLocationInput
													trafficType={t}
													field='s_location'
													rawFields={rawFields}
													specIndex={specIndex}
													required={
														String(spec.s_location?.is_require ?? '').toLowerCase() ===
														'true'
													}
												/>
											)}
											{spec?.s_date && (
												<PickupDateInput
													trafficType={t}
													field='s_date'
													rawFields={rawFields}
													specIndex={specIndex}
													required={
														String(spec.s_date?.is_require ?? '').toLowerCase() === 'true'
													}
												/>
											)}
											{spec?.s_time && (
												<PickupTimeInput
													trafficType={t}
													field='s_time'
													rawFields={rawFields}
													specIndex={specIndex}
													required={
														String(spec.s_time?.is_require ?? '').toLowerCase() === 'true'
													}
												/>
											)}
											{spec?.e_location && (
												<PickupLocationInput
													trafficType={t}
													field='e_location'
													rawFields={rawFields}
													specIndex={specIndex}
													required={
														String(spec.e_location?.is_require ?? '').toLowerCase() ===
														'true'
													}
												/>
											)}
											{spec?.e_date && (
												<PickupDateInput
													trafficType={t}
													field='e_date'
													rawFields={rawFields}
													specIndex={specIndex}
													required={
														String(spec.e_date?.is_require ?? '').toLowerCase() === 'true'
													}
												/>
											)}
											{spec?.e_time && (
												<PickupTimeInput
													trafficType={t}
													field='e_time'
													rawFields={rawFields}
													specIndex={specIndex}
													required={
														String(spec.e_time?.is_require ?? '').toLowerCase() === 'true'
													}
												/>
											)}
										</View>
									);
								})}
							<Button height={53} onPress={() => onCompletePress(10)}>
								<Text style={{color: colors.backgroundWhite, fontSize: 17}}>작성 완료</Text>
							</Button>
						</View>
					</CollapsibleSection>
				)}

				{hasVoucher && (
					<CollapsibleSection
						title='바우처/픽업 위치'
						open={!!openSections[11]}
						onToggle={() => toggleSection(11)}
						completed={!!completedSections[11]}>
						<View>
							{Array.isArray(rawFields?.traffics) &&
								rawFields.traffics.map((spec: any, specIndex: number) => {
									const t = spec?.traffic_type?.traffic_type_value;
									if (!t || t !== 'voucher') return null;
									return (
										<View key={`voucher_${specIndex}`} style={{marginBottom: 12}}>
											{spec?.s_location && (
												<VoucherLocationInput
													trafficType={t}
													field='s_location'
													rawFields={rawFields}
													specIndex={specIndex}
													required={
														String(spec.s_location?.is_require ?? '').toLowerCase() ===
														'true'
													}
												/>
											)}
										</View>
									);
								})}
							<Button height={53} onPress={() => onCompletePress(11)}>
								<Text style={{color: colors.backgroundWhite, fontSize: 17}}>작성 완료</Text>
							</Button>
						</View>
					</CollapsibleSection>
				)}

				<CollapsibleSection
					title='요청 사항'
					open={!!openSections[12]}
					onToggle={() => toggleSection(12)}
					completed={!!completedSections[12]}>
					<TextInput
						placeholder='요청사항을 입력하세요'
						placeholderTextColor={colors.grey400}
						value={orderNote}
						onChangeText={setOrderNote}
						style={[styles.input]}
						multiline
					/>
					<View style={{height: 12}} />
					<Button height={53} onPress={() => onCompletePress(12)}>
						<Text style={{color: colors.backgroundWhite, fontSize: 17}}>작성 완료</Text>
					</Button>
				</CollapsibleSection>

				<CollapsibleSection
					title='결제 세부 내역'
					open={!!openSections[13]}
					onToggle={() => toggleSection(13)}
					completed={!!completedSections[13]}>
					<MiniProductCard
						image={thumbnail}
						title={title}
						originPrice={originalPerPerson}
						salePrice={salePerPerson}
						perPersonText={`${formatPrice(productAmount)}원`}
					/>
					<View
						style={{marginTop: 12, paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.grey100}}>
						<View style={styles.row}>
							<Text style={{color: colors.Black}}>상품 금액</Text>
							<Text style={{color: colors.Black}}>{formatPrice(productAmount)}원</Text>
						</View>
					</View>
				</CollapsibleSection>

				<View style={{height: 12, backgroundColor: colors.grey100, marginTop: 8}} />

				{/* <View style={[styles.sectionContainer, {paddingHorizontal: 24, paddingVertical: 24}]}>
					<Text typography='t3' fontWeight='bold' style={{marginBottom: 12}}>
						결제 수단
					</Text>
					<View style={styles.paymentRow}>
						<TouchableOpacity
							style={[styles.paymentBtn, selectedPayment === 'toss' && styles.paymentBtnActive]}
							onPress={() => setSelectedPayment('toss')}>
							<Text>tosspay</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.paymentBtn, selectedPayment === 'naver' && styles.paymentBtnActive]}
							onPress={() => setSelectedPayment('naver')}>
							<Text>npay</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.paymentRow}>
						<TouchableOpacity
							style={[styles.paymentBtn, selectedPayment === 'kakao' && styles.paymentBtnActive]}
							onPress={() => setSelectedPayment('kakao')}>
							<Text>kpay</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.paymentBtn, selectedPayment === 'card' && styles.paymentBtnActive]}
							onPress={() => setSelectedPayment('card')}>
							<Text>신용카드/체크카드</Text>
						</TouchableOpacity>
					</View>
				</View> */}

				{/* <View style={{paddingVertical: 8, paddingHorizontal: 20}}>
					<Text typography='t3' fontWeight='bold' style={{marginVertical: 6, padding: 8}}>
						개인 정보 수집 · 이용 약관 동의
					</Text>
					<TouchableOpacity
						onPress={toggleAgreeAll}
						style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 8}}>
						<View style={styles.checkbox}>
							{agreeAll && <Icon name='icon-check' size={14} color={colors.blue500} />}
						</View>
						<Text>전체 동의하기</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => setAgreePersonal(s => !s)} style={styles.agreeRow}>
						<View style={styles.checkbox}>
							{agreePersonal && <Icon name='icon-check' size={14} color={colors.blue500} />}
						</View>
						<Text style={{marginLeft: 8}}>(필수) 개인정보 처리방침 동의</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => setAgreeService(s => !s)} style={styles.agreeRow}>
						<View style={styles.checkbox}>
							{agreeService && <Icon name='icon-check' size={14} color={colors.blue500} />}
						</View>
						<Text style={{marginLeft: 8}}>(필수) 서비스 이용 약관 동의</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => setAgreeMarketing(s => !s)} style={styles.agreeRow}>
						<View style={styles.checkbox}>
							{agreeMarketing && <Icon name='icon-check' size={14} color={colors.blue500} />}
						</View>
						<Text style={{marginLeft: 8}}>(선택) 마케팅 수신 동의</Text>
					</TouchableOpacity>
				</View> */}

				{/* <FixedBottomCTA onPress={onPay} disabled={bookingLoading}>
					{bookingLoading ? '결제중입니다...' : '결제하기'}
				</FixedBottomCTA> */}
				<Button onPress={onPay} height={70}>
					<Text style={{fontSize: 24, color: colors.backgroundWhite}}>주문하기</Text>
				</Button>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 20,
		paddingTop: 18,
		paddingBottom: 20,
		flexDirection: 'row',
		alignItems: 'center',
	},
	sectionContainer: {
		paddingHorizontal: 20,
	},
	sectionHeader: {
		height: 56,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	sectionBody: {
		paddingBottom: 18,
		paddingTop: 6,
	},
	input: {
		height: 54,
		borderRadius: 14,
		backgroundColor: colors.greyOpacity100,
		paddingHorizontal: 12,
		marginTop: 8,
		color: colors.grey800,
	},
	select: {
		height: 44,
		borderRadius: 8,
		backgroundColor: colors.grey50,
		paddingHorizontal: 12,
		justifyContent: 'center',
		marginTop: 8,
	},
	paymentRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 10,
	},
	paymentBtn: {
		flex: 1,
		height: 46,
		marginRight: 8,
		borderRadius: 10,
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: colors.grey200,
		alignItems: 'center',
		justifyContent: 'center',
	},
	paymentBtnActive: {
		borderColor: colors.blue500,
	},
	agreeRow: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 8,
		marginLeft: 12,
	},
	checkbox: {
		width: 20,
		height: 20,
		borderRadius: 4,
		borderWidth: 1,
		borderColor: colors.grey300,
		alignItems: 'center',
		justifyContent: 'center',
	},
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
	},
	smallOptionActiveText: {
		color: colors.blue500,
	},
	tourImage: {
		width: '100%',
		height: 140,
		borderRadius: 12,
		backgroundColor: '#eee',
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	dropdown: {
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: colors.grey200,
		borderRadius: 10,
		marginTop: 8,
		maxHeight: 200,
		zIndex: 999,
		elevation: 4,
		shadowColor: '#000',
		shadowOpacity: 0.06,
		shadowOffset: {width: 0, height: 1},
		shadowRadius: 2,
	},
	bottomBar: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderTopWidth: 1,
		borderTopColor: colors.grey100,
		backgroundColor: '#fff',
		flexDirection: 'row',
		alignItems: 'center',
	},
	sameBox: {
		borderWidth: 1,
		borderColor: colors.grey200,
		borderRadius: 10,
		paddingVertical: 12,
		paddingHorizontal: 14,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#fff',
	},
	checkboxBox: {
		width: 22,
		height: 22,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: colors.grey300,
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: 12,
		backgroundColor: '#fff',
	},
	checkboxBoxChecked: {
		backgroundColor: colors.blue500,
		borderColor: colors.blue500,
	},
	trafficItem: {
		borderWidth: 1,
		borderColor: colors.grey100,
		borderRadius: 10,
		padding: 12,
		marginBottom: 8,
		backgroundColor: '#fff',
	},
	countrySelect: {
		height: 54,
		borderRadius: 14,
		backgroundColor: colors.greyOpacity100,
		paddingHorizontal: 12,
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
	},
	countryDialBox: {
		height: 54,
		width: 90,
		borderRadius: 14,
		backgroundColor: colors.greyOpacity100,
		paddingHorizontal: 12,
		justifyContent: 'center',
		alignItems: 'center',
	},
	countryDialText: {
		color: colors.grey800,
	},
	optionRowActive: {
		backgroundColor: colors.blue500,
	},
});
const Button = styled.TouchableOpacity<{height: number}>`
	min-width: ${widthPercentage(64)}px;
	height: ${props => heightPercentage(props.height)}px;
	border-radius: 10px;
	padding: 7.5px 19px;
	gpa: 10px;
	background-color: ${colors.Gray5};
	align-items: center;
	justify-content: center;
	margin-top: 5px;
`;
export default ProductPay;
