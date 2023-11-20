import {useLayoutEffect, useState} from 'react';
import {useAppDispatch} from '../../redux';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {TokenLogType, getTokenLog} from '../../redux/user/user.slice';
import styled from 'styled-components/native';
import {HStack, devicesWidth} from '../../utill/layout/layout';
import moment from 'moment';
import {colors} from '../../utill/colors';
import {modalSliceActions} from '../../redux/modal/modalSlice';

export default function TokenLog() {
	const dispatch = useAppDispatch();
	const [logList, setLogList] = useState<TokenLogType[]>([]);
	const getTokenList = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			const data = await dispatch(getTokenLog()).unwrap();
			setLogList(data.tokenLog);
			console.log(data);
		} catch (err) {
			dispatch(modalSliceActions.setOpenModal({modalSubTitle: '예기치 못한 오류가 발생했습니다.'}));
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	useLayoutEffect(() => {
		getTokenList();
	}, []);
	return (
		<MainContainer>
			{logList.length == 0 ? (
				<NonLogText>이용한 기록이 없습니다.</NonLogText>
			) : (
				<LogScrollView>
					{logList.map((item, idx) => (
						<ElementContainer key={idx}>
							<HStack>
								<LogTitleText>사용처 : </LogTitleText>
								<LogText>{item.tokenLogContent}</LogText>
							</HStack>
							<HStack>
								<LogTitleText>변동 내역 : </LogTitleText>
								<LogText>{item.tokenLogNumber}</LogText>
							</HStack>

							<HStack>
								<LogTitleText>이용 시간 : </LogTitleText>
								<LogText>{moment(item.tokenLogDate).format('YY-MM-DD HH:mm')}</LogText>
							</HStack>
							{/* <LogText>사용처:{moment(item.tokenLogDate)}</LogText> */}
						</ElementContainer>
					))}
				</LogScrollView>
			)}
		</MainContainer>
	);
}
const LogTitleText = styled.Text`
	font-size: ${devicesWidth * 0.05}px;
	font-weight: bold;
	color: black;
`;
const MainContainer = styled.View`
	flex: 1;
	align-items: center;
	justify-content: center;
	padding: 10px;
	background-color: ${colors.main};
`;
const NonLogText = styled.Text`
	font-size: ${devicesWidth * 0.08}px;
	font-weight: bold;
	color: black;
`;
const LogText = styled.Text`
	font-size: ${devicesWidth * 0.05}px;
	color: black;
`;

const LogScrollView = styled.ScrollView`
	width: 100%;
`;

const ElementContainer = styled.View`
	width: 100%;
	border-bottom-width: 1px;
	padding: 10px;
	border-bottom-color: ${colors.regionNormal};
`;
