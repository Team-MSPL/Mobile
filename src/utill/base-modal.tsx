import styled from 'styled-components/native';
import {TouchableOpacity, Modal, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export default function BaseModal({visible, close, title, left, right}: ModalProps) {
	const navigation = useNavigation();
	const goBack = () => {
		navigation.goBack();
	};
	return (
		<Modal
			animationType={'fade'}
			presentationStyle={'formSheet'}
			transparent={true}
			visible={visible}
			onRequestClose={close}>
			<ModalContainer>
				<ViewContaniner>
					<Header>
						<Text>알리미</Text>
					</Header>
					<Body>
						<Text>{title}</Text>
					</Body>
					<Footer left={Boolean(left)}>
						{left && (
							<TouchableOpacity onPress={left}>
								<Text>취소</Text>
							</TouchableOpacity>
						)}
						<TouchableOpacity onPress={Boolean(right) ? right : goBack}>
							<Text>확인</Text>
						</TouchableOpacity>
					</Footer>
				</ViewContaniner>
			</ModalContainer>
		</Modal>
	);
}

const ModalContainer = styled.View`
	align-items: center;
	justify-content: center;
	flex-directrion: row;
	flex: 1;
	background-color: rgba(255, 255, 255, 0.5);
`;

const ViewContaniner = styled.View`
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

interface ModalProps {
	visible?: boolean;
	close?: () => void;
	title: string;
	children?: JSX.Element | JSX.Element[];
	left?: () => void;
	right?: () => void;
}
