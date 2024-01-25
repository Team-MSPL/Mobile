import {GOOGLE_API_KEY, KAKAO_REST_API_KEY, NAVER_API_KEY, NAVER_API_KEY_id, Tour_API_KEY} from '@env';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import moment, {Moment} from 'moment';
import shortId from 'shortid';
import {tendencyList} from '../../screens/enroll-info/select-tendency';
import axiosAuth from '../api/api';
const initialState: LiteState = {
	region: [], //선택한 지역들 리스트 ex) 김해시,창원시
	cityIndex: 0, //지역이름 ex)경남
	day: [], //타임테이블 용날짜 리스트
	nDay: 0, // 몇박인지 5박6일이면 5
	Place: {
		name: '',
		lat: 0,
		lng: 0,
		category: 4,
		takenTime: 30,
		photo: '',
		formatted_address: '',
	}, //숙소, 필수여행지 구글검색했을때 정보 저장하는용
	accommodations: [], // 숙소리스트
	essentialPlaces: [], //필수여행지 리스트
	distance: 5, //여행반경
	transit: 0, //교통수단 0= 자차 1=대중교통
	tendency: tendencyList.map(item => {
		return Array(item.list.length).fill(0);
	}), //성향
	timeLimitArray: [9, 20], //시작시간과 끝시간
	minuteLimitArray: [0, 0], //시작시간 분과 끝분
	season: [0, 0, 0, 0], //계절
	presetDatas: [[[]]], //프리셋 저장하는곳
	timetable: [[]], // 타임테이블
	moveTimeList: [], // 이동시간
	courseDetail: {name: '', rating: 0, editorial_summary: {overview: '', language: ''}, photos: [], reviews: []}, //관광지 정보볼때쓰는거
	editMode: '', // 삭제모드=delete, 추가모드=add
	makeMode: 'solo', //true=추천모드, fasle==혼자짤래요    추천,혼자,수정,친구 recommend, solo, modify,share
	//----------------------------------------------------
	myTravelList: [],
	travelId: '',
	postList: [],
	diary: '',
	picture: [],
	reviewCheck: false,
	tableShowFlag: false,
	selectStartDate: moment().startOf('day').add(12, 'hours'),
	selectEndDate: null,
	travelName: '',
	regionRecommendFlag: false,
	bandwidth: false,
	saveFlag: false,
	checKStep: 0,
	freeTicket: false,
	cityDistance: [],
	modifyCheck: false,
	presetTendencyList: [],
	moveTimeErrorIndex: 0,
	shareLoginFlag: false,
	shareViewWithStartFlag: false,
};

export const axiosGoogle = axios.create({
	baseURL: 'https://maps.googleapis.com/maps/api',
	headers: {'content-type': 'application/json'},
});
export const axiosKakao = axios.create({
	baseURL: 'https://dapi.kakao.com/v2/local/search',
	headers: {
		'content-type': 'application/json',
		Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
	},
});
export const axiosNaver = axios.create({
	baseURL: 'https://naveropenapi.apigw.ntruss.com',
	headers: {
		'X-NCP-APIGW-API-KEY-ID': NAVER_API_KEY_id,
		'X-NCP-APIGW-API-KEY': NAVER_API_KEY,
	},
});
export const axiosTour = axios.create({
	baseURL: 'https://apis.data.go.kr/B551011/KorService1',

	headers: {'content-type': 'application/json'},
});

//-------------------------------------------------------------
//내 여행 목록 가져오는거
export const getMyTravelList = createAsyncThunk('/getMyTravelList', async (data, thunkAPI) => {
	try {
		const response = await axiosAuth.get(`/travelCourse/travelList?userId=${thunkAPI.getState().userSlice.userId}`);
		return response.data.travelCourseList;
	} catch (error: any) {
		throw thunkAPI.rejectWithValue(error.code);
	}
});
//여행 코스 하나 가져오기
export const getOneTravelCourse = createAsyncThunk(
	'/getOneTravelCourse',
	async (data: {travelId: string}, {rejectWithValue}) => {
		try {
			const response = await axiosAuth.get(`/travelCourse/getOneTravelCourse?travelId=${data.travelId}`);
			return response.data;
		} catch (error: any) {
			throw rejectWithValue(error.code);
		}
	},
);
//코스 수정하기
export const updateTravelCourse = createAsyncThunk(
	'/updateTravelCourse',
	async (data: updateTravelCourseType, {rejectWithValue}) => {
		try {
			const response = await axiosAuth.patch(`/travelCourse/updateTravelCourse`, data);
			return response.data;
		} catch (error: any) {
			throw rejectWithValue(error.code);
		}
	},
);

