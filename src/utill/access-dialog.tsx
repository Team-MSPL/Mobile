import React from 'react';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';

/**
 * 필수 접근 권한 거절 시 보여질 모달
 * @returns
 */
export default function AccessDialog({type, open, onClose, onRequestAgain, onOpenSetting}: AccessDialogProps) {
	return (
		<Modal isVisible={open} backdropOpacity={0.5}>
			<ModalView>
				<Section>
					<MainText>필수 권한 허용 안내</MainText>
				</Section>
				<Section>
					<SubText>
						{`아래와 같은 이유로 권한 허용이 필요합니다.\n⦁ 위치\n\t\t여행 추천 받을때 \n⦁ 사진/카메라\n\t\t 내여행, 커뮤니티 사진 업로드\n`}
					</SubText>
					{type === 'blocked' && <SubText>권한 허용을 위해 설정화면으로 이동합니다.</SubText>}
				</Section>
				<BtnSection>
					<Btn onPress={onClose}>
						<SubText>닫기</SubText>
					</Btn>
					{type === 'blocked' ? (
						<Btn onPress={onOpenSetting}>
							<SubText>설정</SubText>
						</Btn>
					) : (
						<Btn onPress={onRequestAgain}>
							<SubText>권한재요청</SubText>
						</Btn>
					)}
				</BtnSection>
			</ModalView>
		</Modal>
	);
}

const ModalView = styled.View`
	width: 335px;
	margin: 0 auto;
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
`;
const SubText = styled.Text`
	font-weight: 500;
`;
interface AccessDialogProps {
	type: 'denied' | 'blocked';
	open: boolean;
	onClose: () => void;
	onRequestAgain: () => void;
	onOpenSetting: () => void;
}
