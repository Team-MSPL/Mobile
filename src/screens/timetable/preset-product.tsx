import {useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {ActivityIndicator, ScrollView} from 'react-native';
import {Modal, TouchableOpacity, FlatList, TextInput, Keyboard} from 'react-native';
import {styled} from 'styled-components/native';
import {logEvent} from '../../../firebaseAnalytice';
import {useAppDispatch, useAppSelector} from '../../redux';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {recommendProduct, travelSliceActions} from '../../redux/travel-info/travel.slice';
import {colors} from '../../utill/colors';
import {cityViewList} from '../../utill/component/enroll-info/city-list';
import StepText from '../../utill/component/enroll-info/step-text';
import RouteButton from '../../utill/component/route-button';
import {useBackHandler} from '../../utill/hooks/useBackhandler';
import {
	BackgroundGray,
	HStack,
	PretendardSemiBoldText,
	PretendardVariableText,
	VStack,
} from '../../utill/layout/layout';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {SVGDanimLogo, SVGFilter, SvgRight, SVGRightAdd, SVGSearch, SVGStarSmile, SvgStart} from '../../utill/svg/svg';
import {ModalBackground, ModalBottomSheet} from '../enroll-info/planner/regist-transit';
import {RegionTextInput, RegionTextInputContainer} from '../enroll-info/region-recommend/select-distance';
import {CityItems, WrapContainer} from '../enroll-info/select-city';
import {MarginContainer} from './preset-detail';

export default function PresetProduct({navigation}: any) {
	const {timetable, tendency, season, region, country} = useAppSelector(state => state.travelSlice);
	const route = useRoute();
	const handleSkip = async () => {
		await logEvent(`presetProductSkip`, {});
		// navigation.navigate('Timetable');
		navigation.goBack();
	};
	const handelDetail = async item => {
		await logEvent(`${route.params?.trigger ?? 'preset'}_ProductDetail`, {item: item});
		navigation.navigate('ProductDetail', {item: item});
	};
	const [products, setProducts] = useState([]);
	const [categoryVisible, setCategoryVisible] = useState(false);
	const [categoryValue, setCategoryValue] = useState('추천순');
	const [countryIsActive, setCountryIsActive] = useState(false);
	const [countryInfo, setCountryInfo] = useState({
		region: cityViewList[country][0]?.sub.map(allItem => allItem.subTitle),
		active: country,
	});
	const [temporaryCountryInfo, setTemporaryCountryInfo] = useState({region: [], active: null});
	const handleGoogleAnalyticsProduct = async () => {
		await logEvent(`presetProductList`, {});
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
	const handleProduct = async (e?: any) => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			console.log('콘투라ㅣ', region);
			const data = {
				pathList: timetable,
				selectList: [...tendency, season],
				country:
					region?.some(r => r?.includes('홍콩')) || region?.some(r => r?.includes('마카오'))
						? '홍콩과 마카오'
						: region[0]?.includes('해외')
						? countryList?.find((check, iidx) => check.en == region[0]?.split('/')[1])?.ko
						: countryList[e?.active ?? country].ko, //TODO 홍콩 마카오 처리
				cityList: e?.region ?? countryInfo?.region,
				mode: 'list', // 추천/목록 모드, 기본값 : 'recommend'
				keyword: '', // prod_name 검색 - 목록 모드 전용
				page: productCountRef.current, // 페이지 번호 - 목록 모드 전용
				limit: 20, // 페이지당 개수 - 목록 모드 전용
				sortOption: sortRef.current.sortOption, // order_count, b2b_price, avg_rating_star
				sortOrder: sortRef.current.sortOrder, // asc, desc
			};
			console.log(data);
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
	(!!!route.params?.trigger ?? false) && useBackHandler({type: 'product'});
	useEffect(() => {
		navigation.setOptions({
			headerBackVisible: !!route.params?.trigger,
		});
	}, []);
	const flatListRef = useRef(null);
	const handleCategory = (e: string) => {
		switch (e) {
			case '추천순':
				sortRef.current = {sortOption: 'order_count', sortOrder: 'desc'};
				logEvent('order_count_desc', {});
				break;
			case '낮은 가격순':
				sortRef.current = {sortOption: 'b2b_price', sortOrder: 'asc'};
				logEvent('b2b_price_asc', {});
				break;
			case '높은 가격순':
				sortRef.current = {sortOption: 'b2b_price', sortOrder: 'desc'};
				logEvent('b2b_price_desc', {});
				break;
			case '낮은 평점순':
				sortRef.current = {sortOption: 'avg_rating_star', sortOrder: 'asc'};
				logEvent('avg_rating_star_asc', {});
				break;
			case '높은 평점순':
				sortRef.current = {sortOption: 'avg_rating_star', sortOrder: 'desc'};
				logEvent('avg_rating_star_desc', {});
				break;
		}
		productCountRef.current = 1;
		handleProduct();
		setCategoryValue(e);
		setCategoryVisible(false);
	};
	const handleCountry = () => {
		productCountRef.current = 1;
		setCountryInfo({...temporaryCountryInfo});
		setCountryIsActive(false);
		handleProduct(temporaryCountryInfo);
		logEvent(`countryChange`, {before: countryInfo.region.flat(), after: temporaryCountryInfo.region.flat()});
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
				<VStack width={widthPercentage(211)}>
					<PretendardSemiBoldText
						size={14}
						lineHeight={19}
						numberOfLines={2}
						color={colors.Black}
						deco={'margin-bottom:2px;'}>
						{item?.prod_name}
					</PretendardSemiBoldText>
					<HStack deco='align-self:flex-start; ' gap={4}>
						{/* <PretendardSemiBoldText size={18} lineHeight={22} color={colors.PointYellow}>
							최저가
						</PretendardSemiBoldText> */}
						<PretendardSemiBoldText size={18} lineHeight={29} numberOfLines={2} color={colors.PointGreen1}>
							{Math.floor((item?.b2b_price / item?.b2c_price) * 100)}%
						</PretendardSemiBoldText>
						<PretendardSemiBoldText size={18} lineHeight={29} numberOfLines={2} color={colors.Black}>
							{item?.b2b_price.toLocaleString('ko-KR')}원~
						</PretendardSemiBoldText>
						{item?.b2c_price - item?.b2b_price > 0 && (
							<>
								{/* <PretendardSemiBoldText
									size={16}
									lineHeight={20}
									color={colors.PointGreen1}
									deco={'text-align:right'}>
									{(item?.b2c_price - item?.b2b_price).toLocaleString('ko-KR')}원 할인
								</PretendardSemiBoldText> */}
								<PretendardSemiBoldText
									size={14}
									lineHeight={24}
									color={colors.grey200}
									deco={'text-align:right;text-decoration:line-through;'}>
									{item?.b2c_price.toLocaleString('ko-KR')}원
								</PretendardSemiBoldText>
							</>
						)}
					</HStack>
					<HStack>
						<SvgStart width={11} color={'#FFDE4C'} />
						<PretendardSemiBoldText size={14} lineHeight={17} color={colors.Gray4}>
							{item?.avg_rating_star}
						</PretendardSemiBoldText>
					</HStack>
				</VStack>
			</ProductContainer>
		);
	});
	const renderItem = useCallback(({item}) => <RenderItem item={item} />, []);
	const [goToTopBtnVisible, setGoToTopBtnVisible] = useState(false);
	const regionSearchRef = useRef<TextInput | null>(null);
	const [regionText, setRegionText] = useState('');
	const ListHeader = () => {
		return (
			<>
				<PretendardSemiBoldText size={23} lineHeight={27} color={colors.Black} deco={'margin-bottom:5px;'}>
					<PretendardSemiBoldText size={16} lineHeight={27} color={colors.grey600}>
						{route.params?.trigger == 'home' ? `` : `잠깐!\n`}
					</PretendardSemiBoldText>
					선택하신 코스에{' '}
					<PretendardSemiBoldText size={23} lineHeight={27} color={colors.PointYellow}>
						꼭 맞는 상품
					</PretendardSemiBoldText>
					을{`\n`}모아봤어요
				</PretendardSemiBoldText>

				{/* <LowPriceBox>
					<HStack gap={10}>
						<SVGStarSmile />
						<PretendardSemiBoldText size={16} lineHeight={21} color={colors.PointGreen1}>
							최저가로 즐기는 특별한 여행!
						</PretendardSemiBoldText>
					</HStack>
				</LowPriceBox> */}
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
				<RegionTextInputContainer borderColor={colors.backgroundWhite} backgroundColor={colors.backgroundGray}>
					<SVGSearch width={widthPercentage(20)} height={widthPercentage(20)} color={colors.grey500} />
					<RegionTextInput
						ref={regionSearchRef}
						returnKeyType={'search'}
						placeholder='검색어를 입력해보세요'
						value={regionText}
						backgroundColor={colors.backgroundGray}
						// onBlur={() => {
						// 	setRegionSearchState(false);
						// }}
						onSubmitEditing={() => {
							navigation.navigate('SearchProductList', {title: regionText});
						}}
						placeholderTextColor={colors.Gray3}
						onChangeText={e => {
							setRegionText(e);
						}}></RegionTextInput>
				</RegionTextInputContainer>
				{route.params?.trigger == 'home' && (
					<CountryButton
						onPress={() => {
							setTemporaryCountryInfo({...countryInfo});
							setCountryIsActive(true);
						}}>
						<PretendardSemiBoldText
							size={18}
							lineHeight={22}
							color={colors.grey700}
							deco={'text-align:center;'}>
							{countryList[countryInfo?.active].ko}{' '}
							{cityViewList[countryInfo?.active][0]?.sub.length == countryInfo.region.length
								? '전체'
								: countryInfo.region[0] +
								  (countryInfo.region.length > 1 ? ' + ' + (countryInfo.region.length - 1) : '')}
						</PretendardSemiBoldText>
						<SVGRightAdd transform={90} />
					</CountryButton>
				)}
				<FlatList
					ref={flatListRef}
					onScroll={e => {
						Keyboard.dismiss();
						setGoToTopBtnVisible(e?.nativeEvent.contentOffset.y > 100);
					}}
					ListHeaderComponent={<ListHeader />}
					ListFooterComponent={<ActivityIndicator size={'large'} />}
					data={products}
					renderItem={renderItem}
					showsVerticalScrollIndicator={false}
					keyExtractor={(item, index) => item._id ?? String(index)}
					onEndReachedThreshold={0.5}
					onEndReached={() => {
						products.length > 0 && handleProduct();
					}}></FlatList>
				{(!!!route.params?.trigger ?? false) && <MarginContainer />}
			</BackgroundGray>
			{(!!!route.params?.trigger ?? false) && (
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
			)}
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
				visible={countryIsActive}
				onRequestClose={() => {
					setCountryIsActive(false);
					// setShow(false);
				}}>
				<ModalBackground
					onPress={() => {
						setCountryIsActive(false);
						// setPlaceState(null);
						// clearInput();
					}}>
					<ModalBottomSheet flex={0.7}>
						<ScrollView>
							{countryList.map((item, index) => (
								<VStack>
									<CountrySelectButton
										onPress={() => {
											setTemporaryCountryInfo({
												region: [],
												active: temporaryCountryInfo.active == index ? null : index,
											});
										}}>
										<PretendardSemiBoldText size={20} lineHeight={24} color={colors.grey800}>
											{item.ko}
										</PretendardSemiBoldText>
										<SVGRightAdd transform={90} />
									</CountrySelectButton>
									{temporaryCountryInfo.active == index && (
										<WrapContainer>
											<CityItems
												select={
													temporaryCountryInfo.region.length ==
													cityViewList[index][0]?.sub.length
												}
												onPress={() => {
													setTemporaryCountryInfo(prev => ({
														...prev,
														region:
															temporaryCountryInfo.region.length ==
															cityViewList[index][0]?.sub.length
																? []
																: cityViewList[index][0]?.sub.map(
																		allItem => allItem.subTitle,
																  ),
													}));
												}}>
												<PretendardSemiBoldText
													size={14}
													lineHeight={18.9}
													color={
														temporaryCountryInfo.region.length ==
														cityViewList[index][0]?.sub.length
															? colors.Gray5
															: colors.Gray400
													}>
													전체
												</PretendardSemiBoldText>
											</CityItems>
											{cityViewList[index][0]?.sub.map((item, idx) => {
												return (
													<CityItems
														key={idx}
														select={temporaryCountryInfo.region.includes(item.subTitle)}
														onPress={() => {
															setTemporaryCountryInfo(prev => ({
																...prev,
																region: prev.region.includes(item.subTitle)
																	? prev.region.filter(
																			filItem => filItem != item.subTitle,
																	  )
																	: [...prev.region, item.subTitle],
															}));
														}}>
														<PretendardSemiBoldText
															size={14}
															lineHeight={18.9}
															color={
																temporaryCountryInfo.region.includes(item.subTitle)
																	? colors.Gray5
																	: colors.Gray400
															}>
															{item.subTitle}
														</PretendardSemiBoldText>
													</CityItems>
												);
											})}
										</WrapContainer>
									)}
								</VStack>
							))}
						</ScrollView>
						<RouteButton
							navigation={navigation}
							nextText='선택 완료'
							leftText='닫기'
							btnFunction={handleCountry}
							LeftBtnFunction={() => {
								setCountryIsActive(false);
							}}></RouteButton>
					</ModalBottomSheet>
				</ModalBackground>
			</Modal>
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
	border-radius: 20px;
	background-color: ${colors.backgroundWhite};
	margin-bottom: ${heightPercentage(15)}px;
	flex-direction: row;
	justify-content: space-between;
`;
const ProductImage = styled.Image`
	width: ${widthPercentage(104)}px;
	height: ${widthPercentage(104)}px;
	border-radius: 20px;
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
const CountryButton = styled.TouchableOpacity`
	max-width: ${widthPercentage(182)}px;
	height: ${widthPercentage(40)}px;
	border-radius: 12px;
	background-color: ${colors.backgroundGray};
	flex-direction: row;
	align-items: center;
	justify-content: center;
	gap: 10px;
	margin: 10px 0px 20px 0px;
`;
const CountrySelectButton = styled.TouchableOpacity`
	width: ${widthPercentage(327)}px;
	align-self: center;
	justify-content: space-between;
	height: ${heightPercentage(68)}px;
	align-items: center;
	flex-direction: row;
	padding: 0px 15px 0px 15px;
`;
