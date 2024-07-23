import AsyncStorage from '@react-native-async-storage/async-storage';
import {Modal, Platform, ScrollView} from 'react-native';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {userSliceActions} from '../../redux/user/user.slice';
import {colors} from '../../utill/colors';
import {useAppsflyer} from '../../utill/hooks/useAppsflyer';
import {useBackHandler} from '../../utill/hooks/useBackhandler';
import {BackgroundGray, HStack, PretendardSemiBoldText} from '../../utill/layout/layout';
import {SVGNoteList, SvgLoginLogo} from '../../utill/svg/svg';
import {useState} from 'react';
import ViewPager from '../../utill/view-pager';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import UserManage from './user-manage';
import PrimaryButton from '../../utill/component/primary-button';
import {WhiteContainer} from '../enroll-info/final-check';
import Coupon from './coupon';
import PushNotify from './push-notify';
export default function MoreInfo({navigation}: any) {
	const {userName, socialloginProvider, functionToken, userProfileImage} = useAppSelector(state => state.userSlice);
	const {nowVersion, latestVersion} = useAppSelector(state => state.settingSlice);
	const dispatch = useAppDispatch();
	const exceptionKeys = ['isFirstLaunch', 'noPermission'];
	const goLogout = async () => {
		await AsyncStorage.getAllKeys().then(allKeys => {
			const removeList = allKeys.filter(k => !exceptionKeys.some(ek => ek === k));
			AsyncStorage.multiRemove(removeList);
		});
		dispatch(userSliceActions.reset());
		navigation.replace('LoginScreen');
		dispatch(
			modalSliceActions.setOpenModal({
				modalTitle: '로그아웃에 성공했습니다.',
			}),
		);
	};
	const {appsflyerLogEvent} = useAppsflyer();
	useBackHandler({type: 'exit'});
	const goNavigation = (route: string) => {
		navigation.navigate(route);
	};
	const goPayment = () => {
		appsflyerLogEvent({name: 'more_payment_click', value: {id: 'danim'}});
		navigation.navigate('Payment');
	};
	const goBack = () => {
		setViewPagerView(false);
	};
	const goViewPager = () => {
		setViewPagerView(true);
	};
	const [viewPagerView, setViewPagerView] = useState(false);

	const useInfo = [
		{
			title: '공지사항',
			function: () => {
				goNavigation('Notice');
			},
		},
		{
			title: '문의하기',
			function: () => {
				goNavigation('Inquire');
			},
		},
		{
			title: '이용약관',
			function: () => {
				goNavigation('PolicyMain');
			},
		},
		{
			title: '개인정보 처리 방침',
			function: () => {
				goNavigation('Terms');
			},
		},
		{title: '사용 가이드', function: goViewPager},
		// {
		// 	title: '언어(language)',
		// 	function: () => {
		// 		goNavigation('Language');
		// 	},
		// },
	];
	return (
		<ScrollView>
			<Test></Test>
			<BackgroundGray>
				<Modal
					animationType={'fade'}
					transparent={true}
					visible={viewPagerView}
					onRequestClose={() => setViewPagerView(false)}>
					<ViewPager handleFunction={goBack} scrollState={true} />
				</Modal>
				<HStack justifyContent='space-between'>
					<HStack gap={widthPercentage(5)}>
						{userProfileImage == '' ? (
							<NoProfileContainer>
								<SvgLoginLogo
									color={'white'}
									width={widthPercentage(75)}
									height={widthPercentage(75)}
								/>
							</NoProfileContainer>
						) : (
							<ProfileImage source={{uri: userProfileImage}}></ProfileImage>
						)}
						<PretendardSemiBoldText size={20} lineHeight={27} color={colors.Black}>
							{userName}
						</PretendardSemiBoldText>
					</HStack>
					<NoteListContainer>
						<NoteCount>
							<PretendardSemiBoldText size={9} lineHeight={13} color={colors.backgroundWhite}>
								0
							</PretendardSemiBoldText>
						</NoteCount>
						<SVGNoteList
							onPress={() => {
								goNavigation('NoteList');
							}}
							width={widthPercentage(33)}
							height={widthPercentage(33)}></SVGNoteList>
					</NoteListContainer>
				</HStack>
				<UserManage />
				<HStack justifyContent='flex-end'>
					<PrimaryButton
						label='프로필 편집'
						width={widthPercentage(100)}
						height={heightPercentage(40)}
						onPress={() => {
							goNavigation('ChangeProfile');
						}}
						backgroundColor={colors.Primary}
						textColor={colors.Black}></PrimaryButton>
				</HStack>
				<SettingContainer>
					<PretendardSemiBoldText size={14} lineHeight={21} color={colors.Gray4}>
						계정
					</PretendardSemiBoldText>
					<WhiteContainer>
						<SettingElement
							onPress={() => {
								goNavigation('TokenLog');
							}}
							bottomShow={true}>
							<HStack justifyContent='space-between'>
								<PretendardSemiBoldText size={14} lineHeight={21} color={colors.Black}>
									이용권 갯수{'    '} {functionToken} 개
								</PretendardSemiBoldText>
								<PrimaryButton
									label='이용권 구매'
									width={widthPercentage(100)}
									height={heightPercentage(40)}
									onPress={goPayment}
									backgroundColor={colors.Primary}
									textColor={colors.Black}></PrimaryButton>
							</HStack>
						</SettingElement>
						{Platform.OS != 'ios' && <Coupon />}
						<HStack width={widthPercentage(303)} justifyContent='space-between'>
							<PretendardSemiBoldText size={14} lineHeight={21} color={colors.Black}>
								계정타입
							</PretendardSemiBoldText>
							<PretendardSemiBoldText size={14} lineHeight={21} color={colors.Black}>
								{socialloginProvider}
							</PretendardSemiBoldText>
						</HStack>
					</WhiteContainer>
				</SettingContainer>

				<SettingContainer>
					<PretendardSemiBoldText size={14} lineHeight={21} color={colors.Gray4}>
						이용안내
					</PretendardSemiBoldText>
					<WhiteContainer>
						<PushNotify />
						{useInfo.map((item, idx) => (
							<SettingElement
								key={idx}
								onPress={item.function}
								bottomShow={idx == useInfo.length - 1 ? false : true}>
								<PretendardSemiBoldText size={14} lineHeight={21} color={colors.Black}>
									{item.title}
								</PretendardSemiBoldText>
							</SettingElement>
						))}
					</WhiteContainer>
				</SettingContainer>
				<SettingContainer>
					<PretendardSemiBoldText size={14} lineHeight={21} color={colors.Gray4}>
						계정
					</PretendardSemiBoldText>
					<WhiteContainer>
						<SettingElement
							bottomShow={true}
							onPress={() => {
								dispatch(
									modalSliceActions.setOpenModal({
										modalTitle: '로그아웃 하시겠습니까?',
										modalSubTitle: `로그아웃하면 더 이상\n다님의 여행 추천 서비스를 받을 수 없어요 :(`,
										modalTopText: '로그인 상태 유지',
										modalBottomText: '아쉽지만 로그아웃',
										modalBottomFunction: goLogout,
										modalBottomFunctionUse: true,
										modalLeft: true,
									}),
								);
							}}>
							<PretendardSemiBoldText size={14} lineHeight={21} color={colors.PointGreen1}>
								로그아웃
							</PretendardSemiBoldText>
						</SettingElement>
						<SettingElement
							bottomShow={false}
							onPress={() => {
								navigation.navigate('Withdraw');
							}}>
							<PretendardSemiBoldText size={14} lineHeight={21} color={colors.Gray4}>
								계정 삭제
							</PretendardSemiBoldText>
						</SettingElement>
					</WhiteContainer>
				</SettingContainer>
				<PretendardSemiBoldText
					size={14}
					lineHeight={30}
					color={colors.Black}
					marginBottom={heightPercentage(10)}>
					앱 버전 {nowVersion} (최신{latestVersion})
				</PretendardSemiBoldText>
			</BackgroundGray>
		</ScrollView>
	);
}
const NoteListContainer = styled.View`
	width: ${widthPercentage(50)}px;
	height: ${widthPercentage(50)}px;
	align-items: center;
	justify-content: center;
	right: 3px;
	top: 3px;
`;
const NoteCount = styled.View`
	width: ${widthPercentage(11)}px;
	height: ${widthPercentage(15)}px;
	background-color: ${colors.Gray5};
	border-radius: 3px;
	position: absolute;
	z-index: 2;
	right: 2px;
	top: 0;
	align-items: center;
	justify-content: center;
`;
const Test = styled.View`
	width: 100%;
	height: ${heightPercentage(15)}px;
	background-color: ${colors.backgroundGray};
`;
const ProfileImage = styled.Image`
	width: ${widthPercentage(40)}px;
	height: ${widthPercentage(40)}px;
	border-radius: 99px;
`;
const NoProfileContainer = styled.View`
	width: ${widthPercentage(40)}px;
	height: ${widthPercentage(40)}px;
	border-radius: 99px;
	align-items: center;
	justify-content: center;
	background-color: ${colors.Primary};
`;
const SettingContainer = styled.View`
	width: 100%;
	gap: ${widthPercentage(5)}px;
	margin-bottom: ${heightPercentage(30)}px;
`;
export const SettingElement = styled.TouchableOpacity<{bottomShow: boolean}>`
	width: 100%;
	min-height: ${heightPercentage(48)}px;
	justify-content: center;
	border-bottom-width: ${props => (props.bottomShow ? 1 : 0)}px;
	border-color: ${colors.Gray1};
`;
