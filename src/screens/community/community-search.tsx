import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import {HStack} from '../../utill/layout/layout';

import Icon from 'react-native-vector-icons/AntDesign';
import {useEffect, useRef, useState} from 'react';
import {TextInput} from 'react-native';
import CommunityMain from '../../utill/component/community/community-main';
import {useAppDispatch, useAppSelector} from '../../redux';
import {communitySliceActions, getSearchPostList} from '../../redux/community/community.slice';
export default function CommunitySearch({navigation}: any) {
	const IconElement = styled(Icon)`
		background-color: ${colors.regionNormal};
	`;
	const goBack = () => {
		navigation.goBack();
	};
	const {blockUserList} = useAppSelector(state => state.userSlice);
	const {searchList} = useAppSelector(state => state.communitySlice);
	const [searchValue, setSearchValue] = useState('');
	useEffect(() => {
		searchRef.current?.focus();
	}, []);
	const changeValue = (e: string) => {
		setSearchValue(e);
	};
	const dispatch = useAppDispatch();
	const handleSearch = async () => {
		dispatch(communitySliceActions.resetSearchList());
		await dispatch(getSearchPostList({page: 1, sort: 1, blockList: blockUserList, search: searchValue}));
		setShow(true);
	};
	const cleanValue = () => {
		setSearchValue('');
	};
	const searchRef = useRef<TextInput>();
	const [show, setShow] = useState(false);
	return (
		<MainContainer>
			<SearchHstack>
				<IconContainer onPress={goBack}>
					<IconElement name={'arrowleft'} size={25} color={'black'}></IconElement>
				</IconContainer>
				<SearchContainer
					placeholderTextColor={'grey'}
					placeholder='글 제목,내용'
					value={searchValue}
					onSubmitEditing={handleSearch}
					onChangeText={changeValue}
					ref={searchRef}></SearchContainer>
				{searchValue != '' && (
					<IconContainer onPress={cleanValue}>
						<IconElement name={'close'} size={25} color={'black'}></IconElement>
					</IconContainer>
				)}
			</SearchHstack>
			{show && searchList.length == 0 && (
				<TextContainer>
					<SearchText>검색 결과가 없습니다</SearchText>
				</TextContainer>
			)}
			{show ? (
				<CommunityMain navigation={navigation} searchState={true}></CommunityMain>
			) : (
				<TextContainer>
					<SearchText>제목, 내용을 검색해보세요</SearchText>
				</TextContainer>
			)}
		</MainContainer>
	);
}
const TextContainer = styled.View`
	align-items: center;
	justify-content: center;
	flex: 1;
`;
const SearchText = styled.Text`
	font-size: 25px;
	font-weight: bold;
	color: grey;
`;
const MainContainer = styled.SafeAreaView`
	flex: 1;
`;
const IconContainer = styled.TouchableOpacity`
	padding: 0px 10px 0px 10px;
`;
const SearchHstack = styled(HStack)`
	justify-content: center;
	align-items: center;
	height: 50px;
	margin: 10px 24px 0px 24px;
	border-radius: 10px;
	background-color: ${colors.regionNormal};
`;
const SearchContainer = styled.TextInput`
	flex: 1;
`;
