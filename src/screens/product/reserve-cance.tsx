import {useRoute} from '@react-navigation/native';
import {useAppDispatch} from '../../redux';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {bookingCancel, tossCancel} from '../../redux/travel-info/travel.slice';
import {colors} from '../../utill/colors';
import RouteButton from '../../utill/component/route-button';
import {BackgroundGrayScrollView, HStack, PretendardSemiBoldText, VStack} from '../../utill/layout/layout';
import {MarginContainder} from '../enroll-info/select-multi';
import {TextWall} from './reserve-detail';

export default function ReserveCancel({navigation}: any) {
	const route = useRoute();
	const dispatch = useAppDispatch();
	const {info, detailInfo, tossKey} = route.params;
	const handleCheck = () => {
		dispatch(
			modalSliceActions.setOpenModal({
				modalTitle: '취소하시겠습니까?',
				modalSubTitle: '수수료를 확인하세요',
				modalFunction: handleCancel,
				modalTopText: '네,취소할래요',
				modalBottomText: '아니요, 생각해볼게요',
			}),
		);
	};
	const handleCancel = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			const a = await dispatch(bookingCancel(info?.order_no)).unwrap();
			await dispatch(
				tossCancel({
					paymentKey: tossKey,
					cancelAmount: info?.total_price - info?.cancel_fee,
				}),
			);
			navigation.goBack();
			navigation.goBack();
		} catch (e) {
			console.log(e);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	if (!info) return <></>;
	return (
		<>
			<BackgroundGrayScrollView>
				<HStack deco='margin-bottom:40px;'>
					<VStack gap={10}>
						<PretendardSemiBoldText size={18} lineHeight={23} color={colors.Black}>
							{detailInfo?.product_summary?.prod_name}
						</PretendardSemiBoldText>
						<PretendardSemiBoldText size={14} lineHeight={20} color={colors.Gray3}>
							{detailInfo?.package_summary?.pkg_name}
						</PretendardSemiBoldText>
						<PretendardSemiBoldText size={14} lineHeight={20} color={colors.Gray3}>
							{info?.skus?.[0]?.qty}
							{detailInfo?.item_summary?.unit}
						</PretendardSemiBoldText>
					</VStack>
				</HStack>
				<HStack gap={5}>
					<TextWall />
					<PretendardSemiBoldText size={18} lineHeight={23} color={colors.Black}>
						취소 규정
					</PretendardSemiBoldText>
				</HStack>

				{/* 수수료 설명 */}
				{detailInfo?.package_summary?.description_module_for_render?.PMDL_REFUND_POLICY?.content?.properties
					?.policy_type && (
					<PretendardSemiBoldText size={16} lineHeight={20} color={colors.Black} style={{marginTop: 16}}>
						{
							detailInfo?.package_summary?.description_module_for_render?.PMDL_REFUND_POLICY?.content
								?.properties?.policy_type?.title
						}
					</PretendardSemiBoldText>
				)}
				{detailInfo?.package_summary?.description_module_for_render?.PMDL_REFUND_POLICY?.content?.properties
					?.policy_type?.desc && (
					<PretendardSemiBoldText size={14} lineHeight={20} color={colors.Gray400} style={{marginTop: 4}}>
						{
							detailInfo?.package_summary?.description_module_for_render?.PMDL_REFUND_POLICY?.content
								?.properties?.policy_type?.desc
						}
					</PretendardSemiBoldText>
				)}

				{/* 정책 내용 */}
				{detailInfo?.package_summary?.description_module_for_render?.PMDL_REFUND_POLICY?.content?.properties
					?.policy_type?.title && (
					<PretendardSemiBoldText size={16} lineHeight={20} color={colors.Black} style={{marginTop: 16}}>
						{
							detailInfo?.package_summary?.description_module_for_render?.PMDL_REFUND_POLICY?.content
								?.properties?.partial_refund?.title
						}
					</PretendardSemiBoldText>
				)}
				{detailInfo?.package_summary?.description_module_for_render?.PMDL_REFUND_POLICY?.content?.properties?.partial_refund?.list?.map(
					(item, index) => (
						<PretendardSemiBoldText
							key={index}
							size={14}
							lineHeight={20}
							color={colors.Gray400}
							style={{marginTop: index === 0 ? 8 : 4}}>
							• {item.desc}
						</PretendardSemiBoldText>
					),
				)}

				<HStack justifyContent='space-between' deco='margin-top:20px;'>
					<PretendardSemiBoldText size={20} lineHeight={25} color={colors.Black}>
						취소일
					</PretendardSemiBoldText>
					<PretendardSemiBoldText size={18} lineHeight={23} color={colors.Black}>
						취소 수수료
					</PretendardSemiBoldText>
				</HStack>
				{detailInfo?.policy_list?.map(item => (
					<HStack justifyContent='space-between' deco='margin-top:20px;'>
						<PretendardSemiBoldText size={15} lineHeight={25} color={colors.Black}>
							{item?.s_date} ~ {item?.e_date}
						</PretendardSemiBoldText>
						<PretendardSemiBoldText size={18} lineHeight={23} color={colors.Black}>
							{item?.percent}%
						</PretendardSemiBoldText>
					</HStack>
				))}
				<HStack deco='margin-top:40px;' gap={5}>
					<TextWall />
					<PretendardSemiBoldText size={18} lineHeight={23} color={colors.Black}>
						환불 안내
					</PretendardSemiBoldText>
				</HStack>
				<HStack justifyContent='space-between' deco='margin-top:20px;'>
					<PretendardSemiBoldText size={20} lineHeight={25} color={colors.Gray2}>
						총금액
					</PretendardSemiBoldText>
					<PretendardSemiBoldText size={18} lineHeight={23} color={colors.Black}>
						{info?.total_price.toLocaleString('ko')}원
					</PretendardSemiBoldText>
				</HStack>
				<HStack justifyContent='space-between' deco='margin-top:20px;'>
					<PretendardSemiBoldText size={20} lineHeight={25} color={colors.Gray2}>
						취소 수수료
					</PretendardSemiBoldText>
					<PretendardSemiBoldText size={18} lineHeight={23} color={colors.Black}>
						{info?.cancel_fee.toLocaleString('ko')}원
					</PretendardSemiBoldText>
				</HStack>
				<HStack justifyContent='space-between' deco='margin-top:30px;'>
					<PretendardSemiBoldText size={20} lineHeight={25} color={colors.Black}>
						환불 금액
					</PretendardSemiBoldText>
					<PretendardSemiBoldText size={18} lineHeight={23} color={colors.PointYellow}>
						{(info?.total_price - info?.cancel_fee).toLocaleString('ko')}원
					</PretendardSemiBoldText>
				</HStack>
				<MarginContainder />
			</BackgroundGrayScrollView>
			<RouteButton
				navigation={navigation}
				nextTitle='RecommendSelectTour'
				goNext={() => {}}
				btnFunction={handleCheck}
				bgColor={'rgba(255, 90, 77, 0.2)'}
				nextText={'취소하기'}></RouteButton>
		</>
	);
}
