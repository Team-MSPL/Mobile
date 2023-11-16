import {Alert, BackHandler, Image} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {getTravelAi, travelSliceActions} from '../../redux/travel-info/travel.slice';
import CustomButton from '../../utill/component/custom-button';
import {tendencyList} from './select-tendency';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {cityViewList} from './select-city';
import {updateFunctionToken, userSliceActions} from '../../redux/user/user.slice';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {MainContainer, VStack, HStack} from '../../utill/layout/layout';
import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import {SvgDanimText, SvgHome, SvgLoginLogo, SvgPlace} from '../../utill/svg/svg';
import LoadingTimetable from '../../utill/component/timetable/loading-timetable';
import {DefalutLogoContainer} from './search-place';

import {ButtonContainer, MarginContainder} from './select-multi';
import {useAppsflyer} from '../../utill/hooks/useAppsflyer';
export default function FinalCheck({navigation}: any) {
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
		minuteLimitArray,
		season,
		bandwidth,
	} = useAppSelector(state => state.travelSlice);
	const {functionToken, socialloginProvider, signUpReward} = useAppSelector(state => state.userSlice);
	const {isLoading} = useAppSelector(state => state.loadingSlice);
	const [loading, setLoading] = useState(false);
	const dispatch = useAppDispatch();
	const goPayment = async () => {
		navigation.navigate('Payment');
	};

	const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
	const goNewLogin = () => {
		dispatch(userSliceActions.setAnonymousKeep(true));
		navigation.navigate('LoginScreen');
	};
	const checkToken = () => {
		if (socialloginProvider == 'anonymous') {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '로그인 없이는 이용 불가합니다',
					modalSubTitle: '로그인 하러 가시겠습니까?',
					modalFunction: goNewLogin,
					modalLeft: true,
				}),
			);
		} else {
			functionToken >= 1
				? dispatch(
						modalSliceActions.setOpenModal({
							modalTitle: '이용권이 하나 소모됩니다. 실행하시겠습니까?',
							modalSubTitle: '사용자가 많을시 최대 1분까지 소요됩니다.',
							modalFunction: goNext,
							modalLeft: true,
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
						modalSubTitle: `회원가입 기념 이용권을 드렸습니다. ${functionToken}개 입니다.`,
						modalFunction: checkSignUpReward,
					}),
				);
			}
		}, [signUpReward]),
	);
	useEffect(() => {
		console.log('하위용', accommodations);
		const backAction = () => {
			if (navigation.isFocused() && loading) {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: 'ai가 돌아가고 있습니다 조금만 기다려주세요',
						modalFunction: () => {},
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
			let a = region.map(item => cityViewList[cityIndex].title + ' ' + item);
			if ((cityViewList[cityIndex].id >= 9 && region[0] == '전체') || cityViewList[cityIndex].id == 1) {
				a = cityViewList[cityIndex].sub.map(
					(value, idx) => cityViewList[cityIndex].title + ' ' + value.subTitle,
				);
				a.shift();
			}
			let copy = [...tendency];
			copy.push(season);
			console.log(a, accommodations, copy, essentialPlaces, timeLimitArray, transit, nDay, distance);
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
				}),
			).unwrap();
			dispatch(travelSliceActions.selectRegion(a));
			console.log(result.data);
			if (result) {
				navigation.popToTop();
				navigation.navigate('Preset');
				!result.data.enoughPlace &&
					dispatch(
						modalSliceActions.setOpenModal({
							modalTitle: '해당 지역의 관광지 갯수가 부족하여 선택한 일정을 꽉 채우지못하였습니다. ',
						}),
					);

				dispatch(updateFunctionToken({functionToken: functionToken - 1}));
			} else {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '추천을 받는 중 에러가 발생했습니다.',
					}),
				);
			}
		} catch (error) {
			console.log(error, 'qwe');
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '추천을 받는 중 에러가 발생했습니다.',
				}),
			);
		} finally {
			setLoading(false);
		}
	};

	const goReset = () => {
		navigation.navigate('SelectCity');
		dispatch(travelSliceActions.reset());
	};
	const schedule = ['출발일', '종료일'];
	if (loading) return <LoadingTimetable navigation={navigation} />;
	return (
		<>
			<MainContainer>
				{/* 스테퍼 넣기 */}
				<SelectListAllContainer>
					<SelectListContainer>
						<SelectListText>선택 여행 성향</SelectListText>
						<SelectTendencyListContainer>
							<SelectTendencyContainer>
								<SelectTendencyText># {bandwidth ? '여유있는 일정' : '바쁜 일정'}</SelectTendencyText>
							</SelectTendencyContainer>
							{tendency.map((item, inx) => {
								return item.map((q, a) => {
									return q ? (
										<SelectTendencyContainer key={a}>
											<SelectTendencyText># {tendencyList[inx]?.list[a]}</SelectTendencyText>
										</SelectTendencyContainer>
									) : null;
								});
							})}
						</SelectTendencyListContainer>
					</SelectListContainer>
					<Dashed />
					<SelectListContainer>
						<SelectListText>여행 지역</SelectListText>
						<SelectTendencyListContainer>
							<RegionText>{cityViewList[cityIndex].title + region}</RegionText>
						</SelectTendencyListContainer>
					</SelectListContainer>
					<Dashed />
					<SelectListContainer>
						<SelectListText>여행 일정</SelectListText>

						<SelectTendencyListContainer>
							{schedule.map((element, index) => (
								<DayContainer key={index}>
									<DayText>{element}</DayText>
									<DayElementText>
										{day[index == 0 ? 0 : nDay].format('YY-MM-DD') +
											', ' +
											String(timeLimitArray[index]).padStart(2, '0') +
											':' +
											String(minuteLimitArray[index]).padStart(2, '0')}
									</DayElementText>
								</DayContainer>
							))}
						</SelectTendencyListContainer>
					</SelectListContainer>
				</SelectListAllContainer>
				<Spacer />

				{[...Array(nDay + 1)].map((item, idx) => {
					const filteredPlaces = essentialPlaces.filter(place => place.day === idx + 1);

					return (
						<SelectListAllContainer key={idx}>
							<MultiContainer first={idx == 0} last={idx == nDay}>
								<MultiDayContainer>
									<MultiDayText>Day {idx + 1}</MultiDayText>
									<MultiDaySecondText>
										{day[idx].format('YYYY-MM-DD') + ',' + weekdays[day[idx].days()] + '요일'}
									</MultiDaySecondText>
								</MultiDayContainer>
								{idx != nDay && (
									<MultiAllContainer>
										<HStack>
											<SvgHome color={colors.selectButton} marginRight={5} />
											<MultiDayText>숙소</MultiDayText>
										</HStack>
										{accommodations[idx + 1].name ? (
											<PlaceContainer>
												{accommodations[idx + 1].photo != null ? (
													<PlaceImage
														source={{
															uri: accommodations[idx + 1].photo,
														}}
														alt='Place Image'
													/>
												) : (
													<FinalDefalutLogoContainer>
														<SvgLoginLogo width={30} height={30} color='white' />
													</FinalDefalutLogoContainer>
												)}

												<VStack>
													<MultiElementText>{accommodations[idx + 1].name}</MultiElementText>
													<MultiElementText>
														{accommodations[idx + 1].formatted_address}
													</MultiElementText>
												</VStack>
											</PlaceContainer>
										) : (
											<MultiElementText>선택사항 없음</MultiElementText>
										)}
									</MultiAllContainer>
								)}
								<MultiAllContainer>
									<HStack>
										<SvgPlace color={colors.selectButton} marginRight={5} />
										<MultiDayText>여행지</MultiDayText>
									</HStack>
									{filteredPlaces.length != 0 ? (
										filteredPlaces.map((data, imageIndex) => (
											<PlaceContainer key={imageIndex}>
												{data.photo != null ? (
													<PlaceImage
														source={{
															uri: data.photo,
														}}
														alt='Place Image'
													/>
												) : (
													<FinalDefalutLogoContainer>
														<SvgLoginLogo width={30} height={30} color='white' />
													</FinalDefalutLogoContainer>
												)}

												<VStack>
													<MultiElementText>{data.name}</MultiElementText>
													{/* <MultiElementText>{data.formatted_address}</MultiElementText> */}
												</VStack>
											</PlaceContainer>
										))
									) : (
										<MultiElementText>선택사항 없음</MultiElementText>
									)}
								</MultiAllContainer>
							</MultiContainer>
							<PlaceDashed />
						</SelectListAllContainer>
					);
				})}
				<MarginContainder />
			</MainContainer>
			<ButtonContainer>
				<CustomButton label='맞춤 코스 조회' onPress={checkToken}></CustomButton>
			</ButtonContainer>
		</>
	);
}

