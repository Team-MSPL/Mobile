import {useRoute} from '@react-navigation/native';
import moment from 'moment';
import {useEffect, useLayoutEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {View} from 'react-native';
import {Platform} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import RenderHTML from 'react-native-render-html';
import {styled} from 'styled-components/native';
import {useAppDispatch} from '../../redux';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {getQueryPackage} from '../../redux/travel-info/travel.slice';
import {colors} from '../../utill/colors';
import {MarginContainder, SVGContainer} from '../enroll-info/select-multi';
import {
	BackgroundGray,
	BackgroundGrayScrollView,
	FlexWrap,
	HStack,
	PretendardSemiBoldText,
	PretendardVariableText,
	VStack,
} from '../../utill/layout/layout';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import RouteButton from '../../utill/component/route-button';
import {logEvent} from '../../../firebaseAnalytice';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {Toast} from 'react-native-toast-message/lib/src/Toast';

export default function ProductSelectSpec({navigation}: any) {
	const route = useRoute();
	const {prod_no, pkg_no, go_date_setting, image, name}: {prod_no: number; pkg_no: number; go_date_setting: any} =
		route.params;
	const [selectDateFlag, setSelectDateFlag] = useState(false);
	const [dateInfo, setDateInfo] = useState({selectStartDate: null, selectEndDate: null});
	const dispatch = useAppDispatch();
	const [data, setData] = useState([]);
	type SelectedSpecsState = {
		[specTitle: string]: string; // 예: "좌석": "A석"
	};
	const extractDateSettingPayload = () => {
		const ds = go_date_setting;
		const payload: {date_setting?: string; min_date?: number; max_date?: number} = {};
		if (!ds) return payload;
		if (ds?.type != null) payload.date_setting = String(ds.type);
		const days = ds?.days;
		if (days && typeof days === 'object') {
			const rawMin = days?.min;
			const rawMax = days?.max;
			const minNum = Number(rawMin);
			const maxNum = Number(rawMax);
			if (Number.isFinite(minNum)) payload.min_date = Math.max(0, Math.floor(minNum));
			if (Number.isFinite(maxNum)) payload.max_date = Math.max(0, Math.floor(maxNum));
		}
		return payload;
	};
	const renderRefundPolicy = policy => {
		if (!policy?.partial_refund) return null;

		return policy?.partial_refund?.map((rule, index) => {
			const {fee_type, display_rule} = rule;

			if (fee_type === 'FULL_REFUND') {
				return (
					<Text key={index} style={{color: colors.Gray3}}>
						✔️ 출발일 기준 {display_rule?.day_min}일 전까지 전액 환불 가능
					</Text>
				);
			}

			if (fee_type === 'NON_REFUNDABLE') {
				if (display_rule?.day_max !== undefined) {
					return (
						<Text key={index} style={{color: colors.Gray3}}>
							❌ 출발일 기준 {display_rule?.day_max}일 전부터는 환불 불가
						</Text>
					);
				} else {
					return (
						<Text key={index} style={{color: colors.Gray3}}>
							❌ 환불 불가
						</Text>
					);
				}
			}

			// 다른 타입이 있을 경우 추가 처리
			return null;
		});
	};
	const ticketSpec = useMemo(() => {
		return (
			data?.item?.[0]?.specs.find(s => {
				if (!s?.spec_title) return false;
				const title = String(s.spec_title).trim().toLowerCase();
				return title === '티켓 종류';
			}) ?? null
		);
	}, [data]);
	const [selectedMap, setSelectedMap] = useState<Record<string, string>>(() => {
		const pre = {};
		return {...pre};
	});
	const specs = Array.isArray(data?.item?.[0]?.specs) ? data?.item?.[0]?.specs : [];
	const skus = Array.isArray(data?.item?.[0]?.skus) ? data?.item?.[0]?.skus : [];
	const matchedSkuIndex = useMemo(() => {
		const selectedEntries = Object.entries(selectedMap);
		if (selectedEntries.length === 0) return null;

		for (let i = 0; i < skus.length; i++) {
			const sku = skus[i];
			const refs: Array<{spec_item_id?: string; spec_value_id?: string}> = sku?.specs_ref ?? [];
			const ok = selectedEntries.every(([spec_oid, spec_item_oid]) => {
				return refs.some(
					r =>
						String(r.spec_item_id) === String(spec_oid) &&
						String(r.spec_value_id) === String(spec_item_oid),
				);
			});
			if (ok) return i;
		}
		return null;
	}, [selectedMap, skus]);

	const toggleSelect = (spec_oid: string, spec_item_oid: string) => {
		setSelectedMap(prev => {
			const cur = prev[spec_oid];
			if (cur === spec_item_oid) {
				const next = {...prev};
				delete next[spec_oid];
				return next;
			}
			return {...prev, [spec_oid]: spec_item_oid};
		});
	};

	// Helper: find SKU index for a given selection map
	const findSkuIndexForSelection = (selection: Record<string, string>) => {
		const entries = Object.entries(selection);
		if (entries.length === 0) return null;
		for (let i = 0; i < skus.length; i++) {
			const sku = skus[i];
			const refs: Array<{spec_item_id?: string; spec_value_id?: string}> = sku?.specs_ref ?? [];
			const ok = entries.every(([spec_oid, spec_item_oid]) =>
				refs.some(
					r =>
						String(r.spec_item_id) === String(spec_oid) &&
						String(r.spec_value_id) === String(spec_item_oid),
				),
			);
			if (ok) return i;
		}
		return null;
	};

	const isOptionEnabled = (spec_oid: string, spec_item_oid: string) => {
		if (selectedMap[spec_oid] === spec_item_oid) return true;

		const hypothetical: Record<string, string> = {...(selectedMap ?? {}), [spec_oid]: spec_item_oid};
		const entries = Object.entries(hypothetical);

		return skus.some((sku: any) => {
			const refs: Array<{spec_item_id?: string; spec_value_id?: string}> = sku?.specs_ref ?? [];
			return entries.every(([soid, soidVal]) =>
				refs.some(r => String(r.spec_item_id) === String(soid) && String(r.spec_value_id) === String(soidVal)),
			);
		});
	};
	const handlePkg = async () => {
		try {
			console.log(prod_no, pkg_no, go_date_setting);
			dispatch(LoadingSliceActions.onLoading());
			const value = await dispatch(
				getQueryPackage({
					prod_no,
					pkg_no,
				}),
			).unwrap();
			if (!value?.item) {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '현재 해당 여행 상품의 판매가 중단되었습니다.',
						modalSingleUse: true,
						modalTopText: '확인',
					}),
				);
				navigation.goBack();
			} else {
				// if(value.item[0]?.last_spec_multi){

				// }
				setData(value);
				// let copy = value?.item?.[0]?.unit_quantity_rule?.ticket_rule?.rulesets;
				// setTicketStatus(copy?.map(copyItem => ({...copyItem, count: copyItem?.min_quantity})) ?? []);
			}
			// console.log(value?.item?.[0]?.unit_quantity_rule?.total_rule);
			// console.log(value?.item?.[0]?.unit_quantity_rule?.ticket_rule?.rulesets ?? [], 'ㅋㅋㅋ');

			// console.log(value?.item, 'ㅋ');
		} catch (e) {
			console.log('e');
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};

	useLayoutEffect(() => {
		handlePkg();
	}, []);
	const onConfirm = async () => {
		// 1) Build required-spec list EXCLUDING ticketSpec (if ticketSpec exists, user shouldn't pick it)
		const requiredSpecs = specs.filter(s => {
			if (!s?.spec_oid) return false;
			// exclude ticketSpec from required set
			if (ticketSpec && s.spec_oid === ticketSpec.spec_oid) return false;
			return true;
		});

		// 2) Check missing among requiredSpecs only
		const missing = requiredSpecs.filter(s => !selectedMap[s.spec_oid]);
		if (missing.length > 0) {
			Toast.show({
				type: 'error',
				text1: `${missing.map(s => s.spec_title).join(', ')} 항목을 선택해 주세요.`,
				position: 'bottom',
			});

			return;
		}
		const payloadDateSetting = extractDateSettingPayload();
		const firstItem = data?.item[0];
		const itemUnit =
			firstItem?.unit ?? firstItem?.unit_price ?? firstItem?.b2b_price ?? firstItem?.b2c_price ?? null;

		// 3) If ticketSpec exists, auto-expand ticket items for the chosen other specs:
		if (ticketSpec) {
			const combos: Array<{selectedSpecs: Record<string, string>; matchedSkuIndex: number; matchedSku: any}> = [];

			for (const ticketItem of ticketSpec.spec_items) {
				const hypot: Record<string, string> = {
					...(selectedMap ?? {}),
					[ticketSpec.spec_oid]: ticketItem.spec_item_oid,
				};

				const skuIndex = findSkuIndexForSelection(hypot);
				if (skuIndex != null) {
					combos.push({
						selectedSpecs: hypot,
						matchedSkuIndex: skuIndex,
						matchedSku: skus[skuIndex],
					});
				}
			}

			if (combos.length === 0) {
				Toast.show({
					type: 'error',
					text1: '선택하신 옵션 조합에 해당하는 상품이 없습니다. 다른 조합을 선택해주세요.',
					position: 'bottom',
				});

				return;
			}

			// If the only selectable spec(s) were ticketSpec (i.e. requiredSpecs.length === 0),
			// auto-navigate immediately because user had nothing to pick here.
			if (requiredSpecs.length === 0) {
				await logEvent(`goCalendar`, {pkgName: data?.pkg_name});
				navigation.navigate('ProductReservation', {
					prod_no: prod_no ?? prod_no,
					pkg_no: pkg_no ?? (data?.pkg && data?.pkg[0]?.pkg_no) ?? data?.pkg_no,
					data,
					...(payloadDateSetting.date_setting ? {date_setting: payloadDateSetting.date_setting} : {}),
					...(payloadDateSetting.min_date !== undefined ? {min_date: payloadDateSetting.min_date} : {}),
					...(payloadDateSetting.max_date !== undefined ? {max_date: payloadDateSetting.max_date} : {}),

					has_ticket_combinations: true,
					ticket_combinations: combos.map(c => ({
						selectedSpecs: c.selectedSpecs,
						matchedSkuIndex: c.matchedSkuIndex,
						matchedSku: c.matchedSku,
					})),
					item_unit: itemUnit ?? null,
				});
				return;
			}
			await logEvent(`goCalendar`, {pkgName: data?.pkg_name});
			// Otherwise navigate with combos
			navigation.navigate('ProductReservation', {
				prod_no: prod_no ?? prod_no,
				pkg_no: pkg_no ?? (data?.pkg && data?.pkg[0]?.pkg_no) ?? data?.pkg_no,
				data,
				...(payloadDateSetting.date_setting ? {date_setting: payloadDateSetting.date_setting} : {}),
				...(payloadDateSetting.min_date !== undefined ? {min_date: payloadDateSetting.min_date} : {}),
				...(payloadDateSetting.max_date !== undefined ? {max_date: payloadDateSetting.max_date} : {}),

				has_ticket_combinations: true,
				ticket_combinations: combos.map(c => ({
					selectedSpecs: c.selectedSpecs,
					matchedSkuIndex: c.matchedSkuIndex,
					matchedSku: c.matchedSku,
				})),
				item_unit: itemUnit ?? null,
			});

			return;
		}

		// 4) Default (no ticketSpec): require all specs; matchedSkuIndex must exist
		if (matchedSkuIndex == null) {
			Toast.show({
				type: 'error',
				text1: '선택하신 옵션 조합에 해당하는 상품이 없습니다. 다른 조합을 선택해주세요.',
				position: 'bottom',
			});

			return;
		}

		const sku = skus[matchedSkuIndex];
		await logEvent(`goCalendar`, {pkgName: data?.pkg_name});
		navigation.navigate('ProductReservation', {
			prod_no: prod_no ?? prod_no,
			pkg_no: pkg_no ?? (data?.pkg && data?.pkg[0]?.pkg_no) ?? data?.pkg_no,
			data,
			...(payloadDateSetting.date_setting ? {date_setting: payloadDateSetting.date_setting} : {}),
			...(payloadDateSetting.min_date !== undefined ? {min_date: payloadDateSetting.min_date} : {}),
			...(payloadDateSetting.max_date !== undefined ? {max_date: payloadDateSetting.max_date} : {}),

			has_ticket_combinations: false,
			selectedSpecs: selectedMap,
			selectedSkuIndex: matchedSkuIndex,
			selectedSku: sku,
			item_unit: itemUnit ?? null,
		});
	};

	const renderSpecGroup = spec => {
		const selectedValue = selectedMap[spec.spec_oid];

		// Hide the ticketSpec entirely from UI (do not render)
		if (ticketSpec && spec.spec_oid === ticketSpec.spec_oid) {
			return null;
		}

		return (
			<View key={spec.spec_oid} style={{marginBottom: 20}}>
				<PretendardSemiBoldText
					size={22}
					lineHeight={26}
					numberOfLines={2}
					color={colors.Black}
					deco={'margin-bottom:10px;'}>
					{spec.spec_title}
				</PretendardSemiBoldText>
				<View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
					{spec.spec_items.map(item => {
						const isSelected = selectedValue === item.spec_item_oid;
						const enabled = isOptionEnabled(spec.spec_oid, item.spec_item_oid);

						const baseStyle = styles.optionBase;
						const selectedStyle = isSelected ? styles.optionSelected : null;
						const disabledStyle = !enabled ? styles.optionDisabled : null;

						return (
							<TouchableOpacity
								key={item.spec_item_oid}
								onPress={() => {
									if (!enabled) return;
									toggleSelect(spec.spec_oid, item.spec_item_oid);
								}}
								activeOpacity={enabled ? 0.8 : 1}
								style={[baseStyle, isSelected && selectedStyle, !enabled && disabledStyle]}
								accessibilityState={{disabled: !enabled, selected: isSelected}}>
								<PretendardSemiBoldText
									size={20}
									lineHeight={24}
									numberOfLines={2}
									color={isSelected ? colors.Black : enabled ? colors.grey800 : colors.grey300}>
									{item.name}
								</PretendardSemiBoldText>
							</TouchableOpacity>
						);
					})}
				</View>
			</View>
		);
	};
	useEffect(() => {
		if (ticketSpec && specs.length === 1 && specs[0].spec_oid === ticketSpec.spec_oid) {
			onConfirm();
		}
	}, [ticketSpec, specs]);
	return (
		<>
			<BackgroundGrayScrollView>
				<PretendardSemiBoldText
					size={20}
					lineHeight={24}
					numberOfLines={2}
					color={colors.Black}
					deco={'margin-top:20px;margin-bottom:20px;'}>
					옵션 선택
				</PretendardSemiBoldText>
				<FlexWrap>
					{specs.length === 0 ||
					(ticketSpec && specs.length === 1 && specs[0].spec_oid === ticketSpec.spec_oid) ? (
						<PretendardSemiBoldText size={20} lineHeight={24} numberOfLines={2} color={colors.PointGreen1}>
							옵션 선택이 필요없습니다
						</PretendardSemiBoldText>
					) : (
						specs.map(renderSpecGroup)
					)}
				</FlexWrap>

				{renderRefundPolicy(data?.refund_policy_v2)}
				<MarginContainder />
			</BackgroundGrayScrollView>
			<RouteButton
				navigation={navigation}
				// isDisabled={!canNext}
				type={'planner'}
				nextText={'다음으로'}
				goNext={onConfirm}
				// goNext={async () => {
				// 	await logEvent(`goReserve`, {pkgName: name});

				// 	navigation.navigate('Reserve', {
				// 		data: {
				// 			item_no: data?.item?.[0]?.item_no,
				// 			guid: data?.guid,
				// 			partner_order_no: '1',
				// 			prod_no: prod_no,
				// 			pkg_no: pkg_no,
				// 			locale: 'ko',

				// 			state: 'KR',
				// 			buyer_first_name: '',
				// 			buyer_last_name: '',
				// 			buyer_Email: 'wayfarers0814@gmail.com',
				// 			buyer_tel_country_code: '82',
				// 			buyer_tel_number: 0,
				// 			buyer_country: 'KR',

				// 			s_date: moment(dateInfo.selectStartDate).format('YYYY-MM-DD'),
				// 			e_date:
				// 				dateInfo.selectEndDate == null
				// 					? moment(dateInfo.selectStartDate).format('YYYY-MM-DD')
				// 					: moment(dateInfo.selectEndDate).format('YYYY-MM-DD'),
				// 			event_time: eventTime,
				// 			guide_lang: null,
				// 			skus: [
				// 				{
				// 					sku_id: checkList[0]?.sku_id,
				// 					qty: count,
				// 					price: Number(
				// 						checkList[0]?.calendar_detail?.[
				// 							moment(dateInfo.selectStartDate).format('YYYY-MM-DD')
				// 						]?.b2b_price?.fullday ?? checkList[0]?.b2b_price,
				// 					),
				// 				},
				// 			],
				// 			mobile_device: {
				// 				mobile_model_no: null,
				// 				IMEI: null,
				// 				active_date: '2025-08-21',
				// 			},
				// 			order_note: '오더노트',
				// 			total_price:
				// 				Number(
				// 					checkList[0]?.calendar_detail?.[
				// 						moment(dateInfo.selectStartDate).format('YYYY-MM-DD')
				// 					]?.b2b_price?.fullday ?? checkList[0]?.b2b_price,
				// 				) * count,
				// 			pay_type: '01',
				// 			image: image,
				// 			name: name,
				// 		},
				// 	});
				// }}
				nextTitle='RecommendSelectTour'></RouteButton>
		</>
	);
}
const SpecBox = styled.TouchableOpacity<{isActive: boolean; disable?: boolean}>`
	min-width: ${widthPercentage(70)}px;
	height: ${heightPercentage(52)}px;
	border-radius: 12px;
	border-width: 1px;
	border-color: ${colors.Gray200};
	align-items: center;
	justify-content: center;
	padding: 5px 10px;
	background-color: ${props => (props.isActive ? colors.Primary : colors.backgroundWhite)};
`;
const TicketBox = styled.View`
	width: ${widthPercentage(327)}px;
	min-height: ${heightPercentage(126)}px;
	border-radius: 8px;
	background-color: ${colors.backgroundGray};
	padding: ${widthPercentage(20)}px;
`;
const styles = StyleSheet.create({
	optionBase: {
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: colors.grey200,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fff',
		marginRight: 10,
		marginBottom: 10,
		minWidth: widthPercentage(70),
		minHeight: heightPercentage(52),
	},
	optionSelected: {
		borderColor: colors.Primary,
		backgroundColor: colors.Primary,
	},
	optionDisabled: {
		borderColor: colors.grey100,
		backgroundColor: '#fafafa',
	},
});
