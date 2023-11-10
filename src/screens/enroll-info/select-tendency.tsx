import {useAppDispatch, useAppSelector} from '../../redux';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import CustomButton from '../../utill/component/custom-button';
import TendencyButton from '../../utill/component/tendency-button';
import {FlexWrap, MainContainer, VStack, HStack, devicesWidth} from '../../utill/layout/layout';
import StepText from '../../utill/component/enroll-info/step-text';
import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import {SvgCheck} from '../../utill/svg/svg';
import {ButtonContainer, MarginContainder} from './select-multi';
import {TouchableOpacity} from 'react-native';
import {modalSliceActions} from '../../redux/modal/modalSlice';
export default function SelectTendency({setViewComponent, viewComponent, goNextStep}: any) {
	const {transit, tendency, regionRecommendFlag, bandwidth} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const selectData = ({index, idx}: {index: number; idx: number}) => {
		if (checkDialog({flag: tendency[index][idx], name: tendencyList[index].list[idx]})) {
			let copy = [...tendency];
			let copySecond = [...copy[index]];
			copySecond[idx] = copySecond[idx] == 0 ? 1 : 0;
			copy[index] = copySecond;
			console.log(copy);
			dispatch(travelSliceActions.enrollTendency(copy));
		}
	};
	const checkDialog = ({flag, name}: {flag: number; name: string}) => {
		if ((name == '실내여행지' && tendency[0][6]) || (tendency[3][5] && name == '반려동물과')) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '선택 불가',
					modalSubTitle: '반려 동물과 실내여행지는 같이 선택할 수 없어요',
				}),
			);
			return false;
		} else {
			if (name == '반려동물과' && flag == 0) {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '주의사항',
						modalSubTitle: '반려견 출입이 제한된 곳은 추천되지않아 관광지 수가 적을 수 있습니다.',
					}),
				);
			}
			return true;
		}
	};
	return (
		<>
			<MainContainer showsVerticalScrollIndicator={false}>
				<StepText mainText='여행 성향 설정' subText='어떤 스타일의 여행을 가실 계획이신가요?' />
				<VStack>
					<TendencyStepText>Step 1</TendencyStepText>
					<TendencyText>어떻게 이동하시나요?</TendencyText>
					<FlexWrap>
						<TendencyElementContainer onPress={() => dispatch(travelSliceActions.enrollTransit(0))}>
							<SvgCheck color={transit == 0 ? colors.selectButton : colors.regionNormal} />
							<TendencyButton label='자차(렌트카)' bgColor={transit == 0}></TendencyButton>
						</TendencyElementContainer>
						<TendencyElementContainer onPress={() => dispatch(travelSliceActions.enrollTransit(1))}>
							<SvgCheck color={transit == 1 ? colors.selectButton : colors.regionNormal} />
							<TendencyButton label='대중교통' bgColor={transit == 1}></TendencyButton>
						</TendencyElementContainer>
					</FlexWrap>
					<TendencyStepText>Step 2</TendencyStepText>
					<TendencyText>어떤 스타일을 원하시나요?</TendencyText>
					<FlexWrap>
						<TendencyElementContainer onPress={() => dispatch(travelSliceActions.enrollBandwidth(false))}>
							<SvgCheck color={!bandwidth ? colors.selectButton : colors.regionNormal} />
							<TendencyButton label='바쁜 일정' bgColor={!bandwidth}></TendencyButton>
						</TendencyElementContainer>
						<TendencyElementContainer onPress={() => dispatch(travelSliceActions.enrollBandwidth(true))}>
							<SvgCheck color={bandwidth ? colors.selectButton : colors.regionNormal} />
							<TendencyButton label='여유있는 일정' bgColor={bandwidth}></TendencyButton>
						</TendencyElementContainer>
					</FlexWrap>
					{tendencyList.map((item, index) => {
						return (
							<TendencyContainer key={index}>
								<TendencyStepText>Step {index + 3}</TendencyStepText>
								<TendencyText>{item.title}</TendencyText>
								<MultiText> * 중복 선택, 선택 안 하셔도 됩니다.</MultiText>
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
				<CustomButton
					label={`다음 (${viewComponent + 1}/${regionRecommendFlag ? 3 : 5})`}
					onPress={goNextStep}></CustomButton>
			</ButtonContainer>
		</>
	);
}

export const tendencyList = [
	{
		title: '누구와 떠나시나요?',
		multi: true,
		list: ['나홀로', '연인과', '친구와', '가족과', '효도', '자녀와', '반려동물과'],
	},
	{
		title: '테마는 무엇인가요?',
		multi: true,
		list: ['힐링', '액티비티', '배움이 있는', '맛있는', '교통이 편한', '알뜰한'],
	},
	{
		title: '무엇을 하고싶으신가요?',
		multi: true,
		list: ['레저 스포츠', '문화시설', '사진 명소', '이색체험', '유적지', '박물관', '공원', '사찰', '성지'],
	},
	{
		title: '어디를 가고싶으신가요?',
		multi: true,
		list: ['바다', '산', '드라이브', '산책', '쇼핑', '실내여행지', '시티투어', '전통한옥'],
	},
];

export const MultiText = styled.Text`
	color: ${colors.selectButton};
	font-size: ${devicesWidth * 0.03}px;
	margin: 5px 0px 0px 0px;
`;
export const TendencyText = styled.Text`
	font-size: 20px;
	font-weight: bold;
	color: black;
`;

export const TendencyContainer = styled.View`
	width: 100%;
	margin: 10px 0px 0px 0px;
`;

export const TendencyStepText = styled.Text`
	margin: 10px 0px 0px 0px;
	font-size: 15px;
	color: #2698fa;
`;
export const TendencyElementContainer = styled(HStack).attrs({as: TouchableOpacity})`
	width: 50%;
`;
