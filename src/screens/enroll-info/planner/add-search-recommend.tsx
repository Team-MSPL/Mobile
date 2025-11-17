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
import shortid from 'shortid';

export default function AddSearchRecommend({navigation, route}: any) {
	const dispatch = useAppDispatch();
	const autocompleteRef = useRef<GooglePlacesAutocompleteRef | null>();
	const {timetable} = useAppSelector(state => state.travelSlice);
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

	useEffect(() => {
		const timer = setTimeout(() => {
			setView(false);
		}, 3000);
		return () => clearTimeout(timer);
	}, []);
	const handleAiRecommmend = async () => {
		navigation.navigate('AiRecommned', {info: route.params?.info, title: route.params?.title});
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

export const DeleteBox = styled.TouchableOpacity`
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
