import {useLayoutEffect, useRef, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {TokenLogType, getTokenLog} from '../../redux/user/user.slice';
import styled from 'styled-components/native';
import {
	BackgroundGray,
	HStack,
	PretendardBoldText,
	PretendardSemiBoldText,
	PretendardVariableText,
	TagContainer,
} from '../../utill/layout/layout';
import moment from 'moment';
import {colors} from '../../utill/colors';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {FlatList} from 'react-native';
import {WhiteContainer} from '../enroll-info/final-check';
import PrimaryButton from '../../utill/component/primary-button';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';

export default function TokenLog({navigation}: any) {
	const dispatch = useAppDispatch();
	const {functionToken} = useAppSelector(state => state.userSlice);
	const [logList, setLogList] = useState<TokenLogType[]>([]);
	const getTokenList = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			const data = await dispatch(getTokenLog()).unwrap();
			setLogList(data.tokenLog);
		} catch (err) {
			dispatch(modalSliceActions.setOpenModal({modalSubTitle: '예기치 못한 오류가 발생했습니다.'}));
			navigation.goBack();
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const goPayment = () => {
		navigation.navigate('Payment');
	};
	useLayoutEffect(() => {
		getTokenList();
	}, []);
	const checkAfter = useRef('');
	const renderItem = (item: any) => {
		// if (checkAfter.current == '') {
		// 	checkAfter.current = item.item.tokenLogDate;
		// } else {
		// 	if (moment(item.item.tokenLogDate).isSame(moment(checkAfter.current).format('YYYY-MM-DD'))) {
		// 		return (
		// 			<PretendardVariableText size={14} lineHeight={21} color={colors.Gray3}>
		// 				{moment(item.item.tokenLogDate).format('YYYY년 M월 DD일 HH:mm')}
		// 			</PretendardVariableText>
		// 		);
		// 	} else {
		// 		return (
		// 			<PretendardVariableText size={14} lineHeight={21} color={colors.Gray3}>
		// 				{item.item.tokenLogDate}
		// 				{/* {moment(item.item.tokenLogDate).from(moment(checkAfter.current).format('YYYY-MM-DD'))} */}
		// 			</PretendardVariableText>
		// 		);
		// 	}
		// }
		return (
			<>
				<PretendardVariableText size={14} lineHeight={21} color={colors.Gray3}>
					{moment(item.item.tokenLogDate).format('YYYY년 M월 DD일 HH:mm')}
				</PretendardVariableText>
				<WhiteContainer>
					<HStack>
						<PretendardVariableText size={14} lineHeight={21} color={colors.Black}>
							사용처 :
						</PretendardVariableText>
						<TagContainer backgroundColor={colors.backgroundGray}>
							<PretendardSemiBoldText size={12} lineHeight={18} color={colors.PointYellow}>
								{item.item.tokenLogContent}
							</PretendardSemiBoldText>
						</TagContainer>
					</HStack>
					<HStack>
						<PretendardVariableText size={14} lineHeight={21} color={colors.Black}>
							{item.item.tokenLogNumber < 0 ? '소모 이용권' : '획득 이용권'}
							{'   ' + Math.abs(item.item.tokenLogNumber)}개
						</PretendardVariableText>
					</HStack>
				</WhiteContainer>
			</>
		);
	};
	return (
		<BackgroundGray>
			<WhiteContainer>
				<HStack justifyContent='space-between' width={widthPercentage(307)}>
					<PretendardBoldText size={15} lineHeight={20} color={colors.Black}>
						이용권 {functionToken}개
					</PretendardBoldText>
					<PrimaryButton
						label='이용권 구매'
						width={widthPercentage(88)}
						height={heightPercentage(32)}
						backgroundColor={colors.Primary}
						textColor={colors.Black}
						onPress={goPayment}></PrimaryButton>
				</HStack>
			</WhiteContainer>
			{logList.length == 0 ? (
				<>
					<PretendardVariableText size={16} lineHeight={24} color={colors.Black}>
						이용기록이 없습니다:(
					</PretendardVariableText>
					<PretendardVariableText size={14} lineHeight={21} color={colors.Gray3}>
						*이용 기록은 2023.11.18 이후 기록만 보여집니다
					</PretendardVariableText>
				</>
			) : (
				<LogContainer>
					<FlatList
						data={logList}
						renderItem={renderItem}
						keyExtractor={item => item._id}
						showsVerticalScrollIndicator={false}></FlatList>
				</LogContainer>
			)}
		</BackgroundGray>
	);
}
const LogContainer = styled.View`
	width: 100%;
`;
