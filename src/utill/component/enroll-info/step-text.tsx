import styled from 'styled-components/native';
import {VStack} from '../../layout/layout';

export default function StepText({mainText, subText}: StepTextProps) {
	return (
		<VStack>
			<MainText>{mainText}</MainText>
			<SubText>{subText}</SubText>
		</VStack>
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