//코스 삭제하기
export const deleteTravelCourse = createAsyncThunk(
	'/deleteTravelCourse',
	async (data: {travelId: string}, {rejectWithValue}) => {
		try {
			const response = await axiosAuth.delete(`/travelCourse/deleteTravelCourse`, {data});
			return response.data;
		} catch (error: any) {
			throw rejectWithValue(error.code);
		}
	},
);
//여행일기 저장,수정
export const updateDiary = createAsyncThunk(
	'/updateDiary',
	async (data: {travelId: string; diary: string; picture: string[]}, {rejectWithValue}) => {
		try {
			const response = await axiosAuth.patch(`/travelCourse/updateDiary`, data);
			return response;
		} catch (error: any) {
			throw rejectWithValue(error.code);
		}
	},
);

//여행 리뷰, 별점 저장
export const reviewAndPoint = createAsyncThunk(
	'/reviewAndPoint',
	async (data: reviewAndPointType, {rejectWithValue}) => {
		try {
			const response = await axiosAuth.post(`manageTravel/reviewAndPoint`, data);
			return response.data;
		} catch (error: any) {
			throw rejectWithValue(error.code);
		}
	},
);
//-------------------------------------------------------------

//여행 코스 추천 ai
export const getTravelAi = createAsyncThunk('/getTravelAi', async (data: travelAiType, {rejectWithValue}) => {
	try {
		const response = await axiosAuth.post(`/ai/run`, data, {timeout: 60000});
		return response.data;
	} catch (error: any) {
		throw rejectWithValue(error.code);
	}
});
//여행 코스 저장
export const saveTravel = createAsyncThunk('/saveTravel', async (data: SaveTravelType, {rejectWithValue}) => {
	try {
		const response = await axiosAuth.post(`/travelCourse/saveTravelCourse`, data);
		return response.data;
	} catch (error: any) {
		throw rejectWithValue(error.code);
	}
});
//교통 시간 구하는 거
export const getDrivingDuration = createAsyncThunk(
	'/getDrivingDuration',
	async (data: {start: string; goal: string; wayPoint: string}, {rejectWithValue}) => {
		try {
			const response = await axiosNaver.get(
				`/map-direction/v1/driving?start=${data.start}&goal=${data.goal}${
					data.wayPoint && `&waypoints=${data.wayPoint}`
				}&option=trafast`,
			);
			return response.data.route.trafast[0].summary;
		} catch (error: any) {
			throw rejectWithValue(error.code);
		}
	},
);

//장소 정보 얻어오는거
export const googleDetailApi = createAsyncThunk('/googleDetailApi', async (data: any, {rejectWithValue}) => {
	try {
		const response = await axiosGoogle.get(
			`/place/details/json?place_id=${data.placeId}&fields=photos%2Cname%2Crating%2Creviews%2Ceditorial_summary&language=ko&key=${GOOGLE_API_KEY}`,
		);
		//제로리절트 처리하기
		return response.data;
	} catch (error: any) {
		throw rejectWithValue(error.code);
	}
});

