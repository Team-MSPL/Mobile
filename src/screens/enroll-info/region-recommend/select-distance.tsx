import {useCallback, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../redux';
import CustomButton from '../../../utill/component/custom-button';
import {reverseGeocoding, regionSearch} from '../../../redux/travel-info/region-recommend.slice';
import Geolocation from 'react-native-geolocation-service';
import {Platform, PermissionsAndroid} from 'react-native';
import {MainContainer, Center, Divider, MainText, HStack} from '../../../utill/layout/layout';

import Slider from '@react-native-community/slider';
import StepText from '../../../utill/component/enroll-info/step-text';
import {LoadingSliceActions} from '../../../redux/loading/loading.slice';
import {CircleCenter, CircleContainer, DistanceExplain, MapContainer, Qwe} from '../select-distance';
import styled from 'styled-components/native';
import {colors} from '../../../utill/colors';
import {modalSliceActions} from '../../../redux/modal/modalSlice';
import {useFocusEffect} from '@react-navigation/native';
import {updateFunctionToken, userSliceActions} from '../../../redux/user/user.slice';
import {useAppsflyer} from '../../../utill/hooks/useAppsflyer';
import {openSettings} from 'react-native-permissions';
import MapView, {Circle} from 'react-native-maps';
export default function SelectDistance({navigation}: any) {
	const dispatch = useAppDispatch();
	const [range, setRange] = useState(10);
	const [geoInfo, setGeoInfo] = useState({lat: 37.552987017, lng: 126.972591728, name: '기본값:서울역'});
	const {functionToken, socialloginProvider, signUpReward} = useAppSelector(state => state.userSlice);
	const {tendency, popularity} = useAppSelector(state => state.regionRecommendSlice);

	const {appsflyerLogEvent} = useAppsflyer();
	const goNext = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			appsflyerLogEvent({name: 'travle_recommend_excute', value: {id: 'danim'}});
			let datas = {
				selectList: tendency,
				selectPopular: popularity,
				recentPosition: {lat: geoInfo.lat, lng: geoInfo.lng},
				distanceSensitivity: range,
				version: 2,
			};
			const result = await dispatch(regionSearch(datas)).unwrap();
			if (result.length != 0) {
				dispatch(updateFunctionToken({functionToken: functionToken - 1}));
				navigation.popToTop();
				navigation.navigate('RegionViewResult');
			} else {
				dispatch(
					modalSliceActions.setOpenModal({
						modalSubTitle:
							'적절한 여행지를 찾지못하였습니다.\n이용권은 차감되지않습니다.\n성향,여행 반경 등을 조금 조절한 후 다시 시도해주세요.',
					}),
				);
			}
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalSubTitle:
						'적절한 여행지를 찾지못하였습니다.\n이용권은 차감되지않습니다.\n성향,여행 반경 등을 조금 조절한 후 다시 시도해주세요.',
				}),
			);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const checkSignUpReward = () => {
		dispatch(userSliceActions.setSignUpReward(false));
	};
	useFocusEffect(
		useCallback(() => {
			if (signUpReward) {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '회원가입 축하드립니다',
						modalSubTitle: `회원가입 기념 이용권을 드렸습니다. ${functionToken}개 입니다.\n이용권은 추천 기능에 사용됩니다.`,
						modalFunction: checkSignUpReward,
					}),
				);
			}
		}, [signUpReward]),
	);
	const goNewLogin = () => {
		dispatch(userSliceActions.setAnonymousKeep(true));
		navigation.navigate('LoginScreen');
	};
	const goPayment = async () => {
		navigation.navigate('Payment');
	};
	const checkToken = () => {
		if (socialloginProvider == 'anonymous') {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '로그인 없이는 이용 불가합니다',
					modalSubTitle: '로그인 하러 가시겠습니까?',
					modalFunction: goNewLogin,
					modalLeft: true,
				}),
			);
		} else {
			functionToken >= 1
				? dispatch(
						modalSliceActions.setOpenModal({
							modalTitle: `이용권이 하나 소모됩니다.`,
							modalSubTitle: `현재 이용권은 ${functionToken}개입니다. 사용하시겠습니까?`,
							modalFunction: goNext,
							modalLeft: true,
						}),
				  )
				: dispatch(
						modalSliceActions.setOpenModal({
							modalTitle: '이용권이 부족합니다. 결제창으로 가시겠습니까?',
							modalFunction: goPayment,
							modalLeft: true,
						}),
				  );
		}
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
		try {
			dispatch(LoadingSliceActions.onLoading());
			requestPermission().then(result => {
				if (result === 'granted') {
					Geolocation.getCurrentPosition(
						async position => {
							const {latitude, longitude} = position.coords;
							const latlng = latitude + ',' + longitude;
							const result = await dispatch(reverseGeocoding({latlng: latlng})).unwrap();
							const latlngData = {
								lat: result.results[0].geometry.location.lat,
								lng: result.results[0].geometry.location.lng,
								name: result.results[0].formatted_address,
							};
							setGeoInfo(latlngData);
							dispatch(LoadingSliceActions.offLoading());
						},
						error => {
							// See error code charts below.
							dispatch(LoadingSliceActions.offLoading());
							console.log(error.code, error.message);
						},
						{enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
					);
				} else {
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
		} catch (err) {
			console.log('에러요', err);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	return (
		<MainContainer>
			<StepText
				mainText='지역 추천 반경 설정'
				subText='본인의 위치에서 추천받고자하는 여행 반경을 설정해주세요'
			/>
			<Center>
				<GetContainer onPress={goReverseGeocoding}>
					<GetContainerText>위치정보 받아오기</GetContainerText>
				</GetContainer>
				<GetText>{geoInfo.name}</GetText>
			</Center>
			<DistanceDivider />
			<MapContainer>
				<Qwe>
					<MapView
						//provider={PROVIDER_GOOGLE}
						showsMyLocationButton={false}
						showsUserLocation={false}
						style={{width: '100%', height: 300, position: 'absolute'}}
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
						<Slider
							style={{width: '100%', height: 40}}
							minimumValue={1}
							maximumValue={10}
							minimumTrackTintColor='#123123'
							maximumTrackTintColor='#000000'
							value={range}
							step={1}
							onValueChange={item => {
								setRange(item);
							}}
						/>
						<DistanceSpace>
							<DistanceExplain>내 근처</DistanceExplain>
							<DistanceExplain>한국 전체</DistanceExplain>
						</DistanceSpace>
					</DistanceCenter>
					{/* <DistanceDivider /> */}
					<DistanceExplain>
						*그림은 이해를 돕기위함으로 실제 결과와는 차이가 있을 수 있습니다.
					</DistanceExplain>
				</>
			)}

			<CustomButton label='선택 완료' onPress={checkToken}></CustomButton>
		</MainContainer>
	);
}
const DistanceDivider = styled(Divider)`
	background-color: ${colors.regionNormal};
`;
const DistanceCenter = styled(Center)`
	margin: 20px 0px 20px 0px;
`;
const DistanceText = styled(MainText)`
	font-size: 14px;
	margin: 10px 0px 10px 0px;
`;
const GetContainer = styled.TouchableOpacity`
	padding: 10px;
	border-radius: 10px;
	align-items: center;
	background-color: ${colors.selectButton};
`;
const GetContainerText = styled.Text`
	font-size: 15px;
	font-weight: bold;
	color: white;
`;
const GetText = styled.Text`
	font-size: 15px;
	font-weight: bold;
	color: black;
	margin: 10px 0px 0px 0px;
`;
const DistanceSpace = styled.View`
	width: 100%;
	flex-direction: row;
	justify-content: space-between;
`;
