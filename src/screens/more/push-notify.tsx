import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {HStack, PretendardSemiBoldText} from '../../utill/layout/layout';
import {openSettings, checkNotifications} from 'react-native-permissions';
import {useCallback, useEffect} from 'react';
import {userSliceActions} from '../../redux/user/user.slice';
import {colors} from '../../utill/colors';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {SettingElement} from './more-info';
import {useFocusEffect} from '@react-navigation/native';
export default function PushNotify({navigation}: any) {
	const dispatch = useAppDispatch();
	const {pushNotify} = useAppSelector(state => state.userSlice);
	const goSetting = async () => {
		await openSettings();
	};
	const checkPermission = async () => {
		const authStatus = await checkNotifications();
		dispatch(userSliceActions.setPushNotify(authStatus.status == 'granted' ? true : false));
	};
	useFocusEffect(
		useCallback(() => {
			checkPermission();
		}, []),
	);
	return (
		<SettingElement bottomShow={true} onPress={goSetting}>
			<HStack justifyContent='space-between'>
				<PretendardSemiBoldText size={14} lineHeight={21} color={colors.Black}>
					알림 설정
				</PretendardSemiBoldText>
				<OnOffBox status={pushNotify}>
					<InsideCircle status={pushNotify}></InsideCircle>
				</OnOffBox>
			</HStack>
		</SettingElement>
	);
}

const OnOffBox = styled.View<{status: boolean}>`
	width: ${widthPercentage(36.67)}px;
	height: ${heightPercentage(23.33)}px;
	background-color: ${colors.Gray1};
	padding: 0px ${widthPercentage(3)}px;
	border-radius: 12px;
	justify-content: center;
	align-items: ${props => (props.status ? 'flex-end' : 'flex-start')};
`;
const InsideCircle = styled.View<{status: boolean}>`
	width: ${widthPercentage(13.33)}px;
	height: ${widthPercentage(13.33)}px;
	border-radius: 99px;
	background-color: ${props => (props.status ? colors.PointYellow : colors.Gray4)};
`;
