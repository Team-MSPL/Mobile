import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import CustomButton from '../../utill/component/custom-button';
import {useAppDispatch, useAppSelector} from '../../redux';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import {useState} from 'react';
import {TouchableWithoutFeedback, Keyboard} from 'react-native';
import {BackgroundGray, ClearTouchableOpacity, InputWrap} from '../../utill/layout/layout';
import {SvgCancel} from '../../utill/svg/svg';
import Stepper from '../../utill/component/enroll-info/stepper';
import StepText from '../../utill/component/enroll-info/step-text';
import {ButtonContainer} from './select-multi';
import {fontPercentage, heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
export default function EnrollTravelTitle({navigation}: any) {
	const dispatch = useAppDispatch();
	const [textValue, setTextValue] = useState('신나는 여행');
	const {makeMode} = useAppSelector(state => state.travelSlice);
	const changeTextValue = (e: string) => {
		setTextValue(e);
	};
	const goNext = () => {
		dispatch(travelSliceActions.enrollTravelName(textValue));
		makeMode == 'solo' ? navigation.navigate('Timetable') : navigation.navigate('SelectCity');
	};
	const [onFocus, setOnFocus] = useState(false);
	return (
		<BackgroundGray>
			<Stepper total={11} now={1}></Stepper>
			<StepText
				marginTop={heightPercentage(10)}
				styleText='새 여행'
				mainText='여행 이름을 입력해주세요.'></StepText>
			<TouchableWithoutFeedback
				onPress={() => {
					Keyboard.dismiss();
				}}>
				<InputContainer>
					<InputAllContainter>
						<TravelTitleTextInput
							style={{color: 'black'}}
							placeholder={!onFocus ? '신나는 여행' : ''}
							placeholderTextColor={'grey'}
							maxLength={20}
							onFocus={() => setOnFocus(true)}
							value={textValue}
							onBlur={() => setOnFocus(false)}
							onChangeText={(value: string) => changeTextValue(value)}></TravelTitleTextInput>
						{textValue && (
							<ClearTouchableOpacity
								onPress={() => {
									changeTextValue('');
								}}>
								<SvgCancel width={widthPercentage(20)} height={widthPercentage(20)} color='black' />
							</ClearTouchableOpacity>
						)}
					</InputAllContainter>
				</InputContainer>
			</TouchableWithoutFeedback>
			<ButtonContainer>
				<CustomButton
					marginBottom={12}
					isDisabled={textValue == '' || textValue.startsWith(' ')}
					label='다음'
					onPress={goNext}
				/>
			</ButtonContainer>
		</BackgroundGray>
	);
}
const InputAllContainter = styled(InputWrap)`
	border-color: ${colors.backgroundWhite};
	background-color: ${colors.backgroundWhite};
	height: ${heightPercentage(52)}px;
	padding: 0px 0px 0px ${widthPercentage(10)}px;
`;

const TravelTitleTextInput = styled.TextInput`
	font-family: PretendardVariable;
	font-size: ${fontPercentage(14)}px;
	line-height: ${heightPercentage(21)}px;
	flex: 1;
`;
const InputContainer = styled.View`
	width: 100%;
	align-self: center;
`;