// 탐테에서 눌렀을때 검색이 아니라 이름으로 장소 찾는 거
export const googleKeywordApi = createAsyncThunk('/googleKeywordApi', async (data: any, {rejectWithValue}) => {
	try {
		const response = await axiosGoogle.get(
			`/place/textsearch/json?location=${data.lng}%2C${data.lat}&query=${data.name}&language=ko&radius=10000&key=${GOOGLE_API_KEY}`,
		);
		const a = await axiosGoogle.get(
			`/place/details/json?place_id=${response.data.results[0].place_id}&fields=photos%2Cname%2Crating%2Cformatted_address%2Creviews%2Cformatted_phone_number%2Copening_hours%2Ceditorial_summary&language=ko&key=${GOOGLE_API_KEY}`,
		);
		//console.log(a);
		//제로리절트 처리하기
		return a.data.result;
	} catch (error: any) {
		console.log(error);
		throw rejectWithValue(error.code);
	}
});

//탐테에서 눌렀을때 관광지정보 가져오기 서버 연결버전
export const getPlaceInfo = createAsyncThunk('/place/placeInfo', async (data: any, {rejectWithValue}) => {
	try {
		console.log('빠졌어', data);
		const response = await axiosAuth.get(
			`/place/placeInfo?region=${data.region}&name=${data.name}&lat=${data.lat}&lng=${data.lng}`,
		);
		return response;
	} catch (error: any) {
		throw rejectWithValue(error.code);
	}
});

//카카오 식당,카페 등 추천 장소 얻는 거
export const recommendApi = createAsyncThunk('/recommendApi', async (data: any, {rejectWithValue}) => {
	try {
		const response = await axiosKakao.get(
			`/category.json?category_group_code=${data.category}&x=${data.lng}&y=${data.lat}&radius=${data.radius}&sort=distance`,
		);
		console.log(response.data.documents);
		// console.log(response.data.documents);

		//제로리절트 처리하기
		return response.data.documents;
	} catch (error: any) {
		throw rejectWithValue(error.code);
	}
});

//여행코스 제목 수정
export const reCourseName = createAsyncThunk(
	'/travelCourse/updateTravelCourseName',
	async (data: {travelId: string; updateTravelName: string}, {rejectWithValue}) => {
		try {
			const response = await axiosAuth.patch(`/travelCourse/updateTravelCourseName`, data);
			return response.data;
		} catch (error: any) {
			throw rejectWithValue(error.code);
		}
	},
);

//투어 api 정보가져오기
export const getTourTest = createAsyncThunk('/getTourTest', async (data: any, {rejectWithValue}) => {
	try {
		const response = await axiosTour.get(
			`/locationBasedList1?MobileOS=${data.platform}&MobileApp=다님&mapX=${data.lng}&mapY=${data.lat}&radius=20000&numOfRows=1&_type=json&serviceKey=${Tour_API_KEY}`,
		);
		let params = response.data.response.body.items.item[0];
		const responseData = await axiosTour.get(
			`/detailInfo1?MobileOS=${data.platform}&MobileApp=다님&contentId=${params.contentid}&contentTypeId=${params.contenttypeid}&_type=json&serviceKey=${Tour_API_KEY}`,
		);
		//console.log('하위요', responseData.data.response.body.items.item);
		return responseData.data.response.body.items.item;
	} catch (error: any) {
		throw rejectWithValue(error.code);
	}
});

//관광지 리뷰 등록
export const savePlaceReview = createAsyncThunk(
	'/place/savePlaceReview',
	async (
		data: {region: any; name: any; reviewContent: string; reviewUserToken: string; reviewPhotoList: never[]},
		{rejectWithValue},
	) => {
		try {
			const response = await axiosAuth.patch(`/place/savePlaceReview`, data);
			return response.data;
		} catch (error: any) {
			throw rejectWithValue(error.code);
		}
	},
);
//관광지 리뷰 삭제
export const deletePlaceReview = createAsyncThunk(
	'/place/deletePlaceReview',
	async (
		data: {region: any; name: any; reviewContent: string; reviewUserToken: string; reviewPhotoList: never[]},
		{rejectWithValue},
	) => {
		try {
			const response = await axiosAuth.patch(`/place/deletePlaceReview`, data);
			return response.data;
		} catch (error: any) {
			throw rejectWithValue(error.code);
		}
	},
);

