import {Text} from 'native-base';
import {TouchableOpacity} from 'react-native';

export default function CustomButton({label, onPress, isDisabled}: CustomButtonProps) {
	return (
		<TouchableOpacity
			onPress={onPress}
			style={{
				backgroundColor: '#ABD9FF',
				borderRadius: 10,
				width: '100%',
				height: 50,
				justifyContent: 'center',
				alignItems: 'center',
				marginVertical: 10,
				opacity: isDisabled ? 0.5 : 1,
			}}
			disabled={isDisabled}>
			<Text color='white' bold>
				{label}
			</Text>
		</TouchableOpacity>
	);
}

type CustomButtonProps = {
	label: string;
	onPress: () => void;
	isDisabled?: boolean;
};
