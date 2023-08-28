import {Text} from 'native-base';
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
					<Text fontWeight='700'>필수 권한 허용 안내</Text>
				</Section>
				<Section>
					<Text>
						{`아래와 같은 이유로 권한 허용이 필요합니다.\n⦁ 저장공간\n\t\t출간에 필요한 파일 업로드\n⦁ 사진/카메라\n\t\t채팅, 문의에서 사진 업로드\n`}
					</Text>
					{type === 'blocked' && <Text>권한 허용을 위해 설정화면으로 이동합니다.</Text>}
				</Section>
				<BtnSection>
					<Btn onPress={onClose}>
						<Text fontWeight='500'>닫기</Text>
					</Btn>
					{type === 'blocked' ? (
						<Btn onPress={onOpenSetting}>
							<Text fontWeight='500'>설정</Text>
						</Btn>
					) : (
						<Btn onPress={onRequestAgain}>
							<Text fontWeight='500'>권한재요청</Text>
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
interface AccessDialogProps {
	type: 'denied' | 'blocked';
	open: boolean;
	onClose: () => void;
	onRequestAgain: () => void;
	onOpenSetting: () => void;
}
