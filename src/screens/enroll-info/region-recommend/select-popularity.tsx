import {useAppDispatch, useAppSelector} from '../../../redux';
import CustomButton from '../../../utill/component/custom-button';
import {regionRecommendSliceActions} from '../../../redux/travel-info/region-recommend.slice';
import {HStack, MainContainer} from '../../../utill/layout/layout';
import StepText from '../../../utill/component/enroll-info/step-text';
import {SvgCheck} from '../../../utill/svg/svg';
import {colors} from '../../../utill/colors';
import styled from 'styled-components/native';
export default function SelectPopularity({goNextStep}: any) {
	const dispatch = useAppDispatch();
	const {isLoading} = useAppSelector(state => state.loadingSlice);
	const {popularity} = useAppSelector(state => state.regionRecommendSlice);

	const changeSelectId = (e: number) => {
		let data = radioButtons[e].id * 20;
		dispatch(regionRecommendSliceActions.enrollPopularity([data, data]));
	};
	const goNext = async () => {
		goNextStep();
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
	if (isLoading) return <MainContainer></MainContainer>;
	return (
		<MainContainer>
			<StepText mainText='인기도 선택' subText='가고자 하는 여행지의 느낌을 선택해주세요.' />
			<Info>* 인기도의 기준은 각 지역별 여행객 수 통계를 참조했어요.</Info>
			{radioButtons.map((item, index) => (
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
			))}
			<ExplainText>{radioButtons[(100 - popularity[0]) / 20].explain}</ExplainText>
			<CustomButton label='다음 단계' onPress={goNext}></CustomButton>
		</MainContainer>
	);
}

const ExplainText = styled.Text`
	font-size: 15px;
	font-weight: bold;
	color: black;
	margin: 1% 0% 5% 0%;
`;
const PopularButton = styled.TouchableOpacity`
	padding: 5%;
	margin: 0.1% 0% 0% 0%;
`;
const PopularButtonText = styled.Text<{color: string}>`
	font-size: 17px;
	font-weight: bold;
	color: ${props => props.color};
	margin: 0px 0px 0px 20px;
`;
const Info = styled.Text`
	margin: 0px 0px 10px 0px;
`;
