import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import CustomButton from '../../utill/component/custom-button';
import {useAppDispatch, useAppSelector} from '../../redux';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import {useRef, useState} from 'react';
import {TouchableWithoutFeedback, Keyboard} from 'react-native';
import {ClearTouchableOpacity, InputWrap} from '../../utill/layout/layout';
import {SvgCancel} from '../../utill/svg/svg';
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
					<InputAllContainter>
						<TravelTitleTextInput
							style={{color: 'black'}}
							placeholder={!onFocus ? '신나는 여행' : ''}
							placeholderTextColor={'grey'}
							onFocus={() => setOnFocus(true)}
							value={textValue}
							onBlur={() => setOnFocus(false)}
							onChangeText={(value: string) => changeTextValue(value)}></TravelTitleTextInput>
						{textValue && (
							<ClearTouchableOpacity
								onPress={() => {
									changeTextValue('');
								}}>
								<SvgCancel width='20' height='20' color='black' />
							</ClearTouchableOpacity>
						)}
					</InputAllContainter>
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
const InputAllContainter = styled(InputWrap)`
	border-color: ${colors.selectButton};
	height: 72px;
`;

const TravelTitleTextInput = styled.TextInput`
	font-weight: bold;
	font-size: 22px;
	flex: 1;
	padding: 8px;
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
	margin: 0px 0px 5px 0px;
`;
