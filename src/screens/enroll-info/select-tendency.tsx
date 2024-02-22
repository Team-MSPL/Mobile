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
import {useTendencyHandler} from '../../utill/hooks/useTendencyHandler';
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

	const {handleButtonClick, tendencyList} = useTendencyHandler();
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
						modalTitle: '잠깐!',
						modalSubTitle: '반려견 출입이 제한된 곳은 추천되지않아 관광지 수가 적을 수 있습니다.',
					}),
				);
			}
			return true;
		}
	};
	return (
		<>
			{/* <MainContainer showsVerticalScrollIndicator={false}>
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
					<TendencyText>어떤 여행 스타일을 원하시나요?</TendencyText>
					<FlexWrap>
						<TendencyElementContainer onPress={() => dispatch(travelSliceActions.enrollBandwidth(false))}>
							<SvgCheck color={!bandwidth ? colors.selectButton : colors.regionNormal} />
							<TendencyButton label='알찬 일정' bgColor={!bandwidth}></TendencyButton>
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
								<MultiText> * 중복 선택 가능.</MultiText>
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
			</MainContainer> */}
			<ButtonContainer>
				<CustomButton
					label={`다음 (${viewComponent + 1}/${regionRecommendFlag ? 3 : 5})`}
					onPress={goNextStep}></CustomButton>
			</ButtonContainer>
		</>
	);
}
export const MultiText = styled.Text`
	color: ${colors.selectButton};
	font-size: ${devicesWidth * 0.034}px;
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
