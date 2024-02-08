import {useAppDispatch, useAppSelector} from '../../../redux';
import CustomButton from '../../../utill/component/custom-button';
import {regionRecommendSliceActions} from '../../../redux/travel-info/region-recommend.slice';
import {BackgroundGray, HStack, MainContainer} from '../../../utill/layout/layout';
import StepText from '../../../utill/component/enroll-info/step-text';
import {SvgCheck} from '../../../utill/svg/svg';
import {colors} from '../../../utill/colors';
import styled from 'styled-components/native';
import Stepper from '../../../utill/component/enroll-info/stepper';
import {heightPercentage, widthPercentage} from '../../../utill/layout/responsive-size';
import RangeSlider from 'rn-range-slider';
import {useCallback, useRef} from 'react';
export default function SelectPopularity({navigation}: any) {
	const dispatch = useAppDispatch();
	const {isLoading} = useAppSelector(state => state.loadingSlice);
	const {popularity} = useAppSelector(state => state.regionRecommendSlice);

	const goNext = async () => {
		dispatch(
			regionRecommendSliceActions.enrollPopularity([rangeRef.current.low * 20, rangeRef.current.hight * 20]),
		);
		navigation.navigate('RegionSelectDistance');
	};
	const radioButtons = [
		{
			id: 5,
			label: '많이 유명한',
			value: 'option2',
			explain: '일반적으로 가장 많이 여행가는 지역들이에요.\n( 서울, 제주 등 10개 지역 )',
		},
		{
			id: 4,
			label: '상당히 유명한',
			value: 'option2',
			explain: `여행을 좋아한다면 자주 들어보았을 지역들이에요.\n( 강원 강릉시, 충북 단양군 등 30개 지역 )`,
		},
		{
			id: 3,
			label: '균형잡힌',
			value: 'option2',
			explain: '유명과 이색, 그 중간 지점에 있는 지역들이에요.\n( 강원 화천시, 경남 진주시 등 32개 지역 )',
		},
		{
			id: 2,
			label: '상당히 이색적인',
			value: 'option2',
			explain: '특색있는 관광지를 가지고 있는 이색 여행 지역들이에요.\n( 경북 청송군, 전남 광양시 등 53개 지역 )',
		},

		{
			id: 1,
			label: '많이 이색적인',
			value: 'option1',
			explain: '발길이 많이 닿지 않은 이색 여행 지역들이에요. \n( 강원 양구군, 경남 함안군 등 37개 지역 )',
		},
	];
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
			</BarContainer>
			{/* {radioButtons.map((item, index) => (
				<PopularButton key={index} onPress={() => changeSelectId(index)}>
					<HStack key={index}>
						<SvgCheck
							color={index == (100 - popularity[0]) / 20 ? colors.selectButton : colors.regionNormal}
						/>
						<PopularButtonText
							color={index == (100 - popularity[0]) / 20 ? colors.selectButton : colors.regionNormal}>
							{item.label}
						</PopularButtonText>
					</HStack>
				</PopularButton>
			))} */}

			<ExplainText>{radioButtons[(100 - popularity[0]) / 20].explain}</ExplainText>
			<CustomButton label='다음' onPress={goNext}></CustomButton>
		</BackgroundGray>
	);
}
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
	height: ${heightPercentage(30)}px;
	align-self: center;
	border-radius: 6px;
`;
const Rail = styled.View`
	width: 100%;
	height: ${heightPercentage(10)}px;
	background-color: ${colors.Gray1};
	border-radius: 6px;
`;
const ExplainText = styled.Text`
	font-size: 15px;
	font-weight: bold;
	color: black;
	margin: 1% 0% 5% 0%;
`;

const Info = styled.Text`
	margin: 0px 0px 10px 0px;
`;
