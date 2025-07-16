import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../redux';
import {modalSliceActions} from '../redux/modal/modalSlice';
import {colors} from './colors';
import {heightPercentage, widthPercentage} from './layout/responsive-size';
import PrimaryButton from './component/primary-button';
import {HStack, PretendardSemiBoldText, PretendardVariableText} from './layout/layout';
import {useEffect, useRef} from 'react';
import ConfettiCannon from 'react-native-confetti-cannon';
import {SVGCopy} from './svg/svg';
import {TouchableOpacity} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';

export default function BaseModal() {
	const {
		modalOpen,
		modalTitle,
		modalSubTitle,
		modalFunction,
		modalTopText,
		modalBottomText,
		modalBottomFunctionUse,
		modalSingleUse,
		modalConfetti,
		modalConfettiFlag,
		modalBottomFunction,
		modalTextSize,
		travleMedic,
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
	const confettiRef = useRef();
	useEffect(() => {
		if (modalConfetti && !modalConfettiFlag) {
			confettiRef.current.start();
			dispatch(modalSliceActions.setConfettiFlag());
		}
		// ref={confettiRef} confettiCount={50} timeout={0.1} duration={1300}
	}, [modalConfetti, modalConfettiFlag]);
	return (
		<>
			{modalOpen && (
				<Container>
					<ConfettiCannon
						ref={confettiRef}
						autoStart={false}
						count={200}
						origin={{x: -10, y: 0}}></ConfettiCannon>
					<ModalContainer onPress={close}>
						<ViewContaniner modalSingleUse={modalSingleUse}>
							<PretendardSemiBoldText
								textAlign='center'
								size={modalTextSize}
								lineHeight={27}
								color={colors.Gray5}>
								{modalTitle}
							</PretendardSemiBoldText>
							{modalSubTitle && (
								<PretendardVariableText
									textAlign='center'
									size={13}
									lineHeight={21}
									color={colors.Gray4}
									marginTop={5}>
									{modalSubTitle}
								</PretendardVariableText>
							)}
							{travleMedic && (
								<HStack gap={10}>
									<PretendardSemiBoldText
										textAlign='center'
										size={13}
										lineHeight={21}
										color={colors.Gray4}>
										쿠폰번호
									</PretendardSemiBoldText>
									<TouchableOpacity
										onPress={() => {
											Clipboard.setString('다님 할인쿠폰_2501');
											Toast.show({
												type: 'success',
												text1: '복사가 완료되었습니다.',
												position: 'top',
											});
										}}>
										<HStack gap={5}>
											<PretendardVariableText
												textAlign='center'
												size={13}
												lineHeight={21}
												color={colors.Gray4}
												decoration={'underline solid #888888'}>
												다님 할인쿠폰_2501
											</PretendardVariableText>
											<SVGCopy width={widthPercentage(16)} height={widthPercentage(17)} />
										</HStack>
									</TouchableOpacity>
								</HStack>
							)}
							<ButtonContainer>
								<PrimaryButton
									backgroundColor={colors.Gray5}
									textColor={colors.backgroundWhite}
									onPress={handleModalFunction}
									width={widthPercentage(327)}
									height={heightPercentage(50)}
									label={modalTopText}></PrimaryButton>
								{!modalSingleUse && (
									<PrimaryButton
										backgroundColor={
											modalBottomText == '다님 AI 2호' ? colors.Primary : colors.backgroundWhite
										}
										textColor={modalBottomText == '다님 AI 2호' ? colors.Gray5 : colors.Gray400}
										onPress={modalBottomFunctionUse ? handleLeftFunction : close}
										width={widthPercentage(327)}
										height={heightPercentage(50)}
										label={modalBottomText}
										deco={`border-width:1px; border-color:${colors.Gray200};`}></PrimaryButton>
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
//height: ${props => (props.modalSingleUse ? heightPercentage(219) : heightPercentage(269))}px;
const ViewContaniner = styled.Pressable<{modalSingleUse: boolean}>`
	background-color: white;
	width: ${widthPercentage(375)}px;
	border-top-right-radius: 16px;
	border-top-left-radius: 16px;
	align-items: center;
	justify-content: center;
	padding: ${widthPercentage(24)}px;
	border-color: ${colors.Primary};
`;
