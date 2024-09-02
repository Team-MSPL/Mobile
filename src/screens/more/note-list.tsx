import styled from 'styled-components/native';
import {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {getNoteList} from '../../redux/user/user.slice';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {colors} from '../../utill/colors';
import {
	BackgroundGray,
	Center,
	HStack,
	PretendardSemiBoldText,
	PretendardVariableText,
} from '../../utill/layout/layout';
import {widthPercentage} from '../../utill/layout/responsive-size';
import {SVGDanimLogo} from '../../utill/svg/svg';
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
	useEffect(() => {
		getNoteListData();
	}, []);
	if (isLoading) return <></>;
	return (
		<BackgroundGray>
			{noteList.length == 0 ? (
				<Center>
					<PretendardVariableText size={16} lineHeight={24} color={colors.Black}>
						쪽지가 없습니다
					</PretendardVariableText>
				</Center>
			) : (
				<ElementScrollView>
					{noteList.map((item, idx) => (
						<ElementContainer key={idx}>
							<HStack marginHorizon={-widthPercentage(30)} gap={widthPercentage(10)}>
								<SVGDanimLogo width={widthPercentage(24)} height={widthPercentage(24)} />
								<PretendardSemiBoldText size={14} lineHeight={21} color={colors.Black}>
									다님
								</PretendardSemiBoldText>
							</HStack>
							<PretendardVariableText
								selectable
								size={14}
								lineHeight={21}
								color={colors.Black}
								textAlign='left'>
								{item}
							</PretendardVariableText>
						</ElementContainer>
					))}
				</ElementScrollView>
			)}
		</BackgroundGray>
	);
}
const ElementContainer = styled.View`
	width: 100%;
	border-bottom-width: 1px;
	padding: ${widthPercentage(10)}px ${widthPercentage(30)}px;
	border-bottom-color: ${colors.Gray1};
`;
const ElementScrollView = styled.ScrollView`
	width: 100%;
`;
