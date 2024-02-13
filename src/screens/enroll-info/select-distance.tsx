import {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import CustomButton from '../../utill/component/custom-button';
import Slider from '@react-native-community/slider';
import {
	HStack,
	MainContainer,
	PretendardSemiBold,
	PretendardVariable,
	VStack,
	devicesHeight,
	devicesWidth,
} from '../../utill/layout/layout';
import StepText from '../../utill/component/enroll-info/step-text';
import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import {SvgMap, SvgPlace} from '../../utill/svg/svg';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {ButtonContainer, MarginContainder} from './select-multi';
import MapView, {Circle, Marker, Polyline} from 'react-native-maps';
import {cityViewList} from './select-city';
import {fontPercentage, heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
export default function SelectDistance({navigation, setViewComponent}: any) {
	const {distance, region, cityIndex, cityDistance} = useAppSelector(state => state.travelSlice);
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
	return (
		<>
			<MainContainer showsVerticalScrollIndicator={false}>
				<StepText mainText='여행 반경 설정' subText='선택하신 지역에서의 여행 반경을 설정해주세요' />

				<VStack>
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
									latitude: cityViewList[cityIndex].sub[cityDistance[0]].lat,
									longitude: cityViewList[cityIndex].sub[cityDistance[0]].lng,
									latitudeDelta: cityDistance[0] == 0 ? 0.8 : 0.2,
									longitudeDelta: cityDistance[0] == 0 ? 0.8 : 0.2,
								}}>
								<Circle
									center={{
										latitude: cityViewList[cityIndex].sub[cityDistance[0]].lat,
										longitude: cityViewList[cityIndex].sub[cityDistance[0]].lng,
									}}
									style={{alignItems: 'center', justifyContent: 'center'}}
									fillColor='rgba(38, 152, 251, 0.3);'
									radius={range * (cityDistance[0] == 0 ? 5000 : 1500)}></Circle>
							</MapView>
						</Qwe>
					</MapContainer>
					<DistanceExplainContainer>
						<DistanceCotainer>
							{[...Array(10)].map((item, idx) => (
								<DistanceText check={range == idx + 1} key={idx}>
									{idx + 1}
								</DistanceText>
							))}
						</DistanceCotainer>
						<Slider
							style={{width: devicesWidth * 0.8, height: 40}}
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
						<DistanceExplain>
							*그림은 이해를 돕기위함으로 실제 결과와는 차이가 있을 수 있습니다.
						</DistanceExplain>
					</DistanceExplainContainer>
				</VStack>
				<MarginContainder />
			</MainContainer>
			<ButtonContainer>
				<CustomButton label='선택 완료' onPress={goNext}></CustomButton>
			</ButtonContainer>
		</>
	);
}

const DistanceCotainer = styled(HStack)`
	width: ${devicesWidth * 0.8}px;
	justify-content: space-between;
`;
const DistanceText = styled.Text<{check: boolean}>`
	font-size: 18px;
	font-weight: 500;
	color: ${props => (props.check ? 'black' : colors.selectButton)};
`;
const DistanceExplainContainer = styled.View`
	width: 100%;
	justify-content: center;
	align-items: center;
`;

export const DistanceExplain = styled(PretendardSemiBold)`
	font-size: ${fontPercentage(12)}px;
	font-weight: 600;
	color: ${colors.Gray3};
	ling-height: 14.4px;
`;
export const MapContainer = styled.View`
	width: ${widthPercentage(327)}px;
	height: ${heightPercentage(240)}px;
	align-self: center;
	justify-content: center;
	margin-top: ${heightPercentage(37)}px;
`;
export const Qwe = styled.View`
	width: ${widthPercentage(327)}px;
	height: ${heightPercentage(240)}px;
	position: absolute;
	align-items: center;
	justify-content: center;
`;
export const CircleContainer = styled.View<{size: number}>`
	width: ${props => props.size * 20}px;
	height: ${props => props.size * 20}px;
	background-color: rgba(38, 152, 251, 0.3);
	position: absolute;
	border-radius: 99px;
	border-color: ${colors.selectButton};
	border-width: 1px;
`;
export const CircleCenter = styled.View`
	width: 6px;
	height: 6px;
	background-color: ${colors.selectButton};
	position: absolute;
	border-radius: 99px;
`;
