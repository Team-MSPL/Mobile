import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';
import {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, Keyboard, NativeModules, Platform, RefreshControl, TouchableOpacity, View} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {
	blockUser,
	commentType,
	communitySliceActions,
	deleteComment,
	deletePost,
	getOnePost,
	getPostList,
	reportCommentType,
	reportPost,
	reportPostType,
	saveComment,
	saveCommentType,
} from '../../redux/community/community.slice';
import {colors} from '../../utill/colors';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {userSliceActions} from '../../redux/user/user.slice';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {
	ClearTouchableOpacity,
	InputWrap,
	PretendardSemiBoldText,
	PretendardVariableText,
} from '../../utill/layout/layout';
import CommunityPost from '../../utill/component/community/community-post';
import LiKeCommentBar from '../../utill/component/community/like-comment-bar';
import useFirebaseStorage from '../../utill/hooks/useFirebaseStorage';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {SVGMoreHorizontal, SVGPencil} from '../../utill/svg/svg';
const {StatusBarManager} = NativeModules;

export default function CommunityReadingScreen({navigation, route}: any) {
	// 뒤로 가기
	const goBack = () => {
		navigation.goBack();
	};

	// 글 작성 화면으로 가기
	const goCommunityWritingScreen = () => {
		navigation.navigate('CommunityWritingScreen', {
			title: postData.postTitle,
			content: postData.postContent,
			images: postData.postImage,
			postId: postData._id,
			isNewPost: false,
		});
	};

	const [commentContent, setCommentContent] = useState<string>('');
	const [isCommentButtonDisabled, setCommentButtonDisabled] = useState<boolean>(true);
	const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
	const {userId, userName, userProfileImage, socialloginProvider, blockUserList} = useAppSelector(
		state => state.userSlice,
	);
	const [commentData, setCommentData] = useState<commentType>({
		commentContent: '',
		commentedAt: '',
		commentWriter: '',
		commentWriterUserId: '',
		commentWriterProfile: '',
		_id: '',
	});

	const dispatch = useAppDispatch(); // redux에 있는 함수를 쓸 수 있게 해줌.
	const {postData} = useAppSelector(state => state.communitySlice); // slice에 있는 변수를 가져옴.
	const communityReadingOptionActionSheet = useRef<ActionSheet>(null);
	const reportPostActionSheet = useRef<ActionSheet>(null);
	const commentOptionActionSheet = useRef<ActionSheet>(null);
	const actionSheetType = useRef<string>('게시글');

	// 게시글 메뉴 액션 시트 보이기
	const showCommunityReadingOptionActionSheet = () => {
		communityReadingOptionActionSheet.current?.show();
	};

	// 게시글 신고 액션 시트 보이기
	const showReportActionSheet = () => {
		reportPostActionSheet.current?.show();
	};

	// 게시글 신고 액션 시트 보이기
	const showCommentOptionActionSheet = () => {
		commentOptionActionSheet.current?.show();
	};

	// 게시글 지우기 확인창
	const postDeleteCheckAlert = () => {
		dispatch(
			modalSliceActions.setOpenModal({
				modalTitle: '삭제',
				modalSubTitle: '게시글을 삭제하시겠습니까?',
				modalLeft: true,
				modalFunction: handleDeletePost,
			}),
		);
	};

	// * 게시글 신고 기능
	const handlePostReport = async (reason: string) => {
		try {
			// db의 comment에 들어갈 정보들
			const reportData: reportPostType = {
				postId: postData._id,
				reportReason: reason,
				reportedAt: moment(Date()).format('yy/MM/DD HH:mm:ss'),
				reportWriter: userName,
			};
			await dispatch(reportPost(reportData));
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '신고완료',
					modalSingleUse: true,
					modalSubTitle: '신고가 접수되었습니다.\n⦁부적절한 신고일 경우 처리되지않습니다.',
				}),
			);
		} catch (error) {
			console.log('신고 접수 중에 오류가 발생했습니다:', error);
		}
	};

	// 댓글 신고 기능
	const handleCommentReport = async (reason: string, commentId: string) => {
		try {
			// db의 comment에 들어갈 정보들
			const reportData: reportCommentType = {
				postId: postData._id,
				commentId: commentId,
				reportReason: reason,
				reportedAt: moment(Date()).format('yy/MM/DD HH:mm:ss'),
				reportWriter: userName,
			};
			await dispatch(reportPost(reportData));
			dispatch(
				modalSliceActions.setOpenModal({modalTitle: '접수 완료', modalSubTitle: '신고가 접수되었습니다.'}),
			);
		} catch (error) {
			console.log('댓글 신고 접수 중에 오류가 발생했습니다:', error);
		}
	};
	const checkReport = (reason: string, commentId?: string | undefined) => {
		dispatch(
			modalSliceActions.setOpenModal({
				modalTitle: reason,
				modalSubTitle: `신고하시겠습니까?`,
				modalFunction: commentId
					? () => {
							handleCommentReport(reason, commentId);
					  }
					: () => {
							handlePostReport(reason);
					  },
				modalTopText: '신고',
				modalBottomText: '취소',
				modalBottomFunciton: () => {},
			}),
		);
	};

	// ---------------- useEffect 모음(시작) -------------------

	// * 화면 갱신
	useFocusEffect(
		useCallback(() => {
			fetchPostData();
		}, []),
	);

	// 댓글 등록 버튼 활성 및 비활성화
	useEffect(() => {
		if (commentContent.trim() === '') {
			setCommentButtonDisabled(true);
		} else if (commentContent.length >= 1 && isCommentButtonDisabled) {
			setCommentButtonDisabled(false);
		}
	}, [commentContent]);

	// 앱 바 우측 더보기
	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<View>
					<TouchableOpacity
						onPress={() => {
							actionSheetType.current = '게시글';
							showCommunityReadingOptionActionSheet();
						}}>
						<SVGMoreHorizontal width={widthPercentage(24)} height={widthPercentage(24)} />
					</TouchableOpacity>
				</View>
			),
		});
	}, []);

	// commentData 변경 감지하여 action sheet 보여주기
	useEffect(() => {
		if (actionSheetType.current === '댓글') {
			showCommentOptionActionSheet();
		}
	}, [commentData]);

	useEffect(() => {
		Platform.OS == 'ios'
			? StatusBarManager.getHeight((statusBarFrameData: {height: number}) => {
					setStatusBarHeight(statusBarFrameData.height);
			  })
			: null;
	}, []);

	const [statusBarHeight, setStatusBarHeight] = useState(0);

	// ---------------- useEffect 모음(끝) -------------------

	// * 게시글 정보 가져오기
	const fetchPostData = async () => {
		try {
			await dispatch(getOnePost({postId: route.params.postId}));
		} catch (error) {
			console.log('DB로부터 데이터를 가져오는 중에 오류가 발생했습니다:', error);
		}
	};

	// * 댓글 등록 (새로운 댓글 및 댓글 수정)
	// TODO 댓글 수정 기능 추가해야함.
	const handleCommentSubmit = async () => {
		try {
			// db의 comment에 들어갈 정보들
			const newCommentData: saveCommentType = {
				postId: postData._id,
				comment: {
					commentContent: commentContent,
					commentedAt: moment(Date()).format('yy/MM/DD HH:mm:ss'),
					commentWriter: userName,
					commentWriterUserId: userId,
					commentWriterProfile: userProfileImage,
				},
			};
			await dispatch(saveComment(newCommentData));
			// 댓글 등록 후 입력창 초기화
			Keyboard.dismiss();
			setCommentContent('');

			await fetchPostData();
		} catch (error) {
			console.log('댓글 등록 중에 오류가 발생했습니다:', error);
		}
	};

	// 댓글 삭제 확인창
	const commentDeleteCheckAlert = (commentId: string) => {
		dispatch(
			modalSliceActions.setOpenModal({
				modalTitle: '삭제',
				modalSubTitle: '댓글을 삭제하시겠습니까?.',
				modalLeft: true,
				modalFunction: () => handleDeleteComment(commentId),
			}),
		);
	};

	// * 댓글 삭제
	const handleDeleteComment = async (commentId: string) => {
		try {
			await dispatch(deleteComment({postId: postData._id, commentId: commentId}));

			await fetchPostData();
		} catch (error) {
			console.log('댓글을 삭제하는 도중 에러가 발생했습니다.', error);
		}
	};

	const {firebaseImageRemove} = useFirebaseStorage();
	// * 게시글 삭제
	const handleDeletePost = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			await firebaseImageRemove({pictureList: postData.postImage, id: postData._id, category: 'post'});
			await dispatch(deletePost({postId: postData._id}));
			dispatch(communitySliceActions.resetPostList());
			await dispatch(getPostList({page: 1, sort: 1, blockList: blockUserList}));
			goBack();
		} catch (e) {
			dispatch(modalSliceActions.setOpenModal({modalTitle: '실패', modalSubTitle: '잠시후 다시 시도해주세요'}));
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};

	// * 가져온 댓글 UI
	const renderCommentItem = (data: {item: commentType}) => {
		return (
			<CommentItemContainer>
				<CommentWriterInfoNMenuContainer>
					<CommentWriterInfoContainer>
						<CommentWriterImage source={{uri: data.item.commentWriterProfile}} />
						<PretendardSemiBoldText size={12} lineHeight={15} color={colors.Black}>
							{data.item.commentWriter}
						</PretendardSemiBoldText>
					</CommentWriterInfoContainer>
					{/* 더보기 버튼 */}
					<CommentMenu
						onPress={() => {
							setCommentData(data.item);
							actionSheetType.current = '댓글';
						}}>
						<SVGMoreHorizontal width={widthPercentage(24)} height={widthPercentage(24)} />
					</CommentMenu>
				</CommentWriterInfoNMenuContainer>

				<PretendardSemiBoldText size={14} lineHeight={21} color={colors.Black}>
					{data.item.commentContent}
				</PretendardSemiBoldText>

				<PretendardVariableText size={12} lineHeight={18} color={colors.Black}>
					{data.item.commentedAt.slice(0, 10)}
				</PretendardVariableText>
			</CommentItemContainer>
		);
	};

	// 새로 고침
	const handleRefresh = () => {
		setIsRefreshing(true); // 새로고침 시작
		fetchPostData().then(() => setIsRefreshing(false)); // 새로고침 완료 후 상태 변경
	};

	function doNothing(): any {
		// 아무것도 하지 않음
	}
	const checkBlock = () => {
		dispatch(
			modalSliceActions.setOpenModal({
				modalTitle: '차단',
				modalSubTitle: '차단한 사용자의 모든 글을 못보게됩니다.\n차단하시겠습니까?',
				modalLeft: true,
				modalFunction: handleBlock,
			}),
		);
	};
	const handleBlock = async () => {
		dispatch(userSliceActions.setBlockList(postData.postWriterUserId));
		try {
			await dispatch(blockUser({blockUserId: postData.postWriterUserId}));
			navigation.goBack();
		} catch (err) {
			console.log(err);
		}
	};

	const communityReadingMenuOptionList: {options: string[]; onPress: (() => void)[]} = {
		options: ['수정', '삭제', '신고', '차단', '취소'],
		onPress: [goCommunityWritingScreen, postDeleteCheckAlert, showReportActionSheet, checkBlock, doNothing],
	};

	const reportOptionList: {
		options: string[];
		reportPost: (() => Promise<void>)[];
		reportComment: (() => Promise<void>)[];
	} = {
		options: [
			'무분별한 도배',
			'정당/정치인 비하 및 선거운동',
			'욕설/비하',
			'상업적 광고 및 판매',
			'음란물/불건전한 만남 및 대화',
			'유출/사칭/사기',
			'취소',
		],
		reportPost: [
			() => checkReport('무분별한 도배'),
			() => checkReport('정당/정치인 비하 및 선거운동'),
			() => checkReport('욕설/비하'),
			() => checkReport('상업적 광고 및 판매'),
			() => checkReport('음란물/불건전한 만남 및 대화'),
			() => checkReport('유출/사칭/사기'),
			doNothing,
		],
		reportComment: [
			() => checkReport('무분별한 도배', commentData._id),
			() => checkReport('정당/정치인 비하 및 선거운동', commentData._id),
			() => checkReport('욕설/비하', commentData._id),
			() => checkReport('상업적 광고 및 판매', commentData._id),
			() => checkReport('음란물/불건전한 만남 및 대화', commentData._id),
			() => checkReport('유출/사칭/사기', commentData._id),
			doNothing,
		],
	};

	const commentOptionList: {options: string[]; onPress: (() => Promise<void>)[]} = {
		options: ['삭제', '신고', '취소'],
		onPress: [() => commentDeleteCheckAlert(commentData._id), () => showReportActionSheet(), doNothing],
	};

	return (
		<CommunityReadingContainer>
			<ActionSheet
				ref={communityReadingOptionActionSheet}
				title={'글 메뉴'}
				options={
					userId === postData.postWriterUserId
						? communityReadingMenuOptionList.options.filter(
								item => item === '수정' || item === '삭제' || item === '취소',
						  )
						: communityReadingMenuOptionList.options.filter(
								item => item === '신고' || item === '차단' || item === '취소',
						  )
				}
				cancelButtonIndex={userId == postData.postWriterUserId ? 2 : 2}
				onPress={(index: number) => {
					userId === postData.postWriterUserId
						? index == 2
							? () => {}
							: communityReadingMenuOptionList.onPress[index]()
						: communityReadingMenuOptionList.onPress.slice(2, 5)[index]();
				}}
			/>
			<ActionSheet
				ref={reportPostActionSheet}
				title={'신고 사유 선택'}
				options={reportOptionList.options}
				cancelButtonIndex={6}
				onPress={(index: number) => {
					if (actionSheetType.current == '게시글') {
						reportOptionList.reportPost[index]();
					} else if (actionSheetType.current == '댓글') {
						reportOptionList.reportComment[index]();
					}
				}}
			/>
			<ActionSheet
				ref={commentOptionActionSheet}
				title={'댓글 메뉴'}
				options={
					userId === commentData.commentWriterUserId
						? commentOptionList.options.filter(item => item == '삭제' || item === '취소')
						: commentOptionList.options.filter(item => item === '신고' || item === '취소')
				}
				cancelButtonIndex={1}
				onPress={(index: number) => {
					userId == commentData.commentWriterUserId
						? index == 1
							? () => {}
							: commentOptionList.onPress[index]()
						: commentOptionList.onPress.slice(1, 3)[index]();
				}}
			/>
			<PostContentCommentContainer>
				<FlatList
					refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
					ListHeaderComponent={
						<FlatListHeaderContainer>
							<CommunityPost></CommunityPost>
							<LiKeCommentBar></LiKeCommentBar>
						</FlatListHeaderContainer>
					}
					data={postData.comment}
					renderItem={renderCommentItem}
					ItemSeparatorComponent={CommentDivider}
					initialNumToRender={10}
				/>
			</PostContentCommentContainer>
			<CommentInputContainer
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				keyboardVerticalOffset={statusBarHeight + 44}>
				<CommentTextInputContainer>
					<CommentTextInput
						placeholderTextColor={'grey'}
						style={{color: 'black'}}
						value={commentContent}
						multiline={true}
						onChangeText={text => setCommentContent(text)}
						placeholder='댓글을 입력하세요...'
						blurOnSubmit={true}
					/>
					<ClearContainer disabled={isCommentButtonDisabled} onPress={handleCommentSubmit}>
						<SVGPencil width={widthPercentage(16)} height={widthPercentage(16)} color='#70768E' />
					</ClearContainer>
				</CommentTextInputContainer>
			</CommentInputContainer>
		</CommunityReadingContainer>
	);
}

