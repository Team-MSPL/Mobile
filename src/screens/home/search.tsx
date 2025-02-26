import styled from 'styled-components/native';
import {widthPercentage} from '../../utill/layout/responsive-size';
import {BackgroundGray} from '../../utill/layout/layout';
import {colors} from '../../utill/colors';
import {useCallback, useState} from 'react';
import {axiosGoogle} from '../../redux/travel-info/travel.slice';
import {GOOGLE_API_KEY} from '@env';

export default function Search({navigation}: any) {
	const [text, setText] = useState('');
	const handleTextChange = useCallback((e: string) => {
		setText(e);
	}, []);
	const goCourseDetaile = async (e: any) => {
		if (text != '') {
			const response = await axiosGoogle.get(
				`/place/textsearch/json?query=${text}&language=ko&key=${GOOGLE_API_KEY}`,
			);
			const a = await axiosGoogle.get(
				`/place/details/json?place_id=${response.data.results[0].place_id}&fields=photos%2Cname%2Crating%2Cformatted_address%2Creviews%2Cformatted_phone_number%2Copening_hours%2Ceditorial_summary&language=ko&key=${GOOGLE_API_KEY}`,
			);
			navigation.navigate('CourseDetail', {info: a.data.result});
		}
	};
	return (
		<BackgroundGray>
			<SearchTextInput
				autoFocus
				onChangeText={handleTextChange}
				value={text}
				onSubmitEditing={goCourseDetaile}
				placeholder='검색어를 입력하세요'></SearchTextInput>
		</BackgroundGray>
	);
}
const SearchTextInput = styled.TextInput`
	width: ${widthPercentage(375)}px;
	background-color: ${colors.backgroundWhite};
`;
