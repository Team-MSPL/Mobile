import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {useEffect, useRef, useState} from 'react';
import {clickLike, unclickLike} from '../../../redux/community/community.slice';
import {colors} from '../../colors';
import {HStack, PretendardVariableText} from '../../layout/layout';
import {SVGHeart, SVGMessageSquare} from '../../svg/svg';
import {widthPercentage} from '../../layout/responsive-size';

export default function LiKeCommentBar() {
	const {userId} = useAppSelector(state => state.userSlice);
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
			<HStack gap={widthPercentage(10)} justifyContent='flex-end'>
				<PretendardVariableText size={14} lineHeight={21} color={colors.Gray4}>
					{postData.postedAt.slice(0, 10)}
				</PretendardVariableText>
				<LikeButton onPress={handleLikePress}>
					<SVGHeart
						width={widthPercentage(16)}
						height={widthPercentage(16)}
						color={isLiked ? 'red' : colors.backgroundWhite}
					/>
					<PretendardVariableText size={14} lineHeight={21} color={colors.Gray4}>
						{totalLike}
					</PretendardVariableText>
				</LikeButton>
				<HStack gap={widthPercentage(3)}>
					<SVGMessageSquare width={widthPercentage(16)} height={widthPercentage(17)} />
					<PretendardVariableText size={14} lineHeight={21} color={colors.Gray4}>
						{postData.comment.length}
					</PretendardVariableText>
				</HStack>
			</HStack>
		</>
	);
}

const LikeButton = styled.TouchableOpacity`
	align-items: center;
	flex-direction: row;
	gap: ${widthPercentage(3)}px;
`;
