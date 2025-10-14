import {useRoute} from '@react-navigation/native';
import moment from 'moment';
import {useEffect, useLayoutEffect, useState} from 'react';
import {Text} from 'react-native';
import {View} from 'react-native';
import {Platform} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import RenderHTML from 'react-native-render-html';
import styles from 'rn-range-slider/styles';
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

export default function ProductSelectDay({navigation}: any) {
	const route = useRoute();
	const {prod_no, pkg_no, go_date_setting}: {prod_no: number; pkg_no: number; go_date_setting: any} = route.params;
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
		}
	};
	const dispatch = useAppDispatch();
	const [data, setData] = useState([]);
	type SelectedSpecsState = {
		[specTitle: string]: string; // 예: "좌석": "A석"
	};
	const [selectedSpecs, setSelectedSpecs] = useState<SelectedSpecsState>({});
	const handleSpecSelect = (specTitle: string, selectedName: string) => {
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
		console.log(filteredData);

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
				return <Text key={index}>✔️ 출발일 기준 {display_rule?.day_min}일 전까지 전액 환불 가능</Text>;
			}

			if (fee_type === 'NON_REFUNDABLE') {
				if (display_rule?.day_max !== undefined) {
					return <Text key={index}>❌ 출발일 기준 {display_rule?.day_max}일 전부터는 환불 불가</Text>;
				} else {
					return <Text key={index}>❌ 환불 불가</Text>;
				}
			}

			// 다른 타입이 있을 경우 추가 처리
			return null;
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
			setData(value);
			console.log(value?.item?.[0]?.unit_quantity_rule?.total_rule);
		} catch (e) {
			console.log('e');
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const [daySetting, setDaySetting] = useState({});
	const handleDaySetting = () => {
		let data = {single: false, start: null, end: null};
		if (go_date_setting?.type == '01') {
			data['single'] = true;
		} else if (!!go_date_setting?.days) {
			data.start = go_date_setting?.days?.min;
			data.end = go_date_setting?.days?.max;
		}
		console.log(data);
		setDaySetting(data);
	};
	useLayoutEffect(() => {
		handlePkg();
		handleDaySetting();
	}, []);
	const [count, setCount] = useState(data?.item?.[0]?.unit_quantity_rule?.total_rule?.min_quantity ?? 1);
	const [canNext, setCanNext] = useState(false);
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
		setCanNext(status.day && status.product);
	}, [dateInfo, daySetting, checkList]);
	return (
		<>
			<BackgroundGrayScrollView>
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
					{/* {data?.item?.[0]?.skus.map(sku => {
					return sku?.specs?.map(spec => (
						<SpecBox>
							<PretendardSemiBoldText size={22} lineHeight={26} numberOfLines={2} color={colors.Black}>
								{spec?.spec_title}
							</PretendardSemiBoldText>
						</SpecBox>
					));
				})} */}

					{data?.item?.[0]?.specs?.map(spec => (
						<VStack>
							<PretendardSemiBoldText size={22} lineHeight={26} numberOfLines={2} color={colors.Black}>
								{spec?.spec_title}
							</PretendardSemiBoldText>
							<FlexWrap gap={10}>
								{spec?.spec_items?.map(element => (
									<SpecBox
										disable={
											checkList?.length == 0
												? false
												: !!!checkList?.find(
														item => item?.spec?.[spec?.spec_title] == element?.name,
												  )
										}
										disabled={
											checkList?.length == 0
												? false
												: !!!checkList?.find(
														item => item?.spec?.[spec?.spec_title] == element?.name,
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
															item => item?.spec?.[spec?.spec_title] == element?.name,
													  )
													? colors.Gray400
													: colors.Black
											}
											deco={'text-align:center;'}>
											{element?.name}
										</PretendardVariableText>
									</SpecBox>
								))}
							</FlexWrap>
						</VStack>
					))}
				</FlexWrap>
				{renderRefundPolicy(data.refund_policy_v2)}

				{data?.item?.[0]?.specs?.length == Object.entries(selectedSpecs)?.length && (
					<PretendardSemiBoldText size={22} lineHeight={26} numberOfLines={2} color={colors.Black}>
						{(
							Number(
								checkList[0]?.calendar_detail?.[moment(dateInfo.selectStartDate).format('YYYY-MM-DD')]
									?.b2b_price?.fullday,
							) * count
						).toLocaleString('ko-KR')}
						원{/* {moment(dateInfo.selectStartDate).format('YYYY-MM-DD')} */}
					</PretendardSemiBoldText>
				)}

				<HStack justifyContent='space-around' width={widthPercentage(182)}>
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
							<SVGMinus width={widthPercentage(23)} height={widthPercentage(23)} color={colors.Gray2} />
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
				<MarginContainder />
			</BackgroundGrayScrollView>
			<RouteButton
				navigation={navigation}
				isDisabled={!canNext}
				type={'planner'}
				nextText={'예약하기'}
				goNext={() => {
					navigation.navigate('PackageSelect');
				}}
				nextTitle='RecommendSelectTour'></RouteButton>
		</>
	);
}
const SpecBox = styled.TouchableOpacity<{isActive: boolean; disable: boolean}>`
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
