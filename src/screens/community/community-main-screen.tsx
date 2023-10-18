import React, {useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native';
import DropdownButton from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {getPostList, postListType} from '../../redux/community/community.slice';
import {colors} from '../../utill/colors';
import CommunityMain from '../../utill/component/community/community-main';
import ScrollButton from '../../utill/component/scroll-button';
import {useBackHandler} from '../../utill/hooks/useBackhandler';

export default function CommunityMainScreen({navigation}: any) {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [currentPage, setCurrentPage] = useState(1);
	const dispatch = useAppDispatch(); // redux에 있는 함수를 쓸 수 있게 해줌.
	const {postList} = useAppSelector(state => state.communitySlice); // slice에 있는 변수를 가져옴.
	const {socialloginProvider, blockUserList} = useAppSelector(state => state.userSlice);
	const [totalPages, setTotalPages] = useState(1);
	const [isDropdownOpened, setIsDropdownOpened] = useState(false);
	const [sortOption, setSortOption] = useState(1);
	const [sortOptions, setSortOptions] = useState([
		{label: '최신 순', value: 1},
		{label: '좋아요 순 ', value: 2},
		{label: '댓글 순', value: 3},
	]);
	const [currentPostList, setCurrentPostList] = useState<postListType[]>(postList);

	const [viewState, setViewState] = useState(false);
	// 게시글 작성하는 화면으로 이동
	const goCommunityWritingScreen = () => {
		navigation.navigate('CommunityWritingScreen', {
			title: '',
			content: '',
			images: [],
			isNewPost: true,
		});
	};

	const goSearch = () => {
		navigation.navigate('CommunitySearch');
	};
	// 앱 바 우측 더보기
	// useEffect(() => {
	// 	navigation.setOptions({
	// 		headerRight: () =>
	// 			socialloginProvider != 'anonymous' && (
	// 				<HeaderHstack>
	// 					<TouchableOpacity onPress={goSearch}>
	// 						<IconContainer color={'black'} name='search1' size={24}></IconContainer>
	// 					</TouchableOpacity>
	// 				</HeaderHstack>
	// 			),
	// 	});
	// }, []);

	// CommunityMainScreen으로 올 경우 새로 고침
	// useFocusEffect(
	// 	useCallback(() => {
	// 		fetchCommunityData();
	// 	}, []),
	// );
	useEffect(() => {
		fetchCommunityData();
	}, [blockUserList]);

	// 커뮤니티 정보 가져오기
	const fetchCommunityData = async () => {
		try {
			const response = await dispatch(
				getPostList({page: currentPage, sort: sortOption, blockList: blockUserList}),
			);
			console.log('DB로부터 게시글들을 가져오는데 성공했습니다.');
			setCurrentPostList([...response.payload]);
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

	useBackHandler();

	return (
		<CommunityMainContainer>
			{/* <DropDownButton
				open={isDropdownOpened}
				value={sortOption}
				items={sortOptions}
				setOpen={setIsDropdownOpened}
				setValue={value => {
					setSortOption(value);
				}}
				setItems={setSortOptions}
				placeholder={sortOptions.find(option => option.value === sortOption)?.label || ''}
			/> */}

			{isLoading ? (
				<ActivityIndicator size='large' color='#0000ff' />
			) : (
				<CommunityMain setViewState={setViewState} navigation={navigation}></CommunityMain>
			)}
			{socialloginProvider != 'anonymous' && (
				<ScrollButton viewState={viewState} goCommunityWritingScreen={goCommunityWritingScreen} />
			)}
		</CommunityMainContainer>
	);
}
const HeaderHstack = styled.View`
	width: 100%;
	align-items: center;
`;
const CommunityMainContainer = styled.SafeAreaView`
	height: 100%;
	background-color: ${colors.main};
`;
const DropDownButton = styled(DropdownButton)`
	width: 30%;
	margin-horizontal: 24px;
	margin-vertical: 12px;
	shadow-color: #000;
	shadow-offset: 1px 2px;
	shadow-opacity: 0.25;
	shadow-radius: 3.84px;
	border: #ccc;
	elevation: 5;
`;
const IconContainer = styled(Icon)``;
export const MenuIcon = styled(FeatherIcon)`
	font-size: 24px;
	color: ${colors.selectButton};
`;
