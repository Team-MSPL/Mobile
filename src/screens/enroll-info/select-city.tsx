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
	const checkList = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '제주'];
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
			let copy = [...region];
			copy.push(e.subTitle);
			let copyIndex = [...cityDistance];
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

	const goNext = () => {
		if (region.length == 0) {
			dispatch(modalSliceActions.setOpenModal({modalTitle: '지역을 선택해주세요.', modalSingleUse: true}));
		} else {
			navigation.navigate('SelectDay');
			dispatch(
				getRegionInfo({
					region: cityViewList[country][cityIndex].title + (region[0] != '전체' ? ' ' + region[0] : ''),
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
	const carouselRef = useRef(null);
	const cityScrollRef = useRef(null);
	useEffect(() => {
		if (carouselRef.current) {
			requestAnimationFrame(() => {
				cityScrollRef.current.scrollTo({x: cityIndex < 4 ? 0 : cityIndex * 30});
				carouselRef.current.scrollTo({
					index: cityIndex,
				});
			});
		}
	}, [cityIndex]);
	return (
		<BackgroundGrayPressable
			onPress={() => {
				regionSearchRef.current?.blur();
				setRegionSearchState(false);
			}}>
			<Stepper total={11} now={2}></Stepper>
			<StepText
				marginTop={heightPercentage(10)}
				styleText='1.여행 계획을 알려주세요.'
				mainText='어디로 떠나시나요?'></StepText>
			<RegionTextInputContainer>
				<SVGSearch />
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
						setRegionSearchState(true);
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
													cityViewList[country].filter(asd => asd.title == item.subTitle)[0]
														?.id,
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
									<PretendardSemiBoldText
										size={14}
										lineHeight={18.9}
										color={cityIndex == item.id ? colors.backgroundWhite : colors.Gray5}>
										{item.title}
									</PretendardSemiBoldText>
								</RegionItems>
							);
						})}
					</ScrollView>
					<Carousel
						loop={false}
						style={{
							marginTop: 18,
						}}
						ref={carouselRef}
						width={widthPercentage(337)}
						height={heightPercentage(country == 0 && cityIndex == 9 ? 360 : 160)}
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
					/>
				</Container>
				{country == 0 && cityIndex == 1 && (
					<FlexContainer>
						<SeoulContainer>
							{cityViewList[country][1].sub.map((item, idx) => {
								return idx != 0 ? (
									<SeoulInsideAllContainer key={idx}>
										<SeoulInsideContainer width={widthPercentage(125)}>
											<PretendardVariableText size={12} lineHeight={16.2} color={colors.Gray4}>
												{item.subTitle}
											</PretendardVariableText>
										</SeoulInsideContainer>
										<SeoulInsideContainer width={widthPercentage(181)}>
											<PretendardVariableText size={12} lineHeight={16.2} color={colors.Gray2}>
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
			<RouteButton navigation={navigation} nextTitle='SelectMulti' goNext={goNext}></RouteButton>
		</BackgroundGrayPressable>
	);
}
const FlexContainer = styled.View`
	flex: 1;
	justify-content: center;
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
`;
const RegionItems = styled.TouchableOpacity<{select: boolean}>`
	justify-content: center;
	align-items: center;
	padding: ${heightPercentage(5)}px ${widthPercentage(8)}px;
	background-color: ${props => (props.select ? colors.Gray5 : colors.backgroundGray)};
	border-radius: 99px;
`;
const CityItems = styled(RegionItems)`
	background-color: ${props => (props.select ? colors.Primary : colors.backgroundWhite)};
	border-width: 1px;
	border-color: ${props => (props.select ? colors.backgroundWhite : colors.Gray3)};
	flex-direction: row;
`;
const RegionElementContainer = styled.TouchableOpacity`
	background-color: ${colors.Gray5};
	border-radius: 99px;
	padding: ${heightPercentage(5)}px ${widthPercentage(8)}px;
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
	height: ${heightPercentage(30)}px;
`;
const BackgroundGrayPressable = styled(BackgroundGray).attrs({as: Pressable})``;
