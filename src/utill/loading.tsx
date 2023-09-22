import React from 'react';
import styled from 'styled-components/native';
import LoadingLottie from './loading-lottie';
export default function Loading() {
	return (
		<LoadingContainer>
			<LoadingLottie />
		</LoadingContainer>
	);
}

const LoadingContainer = styled.View`
	width: 100%;
	height: 100%;
	position: absolute;
	align-items: center;
	justify-content: center;
	background-color: rgba(0, 0, 0, 0.4);
`;
