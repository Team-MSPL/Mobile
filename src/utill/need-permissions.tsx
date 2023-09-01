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

	const items = [
		{id: '1', title: '기기 및 앱 기록', desc: '서비스 개선 및 오류 확인'},
		{id: '2', title: '저장공간', desc: '내여행,프로필사진에서 사진 업로드'},
		{id: '3', title: '사진 / 카메라', desc: '내여행,프로필사진에서 사진 업로드'},
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
		<SafeAreaView>
			<Box>
				<Text fontSize='lg'>{`다님 앱 이용에 필요한\n접근 권한 안내`}</Text>
				{items.map(item => (
					<ItemBox key={item.id}>
						<TextBox>
							<Text fontWeight='700'>{item.title}</Text>

							<Text>{item.desc}</Text>
						</TextBox>
					</ItemBox>
				))}
				<TouchableOpacity onPress={clickConfirmBtn}>
					<Text fontSize='xl' bold>
						확인
					</Text>
				</TouchableOpacity>
				<AccessDialog
					type={modalProps.current.type}
					open={showModal}
					onClose={closeModal}
					onRequestAgain={requestAgain}
					onOpenSetting={openSetting}
				/>
			</Box>
		</SafeAreaView>
	);
}

const ScreenLayout = styled.View`
	padding-top: 68px;
	flex: 1;
	background-color: red;
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
interface ModalProps {
	type: 'blocked' | 'denied';
	deniedList: Permission[];
}
