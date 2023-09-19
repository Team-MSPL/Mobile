import {Modal, Text, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../redux';
import {modalSliceActions} from '../redux/modal/modalSlice';
import {SubText, TitleText} from './component/policy/policy1';

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
			//transparent={true}
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
							<TouchableOpacity onPress={close}>
								<Text>취소</Text>
							</TouchableOpacity>
						)}
						<TouchableOpacity onPress={handleModalFunction}>
							<Text>확인</Text>
						</TouchableOpacity>
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
	padding: 10px;
	border-color: black;
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
	justify-content: ${props => (props.left ? 'space-between' : 'flex-end')};
	width: 100%;
	margin-top: 30px;
	margin-bottom: 20px;
`;
