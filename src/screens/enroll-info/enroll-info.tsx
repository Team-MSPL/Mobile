import {HStack, VStack, Divider, FlexWrap} from '../../utill/layout/layout';
import styled from 'styled-components/native';
import SelectDay from './select-day';
import {useState} from 'react';
import SelectTendency from './select-tendency';
import {ScrollView} from 'react-native';
import SelectCity from './select-city';
import SelectMulti from './select-multi';
import {colors} from '../../utill/colors';
import SelectDistance from './select-distance';

export default function EnrollInfo({navigation}: any) {
	const [viewComponent, setViewComponent] = useState(0);
	const changeComponent = (e: number) => {
		setViewComponent(e);
	};
	const enrollComponentList = [
		{
			title: '성향',
			component: <SelectTendency setViewComponent={setViewComponent} viewComponent={viewComponent} />,
		},
		{title: '날짜', component: <SelectDay setViewComponent={setViewComponent} viewComponent={viewComponent} />},
		{title: '지역', component: <SelectCity setViewComponent={setViewComponent} viewComponent={viewComponent} />},
		{
			title: '여행요소',
			component: (
				<SelectMulti
					navigation={navigation}
					setViewComponent={setViewComponent}
					viewComponent={viewComponent}
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
	return (
		<MainContainer>
			<TitleViewContainer>
				<ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
					{enrollComponentList.map((item, idx) => (
						<TitleContainer
							key={idx}
							select={viewComponent == idx}
							onPress={() => {
								changeComponent(idx);
							}}>
							<TitleViewText select={viewComponent == idx}>{item.title}</TitleViewText>
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
const TitleContainer = styled.TouchableOpacity<{select: boolean}>`
	padding: 10px 20px 10px 20px;
	justify-content: center;
	align-items: center;
	background-color: ${props => (props.select ? colors.selectButton : colors.normalButton)};
	border-radius: 99px;
	margin: 0px 10px 0px 10px;
`;
const TitleViewText = styled.Text<{select: boolean}>`
	font-size: 17px;
	color: ${props => (props.select ? 'white' : colors.TextPrimary)};
	font-weight: bold;
`;
