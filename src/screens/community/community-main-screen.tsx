import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {communitySliceActions, getPostList} from '../../redux/community/community.slice';
import {colors} from '../../utill/colors';
import CommunityMain from '../../utill/component/community/community-main';
import ScrollButton from '../../utill/component/scroll-button';
import {useBackHandler} from '../../utill/hooks/useBackhandler';
import {HStack, HeaderContianer, PretendardSemiBoldText, PretendardVariableText} from '../../utill/layout/layout';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';
import {Google_Ads_Banner_Android} from '@env';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {SVGRightAdd} from '../../utill/svg/svg';

export default function CommunityMainScreen({navigation}: any) {
	const [currentPage, setCurrentPage] = useState(1);
	const dispatch = useAppDispatch(); // redux에 있는 함수를 쓸 수 있게 해줌.
	const {blockUserList} = useAppSelector(state => state.userSlice);
	const [sortOption, setSortOption] = useState(1);
	const sortOptions = [
		{label: '최신순', value: 1},
		{label: '좋아요순 ', value: 2},
		{label: '댓글순', value: 3},
	];
	const [sortOnOff, setSortOnOff] = useState(false);

	const changeSortOption = (e: number) => {
		setSortOption(e);
		setSortOnOff(false);
	};
	const [viewState, setViewState] = useState(false);

	const goSearch = () => {
		navigation.navigate('CommunitySearch');
	};
	//앱 바 우측 더보기
	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<HeaderContianer>
					<SearchTouchableOpacity onPress={goSearch}>
						<PretendardVariableText size={16} lineHeight={24} color={colors.PointYellow}>
							검색
						</PretendardVariableText>
					</SearchTouchableOpacity>
				</HeaderContianer>
			),
		});
	}, []);

	useEffect(() => {
		fetchCommunityData();
	}, [blockUserList, sortOption]);

	// 커뮤니티 정보 가져오기
	const fetchCommunityData = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			dispatch(communitySliceActions.resetPostList());
			const response = await dispatch(
				getPostList({page: currentPage, sort: sortOption, blockList: blockUserList}),
			);
		} catch (error) {
			console.log('DB로부터 게시글들을 읽어오는 중에 오류가 발생했습니다:', error);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};

	useBackHandler({type: 'exit'});

	const adUnitId = __DEV__ ? TestIds.BANNER : Google_Ads_Banner_Android;
	return (
		<CommunityMainContainer>
			<BannerAd
				unitId={adUnitId}
				size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
				requestOptions={{
					requestNonPersonalizedAdsOnly: true,
				}}
			/>
			<SortButton
				margin={false}
				onPress={() => {
					setSortOnOff(!sortOnOff);
				}}>
				<HStack justifyContent='space-around'>
					<PretendardSemiBoldText size={12} lineHeight={14.32} color={colors.PointYellow}>
						{sortOptions[sortOption - 1].label}
					</PretendardSemiBoldText>
					<SVGRightAdd
						width={widthPercentage(10)}
						height={widthPercentage(10)}
						color='black'
						transform={sortOnOff ? 270 : 90}
					/>
				</HStack>
			</SortButton>
			{sortOnOff &&
				sortOptions.map(
					(item, idx) =>
						idx + 1 != sortOption && (
							<SelectSort
								key={idx}
								onPress={() => {
									changeSortOption(idx + 1);
								}}>
								<PretendardSemiBoldText size={12} lineHeight={14.32} color={colors.PointYellow}>
									{sortOptions[idx].label}
								</PretendardSemiBoldText>
							</SelectSort>
						),
				)}
			<CommunityMain searchState={false} setViewState={setViewState} navigation={navigation}></CommunityMain>
			<ScrollButton viewState={viewState} navigation={navigation} />
		</CommunityMainContainer>
	);
}
const SelectSort = styled.Pressable`
	width: ${widthPercentage(100)}px;
	height: ${heightPercentage(28)}px;
	align-self: flex-end;
	border-width: 1px;
	padding: 0px ${widthPercentage(10)}px;
	justify-content: center;
	margin-right: ${widthPercentage(15)}px;
	border-radius: 6px;
`;
const CommunityMainContainer = styled.SafeAreaView`
	height: 100%;
	background-color: ${colors.backgroundGray};
`;
const SearchTouchableOpacity = styled.TouchableOpacity`
	width: 50%;
	align-items: center;
`;
const SortButton = styled.Pressable<{margin: boolean}>`
	align-self: flex-end;
	width: ${widthPercentage(100)}px;
	height: ${heightPercentage(28)}px;
	border-radius: 6px;
	padding: ${heightPercentage(4)}px 0px;
	border-width: 1px;
	margin-right: ${widthPercentage(15)}px;
	margin-top: ${props => (props.margin ? 0 : heightPercentage(10))}px;
`;