const ClearContainer = styled(ClearTouchableOpacity)`
	width: 10%;
`;
// 전체화면(safearea바깥 영역 포함)
const CommunityReadingContainer = styled.SafeAreaView`
	flex: 1;
	background-color: ${colors.main};
`;

const PostContentCommentContainer = styled.View`
	flex: 9;
	align-itemsx: center;
	justify-content: center;
`;
const FlatListHeaderContainer = styled.View`
	padding-vertical: ${heightPercentage(12)}px;
	padding-horizontal: ${widthPercentage(24)}px;
`;

const CommentItemContainer = styled.View`
	width: 100%;
	align-self: center;
	margin-vertical: ${widthPercentage(2)}px;
	padding-vertical: ${widthPercentage(6)}px;
	padding-horizontal: ${heightPercentage(24)}px;
	background-color: ${colors.main};
`;

// 댓글 작성자 프로필 이미지, 이름, 메뉴를 담을 영역
const CommentWriterInfoNMenuContainer = styled.View`
	flex-direction: row;
	align-items: center;
	margin-bottom: ${heightPercentage(12)}px;
`;
const CommentWriterInfoContainer = styled.View`
	flex-direction: row;
	align-items: center;
	flex: 9;
`;
const CommentWriterImage = styled.Image`
	height: ${widthPercentage(36)}px;
	width: ${widthPercentage(36)}px;
	border-radius: 18px;
	margin-right: 12px;
`;
const CommentMenu = styled.TouchableOpacity`
	align-items: center;
	justify-content: center;
	flex: 1;
`;

// 댓글 입력을 위해 전체 화면을 9:1로 나눈 곳 중 1인 영역
const CommentInputContainer = styled.KeyboardAvoidingView`
	flex: 1;
	align-items: center;
	justify-content: center;
	background-color: white;
`;
// 밝은 회색(#f0f0f0)인 영역
const CommentTextInputContainer = styled(InputWrap)`
	background-color: ${colors.Gray1};
	padding: 0px ${widthPercentage(10)}px;
	border-radius: 12px;
	width: ${widthPercentage(327)}px;
	height: ${heightPercentage(52)}px;
	align-items: center;
	border-width: 0px;
`;
// 실제 글이 입력될 영역
const CommentTextInput = styled.TextInput`
	width: 90%;
`;

const CommentDivider = styled.View`
	height: 1;
	background-color: #ccc;
	margin-horizontal: 24px;
`;
