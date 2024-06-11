import React, {useState, useRef} from 'react';
import {Permission, requestMultiple, openSettings} from 'react-native-permissions';
import styled from 'styled-components/native';
import {useAppDispatch} from '../redux';
import usePermission from './hooks/usePermisson';
import {setPermission, setNopermission} from '../redux/setting/settingSlice';
import AccessDialog from './access-dialog';
import {modalSliceActions} from '../redux/modal/modalSlice';
import {SvgApple} from './svg/svg';

import Icon from 'react-native-vector-icons/AntDesign';
import {colors} from './colors';
import CustomButton from './component/custom-button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform, SafeAreaView} from 'react-native';
import {heightPercentage, widthPercentage} from './layout/responsive-size';
import {PretendardBoldText, PretendardVariableText} from './layout/layout';
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
			logo: <IconContainer name={'mobile1'} size={25} color={colors.Primary} />,
		},
		{
			id: '2',
			title: '저장공간',
			desc: '내여행,프로필사진에서 사진 업로드',
			logo: <IconContainer name={'folder1'} size={25} color={colors.Primary} />,
		},
		{
			id: '3',
			title: '사진 / 카메라',
			desc: '내여행,프로필사진에서 사진 업로드',
			logo: <IconContainer name={'camera'} size={25} color={colors.Primary} />,
		},
		Platform.OS == 'ios' && {
			id: '4',
			title: '추적',
			desc: '광고 최적화와 사용자 경험 개선을 위해 데이터 추적',
			logo: <IconContainer name={'filetext1'} size={25} color={colors.Primary} />,
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
					modalTitle: '권한요청이 실패했습니다.',
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
	const noPermissions = async () => {
		dispatch(setNopermission(true));
		await AsyncStorage.setItem('noPermission', 'true');
		setShowModal(false);
	};

	return (
		<SafeAreaView style={{flex: 1}}>
			<PermissionMainContainer>
				<PretendardBoldText
					size={21}
					lineHeight={26}
					color={colors.Black}>{`다님 앱 이용에 필요한\n접근 권한 안내`}</PretendardBoldText>
				{items.map((item, idx) => (
					<PermissionElementContainer key={idx}>
						<SvgApple width={widthPercentage(25)} height={widthPercentage(25)} color={'black'} />
						<ItemBox key={item.id}>
							{item.logo}
							<TextBox>
								<PretendardBoldText size={18} lineHeight={24} color={colors.Black}>
									{item.title}
								</PretendardBoldText>
								<PretendardVariableText size={12} lineHeight={20} color={colors.Black}>
									{item.desc}
								</PretendardVariableText>
							</TextBox>
						</ItemBox>
					</PermissionElementContainer>
				))}
				<CustomButtonContainer>
					<CustomButton label='확인' width={widthPercentage(80)} onPress={clickConfirmBtn}></CustomButton>
				</CustomButtonContainer>
				<AccessDialog
					type={modalProps.current.type}
					open={showModal}
					onClose={closeModal}
					onRequestAgain={requestAgain}
					onOpenSetting={openSetting}
					noPermissions={noPermissions}
				/>
			</PermissionMainContainer>
		</SafeAreaView>
	);
}
const PermissionMainContainer = styled.ScrollView`
	background-color: ${colors.main};
	padding: 10%;
`;
const ItemBox = styled.View`
	flex-direction: row;
	align-items: center;
	height: ${heightPercentage(65)}px;
	padding: ${widthPercentage(8)}px;
`;
const TextBox = styled.View`
	margin-left: ${widthPercentage(12)}px;
`;
const PermissionElementContainer = styled.View`
	width: 100%;
`;

const CustomButtonContainer = styled.View`
	margin: ${widthPercentage(50)}px 0px 0px 0px;
`;
interface ModalProps {
	type: 'blocked' | 'denied';
	deniedList: Permission[];
}
