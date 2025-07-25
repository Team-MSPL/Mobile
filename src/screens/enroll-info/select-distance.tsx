import {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import CustomButton from '../../utill/component/custom-button';
import Slider from '@react-native-community/slider';
import {BackgroundGray, BackgroundGrayScrollView, PretendardSemiBoldText} from '../../utill/layout/layout';
import StepText from '../../utill/component/enroll-info/step-text';
import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {ButtonContainer, MarginContainder} from './select-multi';
import MapView, {Circle} from 'react-native-maps';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import Stepper from '../../utill/component/enroll-info/stepper';
import {logEvent} from '../../../firebaseAnalytice';
import {cityViewList} from '../../utill/component/enroll-info/city-list';
import RouteButton from '../../utill/component/route-button';
export default function SelectDistance({navigation, setViewComponent}: any) {
	const {distance, region, cityIndex, cityDistance, country} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const [range, setRange] = useState(distance);
	const goRegionSelect = () => {
		setViewComponent(2);
	};
	const goNext = () => {
		region.length == 0
			? dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '지역 선택을 안하셨습니다.',
						modalFunction: goRegionSelect,
					}),
			  )
			: (dispatch(travelSliceActions.enrollDistance(range)), navigation.navigate('FinalCheck'));
	};
	const {socialloginProvider} = useAppSelector(state => state.userSlice);
	const handleGoogleAnalytics = async () => {
		socialloginProvider == 'anonymous'
			? await logEvent('anonymous_course_step5', {})
			: await logEvent('course_step5', {});
	};
	useEffect(() => {
		handleGoogleAnalytics();
	}, []);
	return (
		<BackgroundGrayScrollView>
			<Stepper total={13} now={13}></Stepper>
			<StepText
				marginTop={heightPercentage(10)}
				styleText='3.여행 반경 스타일을 알아볼게요.'
				mainText='선택하신 지역에서의 여행 반경을 설정해주세요'
				subText={`그림은 이해를 돕기 위함으로\n실제 결과와는 차이가 있을 수 있습니다.`}></StepText>

			<MapContainer>
				<Qwe>
					<MapView
						//provider={PROVIDER_GOOGLE}
						showsMyLocationButton={false}
						showsUserLocation={false}
						style={{
							width: widthPercentage(327),
							height: heightPercentage(240),
							position: 'absolute',
						}}
						region={{
							latitude: cityViewList[country][cityIndex].sub[cityDistance[0]].lat,
							longitude: cityViewList[country][cityIndex].sub[cityDistance[0]].lng,
							latitudeDelta: cityDistance[0] == 0 ? 0.8 : 0.2,
							longitudeDelta: cityDistance[0] == 0 ? 0.8 : 0.2,
						}}>
						<Circle
							center={{
								latitude: cityViewList[country][cityIndex].sub[cityDistance[0]].lat,
								longitude: cityViewList[country][cityIndex].sub[cityDistance[0]].lng,
							}}
							style={{alignItems: 'center', justifyContent: 'center'}}
							fillColor='rgba(38, 152, 251, 0.3);'
							radius={range * (cityDistance[0] == 0 ? 5000 : 1500)}></Circle>
					</MapView>
				</Qwe>
			</MapContainer>
			<DistanceCenter>
				<DistanceSpace>
					<PretendardSemiBoldText size={12} lineHeight={14.32} color={colors.Gray3}>
						내 근처
					</PretendardSemiBoldText>
					<PretendardSemiBoldText size={12} lineHeight={14.32} color={colors.Gray3}>
						전체
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
			<MarginContainder></MarginContainder>

			<RouteButton navigation={navigation} nextTitle={'FinalCheck'} goNext={goNext}></RouteButton>
		</BackgroundGrayScrollView>
	);
}

export const MapContainer = styled.View`
	width: ${widthPercentage(327)}px;
	height: ${heightPercentage(240)}px;
	align-self: center;
	justify-content: center;
	margin-top: ${heightPercentage(27)}px;
`;
export const Qwe = styled.View`
	width: ${widthPercentage(327)}px;
	height: ${heightPercentage(240)}px;
	position: absolute;
	align-items: center;
	justify-content: center;
	border-radius: 8px;
	overflow: hidden;
`;
export const DistanceSpace = styled.View`
	width: 95%;
	flex-direction: row;
	justify-content: space-between;
`;
export const DistanceCenter = styled.View`
	align-items: center;
	margin-top: ${heightPercentage(10)}px;
`;
