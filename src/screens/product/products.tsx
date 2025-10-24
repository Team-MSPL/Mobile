import {useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {styled} from 'styled-components/native';
import {logEvent} from '../../../firebaseAnalytice';
import {useAppSelector} from '../../redux';
import {colors} from '../../utill/colors';
import {useBackHandler} from '../../utill/hooks/useBackhandler';
import {
	BackgroundGray,
	BackgroundGrayScrollView,
	Divider,
	HStack,
	PretendardBoldText,
	VStack,
	PretendardVariableText,
} from '../../utill/layout/layout';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';

export default function Products({navigation}: any) {
	const {userName} = useAppSelector(state => state.userSlice);
	const {recommendProducts} = useAppSelector(state => state.travelSlice);
	const handleNext = async (item: any) => {
		await logEvent(`productList`, {title: item?.product?.sellingProductContent});
		navigation.navigate('ProductDetail', {item});
	};
	const handleGoogleAnalyticsProduct = async () => {
		await logEvent(`productList`, {});
	};

	useEffect(() => {
		handleGoogleAnalyticsProduct();
	}, []);
	return (
		<BackgroundGray>
			<FlatList
				data={recommendProducts}
				showsVerticalScrollIndicator={false}
				numColumns={1}
				contentContainerStyle={{
					paddingBottom: 40,
				}}
				ListHeaderComponent={
					<>
						<PretendardBoldText size={14} lineHeight={21.6} color={colors.Gray4}>
							상품 추천
						</PretendardBoldText>
						<PretendardBoldText size={23} lineHeight={27} color={colors.Primary}>
							나그네
							<PretendardBoldText size={23} lineHeight={27} color={colors.Black}>
								{' '}
								님을 위한 맞춤 여행 상품
							</PretendardBoldText>
						</PretendardBoldText>
						<PretendardBoldText size={15} lineHeight={21.6} color={colors.Gray4}>
							내 여정과 어울리는 여행 상품을 추천해드려요
						</PretendardBoldText>
						<HStack>
							<PretendardBoldText size={13} lineHeight={18} color={colors.Black}>
								검색 결과 총 {recommendProducts.length}개
							</PretendardBoldText>
						</HStack>
						<Divider height={1} color={colors.Gray3} />
					</>
				}
				// columnWrapperStyle={{
				// 	gap: widthPercentage(14),
				// 	marginBottom: 10,
				// }}
				renderItem={({item}) => {
					return (
						<ProductTouchable marginVertical={heightPercentage(10)} onPress={() => handleNext(item)}>
							<EventImage source={{uri: item?.product?.sellingProductImage[0]}}></EventImage>
							<VStack
								flex={1}
								deco={`margin-left:${widthPercentage(5)};height:${widthPercentage(
									141,
								)}px;padding:10px 0px;`}>
								<VStack>
									<PretendardBoldText size={13} lineHeight={18} color={colors.Gray4}>
										유사도
										{!isNaN(item?.product?.similarity) && (
											<PretendardBoldText size={15} lineHeight={19} color={colors.PointYellow}>
												{Math.floor(item?.product?.similarity * 100)}%
											</PretendardBoldText>
										)}
									</PretendardBoldText>
									<PretendardBoldText size={13} lineHeight={18} color={colors.Black}>
										{item?.product?.sellingProductType == 'tour' ? '투어상품' : '패키지상품'}
										<PretendardBoldText size={13} lineHeight={18} color={colors.PointGreen1}>
											★{item?.product?.sellingProductRating}(
											{item?.product?.sellingProductReviewCount})
										</PretendardBoldText>
									</PretendardBoldText>
									<PretendardVariableText
										size={12}
										lineHeight={16}
										color={colors.Black}
										numberOfLines={1}>
										{item?.product?.sellingProductContent}
									</PretendardVariableText>
								</VStack>
								<PretendardBoldText
									style={{marginTop: 'auto'}}
									size={13}
									lineHeight={18}
									color={colors.Black}>
									{item?.product?.sellingProductPrice}원~
								</PretendardBoldText>
							</VStack>
						</ProductTouchable>
					); // 실제 카드 컴포넌트 렌더
				}}
			/>
		</BackgroundGray>
	);
}
const ProductTouchable = styled(HStack).attrs({as: TouchableOpacity})``;
const EventImage = styled.Image`
	width: ${widthPercentage(155)}px;
	height: ${widthPercentage(141)}px;
	object-fit: fill;
	border-radius: 2px;
`;
