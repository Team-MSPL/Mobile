import {useRoute} from '@react-navigation/native';
import moment from 'moment';
import {useEffect, useState} from 'react';
import {styled} from 'styled-components/native';
import {useAppDispatch} from '../../redux';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {handleOrderDtl, handleOrderDtlInfo} from '../../redux/travel-info/travel.slice';
import {colors} from '../../utill/colors';
import {BackgroundGrayScrollView, FlexWrap, HStack, PretendardSemiBoldText} from '../../utill/layout/layout';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {SvgCalendar, SVGClock, SVGPeople} from '../../utill/svg/svg';

export default function ReserveDetail() {
	const dispatch = useAppDispatch();
	const route = useRoute();
	const {order_no} = route.params;
	const [info, setInfo] = useState(null);
	const [detailInfo, setDetailInfo] = useState(null);
	const handleDetail = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			const a = await dispatch(handleOrderDtl(order_no)).unwrap();
			const q = await dispatch(handleOrderDtlInfo(order_no)).unwrap();
			setInfo(a.data);
			setDetailInfo(q.data);
			console.log(a.data);
		} catch (e) {
			console.log(e);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const viewList = [
		{title: '상품명', value: detailInfo?.product_summary?.prod_name},

		{title: '패키지 이름', value: detailInfo?.package_summary?.pkg_name},

		{title: '주문 번호', value: info?.order_no},
		{title: '상품 번호', value: info?.prod_no},
		{title: '구매자', value: info?.buyer_first_name + info?.buyer_last_name},
		{title: '이메일', value: info?.buyer_email},
		{title: '전화번호', value: '+' + info?.buyer_tel_country_code + info?.buyer_tel_number},
	];
	useEffect(() => {
		handleDetail();
	}, []);
	return (
		<BackgroundGrayScrollView>
			<HStack gap={5}>
				<TextWall />
				<PretendardSemiBoldText size={20} lineHeight={25} color={colors.Black}>
					예약 정보
				</PretendardSemiBoldText>
			</HStack>
			<FlexWrap gap={30} deco={'padding:10px;'}>
				<HStack gap={10}>
					<SvgCalendar />
					<PretendardSemiBoldText size={16} lineHeight={21} color={colors.Black}>
						{moment(info?.s_date)?.format('YYYY-MM-DD')}
					</PretendardSemiBoldText>
				</HStack>
				{!!info?.event_time && (
					<HStack gap={10}>
						<SVGClock color='black' />
						<PretendardSemiBoldText size={18} lineHeight={23} color={colors.Black}>
							{info?.event_time}
						</PretendardSemiBoldText>
					</HStack>
				)}
				<HStack gap={10}>
					<SVGPeople />
					<PretendardSemiBoldText size={18} lineHeight={23} color={colors.Black}>
						{info?.skus?.[0]?.qty}
						{detailInfo?.item_summary?.unit}
					</PretendardSemiBoldText>
				</HStack>
			</FlexWrap>

			<HStack gap={5} deco={'margin-top:30px;'}>
				<TextWall />
				<PretendardSemiBoldText size={20} lineHeight={25} color={colors.Black}>
					주문 내역
				</PretendardSemiBoldText>
			</HStack>
			{viewList?.map(
				item =>
					!!item.value && (
						<HStack justifyContent='space-between' deco='margin-top:20px;'>
							<PretendardSemiBoldText size={20} lineHeight={25} color={colors.Gray2}>
								{item?.title}
							</PretendardSemiBoldText>
							<PretendardSemiBoldText
								size={18}
								lineHeight={23}
								numberOfLines={2}
								color={colors.Black}
								deco={'width:200px;text-align:right;'}>
								{item?.value}
							</PretendardSemiBoldText>
						</HStack>
					),
			)}
			{info?.skus?.[0]?.spec &&
				Object.entries(info?.skus?.[0]?.spec).map(([item, idx]) => (
					<HStack justifyContent='space-between' deco='margin-top:20px;'>
						<PretendardSemiBoldText size={20} lineHeight={25} color={colors.Gray2}>
							{item}
						</PretendardSemiBoldText>
						<PretendardSemiBoldText size={18} lineHeight={23} color={colors.Black}>
							{idx}
						</PretendardSemiBoldText>
					</HStack>
				))}
			<CancelBtn>
				<PretendardSemiBoldText size={18} lineHeight={23} color={colors.PointGreen1}>
					취소하기
				</PretendardSemiBoldText>
			</CancelBtn>
		</BackgroundGrayScrollView>
	);
}
const TextWall = styled.View`
	width: 3px;
	height: 100%;
	background-color: ${colors.Primary};
	border-radius: 8px;
`;
const CancelBtn = styled.TouchableOpacity`
	width: ${widthPercentage(327)}px;
	height: ${heightPercentage(60)}px;
	border-radius: 8px;
	background-color: rgba(255, 90, 77, 0.2);
	align-items: center;
	justify-content: center;
	margin-top: 30px;
	margin-bottom: 30px;
`;
