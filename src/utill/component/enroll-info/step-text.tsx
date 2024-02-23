import styled from 'styled-components/native';
import {PretendardBold, PretendardSemiBold, PretendardVariable, VStack} from '../../layout/layout';
import {fontPercentage, heightPercentage, widthPercentage} from '../../layout/responsive-size';
import {colors} from '../../colors';

export default function StepText({
	marginTop,
	marginLeft,
	marginBottom,
	marginRight,
	styleText,
	mainText,
	subText,
	warningText,
	styleTextSize,
	mainTextSize,
	subTextSize,
	warningTextSize,
	styleTextColor,
	mainTextColor,
	subTextColor,
	warningTextColor,
}: StepTextProps) {
	return (
		<StepTextVStack
			marginBottom={marginBottom ?? undefined}
			marginLeft={marginLeft ?? undefined}
			marginRight={marginRight ?? undefined}
			marginTop={marginTop ?? undefined}>
			<StyleText size={styleTextSize ?? fontPercentage(14)} color={styleTextColor ?? colors.Gray3}>
				{styleText}
			</StyleText>
			<MainText size={mainTextSize ?? fontPercentage(26)} color={mainTextColor ?? colors.Black}>
				{mainText}
			</MainText>
			<SubText size={subTextSize ?? fontPercentage(12)} color={subTextColor ?? '#b1b6cc'}>
				{subText ?? ''}
			</SubText>
			<SubText size={warningTextSize ?? fontPercentage(12)} color={warningTextColor ?? colors.PointGreen1}>
				{warningText ?? ''}
			</SubText>
		</StepTextVStack>
	);
}

type StepTextProps = {
	marginTop?: number;
	marginLeft?: number;
	marginBottom?: number;
	marginRight?: number;
	styleText?: string;
	mainText?: string;
	subText?: string;
	warningText?: string;
	styleTextSize?: number;
	mainTextSize?: number;
	subTextSize?: number;
	warningTextSize?: number;
	styleTextColor?: string;
	mainTextColor?: string;
	subTextColor?: string;
	warningTextColor?: string;
};
const StyleText = styled(PretendardSemiBold)<{size: number; color: string}>`
	font-size: ${props => props.size}px;
	font-weight: 600;
	line-height: ${fontPercentage(21)}px;
	color: ${props => props.color};
`;
const MainText = styled(PretendardBold)<{size: number; color: string}>`
	color: ${props => props.color};
	font-size: ${props => props.size}px;
	font-weight: 700;
	line-height: ${fontPercentage(35.1)}px;
`;

const SubText = styled(PretendardVariable)<{size: number; color: string}>`
	color: ${props => props.color};
	font-size: ${props => props.size}px;
	font-weight: 500;
	line-height: ${fontPercentage(18)}px;
`;

const StepTextVStack = styled(VStack)<{
	marginTop?: number;
	marginLeft?: number;
	marginBottom?: number;
	marginRight?: number;
}>`
	margin-top: ${props => props.marginTop ?? 0}px;
	margin-left: ${props => props.marginLeft ?? 0}px;
	margin-bottom: ${props => props.marginBottom ?? 0}px;
	margin-right: ${props => props.marginRight ?? 0}px;
`;
