import {getStorage, ref, getDownloadURL, uploadBytes} from 'firebase/storage';
import {storage, firebase} from '../../../config';
import {useUriToBlob} from './useUriToBlob';
const useFirebaseStorage = () => {
	const firebaseImageRemove = async (e: {pictureList: string[]; id: string; category: string}) => {
		const removeData = e.pictureList.map(async (item, idx) => {
			await firebase
				.storage()
				.ref(e.category)
				.child(`${e.id}/${e.category == 'profile' ? '' : idx}${e.category}.png`)
				.delete();
		});
		try {
			await Promise.all(removeData);
		} catch (error: any) {
			throw error;
		}
	};

	const uploadImage = async (e: {item: string; idx: number; id: string; category: string}) => {
		const response = await useUriToBlob(e.item);
		var ref = firebase.storage().ref(e.category).child(`${e.id}/${e.idx}${e.category}.png`).put(response);
		console.log('여기는용?', e.idx);
		try {
			await ref;
			let copy = await getImage({index: e.idx, id: e.id, category: e.category});
			return copy;
		} catch (e) {
			console.log(e);
		}
	};
	const getImage = async (data: {index: number; id: string; category: string}) => {
		console.log('순서입니다.', data.index);
		const storage = getStorage();
		const reference = ref(storage, `${data.category}/${data.id}/${data.index}${data.category}.png`);
		let downloadUrl = '';
		await getDownloadURL(reference).then(x => {
			downloadUrl = x;
		});
		return downloadUrl;
	};

	return {firebaseImageRemove, uploadImage};
};
export default useFirebaseStorage;
