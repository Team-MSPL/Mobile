import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import CustomButton from '../../utill/component/custom-button';
import {useAppDispatch, useAppSelector} from '../../redux';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import {useRef, useState} from 'react';
import {TouchableWithoutFeedback, Keyboard} from 'react-native';
export default function EnrollTravelTitle({navigation}: any) {
	const dispatch = useAppDispatch();
	const [textValue, setTextValue] = useState('');
	const {makeMode} = useAppSelector(state => state.travelSlice);
	const inputRef = useRef();
	const changeTextValue = (e: string) => {
		setTextValue(e);
	};
	const goNext = () => {
		dispatch(travelSliceActions.enrollTravelName(textValue));
		console.log(makeMode);
		makeMode == 'solo' ? navigation.navigate('Timetable') : navigation.navigate('EnrollInfo');
	};
	const [onFocus, setOnFocus] = useState(false);
	return (
		<EnrollTravelTitleContainer>
			<TouchableWithoutFeedback
				onPress={() => {
					Keyboard.dismiss();
				}}>
				<InputContainer>
					<TitleText>여행 제목을 입력해주세요</TitleText>
					{(onFocus || textValue) && <FocusTitleText>신나는 여행</FocusTitleText>}
					<TravelTitleTextInput
						placeholder={!onFocus ? '신나는 여행' : ''}
						onFocus={() => setOnFocus(true)}
						value={textValue}
						onBlur={() => setOnFocus(false)}
						onChangeText={(value: string) => changeTextValue(value)}></TravelTitleTextInput>
					<CustomButton
						isDisabled={textValue == '' || textValue.startsWith(' ')}
						label='다음'
						onPress={goNext}
					/>
				</InputContainer>
			</TouchableWithoutFeedback>
		</EnrollTravelTitleContainer>
	);
}

const TravelTitleTextInput = styled.TextInput`
	width: 100%;
	height: 72px;
	border-radius: 10px;
	border-width: 1px;
	border-color: ${colors.selectButton};
	margin: 15px 0px 15px 0px;
	padding: 10px;
	font-weight: bold;
	font-size: 22px;
`;
const InputContainer = styled.View`
	width: 90%;
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
	margin: 0px 0px 30px 0px;
`;
const FocusTitleText = styled.Text`
	font-size: 15px;
	font-weight: bold;
	color: grey;
`;
