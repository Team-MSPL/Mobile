import styled from 'styled-components/native';
import {Fragment, useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {getNotice} from '../../redux/user/user.slice';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {colors} from '../../utill/colors';
import {BackgroundGray, PretendardSemiBoldText, PretendardVariableText} from '../../utill/layout/layout';
import moment from 'moment';
import {widthPercentage} from '../../utill/layout/responsive-size';
export default function Notice({navigation}: any) {
	const dispatch = useAppDispatch();

	const [noticeList, setNoticeList] = useState<NoticeType[]>([]);
	const {isLoading} = useAppSelector(state => state.loadingSlice);

	const getNoteListData = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			const dataList = await dispatch(getNotice()).unwrap();
			setNoticeList(dataList);
			console.log(dataList);
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
	const clickNotice = (e: number) => {
		navigation.navigate('NoticeDetail', {data: noticeList[e]});
	};
	return (
		<BackgroundGray>
			{noticeList.length == 0 ? (
				<PretendardSemiBoldText size={14} lineHeight={21} color={colors.Black}>
					공지가 없습니다!
				</PretendardSemiBoldText>
			) : (
				<ElementScrollView>
					{noticeList.map((item, idx) => (
						<ElementContainer
							key={idx}
							onPress={() => {
								clickNotice(idx);
							}}>
							<PretendardSemiBoldText size={14} lineHeight={21} color={colors.Black}>
								{item.noticeTitle}
							</PretendardSemiBoldText>
							<PretendardVariableText
								width={widthPercentage(327)}
								numberOfLines={3}
								size={14}
								lineHeight={21}
								color={colors.Gray4}>
								{item.noticeContent}
							</PretendardVariableText>
							<PretendardVariableText textAlign='right' size={12} lineHeight={18} color={colors.Gray4}>
								{moment(item.noticedAt).format('YYYY.MM.DD')}
							</PretendardVariableText>
						</ElementContainer>
					))}
				</ElementScrollView>
			)}
		</BackgroundGray>
	);
}
const ElementContainer = styled.TouchableOpacity`
	width: 100%;
	border-bottom-width: 1px;
	padding: ${widthPercentage(10)}px;
	border-bottom-color: ${colors.Gray1};
	gap: ${widthPercentage(10)}px;
`;
const ElementScrollView = styled.ScrollView`
	width: 100%;
`;
export interface NoticeType {
	_id: string;
	noticeTitle: string;
	noticeContent: string;
	noticeImage: [string, string];
	noticedAt: string;
	__v: number;
}
