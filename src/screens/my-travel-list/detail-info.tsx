import {JSXElementConstructor, ReactElement, useCallback, useEffect, useRef, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {
	deleteTravelCourse,
	getOneTravelCourse,
	getRegionInfo,
	reCourseName,
	reviewAndPoint,
	travelSliceActions,
	updateDiary,
} from '../../redux/travel-info/travel.slice';
import {Alert, Modal, Platform, TouchableOpacity} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';

import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';

import {modalSliceActions} from '../../redux/modal/modalSlice';
import {
	HStack,
	HeaderContianer,
	PretendardBoldText,
	PretendardSemiBoldText,
	PretendardVariableText,
	VStack,
} from '../../utill/layout/layout';
import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import {SVGPencil, SvgCancel, SvgShare, SvgStart} from '../../utill/svg/svg';
import InputDiary from './input-diary';

import useFirebaseStorage from '../../utill/hooks/useFirebaseStorage';
import useKakaoShare from '../../utill/hooks/useKakaoShare';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';

import {RegionImage} from '../enroll-info/final-check';
import {MarkerContainer} from '../timetable/preset-detail';
import {Circle} from '../timetable/preset';
import PrimaryButton from '../../utill/component/primary-button';
import ViewPager from '../../utill/view-pager';
import {useViewPager} from '../../utill/hooks/useViewPager';
import {ButtonContainer} from '../enroll-info/select-multi';
import CustomButton from '../../utill/component/custom-button';
import {savePost, updatePost} from '../../redux/community/community.slice';
import {AbsoluteTopBars as AbsoluteTopBar} from '../../utill/component/timetable/absolute-top-bar-component';
import {logEvent} from '../../../firebaseAnalytice';
import CustomMapView from '../../utill/component/timetable/mapView';
export default function DetailInfo({navigation}: any) {
	const {travelId, nDay, day, travelName, region, regionInfo, timetable, picture, diary, reviewCheck, tendency} =
		useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const goMyTravelDetail = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			await dispatch(getOneTravelCourse({travelId: travelId}));
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '여행에 대한 기억을 되찾는 중 문제가 발생했습니다.',
					modalSubTitle: '잠시후 다시 시도해주세요',
				}),
			);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};

	const removeCheck = () => {
		dispatch(
			modalSliceActions.setOpenModal({
				modalTitle: '이 여행을 삭제할까요?',
				modalSubTitle: '여행을 삭제하면 되돌릴 수 없습니다.',
				modalFunction: goRemove,
				modalTopText: '삭제할래요',
				modalLeft: true,
			}),
		);
	};
	const handleBuntton = () => {
		modify ? setModify(false) : goSaveDiary();
	};
	const {uploadImage} = useFirebaseStorage();
	let diaryImageRef = useRef<string[]>([]);
	const goSaveDiary = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			const textData = {updateTravelName: text, travelId: travelId};
			await dispatch(reCourseName(textData));
			diaryImageRef.current = Array(picture.length).fill('');
			const ImageFunction = picture.map(async (item, idx) => {
				let data = (await uploadImage({item: item, idx: idx, id: travelId, category: 'diary'})) ?? '';
				diaryImageRef.current[idx] = data;
			});
			await Promise.all(ImageFunction);
			const data = {travelId: travelId, diary: diary, picture: diaryImageRef.current};
			await dispatch(updateDiary(data));
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '작성하신 내용을 커뮤니티에도 올리시겠습니까?',
					modalSubTitle: '*제목은 여행 제목으로 설정됩니다',
					modalFunction: handlePostSubmit,
					modalBottomFunctionUse: true,
					modalBottomFunction: () => {
						navigation.goBack();
					},
					modalTopText: '네, 올리겠습니다',
					modalBottomText: '아니요, 리뷰만 남기겠습니다',
				}),
			);
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '다이어리 저장이 실패했습니다',
					modalSubTitle: '잠시후 다시 시도해주세요',
				}),
			);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const handlePostSubmit = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			const data = {
				postTitle: text,
				postContent: diary,
				postImage: [],
				postedAt: moment(Date()).format('yyyy/MM/DD HH:mm:ss'),
			};
			let postId = await dispatch(savePost(data)).unwrap();
			diaryImageRef.current = Array(picture.length).fill('');
			const ImageFunction = picture.map(async (item, idx) => {
				let data = (await uploadImage({item: item, idx: idx, id: postId.postId, category: 'post'})) ?? '';
				diaryImageRef.current[idx] = data;
			});
			await Promise.all(ImageFunction);
			const uploadData = {
				postTitle: text,
				postContent: diary,
				postImage: diaryImageRef.current,
				postId: postId.postId,
			};
			await dispatch(updatePost(uploadData));

			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '등록',
					modalSubTitle: '게시글이 등록되었습니다.',
					modalFunction: () => {
						navigation.goBack();
					},
					modalSingleUse: true,
				}),
			);
		} catch (error) {
			modalSliceActions.setOpenModal({modalSubTitle: '잠시후 다시 시도해주세요'});
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const goRemove = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			//await firebaseImageRemove({pictureList: picture, id: travelId, category: 'diary'}); TODO 공유자때문에 공유자가 아무도없을때 백에서 삭제하는로직으로 바꿔야함
			if (!reviewCheck) {
				const data = {
					travelId: travelId,
					review: '여행가기 전 삭제',
					point: 5,
					tendencyPoint: tendency,
				};
				dispatch(reviewAndPoint(data));
			}
			await dispatch(deleteTravelCourse({travelId: travelId}));
			navigation.goBack();
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '여행 삭제가 실패했습니다',
					modalSubTitle: '잠시후 다시 시도해주세요',
				}),
			);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	//여행 리뷰 별점 저장하기
	const goTimetable = async () => {
		dispatch(travelSliceActions.setMakeMode({shareViewWithStartFlag: false, makeMode: 'modify'}));
		// console.log(region[0]);
		// dispatch(
		// 	getRegionInfo({
		// 		region: region[0].includes('해외')
		// 			? findCityFromPath(region[0])
		// 			: region[0].replace(/도심권| 동남권| 동북권|서남권|서북권|서귀포시|제주시'/g, '전체'),
		// 	}),
		// );
		navigation.navigate('Timetable');
		if (editing) {
			setEditing(false);
			setText(travelName);
		}
	};
	const {kakaoShare} = useKakaoShare();
	const goKakaoShare = async () => {
		try {
			if (editing) {
				setEditing(false);
				setText(travelName);
			}
			await kakaoShare({
				travelName: travelName,
				travelId: travelId,
				startDay: day[0],
				endDay: day[nDay],
				photo: regionInfo?.photo,
			});
			await logEvent('share', {course: travelName});
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '카카오 공유 중 문제가 발생했습니다.',
				}),
			);
		}
	};
	const [modify, setModify] = useState(false);
	const [starStatus, setStarStatus] = useState(-1);
	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<HeaderContianer>
					{!modify ? (
						<>
							<TouchableOpacity onPress={removeCheck} style={{marginRight: 15}}>
								<PretendardVariableText size={16} lineHeight={24} color={colors.PointGreen1}>
									삭제
								</PretendardVariableText>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => {
									setModify(true);
								}}>
								<PretendardVariableText size={16} lineHeight={24} color={colors.PointYellow}>
									편집
								</PretendardVariableText>
							</TouchableOpacity>
						</>
					) : (
						<TouchableOpacity
							onPress={() => {
								setModify(false);
							}}>
							<PretendardVariableText size={16} lineHeight={24} color={colors.PointYellow}>
								완료
							</PretendardVariableText>
						</TouchableOpacity>
					)}
				</HeaderContianer>
			),
		});
	}, [modify]);
	const [modalView, setModalView] = useState(false);
	const [reviewText, setReivewText] = useState('');
	const handleReviewText = useCallback((e: string) => {
		setReivewText(e);
	}, []);
	useEffect(() => {
		setModalView(!reviewCheck);
	}, [reviewCheck]);
	useEffect(() => {
		getMainViewPager();
	}, []);
	useFocusEffect(
		useCallback(() => {
			goMyTravelDetail();
		}, []),
	);
	const [editing, setEditing] = useState(false);
	const [text, setText] = useState(travelName);
	const {getMainViewPager, deleteMainViewPager, viewPagerState} = useViewPager({title: 'afterTravelViewPager'});
	const handleReview = useCallback(() => {
		try {
			const data = {
				travelId: travelId,
				review: reviewText,
				point: starStatus + 1,
				tendencyPoint: tendency,
			};
			dispatch(LoadingSliceActions.onLoading());
			setModalView(false);
			dispatch(reviewAndPoint(data));
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '리뷰 남겨주셔서\n정말 감사드립니다! :)',
					modalFunction: () => {},
					modalSingleUse: true,
					modalTopText: '확인',
				}),
			);
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '리뷰 저장이 실패했습니다',
					modalSubTitle: '잠시후 다시 시도해주세요',
				}),
			);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	}, [reviewCheck, starStatus, reviewText]);
	return (
		<>
			<Scroll>
				<AbsoluteTopBar opacityState={false}>
					<HStack gap={10} marginVertical={heightPercentage(10)} width={widthPercentage(375)}>
						<RegionImage
							resizeMode='contain'
							source={{
								uri: regionInfo?.photo == '' ? 'https://danim.me/square_logo.png' : regionInfo?.photo,
							}}
						/>
						<HStack justifyContent='space-between' width={widthPercentage(290)}>
							<VStack>
								<HStack>
									<PretendardVariableText size={12} lineHeight={18} color={colors.PointYellow}>
										{region[0].split('/').at(-1)}
										{region.length >= 2 ? ` +${region.length - 1}` : ''}
									</PretendardVariableText>
									<PretendardVariableText size={12} lineHeight={18} color={colors.Gray2}>
										{' '}
										|{' '}
										{moment(day[0]).format('YY.MM.DD') +
											' - ' +
											moment(day[nDay]).format('YY.MM.DD')}
									</PretendardVariableText>
								</HStack>
								<HStack gap={4}>
									{!editing ? (
										<PretendardSemiBoldText size={16} lineHeight={21.6} color={colors.Gray5}>
											{travelName}
										</PretendardSemiBoldText>
									) : (
										<CustomTextInput
											text={text}
											placeholderTextColor={'grey'}
											style={{color: 'black', fontSize: heightPercentage(18)}}
											autoFocus={true}
											value={text}
											onChangeText={(value: string) => setText(value)}
											maxLength={20}></CustomTextInput>
									)}
									{modify && !editing && (
										<TouchableOpacity
											onPress={() => {
												setEditing(true);
											}}>
											<SVGPencil
												width={widthPercentage(16)}
												height={widthPercentage(16)}
												color={colors.PointYellow}
											/>
										</TouchableOpacity>
									)}
								</HStack>
							</VStack>
							{!modify && (
								<TouchableOpacity onPress={goKakaoShare}>
									<SvgShare width={heightPercentage(45)} height={heightPercentage(45)} />
								</TouchableOpacity>
							)}
						</HStack>
					</HStack>
				</AbsoluteTopBar>
				<MapContainer>
					<CustomMapView select={0}></CustomMapView>
					{!modify && (
						<AbsoluteButton>
							<PrimaryButton
								label='여행 코스 확인하기'
								onPress={goTimetable}
								backgroundColor={colors.PointYellow}
								textColor={colors.backgroundWhite}
								width={widthPercentage(150)}
								height={heightPercentage(50)}></PrimaryButton>
						</AbsoluteButton>
					)}
				</MapContainer>
				<InputDiary
					navigation={navigation}
					modify={modify}
					setModify={setModify}
					text={text}
					setEditing={setEditing}
				/>
				<Modal
					animationType={'fade'}
					transparent={true}
					visible={viewPagerState}
					onRequestClose={deleteMainViewPager}>
					<ViewPager sliceNumber={4} handleFunction={deleteMainViewPager} />
				</Modal>
				<ButtonMarginBottom></ButtonMarginBottom>
			</Scroll>
			<ButtonContainer>
				<CustomButton
					onPress={handleBuntton}
					label={modify ? '수정 완료' : '리뷰 저장'}
					marginBottom={heightPercentage(15)}
					marginTop={heightPercentage(30)}></CustomButton>
			</ButtonContainer>
			<Modal
				animationType={'fade'}
				transparent={true}
				visible={modalView}
				onRequestClose={() => {
					setModalView(false);
				}}>
				<ModalContainer>
					<ReviewContainer>
						<HStack deco={'width:100%; align-items:center; justify-content:center;'}>
							<PretendardBoldText size={19} lineHeight={25} color={colors.Black}>
								이 여행은 어떠셨나요?
							</PretendardBoldText>
							<CancelContainer onPress={() => setModalView(false)}>
								<SvgCancel color='black' width={widthPercentage(20)} height={widthPercentage(20)} />
							</CancelContainer>
						</HStack>

						<StarConstainer>
							{[...Array(5)].map((star, startIndex) => {
								return (
									<TouchableOpacity
										onPress={() => {
											setStarStatus(startIndex);
										}}>
										<SvgStart
											key={startIndex}
											width={widthPercentage(45)}
											height={widthPercentage(45)}
											color={starStatus >= startIndex ? colors.Primary : colors.Gray1}
										/>
									</TouchableOpacity>
								);
							})}
						</StarConstainer>
						<PretendardSemiBoldText
							style={{opacity: starStatus == -1 || reviewText.length == 0 ? 1 : 0}}
							size={13}
							lineHeight={17}
							color={colors.PointGreen1}>
							{starStatus == -1 && reviewText.length == 0
								? '리뷰,별점을 입력해주세요!'
								: starStatus == -1
								? '별점을 입력해주세요'
								: '리뷰를 입력해주세요'}
						</PretendardSemiBoldText>
						<ReviewText
							onChangeText={handleReviewText}
							placeholderTextColor={colors.Gray2}
							placeholder=' 방문했던 곳에 대해 이야기해주세요.'></ReviewText>
						<PrimaryButton
							label='완료'
							disabled={starStatus == -1 || reviewText.length == 0}
							width={widthPercentage(300)}
							height={heightPercentage(50)}
							backgroundColor={colors.Primary}
							onPress={handleReview}
							textColor={colors.Black}></PrimaryButton>
					</ReviewContainer>
				</ModalContainer>
			</Modal>
		</>
	);
}
const ButtonMarginBottom = styled.View`
	height: ${heightPercentage(115)}px;
	background-color: ${colors.backgroundWhite};
`;
const AbsoluteButton = styled.View`
	position: absolute;
	z-index: 5;
	bottom: ${heightPercentage(50)}px;
`;
const MapContainer = styled.View`
	width: 100%;
	height: ${heightPercentage(350)}px;
	align-items: center;
`;
const Scroll = styled.ScrollView``;

const CustomTextInput = styled.TextInput<{text: string}>`
	width: 80%;
	padding: 8px;
	font-size: 16px;
	font-weight: 400;
	border-radius: 8px;
`;
const ModalContainer = styled.View`
	flex: 1;
	background-color: rgba(0, 0, 0, 0.3);
	justify-content: flex-end;
`;
const ReviewContainer = styled.View`
	width: 100%;
	height: ${heightPercentage(300)}px;
	background-color: #f8f9fc;
	border-top-right-radius: 16px;
	border-top-left-radius: 16px;
	align-items: center;
	justify-content: center;
	gap: 10px;
`;
const ReviewText = styled.TextInput`
	width: ${widthPercentage(300)}px;
	height: ${heightPercentage(50)}px;
	border-radius: 12px;
	background-color: ${colors.backgroundWhite};
	color: ${colors.Black};
`;
const StarConstainer = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	width: ${widthPercentage(270)}px;
`;
const CancelContainer = styled.TouchableOpacity`
	width: ${widthPercentage(20)}px;
	height: ${widthPercentage(20)}px;
	align-items: center;
	justify-content: center;
	position: absolute;
	right: ${widthPercentage(30)}px;
`;