export const SelectListContainer = styled.View`
	width: 100%;
	border-radius: 15px;
	background-color: ${colors.selectButton};
	padding: 10px;
`;
const Dashed = styled.View`
	width: 80%;
	border: 2px dashed white;
	margin: -2px;
`;
const SelectListAllContainer = styled.View`
	width: 100%;
	align-items: center;
`;

export const SelectListText = styled.Text`
	font-size: 14px;
	color: white;
	font-weight: 500;
`;
export const SelectTendencyContainer = styled.View`
	padding: 10px;
	border-radius: 10px;
	background-color: white;
	margin: 0px 10px 10px 0px;
`;
export const SelectTendencyListContainer = styled.View`
	display: inline-block;
	flex-direction: row;
	flex-wrap: wrap;
	margin: 10px 0px 10px 0px;
	justify-content: center;
`;

export const SelectTendencyText = styled.Text`
	font-size: 18px;
	font-weight: bold;
	color: ${colors.selectButton};
`;
const RegionText = styled(SelectTendencyText)`
	font-size: 21px;
	color: white;
`;
const DayContainer = styled.View`
	border-radius: 10px;
	border-color: white;
	border-width: 1px;
	padding: 7px;
	margin: 0px 5px 0px 0px;
`;
const DayText = styled.Text`
	font-size: 14px;
	color: white;
`;
const DayElementText = styled.Text`
	font-size: 16px;
	color: white;
	font-weight: 600;
`;
const MultiContainer = styled.View<{first: boolean; last: boolean}>`
	width: 100%;
	border: 2px ${colors.selectButton};
	border-radius: 20px;
	border-bottom-width: ${props => (props.last ? '2px' : '0px')};
	border-top-width: ${props => (props.first ? '2px' : '0px')};
	padding: 10px;
`;
const MultiDayContainer = styled.View`
	width: 100%;
	background-color: ${colors.normalButton};
	border-radius: 8px;
	padding: 10px;
	flex-direction: row;
`;
const MultiDayText = styled.Text`
	font-size: 14px;
	font-weight: bold;
	color: ${colors.selectButton};
`;
const MultiDaySecondText = styled.Text`
	font-size: 14px;
	font-weight: bold;
	color: black;
	margin: 0px 0px 0px 10px;
`;
const MultiElementText = styled.Text`
	font-size: 16px;
	font-weight: 700;
	color: black;
`;
const PlaceImage = styled.Image`
	width: 50px;
	height: 50px;
	border-radius: 10px;
	margin: 0px 20px 0px 0px;
`;
const PlaceContainer = styled(HStack)`
	align-items: center;
	margin: 5px 0px 5px 0px;
`;
const Spacer = styled.View`
	margin: 10px 0px 10px 0px;
`;
const PlaceDashed = styled.View`
	width: 80%;
	border: 2px dashed ${colors.selectButton};
	border-top-width: 0px;
	border-right-width: 0px;
	border-left-width: 0px;
	margin: -2px;
`;
const MultiAllContainer = styled.View`
	width: 100%;
	margin: 10px 0px 10px 0px;
`;
const FinalDefalutLogoContainer = styled(DefalutLogoContainer)`
	width: 50px;
	height: 50px;
	margin: 0px 20px 0px 0px;
`;
