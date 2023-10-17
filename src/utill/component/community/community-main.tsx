import {FlatList, NativeScrollEvent, NativeSyntheticEvent, RefreshControl, TouchableOpacity} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {getOnePost, getPostList, postListType} from '../../../redux/community/community.slice';
import {memo, useEffect, useState} from 'react';
import {LoadingSliceActions} from '../../../redux/loading/loading.slice';
import styled from 'styled-components/native';
import {colors} from '../../colors';

import Icon from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';
function CommunityMain({
	navigation,
	setViewState,
	searchValue,
	show,
}: {
	navigation: any;
	setViewState?: any;
	searchValue?: string;
	show: boolean;
}) {
	const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
	const [sortOption, setSortOption] = useState(1);
	const [currentPage, setCurrentPage] = useState(1);
	const [sortOptions, setSortOptions] = useState([
		{label: '최신 순', value: 1},
		{label: '좋아요 순 ', value: 2},
		{label: '댓글 순', value: 3},
	]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [totalPages, setTotalPages] = useState(1);
	const {postList} = useAppSelector(state => state.communitySlice);
	const [currentPostList, setCurrentPostList] = useState<postListType[]>(postList);
	const dispatch = useAppDispatch();
	// 커뮤니티 정보 가져오기
	const fetchCommunityData = async ({value, first}: {value?: string; first?: boolean}) => {
		try {
			const response = await dispatch(getPostList({page: currentPage, sort: sortOption, search: value || ''}));
			console.log('DB로부터 게시글들을 가져오는데 성공했습니다.');
			first
				? setCurrentPostList([...response.payload])
				: setCurrentPostList([...currentPostList, ...response.payload]);

			if (response.payload.length < 20) {
				// payload에 실제로 게시글 데이터가 담겨 있다고 가정
				setTotalPages(currentPage); // 현재 페이지가 마지막 페이지임을 설정
				console.log('현재가 마지막 페이지임');
			}
			setIsLoading(false);
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
	useEffect(() => {
		if (searchValue) {
			const first = true;
			fetchCommunityData({value: searchValue, first: first});
		}
	}, [show]);
	const handleRefresh = () => {
		setIsRefreshing(true); // 새로고침 시작
		fetchCommunityData({}).then(() => setIsRefreshing(false));
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
						<HeartIcon name={'hearto'} />
						<LikeNumText>{data.item.likerLength}</LikeNumText>
						<CommentIcon name={'message1'} />
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
		<FlatList
			data={postList}
			renderItem={renderPostItem}
			initialNumToRender={20}
			ItemSeparatorComponent={() => <FlatListItemSeperator></FlatListItemSeperator>}
			onEndReached={() => {
				console.log('받아오기');
			}}
			onEndReachedThreshold={0.8}
			onScroll={handleView}
			refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
		/>
	);
}
export default memo(CommunityMain);
const FlatListItemSeperator = styled.View`
	height: 1px;
	margin-horizontal: 24px;
	background-color: #e0e0e0;
`;
const HeartIcon = styled(Icon)`
	size: 12px;
	color: red;
	margin-right: 4px;
`;
const LikeNumText = styled.Text`
	font-size: 12px;
	color: red;
	margin-right: 8px;
`;
const CommentIcon = styled(Icon)`
	size: 12px;
	color: green;
	margin-right: 4px;
`;
const CommentNumText = styled.Text`
	font-size: 12px;
	color: green;
	margin-right: 8px;
`;
const IconContainer = styled(Icon)``;
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
	border: ${colors.border};
	margin-right: 8px;
`;
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