export const updateShareUserList = createAsyncThunk(
	'/travelCourse/updateSharedUserList',
	async (data: {travelId: string}, {rejectWithValue}) => {
		try {
			const response = await axiosAuth.patch('/travelCourse/updateSharedUserList', data);
			return response.status;
		} catch (error: any) {
			throw rejectWithValue(error.code);
		}
	},
);
export const travelSlice = createSlice({
	name: 'travel',
	initialState,
	reducers: {
		reset: state => {
			Object.assign(state, initialState);
		},
		selectRegion: (state, {payload}) => {
			state.region = payload;
		},
		firstSelectRegion: (state, {payload}) => {
			state.region = payload.region;
			state.cityDistance = payload.cityDistance;
		},
		enrollCityIndex: (state, {payload}) => {
			state.cityIndex = payload;
		},

		setNDay: (state, {payload}) => {
			state.nDay = payload;
		},
		selectPopularity: (state, {payload}) => {
			state.cityIndex = payload.cityIndex;
			state.region = payload.region;
			state.cityDistance = payload.cityDistance;
		},
		enrollPlace: (state, {payload}) => {
			state.Place = payload;
		},
		enrollAccommodations: (state, {payload}) => {
			state.accommodations = payload;
		},
		enrollessentialPlaces: (state, {payload}) => {
			state.essentialPlaces = payload;
		},
		enrollDistance: (state, {payload}) => {
			state.distance = payload;
		},
		enrollTransit: (state, {payload}) => {
			state.transit = payload;
		},
		enrollTendency: (state, {payload}) => {
			state.tendency = payload;
		},
		enrollTimeLimitArray: (state, {payload}) => {
			state.timeLimitArray = payload;
		},
		enrollMinuteLimitArray: (state, {payload}) => {
			state.minuteLimitArray = payload;
		},
		setTimeAndMinute: (state, {payload}) => {
			state.timeLimitArray = payload.time;
			state.minuteLimitArray = payload.minute;
		},
		enrollPoplurarityRegion: (state, {payload}) => {
			state.region = payload.region;
			state.cityIndex = payload.cityIndex;
		},
		changeChecKStep: (state, {payload}) => {
			state.checKStep = payload;
		},
		setTravelStart: (state, {payload}) => {
			Object.assign(state, initialState);
			state.makeMode = payload.makeMode;
			//state.tableShowFlag = true;
			state.editMode = '';
			state.season = payload.season;
			state.freeTicket = false;
		},
		setPopuarityClickStart: (state, {payload}) => {
			Object.assign(state, initialState);
			state.makeMode = payload.makeMode;
			//state.tableShowFlag = true;
			state.editMode = '';
			state.season = payload.season;
			state.cityIndex = payload.cityIndex;
			state.region = payload.region;
			state.freeTicket = false;
			state.cityDistance = payload.cityDistance;
		},
		enrollTravelName: (state, {payload}) => {
			state.travelName = payload;
		},
		enrollSelectStartDate: (state, {payload}) => {
			state.selectStartDate = payload;
		},
		enrollSelectEndDate: (state, {payload}) => {
			state.selectEndDate = payload;
		},
		enrollFirstSetting: (state, {payload}) => {
			state.day = payload.day;
			state.accommodations = payload.accommodations;
		},
		enrollDayInfo: (state, {payload}) => {
			state.day = payload.day;
			state.nDay = payload.nDay;
			state.accommodations = payload.accommodations;
			state.season = payload.season;
		},
		enrollPreset: (state, {payload}) => {
			state.presetDatas = payload;
		},
		setCache: (state, {payload}) => {
			state.presetDatas = payload.presetDatas;
			state.presetTendencyList = payload.presetTendency;
			state.makeMode = 'recommend';
			state.editMode = '';
			state.freeTicket = false;
			state.day = payload.day;
			state.nDay = payload.nDay;
			state.transit = payload.transit;
			state.tendency = payload.tendency;
			state.travelName = payload.travelName;
		},
		enrollTimetable: (state, {payload}) => {
			state.timetable = payload;
			//state.tableShowFlag = true;
		},
		drawTimetable: state => {
			let copy: TimetableType[][] = [...Array(state.timetable.length)].map(() => []);
			console.log('내ㅔ', state.moveTimeList);
			state.timetable.forEach((item, idx) => {
				let time = 6;
				let dinnerTime = [22, 29];
				let lunchTime = [8, 15];
				let lunch = false;
				let dinner = false;
				const updateItem = {
					name: '', //넣을거
					lat: 0,
					lng: 0,
					category: 0, //넣을거
					x: idx,
					y: 0, //넣을거
					id: 0, //넣을거
					takenTime: 0, //넣을거
				};
				item.forEach((value, index) => {
					if (index == 0) {
						if (idx == 0) {
							time = (state.timeLimitArray[0] - 6) * 2 + state.minuteLimitArray[0] / 30;
						} else if (copy[idx - 1].at(-1)?.category == 4) {
							copy[idx].push({...copy[idx - 1].at(-1), y: 0, takenTime: 150, x: idx});
						}
					}
					if (time >= lunchTime[0] && time <= lunchTime[1] && lunch == false) {
						copy[idx].push({
							...updateItem,
							name: '점심 추천',
							y: time,
							takenTime: 60,
							id: shortId.generate(),
							category: 1,
							lat: value.lat,
							lng: value.lng,
							photo: '',
						});
						lunch = true;
						time += 3;
					}
					if (time >= dinnerTime[0] && time <= dinnerTime[1] && dinner == false) {
						copy[idx].push({
							...updateItem,
							name: '저녁 추천',
							y: time,
							takenTime: 60,
							id: shortId.generate(),
							category: 1,
							lat: value.lat,
							lng: value.lng,
							photo: '',
						});
						dinner = true;
						time += 3;
					}
					if (value.category != 4) {
						copy[idx].push({...value, x: idx, y: time, id: shortId.generate()});
						time += value.takenTime / 30;
						let bandwidthTime = state.bandwidth ? 1 : 0;
						index != item.length - 1 &&
							(time += Math.ceil(state.moveTimeList[idx][index] / 1000 / 60 / 30) + bandwidthTime);
					}
					if (index == item.length - 1 && idx != state.timetable.length - 1 && value.category != 4) {
						copy[idx].push({
							...updateItem,
							name: '숙소 추천',
							y: 36,
							//y: time < 36 ? 36 : time,
							takenTime: time < 36 ? 360 : (48 - time) * 30,
							id: shortId.generate(),
							category: 4,
							lat: value.lat,
							lng: value.lng,
							photo: '',
						});
					} else if (value.category == 4 && index == item.length - 1) {
						//copy[idx].pop();
						copy[idx].push({
							...value,
							y: 36,
							//y: time < 36 ? 36 : time,
							takenTime: time < 36 ? 360 : (48 - time) * 30,
							id: shortId.generate(),
							category: 4,
							lat: value.lat,
							lng: value.lng,
							photo: '',
						});
					}
				});
			});

			state.saveFlag = true;
			state.timetable = copy;
			state.tableShowFlag = true;
		},
		editModeChange: (state, {payload}) => {
			state.editMode = payload;
		},
		changeModify: (state, {payload}) => {
			state.modifyCheck = payload;
		},
		setSaveFlag: (state, {payload}) => {
			state.saveFlag = payload;
		},
		changeTimetable: (state, {payload}) => {
			state.timetable = payload;
			state.editMode = '';
			state.modifyCheck = true;
		},
		setMakeMode: (state, {payload}) => {
			state.makeMode = payload.makeMode;
			state.tableShowFlag = true;
			state.editMode = '';
			state.modifyCheck = false;
			state.shareViewWithStartFlag = payload.shareViewWithStartFlag;
		},
		setSingleMode: state => {
			Object.assign(state, initialState);
			state.timetable = [...Array(5)].map(item => []);
			state.day = [...Array(5)].map((item, idx) => moment().add(idx, 'day'));
			state.nDay = 4;
			state.makeMode = 'solo';
			state.tableShowFlag = true;
		},
		setRecommendRegion: (state, {payload}) => {
			Object.assign(state, initialState);
			state.cityIndex = payload.cityIndex;
			state.region = payload.region;
			state.makeMode = 'recommend';
			state.regionRecommendFlag = true;
			state.tableShowFlag = true;
			state.editMode = '';
			state.season = payload.season;
			state.selectEndDate = payload.selectEndDate;
			state.tendency = payload.tendency;
			state.freeTicket = true;
			state.cityDistance = payload.cityDistance;
		},
		pushMoveTimeList: state => {
			state.moveTimeList.push([]);
		},
		pushCatchMoveTimeList: (state, {payload}) => {
			state.moveTimeList.push([10800000, 10800000, 10800000, 10800000, 10800000]);
			state.moveTimeErrorIndex = payload;
		},
		checkMoveTimeError: state => {
			state.moveTimeErrorIndex = 0;
		},
		resetMoveTimeList: state => {
			state.moveTimeList = [];
		},
		enrollBandwidth: (state, {payload}) => {
			state.bandwidth = payload;
		},
		setInclueRecommend: (state, {payload}) => {
			Object.assign(state, initialState);
			state.cityIndex = payload.cityIndex;
			state.region = payload.region;
			state.makeMode = 'recommend';
			state.tableShowFlag = true;
			state.editMode = '';
			state.cityDistance = payload.cityDistance;
			state.essentialPlaces = [payload.essential];
			state.season = payload.season;
		},
		setShareLoginFlag: (state, {payload}) => {
			state.shareLoginFlag = payload;
		},
		setMyTravelList: (state, {payload}) => {
			state.myTravelList = payload;
		},
	},
	extraReducers: builder => {
		builder.addCase(getDrivingDuration.fulfilled, (state, {payload}) => {
			let list: number[] = [];
			if (payload == undefined) {
				list.push(30);
			} else {
				payload?.waypoints &&
					((list = payload.waypoints.map(item => (state.transit == 0 ? item.duration : item.duration * 1.5))),
					list.push(state.transit == 0 ? payload?.goal?.duration : payload?.goal?.duration * 1.5));
				list.push(state.transit == 0 ? payload.duration : payload.duration * 1.5);
			}
			state.moveTimeList.push(list);
		});
		builder.addCase(googleKeywordApi.fulfilled, (state, {payload}) => {
			state.courseDetail = payload;
		});
		builder.addCase(getTravelAi.fulfilled, (state, {payload}) => {
			state.presetTendencyList = payload.data.bestPointList;
			state.presetDatas = payload.data.resultData;
		});
		builder.addCase(getMyTravelList.fulfilled, (state, {payload}) => {
			state.myTravelList = payload;
		});
		builder.addCase(getOneTravelCourse.fulfilled, (state, {payload}) => {
			state.day = payload.day;
			state.nDay = payload.nDay - 1;
			state.region = payload.region;
			state.timetable = payload.timetable;
			state.transit = payload.transit;
			state.tendency = payload.tendency;
			state.travelId = payload._id;
			state.diary = payload.diary;
			state.picture = payload.picture;
			state.reviewCheck = payload.reviewCheck;
			state.travelName = payload.travelName;
			//state.myTravelList = payload;
		});
		builder.addCase(updateDiary.fulfilled, (state, {payload}) => {
			state.diary = payload.diary;
			state.picture = payload.picture;
			//state.myTravelList = payload;
		});
		builder.addCase(saveTravel.fulfilled, (state, {payload}) => {
			state.travelId = payload.travelId;
			//state.myTravelList = payload;
		});
	},
});

