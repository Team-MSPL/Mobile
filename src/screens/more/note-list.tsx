import styled from 'styled-components/native';
import {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {getNoteList} from '../../redux/user/user.slice';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {colors} from '../../utill/colors';
import {HStack} from '../../utill/layout/layout';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/AntDesign';
export default function NoteList({navigation}: any) {
	const dispatch = useAppDispatch();

	const [noteList, setNoteList] = useState([]);
	const {isLoading} = useAppSelector(state => state.loadingSlice);
	const getNoteListData = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			const dataList = await dispatch(getNoteList()).unwrap();
			setNoteList(dataList);
		} catch (err) {
			dispatch(modalSliceActions.setOpenModal({modalTitle: '잠시후 다시 시도해주세요'}));
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const handleCopyClipBoard = (e: string) => {
		try {
			Clipboard.setString(e);
			Toast.show({type: 'success', text1: '복사가 완료되었습니다.', position: 'bottom'});
		} catch (err) {
			console.log('qwe', err);
		}
	};
	useEffect(() => {
		getNoteListData();
	}, []);
	if (isLoading) return <></>;
	return (
		<MainContainer>
			{noteList.length == 0 ? (
				<ElementText>쪽지가 없습니다!</ElementText>
			) : (
				<ElementScrollView>
					{noteList.map((item, idx) => (
						<ElementContainer key={idx}>
							<ElementText>{item}</ElementText>
							<ClopTouchable
								onPress={() => {
									handleCopyClipBoard(item);
								}}>
								<Icon name='copy1' size={25} color={'black'}></Icon>
							</ClopTouchable>
						</ElementContainer>
					))}
				</ElementScrollView>
			)}
		</MainContainer>
	);
}

const ElementText = styled.Text`
	font-size: 20px;
	font-weight: 500;
	color: black;
	width: 80%;
`;
const MainContainer = styled.View`
	flex: 1;
	align-items: center;
	justify-content: center;
	padding: 10px;
	background-color: ${colors.main};
`;
const ElementContainer = styled(HStack)`
	width: 100%;
	border-bottom-width: 1px;
	justify-content: space-between;
	padding: 10px;
	border-bottom-color: ${colors.regionNormal};
`;
const ElementScrollView = styled.ScrollView`
	width: 100%;
`;
const ClopTouchable = styled.TouchableOpacity`
	width: 20%;
	align-items: center;
	justify-content: center;
`;
