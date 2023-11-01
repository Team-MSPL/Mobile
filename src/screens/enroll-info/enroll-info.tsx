import {HStack, VStack, Divider, FlexWrap} from '../../utill/layout/layout';
import styled from 'styled-components/native';
import SelectDay from './select-day';
import {useEffect, useState} from 'react';
import SelectTendency from './select-tendency';
import {BackHandler, ScrollView} from 'react-native';
import SelectCity from './select-city';
import SelectMulti from './select-multi';
import {colors} from '../../utill/colors';
import SelectDistance from './select-distance';
import {useAppDispatch, useAppSelector} from '../../redux';
import {modalSliceActions} from '../../redux/modal/modalSlice';

export default function EnrollInfo({navigation}: any) {
	const [viewComponent, setViewComponent] = useState(0);
	const changeComponent = (e: number) => {
		setViewComponent(e);
	};
	const [checKStep, setCheckStep] = useState(0);
	const {regionRecommendFlag} = useAppSelector(state => state.travelSlice);
	const goNextStep = () => {
		setViewComponent(viewComponent + 1);
		checKStep == viewComponent && setCheckStep(viewComponent + 1);
	};
	const dispatch = useAppDispatch();
	useEffect(() => {
		const backAction = () => {
			if (navigation.isFocused()) {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '뒤로 이동시 데이터는 날라갑니다.',
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
			component: (
				<SelectTendency
					setViewComponent={setViewComponent}
					viewComponent={viewComponent}
					goNextStep={goNextStep}
				/>
			),
		},
		{
			title: '날짜',
			component: (
				<SelectDay setViewComponent={setViewComponent} viewComponent={viewComponent} goNextStep={goNextStep} />
			),
		},
		{
			title: '지역',
			component: (
				<SelectCity setViewComponent={setViewComponent} viewComponent={viewComponent} goNextStep={goNextStep} />
			),
		},
		{
			title: '여행요소',
			component: (
				<SelectMulti
					navigation={navigation}
					setViewComponent={setViewComponent}
					viewComponent={viewComponent}
					goNextStep={goNextStep}
				/>
			),
		},
		{
			title: '거리민감도',
			component: (
				<SelectDistance
					navigation={navigation}
					setViewComponent={setViewComponent}
					viewComponent={viewComponent}
				/>
			),
		},
	];
	const viewComponentList = regionRecommendFlag
		? enrollComponentList.filter(item => item.title != '지역')
		: enrollComponentList;
	return (
		<MainContainer>
			<TitleViewContainer>
				<ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
					{viewComponentList.map((item, idx) => (
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
			{viewComponentList[viewComponent].component}
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
