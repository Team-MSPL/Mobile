import styled from 'styled-components/native';
import {HStack, PretendardVariableText, devicesWidth} from '../layout/layout';
import {useEffect} from 'react';
import {colors} from '../colors';
import {useAppDispatch} from '../../redux';
import {communitySliceActions} from '../../redux/community/community.slice';
import {SVGPencil} from '../svg/svg';
import {heightPercentage, widthPercentage} from '../layout/responsive-size';

export default function ScrollButton({viewState, navigation}: {viewState: boolean; navigation: any}) {
	const dispatch = useAppDispatch();

	useEffect(() => {}, [viewState]);
	const goCommunityWritingScreen = () => {
		dispatch(communitySliceActions.resetPostData());
		navigation.navigate('CommunityWritingScreen', {
			title: '',
			content: '',
			images: [],
			isNewPost: true,
		});
	};
	return (
		<CommunityButton onPress={goCommunityWritingScreen}>
			<HStack gap={3}>
				{!viewState && (
					<PretendardVariableText size={14} lineHeight={21} color={colors.Primary}>
						글쓰기
					</PretendardVariableText>
				)}
				<SVGPencil
					color={colors.Primary}
					width={widthPercentage(viewState ? 30 : 30)}
					height={widthPercentage(20)}
				/>
			</HStack>
		</CommunityButton>
	);
}
const CommunityButton = styled.TouchableOpacity`
	padding: ${widthPercentage(10)}px ${widthPercentage(15)}px;
	border-radius: 99px;
	position: absolute;
	bottom: ${heightPercentage(25)}px;
	right: ${widthPercentage(20)}px;
	background-color: ${colors.Gray5};
	elevation: 4;
`;
