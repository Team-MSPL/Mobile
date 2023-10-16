import React from 'react';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';

/**
 * 필수 접근 권한 거절 시 보여질 모달
 * @returns
 */
export default function AccessDialog({
	type,
	open,
	onClose,
	onRequestAgain,
	onOpenSetting,
	noPermissions,
}: AccessDialogProps) {
	return (
		<Modal isVisible={open} backdropOpacity={0.5}>
			<ModalView>
				<Section>
					<MainText>필수 권한 허용 안내</MainText>
				</Section>
				<Section>
					<SubText>
						{`아래와 같은 이유로 권한 허용이 필요합니다.\n⦁ 위치\n\t\t내 주변 지역 추천을 받기 위한 옵션 \n⦁ 사진/카메라\n\t\t 내여행 다이어리, 커뮤니티 사진, 프로필 사진 업로드\n⦁추적\n\t\t광고 최적화와 사용자 경험 개선을 위해`}
					</SubText>
					{type === 'blocked' && <SubText>권한 허용을 위해 설정화면으로 이동합니다.</SubText>}
				</Section>
				<BtnSection>
					<Btn onPress={noPermissions}>
						<SubText>허용 없이 시작</SubText>
					</Btn>
					{type === 'blocked' ? (
						<Btn onPress={onOpenSetting}>
							<SubText>설정</SubText>
						</Btn>
					) : (
						<Btn onPress={onRequestAgain}>
							<SubText>권한 재요청</SubText>
						</Btn>
					)}
				</BtnSection>
			</ModalView>
		</Modal>
	);
}

const ModalView = styled.View`
	width: 100%;
	background-color: white;
`;
const Section = styled.View`
	padding: 20px;
`;
const BtnSection = styled(Section)`
	flex-direction: row;
	justify-content: flex-end;
`;
const Btn = styled.TouchableOpacity`
	margin-left: 40px;
`;
const MainText = styled.Text`
	font-weight: 700;
	color: black;
`;
const SubText = styled.Text`
	font-weight: 500;
	line-height: 30;
	color: black;
`;
interface AccessDialogProps {
	type: 'denied' | 'blocked';
	open: boolean;
	onClose: () => void;
	onRequestAgain: () => void;
	onOpenSetting: () => void;
	noPermissions: () => void;
}
