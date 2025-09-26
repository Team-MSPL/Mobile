import {useRoute} from '@react-navigation/native';
import {styled} from 'styled-components/native';
import {colors} from '../../utill/colors';
import RouteButton from '../../utill/component/route-button';
import {
	BackgroundGrayScrollView,
	Divider,
	HStack,
	ImageBox,
	PretendardBoldText,
	PretendardSemiBoldText,
	PretendardVariableText,
	VStack,
} from '../../utill/layout/layout';
import {widthPercentage} from '../../utill/layout/responsive-size';
import {SVGGlobal, SVGHeart, SvgRight, SVGRightAdd, SvgShare, SvgShare1} from '../../utill/svg/svg';
import {MarginContainer} from '../timetable/preset-detail';

export default function ProductDetail({navigation}: any) {
	const route = useRoute();
	const {item}: any = route.params;
	return (
		<>
			<Container>
				<ImageBox
					width={widthPercentage(375)}
					height={widthPercentage(282)}
					source={{uri: item?.prod_img_url}}></ImageBox>
				<PaddingContainer>
					{/* <HStack justifyContent='space-between' alignItems='center'>
					<VStack style={{flex: 1}}>
						{!isNaN(item?.product?.similarity) && (
							<PretendardBoldText size={14} lineHeight={21.6} color={colors.PointYellow}>
								유사도
								<PretendardBoldText size={15} lineHeight={19} color={colors.PointYellow}>
									{item?.product?.similarity * 100}%
								</PretendardBoldText>
							</PretendardBoldText>
						)}
					</VStack>
					<HStack deco='gap:20px;'>
						<SVGHeart width={widthPercentage(30)} height={widthPercentage(30)} />
						<SvgShare1 width={widthPercentage(26)} height={widthPercentage(26)} />
					</HStack>
				</HStack> */}
					<PretendardSemiBoldText size={24} lineHeight={29} numberOfLines={2} color={colors.Black}>
						{item?.prod_name}
					</PretendardSemiBoldText>
					<PretendardSemiBoldText
						size={24}
						lineHeight={29}
						numberOfLines={2}
						color={colors.Black}
						deco={'margin-top:30px;margin-bottom:40px;'}>
						₩ {item?.b2b_price.toLocaleString('ko-KR')}원 ~
					</PretendardSemiBoldText>
					{item?.koreanGuide ? (
						<HStack gap={3}>
							<SVGGlobal />
							<PretendardSemiBoldText size={16} lineHeight={21} numberOfLines={2} color={colors.Black}>
								한국어 지원 {item.koreanGuide === 'N' ? '불가' : '가능'}
							</PretendardSemiBoldText>
						</HStack>
					) : null}

					<Divider color={colors.Gray200} height={2} />
					<PretendardVariableText size={18} lineHeight={23} color={colors.Black}>
						{item?.introduction}
					</PretendardVariableText>

					{/* <PretendardBoldText size={28} lineHeight={32} color={colors.Black}>
					{item?.product?.sellingProductName}
				</PretendardBoldText>
				<PretendardBoldText size={18} lineHeight={22} color={colors.Gray4}>
					{item?.product?.sellingProductContent}
				</PretendardBoldText>
				<PretendardBoldText
					size={28}
					lineHeight={32}
					color={colors.Black}
					deco={'margin-left:auto;margin-top:30px;'}>
					{item?.product?.sellingProductPrice}원~
				</PretendardBoldText>
				<HStack gap={10}>
					<PretendardBoldText size={18} lineHeight={22} color={colors.PointYellow}>
						★{item?.product?.sellingProductRating}({item?.product?.sellingProductReviewCount})
					</PretendardBoldText>
					<SVGRightAdd color={colors.PointYellow}></SVGRightAdd>
				</HStack> */}
					{/* <UnderLineTextBox>
					<PretendardBoldText size={25} lineHeight={29} color={colors.Black}>
						상품 소개
					</PretendardBoldText>
					<BottomBorder />
				</UnderLineTextBox> */}
				</PaddingContainer>
				<MarginContainer />
			</Container>
			<RouteButton
				navigation={navigation}
				type={'planner'}
				nextText={'예약하기'}
				goNext={() => {
					console.log('qwe');
				}}
				nextTitle='RecommendSelectTour'></RouteButton>
		</>
	);
}
const Container = styled.ScrollView``;
const PaddingContainer = styled.View`
	padding: ${widthPercentage(20)}px ${widthPercentage(17)}px;
	gap: ${widthPercentage(10)}px;
`;
const UnderLineTextBox = styled.View`
	align-self: flex-start;
`;

const BottomBorder = styled.View`
	height: 10px;
	background-color: ${colors.Green4};
	border-radius: 12px;
	margin-top: 2px;
`;
