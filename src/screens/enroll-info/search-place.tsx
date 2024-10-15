import {MutableRefObject, useRef, useState} from 'react';
import {GooglePlacesAutocomplete, GooglePlacesAutocompleteRef} from 'react-native-google-places-autocomplete';
import {useAppDispatch, useAppSelector} from '../../redux';
import {googleDetailApi, travelSliceActions} from '../../redux/travel-info/travel.slice';

import shortId from 'shortid';
import {GOOGLE_API_KEY} from '@env';
import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import {
	BackgroundGray,
	HStack,
	PretendardSemiBoldText,
	PretendardVariableText,
	VStack,
} from '../../utill/layout/layout';
import {Keyboard, Pressable, TouchableOpacity} from 'react-native';
import {SVGMinus, SVGPlus, SvgLoginLogo} from '../../utill/svg/svg';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import PrimaryButton from '../../utill/component/primary-button';
import {DeleteContainer, SVGContainer} from './select-multi';
import {logEvent} from '../../../firebaseAnalytice';
export default function SearchPlace({navigation, route}: any) {
	const [select, setSelect] = useState(false);
	const dispatch = useAppDispatch();
	const {Place, accommodations, essentialPlaces} = useAppSelector(state => state.travelSlice);
	const {socialloginProvider} = useAppSelector(state => state.userSlice);
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
	const SearchList = [
		{
			title: '방문 예정인 여행지를 등록해 주세요',
			subTitle: '여행지 추가',
			variable: essentialPlaces,
			function: travelSliceActions.enrollessentialPlaces,
		},
		{
			title: '예정된 숙소 정보를 등록해주세요',
			subTitle: '숙소 추가',
			variable: accommodations,
			function: travelSliceActions.enrollAccommodations,
		},
	];
	const autocompleteRef = useRef<GooglePlacesAutocompleteRef | null>();
	const handleGoogleAnalytics = async () => {
		socialloginProvider == 'anonymous'
			? await logEvent('anonymous_select_place', {
					place: placeState?.name,
			  })
			: await logEvent('select_place', {
					place: placeState?.name,
			  });
	};
	const addPlace = () => {
		let copy = [...SearchList[route.params.id].variable];
		route.params.id == 1
			? placeState && (copy[route.params.idx + 1] = placeState)
			: copy.push({
					...placeState,
					day: route.params.idx + 1,
					id: shortId.generate(),
					category: 5,
					takenTime: (timeValue + 1) * 60,
			  });
		dispatch(SearchList[route.params.id].function(copy));
		handleGoogleAnalytics();
		navigation.goBack();
	};
	const clearInput = () => {
		autocompleteRef.current?.setAddressText('');
	};
	const [timeValue, setTimeValue] = useState(0);
	return (
		<SearchPlaceContainer
			paddingHorizental={0}
			onPress={() => {
				Keyboard.dismiss();
			}}>
			<SearchContainer height={route.params.id == 0 ? heightPercentage(450) : heightPercentage(497)}>
				<GooglePlacesAutocomplete
					placeholder='검색어를 입력하세요.'
					disableScroll={true}
					ref={autocompleteRef as MutableRefObject<GooglePlacesAutocompleteRef | null>}
					query={{
						key: GOOGLE_API_KEY,
						language: 'ko',
						components: 'country:kr',
					}}
					textInputProps={{placeholderTextColor: colors.Gray2}}
					styles={{
						container: {alignItems: 'center'},
						textInputContainer: {
							width: widthPercentage(327),
							height: heightPercentage(52),
							borderRadius: 8,
							backgroundColor: colors.backgroundWhite,
							alignItems: 'center',
						},
						listView: {width: widthPercentage(327)},
						textInput: {margin: 1, color: 'black', backgroundColor: colors.backgroundWhite},
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
							lat: details?.geometry.location.lat,
							lng: details?.geometry.location.lng,
							formatted_address: details?.formatted_address.replace('대한민국 ', ''),
							photo: imageUrl,
							region:
								regionOneList[details?.formatted_address.split(' ')[1]] +
								' ' +
								(regionList[details?.formatted_address.split(' ')[1]] ??
									cityList[details?.formatted_address.split(' ')[2]]),
						};
						setPlaceState(datas);
						dispatch(travelSliceActions.enrollPlace(datas));
						setSelect(!select);
					}}
					onFail={error => console.log(error)}
					onNotFound={() => console.log('no results')}></GooglePlacesAutocomplete>
			</SearchContainer>
			{placeState ? (
				<BottomContainer height={route.params.id == 0 ? heightPercentage(230) : heightPercentage(182)}>
					<ElementContainer color={colors.backgroundGray}>
						<VStack width={widthPercentage(243)}>
							<PretendardSemiBoldText size={16} color={colors.Gray5} lineHeight={21.6}>
								{placeState.name}
							</PretendardSemiBoldText>
							<PretendardVariableText size={12} lineHeight={18} color={colors.Gray2}>
								{placeState.formatted_address}
							</PretendardVariableText>
						</VStack>
						<DeleteContainer
							onPress={() => {
								setPlaceState(null);
								clearInput();
							}}>
							<PretendardSemiBoldText size={12} lineHeight={18} color={colors.Gray5}>
								취소
							</PretendardSemiBoldText>
						</DeleteContainer>
					</ElementContainer>
					{route.params.id == 0 && (
						<HStack justifyContent='space-around'>
							<PretendardSemiBoldText size={16} color={colors.PointYellow} lineHeight={24}>
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
											width={widthPercentage(14)}
											height={widthPercentage(4)}
											color={colors.Gray2}
										/>
									)}
								</SVGContainer>

								<PretendardSemiBoldText size={16} color={colors.Gray5} lineHeight={21.6}>
									{timeValue + 1}시간
								</PretendardSemiBoldText>
								<SVGContainer
									disabled={timeValue > 1}
									onPress={() => {
										setTimeValue(timeValue + 1);
									}}
									color={timeValue > 1 ? colors.backgroundWhite : colors.Gray1}>
									{timeValue <= 1 && (
										<SVGPlus
											width={widthPercentage(16)}
											height={widthPercentage(16)}
											color={colors.Gray2}
										/>
									)}
								</SVGContainer>
							</HStack>
						</HStack>
					)}
					<PrimaryButton
						label={SearchList[route.params.id].subTitle}
						width={widthPercentage(327)}
						height={heightPercentage(60)}
						onPress={addPlace}
						backgroundColor={colors.Primary}
						textColor={colors.Gray5}></PrimaryButton>
				</BottomContainer>
			) : (
				<ButtonContainer>
					<PrimaryButton
						disabled={!placeState}
						label={SearchList[route.params.id].subTitle}
						width={widthPercentage(327)}
						height={heightPercentage(60)}
						onPress={() => {}}
						backgroundColor={colors.Gray1}
						textColor={colors.Gray4}></PrimaryButton>
				</ButtonContainer>
			)}
		</SearchPlaceContainer>
	);
}

