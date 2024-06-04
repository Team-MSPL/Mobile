import {useAppDispatch, useAppSelector} from '../../../redux';
import CustomButton from '../../../utill/component/custom-button';
import {regionRecommendSliceActions} from '../../../redux/travel-info/region-recommend.slice';
import {BackgroundGray, MainContainer, PretendardSemiBoldText} from '../../../utill/layout/layout';
import StepText from '../../../utill/component/enroll-info/step-text';
import {colors} from '../../../utill/colors';
import styled from 'styled-components/native';
import Stepper from '../../../utill/component/enroll-info/stepper';
import {heightPercentage, widthPercentage} from '../../../utill/layout/responsive-size';
import RangeSlider from 'rn-range-slider';
import {useRef} from 'react';
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
				mainText={'가고자 하는 여행지가 \n어떤 느낌이었으면 하나요?'}
				subText={`2023년 지역별 관광객 수를 기준으로\n5단계의 인기도를 설정했습니다.`}></StepText>
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
					<PretendardSemiBoldText size={12} lineHeight={14.4} color={colors.Gray4}>
						가장 이색적인
					</PretendardSemiBoldText>
					<PretendardSemiBoldText size={12} lineHeight={14.4} color={colors.Gray4}>
						가장 유명한
					</PretendardSemiBoldText>
				</SpaceHstack>
				<PretendardSemiBoldText
					size={11}
					lineHeight={18}
					color={colors.Gray2}
					style={{zIndex: 99, marginTop: 20}}>
					가장 이색적인 : 경남 함안군 등 37개 지역 {`\n`}상당히 이색적인 : 경북 청송군 등 53개 지역 {`\n`}
					균형잡힌 : 강원 화천시 등 32개 지역 {`\n`}상당히 유명한 : 강원 강릉시 등 30개 지역 {`\n`}가장 유명한
					: 서울, 제주 등 10개 지역
				</PretendardSemiBoldText>
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
export const ThumbInside = styled.View`
	width: ${widthPercentage(15.53)}px;
	height: ${widthPercentage(15.53)}px;
	background-color: ${colors.Blue3};
	border-width: 2.12px;
	border-color: ${colors.backgroundWhite};
	border-radius: 99px;
`;
export const Thumb = styled.View`
	width: ${widthPercentage(24)}px;
	height: ${widthPercentage(24)}px;
	background-color: rgba(132, 255, 3, 0.3);
	align-items: center;
	border-radius: 99px;
	justify-content: center;
`;
export const SelectRail = styled.View`
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
export const Rail = styled.View`
	width: 100%;
	height: ${heightPercentage(10)}px;
	background-color: ${colors.Gray1};
	border-radius: 6px;
`;
