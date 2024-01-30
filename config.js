import firebase from 'firebase/compat/app';
//import 'firebase/compat/auth';
//import 'firebase/compat/firestore';
import 'firebase/compat/storage';

import {initializeApp} from 'firebase/app';
import {getStorage, ref} from 'firebase/storage';

const firebaseConfig = {
	apiKey: 'AIzaSyAVoHWH5XI2Xe4k2Sz_u_M2YXCUwGcgano',
	authDomain: 'danim-3439e.firebaseapp.com',
	projectId: 'danim-3439e',
	storageBucket: 'danim-image',
	messagingSenderId: '70367155908',
	appId: '1:70367155908:web:39c1344d65ecce16141b91',
	measurementId: 'G-VXZTLNFY84',
};

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}

export {firebase};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
