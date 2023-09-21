import styled from 'styled-components/native';
import {TouchableOpacity, Modal, Text} from 'react-native';
import {useAppDispatch, useAppSelector} from '../redux';
import {modalSliceActions} from '../redux/modal/modalSlice';
import {TitleText, SubText} from './component/policy/policy1';
import {colors} from './colors';
import CustomButton from './component/custom-button';

export default function BaseModal() {
	const {modalOpen, modalLeft, modalTitle, modalSubTitle, modalFunction} = useAppSelector(state => state.modalSlice);
	const dispatch = useAppDispatch();
	const handleModalFunction = () => {
		close();
		modalFunction();
	};
	const close = () => {
		dispatch(modalSliceActions.setCloseModal());
	};
	return (
		<Modal
			animationType={'fade'}
			presentationStyle={'formSheet'}
			transparent={true}
			visible={modalOpen}
			onRequestClose={close}>
			<ModalContainer onPress={close}>
				<ViewContaniner>
					<Body>
						<TitleText>{modalTitle}</TitleText>
					</Body>
					{modalSubTitle && <SubText>{modalSubTitle}</SubText>}

					<Footer left={Boolean(modalLeft)}>
						{modalLeft && (
							<ModalButton left={Boolean(modalLeft)} onPress={close}>
								<ModalText>취소</ModalText>
							</ModalButton>
						)}
						<ModalButton left={Boolean(modalLeft)} onPress={handleModalFunction}>
							<ModalText>확인</ModalText>
						</ModalButton>
					</Footer>
				</ViewContaniner>
			</ModalContainer>
		</Modal>
	);
}

const ModalContainer = styled.Pressable`
	align-items: center;
	justify-content: center;
	flex-directrion: row;
	flex: 1;
	background-color: rgba(255, 255, 255, 0.8);
`;

const ViewContaniner = styled.Pressable`
	background-color: white;
	width: 80%;
	border-radius: 5px;
	border-width: 1px;
	padding: 20px;
	border-color: ${colors.selectButton};
`;
const Header = styled.View`
	margin-vertical: 10px;
`;
const Body = styled(Header)`
	width: 100%;
	display: flex;
`;
const Footer = styled.View<{left: boolean}>`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: ${props => (props.left ? 'space-between' : 'center')};
	width: 100%;
	margin-top: 30px;
`;

const ModalButton = styled.TouchableOpacity<{left: boolean}>`
	width: ${props => (props.left ? 45 : 70)}%;
	padding: 10px 5px 10px 5px;
	background-color: ${colors.selectButton};
	border-radius: 40px;
	align-items: center;
	justify-content: center;
`;

const ModalText = styled.Text`
	font-size: 18px;
	font-weight: bold;
	color: white;
`;
