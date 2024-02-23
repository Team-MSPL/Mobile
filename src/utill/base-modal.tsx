import {Modal} from 'react-native';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../redux';
import {modalSliceActions} from '../redux/modal/modalSlice';
import {colors} from './colors';
import {SubText, TitleText} from './component/policy/policy1';
import {heightPercentage, widthPercentage} from './layout/responsive-size';
import PrimaryButton from './component/primary-button';

export default function BaseModal() {
	const {
		modalOpen,
		modalBottom,
		modalTitle,
		modalSubTitle,
		modalFunction,
		modalTopText,
		modalBottomText,
		modalBottomFunctionUse,
		modalBottomFunction,
	} = useAppSelector(state => state.modalSlice);
	const dispatch = useAppDispatch();
	const handleModalFunction = () => {
		close();
		modalFunction();
	};
	const close = () => {
		dispatch(modalSliceActions.setCloseModal());
	};
	const handleLeftFunction = () => {
		close();
		modalBottomFunction();
	};
	return (
		<>
			{modalOpen && (
				<Container>
					<ModalContainer onPress={close}>
						<ViewContaniner>
							<TitleText>{modalTitle}</TitleText>
							{modalSubTitle && <SubText>{modalSubTitle}</SubText>}
							<ButtonContainer>
								<PrimaryButton
									backgroundColor={colors.Primary}
									textColor={colors.Gray5}
									onPress={handleModalFunction}
									width={widthPercentage(327)}
									height={heightPercentage(50)}
									label={modalTopText}></PrimaryButton>
								<PrimaryButton
									backgroundColor={colors.Gray1}
									textColor={colors.Gray4}
									onPress={modalBottomFunctionUse ? handleLeftFunction : close}
									width={widthPercentage(327)}
									height={heightPercentage(50)}
									label={modalBottomText}></PrimaryButton>
							</ButtonContainer>
							{/* 
							<Footer left={Boolean(modalLeft)}>
								{modalLeft && (
									<ModalButton
										left={Boolean(modalLeft)}
										onPress={modalLeftFunctionUse ? handleLeftFunction : close}>
										<ModalText>{modalLeftText}</ModalText>
									</ModalButton>
								)}
								<ModalButton left={Boolean(modalLeft)} onPress={handleModalFunction}>
									<ModalText>{modalRightText}</ModalText>
								</ModalButton>
							</Footer> */}
						</ViewContaniner>
					</ModalContainer>
				</Container>
			)}
		</>
	);
}
const ButtonContainer = styled.View`
	margin-top: ${heightPercentage(22)}px;
	gap: ${heightPercentage(11)}px;
`;

const Container = styled.View`
	position: absolute;
	align-items: center;
	justify-content: center;
	width: ${widthPercentage(375)}px;
	height: 100%;
	background-color: rgba(128, 128, 128, 0);
`;
const ModalContainer = styled.Pressable`
	align-items: center;
	justify-content: flex-end;
	flex-directrion: row;
	width: ${widthPercentage(375)}px;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.3);
`;

const ViewContaniner = styled.Pressable`
	background-color: white;
	width: 100%;
	height: ${heightPercentage(269)}px;
	border-top-right-radius: 16px;
	border-top-left-radius: 16px;
	align-items: center;
	justify-content: center;
	padding: ${widthPercentage(24)}px;
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
