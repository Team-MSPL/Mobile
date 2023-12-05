import styled from 'styled-components/native';
import {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {getNoteList} from '../../redux/user/user.slice';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {colors} from '../../utill/colors';
export default function Notice({navigation}: any) {
	const dispatch = useAppDispatch();

	const [noticeList, setNoticeList] = useState([]);
	const {isLoading} = useAppSelector(state => state.loadingSlice);
	const getNoteListData = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			const dataList = await dispatch(getNoteList()).unwrap();
			setNoticeList(dataList);
		} catch (err) {
			dispatch(modalSliceActions.setOpenModal({modalTitle: '잠시후 다시 시도해주세요'}));
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	useEffect(() => {
		getNoteListData();
	}, []);
	if (isLoading) return <></>;
	return (
		<MainContainer>
			{noticeList.length == 0 ? (
				<ElementText>공지가 없습니다!</ElementText>
			) : (
				<ElementScrollView>
					{noticeList.map((item, idx) => (
						<ElementContainer key={idx}>
							<ElementText>{item}</ElementText>
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
`;
const MainContainer = styled.View`
	flex: 1;
	align-items: center;
	justify-content: center;
	padding: 10px;
	background-color: ${colors.main};
`;
const ElementContainer = styled.View`
	width: 100%;
	border-bottom-width: 1px;
	padding: 10px;
	border-bottom-color: ${colors.regionNormal};
`;
const ElementScrollView = styled.ScrollView`
	width: 100%;
`;
