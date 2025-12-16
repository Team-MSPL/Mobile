import React from 'react';
import {View} from 'react-native';
import {PretendardSemiBoldText} from '../../layout/layout';
import {colors} from '../../colors';
export default function ModuleShell({title, children}: {title: string; children?: React.ReactNode}) {
	return (
		<View style={{paddingHorizontal: 20, marginBottom: 24}}>
			<View style={{flexDirection: 'row', gap: 12, marginBottom: 10, alignItems: 'center'}}>
				<View style={{width: 4, height: 29, backgroundColor: colors.Green2, borderRadius: 100}} />
				<PretendardSemiBoldText size={18} lineHeight={22} color={colors.Black}>
					{title}
				</PretendardSemiBoldText>
			</View>
			<View>{children}</View>
		</View>
	);
}
