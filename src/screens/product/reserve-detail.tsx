import {useRoute} from '@react-navigation/native';
import moment from 'moment';
import {useEffect, useState} from 'react';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import {styled} from 'styled-components/native';
import {useAppDispatch} from '../../redux';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {
	bookingCancel,
	handleOrderDtl,
	handleOrderDtlInfo,
	voucherDownload,
	voucherList,
} from '../../redux/travel-info/travel.slice';
import {colors} from '../../utill/colors';
import {BackgroundGrayScrollView, FlexWrap, HStack, PretendardSemiBoldText, VStack} from '../../utill/layout/layout';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {SvgCalendar, SVGClock, SVGPeople} from '../../utill/svg/svg';
import RNFS from 'react-native-fs';
import {openSettings} from 'react-native-permissions';
import {modalSliceActions} from '../../redux/modal/modalSlice';

export default function ReserveDetail({navigation}: any) {
	const dispatch = useAppDispatch();
	const route = useRoute();
	const {order_no, tossKey} = route.params;
	const [info, setInfo] = useState(null);
	const [detailInfo, setDetailInfo] = useState(null);
	const [vouchersList, setVouchersList] = useState(null);
	// const [voucherDown, setVouchersDown] = useState(null);
	const handleDetail = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			const a = await dispatch(handleOrderDtl(order_no)).unwrap();
			const q = await dispatch(handleOrderDtlInfo(order_no)).unwrap();
			const z = await dispatch(voucherList(order_no)).unwrap();
			// const e = await dispatch(
			// 	voucherDownload({order_no: order_no, order_file_id: z.file[0].order_file_id, is_swipe: true}),
			// ).unwrap();
			setInfo(a.data);
			setDetailInfo(q.data);
			setVouchersList(z?.file);
			// setVouchersDown(e.data);
			console.log(tossKey);
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

	const requestStoragePermission = async () => {
		try {
			const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
				title: '저장 공간 접근 권한',
				message: '바우처를 저장하기 위해 접근 권한이 필요합니다.',
				buttonNeutral: '나중에',
				buttonNegative: '거부',
				buttonPositive: '허용',
			});
			return granted === PermissionsAndroid.RESULTS.GRANTED;
		} catch (err) {
			console.warn(err);
			return false;
		}
	};

	const downloadVoucher = async (value: any) => {
		// 1. Android인 경우 권한 확인 및 요청
		if (Platform.OS === 'android') {
			const hasPermission = await requestStoragePermission();
			if (!hasPermission) {
				// Alert.alert('권한 거부', '파일을 저장하기 위한 권한이 거부되었습니다.');
				await openSettings();
				return;
			}
		}
		const voucherDown = await dispatch(
			voucherDownload({order_no: order_no, order_file_id: value?.order_file_id, is_swipe: true}),
		).unwrap();

		// 2. Base64 문자열과 파일 이름 설정
		const base64String = voucherDown?.file[0]?.encode_str;
		const fileName = voucherDown?.file[0]?.file_name;

		// 3. 플랫폼에 따른 저장 경로 설정
		// Android: Download 폴더 / iOS: Documents 폴더
		const downloadDir = Platform.select({
			ios: RNFS.DocumentDirectoryPath,
			android: RNFS.DownloadDirectoryPath,
		});

		const path = `${downloadDir}/${fileName}`;

		// 4. Base64 문자열을 파일로 저장
		try {
			// 'base64' 인코딩 타입을 명시하면 라이브러리가 알아서 디코딩 후 저장합니다.
			await RNFS.writeFile(path, base64String, 'base64');

			Alert.alert('다운로드 완료', `바우처가 다음 경로에 저장되었습니다:\n${path}`);
			console.log('File saved to', path);
		} catch (error) {
			Alert.alert('다운로드 실패', '파일을 저장하는 중 오류가 발생했습니다.');
			console.error(error);
		}
	};
	// const handleCheck=()=>{
	//     dispatch(modalSliceActions.setOpenModal({
	//         modalTitle:"취소하시겠습니까?",
	//         modalSubTitle:'환불시 수수료를 확인하세요'
	//     }))
	// }
	const handelCancel = async () => {
		try {
			navigation.navigate('ReserveCancel', {info: info, detailInfo: detailInfo, tossKey: tossKey});
			// dispatch(LoadingSliceActions.onLoading());
			// const a = await dispatch(bookingCancel(order_no)).unwrap();
			// console.log(a);
			// navigation.goBack();
		} catch (e) {
			console.log(e);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
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

			{info?.has_voucher && (
				<VStack>
					<HStack gap={5} deco={'margin-top:30px;'}>
						<TextWall />
						<PretendardSemiBoldText size={20} lineHeight={25} color={colors.Black}>
							바우처
						</PretendardSemiBoldText>
					</HStack>
					{vouchersList?.map((item, idx) => (
						<HStack justifyContent='space-between' deco='margin-top:20px;'>
							<PretendardSemiBoldText
								size={20}
								lineHeight={25}
								numberOfLines={2}
								color={colors.Gray2}
								deco={'width:200px;'}>
								{item?.file_name}
							</PretendardSemiBoldText>
							<DownBtn>
								<PretendardSemiBoldText
									size={18}
									lineHeight={23}
									color={colors.Black}
									onPress={() => {
										downloadVoucher(item);
									}}>
									다운로드
								</PretendardSemiBoldText>
							</DownBtn>
						</HStack>
					))}
				</VStack>
			)}
			<CancelBtn disabled={!info?.can_cancel} onPress={handelCancel}>
				<PretendardSemiBoldText size={18} lineHeight={23} color={colors.PointGreen1}>
					{info?.can_cancel ? '취소하기' : '취소불가'}
				</PretendardSemiBoldText>
			</CancelBtn>
		</BackgroundGrayScrollView>
	);
}
export const TextWall = styled.View`
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
const DownBtn = styled.TouchableOpacity`
	width: ${widthPercentage(100)}px;
	height: ${heightPercentage(60)}px;
	border-radius: 8px;
	align-items: center;
	justify-content: center;
	background-color: ${colors.Primary};
`;
