import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {HStack, MainContainer, VStack, devicesHeight, devicesWidth} from '../../utill/layout/layout';
import {TouchableOpacity} from 'react-native';
import {openSettings, checkNotifications} from 'react-native-permissions';
import {useEffect} from 'react';
import {userSliceActions} from '../../redux/user/user.slice';
export default function PushNotify({navigation}: any) {
	const dispatch = useAppDispatch();
	const {pushNotify} = useAppSelector(state => state.userSlice);
	const goSetting = async () => {
		await openSettings();
		navigation.goBack();
	};
	const checkPermission = async () => {
		const authStatus = await checkNotifications();
		dispatch(userSliceActions.setPushNotify(authStatus.status == 'granted' ? true : false));
	};
	useEffect(() => {
		checkPermission();
	}, []);
	return (
		<MainContainer>
			<PushNotifyHstack>
				<VStack>
					<PushText>{pushNotify ? '알림 설정이 허용됨' : '알림이 사용 중지됨'}</PushText>
					<PushSubTitle>알림 설정을 변경하려면 기기 설정으로 이동하세요.</PushSubTitle>
				</VStack>
				<TouchableOpacity onPress={goSetting}>
					<PushText>설정하기</PushText>
				</TouchableOpacity>
			</PushNotifyHstack>
		</MainContainer>
	);
}

const PushNotifyHstack = styled(HStack)`
	width: 100%;
	justify-content: space-between;
	margin: ${devicesHeight * 0.03}px 0px;
`;
const PushText = styled.Text`
	font-size: ${devicesWidth * 0.05}px;
	font-weight: 600;
	color: black;
`;
const PushSubTitle = styled.Text`
	font-size: ${devicesWidth * 0.03}px;
	color: grey;
`;
