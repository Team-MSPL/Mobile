import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../redux';
import {modalSliceActions} from '../redux/modal/modalSlice';
import {colors} from './colors';
import {heightPercentage, widthPercentage} from './layout/responsive-size';
import PrimaryButton from './component/primary-button';
import {PretendardSemiBoldText, PretendardVariableText} from './layout/layout';

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
		modalSingleUse,
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
						<ViewContaniner modalSingleUse={modalSingleUse}>
							<PretendardSemiBoldText textAlign='center' size={20} lineHeight={27} color={colors.Gray5}>
								{modalTitle}
							</PretendardSemiBoldText>
							{modalSubTitle && (
								<PretendardVariableText
									textAlign='center'
									size={13}
									lineHeight={21}
									color={colors.Gray4}>
									{modalSubTitle}
								</PretendardVariableText>
							)}
							<ButtonContainer>
								<PrimaryButton
									backgroundColor={colors.Primary}
									textColor={colors.Gray5}
									onPress={handleModalFunction}
									width={widthPercentage(327)}
									height={heightPercentage(50)}
									label={modalTopText}></PrimaryButton>
								{!modalSingleUse && (
									<PrimaryButton
										backgroundColor={colors.Gray1}
										textColor={colors.Gray4}
										onPress={modalBottomFunctionUse ? handleLeftFunction : close}
										width={widthPercentage(327)}
										height={heightPercentage(50)}
										label={modalBottomText}></PrimaryButton>
								)}
							</ButtonContainer>
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

const ViewContaniner = styled.Pressable<{modalSingleUse: boolean}>`
	background-color: white;
	width: ${widthPercentage(375)}px;
	height: ${props => (props.modalSingleUse ? heightPercentage(219) : heightPercentage(269))}px;
	border-top-right-radius: 16px;
	border-top-left-radius: 16px;
	align-items: center;
	justify-content: center;
	padding: ${widthPercentage(24)}px;
	border-color: ${colors.selectButton};
`;
