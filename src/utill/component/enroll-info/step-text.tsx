import styled from 'styled-components/native';
import {PretendardSemiBoldText, VStack} from '../../layout/layout';
import {colors} from '../../colors';
import {heightPercentage} from '../../layout/responsive-size';

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
			<PretendardSemiBoldText size={styleTextSize ?? 18} lineHeight={22} color={styleTextColor ?? colors.Title}>
				{styleText}
			</PretendardSemiBoldText>
			<PretendardSemiBoldText size={mainTextSize ?? 26} lineHeight={31} color={mainTextColor ?? colors.Black}>
				{mainText}
			</PretendardSemiBoldText>
			<PretendardSemiBoldText
				size={subTextSize ?? 14}
				lineHeight={18}
				color={subTextColor ?? colors.Gray3}
				style={{zIndex: 99}}>
				{subText ?? ''}
			</PretendardSemiBoldText>
			{warningText && (
				<PretendardSemiBoldText
					size={warningTextSize ?? 12}
					lineHeight={18}
					color={warningTextColor ?? colors.PointGreen1}>
					{warningText ?? ''}
				</PretendardSemiBoldText>
			)}
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
	gap: ${heightPercentage(5)}px;
`;
