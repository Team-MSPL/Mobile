import {useRoute} from '@react-navigation/native';
import RenderHTML from 'react-native-render-html';
import {styled} from 'styled-components/native';
import {logEvent} from '../../../firebaseAnalytice';
import {useAppDispatch} from '../../redux';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {resetAll} from '../../redux/product/bookingSlice';
import {colors} from '../../utill/colors';
import RouteButton from '../../utill/component/route-button';
import {
	BackgroundGrayScrollView,
	HStack,
	PretendardSemiBoldText,
	PretendardVariableText,
} from '../../utill/layout/layout';
import {fontPercentage, heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
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
	const dispatch = useAppDispatch();
	const handleNext = async (e: any) => {
		dispatch(resetAll());
		await logEvent(`PackageDetail`, {title: data?.prod?.prod_name, pkgName: e?.pkg_name});
		navigation.navigate('ProductSelectSpec', {
			image: data?.prod?.img_list[0],
			name: e?.pkg_name,
			prod_no: data?.prod?.prod_no,
			pkg_no: e?.pkg_no,
			go_date_setting: data?.prod?.go_date_setting,
		});
	};
	return (
		<BackgroundGrayScrollView>
			<HStack deco={'margin-bottom:20px;margin-top:10px;'}>
				<PretendardSemiBoldText size={24} lineHeight={28} numberOfLines={2} color={colors.Black}>
					옵션선택
				</PretendardSemiBoldText>
				<PretendardVariableText size={14} lineHeight={18} numberOfLines={2} color={colors.PointGreen1}>
					{' '}
					(필수)
				</PretendardVariableText>
			</HStack>
			{data?.pkg?.map((item, idx) => (
				<PackageBox
					onPress={() => {
						handleNext(item);
					}}>
					<PretendardSemiBoldText size={22} lineHeight={26} color={colors.Black}>
						{item?.pkg_name}
					</PretendardSemiBoldText>
					{item?.description_module?.PMDL_PACKAGE_DESC?.content?.list?.map((explainItem, explainIndex) => (
						<RenderHTML
							baseStyle={{color: colors.Gray3, fontSize: fontPercentage(16)}}
							contentWidth={widthPercentage(327)}
							source={{html: explainItem?.desc}}
						/>
					))}
					<HStack justifyContent='space-between'>
						<PretendardSemiBoldText
							size={22}
							lineHeight={26}
							numberOfLines={2}
							color={colors.Black}
							deco={'text-align:right;'}>
							{item?.b2b_min_price.toLocaleString('ko-KR')}원
						</PretendardSemiBoldText>
						<ChoiceButton
							onPress={() => {
								handleNext(item);
							}}>
							<PretendardSemiBoldText size={16} lineHeight={20} color={colors.Gray5}>
								선택하기
							</PretendardSemiBoldText>
						</ChoiceButton>
					</HStack>
				</PackageBox>
			))}
		</BackgroundGrayScrollView>
	);
}
const PackageBox = styled.TouchableOpacity`
	width: ${widthPercentage(327)}px;
	background-color: ${colors.backgroundGray};
	border-radius: 12px;
	padding: 20px 15px;
	margin-bottom: 10px;
`;
const ChoiceButton = styled.Pressable`
	width: ${widthPercentage(100)}px;
	height: ${heightPercentage(40)}px;
	border-radius: 8px;
	background-color: ${colors.PrimarySecondary};
	align-items: center;
	justify-content: center;
`;
