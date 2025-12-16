import {useCallback, useEffect, useRef, useState} from 'react';
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
import {openSettings} from 'react-native-permissions';
import MapView, {Circle} from 'react-native-maps';
import Stepper from '../../../utill/component/enroll-info/stepper';
import {fontPercentage, heightPercentage, widthPercentage} from '../../../utill/layout/responsive-size';
import PrimaryButton from '../../../utill/component/primary-button';
import {logEvent} from '../../../../firebaseAnalytice';
import {SVGSearch} from '../../../utill/svg/svg';
import {userSliceActions} from '../../../redux/user/user.slice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {cityViewList} from '../../../utill/component/enroll-info/city-list';
import {useRegionSearch} from '../../../utill/hooks/useRegionSearch';
import {useTendencyHandler} from '../../../utill/hooks/useTendencyHandler';
export default function SelectDistance({navigation}: any) {
	const dispatch = useAppDispatch();
	const [regionText, setRegionText] = useState('');
	const [regionSearchState, setRegionSearchState] = useState(false);

	const [regionMatchList, setRegionMatchList] = useState<{id: number; lat: number; lng: number; subTitle: string}[]>(
		[],
	);
	const regionSearchRef = useRef<TextInput | null>(null);
	const [range, setRange] = useState(5);
	const {regionTendency, popularity} = useAppSelector(state => state.regionRecommendSlice);
	const {socialloginProvider} = useAppSelector(state => state.userSlice);
	const {country} = useAppSelector(state => state.travelSlice);
	const [geoInfo, setGeoInfo] = useState({
		lat: cityViewList[country][1].sub[0].lat,
		lng: cityViewList[country][1].sub[0].lng,
		name: `기본값:${cityViewList[country][1].sub[0].subTitle}`,
		default: true,
	});
	const countryMap: {[key: number]: number} = {
		0: 1,
		1: 1.5,
		2: 3,
		3: 0.25,
		4: 2,
		5: 2,
		6: 2,
	};
	let variableDistance = countryMap[country];
	//일본 1.5배 싱가포르 0.25 베트남 2
	const handleGoogleAnalytics = async () => {
		socialloginProvider == 'anonymous'
			? await logEvent('anontmous_place_step3', {})
			: await logEvent('place_step3', {});
	};
	const handleAnonymousLogin = async () => {
		await logEvent('anonymous_region_login', {});
	};
	const {handleRegionSerarch} = useRegionSearch();
	const handleRegionText = useCallback((e: string) => {
		setRegionText(e);
		setRegionMatchList(handleRegionSerarch(e));
	}, []);
	useEffect(() => {
		handleGoogleAnalytics();
	}, []);
	const {countryList} = useTendencyHandler();
	const goNext = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			let datas = {
				selectList: regionTendency,
				selectPopular: popularity,
				recentPosition: {lat: geoInfo.lat, lng: geoInfo.lng},
				distanceSensitivity: range,
				version: 3,
				country: countryList[country].en, //241129 추가 - 디폴트는 Korea
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
	const exceptionKeys = ['isFirstLaunch', 'noPermission'];
	const handleLogin = async () => {
		handleAnonymousLogin();
		dispatch(userSliceActions.setAnonymousKeep(true));
		await AsyncStorage.getAllKeys().then(allKeys => {
			const removeList = allKeys.filter(k => !exceptionKeys.some(ek => ek === k));
			AsyncStorage.multiRemove(removeList);
		});
		dispatch(userSliceActions.loginFalse());
		navigation.navigate('LoginScreen');
	};
	const handleNext = () => {
		socialloginProvider == 'anonymous'
			? dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '지금 로그인하시고 \n맞춤 여행 추천을 받아보세요!',
						modalTopText: '좋아요!',
						modalBottomText: '다음에 할게요',
						modalFunction: handleLogin,
					}),
			  )
			: goNext();
	};

	const checkToken = () => {
		handleNext();
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
	const searchRef = useRef();
	const [searchTop, setSearchTop] = useState(0);
	useEffect(() => {
		// 컴포넌트가 렌더링된 뒤 measure
		setTimeout(() => {
			searchRef.current?.measure((fx, fy, width, height, px, py) => {
				setSearchTop(py); // py는 화면 기준 Y 위치
			});
		}, 0); // 또는 InteractionManager.runAfterInteractions()
	}, []);
	return (
		<BackgroundGrayPressable
			onPress={() => {
				setRegionSearchState(false);
				Keyboard.dismiss();
			}}>
			<Stepper total={7} now={7}></Stepper>
			<StepText
				styleText='4.원하는 반경의 지역을 추천해드려요.'
				mainText={`현재 위치에서 추천받고자 하는\n여행 반경을 선택해 주세요`}
				subText={`그림은 이해를 돕기 위함으로\n실제 결과와는 차이가 있을 수 있습니다.`}></StepText>
			<RegionTextInputContainer ref={searchRef}>
				<SVGSearch color={colors.Primary} />
				<RegionTextInput
					ref={regionSearchRef}
					placeholder='다른 위치를 원하시면 검색해 주세요'
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
			<SearchContainer top={searchTop}>
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
				{/* {geoInfo.default && (
					<GeolocationGetContainer>
						<PrimaryButton
							backgroundColor={colors.Primary}
							textColor={colors.Gray5}
							onPress={goReverseGeocoding}
							width={widthPercentage(280)}
							height={heightPercentage(50)}
							label='위치정보 불러오기'></PrimaryButton>
					</GeolocationGetContainer>
				)} */}
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
							latitudeDelta: 8 * variableDistance,
							longitudeDelta: 8 * variableDistance,
						}}>
						<Circle
							center={{latitude: geoInfo.lat, longitude: geoInfo.lng}}
							style={{alignItems: 'center', justifyContent: 'center'}}
							fillColor='rgba(38, 152, 251, 0.3);'
							radius={range * 50000 * variableDistance}></Circle>
					</MapView>
				</Qwe>
			</MapContainer>
			<>
				<DistanceCenter>
					<DistanceSpace>
						<PretendardSemiBoldText size={12} lineHeight={15} color={colors.Gray3}>
							내 근처
						</PretendardSemiBoldText>
						<PretendardSemiBoldText size={12} lineHeight={15} color={colors.Gray3}>
							{country == 0 ? '한국 전체' : cityViewList[country][1].title + ' 전체'}
						</PretendardSemiBoldText>
					</DistanceSpace>
					<Slider
						style={{width: widthPercentage(347), height: 40}}
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
			<ButtonContainer>
				<CustomButton
					bgColor={colors.Primary}
					textColor={colors.Gray5}
					label='맞춤형 여행지를 확인해볼게요'
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
export const RegionTextInput = styled.TextInput<{backgroundColor?: string}>`
	width: ${widthPercentage(287)}px;
	height: ${heightPercentage(50)}px;
	background-color: ${props => props.backgroundColor ?? colors.backgroundWhite};
	border-radius: 10px;
	color: black;
	font-size: ${fontPercentage(16)}px;
`;
export const RegionTextInputContainer = styled.View<{borderColor?: string; backgroundColor?: string}>`
	flex-direction: row;
	align-items: center;
	background-color: ${props => props.backgroundColor ?? colors.backgroundWhite};
	border-radius: 22px;
	padding-horizontal: ${widthPercentage(10)}px;
	border-width: 2px;
	border-color: ${props => props.borderColor ?? colors.Primary};
	margin-vertical: ${widthPercentage(10)}px;
`;
export const SearchContainer = styled.View<{top?: number}>`
	position: absolute;
	align-self: center;
	z-index: 2;
	top: ${props => props.top}px;
	width: ${widthPercentage(327)}px;
	max-height: ${heightPercentage(150)}px;
	background-color: ${colors.backgroundWhite};
`;
export const SearchElements = styled.TouchableOpacity`
	width: ${widthPercentage(327)}px;
	height: ${heightPercentage(50)}px;
	border-color: ${colors.Gray3};
	border-top-width: 1px;
	padding-horizontal: 35px;
	justify-content: center;
	background-color: ${colors.backgroundWhite};
	z-index: 2;
`;
