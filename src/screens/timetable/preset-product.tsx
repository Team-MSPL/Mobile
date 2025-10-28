import {useEffect, useState} from 'react';
import {Modal, TouchableOpacity} from 'react-native';
import {styled} from 'styled-components/native';
import {logEvent} from '../../../firebaseAnalytice';
import {useAppSelector} from '../../redux';
import {colors} from '../../utill/colors';
import StepText from '../../utill/component/enroll-info/step-text';
import PrimaryButton from '../../utill/component/primary-button';
import {useBackHandler} from '../../utill/hooks/useBackhandler';
import {
	BackgroundGrayScrollView,
	HStack,
	PretendardSemiBoldText,
	PretendardVariableText,
	VStack,
} from '../../utill/layout/layout';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {
	SVGDanimLogo,
	SVGEmptyHeart,
	SVGFilter,
	SVGHeart,
	SVGRightAdd,
	SVGStarSmile,
	SvgStart,
} from '../../utill/svg/svg';
import {ModalBackground, ModalBottomSheet} from '../enroll-info/planner/regist-transit';
import {BottomContainer} from '../enroll-info/search-place';
import {ElementContainer, SVGContainer} from '../enroll-info/select-multi';
import {MarginContainer} from './preset-detail';

export default function PresetProduct({navigation}: any) {
	const {presetProducts} = useAppSelector(state => state.travelSlice);
	const {userName} = useAppSelector(state => state.userSlice);
	const handleSkip = () => {
		// navigation.navigate('Timetable');
		navigation.goBack();
	};
	const handelDetail = item => {
		navigation.navigate('ProductDetail', {item: item});
	};
	const [products, setProducts] = useState(presetProducts.flat() || []);
	const [categoryVisible, setCategoryVisible] = useState(false);
	const [categoryValue, setCategoryValue] = useState('추천순');

	const handleGoogleAnalyticsProduct = async () => {
		await logEvent(`presetProductList`, {});
	};

	useEffect(() => {
		handleGoogleAnalyticsProduct();
	}, []);
	useBackHandler({type: 'product'});
	const handleCategory = (e: string) => {
		let copy = [...products];
		products.map(item => console.log(item.avgPrefScore));
		switch (e) {
			case '추천순':
				copy = copy.sort((a, b) => {
					if (b.avgPrefScore === undefined) return -1;
					if (a.avgPrefScore === undefined) return 1;
					return b.avgPrefScore - a.avgPrefScore;
				});
				break;
			case '낮은 가격순':
				copy = copy.sort((a, b) => a.b2b_price - b.b2b_price);
				break;
			case '높은 가격순':
				copy = copy.sort((a, b) => b.b2b_price - a.b2b_price);
				break;
			case '낮은 평점순':
				copy = copy.sort((a, b) => a.avg_rating_star - b.avg_rating_star);
				break;
			case '높은 평점순':
				copy = copy.sort((a, b) => b.avg_rating_star - a.avg_rating_star);
				break;
		}
		setProducts(copy);
		setCategoryValue(e);
		setCategoryVisible(false);
	};
	const viewCategoryList = ['추천순', '높은 가격순', '낮은 가격순', '높은 평점순', '낮은 평점순'];
	return (
		<>
			<BackgroundGrayScrollView>
				<StepText
					marginTop={heightPercentage(10)}
					marginBottom={heightPercentage(10)}
					styleText='상품 추천'
					mainText={`${userName}님을 위한 맞춤 여행 상품`}
					subText='내 여정과 어울리는 여행 상품을 추천해드려요'></StepText>
				<LowPriceBox>
					<HStack gap={10}>
						<SVGStarSmile />
						<PretendardSemiBoldText size={16} lineHeight={21} color={colors.PointGreen1}>
							최저가로 즐기는 특별한 여행!
						</PretendardSemiBoldText>
					</HStack>
				</LowPriceBox>
				<HStack justifyContent='space-between' deco='margin-bottom:20px;padding:5px;'>
					<PretendardSemiBoldText size={16} lineHeight={21} color={colors.Gray5}>
						총 {presetProducts.flat().length}개
					</PretendardSemiBoldText>
					<HStack gap={10}>
						<TouchableOpacity
							onPress={() => {
								setCategoryVisible(true);
							}}>
							<SVGFilter />
						</TouchableOpacity>
						<FilterBox
							gap={5}
							onPress={() => {
								setCategoryVisible(true);
							}}>
							<PretendardSemiBoldText size={16} lineHeight={21} color={colors.Gray5}>
								{categoryValue}
							</PretendardSemiBoldText>
							<SVGRightAdd transform={90} width={12} height={15} />
						</FilterBox>
					</HStack>
				</HStack>
				{products?.map((item, idx) => (
					<ProductContainer
						key={idx}
						onPress={() => {
							handelDetail(item);
						}}>
						<ProductImage source={{uri: item?.prod_img_url}}></ProductImage>
						{/* <AbsoluteHeart
							onPress={() => {
								handleLike(item?._id);
							}}>
							<SVGEmptyHeart width={25} height={25} color={'white'} />
						</AbsoluteHeart> */}
						<VStack deco='padding:10px;' gap={5}>
							<HStack justifyContent='space-between'>
								{!isNaN(item?.finalScore) && item?.finalScore != 0 ? (
									<HStack gap={3}>
										<PretendardSemiBoldText size={14} lineHeight={17} color={colors.Gray4}>
											유사도
										</PretendardSemiBoldText>
										<PretendardSemiBoldText size={18} lineHeight={22} color={colors.PointYellow}>
											{Math.floor(item?.finalScore * 100)}%
										</PretendardSemiBoldText>
									</HStack>
								) : (
									<HStack gap={3}>
										<SVGDanimLogo width={15} />
										<PretendardSemiBoldText size={14} lineHeight={17} color={colors.Gray4}>
											다님
										</PretendardSemiBoldText>
									</HStack>
								)}

								<HStack>
									<SvgStart width={11} color={'#FFDE4C'} />
									<PretendardSemiBoldText size={14} lineHeight={17} color={colors.Gray4}>
										{item?.avg_rating_star}
									</PretendardSemiBoldText>
								</HStack>
							</HStack>
							<PretendardSemiBoldText
								size={24}
								lineHeight={29}
								numberOfLines={2}
								color={colors.Black}
								deco={'margin-bottom:10px;'}>
								{item?.prod_name}
							</PretendardSemiBoldText>
							{item?.b2c_price - item?.b2b_price > 0 && (
								<>
									<PretendardSemiBoldText
										size={16}
										lineHeight={20}
										color={colors.PointGreen1}
										deco={'text-align:right'}>
										{(item?.b2c_price - item?.b2b_price).toLocaleString('ko-KR')}원 할인
									</PretendardSemiBoldText>
									<PretendardSemiBoldText
										size={20}
										lineHeight={24}
										color={colors.Gray2}
										deco={'text-align:right;text-decoration:line-through;'}>
										{item?.b2c_price.toLocaleString('ko-KR')}원~
									</PretendardSemiBoldText>
								</>
							)}
							<HStack deco='align-self:flex-end' gap={4}>
								<PretendardSemiBoldText size={18} lineHeight={22} color={colors.PointYellow}>
									최저가
								</PretendardSemiBoldText>
								<PretendardSemiBoldText
									size={24}
									lineHeight={29}
									numberOfLines={2}
									color={colors.Black}>
									{item?.b2b_price.toLocaleString('ko-KR')}원~
								</PretendardSemiBoldText>
							</HStack>
							<PretendardSemiBoldText
								size={16}
								lineHeight={21}
								numberOfLines={2}
								color={colors.PointYellow}
								deco={'text-align:center;margin-top:10px;'}>
								상품 자세히 보기 {'>'}
							</PretendardSemiBoldText>
						</VStack>
					</ProductContainer>
				))}
				<MarginContainer />
			</BackgroundGrayScrollView>
			<SkipButton onPress={handleSkip}>
				<PretendardSemiBoldText
					size={16}
					lineHeight={21}
					numberOfLines={2}
					color={colors.backgroundWhite}
					deco={'text-align:center;'}>
					건너뛰기
				</PretendardSemiBoldText>
			</SkipButton>
			<Modal
				animationType={'fade'}
				transparent={true}
				visible={categoryVisible}
				onRequestClose={() => {
					setCategoryVisible(false);
					// setShow(false);
				}}>
				<ModalBackground
					onPress={() => {
						setCategoryVisible(false);
						// setPlaceState(null);
						// clearInput();
					}}>
					<ModalBottomSheet flex={0.4}>
						<VStack gap={20}>
							{viewCategoryList.map((item, idx) => (
								<ModalCategoryBox
									onPress={() => {
										handleCategory(item);
									}}>
									<PretendardVariableText
										size={20}
										lineHeight={25}
										color={colors.Black}
										deco={'text-align:center;'}>
										{item}
									</PretendardVariableText>
								</ModalCategoryBox>
							))}
							<ModalCategoryBox
								onPress={() => {
									setCategoryVisible(false);
								}}>
								<PretendardVariableText
									size={20}
									lineHeight={25}
									color={colors.Gray400}
									deco={'text-align:center;'}>
									취소
								</PretendardVariableText>
							</ModalCategoryBox>
						</VStack>
					</ModalBottomSheet>
				</ModalBackground>
			</Modal>
		</>
	);
}
const ProductContainer = styled.TouchableOpacity`
	width: ${widthPercentage(327)}px;
	min-height: ${heightPercentage(345)}px;
	border-radius: 20px;
	border-color: ${colors.Gray200};
	border-width: 1px;
	background-color: ${colors.backgroundWhite};
	margin-bottom: ${heightPercentage(10)}px;
`;
const ProductImage = styled.Image`
	width: ${widthPercentage(327)}px;
	height: ${heightPercentage(162)}px;
	border-top-left-radius: 20px;
	border-top-right-radius: 20px;
`;
const SkipButton = styled.TouchableOpacity`
	position: absolute;
	width: ${widthPercentage(327)}px;
	height: ${heightPercentage(60)}px;
	border-radius: 8px;
	background-color: ${colors.Gray5};
	align-self: center;
	align-items: center;
	justify-content: center;
	bottom: 10px;
`;
const LowPriceBox = styled.View`
	width: ${widthPercentage(240)}px;
	height: ${heightPercentage(44)}px;
	border-radius: 20px;
	background-color: rgba(255, 90, 77, 0.1);
	align-items: center;
	justify-content: center;
	margin-vertical: 20px;
`;
const FilterBox = styled(HStack).attrs({as: TouchableOpacity})``;

const ModalCategoryBox = styled.TouchableOpacity`
	width: ${widthPercentage(327)}px;
`;
