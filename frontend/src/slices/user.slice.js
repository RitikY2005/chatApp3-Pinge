import {create} from 'zustand';
import {persist} from 'zustand/middleware';


const createExpiringStorage=(expiresInDays)=>{
   const milliseconds= expiresInDays *24 * 60 *60 * 1000;
   return {
     getItem:(name)=>{
        const item= localStorage.getItem(name);
        if(!item) return null;

        const {value,timestamp}= JSON.parse(item);

        if(Date.now()-timestamp > milliseconds){
        	localStorage.removeItem(name);
        	return null;
        }

        return value;
     },
     setItem:(name,value)=>{
     	const item= JSON.stringify({value,timestamp:Date.now()});
     	localStorage.setItem(name,item);
     },
     removeItem:(name)=>{
     	localStorage.removeItem(name);
     }
   };
}

const useAppStore= create(
	persist(
		(set,get)=>({
			userInfo:undefined,
			isLoggedIn:undefined,
			setUserInfo:(userInfo)=> set({userInfo}),
			setIsLoggedIn:(isLoggedIn)=>set({isLoggedIn})
		}),
		{
			name:'chatApp3St',
			storage:createExpiringStorage(3)
		}
	   )
	);

export default useAppStore;