import styled from 'styled-components/native';
import {heightPercentage, widthPercentage} from '../../layout/responsive-size';
import {colors} from '../../colors';

export default function Stepper({total, now}: {total: number; now: number}) {
	return (
		<StepperBar>
			<NowBar now={(now / total) * 100}></NowBar>
		</StepperBar>
	);
}

const StepperBar = styled.View`
	width: ${widthPercentage(327)}px;
	height: ${heightPercentage(6)}px;
	background-color: ${colors.Gray200};
	align-items: start;
	border-radius: 6px;
	align-self: center;
	margin-bottom: ${heightPercentage(10)}px;
`;
const NowBar = styled.View<{now: number}>`
	position: absolute;
	border-radius: 6px;
	z-index: 10;
	width: ${props => props.now}%;
	height: ${heightPercentage(6)}px;
	background-color: ${colors.Primary};
`;
