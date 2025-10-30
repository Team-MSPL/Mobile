import {
	BackgroundGray,
	HStack,
	PretendardSemiBoldText,
	PretendardVariableText,
	VStack,
} from '../../../utill/layout/layout';
import {GooglePlacesAutocomplete, GooglePlacesAutocompleteRef} from 'react-native-google-places-autocomplete';
import {fontPercentage, heightPercentage, widthPercentage} from '../../../utill/layout/responsive-size';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {colors} from '../../../utill/colors';
import {GOOGLE_API_KEY} from '@env';
import {
	getRecommendPlace,
	googleDetailApi,
	recommendApi,
	recommendTripadvisor,
	travelSliceActions,
} from '../../../redux/travel-info/travel.slice';
import {styled} from 'styled-components/native';
import {MutableRefObject, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {SvgCancel, SVGMinus, SVGPlus, SVGSearch} from '../../../utill/svg/svg';
import LinearGradient from 'react-native-linear-gradient';
import {Modal} from 'react-native';
import {ModalBackground, ModalBottomSheet} from './regist-transit';
import {BottomContainer} from '../search-place';
import {ElementContainer, SVGContainer} from '../select-multi';
import PrimaryButton from '../../../utill/component/primary-button';
import {LoadingSliceActions} from '../../../redux/loading/loading.slice';
import {modalSliceActions} from '../../../redux/modal/modalSlice';
import {ScrollView} from 'react-native';
import {TouchableOpacity} from 'react-native';
import shortid from 'shortid';
import {cityViewList} from '../../../utill/component/enroll-info/city-list';
import {useTendencyHandler} from '../../../utill/hooks/useTendencyHandler';

export default function AddSearchRecommend({navigation, route}: any) {
	const dispatch = useAppDispatch();
	const autocompleteRef = useRef<GooglePlacesAutocompleteRef | null>();
	const {region, regionInfo, timetable, country, tendency, season, cityIndex} = useAppSelector(
		state => state.travelSlice,
	);
	const handleColor = (e: string) => {
		let color = '';
		switch (e) {
			case 'travle':
				color = '#B1E832';
				break;
			case 'accommodation':
				color = colors.Pink1;
				break;
			case 'cafe':
				color = colors.Orange;
				break;
		}
		return color;
	};
	const handleTitle = (e: string) => {
		let title = '';
		switch (e) {
			case 'travle':
				title = '여행지';
				break;
			case 'accommodation':
				title = '숙소';
				break;
			case 'cafe':
				title = '식당/카페';
				break;
		}
		return title;
	};
	const handleCategory = (e: string) => {
		let title = '';
		switch (e) {
			case 'travle':
				title = 'attractions';
				break;
			case 'accommodation':
				title = 'hotels';
				break;
			case 'cafe':
				title = 'restaurants';
				break;
		}
		return title;
	};
	const handleImage = (e: string) => {
		let title = '';
		switch (e) {
			case 'travle':
				title = require('../../../../public/images/defalutAccomodation.png');
				break;
			case 'accommodation':
				title = require('../../../../public/images/hotel.png');
				break;
			case 'cafe':
				title = require('../../../../public/images/defalutFood.png');
				break;
		}
		return title;
	};
	const handleCategoryIndex = (e: string) => {
		let title = 0;
		switch (e) {
			case 'travle':
				title = 0;
				break;
			case 'accommodation':
				title = 4;
				break;
			case 'cafe':
				title = 1;
				break;
		}
		return title;
	};
	const [select, setSelect] = useState(false);
	const {Place} = useAppSelector(state => state.travelSlice);
	const regionOneList = {
		서울특별시: '서울',
		부산광역시: '부산',
		대구광역시: '대구',
		인천광역시: '인천',
		광주광역시: '광주',
		대전광역시: '대전',
		울산광역시: '울산',
		세종특별시: '세종',
		경기도: '경기',
		강원도: '강원',
		충청북도: '충북',
		충청남도: '충남',
		전라북도: '전북',
		전라남도: '전남',
		경상북도: '경북',
		경상남도: '경남',
		제주도: '제주',
	};
	const regionList = {
		부산광역시: '전체',
		대구광역시: '전체',
		인천광역시: '전체',
		광주광역시: '전체',
		대전광역시: '전체',
		울산광역시: '전체',
		세종특별시: '전체',
	};
	const cityList = {
		종로구: '도심권',
		중구: '도심권',
		용산구: '도심권',
		강남구: '동남권',
		서초구: '동남권',
		송파구: '동남권',
		강북구: '동북권',
		도봉구: '동북권',
		노원구: '동북권',
		성북구: '동북권',
		동대문구: '동북권',
		중랑구: '동북권',
		성동구: '동북권',
		광진구: '동북권',
		강서구: '서남권',
		양천구: '서남권',
		구로구: '서남권',
		영등포구: '서남권',
		동작구: '서남권',
		관악구: '서남권',
		금천구: '서남권',
		은평구: '서북권',
		서대문구: '서북권',
		마포구: '서북권',
	};
	const [placeState, setPlaceState] = useState<{
		name: string | undefined;
		lat: number | undefined;
		lng: number | undefined;
		photo: string;
		category: number;
		takenTime: number;
		formatted_address: string | undefined;
		region: string;
	} | null>();
	useEffect(() => {
		navigation.setOptions({
			headerTitle: handleTitle(route?.params?.title) + ' 추가',
		});
	}, [route]);

	const clearInput = () => {
		autocompleteRef.current?.setAddressText('');
	};
	const [timeValue, setTimeValue] = useState(0);
	const [view, setView] = useState(true);
	const [recommendList, setRcommendList] = useState([]);
	const {countryList} = useTendencyHandler();
	const handleRegion = () => {
		let a = region.map(item => cityViewList[country][cityIndex].title + ' ' + item);
		if (
			(country == 0 && cityViewList[country][cityIndex].id >= 3 && region[0] == '전체') ||
			(country == 0 && cityViewList[country][cityIndex].id == 1 && region[0] == '전체') ||
			(country != 0 && region[0] == '전체')
		) {
			a = cityViewList[country][cityIndex].sub.map(
				(value, idx) => cityViewList[country][cityIndex].title + ' ' + value.subTitle,
			);
			a.shift();
		}
		// //["해외/Vietnam/나트랑", "해외/Vietnam/다낭"]
		if (country == 0 && cityIndex == 2) {
			a = [region[0] + ' 전체'];
		}
		if (country != 0) {
			a = a.map((item, idx) => {
				return `해외/${countryList[country].en}/${item
					.slice(
						item.indexOf(cityViewList[country][cityIndex].title) +
							cityViewList[country][cityIndex].title.length,
					)
					.trim()}`;
			});
		}
		return [a[0]];
	};
	const getTravelRecommendList = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			const data = {
				regionList: handleRegion(),
				selectList: [...tendency, season],
				transit: 1,
				version: 3, // 없으면 2로 취급
				distanceSensitivity: 5,
				popularSensitivity: 5, // 250604추가 - 기본값 5
				bandwidth: true,
				lat: timetable[route.params.info.day][route.params.info.index - 1]?.lat ?? regionInfo.lat,
				lng: timetable[route.params.info.day][route.params.info.index - 1]?.lng ?? regionInfo.lng,
				page: 1, // 250430 추가
				page_for_place: 10, // 250430 추가
				password: '(주)나그네들_g5hb87r8765rt68i7ur78',
			};
			const a = await dispatch(getRecommendPlace(data)).unwrap();
			setRcommendList(a?.recommendedPlaces);
			console.log(a);
		} catch (e) {
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const getRecommendList = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());

			let result = await dispatch(
				recommendTripadvisor({
					category: handleCategory(route.params.title),
					lat: timetable[route.params.info.day][route.params.info.index - 1]?.lat ?? regionInfo.lat,
					lng: timetable[route.params.info.day][route.params.info.index - 1]?.lng ?? regionInfo.lng,
					radius: 10000,
					name:
						timetable[route.params.info.day][route.params.info.index - 1]?.name ??
						region[0].split('/').at(-1),
				}),
			).unwrap();
			result = result.data;
			if (result.length == 0) {
				result = await dispatch(
					recommendTripadvisor({
						category: handleCategory(route.params.title),
						lat: timetable[route.params.info.day][route.params.info.index - 1]?.lat ?? regionInfo.lat,
						lng: timetable[route.params.info.day][route.params.info.index - 1]?.lng ?? regionInfo.lng,
						radius: 20000,
						name: route.params.status.name,
					}),
				).unwrap();
				// departure.current.lat = route.params.lat;
				// departure.current.lng = route.params.lng;
				result = result.data;
				result.length == 0 &&
					(dispatch(
						modalSliceActions.setOpenModal({
							modalSingleUse: true,
							modalTitle: '동선 상에 추천할 수 있는 장소가 없습니다 ㅠㅠ',
						}),
					),
					navigation.goBack());
			}
			console.log(result);
			setRcommendList(result);
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '추천 아이템이 없습니다!',
				}),
			);
			navigation.goBack();
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const handleAdd = () => {
		let copy = [...timetable];
		let copy2 = [...timetable[route.params?.info?.day]];
		copy2.push({
			...placeState,
			category: handleCategoryIndex(route?.params?.title),
			x: route.params?.info?.day,
			y:
				isNaN(copy2[route.params?.info?.index - 1]?.y + copy2[route.params?.info?.index - 1]?.takenTime / 30) ||
				copy2[route.params?.info?.index - 1]?.y == 36
					? route.params?.info?.startTime
					: copy2[route.params?.info?.index - 1]?.y + copy2[route.params?.info?.index - 1]?.takenTime / 30,
			id: shortid.generate(),
			takenTime: (timeValue + 1) * 60,
			lat: Number(placeState?.lat),
			lng: Number(placeState?.lng),
		});
		copy2 = copy2.sort((a, b) => a.y - b.y);
		copy[route.params?.info?.day] = copy2;
		dispatch(travelSliceActions.changeTimetable(copy));
		navigation.pop(2);
	};

	// useLayoutEffect(() => {
	// 	getRecommendList();
	// }, []);
	useEffect(() => {
		const timer = setTimeout(() => {
			setView(false);
		}, 3000);
		return () => clearTimeout(timer);
	}, []);
	const handleAiRecommmend = async () => {
		navigation.navigate('AiRecommned', {info: route.params?.info, title: route.params?.title});
		console.log(route.params);
		// if (route?.params?.title == 'travle') {
		// 	getTravelRecommendList();
		// } else {
		// 	getRecommendList();
		// }
	};
	return (
		<BackgroundGray>
			<SearchContainer height={heightPercentage(200)}>
				<GooglePlacesAutocomplete
					placeholder='검색어를 입력하세요.'
					disableScroll={false}
					ref={autocompleteRef as MutableRefObject<GooglePlacesAutocompleteRef | null>}
					query={{
						key: GOOGLE_API_KEY,
						language: 'ko',
					}}
					textInputProps={{placeholderTextColor: colors.Gray2, allowFontScaling: false}}
					renderRightButton={() => (
						<AIBox
							onPress={() => {
								// navigation.navigate('AiRecommend', {title: route.params.title});
								// console.log(regionInfo);
								handleAiRecommmend();
							}}>
							{view && (
								<AlertBox>
									<PretendardVariableText size={14} color={colors.backgroundWhite} lineHeight={24}>
										AI가 숙소를 추천해줘요
									</PretendardVariableText>
									<Triangle />
								</AlertBox>
							)}
							<LinearGradient
								start={{x: 0.7, y: 0}}
								end={{x: 1.1, y: 0}}
								colors={[handleColor(route.params.title), 'rgba(255,255,255,0)']}
								style={{
									position: 'absolute',
									width: '100%',
									paddingHorizontal: widthPercentage(24),
									paddingBottom: widthPercentage(20),
									height: '100%',
									alignItems: 'flex-start',
									justifyContent: 'flex-end',
									borderRadius: 25,
								}}></LinearGradient>
							<PretendardSemiBoldText
								size={12}
								lineHeight={16}
								numberOfLines={1}
								color={colors.backgroundWhite}>
								AI추천
							</PretendardSemiBoldText>
						</AIBox>
					)}
					renderLeftButton={() => <SVGSearch color={handleColor(route.params.title)} />}
					styles={{
						container: {alignItems: 'center'},
						textInputContainer: {
							width: widthPercentage(327),
							height: widthPercentage(52),
							borderRadius: 99,
							backgroundColor: colors.backgroundWhite,
							alignItems: 'center',
							borderWidth: 1,
							marginTop: widthPercentage(30),
							borderColor: handleColor(route.params.title),
							paddingLeft: 20,
						},
						listView: {width: widthPercentage(327), maxHeight: heightPercentage(100)},
						textInput: {
							color: 'black',
							backgroundColor: 'transparent',
							flex: 0.9,
							fontSize: fontPercentage(18),
						},
						description: {color: 'black'},
					}}
					fetchDetails={true}
					onPress={async (data, details) => {
						const placeId = details?.place_id;
						const response = await dispatch(googleDetailApi({placeId: placeId}));
						let imageUrl;
						if (response.payload.result.photos) {
							const photoReference = response.payload.result?.photos[0]?.photo_reference;
							imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${GOOGLE_API_KEY}`;
						} else {
							imageUrl = null;
						}
						const datas = {
							...Place,
							name: details?.name,
							lat: Number(details?.geometry.location.lat),
							lng: Number(details?.geometry.location.lng),
							formatted_address: details?.formatted_address.replace('대한민국 ', ''),
							photo: imageUrl,
							region: details?.formatted_address.replace('대한민국 ', ''),
						};
						setPlaceState(datas);
						dispatch(travelSliceActions.enrollPlace(datas));
						setSelect(!select);
					}}
					onFail={error => console.log(error)}
					onNotFound={() => console.log('no results')}></GooglePlacesAutocomplete>
			</SearchContainer>
			<ScrollView showsVerticalScrollIndicator={false}>
				{recommendList.map((item, idx) => (
					<ItemPressBox
						onPress={() => {
							const datas = {
								...Place,
								name: item?.place_name ?? item?.name,
								lat: item?.y ?? item?.lat,
								lng: item?.x ?? item?.lng,
								formatted_address: item?.address_name ?? item?.address_obj?.address_string,
								photo: '',
								region: item?.address_name ?? item?.address_obj?.address_string,
							};
							setPlaceState(datas);
							dispatch(travelSliceActions.enrollPlace(datas));
						}}
						key={idx}
						deco={`border-width:1px;border-color:${colors.Gray200};padding:${widthPercentage(
							10,
						)}px ${widthPercentage(10)}px;border-radius:12px;margin-bottom:10px;gap:15px;`}>
						<ImageBox
							source={item?.photo ? {uri: item?.photo} : handleImage(route.params?.title)}
							resizeMode={'cover'}></ImageBox>
						<VStack width={widthPercentage(230)}>
							<PretendardSemiBoldText size={16} lineHeight={22} numberOfLines={1} color={colors.Black}>
								{item?.place_name ?? item?.name}
							</PretendardSemiBoldText>
							<PretendardVariableText size={12} lineHeight={17} numberOfLines={1} color={colors.Title}>
								{item?.address_name ?? item?.address_obj?.address_string}
							</PretendardVariableText>
							<PretendardVariableText
								size={14}
								lineHeight={19}
								numberOfLines={1}
								color={colors.PointYellow}>
								{timetable[route.params.info.day][route.params.info.index - 1]?.name ?? '중심지'}로 부터{' '}
								{Math.floor(Number(item?.distance) * 1000)}m
							</PretendardVariableText>
						</VStack>
					</ItemPressBox>
				))}
			</ScrollView>
			<Modal
				animationType={'fade'}
				transparent={true}
				visible={placeState?.name != undefined}
				onRequestClose={() => {
					// setShow(false);
				}}>
				<ModalBackground
					onPress={() => {
						setPlaceState(null);
						clearInput();
					}}>
					<ModalBottomSheet flex={route.params?.title == 'accommodation' ? 0.4 : 0.4}>
						<BottomContainer height={heightPercentage(230)} gap={20}>
							<ElementContainer width='327' color={colors.backgroundGray} height={widthPercentage(75)}>
								<VStack width={widthPercentage(267)}>
									<PretendardSemiBoldText size={16} color={colors.Gray5} lineHeight={21.6}>
										{placeState?.name}
									</PretendardSemiBoldText>
									<PretendardVariableText
										size={12}
										lineHeight={18}
										color={colors.Gray2}
										numberOfLines={1}>
										{placeState?.formatted_address}
									</PretendardVariableText>
								</VStack>
								<DeleteBox
									onPress={() => {
										setPlaceState(null);
										clearInput();
									}}>
									<SvgCancel width={widthPercentage(12)} height={widthPercentage(12)} color='black' />
								</DeleteBox>
							</ElementContainer>
							{route.params.title != 'accommodation' && (
								<HStack justifyContent='space-around'>
									<PretendardSemiBoldText size={16} color={colors.Gray5} lineHeight={24}>
										머무를 시간
									</PretendardSemiBoldText>
									<HStack justifyContent='space-around' width={widthPercentage(182)}>
										<SVGContainer
											disabled={timeValue < 1}
											onPress={() => {
												setTimeValue(timeValue - 1);
											}}
											color={timeValue < 1 ? colors.backgroundWhite : colors.Gray1}>
											{timeValue >= 1 && (
												<SVGMinus
													width={widthPercentage(23)}
													height={widthPercentage(23)}
													color={colors.Gray2}
												/>
											)}
										</SVGContainer>

										<PretendardSemiBoldText size={16} color={colors.PointYellow} lineHeight={21.6}>
											{timeValue + 1}시간
										</PretendardSemiBoldText>
										<SVGContainer
											disabled={timeValue > 1}
											onPress={() => {
												setTimeValue(timeValue + 1);
											}}
											color={timeValue > 1 ? colors.backgroundWhite : colors.Gray5}>
											{timeValue <= 1 && (
												<SVGPlus
													width={widthPercentage(25)}
													height={widthPercentage(25)}
													color={colors.Primary}
												/>
											)}
										</SVGContainer>
									</HStack>
								</HStack>
							)}
							<PrimaryButton
								label={handleTitle(route?.params?.title) + ' 추가'}
								width={widthPercentage(327)}
								height={heightPercentage(60)}
								onPress={() => {
									handleAdd();
								}}
								backgroundColor={colors.Gray5}
								textColor={colors.backgroundWhite}></PrimaryButton>
						</BottomContainer>
					</ModalBottomSheet>
				</ModalBackground>
			</Modal>
		</BackgroundGray>
	);
}
const SearchContainer = styled.View<{height: number}>`
	height: ${props => props.height}px;
`;
const AIBox = styled.Pressable`
	width: ${widthPercentage(54)}px;
	height: ${widthPercentage(36)}px;
	border-radius: 25px;
	align-items: center;
	justify-content: center;
`;

const DeleteBox = styled.TouchableOpacity`
	width: ${widthPercentage(20)}px;
	height: ${widthPercentage(20)}px;
`;
const AlertBox = styled.View`
	width: ${widthPercentage(157)}px;
	height: ${widthPercentage(29)}px;
	background-color: rgba(0, 0, 0, 0.5);
	position: absolute;
	top: -${widthPercentage(38)}px;
	left: -${widthPercentage(87)}px;
	border-radius: 8px;
	align-items: center;
	justify-content: center;
`;
const Triangle = styled.View`
	width: 0;
	height: 0;
	background-color: transparent;
	border-style: solid;
	border-left-width: ${widthPercentage(8)}px;
	border-right-width: ${widthPercentage(8)}px;
	border-top-width: ${widthPercentage(8)}px;
	border-left-color: transparent;
	border-right-color: transparent;
	border-top-color: rgba(0, 0, 0, 0.5);
	position: absolute;
	bottom: -${widthPercentage(8)}px;
	left: ${widthPercentage(107)}px;
`;
const ImageBox = styled.Image`
	width: ${widthPercentage(80)}px;
	height: ${widthPercentage(80)}px;
	border-radius: 8px;
`;
const ItemPressBox = styled(HStack).attrs({as: TouchableOpacity})``;