const ElementContainer = styled.View<{color: string}>`
	border-radius: 8px;
	background-color: ${props => props.color};
	align-items: center;
	justify-content: space-between;
	padding: ${widthPercentage(5)}px ${widthPercentage(8)}px;
	gap: ${widthPercentage(4)}px;
	flex-direction: row;
	margin-right: ${widthPercentage(5)}px;
	margin-bottom: ${widthPercentage(5)}px;
	width: ${widthPercentage(326)}px;
	height: ${heightPercentage(64)}px;
`;
const SearchContainer = styled.View<{height: number}>`
	height: ${props => props.height}px;
`;
export const BottomContainer = styled.View<{height: number; gap?: number}>`
	width: ${widthPercentage(375)}px;
	height: ${props => props.height}px;
	background-color: ${colors.backgroundWhite};
	padding: ${heightPercentage(14)}px ${widthPercentage(24)}px;
	gap: ${props => props.gap ?? heightPercentage(15)}px;
`;
export const DefalutLogoContainer = styled.View`
	width: 100px;
	height: 100px;
	border-radius: 10px;
	background-color: ${colors.regionNormal};
	align-items: center;
	justify-content: center;
`;
const SearchPlaceContainer = styled(BackgroundGray).attrs({as: Pressable})``;

export const SearchClearContainer = styled.View`
	align-items: center;
	justify-content: center;
	margin: 0px 10px 0px 0px;
	width: 20%;
`;
const ButtonContainer = styled.View`
	flex: 1;
	align-items: center;
	justify-content: flex-end;
	padding-bottom: 10px;
`;
