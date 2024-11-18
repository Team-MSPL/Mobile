import {BackHandler, Modal, TouchableOpacity} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {EssentialPlaceType, getTravelAi, travelSliceActions} from '../../redux/travel-info/travel.slice';
import CustomButton from '../../utill/component/custom-button';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {useCallback, useEffect, useState} from 'react';
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
import {SVGFall, SVGFlag, SVGPlus, SVGSpring, SVGSummer, SVGWinter, SvgCancel} from '../../utill/svg/svg';
import LoadingTimetable from '../../utill/component/timetable/loading-timetable';

import {ButtonContainer, DayViewContainer, DeleteContainer, ElementContainer, SVGContainer} from './select-multi';
import {useTendencyHandler} from '../../utill/hooks/useTendencyHandler';
import {TagShopText} from '../home/main';
import {fontPercentage, heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {MarginContainer} from '../timetable/preset-detail';
import {logEvent} from '../../../firebaseAnalytice';
import StepText from '../../utill/component/enroll-info/step-text';
import TendencyButton from '../../utill/component/tendency-button';
import {SelectButtonsContainer} from './region-recommend/select-who';
import {userSliceActions} from '../../redux/user/user.slice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {cityViewList} from '../../utill/component/enroll-info/city-list';
export default function FinalCheck({navigation}: any) {
	const {handleButtonClick, tendencyList, countryList} = useTendencyHandler();
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
		country,
	} = useAppSelector(state => state.travelSlice);
	const {socialloginProvider} = useAppSelector(state => state.userSlice);
	const [loading, setLoading] = useState(false);
	const dispatch = useAppDispatch();

	const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
	const [tendencyModify, setTendencyModify] = useState({status: false, index: 0});
	const handleTendencyModify = (index: number) => {
		setTendencyModify({status: true, index: index});
	};
	const handleClose = () => {
		setTendencyModify({status: false, index: 0});
	};
	const [binaryModify, setBinaryModify] = useState({status: false, index: 0});
	const handleBinaryModify = (index: number) => {
		setBinaryModify({status: true, index: index});
	};
	const handleBinaryClose = () => {
		setBinaryModify({status: false, index: 0});
	};
	const BinaryList = [
		[
			{
				name: '자동차 렌트카',
				function: () => dispatch(travelSliceActions.enrollTransit(0)),
				image: (
					<MoveImage resizeMode='contain' source={require('../../../public/images/test1.png')}></MoveImage>
				),
			},
			{
				name: '대중교통',
				function: () => dispatch(travelSliceActions.enrollTransit(1)),
				image: (
					<MoveImage resizeMode='contain' source={require('../../../public/images/test2.png')}></MoveImage>
				),
			},
		],
		[
			{
				name: '알찬 일정',
				function: () => dispatch(travelSliceActions.enrollBandwidth(false)),
				photo: require('../../../public/tendency/busy.png'),
			},
			{
				name: '여유있는 일정',
				function: () => dispatch(travelSliceActions.enrollBandwidth(true)),
				photo: require('../../../public/tendency/non-busy.png'),
			},
		],
	];
	const checkToken = () => {
		handleNext();
	};
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
	const exceptionKeys = ['isFirstLaunch', 'noPermission'];

	const handleLogin = async () => {
		handleAnonymousLogin();
		dispatch(userSliceActions.setAnonymousKeep(true));
		await AsyncStorage.getAllKeys().then(allKeys => {
			const removeList = allKeys.filter(k => !exceptionKeys.some(ek => ek === k));
			AsyncStorage.multiRemove(removeList);
		});
		dispatch(userSliceActions.loginFalse());
		navigation.navigate('LoginScreen');
	};
	const handleNext = () => {
		socialloginProvider == 'anonymous'
			? dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '지금 로그인하시고 \n맞춤 여행 추천을 받아보세요!',
						modalTopText: '좋아요!',
						modalBottomText: '다음에 할게요',
						modalFunction: handleLogin,
					}),
			  )
			: goNext();
	};
	const goNext = useCallback(async () => {
		try {
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
			let a = region.map(item => cityViewList[country][cityIndex].title + ' ' + item);
			if (
				(country == 0 && cityViewList[country][cityIndex].id >= 9 && region[0] == '전체') ||
				(country == 0 && cityViewList[country][cityIndex].id == 1 && region[0] == '전체') ||
				(country != 0 && region[0] == '전체')
			) {
				if (country != 0 && cityIndex == 1) {
					a = cityViewList[country]
						.slice(2, cityViewList[country].length)
						.map((value, index) =>
							value.sub
								.map((item, idx) => {
									if (idx != 0) {
										return cityViewList[country][index + 2].title + ' ' + item.subTitle;
									} else {
										return null;
									}
								})
								.filter(item => item !== null),
						)
						.join(',')
						.split(',');
				} else {
					a = cityViewList[country][cityIndex].sub.map(
						(value, idx) => cityViewList[country][cityIndex].title + ' ' + value.subTitle,
					);
					a.shift();
				}
			}
			//["해외/Vietnam/나트랑", "해외/Vietnam/다낭"]

			let copy = [...tendency];
			copy.push(season);
			if (country != 0) {
				a = a.map((item, idx) => {
					return `해외/${countryList[country].en}/${item.split(' ').slice(1).join(' ')}`;
				});
			}
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
					version: 2,
					password: '(주)나그네들_g5hb87r8765rt68i7ur78',
				}),
			).unwrap();
			result.data.resultData.map(item => {
				console.log(item);
			});
			dispatch(travelSliceActions.selectRegion(a));
			if (result) {
				navigation.popToTop();
				navigation.navigate('Preset');
				!result.data.enoughPlace &&
					dispatch(
						modalSliceActions.setOpenModal({
							modalTitle: `해당 지역의 관광지 중 선택하신 성향의 \n 관광지가 부족하여,일정을 다 채울 수가 없었어요 ㅠㅠ`,
							modalTextSize: 17,
							modalSingleUse: true,
						}),
					);
			} else {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '네트워크 연결이 불안정합니다',
						modalSubTitle: '확인후 다시 시도해주세요',
					}),
				);
			}
		} catch (error) {
			console.log(error);
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '네트워크 연결이 불안정합니다',
					modalSubTitle: '확인후 다시 시도해주세요',
				}),
			);
		} finally {
			setLoading(false);
		}
	}, [essentialPlaces]);
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
	const handleAnonymousLogin = async () => {
		await logEvent('anonymous_course_login', {});
	};
	const handleGoogleAnalytics = async () => {
		socialloginProvider == 'anonymous'
			? await logEvent('anonymous_course_step6', {})
			: await logEvent('course_step6', {});
	};
	useEffect(() => {
		handleGoogleAnalytics();
	}, []);
	const seasonList = [
		{title: '봄', svg: <SVGSpring width={widthPercentage(24)} height={widthPercentage(27)} />},
		{title: '여름', svg: <SVGSummer width={widthPercentage(24)} height={widthPercentage(27)} />},
		{title: '가을', svg: <SVGFall width={widthPercentage(24)} height={widthPercentage(27)} />},
		{title: '겨울', svg: <SVGWinter width={widthPercentage(24)} height={widthPercentage(27)} />},
	];
	const handleSelect = (item: number) => {
		handleButtonClick({index: tendencyModify.index, region: false, item: item});
	};
	const goSearchPlace = (data: {idx: number; index: number}) => {
		navigation.navigate('SearchPlace', {id: data.index, idx: data.idx});
	};
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
									{cityViewList[country][cityIndex].title + ' ' + region}
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
							<TouchTagContainer
								onPress={() => {
									handleBinaryModify(0);
								}}
								backgroundColor={colors.backgroundWhite}>
								<TagShopText color={colors.Gray2} size={fontPercentage(12)}>
									#
								</TagShopText>
								<PretendardSemiBoldText size={12} lineHeight={14} color={colors.Gray5}>
									{!transit ? '자동차·렌트카' : '대중교통'}
								</PretendardSemiBoldText>
							</TouchTagContainer>
							<TouchTagContainer
								onPress={() => {
									handleBinaryModify(1);
								}}
								backgroundColor={colors.backgroundWhite}>
								<TagShopText color={colors.Gray2} size={fontPercentage(12)}>
									#
								</TagShopText>
								<PretendardSemiBoldText size={12} lineHeight={14} color={colors.Gray5}>
									{bandwidth ? '여유있는 일정' : '알찬 일정'}
								</PretendardSemiBoldText>
							</TouchTagContainer>
						</VStack>
					</HStack>
					<Parent>
						{tendency[0].find(item => item == 1) && (
							<TouchWhiteContainer
								justifyContent='flex-start'
								width={
									tendency[1].find(item => item == 1) ? widthPercentage(182) : widthPercentage(327)
								}
								onPress={() => {
									handleTendencyModify(0);
								}}>
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
							</TouchWhiteContainer>
						)}
						{tendency[1].find(item => item == 1) && (
							<TouchWhiteContainer
								width={
									tendency[0].find(item => item == 1) ? widthPercentage(139) : widthPercentage(327)
								}
								onPress={() => {
									handleTendencyModify(1);
								}}>
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
							</TouchWhiteContainer>
						)}
					</Parent>
					{tendency[2].find(item => item == 1) && (
						<TouchWhiteContainer
							width={widthPercentage(327)}
							onPress={() => {
								handleTendencyModify(2);
							}}>
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
						</TouchWhiteContainer>
					)}
					{tendency[3].find(item => item == 1) && (
						<TouchWhiteContainer
							width={widthPercentage(327)}
							onPress={() => {
								handleTendencyModify(3);
							}}>
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
						</TouchWhiteContainer>
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
										<SVGContainer
											disabled={filteredPlaces.length >= 3}
											onPress={() => {
												goSearchPlace({idx: idx, index: 0});
											}}
											color={filteredPlaces.length >= 3 ? colors.Gray1 : colors.PointYellow}>
											<SVGPlus
												width={widthPercentage(16)}
												height={widthPercentage(16)}
												color={filteredPlaces.length >= 3 ? colors.Gray2 : colors.Primary}
											/>
										</SVGContainer>
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
											{accommodations[idx + 1].name != '' ? (
												<DeleteContainer
													onPress={() => {
														goSearchPlace({idx: idx, index: 1});
													}}>
													<PretendardSemiBoldText
														size={12}
														lineHeight={18}
														color={colors.Gray5}>
														변경
													</PretendardSemiBoldText>
												</DeleteContainer>
											) : (
												<SVGContainer
													onPress={() => {
														goSearchPlace({idx: idx, index: 1});
													}}
													color={
														accommodations[idx + 1].name ? colors.Gray1 : colors.PointYellow
													}>
													<SVGPlus
														width={widthPercentage(16)}
														height={widthPercentage(16)}
														color={
															accommodations[idx + 1].name ? colors.Gray2 : colors.Primary
														}
													/>
												</SVGContainer>
											)}
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
			<Modal animationType='fade' visible={tendencyModify.status} transparent={true}>
				<InModalContainer onPress={handleClose}>
					<InModal>
						<SvgCancel
							style={{alignSelf: 'flex-end'}}
							color={colors.Gray5}
							width={widthPercentage(18)}
							height={widthPercentage(18)}
						/>
						<StepText
							mainText={tendencyList[tendencyModify.index].title}
							subText={
								tendencyList[tendencyModify.index].multi ? '* 중복 선택 가능' : '*단일선택'
							}></StepText>
						<ButtonsContainer>
							{tendencyList[tendencyModify.index]?.list.map((item, idx) => (
								<TendencyButton
									marginBottom={0}
									bgColor={tendency[tendencyModify.index][idx] == 1}
									label={item}
									key={idx}
									divide={true}
									imageUrl={tendencyList[tendencyModify.index]?.photo[idx]}
									onPress={() => {
										handleSelect(idx);
									}}></TendencyButton>
							))}
						</ButtonsContainer>
					</InModal>
				</InModalContainer>
			</Modal>
			<Modal animationType='fade' visible={binaryModify.status} transparent={true}>
				<InModalContainer onPress={handleBinaryClose}>
					<InModal>
						<SvgCancel
							style={{alignSelf: 'flex-end'}}
							color={colors.Gray5}
							width={widthPercentage(18)}
							height={widthPercentage(18)}
						/>
						<StepText
							mainText={binaryModify.index ? '어떻게 이동하시나요?' : '어떤 여행을 원하시나요?'}
							subText={'* 단일선택'}></StepText>
						{binaryModify.index == 0 ? (
							<SelectMoveContainer>
								{BinaryList[binaryModify.index]?.map((item, idx) => (
									<SelectButton
										color={idx == transit ? 'rgba(195,245,80,0.3)' : colors.Gray1}
										key={idx}
										onPress={item.function}>
										{item?.image}
										<PretendardSemiBoldText size={15} lineHeight={18} color={colors.Gray4}>
											{item.name}
										</PretendardSemiBoldText>
									</SelectButton>
								))}
							</SelectMoveContainer>
						) : (
							<SelectButtonsContainer>
								{BinaryList[binaryModify.index].map((item, idx) => (
									<TendencyButton
										bgColor={bandwidth == Boolean(idx)}
										label={item.name}
										imageUrl={item?.photo}
										key={idx}
										onPress={item.function}></TendencyButton>
								))}
							</SelectButtonsContainer>
						)}
					</InModal>
				</InModalContainer>
			</Modal>
		</>
	);
}
const ButtonsContainer = styled.View`
	flex: 1;
	align-content: flex-end;
	justify-content: center;
	flex-direction: row;
	flex-wrap: wrap;
	gap: ${widthPercentage(10)}px;
`;
const InModal = styled.View`
	width: 100%;
	height: ${heightPercentage(607)}px;
	background-color: ${colors.backgroundWhite};
	border-top-left-radius: 30px;
	border-top-right-radius: 30px;
	padding: ${heightPercentage(17)}px ${widthPercentage(24)}px;
`;
const InModalContainer = styled.Pressable`
	flex: 1;
	justify-content: flex-end;
	align-items: center;
	background-color: rgba(0, 0, 0, 0.6);
`;
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
const TouchWhiteContainer = styled(WhiteContainer).attrs({as: TouchableOpacity})``;
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
const MoveImage = styled.Image`
	width: ${widthPercentage(60)}px;
	height: ${heightPercentage(110)}px;
`;

const TouchTagContainer = styled(TagContainer).attrs({as: TouchableOpacity})``;
const SelectMoveContainer = styled.View`
	flex: 1;
	flex-direction: row;
	align-items: center;
	justify-content: space-around;
`;
const SelectButton = styled.TouchableOpacity<{color: string}>`
	background-color: ${props => props.color};
	border-radius: 16px;
	width: ${widthPercentage(137)}px;
	height: ${widthPercentage(137)}px;
	align-items: center;
	justify-content: center;
	padding-bottom: ${heightPercentage(5)}px;
	gap: ${heightPercentage(10)}px;
`;
