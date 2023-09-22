import {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import CustomButton from '../../utill/component/custom-button';
import {BackHandler, Dimensions} from 'react-native';
import Slider from '@react-native-community/slider';
import {MainContainer, VStack, Divider} from '../../utill/layout/layout';
import StepText from '../../utill/component/enroll-info/step-text';
import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import {SvgMap} from '../../utill/svg/svg';
import {modalSliceActions} from '../../redux/modal/modalSlice';
export default function SelectDistance({navigation, setViewComponent}: any) {
	const {distance, region} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const [range, setRange] = useState(distance);
	const {width, height} = Dimensions.get('window');
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
	useEffect(() => {
		const backAction = () => {
			if (navigation.isFocused()) {
				dispatch(travelSliceActions.enrollDistance(range));
				navigation.goBack();
				return true;
			}
		};
		const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
		return () => backHandler.remove();
	}, [range]);
	return (
		<MainContainer showsVerticalScrollIndicator={false}>
			<StepText mainText='거리민감도 설정' subText='다님Ai는 거리 민감도를 통해 추천 여행 코스를 짜드려요' />
			<VStack>
				<MapContainer>
					<Qwe>
						<SvgMap />
					</Qwe>
					<CircleContainer size={range}></CircleContainer>
					<CircleCenter></CircleCenter>
				</MapContainer>
				<DistanceExplainContainer>
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
					<DistanceExplain>
						{range >= 5
							? '민감도가 높으면, 성향에 알맞은 여행 정보를 얻기 좋아요'
							: '민감도가 낮으면, 성향과는 조금 멀어질 수 있어요'}
					</DistanceExplain>
				</DistanceExplainContainer>
				<CustomButton label='결과 확인' onPress={goNext}></CustomButton>
			</VStack>
		</MainContainer>
	);
}

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
