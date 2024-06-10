import {FlatList, NativeScrollEvent, NativeSyntheticEvent, RefreshControl, TouchableOpacity} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {
	communitySliceActions,
	getOnePost,
	getPostList,
	getSearchPostList,
	postListType,
} from '../../../redux/community/community.slice';
import {memo, useEffect, useRef, useState} from 'react';
import {LoadingSliceActions} from '../../../redux/loading/loading.slice';
import styled from 'styled-components/native';
import {colors} from '../../colors';

import Icon from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {modalSliceActions} from '../../../redux/modal/modalSlice';
import {HStack, PretendardBoldText, PretendardSemiBoldText, PretendardVariableText} from '../../layout/layout';
import {heightPercentage, widthPercentage} from '../../layout/responsive-size';
import {SVGCamera, SVGEmptyHeart, SVGMessageSquare, SvgPicture} from '../../svg/svg';
function CommunityMain({
	navigation,
	setViewState,
	searchState,
	searchValue,
}: {
	navigation: any;
	setViewState?: any;
	searchState: boolean;
	searchValue?: string;
}) {
	const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
	const [sortOption, setSortOption] = useState(1);
	//const [currentPage, setCurrentPage] = useState(1);
	const [sortOptions, setSortOptions] = useState([
		{label: '최신 순', value: 1},
		{label: '좋아요 순 ', value: 2},
		{label: '댓글 순', value: 3},
	]);
	const {postList, searchList} = useAppSelector(state => state.communitySlice);
	const {blockUserList} = useAppSelector(state => state.userSlice);
	const currentPage = useRef(2);
	const last = useRef(false);
	const dispatch = useAppDispatch();
	// 커뮤니티 정보 가져오기
	const fetchCommunityData = async (value?: string) => {
		try {
			if (!last.current) {
				if ((searchState && searchList.length >= 20) || postList.length >= 20) {
					const response = searchState
						? await dispatch(
								getSearchPostList({
									page: currentPage.current,
									sort: sortOption,
									blockList: blockUserList,
								}),
						  )
						: await dispatch(
								getPostList({
									page: currentPage.current,
									sort: sortOption,
									blockList: blockUserList,
								}),
						  );
					if (response.payload.length < 20) {
						last.current = true;
					}
					currentPage.current += 1;
				}
			}
		} catch (error) {
			dispatch(modalSliceActions.setOpenModal({modalSubTitle: '잠시후 다시 시도해주세요'}));
		}
	};
	const goCommunityReadingScreen = async (item: string) => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			await dispatch(getOnePost({postId: item}));
			navigation.navigate('CommunityReadingScreen', {
				postId: item,
			});
		} catch (err) {
			console.log('게시글 읽는 화면으로 넘어가는 도중 에러가 발생했습니다.');
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const handleRefresh = async () => {
		try {
			setIsRefreshing(true); // 새로고침 시작
			if (searchState) {
				dispatch(communitySliceActions.resetSearchList());

				await dispatch(getSearchPostList({page: 1, sort: 1, blockList: blockUserList, search: searchValue}));
			} else {
				dispatch(communitySliceActions.resetPostList());
				await dispatch(getPostList({page: 1, sort: 1, blockList: blockUserList}));
			}
		} catch {
			dispatch(modalSliceActions.setOpenModal({modalSubTitle: '잠시후 다시 시도해주세요'}));
		} finally {
			setIsRefreshing(false);
		}
	};
	// 가져온 게시글 목록 UI
	const renderPostItem = (data: {item: postListType}) => {
		return (
			<TouchableOpacity
				style={{flex: 1}}
				onPress={() => {
					goCommunityReadingScreen(data.item.postId);
				}}>
				<PostItemContainer>
					<PostWriterInfoContainer>
						<PostWriterProfileImage source={{uri: data.item.postWriterProfileImage}} resizeMode='contain' />
						<PretendardSemiBoldText size={20} lineHeight={27} color={colors.Black}>
							{data.item.postWriter}
						</PretendardSemiBoldText>
					</PostWriterInfoContainer>
					<PretendardBoldText size={14} lineHeight={16.71} color={colors.Black}>
						{data.item.postTitle}
					</PretendardBoldText>
					<PretendardVariableText
						size={14}
						lineHeight={21}
						color={colors.Gray4}
						numberOfLines={2}
						ellipsizeMode='tail'>
						{data.item.postContent}
					</PretendardVariableText>
					<HStack gap={7} justifyContent='flex-end'>
						<PretendardVariableText size={12} lineHeight={18} color={colors.Gray4}>
							{data.item.postedAt.slice(0, 10)}
						</PretendardVariableText>
						<HStack gap={2}>
							<SVGEmptyHeart width={widthPercentage(12)} height={widthPercentage(12)} />
							<PretendardVariableText size={12} lineHeight={18} color={colors.Gray4}>
								{data.item.likerLength}
							</PretendardVariableText>
						</HStack>
						<HStack gap={2}>
							<SVGMessageSquare width={widthPercentage(14)} height={widthPercentage(14)} />
							<PretendardVariableText size={12} lineHeight={18} color={colors.Gray4}>
								{data.item.commentLength}
							</PretendardVariableText>
							{data.item.ImageLength != 0 && (
								<>
									<SVGCamera
										width={widthPercentage(14)}
										height={widthPercentage(14)}
										color={colors.Gray3}
									/>
									<PretendardVariableText size={12} lineHeight={18} color={colors.Gray4}>
										{data.item.ImageLength}
									</PretendardVariableText>
								</>
							)}
						</HStack>
					</HStack>
				</PostItemContainer>
			</TouchableOpacity>
		);
	};

	const handleView = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		setViewState && (e.nativeEvent.contentOffset.y > 20 ? setViewState(true) : setViewState(false));
	};
	return (
		<>
			{postList.length != 0 && (
				<FlatList
					data={searchState ? searchList : postList}
					renderItem={renderPostItem}
					initialNumToRender={20}
					ItemSeparatorComponent={() => <FlatListItemSeperator></FlatListItemSeperator>}
					onEndReached={fetchCommunityData}
					onEndReachedThreshold={0.8}
					onScroll={handleView}
					refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
				/>
			)}
		</>
	);
}
export default memo(CommunityMain);
const FlatListItemSeperator = styled.View`
	height: 1px;
	margin-horizontal: 24px;
	background-color: #e0e0e0;
`;
const HeartIcon = styled(Icon)`
	color: red;
	margin-right: 4px;
`;
const LikeNumText = styled.Text`
	font-size: 12px;
	color: red;
	margin-right: 8px;
`;
const CommentIcon = styled(Icon)`
	color: green;
	margin-right: 4px;
`;
const ImageIcon = styled(Icon)`
	color: grey;
	margin-right: 4px;
`;
const CommentNumText = styled.Text`
	font-size: 12px;
	color: green;
`;
export const MenuIcon = styled(FeatherIcon)`
	font-size: 24px;
	color: ${colors.selectButton};
`;
const PostItemContainer = styled.View`
	gap: ${widthPercentage(5)}px;
	padding: ${heightPercentage(10)}px ${widthPercentage(24)}px;
`;
const PostWriterInfoContainer = styled.View`
	flex-direction: row;
	align-items: center;
`;
const PostWriterProfileImage = styled.Image`
	width: ${widthPercentage(32)}px;
	height: ${widthPercentage(32)}px;
	border-radius: 8px;
	margin-right: 8px;
`;
// border-width: 1px;
// border-color: ${colors.border};
const PostWriterText = styled.Text`
	font-size: 12px;
	font-weight: 400;
	color: black;
`;
const PostTitleText = styled.Text`
	font-size: 16px;
	font-weight: bold;
	margin-vertical: 8px;
	color: black;
`;
const PostDetailInfoContainer = styled.View`
	flex-direction: row;
	align-items: center;
`;
const PostDetailInfoText = styled.Text`
	font-size: 12px;
	color: gray;
	margin-right: 8px;
`;
