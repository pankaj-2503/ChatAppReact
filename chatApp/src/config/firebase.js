// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { createUserWithEmailAndPassword,getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc,setDoc,getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { collapseToast, toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyC5yaO5Uc7984uPg5gcLiJeQQuhAPRXqqc",
  authDomain: "chat-app-ded24.firebaseapp.com",
  projectId: "chat-app-ded24",
  storageBucket: "chat-app-ded24.appspot.com",
  messagingSenderId: "989624660494",
  appId: "1:989624660494:web:05d3407382b03678af025f",
  measurementId: "G-K07F2G3S2C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth=getAuth(app);
const db=getFirestore(app);

const signup= async(username,email,password)=>{
    try{
        const res=await createUserWithEmailAndPassword(auth,email,password);
        const user=res.user;
        await setDoc(doc(db,"users",user.uid),{
          id:user.uid,
          username:username.toLowerCase(),
          email,
          name:"",
          avatar:"",
          bio:"Hey , there i am using chat app",
          lastSeen:Date.now()
        })
        await setDoc(doc(db,"chats",user.uid),{
          chatsData:[]
        })
    }catch(error){
      console.log(error);
      toast.error(error.code.split('/')[1].split('-').join(' '));
    }
}
const signin = async(email,password)=>{
  try{
    await signInWithEmailAndPassword(auth,email,password);
  }catch(error){
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(' '));
  }
}
const logout = async()=>{
  try{
    await signOut(auth);
  }catch(error){
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(' '));
  }
}

const resetPass = async(email)=>{
  if(!email){
    toast.error("Enter your email");
    return null;
  }
  try {
    const userRef= collection(db,'users');
    const q=query(userRef,where("email","==",email));
    const querySnap=await getDocs(q);
    if(!querySnap.empty){
      await sendPasswordResetEmail(auth,email);
      toast.success("Reset Email Sent")
    }else{
      toast.error("Email doesn't exist");
    }
  } catch (error) {
      toast.error(toast.message);
  }
}


export {signup,signin,logout,auth,db,resetPass};