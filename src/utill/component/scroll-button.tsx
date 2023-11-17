import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/AntDesign';
import {HStack, devicesHeight, devicesWidth} from '../layout/layout';
import {useEffect} from 'react';
import {colors} from '../colors';
import {useAppDispatch} from '../../redux';
import {communitySliceActions} from '../../redux/community/community.slice';

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
			<HStack>
				<IconContainer name={'plus'} color={'white'} size={devicesWidth * (viewState ? 0.08 : 0.05)} />
				{!viewState && <ButtonText>글쓰기</ButtonText>}
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
	background-color: ${colors.selectButton};
	elevation: 4;
`;
const ButtonText = styled.Text`
	font-size: 17px;
	color: white;
	margin: 0px 0px 0px 3px;
`;
