import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';
import {useCallback, useEffect, useRef, useState} from 'react';
import {
	Dimensions,
	FlatList,
	Keyboard,
	NativeModules,
	Platform,
	RefreshControl,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import FeatherIcon from 'react-native-vector-icons/Feather';
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
import {MenuIcon} from './community-main-screen';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {userSliceActions} from '../../redux/user/user.slice';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {ClearTouchableOpacity, InputWrap} from '../../utill/layout/layout';
import CommunityPost from '../../utill/component/community/community-post';
import LiKeCommentBar from '../../utill/component/community/like-comment-bar';

import {getStorage, ref, getDownloadURL, uploadBytes} from 'firebase/storage';
import {storage, firebase} from '../../../config';
import useFirebaseStorage from '../../utill/hooks/useFirebaseStorage';
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
	const [imageSize, setImageSize] = useState(Dimensions.get('window').width / 4 - 16);
	const [isCommentButtonDisabled, setCommentButtonDisabled] = useState<boolean>(true);
	const [isLoading, setIsLoading] = useState<boolean>(true);
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
					modalSubTitle:
						'신고가 접수되었습니다.\n검토까지는 최대24시간 소요됩니다.\n\n⦁신고사유에 맞지 않는 신고일 경우,\n해당 신고는 처리되지않습니다.\n\n⦁누적 신고횟수가 3회 이상인 유저는 글 작성을 할 수 없게됩니다.',
				}),
			);
			console.log(`"${reason}"`, '신고가 성공적으로 접수되었습니다.');
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

	// ---------------- useEffect 모음(시작) -------------------

	// * 화면 갱신
	useFocusEffect(
		useCallback(() => {
			fetchPostData();
			console.log('CommunityReadingScreen 갱신됨');
		}, []),
	);

	// 댓글 등록 버튼 활성 및 비활성화
	useEffect(() => {
		setCommentButtonDisabled(commentContent.trim() === '');
	}, [commentContent]);

	useEffect(() => {
		// 화면 크기 변경 시 사진 크기 조정
		const handleResize = () => {
			const newSize = Dimensions.get('window').width / 4 - 16;
			setImageSize(newSize);
		};

		const resizeSubscription = Dimensions.addEventListener('change', handleResize);

		// 컴포넌트가 언마운트될 때 이벤트 리스너 구독 제거
		return () => {
			resizeSubscription.remove();
		};
	}, []);

	// 앱 바 우측 더보기
	useEffect(() => {
		navigation.setOptions({
			headerRight: () =>
				socialloginProvider != 'anonymous' && (
					<View>
						<TouchableOpacity
							onPress={() => {
								actionSheetType.current = '게시글';
								showCommunityReadingOptionActionSheet();
							}}>
							<MenuIcon name='more-horizontal'></MenuIcon>
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
			setIsLoading(false);
			console.log(postData.postTitle, '게시글 가져오기 성공');
		} catch (error) {
			setIsLoading(false);
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
						<CommentWriterText>{data.item.commentWriter}</CommentWriterText>
					</CommentWriterInfoContainer>
					{/* 더보기 버튼 */}
					{socialloginProvider != 'anonymous' && (
						<CommentMenu
							onPress={() => {
								setCommentData(data.item);
								actionSheetType.current = '댓글';
							}}>
							<CommentMenuIcon name='more-horizontal' />
						</CommentMenu>
					)}
				</CommentWriterInfoNMenuContainer>
				<CommentContent>{data.item.commentContent}</CommentContent>
				<CommentInfoText>{data.item.commentedAt.slice(0, 10)}</CommentInfoText>
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
			() => handlePostReport('무분별한 도배'),
			() => handlePostReport('정당/정치인 비하 및 선거운동'),
			() => handlePostReport('욕설/비하'),
			() => handlePostReport('상업적 광고 및 판매'),
			() => handlePostReport('음란물/불건전한 만남 및 대화'),
			() => handlePostReport('유출/사칭/사기'),
			doNothing,
		],
		reportComment: [
			() => handleCommentReport('무분별한 도배', commentData._id),
			() => handleCommentReport('정당/정치인 비하 및 선거운동', commentData._id),
			() => handleCommentReport('욕설/비하', commentData._id),
			() => handleCommentReport('상업적 광고 및 판매', commentData._id),
			() => handleCommentReport('음란물/불건전한 만남 및 대화', commentData._id),
			() => handleCommentReport('유출/사칭/사기', commentData._id),
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
							<Divider></Divider>
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
				{socialloginProvider == 'anonymous' ? (
					<View>
						<Text>로그인 후 이용 가능합니다.</Text>
					</View>
				) : (
					<CommentTextInputContainer>
						<CommentTextInput
							placeholderTextColor={'grey'}
							style={{color: 'black'}}
							value={commentContent}
							multiline={true}
							onChangeText={text => setCommentContent(text)}
							placeholder='댓글을 입력하세요...'
						/>
						<ClearContainer disabled={isCommentButtonDisabled} onPress={handleCommentSubmit}>
							<CommentSubmitButtonIcon name='send' isDisabled={isCommentButtonDisabled} />
						</ClearContainer>
					</CommentTextInputContainer>
				)}
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
	padding-vertical: 12px;
	padding-horizontal: 24px;
`;
const Divider = styled.View`
	border-bottom-color: #ccc;
	border-bottom-width: 1px;
`;

// 사진 눌렀을 때 사진 보이는 화면
export const PostImageView = styled.SafeAreaView`
	align-items: center;
`;
export const PostImageIndicatorText = styled.Text`
	font-size: 16px;
	color: white;
`;

const CommentItemContainer = styled.View`
	width: 100%;
	align-self: center;
	margin-vertical: 8px;
	padding-vertical: 12px;
	padding-horizontal: 24px;
	background-color: ${colors.main};
`;

// 댓글 작성자 프로필 이미지, 이름, 메뉴를 담을 영역
const CommentWriterInfoNMenuContainer = styled.View`
	flex-direction: row;
	align-items: center;
	margin-bottom: 12px;
`;
const CommentWriterInfoContainer = styled.View`
	flex-direction: row;
	align-items: center;
	flex: 9;
`;
const CommentWriterImage = styled.Image`
	height: 36px;
	width: 36px;
	border-radius: 18px;
	margin-right: 12px;
`;
const CommentWriterText = styled.Text`
	font-size: 12px;
	font-weight: bold;
	color: black;
`;
const CommentMenu = styled.TouchableOpacity`
	align-items: center;
	justify-content: center;
	flex: 1;
`;
const CommentMenuIcon = styled(FeatherIcon)`
	font-size: 20px;
	color: ${colors.selectButton};
`;
const CommentContent = styled.Text`
	font-size: 16px;
	margin-bottom: 8px;
	color: black;
`;
const CommentInfoText = styled.Text`
	font-size: 10px;
	color: black;
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
	background-color: #f0f0f0;
	border-radius: 16px;
	width: 100%;
	height: 50px;
	padding-horizontal: 16px;
	align-items: center;
	border-width: 0px;
`;
// 실제 글이 입력될 영역
const CommentTextInput = styled.TextInput`
	width: 90%;
`;
// 댓글 등록 버튼
const CommentSubmitButtonIcon = styled(FeatherIcon)<{isDisabled: boolean}>`
	color: ${props => (props.isDisabled ? '#ccc' : colors.border)};
	font-size: 24px;
`;

const CommentDivider = styled.View`
	height: 1;
	background-color: #ccc;
	margin-horizontal: 24px;
`;
