import {Text} from 'native-base';
import {TouchableOpacity} from 'react-native';

export default function SelectButton({label, onPress, isDisabled, bgColor}: CustomButtonProps) {
	return (
		<TouchableOpacity
			onPress={onPress}
			style={{
				backgroundColor: bgColor ? 'yellow' : 'white',
				borderRadius: 99,
				borderWidth: 1,
				marginVertical: 4,
				width: 100,
				height: 50,
				alignItems: 'center',
				justifyContent: 'center',
				marginHorizontal: 5,
			}}
			disabled={isDisabled}>
			<Text color='black' bold>
				{label}
			</Text>
		</TouchableOpacity>
	);
}

type CustomButtonProps = {
	label: string;
	onPress: () => void;
	isDisabled?: boolean;
	bgColor?: boolean;
};
