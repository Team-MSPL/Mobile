import {useFocusEffect} from '@react-navigation/native';
import {FlatList, ThreeDotsIcon} from 'native-base';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, RefreshControl, TouchableOpacity, View} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import Icon from 'react-native-vector-icons/AntDesign';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {getOnePost, getPostList, postListType} from '../../redux/community/community.slice';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {colors} from '../../utill/colors';
import {useBackHandler} from '../../utill/hooks/useBackhandler';
import {MainContainer} from '../../utill/layout/layout';

export default function CommunityMainScreen({navigation}: any) {
	const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const menuActionSheet = useRef<ActionSheet>(null);
	const dispatch = useAppDispatch(); // redux에 있는 함수를 쓸 수 있게 해줌.
	const {postList} = useAppSelector(state => state.communitySlice); // slice에 있는 변수를 가져옴.
	const {socialloginProvider} = useAppSelector(state => state.userSlice);

	useFocusEffect(
		useCallback(() => {
			dispatch(getPostList());
		}, []),
	);

	// 아이템 구분선
	const flatListItemSeperator = () => {
		return (
			<View
				style={{
					height: 1,
					width: '100%',
					backgroundColor: 'gray',
				}}
			/>
		);
	};

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
					<View>
						<TouchableOpacity
							onPress={() => {
								showCommentOptionActionSheet();
							}}>
							<ThreeDotsIcon></ThreeDotsIcon>
						</TouchableOpacity>
					</View>
				),
		});
	}, []);

	// CommunityMainScreen으로 올 경우 새로 고침
	useFocusEffect(
		useCallback(() => {
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
			<PostItemContainer>
				<TouchableOpacity
					onPress={() => {
						goCommunityReadingScreen(data.item.postId);
					}}>
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
						<PostDetailInfoText>{data.item.postedAt.slice(0, 10)}</PostDetailInfoText>
						<HeartIcon name={'hearto'} />
						<PostDetailInfoText>{data.item.likerLength}</PostDetailInfoText>
						<CommentIcon name={'message1'} />
						<PostDetailInfoText>{data.item.commentLength}</PostDetailInfoText>
					</PostDetailInfoContainer>
				</TouchableOpacity>
			</PostItemContainer>
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
		<MainContainer>
			{isLoading ? (
				<ActivityIndicator size='large' color='#0000ff' />
			) : (
				<FlatList
					data={postList}
					renderItem={renderPostItem}
					initialNumToRender={10}
					ItemSeparatorComponent={flatListItemSeperator}
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
		</MainContainer>
	);
}

const PostItemContainer = styled.View`
	alignitems: 'flex-start';
	padding: 12px;
`;
const PostWriterInfoContainer = styled.View`
	flex-direction: row;
	align-items: center;
`;
const PostWriterProfileImage = styled.Image`
	width: 20px;
	height: 20px;
	border-radius: 10px;
	border: ${colors.border};
	margin-right: 12px;
`;
const PostWriterText = styled.Text`
	font-size: 16px;
	font-weight: bold;
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
const CommentIcon = styled(Icon)`
	size: 12px;
	color: green;
	margin-right: 4px;
`;
