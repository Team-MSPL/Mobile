import styled from 'styled-components/native';
import {VStack} from '../../layout/layout';
import {fontPercentage, heightPercentage, widthPercentage} from '../../layout/responsive-size';
import {colors} from '../../colors';

export default function StepText({
	styleText,
	mainText,
	subText,
	styleTextSize,
	mainTextSize,
	subTextSize,
	styleTextColor,
	mainTextColor,
	subTextColor,
}: StepTextProps) {
	return (
		<StepTextVStack>
			<StyleText size={styleTextSize ?? fontPercentage(14)} color={styleTextColor ?? colors.Gray3}>
				{styleText}
			</StyleText>
			<MainText size={mainTextSize ?? fontPercentage(26)} color={mainTextColor ?? colors.Black}>
				{mainText}
			</MainText>
			<SubText size={subTextSize ?? fontPercentage(12)} color={subTextColor ?? '#b1b6cc'}>
				{subText ?? ''}
			</SubText>
		</StepTextVStack>
	);
}

type StepTextProps = {
	styleText: string;
	mainText: string;
	subText?: string;
	styleTextSize?: number;
	mainTextSize?: number;
	subTextSize?: number;
	styleTextColor?: string;
	mainTextColor?: string;
	subTextColor?: string;
};
const StyleText = styled.Text<{size: number; color: string}>`
	font-size: ${props => props.size}px;
	font-weight: 600;
	line-height: ${fontPercentage(21)}px;
	color: ${props => props.color};
`;
const MainText = styled.Text<{size: number; color: string}>`
	color: ${props => props.color};
	font-size: ${props => props.size}px;
	font-weight: 700;
	line-height: ${fontPercentage(35.1)}px;
`;

const SubText = styled.Text<{size: number; color: string}>`
	color: ${props => props.color};
	font-size: ${props => props.size}px;
	font-weight: 500;
	line-height: ${fontPercentage(18)}px;
`;

const StepTextVStack = styled(VStack)`
	margin-top: ${heightPercentage(27)}px;
	margin-left: ${widthPercentage(24)}px;
`;
