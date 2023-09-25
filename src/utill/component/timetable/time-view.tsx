import React, {memo} from 'react';
import styled from 'styled-components/native';
import {VStack} from '../../layout/layout';
import {Dimensions} from 'react-native';

const TimeView = () => {
	const WINDOW_HEIGHT = Dimensions.get('window').height;
	return (
		<TimeViewVStack>
			{[...Array(24)].map((time, times) => (
				<TimeViewContainer height={WINDOW_HEIGHT / 10} key={times}>
					<TimeViewText>{times <= 18 ? times + 6 : times - 18}</TimeViewText>
				</TimeViewContainer>
			))}
		</TimeViewVStack>
	);
};
const TimeViewVStack = styled(VStack)`
	flex: 0.1;
`;
const TimeViewContainer = styled.View<{height: number}>`
	height: ${props => props.height}px;
	align-items: center;
`;
const TimeViewText = styled.Text`
	font-size: 15px;
	color: black;
`;
export default memo(TimeView);
