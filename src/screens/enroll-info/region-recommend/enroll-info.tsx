import styled from 'styled-components/native';
import {useEffect, useState} from 'react';
import {BackHandler, ScrollView} from 'react-native';
import {colors} from '../../../utill/colors';
import SelectDistance from './select-distance';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {modalSliceActions} from '../../../redux/modal/modalSlice';
import SelectTendency from './select-tendency';
import SelectPopularity from './select-popularity';
import {regionRecommendSliceActions} from '../../../redux/travel-info/region-recommend.slice';

export default function EnrollInfo({navigation}: any) {
	const changeComponent = (e: number) => {
		setViewComponent(e);
	};
	const {checKStep} = useAppSelector(state => state.regionRecommendSlice);

	const [viewComponent, setViewComponent] = useState(checKStep);
	const goNextStep = () => {
		setViewComponent(viewComponent + 1);
		checKStep == viewComponent && dispatch(regionRecommendSliceActions.enrollCheckStep(viewComponent + 1));
	};
	const dispatch = useAppDispatch();
	useEffect(() => {
		const backAction = () => {
			if (navigation.isFocused()) {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '취소시 지역 추천이 종료됩니다.',
						modalSubTitle: '그래도 나가시겠습니까?',
						modalLeft: true,
						modalFunction: () => {
							navigation.popToTop();
						},
					}),
				);
				return true;
			}
		};

		const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

		return () => backHandler.remove();
	}, []);
	const enrollComponentList = [
		{
			title: '성향',
			component: <SelectTendency goNextStep={goNextStep} />,
		},
		{
			title: '인기도 설정',
			component: <SelectPopularity goNextStep={goNextStep} />,
		},
		{
			title: '여행 반경',
			component: <SelectDistance navigation={navigation} />,
		},
	];
	return (
		<MainContainer>
			<TitleViewContainer>
				<ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
					{enrollComponentList.map((item, idx) => (
						<TitleContainer
							key={idx}
							select={viewComponent == idx}
							disabled={checKStep < idx}
							isDisabledOpacity={checKStep < idx}
							onPress={() => {
								changeComponent(idx);
							}}>
							<TitleViewText isDisabledOpacity={checKStep < idx} select={viewComponent == idx}>
								{item.title}
							</TitleViewText>
						</TitleContainer>
					))}
				</ScrollView>
			</TitleViewContainer>
			{enrollComponentList[viewComponent].component}
		</MainContainer>
	);
}
const MainContainer = styled.View`
	background-color: ${colors.main};
	padding: 10px;
	flex: 1;
`;
const TitleViewContainer = styled.View`
	width: 100%;
	margin: 0px 0px 20px 0px;
`;
const TitleContainer = styled.TouchableOpacity<{select: boolean; isDisabledOpacity: boolean}>`
	padding: 10px 20px 10px 20px;
	justify-content: center;
	align-items: center;
	background-color: ${props =>
		props.select ? colors.selectButton : props.isDisabledOpacity ? colors.regionNormal : colors.normalButton};
	border-radius: 99px;
	margin: 0px 10px 0px 10px;
	opacity: ${props => (props.isDisabledOpacity ? 0.5 : 1)};
`;
const TitleViewText = styled.Text<{select: boolean; isDisabledOpacity: boolean}>`
	font-size: 17px;
	color: ${props => (props.select ? 'white' : props.isDisabledOpacity ? '#CBCBCB' : colors.TextPrimary)};
	font-weight: bold;
`;
