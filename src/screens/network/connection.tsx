import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import CustomButton from '../../utill/component/custom-button';
import {useAppDispatch} from '../../redux';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {networkCheck} from '../../redux/network/networkSlice';
import {modalSliceActions} from '../../redux/modal/modalSlice';

export default function Connection() {
	const dispatch = useAppDispatch();
	const checkNetwork = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			await dispatch(networkCheck());
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '연결확인',
					modalSubTitle: '네트워크 오류가 발생했습니다.',
				}),
			);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	return (
		<Container>
			<ViewContaniner>
				<Guide>네트워크 연결이 불안정합니다{'\n'}확인 후 다시 시도해주세요.</Guide>
				<CustomButton label={'새로고침'} onPress={checkNetwork} width={50} />
			</ViewContaniner>
		</Container>
	);
}

const Container = styled.View`
	position: absolute;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	background-color: rgba(250, 250, 255, 0.9);
`;
const Guide = styled.Text`
	font-size: 16px;
	text-align: center;
	line-height: 24.5px;
	font-weight: 500;
	color: black;
`;
const ViewContaniner = styled.Pressable`
	background-color: white;
	width: 80%;
	border-radius: 5px;
	border-width: 1px;
	padding: 20px;
	border-color: ${colors.selectButton};
`;
