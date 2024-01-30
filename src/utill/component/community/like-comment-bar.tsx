import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {useEffect, useRef, useState} from 'react';
import {clickLike, unclickLike} from '../../../redux/community/community.slice';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {colors} from '../../colors';

export default function LiKeCommentBar() {
	const {socialloginProvider, userId} = useAppSelector(state => state.userSlice);
	const {postData} = useAppSelector(state => state.communitySlice);
	const [isLiked, setIsLiked] = useState<boolean>(false);
	const [totalLike, setTotalLike] = useState(postData.liker.length);
	const dispatch = useAppDispatch();
	const handleLikePress = async () => {
		try {
			if (isLiked) {
				dispatch(unclickLike({postId: postData._id}));
				setTotalLike(totalLike - 1);
			} else {
				dispatch(clickLike({postId: postData._id}));
				setTotalLike(totalLike + 1);
				console.log('좋아요를 했습니다.');
			}
			setIsLiked(!isLiked);
		} catch (error) {
			console.log('좋아요에 오류가 발생했습니다:', error);
		}
	};
	useEffect(() => {
		postData.liker.includes(userId) && setIsLiked(true);
	}, []);
	return (
		<>
			<PostLikeCommentNumContainer>
				<LikeButton onPress={handleLikePress}>
					<HeartIcon name={isLiked ? 'heart' : 'hearto'} selected={isLiked}></HeartIcon>
					<LikeCommentText>{isLiked ? '좋아요 취소' : '좋아요'}</LikeCommentText>
				</LikeButton>
				<CommentIcon name='message-circle' />
				<LikeCommentText>{postData.comment.length}</LikeCommentText>
			</PostLikeCommentNumContainer>
			<LikeCommentText>{totalLike}명이 좋아합니다</LikeCommentText>
		</>
	);
}

const PostLikeCommentNumContainer = styled.View`
	align-items: center;
	flex-direction: row;
	padding-vertical: 8px;
	background-color: ${colors.main};
`;
const LikeButton = styled.TouchableOpacity`
	align-items: center;
	flex-direction: row;
`;
const HeartIcon = styled(AntDesignIcon)<{selected: boolean}>`
	color: ${props => (props.selected ? 'red' : 'black')};
	font-size: 24px;
	margin-right: 4px;
`;
const LikeCommentText = styled.Text`
	font-size: 14px;
	color: black;
	margin-right: 12px;
`;
const CommentIcon = styled(FeatherIcon)`
	color: black;
	font-size: 24px;
	margin-right: 4px;
`;

const CommentItemContainer = styled.View`
	width: 100%;
	align-self: center;
	margin-vertical: 8px;
	padding-vertical: 12px;
	padding-horizontal: 24px;
`;
