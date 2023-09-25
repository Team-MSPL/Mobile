import styled from 'styled-components/native';
import {VStack} from '../../layout/layout';

export default function StepText({mainText, subText}: StepTextProps) {
	return (
		<StepTextVStack>
			<MainText>{mainText}</MainText>
			<SubText>{subText}</SubText>
		</StepTextVStack>
	);
}

type StepTextProps = {
	mainText: string;
	subText: string;
};
const MainText = styled.Text`
	color: black;
	font-size: 22px;
	font-weight: bold;
`;

const SubText = styled.Text`
	color: grey;
	font-size: 14px;
	font-weight: bold;
`;

const StepTextVStack = styled(VStack)`
	margin: 0px 0px 30px 0px;
`;
