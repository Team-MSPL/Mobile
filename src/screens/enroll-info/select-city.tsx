import {Pressable, ScrollView, TextInput} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {getRegionInfo, travelSliceActions} from '../../redux/travel-info/travel.slice';

import {BackgroundGray, PretendardSemiBoldText, PretendardVariableText} from '../../utill/layout/layout';
import styled from 'styled-components/native';
import StepText from '../../utill/component/enroll-info/step-text';
import {colors} from '../../utill/colors';
import {SVGSearch, SvgCancel} from '../../utill/svg/svg';
import {modalSliceActions} from '../../redux/modal/modalSlice';

import Stepper from '../../utill/component/enroll-info/stepper';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {useCallback, useEffect, useRef, useState} from 'react';
import {logEvent} from '../../../firebaseAnalytice';
import RouteButton from '../../utill/component/route-button';
import {cityViewList} from '../../utill/component/enroll-info/city-list';
import {useFocusEffect} from '@react-navigation/native';
import {
	RegionTextInput,
	RegionTextInputContainer,
	SearchContainer,
	SearchElements,
} from './region-recommend/select-distance';
import {useRegionSearch} from '../../utill/hooks/useRegionSearch';
import Carousel from 'react-native-reanimated-carousel';
import {useTendencyHandler} from '../../utill/hooks/useTendencyHandler';
import {ButtonContainer, MarginContainder} from './select-multi';
export default function SelectCity({navigation}: any) {
	const {region, cityIndex, cityDistance, country} = useAppSelector(state => state.travelSlice);
	const {socialloginProvider} = useAppSelector(state => state.userSlice);
	const dispatch = useAppDispatch();
	const [regionText, setRegionText] = useState('');
	const [regionSearchState, setRegionSearchState] = useState(false);
	const regionSearchRef = useRef<TextInput | null>(null);
	const [regionMatchList, setRegionMatchList] = useState<{id: number; lat: number; lng: number; subTitle: string}[]>(
		[],
	);
	const checkList = ['서울', '제주'];
	const selectPopularity = (e: {id: number; subTitle: string; subId: number}) => {
		dispatch(
			travelSliceActions.selectPopularity({
				region: checkList.includes(e.subTitle) ? ['전체'] : [e.subTitle],
				cityIndex: e.id,
				cityDistance: [e.subId],
			}),
		);
	};
	const selectRegion = (e: any) => {
		if (e.subTitle === '전체' || region.includes('전체')) {
			dispatch(travelSliceActions.firstSelectRegion({region: [e.subTitle], cityDistance: [e.id]}));
		} else if (region.includes(e.subTitle)) {
			const copy = region.filter(item => item !== e.subTitle);
			const copyIndex = cityDistance.filter(item => item !== e.id);
			copy.length == 0 && dispatch(travelSliceActions.changeChecKStep(3));
			dispatch(travelSliceActions.firstSelectRegion({region: copy, cityDistance: copyIndex}));
		} else {
			let copy = [];
			let copyIndex = [];
			if (!(country == 0 && cityIndex == 2)) {
				copy = [...region];
				copyIndex = [...cityDistance];
			}
			copy.push(e.subTitle);
			copyIndex.push(e.id);
			dispatch(travelSliceActions.firstSelectRegion({region: copy, cityDistance: copyIndex}));
		}
	};

	const deleteRegion = (e: string) => {
		let searchIndex = region.findIndex(item => item == e);
		let copy = [...region];
		let copyIndex = [...cityDistance];
		copy.splice(searchIndex, 1);
		copyIndex.splice(searchIndex, 1);
		copy.length == 0 && dispatch(travelSliceActions.changeChecKStep(3));
		dispatch(travelSliceActions.firstSelectRegion({region: copy, cityDistance: copyIndex}));
	};

	const selectCity = (e: number) => {
		if (region) {
			dispatch(travelSliceActions.selectRegion([]));
		}
		dispatch(travelSliceActions.enrollCityIndex(e));
	};

	const {countryList} = useTendencyHandler();
	const goNext = () => {
		if (region.length == 0) {
			dispatch(modalSliceActions.setOpenModal({modalTitle: '지역을 선택해주세요.', modalSingleUse: true}));
		} else {
			navigation.navigate('SelectDay');
			//서울== 서울 전체, 광역시 전체
			const city = cityViewList[country][cityIndex];
			const isDomestic = country == 0; //한국인지 해외인지
			const regionName = region[0]; //지역 이름
			const subTitle = city?.sub?.[1]?.subTitle ?? '';
			const cityEng = city.eng ?? ''; // 일본은 영어정보가 같이 들어가야해서
			const countryEn = countryList[country].en; //해외/japan 할때 쓰느 영어
			// 한국일때 - 광역시면 해당광역시 + 전체 ex) ['광역시 부산'] == '부산 전체'
			// 서울일때 - '서울 전체'
			// 해외일때 - 파이어베이스에는 정규화가 이상하게 되어있어서 normalize를 이용해서 넘김.
			// 특이사항- 일본은 영어를 같이 보내줘야해서 cityEng를 함께 넣음 + 영어 뒤에 띄어쓰기가 한칸 더 있어야함.
			// 국내 = '서울 전체' ....  해외 = '해외/japan/간토 (Kanto) !도쿄 or 해외/Philippines/루손 섬 !마닐라
			const data = isDomestic
				? city.title === '광역시'
					? `${regionName} 전체`
					: city.title === '서울'
					? '서울 전체'
					: `${city.title} ${regionName !== '전체' ? regionName : subTitle}`
				: `해외/${countryEn}/${city.title.normalize('NFD')} ${cityEng.normalize('NFD')}${cityEng ? ' ' : ''}${
						regionName !== '전체' ? '!' + regionName : '!' + subTitle
				  }`;

			//regionINfo api
			dispatch(
				getRegionInfo({
					region: data,
				}),
			);
		}
	};
	const handleGoogleAnalytics = async () => {
		socialloginProvider == 'anonymous'
			? await logEvent('anonymous_course_step2', {})
			: await logEvent('course_step2', {});
	};
	useEffect(() => {
		handleGoogleAnalytics();
	}, []);
	const {handleRegionSerarch} = useRegionSearch();
	const handleRegionText = useCallback((e: string) => {
		setRegionText(e);
		setRegionMatchList(handleRegionSerarch(e));
	}, []);
	const cityScrollRef = useRef(null);
	useEffect(() => {
		if (cityScrollRef.current) {
			requestAnimationFrame(() => {
				cityScrollRef.current.scrollTo({x: cityIndex < 4 ? 0 : cityIndex * 30});
			});
		}
	}, [cityIndex]);
	return (
		<>
			<BackgroundGrayPressable
				onPress={() => {
					regionSearchRef.current?.blur();
					setRegionSearchState(false);
				}}>
				<Stepper total={13} now={3}></Stepper>
				<StepText
					marginTop={heightPercentage(10)}
					styleText='1.여행 계획을 알려주세요.'
					mainText='어디로 떠나시나요?'></StepText>
				<RegionTextInputContainer>
					<SVGSearch width={widthPercentage(20)} height={widthPercentage(20)} color={colors.Primary} />
					<RegionTextInput
						ref={regionSearchRef}
						placeholder='지역을 검색해보세요'
						value={regionText}
						// onBlur={() => {
						// 	setRegionSearchState(false);
						// }}
						onFocus={() => {
							setRegionSearchState(true);
						}}
						placeholderTextColor={colors.Gray3}
						onChangeText={e => {
							setRegionSearchState(e.length == 0 && regionText.length >= 1 ? false : true);
							handleRegionText(e);
						}}></RegionTextInput>
				</RegionTextInputContainer>
				<SearchContainer top={heightPercentage(210)}>
					<ScrollView style={{zIndex: 2}}>
						{regionSearchState &&
							regionMatchList.map((item, index) => {
								return (
									<SearchElements
										key={index}
										onPress={() => {
											dispatch(
												travelSliceActions.selectPopularity({
													region: cityViewList[country].filter(
														asd => asd.title == item.subTitle,
													)[0]?.id
														? ['전체']
														: [item.subTitle],
													cityIndex:
														cityViewList[country]
															.slice(1)
															.filter(
																asd =>
																	asd.sub.filter(qqq => qqq.subTitle == item.subTitle)
																		.length >= 1,
															)[0]?.id ??
														cityViewList[country].filter(
															asd => asd.title == item.subTitle,
														)[0]?.id,
													cityDistance: [item.id],
												}),
											);
											regionSearchRef.current?.blur();
											setRegionText(item.subTitle);
											setRegionSearchState(false);
										}}>
										<PretendardSemiBoldText size={12} lineHeight={15} color={colors.Gray3}>
											{item.subTitle}
										</PretendardSemiBoldText>
									</SearchElements>
								);
							})}
					</ScrollView>
				</SearchContainer>
				<ScrollView
					style={{marginBottom: widthPercentage(70), marginTop: heightPercentage(20)}}
					showsVerticalScrollIndicator={false}>
					<Container>
						<SelectAllContainer>
							<SelectListContainer horizontal={true} showsHorizontalScrollIndicator={false}>
								{region?.map((item, regionIndex) => {
									return (
										<RegionElementContainer key={regionIndex} onPress={() => deleteRegion(item)}>
											<PretendardSemiBoldText
												size={14}
												lineHeight={18.9}
												color={colors.backgroundWhite}>
												{item == '전체'
													? cityViewList[country][cityIndex].title + ' ' + item
													: item}
											</PretendardSemiBoldText>
											<SvgCancel
												width={widthPercentage(12)}
												height={widthPercentage(12)}
												color={colors.Primary}
											/>
										</RegionElementContainer>
									);
								})}
							</SelectListContainer>
						</SelectAllContainer>
						<ScrollView
							ref={cityScrollRef}
							horizontal={true}
							nestedScrollEnabled={true}
							showsHorizontalScrollIndicator={false}>
							{cityViewList[country].map((item, idx) => {
								return (
									<RegionItems
										key={idx}
										select={cityIndex == item.id}
										onPress={() => {
											selectCity(item.id);
										}}>
										<PretendardVariableText
											size={14}
											lineHeight={18.9}
											color={cityIndex == item.id ? colors.backgroundWhite : colors.Gray5}>
											{item.title}
										</PretendardVariableText>
									</RegionItems>
								);
							})}
						</ScrollView>
						<WrapContainer>
							{cityViewList[country][cityIndex]?.sub.map((item, idx) => {
								return (
									<CityItems
										key={idx}
										select={region.includes(item.subTitle)}
										onPress={() => {
											console.log(region);
											cityIndex == 0 ? selectPopularity(item) : selectRegion(item);
										}}>
										<PretendardSemiBoldText
											size={14}
											lineHeight={18.9}
											color={region.includes(item.subTitle) ? colors.Gray5 : colors.Gray400}>
											{item.subTitle}
										</PretendardSemiBoldText>
									</CityItems>
								);
							})}
						</WrapContainer>
						{/* <Carousel
						loop={false}
						style={{
							marginTop: 18,
						}}
						ref={carouselRef}
						width={widthPercentage(337)}
						height={heightPercentage(Math.ceil(cityViewList[country][cityIndex].sub.length / 3) * 50)}
						data={cityViewList[country]}
						scrollAnimationDuration={500}
						onSnapToItem={itemIndex => {
							selectCity(itemIndex);
						}}
						// onProgressChange={(a, d) => {
						// 	console.log(Math.round(d));
						// 	Math.round(d) != cityIndex && selectCity(Math.round(d));
						// }}
						renderItem={({index}) => (
							<WrapContainer>
								{cityViewList[country][index]?.sub.map((item, idx) => {
									return (
										<CityItems
											key={idx}
											select={region.includes(item.subTitle)}
											onPress={() => {
												index == 0 ? selectPopularity(item) : selectRegion(item);
											}}>
											<PretendardSemiBoldText
												size={14}
												lineHeight={18.9}
												color={region.includes(item.subTitle) ? colors.Gray5 : colors.Gray3}>
												{item.subTitle}
											</PretendardSemiBoldText>
										</CityItems>
									);
								})}
							</WrapContainer>
						)}
					/> */}
					</Container>
					{country == 0 && cityIndex == 1 && (
						<FlexContainer>
							<SeoulContainer>
								{cityViewList[country][1].sub.map((item, idx) => {
									return idx != 0 ? (
										<SeoulInsideAllContainer key={idx}>
											<SeoulInsideContainer width={widthPercentage(125)}>
												<PretendardVariableText
													size={12}
													lineHeight={16.2}
													color={colors.Gray4}>
													{item.subTitle}
												</PretendardVariableText>
											</SeoulInsideContainer>
											<SeoulInsideContainer width={widthPercentage(181)}>
												<PretendardVariableText
													size={12}
													lineHeight={16.2}
													color={colors.Gray2}>
													{item.example}
												</PretendardVariableText>
											</SeoulInsideContainer>
										</SeoulInsideAllContainer>
									) : null;
								})}
							</SeoulContainer>
						</FlexContainer>
					)}
				</ScrollView>
				<MarginContainder></MarginContainder>
			</BackgroundGrayPressable>
			<ButtonContainer>
				<RouteButton navigation={navigation} nextTitle='SelectMulti' goNext={goNext}></RouteButton>
			</ButtonContainer>
		</>
	);
}
const FlexContainer = styled.View`
	flex: 1;
	justify-content: center;
	border-width: 1px;
	border-radius: 12px;
	border-color: ${colors.Gray200};
`;
const SeoulContainer = styled.View`
	width: ${widthPercentage(326)}px;
	height: ${heightPercentage(199)}px;
	background-color: ${colors.backgroundWhite};
	border-radius: 12px;
	align-self: center;
	justify-content: center;
	padding: ${widthPercentage(10)}px;
	bottom: 0;
`;
const SeoulInsideAllContainer = styled.View`
	width: ${widthPercentage(316)}px;
	flex-direction: row;
	margin-top: ${heightPercentage(10)}px;
`;
const SeoulInsideContainer = styled.View<{width: number}>`
	width: ${props => props.width}px;
	align-items: start;
`;
const Container = styled.View`
	gap: ${heightPercentage(20)}px;
`;
const WrapContainer = styled.View`
	width: ${widthPercentage(327)}px;
	flex-direction: row;
	flex-wrap: wrap;
	gap: ${widthPercentage(10)}px;
	margin-bottom: ${heightPercentage(20)}px;
`;
const RegionItems = styled.TouchableOpacity<{select: boolean}>`
	justify-content: center;
	align-items: center;
	padding: ${heightPercentage(8)}px ${widthPercentage(16)}px;
	background-color: ${props => (props.select ? colors.Gray5 : colors.backgroundWhite)};
	border-radius: 99px;
`;
const CityItems = styled(RegionItems)`
	background-color: ${props => (props.select ? colors.Primary : colors.backgroundWhite)};
	border-width: 1px;
	border-color: ${props => (props.select ? colors.backgroundWhite : colors.Gray300)};
	flex-direction: row;
`;
const RegionElementContainer = styled.TouchableOpacity`
	background-color: ${colors.Gray5};
	border-radius: 99px;
	padding: ${heightPercentage(8)}px ${widthPercentage(16)}px;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	gap: ${widthPercentage(4)}px;
	margin-right: ${widthPercentage(6)}px;
`;
const SelectListContainer = styled.ScrollView`
	width: 100%;
`;
const SelectAllContainer = styled.View`
	width: 100%;
`;
const BackgroundGrayPressable = styled(BackgroundGray).attrs({as: ScrollView})``;
