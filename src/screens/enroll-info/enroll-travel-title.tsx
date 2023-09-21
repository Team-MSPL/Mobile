import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import CustomButton from '../../utill/component/custom-button';
import {useAppDispatch} from '../../redux';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import {useState} from 'react';
export default function EnrollTravelTitle({navigation}: any) {
	const dispatch = useAppDispatch();
	const [textValue, setTextValue] = useState('');
	const changeTextValue = (e: string) => {
		setTextValue(e);
	};
	const goNext = () => {
		dispatch(travelSliceActions.enrollTravelName(textValue));
		navigation.navigate('EnrollInfo');
	};
	return (
		<EnrollTravelTitleContainer>
			<TitleText>여행 제목을 입력해주세요</TitleText>
			<TravelTitleTextInput
				placeholder='신나는 여행'
				value={textValue}
				onChangeText={(value: string) => changeTextValue(value)}></TravelTitleTextInput>
			<CustomButton isDisabled={textValue == ''} label='다음' onPress={goNext} />
		</EnrollTravelTitleContainer>
	);
}

const TravelTitleTextInput = styled.TextInput`
	width: 90%;
	height: 72px;
	border-radius: 10px;
	border-width: 1px;
	border-color: ${colors.selectButton};
	margin: 15px 0px 15px 0px;
`;
const EnrollTravelTitleContainer = styled.View`
	width: 100%;
	flex: 1;
	padding: 10px;
	align-items: center;
	justify-content: center;
	background-color: white;
`;
const TitleText = styled.Text`
	font-size: 22px;
	font-weight: bold;
	color: black;
`;
