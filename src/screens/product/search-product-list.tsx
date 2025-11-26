import {useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Modal, TouchableOpacity, FlatList} from 'react-native';
import {styled} from 'styled-components/native';
import {logEvent} from '../../../firebaseAnalytice';
import {useAppDispatch, useAppSelector} from '../../redux';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {recommendProduct} from '../../redux/travel-info/travel.slice';
import {colors} from '../../utill/colors';
import StepText from '../../utill/component/enroll-info/step-text';
import {
	BackgroundGray,
	HStack,
	PretendardSemiBoldText,
	PretendardVariableText,
	VStack,
} from '../../utill/layout/layout';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {SVGDanimLogo, SVGFilter, SvgRight, SVGRightAdd, SvgStart} from '../../utill/svg/svg';
import {ModalBackground, ModalBottomSheet} from '../enroll-info/planner/regist-transit';

export default function SearchProductList({navigation}: any) {
	const {tendency, season, region, country} = useAppSelector(state => state.travelSlice);
	const route = useRoute();
	const handelDetail = async item => {
		await logEvent(`search_${route.params?.trigger ?? 'preset'}_ProductDetail`, {item: item});
		navigation.navigate('ProductDetail', {item: item});
	};
	const [products, setProducts] = useState([]);
	const [categoryVisible, setCategoryVisible] = useState(false);
	const [categoryValue, setCategoryValue] = useState('추천순');

	const handleGoogleAnalyticsProduct = async () => {
		await logEvent(`searchProductList`, {title: route?.params?.title, country: country});
	};
	const countryList = [
		{ko: '한국', en: 'Korea'},
		{ko: '일본', en: 'Japan'},
		{ko: '중국', en: 'China'},
		{ko: '베트남', en: 'Vietnam'},
		{ko: '태국', en: 'Thailand'},
		{ko: '필리핀', en: 'Philippines'},
		{ko: '싱가포르', en: 'Singapore'},
	];
	const productCountRef = useRef(1);
	const sortRef = useRef({sortOption: 'order_count', sortOrder: 'desc'});
	const dispatch = useAppDispatch();
	const handleProduct = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			const data = {
				pathList: [],
				selectList: [...tendency, season],
				country:
					region?.some(r => r?.includes('홍콩')) || region?.some(r => r?.includes('마카오'))
						? '홍콩과 마카오'
						: region[0]?.includes('해외')
						? countryList?.find((check, iidx) => check.en == region[0]?.split('/')[1])?.ko
						: countryList[country].ko, //TODO 홍콩 마카오 처리
				cityList: region,
				mode: 'list', // 추천/목록 모드, 기본값 : 'recommend'
				keyword: route?.params?.title ?? '', // prod_name 검색 - 목록 모드 전용
				page: productCountRef.current, // 페이지 번호 - 목록 모드 전용
				limit: 20, // 페이지당 개수 - 목록 모드 전용
				sortOption: sortRef.current.sortOption, // order_count, b2b_price, avg_rating_star
				sortOrder: sortRef.current.sortOrder, // asc, desc
			};
			const a = await dispatch(recommendProduct(data)).unwrap();
			//!!payload?.page ? payload?.products :
			handleArray(!!a?.page ? a?.products : a);
			productCountRef.current += 1;
			// console.log(a[0]);
		} catch (e) {
			console.log(e);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const handleArray = productList => {
		if (productCountRef.current == 1) {
			setProducts(productList);
			return;
		}
		const map = new Map();
		[...products, ...productList].forEach(p => map.set(p._id, p));
		setProducts([...map.values()]);
	};
	useLayoutEffect(() => {
		handleProduct();
	}, []);
	useEffect(() => {
		handleGoogleAnalyticsProduct();
	}, []);
	const flatListRef = useRef(null);
	const handleCategory = (e: string) => {
		switch (e) {
			case '추천순':
				sortRef.current = {sortOption: 'order_count', sortOrder: 'desc'};
				logEvent('search_order_count_desc', {});
				break;
			case '낮은 가격순':
				sortRef.current = {sortOption: 'b2b_price', sortOrder: 'asc'};
				logEvent('search_b2b_price_asc', {});
				break;
			case '높은 가격순':
				sortRef.current = {sortOption: 'b2b_price', sortOrder: 'desc'};
				logEvent('search_b2b_price_desc', {});
				break;
			case '낮은 평점순':
				sortRef.current = {sortOption: 'avg_rating_star', sortOrder: 'asc'};
				logEvent('search_avg_rating_star_asc', {});
				break;
			case '높은 평점순':
				sortRef.current = {sortOption: 'avg_rating_star', sortOrder: 'desc'};
				logEvent('search_avg_rating_star_desc', {});
				break;
		}
		productCountRef.current = 1;
		handleProduct();
		setCategoryValue(e);
		setCategoryVisible(false);
	};
	const viewCategoryList = ['추천순', '높은 가격순', '낮은 가격순', '높은 평점순', '낮은 평점순'];
	const RenderItem = React.memo(value => {
		let item = value?.item;
		return (
			<ProductContainer
				onPress={() => {
					handelDetail(item);
				}}>
				<ProductImage source={{uri: item?.prod_img_url}}></ProductImage>
				<VStack deco='padding:10px 20px;'>
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
					<HStack deco='align-self:flex-end; margin-top:6px;' gap={4}>
						<PretendardSemiBoldText size={18} lineHeight={22} color={colors.PointYellow}>
							최저가
						</PretendardSemiBoldText>
						<PretendardSemiBoldText size={24} lineHeight={29} numberOfLines={2} color={colors.Black}>
							{item?.b2b_price.toLocaleString('ko-KR')}원~
						</PretendardSemiBoldText>
					</HStack>
				</VStack>
			</ProductContainer>
		);
	});
	const renderItem = useCallback(({item}) => <RenderItem item={item} />, []);
	const [goToTopBtnVisible, setGoToTopBtnVisible] = useState(false);
	const ListHeader = () => {
		return (
			<>
				<StepText
					marginTop={heightPercentage(10)}
					marginBottom={heightPercentage(10)}
					mainText={'"' + route.params?.title + `" 검색 결과입니다.`}></StepText>
				<HStack justifyContent='space-between' deco='margin-bottom:10px;padding:5px;'>
					<PretendardSemiBoldText size={16} lineHeight={21} color={colors.Gray5}></PretendardSemiBoldText>
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
			</>
		);
	};
	return (
		<>
			<BackgroundGray>
				<FlatList
					ref={flatListRef}
					onScroll={e => {
						setGoToTopBtnVisible(e?.nativeEvent.contentOffset.y > 100);
					}}
					ListHeaderComponent={<ListHeader />}
					data={products}
					renderItem={renderItem}
					keyExtractor={(item, index) => item._id ?? String(index)}
					onEndReachedThreshold={0.5}
					onEndReached={() => {
						products.length > 0 && handleProduct();
					}}></FlatList>
			</BackgroundGray>
			{goToTopBtnVisible && (
				<AbsoluteUpButton
					onPress={() => {
						flatListRef?.current?.scrollToOffset({animated: true, offset: 0});
					}}>
					<SvgRight transform={-90} color={colors.grey500} />
				</AbsoluteUpButton>
			)}
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
const FilterBox = styled(HStack).attrs({as: TouchableOpacity})``;

const ModalCategoryBox = styled.TouchableOpacity`
	width: ${widthPercentage(327)}px;
`;
const AbsoluteUpButton = styled.TouchableOpacity`
	width: ${widthPercentage(50)}px;
	height: ${widthPercentage(50)}px;
	border-radius: 99px;
	background-color: ${colors.grey200};
	position: absolute;
	bottom: 40px;
	align-self: center;
	align-items: center;
	justify-content: center;
	border-color: ${colors.grey500};
`;
