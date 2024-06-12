import React from 'react';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';
import {colors} from './colors';
import {PretendardBoldText, PretendardVariableText} from './layout/layout';

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
					<PretendardBoldText size={13} lineHeight={18} color={colors.Black}>
						권한 허용 안내
					</PretendardBoldText>
				</Section>
				<Section>
					<PretendardVariableText size={16} lineHeight={30} color={colors.Black}>
						{`아래와 같은 이유로 권한 허용이 필요합니다.\n⦁ 위치\n 앱 내 기능 중 지역 추천 기능에서 여행 반경을 설정할 때 내 주변 지역을 추천 받기위해 선택적으로 위치 라이브러리 접근 권한 동의가 필요합니다. \n\n⦁ 사진/카메라\n 내 여행 다이어리, 커뮤니티 사진, 프로필 사진 변경에서 사진 첨부 기능 사용을 위해 사진 라이브러리 접근 권한 동의가 필요합니다.\n\n⦁추적\n 광고 최적화와 사용자 경험 개선을 위해 데이터 추적이 필요합니다. `}
					</PretendardVariableText>
					{/* {type === 'blocked' && <SubText>권한 허용을 위해 설정화면으로 이동합니다.</SubText>} */}
				</Section>
				<BtnSection>
					<Btn onPress={noPermissions}>
						<PretendardVariableText size={16} lineHeight={30} color={colors.Black}>
							허용 없이 시작
						</PretendardVariableText>
					</Btn>
					{type === 'blocked' ? (
						<Btn onPress={onOpenSetting}>
							<PretendardVariableText size={16} lineHeight={30} color={colors.Black}>
								설정
							</PretendardVariableText>
						</Btn>
					) : (
						<Btn onPress={onRequestAgain}>
							<PretendardVariableText size={16} lineHeight={30} color={colors.Black}>
								권한 재요청
							</PretendardVariableText>
						</Btn>
					)}
				</BtnSection>
			</ModalView>
		</Modal>
	);
}

const ModalView = styled.View`
	width: 100%;
	background-color: ${colors.main};
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
	noPermissions: () => void;
}
