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
import {DistanceCenter, DistanceSpace} from './select-distance';
export default function SelectPopularity({navigation, setViewComponent}: any) {
	const {region, popularSensitivity} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const [range, setRange] = useState(popularSensitivity ?? 5);
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
			: (dispatch(travelSliceActions.updateFiled({field: 'popularSensitivity', value: range})),
			  navigation.navigate('SelectDistance'));
	};
	const {socialloginProvider} = useAppSelector(state => state.userSlice);
	const handleGoogleAnalytics = async () => {
		socialloginProvider == 'anonymous'
			? await logEvent('anonymous_course_step6', {})
			: await logEvent('course_step6', {});
	};
	useEffect(() => {
		handleGoogleAnalytics();
	}, []);

	return (
		<>
			<BackgroundGrayScrollView>
				<Stepper total={13} now={12}></Stepper>
				<StepText
					marginTop={heightPercentage(10)}
					styleText='3.여행지의 인기도를 선택해주세요'
					mainText={`사람들이 자주 찾는 명소,${`\n`}얼마나 포함할까요?`}></StepText>

				<PopularityImageBox source={popularityImagelist[Math.round(range / 2) - 1]}></PopularityImageBox>
				<DistanceCenter>
					<DistanceSpace>
						<PretendardSemiBoldText size={12} lineHeight={14.32} color={colors.Gray3}>
							가장 덜 알려진
						</PretendardSemiBoldText>
						<PretendardSemiBoldText size={12} lineHeight={14.32} color={colors.Gray3}>
							가장 유명한
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
				<MarginContainder></MarginContainder>
			</BackgroundGrayScrollView>
			<ButtonContainer>
				<RouteButton navigation={navigation} nextTitle={'SelectDistance'} goNext={goNext}></RouteButton>
			</ButtonContainer>
		</>
	);
}

export const PopularityImageBox = styled.Image`
	width: ${widthPercentage(327)}px;
	height: ${widthPercentage(327)}px;
`;
export const popularityImagelist = [
	require('../../../public/images/popularity1.png'),
	require('../../../public/images/popularity2.png'),
	require('../../../public/images/popularity3.png'),
	require('../../../public/images/popularity4.png'),
	require('../../../public/images/popularity5.png'),
];
