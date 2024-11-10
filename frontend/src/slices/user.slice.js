import {create} from 'zustand';

const useAppStore= create((set,get)=>({
	userInfo:[],
	setUserInfo:(userInfo)=> set({userInfo:userInfo})
}));

export default useAppStore;