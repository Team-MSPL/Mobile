import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './translations/en.json';
import ko from './translations/ko.json';
const resources = {
	en: {
		translation: en,
	},
	ko: {
		translation: ko,
	},
};

i18n.use(initReactI18next).init({
	compatibilityJSON: 'v3',
	resources: resources,
	// 초기 설정 언어
	lng: 'ko-KR',
	fallbackLng: {
		default: ['ko-KR'],
		'en-US': ['en-US'],
	},
	debug: true,
	defaultNS: 'translation',
	ns: 'translation',
	keySeparator: false,
	interpolation: {
		escapeValue: false,
	},
	react: {
		useSuspense: false,
	},
});

export default i18n;
