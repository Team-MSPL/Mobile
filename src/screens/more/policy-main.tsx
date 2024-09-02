import {Fragment, useState} from 'react';
import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import Policy1 from '../../utill/component/policy/policy1';
import Policy2 from '../../utill/component/policy/policy2';
import Policy3 from '../../utill/component/policy/policy3';
import Policy4 from '../../utill/component/policy/policy4';
import Policy5 from '../../utill/component/policy/policy5';
import {BackgroundGrayScrollView, PretendardSemiBoldText} from '../../utill/layout/layout';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {SVGRightAdd} from '../../utill/svg/svg';
export default function PolicyMain() {
	const [view, setView] = useState(0);
	const PolicyComponent = policyList[view]?.component;
	const handleViewVisible = (e: number) => {
		setView(view == e ? -1 : e);
	};
	return (
		<BackgroundGrayScrollView>
			{policyList.map((item, value) => (
				<Fragment key={value}>
					<PolicyTouchableOpacity
						key={value}
						onPress={() => {
							handleViewVisible(value);
						}}>
						<PretendardSemiBoldText
							size={14}
							lineHeight={21}
							color={colors.Black}
							width={widthPercentage(300)}>
							{item.title}
						</PretendardSemiBoldText>
						<SVGRightAdd
							width={widthPercentage(20)}
							height={widthPercentage(20)}
							transform={value == view ? 270 : 90}
							color='black'
						/>
					</PolicyTouchableOpacity>
					{value == view && <PolicyComponent />}
				</Fragment>
			))}
		</BackgroundGrayScrollView>
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

const PolicyTouchableOpacity = styled.TouchableOpacity`
	justify-content: space-between;
	align-items: center;
	flex-direction: row;
	border-bottom-width: 1px;
	padding: ${heightPercentage(10)}px 0px;
	width: ${widthPercentage(327)}px;
`;
