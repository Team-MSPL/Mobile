import {MutableRefObject, useCallback, useEffect, useRef, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../redux';
import CustomButton from '../../../utill/component/custom-button';
import {reverseGeocoding, regionSearch} from '../../../redux/travel-info/region-recommend.slice';
import Geolocation from 'react-native-geolocation-service';
import {Platform, PermissionsAndroid, ScrollView, TextInput, TextInputProps, Pressable, Keyboard} from 'react-native';
import {BackgroundGray, PretendardSemiBoldText} from '../../../utill/layout/layout';

import Slider from '@react-native-community/slider';
import StepText from '../../../utill/component/enroll-info/step-text';
import {LoadingSliceActions} from '../../../redux/loading/loading.slice';
import {DistanceCenter, DistanceSpace, MapContainer, Qwe} from '../select-distance';
import styled from 'styled-components/native';
import {colors} from '../../../utill/colors';
import {modalSliceActions} from '../../../redux/modal/modalSlice';
import {useFocusEffect} from '@react-navigation/native';
import {updateFunctionToken, userSliceActions} from '../../../redux/user/user.slice';
import {openSettings} from 'react-native-permissions';
import MapView, {Circle} from 'react-native-maps';
import Stepper from '../../../utill/component/enroll-info/stepper';
import {heightPercentage, widthPercentage} from '../../../utill/layout/responsive-size';
import PrimaryButton from '../../../utill/component/primary-button';
import {logEvent} from '../../../../firebaseAnalytice';
import {SVGSearch} from '../../../utill/svg/svg';
import {cityViewList} from '../select-city';
export default function SelectDistance({navigation}: any) {
	const dispatch = useAppDispatch();
	const [regionText, setRegionText] = useState('');
	const [regionSearchState, setRegionSearchState] = useState(false);
	const [regionMatchList, setRegionMatchList] = useState<{id: number; lat: number; lng: number; subTitle: string}[]>(
		[],
	);
	const regionSearchRef = useRef<TextInput | null>(null);
	const [range, setRange] = useState(5);
	const [geoInfo, setGeoInfo] = useState({lat: 37.552987017, lng: 126.972591728, name: '기본값:서울역'});
	const {functionToken, signUpReward} = useAppSelector(state => state.userSlice);
	const {regionTendency, popularity} = useAppSelector(state => state.regionRecommendSlice);
	const handleGoogleAnalytics = async () => {
		await logEvent('place_step3', {});
	};
	const filterList = ['도심권', '동남권', '동북권', '서남권', '서북권'];
	const searchRegionList = cityViewList
		.map((item, index) => {
			if (index != 0) {
				return item.sub.map((value, idx) => {
					if (value.subTitle == '전체') {
						let copy = {...value, subTitle: item.title};
						return copy;
					} else {
						return value;
					}
				});
			}
		})
		.filter(item => item != undefined)
		.reduce(function (acc, cur) {
			return [...acc, ...cur];
		})
		?.filter(item => !filterList.includes(item?.subTitle));
	const handleRegionMatch = useCallback((e: {id: number; lat: number; lng: number; subTitle: string}[]) => {
		setRegionMatchList(e);
	}, []);
	const handleRegionText = useCallback((e: string) => {
		setRegionText(e);
		handleRegionMatch(searchRegionList?.filter((item, index) => item.subTitle.includes(e)));
	}, []);
	useEffect(() => {
		handleGoogleAnalytics();
	}, []);
	const goNext = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			let datas = {
				selectList: regionTendency,
				selectPopular: popularity,
				recentPosition: {lat: geoInfo.lat, lng: geoInfo.lng},
				distanceSensitivity: range,
				version: 2,
			};
			const result = await dispatch(regionSearch(datas)).unwrap();
			if (result.length != 0) {
				// dispatch(updateFunctionToken({functionToken: functionToken - 1}));
				navigation.popToTop();
				navigation.navigate('RegionViewResult');
			} else {
				dispatch(
					modalSliceActions.setOpenModal({
						modalSubTitle:
							'적절한 여행지를 찾지못하였습니다.\n성향,여행 반경 등을 조금 조절한 후 다시 시도해주세요.',
					}),
				);
			}
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalSubTitle:
						'적절한 여행지를 찾지못하였습니다.\n성향,여행 반경 등을 조금 조절한 후 다시 시도해주세요.',
				}),
			);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const checkSignUpReward = () => {
		dispatch(userSliceActions.setSignUpReward(false));
	};
	// useFocusEffect(
	// 	useCallback(() => {
	// 		if (signUpReward) {
	// 			dispatch(
	// 				modalSliceActions.setOpenModal({
	// 					modalTitle: '회원가입 축하드립니다',
	// 					modalSubTitle: `회원가입 기념 이용권을 드렸습니다. ${functionToken}개 입니다.\n이용권은 추천 기능에 사용됩니다.`,
	// 					modalFunction: checkSignUpReward,
	// 				}),
	// 			);
	// 		}
	// 	}, [signUpReward]),
	// );
	const goPayment = async () => {
		navigation.navigate('Payment');
	};
	const checkToken = () => {
		goNext();
		// functionToken >= 1
		// 	? dispatch(
		// 			modalSliceActions.setOpenModal({
		// 				modalTitle: `이용권이 하나 소모됩니다.`,
		// 				modalSubTitle: `현재 이용권은 ${functionToken}개입니다. 사용하시겠습니까?`,
		// 				modalFunction: goNext,
		// 				modalLeft: true,
		// 			}),
		// 	  )
		// 	: dispatch(
		// 			modalSliceActions.setOpenModal({
		// 				modalTitle: '이용권이 부족합니다. 결제창으로 가시겠습니까?',
		// 				modalFunction: goPayment,
		// 				modalLeft: true,
		// 			}),
		// 	  );
	};
	const requestPermission = async () => {
		try {
			if (Platform.OS === 'ios') {
				return await Geolocation.requestAuthorization('always');
			}
			// 안드로이드 위치 정보 수집 권한 요청
			if (Platform.OS === 'android') {
				return await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
			}
		} catch (e) {
			console.log(e);
		}
	};
	const goPermission = async () => {
		await openSettings();
	};
	const goReverseGeocoding = async () => {
		dispatch(LoadingSliceActions.onLoading());
		await requestPermission().then(async result => {
			if (result === 'granted') {
				Geolocation.getCurrentPosition(
					async position => {
						try {
							const {latitude, longitude} = position.coords;
							const latlng = latitude + ',' + longitude;
							const result = await dispatch(reverseGeocoding({latlng: latlng})).unwrap();
							const latlngData = {
								lat: result.results[0].geometry.location.lat,
								lng: result.results[0].geometry.location.lng,
								name: result.results[0].formatted_address,
							};
							setGeoInfo(latlngData);
						} catch {
						} finally {
							dispatch(LoadingSliceActions.offLoading());
						}
					},
					error => {
						// See error code charts below.
						console.log(error.code, error.message);
					},
					{enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
				);
			} else {
				dispatch(LoadingSliceActions.offLoading());
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '권한 설정',
						modalSubTitle: '현재 권한이 거부된 상태입니다.\n위치 정보 권한을 설정하러 가시겠습니까?',
						modalLeft: true,
						modalFunction: goPermission,
					}),
				);
			}
		});
	};

	return (
		<BackgroundGrayPressable
			onPress={() => {
				setRegionSearchState(false);
				Keyboard.dismiss();
			}}>
			<Stepper total={7} now={7}></Stepper>
			<StepText
				styleText='3.원하는 반경의 지역을 추천해드려요.'
				mainText='현재 위치에서 추천받고자 하는 여행 반경을 선택해 주세요'
				subText={`그림은 이해를 돕기 위함으로\n실제 결과와는 차이가 있을 수 있습니다.`}></StepText>
			<RegionTextInputContainer>
				<SVGSearch />
				<RegionTextInput
					ref={regionSearchRef}
					placeholder='다른 지역 기준으로 추천받기 (검색)'
					value={regionText}
					// onBlur={() => {
					// 	setRegionSearchState(false);
					// }}
					onFocus={() => {
						setRegionSearchState(true);
					}}
					placeholderTextColor={colors.Gray3}
					onChangeText={e => {
						handleRegionText(e);
					}}></RegionTextInput>
			</RegionTextInputContainer>
			<SearchContainer>
				<ScrollView style={{zIndex: 2}}>
					{regionSearchState &&
						regionMatchList.map((item, index) => {
							return (
								<SearchElements
									key={index}
									onPress={() => {
										const latlngData = {
											lat: item.lat,
											lng: item.lng,
											name: item.subTitle,
										};
										setGeoInfo(latlngData);
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
			<MapContainer>
				{geoInfo.name == '기본값:서울역' && (
					<GeolocationGetContainer>
						<PrimaryButton
							backgroundColor={colors.Primary}
							textColor={colors.Gray5}
							onPress={goReverseGeocoding}
							width={widthPercentage(280)}
							height={heightPercentage(50)}
							label='위치정보 불러오기'></PrimaryButton>
					</GeolocationGetContainer>
				)}
				<Qwe>
					<MapView
						showsMyLocationButton={false}
						showsUserLocation={false}
						style={{
							width: widthPercentage(327),
							height: heightPercentage(240),
							position: 'absolute',
						}}
						region={{
							latitude: geoInfo.lat,
							longitude: geoInfo.lng,
							latitudeDelta: 8,
							longitudeDelta: 8,
						}}>
						{geoInfo.name != '기본값:서울역' && (
							<Circle
								center={{latitude: geoInfo.lat, longitude: geoInfo.lng}}
								style={{alignItems: 'center', justifyContent: 'center'}}
								fillColor='rgba(38, 152, 251, 0.3);'
								radius={range * 50000}></Circle>
						)}
					</MapView>
				</Qwe>
			</MapContainer>
			{geoInfo.name != '기본값:서울역' && (
				<>
					<DistanceCenter>
						<DistanceSpace>
							<PretendardSemiBoldText size={12} lineHeight={15} color={colors.Gray3}>
								내 근처
							</PretendardSemiBoldText>
							<PretendardSemiBoldText size={12} lineHeight={15} color={colors.Gray3}>
								한국 전체
							</PretendardSemiBoldText>
						</DistanceSpace>
						<Slider
							style={{width: '100%', height: 40}}
							minimumValue={1}
							maximumValue={10}
							minimumTrackTintColor={colors.Primary}
							maximumTrackTintColor={colors.Gray2}
							thumbTintColor={colors.Primary}
							value={range}
							step={1}
							onValueChange={item => {
								setRange(item);
							}}
						/>
					</DistanceCenter>
				</>
			)}
			<ButtonContainer>
				<CustomButton
					label='맞춤형 여행지를 확인해볼게요!'
					onPress={checkToken}
					marginBottom={12}></CustomButton>
			</ButtonContainer>
		</BackgroundGrayPressable>
	);
}
const BackgroundGrayPressable = styled(BackgroundGray).attrs({as: Pressable})``;
const GeolocationGetContainer = styled.View`
	width: ${widthPercentage(327)}px;
	height: ${heightPercentage(240)}px;
	position: absolute;
	background-color: rgba(112, 118, 142, 0.6);
	z-index: 1;
	align-items: center;
	justify-content: flex-end;
	padding-bottom: ${heightPercentage(20)}px;
`;
const ButtonContainer = styled.View`
	flex: 1;
	align-items: center;
	justify-content: flex-end;
	margin-bottom: 2px;
`;
const RegionTextInput = styled.TextInput`
	width: ${widthPercentage(327)}px;
	height: ${heightPercentage(50)}px;
	background-color: ${colors.backgroundWhite};
	border-radius: 10px;
	color: black;
`;
const RegionTextInputContainer = styled.View`
	flex-direction: row;
	align-items: center;
	background-color: ${colors.backgroundWhite};
	border-radius: 10px;
	padding-horizontal: ${widthPercentage(10)}px;
`;
const SearchContainer = styled.View`
	position: absolute;
	align-self: center;
	z-index: 2;
	top: ${heightPercentage(237)}px;
	width: ${widthPercentage(327)}px;
	max-height: ${heightPercentage(150)}px;
	background-color: ${colors.backgroundWhite};
`;
const SearchElements = styled.TouchableOpacity`
	width: ${widthPercentage(327)}px;
	height: ${heightPercentage(50)}px;
	border-color: ${colors.Gray3};
	border-top-width: 1px;
	padding-horizontal: 35px;
	justify-content: center;
	background-color: ${colors.backgroundWhite};
	z-index: 2;
`;
