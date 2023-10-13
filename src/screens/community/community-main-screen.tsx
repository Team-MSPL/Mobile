import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, FlatList, RefreshControl, TouchableOpacity} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import Icon from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {getOnePost, getPostList, postListType} from '../../redux/community/community.slice';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {colors} from '../../utill/colors';
import {useBackHandler} from '../../utill/hooks/useBackhandler';

export default function CommunityMainScreen({navigation}: any) {
	const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const menuActionSheet = useRef<ActionSheet>(null);
	const dispatch = useAppDispatch(); // redux에 있는 함수를 쓸 수 있게 해줌.
	const {postList} = useAppSelector(state => state.communitySlice); // slice에 있는 변수를 가져옴.
	const {socialloginProvider} = useAppSelector(state => state.userSlice);

	// 게시글 읽는 화면으로 이동
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

	// 게시글 작성하는 화면으로 이동
	const goCommunityWritingScreen = () => {
		navigation.navigate('CommunityWritingScreen', {
			title: '',
			content: '',
			images: [],
			isNewPost: true,
		});
	};

	const showCommentOptionActionSheet = () => {
		menuActionSheet.current?.show();
	};

	// 앱 바 우측 더보기
	useEffect(() => {
		navigation.setOptions({
			headerRight: () =>
				socialloginProvider != 'anonymous' && (
					<TouchableOpacity
						style={{marginRight: 20}}
						onPress={() => {
							showCommentOptionActionSheet();
						}}>
						<MenuIcon name='edit'></MenuIcon>
					</TouchableOpacity>
				),
		});
	}, []);

	// CommunityMainScreen으로 올 경우 새로 고침
	useFocusEffect(
		useCallback(() => {
			setIsLoading(true);
			fetchCommunityData();
		}, []),
	);

	// 커뮤니티 정보 가져오기
	const fetchCommunityData = async () => {
		try {
			dispatch(getPostList());
			console.log('DB로부터 게시글들을 가져오는데 성공했습니다.');
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			console.log('DB로부터 게시글들을 읽어오는 중에 오류가 발생했습니다:', error);
		}
	};

	// 밀어서 새로고침
	const handleRefresh = () => {
		setIsRefreshing(true); // 새로고침 시작
		fetchCommunityData().then(() => setIsRefreshing(false));
	};

	// 화면 아래쪽 끝에서 정보 더 가져오기
	const onEndReached = () => {
		if (isLoading) {
			return;
		} else {
			fetchCommunityData();
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
						<PostWriterProfileImage
							source={require('../../../public/images/danim_logo2.png')}
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

	function doNothing(): any {
		// 아무것도 하지 않음
	}

	// 메뉴의 옵션 및 실행 리스트
	const menuOptionList: {
		options: string[];
		onPress: (() => void)[];
	} = {
		options: ['게시글 작성', '취소'],
		onPress: [goCommunityWritingScreen, doNothing],
	};
	useBackHandler();
	return (
		<CommunityMainContainer>
			{isLoading ? (
				<ActivityIndicator size='large' color='#0000ff' />
			) : (
				<FlatList
					data={postList}
					renderItem={renderPostItem}
					initialNumToRender={10}
					ItemSeparatorComponent={() => <FlatListItemSeperator></FlatListItemSeperator>}
					onEndReached={onEndReached}
					onEndReachedThreshold={0.8}
					refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
				/>
			)}
			<ActionSheet
				ref={menuActionSheet}
				title={'메뉴 선택'}
				options={menuOptionList.options}
				cancelButtonIndex={1}
				onPress={(index: number) => {
					menuOptionList.onPress[index]();
				}}
			/>
		</CommunityMainContainer>
	);
}

const CommunityMainContainer = styled.SafeAreaView`
	height: 100%;
	background-color: ${colors.main};
`;
const FlatListItemSeperator = styled.View`
	height: 1px;
	margin-horizontal: 12px;
	background-color: #ccc;
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
export const MenuIcon = styled(FeatherIcon)`
	font-size: 24px;
	color: ${colors.selectButton};
`;
