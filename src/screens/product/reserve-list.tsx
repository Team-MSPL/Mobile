import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';
import {useCallback, useLayoutEffect, useState} from 'react';
import {styled} from 'styled-components/native';
import {logEvent} from '../../../firebaseAnalytice';
import {useAppDispatch} from '../../redux';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {getReserveList} from '../../redux/travel-info/travel.slice';
import {colors} from '../../utill/colors';
import {
	BackgroundGrayScrollView,
	Center,
	HStack,
	PretendardSemiBoldText,
	PretendardVariableText,
} from '../../utill/layout/layout';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {SvgCalendar, SVGPeople} from '../../utill/svg/svg';

export default function ReserveList({navigation}: any) {
	const dispatch = useAppDispatch();
	const [list, setList] = useState([]);
	const handleList = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			const a = await dispatch(getReserveList()).unwrap();
			setList(a.data);
		} catch (e) {
			console.log(e);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	useFocusEffect(
		useCallback(() => {
			handleList();
		}, []),
	);
	// useLayoutEffect(() => {
	// 	handleList();
	// }, []);
	if (list.length == 0)
		return (
			<Center backgroundColor={colors.backgroundWhite}>
				<PretendardVariableText
					size={16}
					lineHeight={21}
					color={colors.Black}
					style={{
						width: '100%',
						textAlign: 'center',
						includeFontPadding: false,
					}}>
					주문 내역이 없습니다!
				</PretendardVariableText>
			</Center>
		);
	return (
		<BackgroundGrayScrollView>
			{list?.map((item, idx) => (
				<ReserveBox
					onPress={async () => {
						console.log({
							order_no: item?.product?.data?.order_no,
							tossKey: item?.product?.booking_key,
						});

						await logEvent(`goReserveDetail`, {order_no: item?.product?.data?.order_no});
						navigation.navigate('ReserveDetail', {
							order_no: item?.product?.data?.order_no,
							tossKey: item?.product?.booking_key,
						});
					}}>
					<ImageBox resizeMode='cover' source={{uri: item?.product?.image}} />
					<ImgPadding>
						<PretendardSemiBoldText size={20} lineHeight={25} color={colors.Black}>
							{item?.product?.name}
						</PretendardSemiBoldText>
						<HStack justifyContent='space-between'>
							<HStack>
								<SvgCalendar />
								<PretendardSemiBoldText
									size={16}
									lineHeight={21}
									color={colors.Black}
									deco={'margin-top:10px;margin-bottom:10px;'}>
									{moment(item?.s_date)?.format('YYYY-MM-DD')}
								</PretendardSemiBoldText>
							</HStack>
							<HStack>
								<SVGPeople />
								<PretendardSemiBoldText
									size={18}
									lineHeight={23}
									color={colors.Black}
									deco={'margin-top:10px;margin-bottom:10px;'}>
									갯수 {item?.skus[0]?.qty}
								</PretendardSemiBoldText>
							</HStack>
						</HStack>
					</ImgPadding>
				</ReserveBox>
			))}
		</BackgroundGrayScrollView>
	);
}
const ReserveBox = styled.TouchableOpacity`
	width: ${widthPercentage(327)}px;
	min-height: ${heightPercentage(150)}px;
	border-radius: 12px;
	border-width: 1px;
	border-color: ${colors.Gray1};
	margin-bottom: 20px;
`;
const ImgPadding = styled.View`
	width: ${widthPercentage(327)}px;
	padding: 20px;
`;
const ImageBox = styled.Image`
	width: ${widthPercentage(327)}px;
	min-height: ${heightPercentage(125)}px;
	border-top-left-radius: 12px;
	border-top-right-radius: 12px;
`;
