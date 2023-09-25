import React, {useState, useRef} from 'react';
import {Permission, requestMultiple, openSettings} from 'react-native-permissions';
import styled from 'styled-components/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Alert, TouchableOpacity} from 'react-native';
import {useAppDispatch} from '../redux';
import usePermission from './hooks/usePermisson';
import {setPermission} from '../redux/setting/settingSlice';
import {Box, Text} from 'native-base';
import AccessDialog from './access-dialog';
import {modalSliceActions} from '../redux/modal/modalSlice';
import {Center, MainContainer, MainText} from './layout/layout';
import {SvgApple} from './svg/svg';

import Icon from 'react-native-vector-icons/AntDesign';
import {colors} from './colors';
import CustomButton from './component/custom-button';
/**
 * 필수 권한 허용 요청 페이지
 */
export default function NeedPermissions() {
	const dispatch = useAppDispatch();
	const {checkPermissions} = usePermission();
	const [showModal, setShowModal] = useState(false);
	const modalProps = useRef<ModalProps>({
		type: 'denied',
		deniedList: [],
	});
	const IconContainer = styled(Icon)`
		width: 10%;
	`;

	const items = [
		{
			id: '1',
			title: '기기 및 앱 기록',
			desc: '서비스 개선 및 오류 확인',
			logo: <IconContainer name={'mobile1'} size={25} color={colors.selectButton} />,
		},
		{
			id: '2',
			title: '저장공간',
			desc: '내여행,프로필사진에서 사진 업로드',
			logo: <IconContainer name={'folder1'} size={25} color={colors.selectButton} />,
		},
		{
			id: '3',
			title: '사진 / 카메라',
			desc: '내여행,프로필사진에서 사진 업로드',
			logo: <IconContainer name={'camera'} size={25} color={colors.selectButton} />,
		},
	];

	const clickConfirmBtn = async () => {
		try {
			const {hasBlocked, deniedList} = await checkPermissions();
			if (hasBlocked) showDialogModal('blocked', deniedList);
			else requestMultiplePermissions(deniedList);
		} catch (e) {
			dispatch(setPermission(false));
		}
	};

	const requestMultiplePermissions = async (deniedList: Permission[]) => {
		try {
			const res = await requestMultiple(deniedList);
			const checkResult = await checkPermissions(res);
			const status = checkResult.hasBlocked ? 'blocked' : checkResult.deniedList.length ? 'denied' : 'granted';
			console.log(status);
			showDialogModal(status, checkResult.deniedList);
		} catch (e) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '권한요청 중 에러가 발생했습니다.',
				}),
			);
		}
	};

	const showDialogModal = (status: string, deniedList: Permission[]) => {
		modalProps.current.deniedList = deniedList;

		switch (status) {
			case 'blocked':
				modalProps.current.type = 'blocked';
				setShowModal(true);
				break;
			case 'denied':
				modalProps.current.type = 'denied';
				setShowModal(true);
				break;
			case 'granted':
				dispatch(setPermission(true));
				break;
		}
	};

	// 모달 props
	const closeModal = () => setShowModal(false);

	const requestAgain = () => {
		requestMultiplePermissions(modalProps.current.deniedList);
		setShowModal(false);
	};

	const openSetting = async () => {
		await openSettings();
		setShowModal(false);
	};

	return (
		<PermissionMainContainer>
			<PermissionText>{`다님 앱 이용에 필요한\n접근 권한 안내`}</PermissionText>
			{items.map(item => (
				<PermissionElementContainer>
					<SvgApple color={'black'} />
					<ItemBox key={item.id}>
						{item.logo}
						<TextBox>
							<TitleText>{item.title}</TitleText>
							<SubText>{item.desc}</SubText>
						</TextBox>
					</ItemBox>
				</PermissionElementContainer>
			))}
			<CustomButtonContainer>
				<CustomButton label='확인' width={80} onPress={clickConfirmBtn}></CustomButton>
			</CustomButtonContainer>
			<AccessDialog
				type={modalProps.current.type}
				open={showModal}
				onClose={closeModal}
				onRequestAgain={requestAgain}
				onOpenSetting={openSetting}
			/>
		</PermissionMainContainer>
	);
}
const PermissionText = styled.Text`
	font-size: 24px;
	font-weight: 900;
	color: black;
`;
const PermissionMainContainer = styled.ScrollView`
	background-color: white;
	padding: 10%;
`;
const TitleText = styled.Text`
	font-size: 18px;
	font-weight: bold;
	color: black;
`;
const SubText = styled.Text`
	font-size: 15px;
	color: grey;
	margin: 2px 0px 0px 0px;
`;
const ItemBox = styled.View`
	flex-direction: row;
	align-items: center;
	height: 65px;
	padding: 8px;
`;
const TextBox = styled.View`
	margin-left: 16px;
`;
const PermissionElementContainer = styled.View`
	width: 100%;
`;

const CustomButtonContainer = styled.View`
	margin: 50px 0px 0px 0px;
`;
interface ModalProps {
	type: 'blocked' | 'denied';
	deniedList: Permission[];
}
