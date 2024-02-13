import {useAppDispatch, useAppSelector} from '../../../redux';
import CustomButton from '../../../utill/component/custom-button';
import {regionRecommendSliceActions} from '../../../redux/travel-info/region-recommend.slice';
import {BackgroundGray, HStack, MainContainer, PretendardBold, PretendardVariable} from '../../../utill/layout/layout';
import StepText from '../../../utill/component/enroll-info/step-text';
import {colors} from '../../../utill/colors';
import styled from 'styled-components/native';
import Stepper from '../../../utill/component/enroll-info/stepper';
import {fontPercentage, heightPercentage, widthPercentage} from '../../../utill/layout/responsive-size';
import RangeSlider from 'rn-range-slider';
import {useCallback, useRef} from 'react';
export default function SelectPopularity({navigation}: any) {
	const dispatch = useAppDispatch();
	const {isLoading} = useAppSelector(state => state.loadingSlice);

	const goNext = async () => {
		dispatch(
			regionRecommendSliceActions.enrollPopularity([rangeRef.current.low * 20, rangeRef.current.hight * 20]),
		);
		navigation.navigate('RegionSelectDistance');
	};
	const rangeRef = useRef({low: 1, hight: 5});
	if (isLoading) return <MainContainer></MainContainer>;
	return (
		<BackgroundGray>
			<Stepper total={7} now={6}></Stepper>
			<StepText
				styleText='2.여행지의 인기도를 선택해주세요.'
				mainText={'가고자 하는 여행지가 \n어떤 느낌이었으면 하나요?'}></StepText>
			<Info>* 인기도의 기준은 각 지역별 여행객 수 통계를 참조했어요.</Info>
			<BarContainer>
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
				<SpaceHstack>
					<BarExplainText>가장 이색적인</BarExplainText>
					<BarExplainText>가장 유명한</BarExplainText>
				</SpaceHstack>
			</BarContainer>

			<ButtonContainer>
				<CustomButton label='다음' onPress={goNext} marginBottom={12}></CustomButton>
			</ButtonContainer>
		</BackgroundGray>
	);
}
const SpaceHstack = styled.View`
	width: ${widthPercentage(300)}px;
	justify-content: space-between;
	flex-direction: row;
	align-self: center;
	margin-top: ${heightPercentage(5)}px;
`;
const ButtonContainer = styled.View`
	flex: 1;
	justify-content: flex-end;
`;
const BarExplainText = styled(PretendardBold)`
	font-size: ${fontPercentage(12)}px;
	color: ${colors.Gray4};
`;
const ThumbInside = styled.View`
	width: ${widthPercentage(15.53)}px;
	height: ${widthPercentage(15.53)}px;
	background-color: ${colors.Blue3};
	border-width: 2.12px;
	border-color: ${colors.backgroundWhite};
	border-radius: 99px;
`;
const Thumb = styled.View`
	width: ${widthPercentage(24)}px;
	height: ${widthPercentage(24)}px;
	background-color: rgba(132, 255, 3, 0.3);
	align-items: center;
	border-radius: 99px;
	justify-content: center;
`;
const SelectRail = styled.View`
	height: ${heightPercentage(10)}px;
	background-color: ${colors.Blue3};
	border-radius: 6px;
`;
const BarContainer = styled.View`
	width: ${widthPercentage(300)}px;
	align-self: center;
	border-radius: 6px;
	margin-vertical: ${heightPercentage(30)}px;
`;
const Rail = styled.View`
	width: 100%;
	height: ${heightPercentage(10)}px;
	background-color: ${colors.Gray1};
	border-radius: 6px;
`;

const Info = styled(PretendardVariable)`
	font-size: ${fontPercentage(14)}px;
	color: ${colors.Gray4};
	align-self: center;
`;
