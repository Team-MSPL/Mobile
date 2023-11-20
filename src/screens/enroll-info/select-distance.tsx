import {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import CustomButton from '../../utill/component/custom-button';
import {BackHandler, Dimensions} from 'react-native';
import Slider from '@react-native-community/slider';
import {HStack, MainContainer, VStack, devicesWidth} from '../../utill/layout/layout';
import StepText from '../../utill/component/enroll-info/step-text';
import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import {SvgMap} from '../../utill/svg/svg';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {ButtonContainer, MarginContainder} from './select-multi';
export default function SelectDistance({navigation, setViewComponent}: any) {
	const {distance, region} = useAppSelector(state => state.travelSlice);
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
							<SvgMap />
						</Qwe>
						<CircleContainer size={range}></CircleContainer>
						<CircleCenter></CircleCenter>
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
							style={{width: devicesWidth * 0.9, height: 40}}
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
							{range >= 5
								? '숫자가 높으면, 성향에 알맞은 여행 정보를 얻기 좋아요'
								: '숫자가 낮으면, 성향과는 조금 멀어질 수 있어요'}
						</DistanceExplain>
					</DistanceExplainContainer>
				</VStack>
				<MarginContainder />
			</MainContainer>
			<ButtonContainer>
				<CustomButton label='결과 확인' onPress={goNext}></CustomButton>
			</ButtonContainer>
		</>
	);
}

const DistanceCotainer = styled(HStack)`
	width: ${devicesWidth * 0.9}px;
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

export const DistanceExplain = styled.Text`
	font-size: 14px;
	font-weight: bold;
	color: black;
`;
const MapContainer = styled.View`
	width: 100%;
	height: 300px;
	align-items: center;
	justify-content: center;
`;
const Qwe = styled.View`
	width: 100%;
	height: 300px;
	position: absolute;
	align-items: center;
	justify-content: center;
`;
const CircleContainer = styled.View<{size: number}>`
	width: ${props => props.size * 20}px;
	height: ${props => props.size * 20}px;
	background-color: rgba(38, 152, 251, 0.3);
	position: absolute;
	border-radius: 99px;
	border-color: ${colors.selectButton};
	border-width: 1px;
`;
const CircleCenter = styled.View`
	width: 6px;
	height: 6px;
	background-color: ${colors.selectButton};
	position: absolute;
	border-radius: 99px;
`;
