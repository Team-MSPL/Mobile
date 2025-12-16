import React, {useEffect, useState} from 'react';
import {Image, ActivityIndicator, Pressable} from 'react-native';
import styled from 'styled-components/native';
import {widthPercentage} from '../../layout/responsive-size';

const StyledImage = styled.Image<{height: number}>`
	width: ${widthPercentage(327)}px;
	height: ${props => props.height}px;
	margin-top: 10px;
`;

const AutoSizedImage = ({
	imgIdx,
	uri,
	handleDetailImage,
}: {
	imgIdx: number;
	uri: string;
	handleDetailImage: (e) => void;
}) => {
	const [height, setHeight] = useState<number | null>(null);
	const fixedWidth = widthPercentage(327);

	useEffect(() => {
		if (!uri) return;

		Image.getSize(
			uri,
			(originalWidth, originalHeight) => {
				const ratio = originalHeight / originalWidth;
				setHeight(fixedWidth * ratio);
			},
			error => {
				console.error('Image load error', error);
			},
		);
	}, [uri]);

	if (height === null) {
		return <ActivityIndicator />;
	}

	return (
		<Pressable
			onPress={() => {
				handleDetailImage(imgIdx);
			}}>
			<StyledImage source={{uri}} height={height} resizeMode='contain' />
		</Pressable>
	);
};

export default AutoSizedImage;
