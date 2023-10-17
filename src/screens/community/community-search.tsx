import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import {HStack} from '../../utill/layout/layout';

import Icon from 'react-native-vector-icons/AntDesign';
import {useEffect, useRef, useState} from 'react';
import {TextInput} from 'react-native';
import CommunityMain from '../../utill/component/community/community-main';
import {useAppDispatch} from '../../redux';
export default function CommunitySearch({navigation}: any) {
	const IconElement = styled(Icon)`
		background-color: ${colors.regionNormal};
	`;
	const goBack = () => {
		navigation.goBack();
	};
	const [searchValue, setSearchValue] = useState('');
	useEffect(() => {
		searchRef.current?.focus();
	}, []);
	const changeValue = (e: string) => {
		setSearchValue(e);
	};
	const dispatch = useAppDispatch();
	const handleSearch = () => {
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
			{show && <CommunityMain navigation={navigation} searchValue={searchValue} show={show}></CommunityMain>}
		</MainContainer>
	);
}
const SearchText = styled.Text`
	font-size: 30px;
	font-weight: bold;
	color: ${colors.regionNormal};
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
	margin: 10px 24px 0px 24px;
	background-color: ${colors.regionNormal};
`;
const SearchContainer = styled.TextInput`
	flex: 1;
`;