export const travelSliceActions = travelSlice.actions;
export default travelSlice.reducer;

interface LiteState {
	region: string[];
	cityIndex: number;
	day: Moment[];
	nDay: number;
	Place: PlaceType;
	accommodations: PlaceType[];
	essentialPlaces: EssentialPlaceType[];
	distance: number;
	transit: number;
	tendency: number[][];
	timeLimitArray: number[];
	minuteLimitArray: number[];
	season: number[];
	presetDatas: TimetableType[][][];
	timetable: TimetableType[][];
	moveTimeList: number[][] | [];
	courseDetail: CourseDetailType;
	editMode: string;
	makeMode: MakeModeType;
	//----------------------------------------
	myTravelList: myTravelListType[];
	travelId: string;
	postList: postListType[];
	diary: string;
	picture: string[];
	reviewCheck: boolean;
	tableShowFlag: boolean;
	selectStartDate: Moment;
	selectEndDate: Moment | null;
	travelName: string;
	regionRecommendFlag: boolean;
	bandwidth: boolean;
	saveFlag: boolean;
	checKStep: number;
	freeTicket: boolean;
	cityDistance: number[];
	modifyCheck: boolean;
	presetTendencyList: presetTendencyListType[];
	moveTimeErrorIndex: number;
	shareLoginFlag: boolean;
	shareViewWithStartFlag: boolean;
}
export interface presetTendencyListType {
	tendencyNameList: string[];
	tendencyPointList: number[];
	tendencyRanking: number[];
}

