import styled from 'styled-components/native';
import StepText from '../../../utill/component/enroll-info/step-text';
import Stepper from '../../../utill/component/enroll-info/stepper';
import TendencyButton from '../../../utill/component/tendency-button';
import CustomButton from '../../../utill/component/custom-button';
import {heightPercentage} from '../../../utill/layout/responsive-size';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {regionRecommendSliceActions} from '../../../redux/travel-info/region-recommend.slice';
import {colors} from '../../../utill/colors';
import {BackgroundGray} from '../../../utill/layout/layout';

export default function SelectWho({navigation}: any) {
	const {tendency} = useAppSelector(state => state.regionRecommendSlice);
	const dispatch = useAppDispatch();
	const goNext = () => {
		navigation.navigate('RegionSelectSeason');
	};
	const handleSelect = (item: number) => {
		let copy = [...tendency];
		let copy2 = [...tendency[0]];
		copy2[item] = copy2[item] == 1 ? 0 : 1;
		copy[0] = copy2;
		dispatch(regionRecommendSliceActions.enrollTendency(copy));
	};
	return (
		<BackgroundGray>
			<Stepper total={7} now={1}></Stepper>
			<StepText
				styleText='1.여행 스타일을 알아볼게요.'
				mainText='누구와 떠나시나요?'
				subText='* 중복 선택 가능'></StepText>
			<ButtonsContainer>
				{regionTendencyList[0].list.map((item, idx) => (
					<TendencyButton
						bgColor={tendency[0][idx] == 1}
						label={item}
						key={idx}
						onPress={() => {
							handleSelect(idx);
						}}></TendencyButton>
				))}
			</ButtonsContainer>
			<CustomButton
				marginTop={heightPercentage(48)}
				marginBottom={12}
				onPress={goNext}
				label='다음'></CustomButton>
		</BackgroundGray>
	);
}
const ButtonsContainer = styled.View`
	flex: 1;
	justify-content: flex-end;
`;
export const regionTendencyList = [
	{
		title: '누구와 떠나시나요?',
		multi: true,
		list: ['혼자여행', '커플 여행', '우정 여행', '가족 여행', '효도 여행', '어린 자녀와'],
	},
	{
		title: '테마는 무엇인가요?',
		multi: true,
		list: ['힐링', '에너제틱', '배움이 있는', '맛있는', '교통이 편한', '알뜰한'],
	},
	{
		title: '무엇을 하고 싶으신가요?',
		multi: true,
		list: ['레저 스포츠', '문화시설', '사진 명소', '이색체험', '역사여행'],
	},
	{
		title: '어디를 가고 싶으신가요?',
		multi: true,
		list: ['바다', '산', '드라이브', '산책', '쇼핑', '자연경관', '시티투어', '전통한옥'],
	},
	{
		title: '어느 계절에 가고 싶으신가요?',
		multi: true,
		list: ['봄', '여름', '가을', '겨울'],
	},
];
