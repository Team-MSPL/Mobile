import React, {memo} from 'react';
import styled from 'styled-components/native';
import {VStack} from '../../layout/layout';

const TimeView = () => {
	return (
		<TimeViewVStack>
			{[...Array(24)].map((time, times) => (
				<TimeViewContainer key={times}>
					<TimeViewText>{times <= 18 ? times + 6 : times - 18}</TimeViewText>
				</TimeViewContainer>
			))}
		</TimeViewVStack>
	);
};
const TimeViewVStack = styled(VStack)`
	flex: 0.1;
`;
const TimeViewContainer = styled.View`
	height: 70px;
	align-items: center;
`;
const TimeViewText = styled.Text`
	font-size: 15px;
	color: black;
`;
export default memo(TimeView);