type MakeModeType = 'recommend' | 'solo' | 'modify' | 'share';
export interface PlaceType {
	name: string | undefined;
	lat: number | undefined;
	lng: number | undefined;
	category: number;
	takenTime: number;
	photo: string;
	formatted_address: string | undefined;
}

export interface EssentialPlaceType {
	day: number;
	name: string;
	lat: number;
	lng: number;
	category: number;
	takenTime: number;
	id: string;
	photo: string;
}
export interface TimetableType {
	category: number;
	lat: number;
	lng: number;
	name: string;
	takenTime: number;
	x?: number;
	y?: number;
	id?: string;
	photo: string;
	partner: number[];
	play: number[];
	concept: number[];
	tour: number[];
	regionIndex: number;
}

export interface CourseDetailType {
	name: string;
	rating: number;
	reviews: Reviews[];
	photos: Photos[];
	formatted_phone_number: string;
	opening_hours: OpeninHoursType;
	formatted_address: string;
}
export interface OpeninHoursType {
	open_now: boolean;
	weekday_text: string[];
}
export interface SaveTravelType {
	userId: string;
	region: string[];
	day: Moment[];
	nDay: number;
	transit: number;
	tendency: number[][];
	timetable: TimetableType[][];
	travelName: string;
}
interface Reviews {
	author_name: string;
	author_url: string;
	language: string;
	original_language: string;
	profile_photo_url: string;
	rating: number;
	relative_time_description: string;
	text: string;
	time: number;
	translated: boolean;
}

