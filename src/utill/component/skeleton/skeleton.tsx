import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {colors} from '../../colors';
import styled from 'styled-components/native';
import {devicesHeight, devicesWidth} from '../../layout/layout';
export default function Skeleton() {
	return (
		<SkeletonContainer>
			{[...Array(3)].map((value, index) => (
				<SkeletonPlaceholder borderRadius={4} key={index}>
					<SkeletonPlaceholder.Item flexDirection='row' alignItems='center' marginVertical={10}>
						{[...Array(5)].map((item, idx) => (
							<SkeletonPlaceholder.Item
								key={idx}
								width={devicesWidth * 0.16}
								height={devicesHeight * 0.2}
								marginRight={devicesWidth * 0.02}
							/>
						))}
					</SkeletonPlaceholder.Item>
				</SkeletonPlaceholder>
			))}
		</SkeletonContainer>
	);
}

const SkeletonContainer = styled.View`
	flex: 1;
	background-color: ${colors.main};
	padding: ${devicesWidth * 0.05}px;
`;
