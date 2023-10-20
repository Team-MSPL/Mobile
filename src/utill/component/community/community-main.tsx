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
function CommunityMain({
	navigation,
	setViewState,
	searchState,
}: {
	navigation: any;
	setViewState?: any;
	searchState: boolean;
}) {
	const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
	const [sortOption, setSortOption] = useState(1);
	//const [currentPage, setCurrentPage] = useState(1);
	const [sortOptions, setSortOptions] = useState([
		{label: '최신 순', value: 1},
		{label: '좋아요 순 ', value: 2},
		{label: '댓글 순', value: 3},
	]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const {postList, searchList} = useAppSelector(state => state.communitySlice);
	const {blockUserList} = useAppSelector(state => state.userSlice);
	const currentPage = useRef(2);
	const last = useRef(false);
	const dispatch = useAppDispatch();
	// 커뮤니티 정보 가져오기
	const fetchCommunityData = async (value?: string) => {
		try {
			if (!last.current) {
				if (searchState && searchList.length >= 20) {
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
					setIsLoading(false);
				}
			}
		} catch (error) {
			setIsLoading(false);
			console.log('DB로부터 게시글들을 읽어오는 중에 오류가 발생했습니다:', error);
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
	const handleRefresh = () => {
		console.log('qwe');
		setIsRefreshing(true); // 새로고침 시작
		!searchState ? dispatch(communitySliceActions.resetPostList) : dispatch(communitySliceActions.resetSearchList);

		fetchCommunityData().then(() => setIsRefreshing(false));
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
						<PostWriterProfileImage
							source={require('../../../../public/images/danim_logo2.png')}
							resizeMode='contain'
						/>
						<PostWriterText>{data.item.postWriter}</PostWriterText>
					</PostWriterInfoContainer>
					<PostTitleText numberOfLines={1} ellipsizeMode='tail'>
						{data.item.postTitle}
					</PostTitleText>
					<PostDetailInfoContainer>
						<HeartIcon size={12} name={'hearto'} />
						<LikeNumText>{data.item.likerLength}</LikeNumText>
						<CommentIcon size={12} name={'message1'} />
						<CommentNumText>{data.item.commentLength}</CommentNumText>
						<PostDetailInfoText>{data.item.postedAt.slice(0, 10)}</PostDetailInfoText>
					</PostDetailInfoContainer>
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
const CommentNumText = styled.Text`
	font-size: 12px;
	color: green;
	margin-right: 8px;
`;
export const MenuIcon = styled(FeatherIcon)`
	font-size: 24px;
	color: ${colors.selectButton};
`;
const PostItemContainer = styled.View`
	align-items: 'flex-start';
	padding-vertical: 12px;
	padding-horizontal: 24px;
`;
const PostWriterInfoContainer = styled.View`
	flex-direction: row;
	align-items: center;
`;
const PostWriterProfileImage = styled.Image`
	width: 16px;
	height: 16px;
	border-radius: 8px;
	margin-right: 8px;
`;
// border-width: 1px;
// border-color: ${colors.border};
const PostWriterText = styled.Text`
	font-size: 12px;
	font-weight: 400;
`;
const PostTitleText = styled.Text`
	font-size: 16px;
	font-weight: bold;
	margin-vertical: 8px;
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