interface Photos {
	height: number;
	html_attributions: string;
	photo_reference: string;
	width: number;
}

export interface RecommendList {
	address_name: string;
	category_group_code: string;
	category_group_name: string;
	category_name: string;
	distance: number;
	id: number;
	phone: string;
	place_name: string;
	place_url: string;
	road_address_name: string;
	x: number;
	y: number;
}

interface travelAiType {
	regionList: string[];
	accomodationList: PlaceType[];
	selectList: number[][];
	essentialPlaceList: EssentialPlaceType[];
	timeLimitArray: number[];
	nDay: number;
	transit: number;
	distanceSensitivity: number;
	bandwidth: boolean;
	freeTicket: boolean;
}

interface myTravelListType {
	_id: string;
	region: string[];
	day: Moment[];
	nDay: number;
	travelName: string;
}

interface updateTravelCourseType {
	travelId: string;
	timetable: TimetableType[][];
}

interface postListType {
	postId: string;
	postTitle: string;
	postWriter: string;
	postedAt: string;
	likerLength: string;
	commentLength: string;
}

interface reviewAndPointType {
	travelId: string;
	review: string;
	point: number;
	tendencyPoint: number[][];
}

export interface courseInfoType {
	status: string;
	name: string;
	openInfo: string[];
	review: InfoReviewType[];
	rating: number | null;
	address: string | null;
	expense: string | null;
	information: string;
	infoTitle: string | null;
	infoContent: string | null;
	photo: string[];
}

interface InfoReviewType {
	name: string;
	content: string;
	rating: number | null;
	reviewUserToken: string | null;
	reviewPhotoList: string | null;
}
