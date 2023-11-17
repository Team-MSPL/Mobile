import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import LoadingLottie from './loading-lottie';
export default function Loading() {
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setView(true);
		}, 200);
		return () => clearTimeout(timeoutId);
	}, []);
	const [view, setView] = useState(false);
	if (!view) return <></>;
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
