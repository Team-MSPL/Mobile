import {useState} from 'react';
import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import Policy1 from '../../utill/component/policy/policy1';
import Policy2 from '../../utill/component/policy/policy2';
import Policy3 from '../../utill/component/policy/policy3';
import Policy4 from '../../utill/component/policy/policy4';
import Policy5 from '../../utill/component/policy/policy5';
export default function PolicyMain() {
	const [view, setView] = useState(0);
	const PolicyComponent = policyList[view].component;
	return (
		<MainViewContainer>
			<TextContainer>
				<TitleText>전체 이용 약관</TitleText>
			</TextContainer>
			<TouchableOpacityContainer>
				{policyList.map((item, value) => (
					<PolicyTouchableOpacity
						index={value}
						viewIndex={view}
						key={value}
						onPress={() => {
							setView(value);
						}}>
						<PolicyText>{item.title}</PolicyText>
					</PolicyTouchableOpacity>
				))}
			</TouchableOpacityContainer>
			{PolicyComponent && <PolicyComponent />}
		</MainViewContainer>
	);
}
const policyList = [
	{title: '제1장 총칙', component: Policy1},
	{title: '제2장 회원가입', component: Policy2},
	{title: '제3장 콘텐츠이용계약', component: Policy3},
	{title: '제4장 콘텐츠이용계약의 청약철회, 계약해제·해지 및 이용제한', component: Policy4},
	{title: '제5장 과오금,피해보상금', component: Policy5},
];

export const MainViewContainer = styled.ScrollView`
	background-color: ${colors.main};
	padding: 2px;
`;
const TextContainer = styled.View`
	margin-bottom: 30px;
	padding-horizontal: 10px;
`;
export const TitleText = styled.Text`
	font-size: 20px;
	font-weight: bold;
	color: black;
`;
const PolicyText = styled.Text`
	font-size: 10px;
	font-weight: bold;
	color: black;
`;

const TouchableOpacityContainer = styled.View`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	margin-bottom: 15px;
`;
const PolicyTouchableOpacity = styled.TouchableOpacity<{index: number; viewIndex: number}>`
	justify-content: center;
	align-items: center;
	background-color: ${props => (props.index == props.viewIndex ? colors.selectButton : 'white')};
	border-width: 1px;
	border-radius: 10px;
	height: 30px;
	margin: 4px;
	padding: 0px 5px;
`;
