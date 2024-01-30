import {useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../redux';
import CustomButton from '../../../utill/component/custom-button';
import {regionRecommendSliceActions} from '../../../redux/travel-info/region-recommend.slice';
import {FlexWrap, MainContainer, HStack, VStack} from '../../../utill/layout/layout';
import StepText from '../../../utill/component/enroll-info/step-text';
import {
	TendencyStepText,
	TendencyText,
	TendencyContainer,
	TendencyElementContainer,
	MultiText,
} from '../select-tendency';
import TendencyButton from '../../../utill/component/tendency-button';
import {SvgCheck} from '../../../utill/svg/svg';
import {colors} from '../../../utill/colors';
import {ButtonContainer, MarginContainder} from '../select-multi';

export default function SelectTendency({navigation, goNextStep}: any) {
	const dispatch = useAppDispatch();
	const {tendency} = useAppSelector(state => state.regionRecommendSlice);
	// const [select, setSelect] = useState(
	// 	regionTendencyList.map(item => {
	// 		return Array(item.list.length).fill(false);
	// 	}),
	//);

	const goNext = () => {
		// console.log(navigation);
		// let copy = [...select];
		// copy = copy.map(item => {
		// 	return item.map(data => {
		// 		return data ? 1 : 0;
		// 	});
		// });
		// dispatch(regionRecommendSliceActions.enrollTendency(copy));
		goNextStep();
		//navigation.navigate('RegionSelectPopularity');
	};
	const selectData = ({index, idx}: {index: number; idx: number}) => {
		let copy = [...tendency];
		let secCopy = [...tendency[index]];
		secCopy[idx] = secCopy[idx] == 0 ? 1 : 0;
		copy[index] = secCopy;
		dispatch(regionRecommendSliceActions.enrollTendency(copy));
		//setSelect(copy);
	};

	return (
		<>
			<MainContainer showsVerticalScrollIndicator={false}>
				<StepText mainText='추천 성향 설정' subText='어떤 스타일의 여행을 가실 계획이신가요?' />
				<VStack>
					{regionTendencyList.map((item, index) => {
						return (
							<TendencyContainer key={index}>
								<TendencyStepText>Step {index + 1}</TendencyStepText>
								<TendencyText>{item.title}</TendencyText>
								<MultiText>* 중복 선택 가능</MultiText>
								<FlexWrap>
									{item.list.map((data, idx) => {
										return (
											<TendencyElementContainer
												key={idx}
												onPress={() => selectData({index, idx})}>
												<SvgCheck
													color={
														tendency[index][idx] == 1
															? colors.selectButton
															: colors.regionNormal
													}
												/>
												<TendencyButton
													key={idx}
													label={data}
													bgColor={tendency[index][idx] == 1}></TendencyButton>
											</TendencyElementContainer>
										);
									})}
								</FlexWrap>
							</TendencyContainer>
						);
					})}
				</VStack>
				<MarginContainder />
			</MainContainer>
			<ButtonContainer>
				<CustomButton label={'다음 '} onPress={goNext}></CustomButton>
			</ButtonContainer>
		</>
	);
}

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
