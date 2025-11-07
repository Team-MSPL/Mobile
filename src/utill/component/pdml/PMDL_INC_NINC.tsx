import React from 'react';
import ModuleShell from './ModuleShell';
import {View} from 'react-native';
import {PretendardSemiBoldText} from '../../layout/layout';
import {colors} from '../../colors';

export default function PMDL_INC_NINC({moduleKey, moduleData}: {moduleKey: string; moduleData: any}) {
	const content = moduleData?.content ?? moduleData;
	const props = content?.properties ?? {};
	const includeList = props?.include_item?.list ?? [];
	const notIncludeList = props?.not_include_item?.list ?? [];

	return (
		<ModuleShell title={moduleData?.module_title ?? moduleKey}>
			<View style={{marginTop: 8, flexDirection: 'row', justifyContent: 'space-between'}}>
				<View style={{flex: 1, paddingRight: 12}}>
					{includeList.map((it: any, i: number) => (
						<View key={i} style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12}}>
							{/* <Icon name="icon-check" size={24} color={colors.teal500 ?? colors.blue500} /> */}
							<PretendardSemiBoldText size={18} lineHeight={22} color={colors.Black}>
								{it?.desc ?? ''}
							</PretendardSemiBoldText>
						</View>
					))}
				</View>
				<View style={{flex: 1, paddingLeft: 12}}>
					{notIncludeList.map((it: any, i: number) => (
						<View key={i} style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12}}>
							{/* <Icon name="icon-x" size={24} color={colors.grey500} /> */}
							<PretendardSemiBoldText size={18} lineHeight={22} color={colors.Black}>
								{it?.desc ?? ''}
							</PretendardSemiBoldText>
						</View>
					))}
				</View>
			</View>
		</ModuleShell>
	);
}
