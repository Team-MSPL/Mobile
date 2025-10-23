import {useRoute} from '@react-navigation/native';
import RenderHTML from 'react-native-render-html';
import {styled} from 'styled-components/native';
import {logEvent} from '../../../firebaseAnalytice';
import {useAppDispatch} from '../../redux';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {colors} from '../../utill/colors';
import RouteButton from '../../utill/component/route-button';
import {BackgroundGrayScrollView, PretendardSemiBoldText} from '../../utill/layout/layout';
import {widthPercentage} from '../../utill/layout/responsive-size';
import {MarginContainer} from '../timetable/preset-detail';

export default function PackageSelect({navigation}: any) {
	const route = useRoute();
	const {data}: any = route.params;
	// const dispatch=useAppDispatch()
	// const handlePackage=async()=>{
	//     try{
	//         dispatch(LoadingSliceActions.onLoading());
	//         dispa
	//     }
	// }
	const handleNext = async (e: any) => {
		await logEvent(`PackageDetail`, {title: data?.prod?.prod_name, pkgName: e?.pkg_name});
		navigation.navigate('ProductSelectDay', {
			image: data?.prod?.img_list[0],
			name: e?.pkg_name,
			prod_no: data?.prod?.prod_no,
			pkg_no: e?.pkg_no,
			go_date_setting: data?.prod?.go_date_setting,
		});
	};
	return (
		<BackgroundGrayScrollView>
			<PretendardSemiBoldText
				size={22}
				lineHeight={26}
				numberOfLines={2}
				color={colors.Black}
				deco={'margin-bottom:20px;margin-top:10px;'}>
				옵션선택
			</PretendardSemiBoldText>
			{data?.pkg?.map((item, idx) => (
				<PackageBox
					onPress={() => {
						handleNext(item);
					}}>
					<PretendardSemiBoldText size={22} lineHeight={26} numberOfLines={2} color={colors.Black}>
						{item?.pkg_name}
					</PretendardSemiBoldText>
					{item?.b2c_min_price - item?.b2b_min_price > 0 && (
						<>
							<PretendardSemiBoldText
								size={16}
								lineHeight={20}
								color={colors.PointGreen1}
								deco={'text-align:right'}>
								{(item?.b2c_min_price - item?.b2b_min_price).toLocaleString('ko-KR')}원 할인
							</PretendardSemiBoldText>
							<PretendardSemiBoldText
								size={20}
								lineHeight={24}
								color={colors.Gray2}
								deco={'text-align:right;text-decoration:line-through;'}>
								{item?.b2c_min_price.toLocaleString('ko-KR')}원~
							</PretendardSemiBoldText>
						</>
					)}
					<PretendardSemiBoldText
						size={24}
						lineHeight={29}
						numberOfLines={2}
						color={colors.Black}
						deco={'text-align:right;'}>
						{item?.b2b_min_price.toLocaleString('ko-KR')}원~
					</PretendardSemiBoldText>
					{item?.description_module?.PMDL_PACKAGE_DESC?.content?.list?.map((explainItem, explainIndex) => (
						<RenderHTML contentWidth={widthPercentage(327)} source={{html: explainItem?.desc}} />
					))}
				</PackageBox>
			))}
		</BackgroundGrayScrollView>
	);
}
const PackageBox = styled.TouchableOpacity`
	width: ${widthPercentage(327)}px;
	border-width: 1px;
	border-color: ${colors.Gray200};
	border-radius: 12px;
	padding: 10px 15px;
	margin-bottom: 10px;
`;
