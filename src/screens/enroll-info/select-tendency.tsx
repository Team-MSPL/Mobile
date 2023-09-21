import {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {PlaceType, travelSliceActions} from '../../redux/travel-info/travel.slice';
import CustomButton from '../../utill/component/custom-button';
import TendencyButton from '../../utill/component/tendency-button';
import {FlexWrap, MainContainer, VStack, HStack, Divider} from '../../utill/layout/layout';
import StepText from '../../utill/component/enroll-info/step-text';
import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import {SvgCheck} from '../../utill/svg/svg';
import moment from 'moment';
export default function SelectTendency({setViewComponent, viewComponent}: any) {
	const {transit, Place, tendency, selectStartDate, selectEndDate} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();

	const goNext = () => {
		setViewComponent(viewComponent + 1);
	};
	const selectData = ({index, idx}: {index: number; idx: number}) => {
		let copy = [...tendency];
		let copySecond = [...copy[index]];
		copySecond[idx] = copySecond[idx] == 0 ? 1 : 0;
		copy[index] = copySecond;
		console.log(copy);
		dispatch(travelSliceActions.enrollTendency(copy));
	};
	useEffect(() => {
		let data: PlaceType[] = [];
		const checkDays = 0;

		data = [...Array(checkDays + 2)].map(item => {
			return Place;
		});

		let dateArray = [];
		let count = 0;
		let copySelectedStartDate = moment({...selectStartDate});
		while (checkDays > 4 ? copySelectedStartDate.isSameOrBefore(selectEndDate) : count < 5) {
			dateArray.push(copySelectedStartDate.clone());
			copySelectedStartDate.add(1, 'day');
			count += 1;
		}
		dispatch(
			travelSliceActions.enrollFirstSetting({
				day: dateArray,
				accommodations: data,
			}),
		);
	}, []);
	return (
		<MainContainer showsVerticalScrollIndicator={false}>
			<StepText mainText='여행 성향 설정' subText='어떤 스타일의 여행을 가실 계획이신가요?' />
			<VStack>
				<TendencyStepText>Step 1</TendencyStepText>
				<TendencyText>어떻게 이동하시나요?</TendencyText>
				<HStack>
					<SvgCheck color={transit == 0 ? colors.selectButton : colors.regionNormal} />
					<TendencyButton
						label='자차(렌트카)'
						onPress={() => dispatch(travelSliceActions.enrollTransit(0))}
						bgColor={transit == 0}></TendencyButton>
					<SvgCheck color={transit == 1 ? colors.selectButton : colors.regionNormal} />
					<TendencyButton
						label='대중교통'
						onPress={() => dispatch(travelSliceActions.enrollTransit(1))}
						bgColor={transit == 1}></TendencyButton>
				</HStack>
				{tendencyList.map((item, index) => {
					return (
						<TendencyContainer key={index}>
							<TendencyStepText>Step {index + 2}</TendencyStepText>
							<TendencyText>{item.title}</TendencyText>
							<FlexWrap>
								{item.list.map((data, idx) => {
									return (
										<HStack key={idx}>
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
												onPress={() => selectData({index, idx})}
												bgColor={tendency[index][idx] == 1}></TendencyButton>
										</HStack>
									);
								})}
							</FlexWrap>
						</TendencyContainer>
					);
				})}

				<CustomButton label={'다음 (' + (viewComponent + 1) + '/5)'} onPress={goNext}></CustomButton>
			</VStack>
		</MainContainer>
	);
}

export const tendencyList = [
	{
		title: '누구와 떠나시나요?',
		multi: true,
		list: ['나홀로', '연인과', '친구와', '가족과', '효도', '자녀와', '반려동물과'],
	},
	{title: '테마는 무엇인가요?', multi: true, list: ['힐링', '액티비티', '배움이 있는', '맛있는']},
	{
		title: '무엇을 하고싶으신가요?',
		multi: true,
		list: ['레저 스포츠', '문화시설', '사진 명소', '이색체험', '유적지', '박물관', '공원', '사찰', '성지'],
	},
	{
		title: '뭘하고싶나요?',
		multi: true,
		list: ['바다', '산', '드라이브코스', '산책', '쇼핑', '실내여행지', '시티투어', '지역축제', '전통한옥'],
	},
];

const TendencyText = styled.Text`
	font-size: 20px;
	font-weight: bold;
	color: black;
`;

const TendencyContainer = styled.View`
	width: 100%;
	margin: 10px 0px 0px 0px;
`;

const TendencyStepText = styled.Text`
	margin: 10px 0px 0px 0px;
	font-size: 15px;
	color: #2698fa;
`;
