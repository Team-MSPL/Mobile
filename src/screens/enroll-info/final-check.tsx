import {Alert, BackHandler} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {EssentialPlaceType, getTravelAi, travelSliceActions} from '../../redux/travel-info/travel.slice';
import CustomButton from '../../utill/component/custom-button';
import {cityViewList} from './select-city';
import {updateFunctionToken, userSliceActions} from '../../redux/user/user.slice';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
	MainContainer,
	VStack,
	HStack,
	PretendardVariableText,
	PretendardSemiBoldText,
	TagContainer,
	BackgroundGray,
	FlexWrap,
} from '../../utill/layout/layout';
import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import {SVGFall, SVGFlag, SVGSpring, SVGSummer, SVGWinter} from '../../utill/svg/svg';
import LoadingTimetable from '../../utill/component/timetable/loading-timetable';

import {ButtonContainer, DayViewContainer, DeleteContainer, ElementContainer} from './select-multi';
import {useAppsflyer} from '../../utill/hooks/useAppsflyer';
import {useTendencyHandler} from '../../utill/hooks/useTendencyHandler';
import {TagShopText} from '../home/main';
import {fontPercentage, heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {MarginContainer} from '../timetable/preset-detail';
export default function FinalCheck({navigation}: any) {
	const {tendencyList} = useTendencyHandler();
	const {
		day,
		region,
		accommodations,
		nDay,
		cityIndex,
		essentialPlaces,
		tendency,
		timeLimitArray,
		transit,
		distance,
		season,
		bandwidth,
		freeTicket,
		regionInfo,
		travelName,
	} = useAppSelector(state => state.travelSlice);
	const {functionToken, signUpReward} = useAppSelector(state => state.userSlice);
	const [loading, setLoading] = useState(false);
	const dispatch = useAppDispatch();
	const goPayment = async () => {
		navigation.navigate('Payment');
	};

	const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
	const goNewLogin = () => {
		navigation.navigate('LoginScreen');
	};
	const checkToken = () => {
		if (freeTicket) {
			goNext();
		} else {
			functionToken >= 1
				? dispatch(
						modalSliceActions.setOpenModal({
							modalTitle: `이용권이 하나가 사용돼요`,
							modalSubTitle: `현재 이용권은 ${functionToken}개입니다.\n사용하시겠습니까?`,
							modalFunction: goNext,
							modalLeft: true,
							modalTopText: '사용하기',
							modalBottomText: '취소',
						}),
				  )
				: dispatch(
						modalSliceActions.setOpenModal({
							modalTitle: '이용권이 부족합니다. 결제창으로 가시겠습니까?',
							modalFunction: goPayment,
							modalLeft: true,
						}),
				  );
		}
	};
	const checkSignUpReward = () => {
		dispatch(userSliceActions.setSignUpReward(false));
	};
	useFocusEffect(
		useCallback(() => {
			if (signUpReward) {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '회원가입 축하드립니다',
						modalSubTitle: `회원가입 기념 이용권을 드렸습니다. ${functionToken}개 입니다.\n이용권은 추천 기능에 사용됩니다.`,
						modalFunction: checkSignUpReward,
					}),
				);
			}
		}, [signUpReward]),
	);
	useEffect(() => {
		const backAction = () => {
			if (navigation.isFocused() && loading) {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: 'AI가 실행 중입니다. 잠시만 기다려주세요.',
						modalFunction: () => {},
						modalSingleUse: true,
					}),
				);
				return true;
			}
		};
		const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
		return () => backHandler.remove();
	}, [loading]);
	const {appsflyerLogEvent} = useAppsflyer();
	const goNext = async () => {
		//navigation.reset({routes: [{name: 'Preset'}]});
		try {
			appsflyerLogEvent({name: 'travle_recommend_excute', value: {id: 'danim'}});
			setLoading(true);
			if (travelName == '신나는 여행' && tendencyList[0]?.list[tendency[0].findIndex(item => item == 1)]) {
				let changeName =
					tendencyList[0]?.list[tendency[0].findIndex(item => item == 1)] +
					(tendency[0].findIndex(item => item == 1) == 0 || tendency[0].findIndex(item => item == 1) == 4
						? ' '
						: ' 함께하는 ') +
					seasonList[season.findIndex(item => item == 1)].title +
					'여행';
				dispatch(travelSliceActions.enrollTravelName(changeName));
			}
			let a = region.map(item => cityViewList[cityIndex].title + ' ' + item);
			if (
				(cityViewList[cityIndex].id >= 9 && region[0] == '전체') ||
				(cityViewList[cityIndex].id == 1 && region[0] == '전체')
			) {
				a = cityViewList[cityIndex].sub.map(
					(value, idx) => cityViewList[cityIndex].title + ' ' + value.subTitle,
				);
				a.shift();
			}
			let copy = [...tendency];
			copy.push(season);
			const result = await dispatch(
				getTravelAi({
					regionList: a,
					accomodationList: accommodations,
					selectList: copy,
					essentialPlaceList: essentialPlaces,
					timeLimitArray: timeLimitArray,
					nDay: nDay + 1,
					transit: transit,
					distanceSensitivity: distance,
					bandwidth: bandwidth,
					freeTicket: freeTicket,
				}),
			).unwrap();
			dispatch(travelSliceActions.selectRegion(a));
			if (result) {
				navigation.popToTop();
				navigation.navigate('Preset');
				!result.data.enoughPlace &&
					dispatch(
						modalSliceActions.setOpenModal({
							modalTitle: '해당 지역의 관광지 갯수가 부족하여 선택한 일정을 꽉 채우지못하였습니다. ',
						}),
					);

				!freeTicket && dispatch(updateFunctionToken({functionToken: functionToken - 1}));
			} else {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '네트워크 연결이 불안정합니다',
						modalSubTitle: '확인후 다시 시도해주세요',
					}),
				);
			}
		} catch (error) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '네트워크 연결이 불안정합니다',
					modalSubTitle: '확인후 다시 시도해주세요',
				}),
			);
		} finally {
			setLoading(false);
		}
	};
	const checkDeleteAccommodation = (e: number) => {
		dispatch(
			modalSliceActions.setOpenModal({
				modalTitle: '삭제하시겠습니까?',
				modalTopText: '삭제할래요',
				modalBottomText: '그냥 둘래요',
				modalFunction: () => deleteAccommodation(e),
			}),
		);
	};
	const checkDeleteEssential = (e: EssentialPlaceType) => {
		dispatch(
			modalSliceActions.setOpenModal({
				modalTitle: '삭제하시겠습니까?',
				modalTopText: '삭제할래요',
				modalBottomText: '그냥 둘래요',
				modalFunction: () => deleteEssential(e),
			}),
		);
	};
	const deleteAccommodation = (e: number) => {
		let copy = [...accommodations];
		copy[e] = {name: '', lat: 0, lng: 0, category: 4, takenTime: 30, photo: ''};
		dispatch(travelSliceActions.enrollAccommodations(copy));
	};
	const deleteEssential = (e: EssentialPlaceType) => {
		const updatedPlaces = essentialPlaces.filter(item => item.id !== e.id);
		dispatch(travelSliceActions.enrollessentialPlaces(updatedPlaces));
	};
	const seasonList = [
		{title: '봄', svg: <SVGSpring width={widthPercentage(24)} height={widthPercentage(27)} />},
		{title: '여름', svg: <SVGSummer width={widthPercentage(24)} height={widthPercentage(27)} />},
		{title: '가을', svg: <SVGFall width={widthPercentage(24)} height={widthPercentage(27)} />},
		{title: '겨울', svg: <SVGWinter width={widthPercentage(24)} height={widthPercentage(27)} />},
	];
	if (loading) return <LoadingTimetable navigation={navigation} />;
	return (
		<>
			<BackgroundGray>
				<MainContainer showsVerticalScrollIndicator={false}>
					<HStack justifyContent='space-between' marginVertical={heightPercentage(10)}>
						<RegionImage source={{uri: regionInfo.photo}} />
						<VStack>
							<PretendardVariableText size={12} lineHeight={18} color={colors.Gray2}>
								{day[0].format('YY-MM-DD') + ' - ' + day[nDay].format('YY-MM-DD')}
							</PretendardVariableText>
							<HStack gap={widthPercentage(5)}>
								<PretendardSemiBoldText
									size={20}
									lineHeight={27}
									color={colors.Gray5}
									width={widthPercentage(150)}>
									{cityViewList[cityIndex].title + region}
									<SVGFlag
										width={widthPercentage(20)}
										height={widthPercentage(20)}
										style={{marginLeft: widthPercentage(8)}}
										color='#DDF2FE'
									/>
								</PretendardSemiBoldText>
							</HStack>
						</VStack>
						<VStack gap={heightPercentage(3)} alignItems='flex-end'>
							<TagContainer backgroundColor={colors.backgroundWhite}>
								<TagShopText color={colors.Gray2} size={fontPercentage(12)}>
									#
								</TagShopText>
								<PretendardSemiBoldText size={12} lineHeight={14} color={colors.Gray5}>
									{!transit ? '자동차·렌트카' : '대중교통'}
								</PretendardSemiBoldText>
							</TagContainer>
							<TagContainer backgroundColor={colors.backgroundWhite}>
								<TagShopText color={colors.Gray2} size={fontPercentage(12)}>
									#
								</TagShopText>
								<PretendardSemiBoldText size={12} lineHeight={14} color={colors.Gray5}>
									{bandwidth ? '여유있는 일정' : '알찬 일정'}
								</PretendardSemiBoldText>
							</TagContainer>
						</VStack>
					</HStack>
					<Parent>
						{tendency[0].find(item => item == 1) && (
							<WhiteContainer
								justifyContent='flex-start'
								width={
									tendency[1].find(item => item == 1) ? widthPercentage(182) : widthPercentage(327)
								}>
								<PretendardVariableText size={12} lineHeight={14.32} color={colors.Gray2}>
									이런 여행을 할래요
								</PretendardVariableText>
								<WhoContainer>
									<HStack width={widthPercentage(182)} gap={widthPercentage(9)}>
										<SvgContainer>
											{seasonList[season.findIndex(item => item == 1)].svg}
										</SvgContainer>
										<PretendardSemiBoldText
											size={14}
											lineHeight={18}
											color={colors.Gray5}
											width={widthPercentage(113)}>
											{tendencyList[0]?.list[tendency[0].findIndex(item => item == 1)]}
											{tendency[0].findIndex(item => item == 1) == 0 ||
											tendency[0].findIndex(item => item == 1) == 4
												? ' '
												: ' 함께하는 '}
											{seasonList[season.findIndex(item => item == 1)].title} 여행
										</PretendardSemiBoldText>
									</HStack>
								</WhoContainer>
							</WhiteContainer>
						)}
						{tendency[1].find(item => item == 1) && (
							<WhiteContainer
								width={
									tendency[0].find(item => item == 1) ? widthPercentage(139) : widthPercentage(327)
								}>
								<PretendardVariableText size={12} lineHeight={14.32} color={colors.Gray2}>
									여행테마
								</PretendardVariableText>
								<FlexWrap gap={widthPercentage(4)} marginBottom={0}>
									{tendency[1].map((item, inx) => {
										return item ? (
											<TagContainer backgroundColor={colors.backgroundGray} key={inx}>
												<TagShopText color={colors.Gray2}>#</TagShopText>
												<PretendardSemiBoldText size={12} lineHeight={14} color={colors.Gray5}>
													{tendencyList[1]?.list[inx]}
												</PretendardSemiBoldText>
											</TagContainer>
										) : null;
									})}
								</FlexWrap>
							</WhiteContainer>
						)}
					</Parent>
					{tendency[2].find(item => item == 1) && (
						<WhiteContainer width={widthPercentage(327)}>
							<PretendardVariableText size={12} lineHeight={14.32} color={colors.Gray2}>
								이런 걸 하고 싶어요
							</PretendardVariableText>
							<FlexWrap gap={widthPercentage(4)} marginBottom={0}>
								{tendency[2].map((item, inx) => {
									return item ? (
										<TagContainer
											backgroundColor={colors.backgroundGray}
											key={inx}
											padding={widthPercentage(3)}
											height={heightPercentage(27)}>
											<PretendardSemiBoldText
												size={12}
												lineHeight={16}
												color={colors.PointYellow}>
												{tendencyList[2]?.list[inx]}
											</PretendardSemiBoldText>
										</TagContainer>
									) : null;
								})}
							</FlexWrap>
						</WhiteContainer>
					)}
					{tendency[3].find(item => item == 1) && (
						<WhiteContainer width={widthPercentage(327)}>
							<PretendardVariableText size={12} lineHeight={14.32} color={colors.Gray2}>
								이런 곳에 가고 싶어요
							</PretendardVariableText>
							<FlexWrap gap={widthPercentage(4)} marginBottom={0}>
								{tendency[3].map((item, inx) => {
									return item ? (
										<TagContainer
											backgroundColor={colors.backgroundGray}
											key={inx}
											padding={widthPercentage(3)}
											height={heightPercentage(27)}>
											<PretendardSemiBoldText size={12} lineHeight={16} color={colors.Gray5}>
												{tendencyList[3]?.list[inx]}
											</PretendardSemiBoldText>
										</TagContainer>
									) : null;
								})}
							</FlexWrap>
						</WhiteContainer>
					)}

					{[...Array(nDay + 1)].map((item, idx) => {
						const filteredPlaces = essentialPlaces.filter(place => place.day === idx + 1);

						return (
							<DayViewContainer key={idx}>
								<HStack>
									<PretendardSemiBoldText size={14} lineHeight={16.7} color={colors.Primary}>
										{'DAY' + (idx + 1)}
									</PretendardSemiBoldText>
									<PretendardSemiBoldText size={14} lineHeight={16.7} color={colors.Gray5}>
										{'   '}
										{day[idx].format('YY.MM.DD') + ' (' + weekdays[day[idx].days()] + ')'}
									</PretendardSemiBoldText>
								</HStack>
								<MultiAllContainer>
									<ElementContainer color={colors.backgroundGray} height={heightPercentage(43)}>
										<PretendardSemiBoldText size={14} lineHeight={16.7} color={colors.Gray2}>
											여행지
										</PretendardSemiBoldText>
									</ElementContainer>
									{filteredPlaces.length != 0 && (
										<FlexWrap gap={10}>
											{filteredPlaces.map((data, index) => (
												<ElementContainer color={colors.backgroundGray} key={index}>
													<VStack width={widthPercentage(243)}>
														<HStack gap={3}>
															<PretendardSemiBoldText
																size={16}
																lineHeight={21.6}
																color={colors.Gray5}
																width={widthPercentage(200)}>
																{data.name}
															</PretendardSemiBoldText>
															<PretendardSemiBoldText
																size={12}
																lineHeight={16.2}
																color={colors.PointYellow}>
																{data.takenTime / 60}시간
															</PretendardSemiBoldText>
														</HStack>
														<PretendardVariableText
															color={colors.Gray2}
															size={12}
															lineHeight={18}>
															{data.formatted_address}
														</PretendardVariableText>
													</VStack>
													<DeleteContainer
														onPress={() => {
															checkDeleteEssential(data);
														}}>
														<PretendardSemiBoldText
															size={12}
															lineHeight={18}
															color={colors.Gray5}>
															취소
														</PretendardSemiBoldText>
													</DeleteContainer>
												</ElementContainer>
											))}
										</FlexWrap>
									)}
								</MultiAllContainer>
								{idx != nDay && (
									<MultiAllContainer>
										<ElementContainer color={colors.backgroundGray} height={heightPercentage(43)}>
											<PretendardSemiBoldText size={14} lineHeight={16.7} color={colors.Gray2}>
												숙소
											</PretendardSemiBoldText>
										</ElementContainer>
										{accommodations[idx + 1].name && (
											<ElementContainer color={colors.backgroundGray}>
												<VStack width={widthPercentage(243)}>
													<PretendardSemiBoldText
														size={16}
														lineHeight={21.6}
														width={widthPercentage(200)}
														color={colors.Gray5}>
														{accommodations[idx + 1].name}
													</PretendardSemiBoldText>
													<PretendardVariableText
														color={colors.Gray2}
														size={12}
														lineHeight={18}>
														{accommodations[idx + 1].formatted_address}
													</PretendardVariableText>
												</VStack>

												<DeleteContainer
													onPress={() => {
														checkDeleteAccommodation(idx + 1);
													}}>
													<PretendardSemiBoldText
														size={12}
														lineHeight={18}
														color={colors.Gray5}>
														취소
													</PretendardSemiBoldText>
												</DeleteContainer>
											</ElementContainer>
										)}
									</MultiAllContainer>
								)}
							</DayViewContainer>
						);
					})}
				</MainContainer>
				<MarginContainer />
			</BackgroundGray>
			<ButtonContainer>
				<CustomButton label='추천일정 조회' onPress={checkToken}></CustomButton>
			</ButtonContainer>
		</>
	);
}
export const RegionImage = styled.Image`
	width: ${widthPercentage(50)}px;
	height: ${heightPercentage(50)}px;
	border-radius: 12px;
`;
const SvgContainer = styled.View`
	width: ${widthPercentage(40)}px;
	height: ${widthPercentage(40)}px;
	background-color: ${colors.backgroundGray};
	border-radius: 6.4px;
	align-items: center;
	justify-content: center;
`;
export const WhiteContainer = styled.View<{width?: number; justifyContent?: string; alignItems?: string}>`
	width: ${props => props.width + 'px' ?? '100%'};
	background-color: ${colors.backgroundWhite};
	border-radius: 8px;
	align-items: ${props => props.alignItems ?? 'flex-start'};
	justify-content: ${props => props.justifyContent ?? 'center'};
	padding: ${heightPercentage(8)}px ${widthPercentage(10)}px;
	gap: ${widthPercentage(3)}px;
	margin-bottom: ${heightPercentage(10)}px;
`;
const MultiAllContainer = styled.View`
	width: ${widthPercentage(300)}px;
	border-radius: 12px;
	background-color: ${colors.backgroundGray};
	gap: ${widthPercentage(3)}px;
`;
const Parent = styled.View`
	flex-direction: row;
	overflow: hidden;
	position: relative;
	width: 100%;
	gap: ${widthPercentage(6)}px;
`;
const WhoContainer = styled.View`
	flex: 1;
	align-items: center;
	justify-content: center;
`;
