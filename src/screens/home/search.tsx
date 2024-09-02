import styled from 'styled-components/native';
import {widthPercentage} from '../../utill/layout/responsive-size';
import {BackgroundGray} from '../../utill/layout/layout';
import {colors} from '../../utill/colors';
import {useCallback, useState} from 'react';

export default function Search({navigation}: any) {
	const [text, setText] = useState('');
	const handleTextChange = useCallback((e: string) => {
		setText(e);
	}, []);
	return (
		<BackgroundGray>
			<SearchTextInput onChangeText={handleTextChange} placeholder='검색어를 입력하세요'></SearchTextInput>
		</BackgroundGray>
	);
}
const SearchTextInput = styled.TextInput`
	width: ${widthPercentage(375)}px;
	background-color: ${colors.backgroundWhite};
`;
