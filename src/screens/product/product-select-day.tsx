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
import {SVGMinus, SVGPlus, SVGRightAdd} from '../../utill/svg/svg';
import RouteButton from '../../utill/component/route-button';
import {logEvent} from '../../../firebaseAnalytice';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {Toast} from 'react-native-toast-message/lib/src/Toast';

export default function ProductSelectDay({navigation}: any) {
	const route = useRoute();
	const {prod_no, pkg_no, go_date_setting, image, name}: {prod_no: number; pkg_no: number; go_date_setting: any} =
		route.params;
	const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
	const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
	const [selectDateFlag, setSelectDateFlag] = useState(false);
	const [dateInfo, setDateInfo] = useState({selectStartDate: null, selectEndDate: null});
	const onDateChange = (date: any, type: string) => {
		!selectDateFlag && setSelectDateFlag(true);
		if (type == 'END_DATE') {
			setDateInfo({...dateInfo, selectEndDate: date});
		} else {
			dateInfo.selectEndDate &&
				dateInfo.selectEndDate?.diff(date) <= 0 &&
				setDateInfo({...dateInfo, selectEndDate: date});

			setDateInfo({...dateInfo, selectStartDate: date});
			setSelectDateFlag(true);
			setEventTime(null);
		}
	};
	const dispatch = useAppDispatch();
	const [data, setData] = useState([]);
	type SelectedSpecsState = {
		[specTitle: string]: string; // 예: "좌석": "A석"
	};
	const [selectedSpecs, setSelectedSpecs] = useState<SelectedSpecsState>({});
	const handleSpecSelect = (specTitle: string, selectedName: string) => {
		setEventTime(null);
		setSelectedSpecs(prev => {
			// 이미 선택된 값과 같으면 → 선택 해제
			if (prev[specTitle] === selectedName) {
				const newState = {...prev};
				delete newState[specTitle]; // 해당 specTitle 삭제
				handleChecklist(newState);
				return newState;
			}

			// 아니면 → 선택된 값으로 갱신
			handleChecklist({
				...prev,
				[specTitle]: selectedName,
			});
			return {
				...prev,
				[specTitle]: selectedName,
			};
		});
	};
	const [checkList, setCheckList] = useState([]);
	const handleChecklist = (e: any) => {
		// let copy = data?.item?.[0]?.skus?.filter(item => {
		// 	return item?.spec;
		// });
		// console.log(copy);
		const filteredData =
			e?.length != 0
				? data?.item?.[0]?.skus?.filter(item => {
						return Object?.entries(e)?.every(([key, val]) => item?.spec[key] === val);
				  })
				: [];
		// console.log(filteredData);

		setCheckList(filteredData);
	};
	// useEffect(() => {
	// 	handleChecklist({});
	// }, []);
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
	const [ticketStatus, setTicketStatus] = useState<any[]>([]);
	const deriveTicketLabelFromSku = (value: any) => {
		const exactTicketSpec =
			value?.item?.[0]?.specs?.find(s => {
				if (!s?.spec_title) return false;
				return String(s.spec_title).trim().toLowerCase() === '티켓 종류';
			}) ?? null;
		if (exactTicketSpec && Array.isArray(exactTicketSpec?.spec_items)) {
			const mapped: any[] = [];

			for (const si of exactTicketSpec.spec_items) {
				const oid = si?.spec_item_oid ?? si?.spec_item_id ?? String(si?.name ?? '');
				const label = si?.name ?? si?.spec_item_title ?? oid;

				let copy = value?.item?.[0]?.unit_quantity_rule?.ticket_rule?.rulesets?.find(findItem =>
					findItem.spec_items.includes(oid),
				);

				mapped.push({
					id: oid,
					label,
					max: copy?.max_quantity ?? Infinity,
					min: copy?.min_quantity ?? 0,
					count: copy?.min_quantity ?? 0,
				});

				// 	const candidates = skus.filter((sku: any) => {
				// 	  if (!Array.isArray(sku?.specs_ref)) return false;
				// 	  return sku.specs_ref.some((r: any) =>
				// 		String(r.spec_item_id) === String(oid) || String(r.spec_value_id) === String(oid)
				// 	  );
				// 	});
				// 	if (!candidates.length) continue;

				// 	// Prefer the first candidate SKU's price for the selectedDate
				// 	const firstCandidate = candidates[0];
				// 	const unit = Number(unitForSkuOnDate(firstCandidate, selectedDate) ?? Math.min(...candidates.map(s => unitForSkuOnDate(s, selectedDate) ?? 0)));

				// 	const ageLabel = si?.rule ? (() => {
				// 	  const ar = si.rule?.age_rule ?? si.rule;
				// 	  const min = ar?.min ?? ar?.min_age; const max = ar?.max ?? ar?.max_age;
				// 	  if (min != null && max != null) return `(만 ${min}세 이상 ~ ${max}세 미만)`;
				// 	  if (min != null) return `(만 ${min}세 이상)`;
				// 	  if (max != null) return `(만 ${max}세 미만)`;
				// 	  return '';
				// 	})() : (candidates[0]?.spec_desc ?? '');
				// 	const rawQty = label.toLowerCase().includes('성인') ? (Number(params?.adult ?? 1) || 1) : (Number(params?.child ?? 0) || 0);
				// 	const qtyInit = totalRule.isMultipleLimit ? Math.max(totalRule.multiple, rawQty) : Math.max(0, Math.floor(rawQty));
				// 	mapped.push({
				// 	  id: oid,
				// 	  label,
				// 	  ageLabel,
				// 	  subLabel: (candidates[0]?.spec && typeof candidates[0].spec === 'object') ? Object.entries(candidates[0].spec).filter(([k]) => k !== '티켓 종류').map(([_, v]) => String(v)) : [],
				// 	  skus: candidates,
				// 	  unit: unit ?? (toNumber(item?.b2b_min_price ?? item?.b2c_min_price) ?? 0),
				// 	  qty: qtyInit,
				// 	});
				//   }
			}
			setTicketStatus(mapped);
			console.log('zz', mapped);
		}
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
	useEffect(() => {
		console.log('z', ticketSpec);
	}, [ticketSpec]);
	const handleSpcesList = value => {
		// if (value?.) {
		// }
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
				handleSpcesList(value?.item?.[0]);
				setData(value);
				setCount(value?.item?.[0]?.unit_quantity_rule?.total_rule?.min_quantity ?? 1);
				deriveTicketLabelFromSku(value);
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
	const [daySetting, setDaySetting] = useState({});
	const handleDaySetting = () => {
		let datas = {single: false, start: null, end: null};
		if (go_date_setting?.type == '01') {
			datas['single'] = true;
		} else if (!!go_date_setting?.days) {
			datas.start = go_date_setting?.days?.min;
			datas.end = go_date_setting?.days?.max;
		}
		// console.log(data);
		setDaySetting(datas);
	};
	useLayoutEffect(() => {
		handlePkg();
		handleDaySetting();
	}, []);
	const onConfirm = () => {
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
				// navigation.navigate('/product/reservation', {
				//   prod_no: params?.prod_no ?? pkgData?.prod_no,
				//   pkg_no: params?.pkg_no ?? (pkgData?.pkg && pkgData.pkg[0]?.pkg_no) ?? pkgData?.pkg_no,
				//   pkgData,
				//   date_setting: params?.date_setting ?? null,
				//   max_date: params?.max_date ?? null,
				//   min_date: params?.min_date ?? null,
				//   has_ticket_combinations: true,
				//   ticket_combinations: combos.map(c => ({
				// 	selectedSpecs: c.selectedSpecs,
				// 	matchedSkuIndex: c.matchedSkuIndex,
				// 	matchedSku: c.matchedSku,
				//   })),
				//   item_unit: params?.item_unit ?? null,
				// });
				return;
			}

			// Otherwise navigate with combos
			//   navigation.navigate('/product/reservation', {
			// 	prod_no: params?.prod_no ?? pkgData?.prod_no,
			// 	pkg_no: params?.pkg_no ?? (pkgData?.pkg && pkgData.pkg[0]?.pkg_no) ?? pkgData?.pkg_no,
			// 	pkgData,
			// 	date_setting: params?.date_setting ?? null,
			// 	max_date: params?.max_date ?? null,
			// 	min_date: params?.min_date ?? null,
			// 	has_ticket_combinations: true,
			// 	ticket_combinations: combos.map(c => ({
			// 	  selectedSpecs: c.selectedSpecs,
			// 	  matchedSkuIndex: c.matchedSkuIndex,
			// 	  matchedSku: c.matchedSku,
			// 	})),
			// 	item_unit: params?.item_unit ?? null,
			//   });

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

		// navigation.navigate('/product/reservation', {
		//   prod_no: params?.prod_no ?? pkgData?.prod_no,
		//   pkg_no: params?.pkg_no ?? (pkgData?.pkg && pkgData.pkg[0]?.pkg_no) ?? pkgData?.pkg_no,
		//   pkgData,
		//   date_setting: params?.date_setting ?? null,
		//   max_date: params?.max_date ?? null,
		//   min_date: params?.min_date ?? null,
		//   has_ticket_combinations: false,
		//   selectedSpecs: selectedMap,
		//   selectedSkuIndex: matchedSkuIndex,
		//   selectedSku: sku,
		//   item_unit: params?.item_unit ?? null,
		// });
	};
	const [count, setCount] = useState(data?.item?.[0]?.unit_quantity_rule?.total_rule?.min_quantity ?? 1);
	const [canNext, setCanNext] = useState(false);
	const [eventTime, setEventTime] = useState(null);
	// useEffect(() => {
	// 	if (checkList[0]?.calendar_detail?.length != 0) {
	// 		dispatch(
	// 			modalSliceActions.setOpenModal({
	// 				modalTitle: '해당 패키지가 판매를 중단하였습니다',
	// 				modalSingleUse: true,
	// 				modalTopText: '확인',
	// 			}),
	// 		);
	// 		navigation.goBack();
	// 	}
	// }, []);

	const totalCount = useMemo(() => ticketStatus?.reduce((acc, c) => acc + c.count, 0), [ticketStatus]);
	const totalMoney = useMemo(() => {
		console.log(checkList);
		// ticketStatus.map((item)=>{
		// 	if(item?.count!=0){
		// 		data?.item?.[0]?.skus?.map((skuItem)=>{
		// 			skuItem?.specs_ref?.find((refItem)=>refItem?.spec_value_id==item?.id)
		// 		})
		// 	}
		// })
		// ?.calendar_detail?.[
		// 	moment(dateInfo.selectStartDate).format('YYYY-MM-DD')
		// ]?.b2b_price?.fullday ?? checkList[0]?.b2b_price,
		// return 0;
	}, [ticketStatus, checkList]);
	useEffect(() => {
		let status = {
			day: false,
			product: false,
		};
		if (daySetting?.single && dateInfo?.selectStartDate != null) {
			status.day = true;
		} else if (!daySetting?.single && dateInfo?.selectStartDate != null && dateInfo?.selectEndDate != null) {
			status.day = true;
		}
		if (checkList.length == 1) {
			status.product = true;
		}

		if (data?.item?.[0]?.sale_s_date_event != null && status.day) {
			status.day = !!eventTime;
		} else {
			status.day =
				!!checkList[0]?.calendar_detail?.[moment(dateInfo.selectStartDate).format('YYYY-MM-DD')]?.b2b_price
					?.fullday;
		}
		if (data?.item?.[0]?.unit_quantity_rule?.total_rule?.max_quantity < totalCount) {
			console.log('zz');
			status.product == false;
		}
		setCanNext(status.day && status.product);
	}, [dateInfo, daySetting, checkList, eventTime, totalCount]);
	const handleTicketCount = (sign, item) => {
		if (item) {
			let index = ticketStatus.findIndex(findItem => findItem.id == item);
			let copy = [...ticketStatus];
			copy[index] = {...copy[index], count: sign == '+' ? copy[index]?.count + 1 : copy[index]?.count - 1};
			setTicketStatus(copy);
		}
		setCount(sign == '+' ? count + 1 : count - 1);
		// if (item?.[count]) {
		// 	item?.count += 1;
		// } else {
		// 	item['count'] = item;
		// }
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

	return (
		<>
			<BackgroundGrayScrollView>
				<PretendardSemiBoldText
					size={22}
					lineHeight={26}
					numberOfLines={2}
					color={colors.Black}
					deco={'margin-bottom:20px;'}>
					{name}
				</PretendardSemiBoldText>
				<CalendarPicker
					width={widthPercentage(Platform.isPad ? 300 : 327)}
					weekdays={weekdays}
					months={months}
					minDate={data?.sale_s_date ? new Date(data.sale_s_date) : new Date()}
					initialDate={data?.sale_s_date ? new Date(data.sale_s_date) : new Date()}
					maxDate={data?.sale_e_date ? new Date(data.sale_e_date) : new Date()}
					startFromMonday={false}
					onDateChange={onDateChange}
					showDayStragglers={false}
					monthYearHeaderWrapperStyle={{
						marginHorizontal: widthPercentage(30),
						alignItems: 'center',
						justifyContent: 'center',
					}}
					headerWrapperStyle={{justifyContent: 'center', alignItems: 'center'}}
					nextComponent={<SVGRightAdd color={colors.Gray5} />}
					previousComponent={<SVGRightAdd color={colors.Gray400} transform={180} />}
					allowRangeSelection={!daySetting?.single}
					minRangeDuration={daySetting?.start - 1 ?? undefined}
					maxRangeDuration={daySetting?.end ?? undefined}
					selectedRangeStartStyle={{backgroundColor: colors.Primary}}
					selectedRangeStyle={{backgroundColor: colors.PointGreen3}}
					selectedRangeEndStyle={{backgroundColor: colors.Primary}}
					selectedDayColor={colors.Primary}
					// selectedStartDate={selectedDateFlag || freeTicket ? selectStartDate.toDate() : undefined}
					// selectedEndDate={
					// 	(selectedDateFlag || freeTicket) && selectEndDate != null
					// 		? selectEndDate.toDate()
					// 		: undefined
					// }
					allowBackwardRangeSelect={true}
					selectYearTitle='년도 선택'
				/>
				<FlexWrap>
					{specs.length === 0 ? <Text>선택 가능한 옵션이 없습니다.</Text> : specs.map(renderSpecGroup)}

					{/* {data?.item?.[0]?.specs?.map(spec => {
						return (
							<VStack>
								<PretendardSemiBoldText
									size={22}
									lineHeight={26}
									numberOfLines={2}
									color={colors.Black}>
									{spec?.spec_title}
								</PretendardSemiBoldText>
								<FlexWrap gap={10}>
									{spec?.spec_items?.map(element => {
										const rulesetsItem = ticketStatus?.find(
											filItem => filItem?.id == element?.spec_item_oid,
										);
										if (spec?.spec_title == '티켓 종류' || rulesetsItem) {
											return (
												<TicketBox>
													<PretendardSemiBoldText
														size={20}
														lineHeight={24}
														color={colors.Black}>
														{element?.name}
														{!!element?.rule?.age_rule &&
															(!!element?.rule?.age_rule?.min ||
																element?.rule?.age_rule?.max) && (
																<PretendardVariableText
																	size={16}
																	lineHeight={21}
																	numberOfLines={2}
																	color={colors.Gray3}>
																	{' '}
																	(
																	{(!!element?.rule?.age_rule?.min
																		? '만 ' + element?.rule?.age_rule?.min + '세'
																		: '') +
																		' ~ ' +
																		(!!element?.rule?.age_rule?.max
																			? '만 ' +
																			  element?.rule?.age_rule?.max +
																			  '세'
																			: '')}
																	)
																</PretendardVariableText>
															)}
														{!!element?.rule?.height_rule &&
															(!!element?.rule?.height_rule?.min ||
																element?.rule?.height_rule?.max) && (
																<PretendardVariableText
																	size={16}
																	lineHeight={21}
																	numberOfLines={2}
																	color={colors.Gray3}>
																	{' '}
																	(
																	{(!!element?.rule?.height_rule?.min
																		? '신장 ' + element?.rule?.height_rule?.min
																		: '') +
																		' ~ ' +
																		(!!element?.rule?.height_rule?.max
																			? element?.rule?.height_rule?.max
																			: '')}
																	)
																</PretendardVariableText>
															)}
													</PretendardSemiBoldText>
													<HStack
														justifyContent='space-around'
														width={widthPercentage(182)}
														deco={'margin-bottom:10px;'}>
														<SVGContainer
															disabled={(rulesetsItem?.min ?? 0) >= rulesetsItem?.count}
															onPress={() => {
																handleTicketCount('-', rulesetsItem?.id);
																console.log(element);
																// setCount(count - 1);
															}}
															color={
																(rulesetsItem?.min ?? 0) >= rulesetsItem?.count
																	? colors.Gray1
																	: colors.Primary
															}>
															<SVGMinus
																width={widthPercentage(23)}
																height={widthPercentage(23)}
																color={colors.Gray2}
															/>
														</SVGContainer>

														<PretendardSemiBoldText
															size={16}
															color={colors.Black}
															lineHeight={21.6}>
															{rulesetsItem?.count}
															{data?.item?.[0]?.unit}
														</PretendardSemiBoldText>
														<SVGContainer
															disabled={
																(rulesetsItem?.max ?? Infinity) <
																rulesetsItem?.count + 1
															}
															onPress={() => {
																handleTicketCount('+', rulesetsItem?.id);
															}}
															color={
																(rulesetsItem?.max ?? Infinity) <
																rulesetsItem?.count + 1
																	? colors.Gray1
																	: colors.Primary
															}>
															<SVGPlus
																width={widthPercentage(25)}
																height={widthPercentage(25)}
																color={colors.Gray2}
															/>
														</SVGContainer>
													</HStack>
												</TicketBox>
											);
										} else {
											return (
												<SpecBox
													disable={
														checkList?.length == 0
															? false
															: !!!checkList?.find(
																	item =>
																		item?.spec?.[spec?.spec_title] == element?.name,
															  )
													}
													disabled={
														checkList?.length == 0
															? false
															: !!!checkList?.find(
																	item =>
																		item?.spec?.[spec?.spec_title] == element?.name,
															  )
													}
													isActive={selectedSpecs[spec?.spec_title] == element?.name}
													onPress={() => handleSpecSelect(spec?.spec_title, element?.name)}>
													<PretendardVariableText
														size={18}
														lineHeight={22}
														numberOfLines={2}
														color={
															checkList?.length == 0
																? colors.Black
																: !!!checkList?.find(
																		item =>
																			item?.spec?.[spec?.spec_title] ==
																			element?.name,
																  )
																? colors.Gray400
																: colors.Black
														}
														deco={'text-align:center;'}>
														{element?.name}
														{!!element?.rule?.age_rule &&
															(!!element?.rule?.age_rule?.min ||
																element?.rule?.age_rule?.max) && (
																<PretendardVariableText
																	size={16}
																	lineHeight={21}
																	numberOfLines={2}
																	color={colors.Gray3}>
																	{' '}
																	(
																	{(!!element?.rule?.age_rule?.min
																		? '만 ' + element?.rule?.age_rule?.min + '세'
																		: '') +
																		' ~ ' +
																		(!!element?.rule?.age_rule?.max
																			? '만 ' +
																			  element?.rule?.age_rule?.max +
																			  '세'
																			: '')}
																	)
																</PretendardVariableText>
															)}
														{!!element?.rule?.height_rule &&
															(!!element?.rule?.height_rule?.min ||
																element?.rule?.height_rule?.max) && (
																<PretendardVariableText
																	size={16}
																	lineHeight={21}
																	numberOfLines={2}
																	color={colors.Gray3}>
																	{' '}
																	(
																	{(!!element?.rule?.height_rule?.min
																		? '신장 ' + element?.rule?.height_rule?.min
																		: '') +
																		' ~ ' +
																		(!!element?.rule?.height_rule?.max
																			? element?.rule?.height_rule?.max
																			: '')}
																	)
																</PretendardVariableText>
															)}
													</PretendardVariableText>
												</SpecBox>
											);
										}
									})}
								</FlexWrap>
							</VStack>
						);
					})} */}
					<PretendardVariableText size={16} lineHeight={21} numberOfLines={2} color={colors.Gray3}>
						{totalCount}
					</PretendardVariableText>

					{data?.item?.[0]?.sale_s_date_event != null &&
						checkList?.length == 1 &&
						!!dateInfo.selectStartDate && (
							<VStack>
								<PretendardSemiBoldText
									size={22}
									lineHeight={26}
									numberOfLines={2}
									color={colors.Black}>
									시간
								</PretendardSemiBoldText>
								<FlexWrap gap={10}>
									{!!checkList?.[0]?.calendar_detail?.[
										moment(dateInfo.selectStartDate).format('YYYY-MM-DD')
									]?.b2b_price &&
										Object?.entries(
											checkList?.[0]?.calendar_detail?.[
												moment(dateInfo.selectStartDate).format('YYYY-MM-DD')
											]?.b2b_price,
										).map(([key, value]) => (
											<SpecBox
												isActive={eventTime == key}
												onPress={() => setEventTime(prev => (prev == key ? null : key))}>
												<PretendardSemiBoldText
													size={22}
													lineHeight={26}
													numberOfLines={2}
													color={colors.Black}>
													{key}
												</PretendardSemiBoldText>
											</SpecBox>
										))}
								</FlexWrap>
							</VStack>
						)}
				</FlexWrap>
				{ticketStatus.length == 0 && (
					<HStack justifyContent='space-around' width={widthPercentage(182)} deco={'margin-bottom:10px;'}>
						<SVGContainer
							disabled={data?.item?.[0]?.unit_quantity_rule?.total_rule?.min_quantity >= count}
							onPress={() => {
								setCount(count - 1);
							}}
							color={
								data?.item?.[0]?.unit_quantity_rule?.total_rule?.min_quantity >= count
									? colors.Gray1
									: colors.Primary
							}>
							{count >= 1 && (
								<SVGMinus
									width={widthPercentage(23)}
									height={widthPercentage(23)}
									color={colors.Gray2}
								/>
							)}
						</SVGContainer>

						<PretendardSemiBoldText size={16} color={colors.Black} lineHeight={21.6}>
							{count}
							{data?.item?.[0]?.unit}
						</PretendardSemiBoldText>
						<SVGContainer
							disabled={data?.item?.[0]?.unit_quantity_rule?.total_rule?.max_quantity < count + 1}
							onPress={() => {
								setCount(count + 1);
							}}
							color={
								data?.item?.[0]?.unit_quantity_rule?.total_rule?.max_quantity < count + 1
									? colors.Gray1
									: colors.Primary
							}>
							<SVGPlus width={widthPercentage(25)} height={widthPercentage(25)} color={colors.Gray2} />
						</SVGContainer>
					</HStack>
				)}

				{renderRefundPolicy(data.refund_policy_v2)}
				{data?.item?.[0]?.specs?.length == Object.entries(selectedSpecs)?.length && (
					<HStack deco='margin-top:15px;' justifyContent='space-between'>
						{Number(
							checkList[0]?.calendar_detail?.[moment(dateInfo.selectStartDate).format('YYYY-MM-DD')]
								?.b2b_price?.fullday ?? checkList[0]?.b2b_price,
						) == 0 ? (
							<PretendardSemiBoldText size={24} lineHeight={28} color={colors.PointGreen1}>
								선택하신 날짜의 해당 옵션이 품절되었습니다.{`\n`}
								다른 날짜나 옵션을 선택해주세요.
							</PretendardSemiBoldText>
						) : (
							<>
								<PretendardSemiBoldText
									size={24}
									lineHeight={28}
									numberOfLines={2}
									color={colors.Gray3}>
									총 금액
								</PretendardSemiBoldText>
								<PretendardSemiBoldText
									size={22}
									lineHeight={26}
									numberOfLines={2}
									color={colors.Black}>
									{(
										Number(
											checkList[0]?.calendar_detail?.[
												moment(dateInfo.selectStartDate).format('YYYY-MM-DD')
											]?.b2b_price?.fullday ?? checkList[0]?.b2b_price,
										) * count
									).toLocaleString('ko-KR')}
									원{/* {moment(dateInfo.selectStartDate).format('YYYY-MM-DD')} */}
								</PretendardSemiBoldText>
							</>
						)}
					</HStack>
				)}
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
