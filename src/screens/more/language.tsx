import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import {BackgroundGray, PretendardVariableText} from '../../utill/layout/layout';
import {widthPercentage} from '../../utill/layout/responsive-size';
import i18n from '../../i18n/i18n';
import {useAppDispatch, useAppSelector} from '../../redux';
import {changeLanguage} from '../../redux/setting/settingSlice';
export default function Language({navigation}: any) {
	const {appLanguages} = useAppSelector(state => state.settingSlice);
	const dispatch = useAppDispatch();
	return (
		<BackgroundGray>
			<ElementContainer
				select={appLanguages == 'ko-KR'}
				onPress={() => {
					dispatch(changeLanguage('ko-KR'));
					i18n.changeLanguage('ko-KR');
				}}>
				<PretendardVariableText selectable size={14} lineHeight={21} color={colors.Black} textAlign='left'>
					한국어
				</PretendardVariableText>
			</ElementContainer>
			<ElementContainer
				select={appLanguages == 'en-US'}
				onPress={() => {
					dispatch(changeLanguage('en-US'));
					i18n.changeLanguage('en-US');
				}}>
				<PretendardVariableText selectable size={14} lineHeight={21} color={colors.Black} textAlign='left'>
					english
				</PretendardVariableText>
			</ElementContainer>
		</BackgroundGray>
	);
}
const ElementContainer = styled.TouchableOpacity<{select: boolean}>`
	width: 100%;
	border-bottom-width: 1px;
	padding: ${widthPercentage(10)}px ${widthPercentage(30)}px;
	border-bottom-color: ${colors.Gray1};
	background-color: ${props => (props.select ? colors.Primary : colors.backgroundWhite)};
`;
