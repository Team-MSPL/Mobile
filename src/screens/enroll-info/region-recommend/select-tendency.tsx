import {useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../redux';
import CustomButton from '../../../utill/component/custom-button';
import SelectButton from '../../../utill/component/select-button';
import {regionRecommendSliceActions} from '../../../redux/travel-info/region-recommend.slice';
import {FlexWrap, MainContainer, HStack, VStack} from '../../../utill/layout/layout';
import StepText from '../../../utill/component/enroll-info/step-text';
import {TendencyStepText, TendencyText, TendencyContainer, TendencyElementContainer} from '../select-tendency';
import TendencyButton from '../../../utill/component/tendency-button';
import {SvgCheck} from '../../../utill/svg/svg';
import {colors} from '../../../utill/colors';

export default function SelectTendency({navigation}: any) {
	const dispatch = useAppDispatch();

	const [select, setSelect] = useState(
		tendencyList.map(item => {
			return Array(item.list.length).fill(false);
		}),
	);

	const goNext = () => {
		console.log(navigation);
		let copy = [...select];
		copy = copy.map(item => {
			return item.map(data => {
				return data ? 1 : 0;
			});
		});
		dispatch(regionRecommendSliceActions.enrollTendency(copy));
		navigation.navigate('RegionSelectDistance');
	};
	const selectData = ({index, idx}: {index: number; idx: number}) => {
		let copy = [...select];
		copy[index][idx] = !copy[index][idx];
		setSelect(copy);
	};

	return (
		<MainContainer showsVerticalScrollIndicator={false}>
			<StepText mainText='추천 성향 설정' subText='어떤 스타일의 여행을 가실 계획이신가요?' />
			<VStack>
				{tendencyList.map((item, index) => {
					return (
						<TendencyContainer key={index}>
							<TendencyStepText>Step {index + 1}</TendencyStepText>
							<TendencyText>{item.title}</TendencyText>
							<FlexWrap>
								{item.list.map((data, idx) => {
									return (
										<TendencyElementContainer key={idx}>
											<SvgCheck
												color={
													select[index][idx] == 1 ? colors.selectButton : colors.regionNormal
												}
											/>
											<TendencyButton
												key={idx}
												label={data}
												onPress={() => selectData({index, idx})}
												bgColor={select[index][idx] == 1}></TendencyButton>
										</TendencyElementContainer>
									);
								})}
							</FlexWrap>
						</TendencyContainer>
					);
				})}

				<CustomButton label={'다음 '} onPress={goNext}></CustomButton>
			</VStack>
		</MainContainer>
		// <ScrollView bgColor='#EFFBFB' p='2'>
		// 	{/* 스테퍼 넣기 */}
		// 	<VStack space='5'>
		// 		<Text fontSize='2xl' bold color='black'>
		// 			추천 성향 설정
		// 		</Text>
		// 		<Text fontSize='md' color='grey'>
		// 			어떤 스타일의 여행을 원하는가요?
		// 		</Text>
		// 		<Divider my='1' />
		// 		{tendencyList.map((item, index) => {
		// 			return (
		// 				<Box key={index}>
		// 					<Text fontSize='lg' bold>
		// 						{item.title}
		// 					</Text>
		// 					<Box flexDir='row' flexWrap='wrap'>
		// 						{item.list.map((data, idx) => {
		// 							return (
		// 								<SelectButton
		// 									key={idx}
		// 									label={data}
		// 									onPress={() => selectData({index, idx})}
		// 									bgColor={select[index][idx]}></SelectButton>
		// 							);
		// 						})}
		// 					</Box>
		// 				</Box>
		// 			);
		// 		})}

		// 		<CustomButton label='다음 단계' onPress={goNext}></CustomButton>
		// 	</VStack>
		// </ScrollView>
	);
}

const tendencyList = [
	{
		title: '누구와 떠나시나요?',
		multi: true,
		list: ['혼자여행', '커플 여행', '우정 여행', '가족 여행', '효도 여행', '어린 자녀와'],
	},
	{title: '테마는 무엇인가요?', multi: true, list: ['힐링', '에너제틱', '배움이 있는', '맛있는']},
	{
		title: '무엇을 하고싶으신가요?',
		multi: true,
		list: ['레저 스포츠', '문화시설', '사진 명소', '이색체험', '역사여행'],
	},
	{
		title: '뭘하고싶나요?',
		multi: true,
		list: ['바다', '산', '드라이브코스', '산책', '쇼핑', '자연경관', '시티투어', '지역축제', '전통한옥'],
	},
	{
		title: '무엇을 즐기고 싶나요?',
		multi: true,
		list: ['봄꽃', '여름피서', '가을단풍', '겨울스포츠,설경', '온천'],
	},
];
