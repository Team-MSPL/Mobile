import AsyncStorage from '@react-native-async-storage/async-storage';
import {Modal, Platform, ScrollView} from 'react-native';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {userSliceActions, userWithdraw} from '../../redux/user/user.slice';
import {colors} from '../../utill/colors';
import {useAppsflyer} from '../../utill/hooks/useAppsflyer';
import {useBackHandler} from '../../utill/hooks/useBackhandler';
import {BackgroundGray, HStack, PretendardSemiBoldText} from '../../utill/layout/layout';
import {SVGNoteList, SvgLoginLogo} from '../../utill/svg/svg';
import {useState} from 'react';
import ViewPager from '../../utill/view-pager';
import useFirebaseStorage from '../../utill/hooks/useFirebaseStorage';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import UserManage from './user-manage';
import PrimaryButton from '../../utill/component/primary-button';
import {WhiteContainer} from '../enroll-info/final-check';
import Coupon from './coupon';
import PushNotify from './push-notify';
export default function MoreInfo({navigation}: any) {
	const {userName, socialloginProvider, functionToken, userId, userProfileImage} = useAppSelector(
		state => state.userSlice,
	);
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
	const {firebaseImageRemove} = useFirebaseStorage();
	const goWithdraw = async () => {
		try {
			await firebaseImageRemove({pictureList: ['profile'], id: userId, category: 'profile'});
		} catch (err) {
			console.log('이유', err);
		}
		try {
			let signUpFirebase = socialloginProvider == 'kakao' || socialloginProvider == 'apple';
			const data = {userId: userId, signUpFirebase: !signUpFirebase};
			await dispatch(userWithdraw(data));
			await AsyncStorage.getAllKeys().then(allKeys => {
				const removeList = allKeys.filter(k => !exceptionKeys.some(ek => ek === k));
				AsyncStorage.multiRemove(removeList);
			});
			dispatch(userSliceActions.reset());
			navigation.replace('LoginScreen');
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '회원탈퇴가 완료됐습니다.',
				}),
			);
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '회원 탈퇴가 실패했습니다',
					modalSubTitle: '잠시후 다시 시도해주세요',
				}),
			);
		}
	};
	const {appsflyerLogEvent} = useAppsflyer();
	useBackHandler({type: 'exit'});
	const changeInfo = () => {
		navigation.navigate('ChangeProfile');
	};
	const goPayment = () => {
		appsflyerLogEvent({name: 'more_payment_click', value: {id: 'danim'}});
		navigation.navigate('Payment');
	};
	const goTerms = () => {
		navigation.navigate('Terms');
	};
	const goPolicy = () => {
		navigation.navigate('PolicyMain');
	};
	const handleInquire = () => {
		navigation.navigate('Inquire');
	};
	const goNoteList = () => {
		navigation.navigate('NoteList');
	};
	const goTokenLog = () => {
		navigation.navigate('TokenLog');
	};
	const goBack = () => {
		setViewPagerView(false);
	};
	const goViewPager = () => {
		setViewPagerView(true);
	};
	const [viewPagerView, setViewPagerView] = useState(false);
	const goNotice = () => {
		navigation.navigate('Notice');
	};
	const useInfo = [
		{title: '공지사항', function: goNotice},
		{title: '문의하기', function: handleInquire},
		{title: '이용약관', function: goPolicy},
		{title: '개인정보 처리 방침', function: goTerms},
		// {title: '사용 가이드', function: goViewPager},
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
					<ViewPager handleFunction={goBack} />
				</Modal>
				<HStack justifyContent='space-between'>
					<HStack gap={widthPercentage(5)}>
						{userProfileImage == '' ? (
							<NoProfileContainer>
								<SvgLoginLogo color={'white'} width={75} height={75} />
							</NoProfileContainer>
						) : (
							<ProfileImage source={{uri: userProfileImage}}></ProfileImage>
						)}
						<PretendardSemiBoldText size={20} lineHeight={27} color={colors.Black}>
							{userName}
						</PretendardSemiBoldText>
					</HStack>
					<SVGNoteList
						onPress={goNoteList}
						width={widthPercentage(33)}
						height={widthPercentage(33)}></SVGNoteList>
				</HStack>
				<UserManage />
				<HStack justifyContent='flex-end'>
					<PrimaryButton
						label='프로필 편집'
						width={widthPercentage(100)}
						height={heightPercentage(40)}
						onPress={changeInfo}
						backgroundColor={colors.Primary}
						textColor={colors.Black}></PrimaryButton>
				</HStack>
				<SettingContainer>
					<PretendardSemiBoldText size={14} lineHeight={21} color={colors.Gray4}>
						계정
					</PretendardSemiBoldText>
					<WhiteContainer>
						<SettingElement onPress={goTokenLog} bottomShow={true}>
							<HStack justifyContent='space-between'>
								<PretendardSemiBoldText size={14} lineHeight={21} color={colors.Black}>
									이용권 갯수{'    '} {functionToken} 개
								</PretendardSemiBoldText>
								<PrimaryButton
									label='이용권 구매'
									width={widthPercentage(100)}
									height={heightPercentage(32)}
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
								dispatch(
									modalSliceActions.setOpenModal({
										modalTitle: '계정 삭제 하시겠습니까?',
										modalSubTitle: `탈퇴하면 더 이상 다님의 여행 추천 서비스를 받을 수 없고\n여행기록도 사라지게 되어요.`,
										modalTopText: '다님과 게속 여행하기',
										modalBottomText: '아쉽지만 계정 삭제',
										modalBottomFunction: goWithdraw,
										modalBottomFunctionUse: true,
										modalLeft: true,
									}),
								);
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
const Test = styled.View`
	width: ${widthPercentage(327)}px;
	height: ${heightPercentage(10)}px;
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
	background-color: ${colors.selectButton};
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
