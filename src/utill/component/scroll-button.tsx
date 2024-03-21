import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/AntDesign';
import {HStack, PretendardVariableText, devicesHeight, devicesWidth} from '../layout/layout';
import {useEffect} from 'react';
import {colors} from '../colors';
import {useAppDispatch} from '../../redux';
import {communitySliceActions} from '../../redux/community/community.slice';
import {SVGPencil} from '../svg/svg';

export default function ScrollButton({viewState, navigation}: {viewState: boolean; navigation: any}) {
	const IconContainer = styled(Icon)``;
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
				<SVGPencil color={colors.Primary} width={devicesWidth * (viewState ? 0.08 : 0.05)} />
			</HStack>
		</CommunityButton>
	);
}
const CommunityButton = styled.TouchableOpacity`
	padding: ${devicesWidth * 0.03}px;
	border-radius: 99px;
	position: absolute;
	bottom: ${devicesHeight * 0.03}px;
	right: ${devicesWidth * 0.05}px;
	background-color: ${colors.Gray5};
	elevation: 4;
`;
