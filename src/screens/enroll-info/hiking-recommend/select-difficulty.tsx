import {useRef, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {BackgroundGray, Center, PretendardSemiBoldText} from '../../../utill/layout/layout';
import Stepper from '../../../utill/component/enroll-info/stepper';
import StepText from '../../../utill/component/enroll-info/step-text';
import {heightPercentage, widthPercentage} from '../../../utill/layout/responsive-size';
import {colors} from '../../../utill/colors';
import Slider from '@react-native-community/slider';
import {ButtonContainer} from '../select-multi';
import CustomButton from '../../../utill/component/custom-button';
import styled from 'styled-components/native';
import RangeSlider from 'rn-range-slider';
import {Rail, SelectRail, Thumb, ThumbInside} from '../region-recommend/select-popularity';
import {hikingSearch} from '../../../redux/travel-info/hiking.slice';
import {LoadingSliceActions} from '../../../redux/loading/loading.slice';

export default function HikingSelectDifficulty({navigation, setViewComponent}: any) {
	const {selectDifficulty, mountainName, selectList} = useAppSelector(state => state.hikingSlice);
	const dispatch = useAppDispatch();
	const goNext = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			let data = {
				mountainName: mountainName,
				selectList: selectList,
				selectDifficulty: [rangeRef.current.low, rangeRef.current.hight],
			};
			const result = await dispatch(hikingSearch(data));
			navigation.popToTop();
			navigation.navigate('HikingViewResult');
		} catch {
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const rangeRef = useRef({low: 1, hight: 5});
	return (
		<BackgroundGray>
			<Stepper total={3} now={3}></Stepper>
			<StepText
				marginTop={heightPercentage(10)}
				styleText='2.탐방 코스의 난이도를 선택해주세요.'
				mainText='어느 정도의 난이도가 있는 탐방 코스로 떠나고 싶으신가요?'
				subText={`난이도를 최우선으로 고려하여 추천드려요`}></StepText>
			<RangeSlider
				min={1}
				max={5}
				step={1}
				minRange={1}
				renderRail={() => <Rail />}
				renderThumb={() => (
					<Thumb>
						<ThumbInside></ThumbInside>
					</Thumb>
				)}
				onValueChanged={(low, high) => {
					rangeRef.current.low = low;
					rangeRef.current.hight = high;
				}}
				renderRailSelected={() => <SelectRail />}></RangeSlider>
			<DistanceSpace>
				<PretendardSemiBoldText size={12} lineHeight={14.32} color={colors.Gray3}>
					난이도 하{`\n`}(단거리)
				</PretendardSemiBoldText>
				<PretendardSemiBoldText size={12} lineHeight={14.32} color={colors.Gray3}>
					난이도 상{`\n`}(장거리)
				</PretendardSemiBoldText>
			</DistanceSpace>
			<ButtonContainer>
				<CustomButton label='맞춤형 여행일정을 확인해볼게요!' onPress={goNext}></CustomButton>
			</ButtonContainer>
		</BackgroundGray>
	);
}

const DistanceSpace = styled.View`
	width: 100%;
	flex-direction: row;
	justify-content: space-between;
	margin-top: ${heightPercentage(10)}px;
`;
