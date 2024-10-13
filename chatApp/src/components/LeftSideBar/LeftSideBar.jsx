import React, { useContext, useEffect, useState } from "react";
import "./LeftSideBar.css";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const LeftSideBar = () => {
  const navigate = useNavigate();
  const { userData, chatData ,chatUser,setChatUser,messagesId,setMessagesId,chatVisible,setChatVisible} = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const addChat = async () => {
    const messageRef = collection(db, "messages");
    const chatRef = collection(db, "chats");
    try {
      const newMessageRef = doc(messageRef);
      await setDoc(newMessageRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      // update messages between 2 users
      await updateDoc(doc(chatRef, user.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: userData.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });


      await updateDoc(doc(chatRef, userData.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: user.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });

      // on search in searchbar it would open the chat 
      const uSnap=await getDoc(doc(db,"users",user.id));
      const uData=uSnap.data();
      setChat({
        messagesId:newMessageRef.id,
        lastMessage:"",
        rId:user.id,
        updatedAt:Date.now(),
        messageSeen:true,
        userData:uData
      })
      setShowSearch(false); 
      setChatVisible(true);

    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const inputHandler = async (e) => {
    try {
      const input = e.target.value;
      if (input) {
        setShowSearch(true);
        const userRef = collection(db, "users");
        const q = query(userRef, where("username", "==", input.toLowerCase()));
        const querySnap = await getDocs(q);
        // filter search user where do not display self user
        console.log(chatData);
        if (!querySnap.empty && querySnap.docs[0].data().id != userData.id) {
          let userExist = false;
          chatData.map((user) => {
            if (user.rId === querySnap.docs[0].data().id) {
              userExist = true;
            }
          });
          if (!userExist) {
            setUser(querySnap.docs[0].data());
          }
        } else {
          setUser(null);
        }
      } else {
        setShowSearch(false);
      }
    } catch (error) {}
  };

  // setting messages between user and friend from leftsidebar
  const setChat=async(item)=>{
    try {
      setMessagesId(item.messageId);
      setChatUser(item);
      const userChatsRef=doc(db,'chats',userData.id);
      const userChatsSnapshot=await getDoc(userChatsRef);
      const userChatsData=userChatsSnapshot.data();
      const chatIndex=userChatsData.chatsData.findIndex((c)=>c.messageId===item.messageId);
      userChatsData.chatsData[chatIndex].messageSeen=true;
      await updateDoc(userChatsRef,{
        chatsData:userChatsData.chatsData
      })
      setChatVisible(true);
    } catch (error) {
      toast.error(error.message);
    }
    
  }

  useEffect(()=>{
    const updateChatUserData= async()=>{
      if(chatUser){
        const userRef= doc(db,"users",chatUser.userData.id);
        const userSnap=await getDoc(userRef);
        const userData=userSnap.data();
        setChatUser(prev=>({...prev,userData:userData}))
      }
    }
    updateChatUserData();
  },[chatData]);

  return (
    <div className={`ls ${chatVisible?"hidden":""}`}>
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} className="logo" alt="2" />
          <div className="menu">
            <img src={assets.menu_icon} alt="3" />
            <div className="sub-menu">
              <p onClick={() => navigate("/profile")}>Edit Profile</p>
              <hr />
              <p>Logout</p>
            </div>
          </div>
        </div>
        <div className="ls-search">
          <img src={assets.search_icon} alt="3" />
          <input
            onChange={inputHandler}
            type="text"
            placeholder="Search here..."
          />
        </div>
      </div>
      <div className="ls-list">
        {showSearch && user ? (
          <div onClick={addChat} className="friends add-user">
            <img src={user.avatar} alt="" />
            <p>{user.name}</p>
          </div>
        ) : (
          chatData && chatData.map((item, index) => (
            <div onClick={()=>setChat(item)}  key={index} className={`friends ${item.messageSeen || item.messageId===messagesId?"":"border"}`}>
              <img src={item.userData.avatar} alt="4" />
              <div>
                <p>
                  {item.userData.name}
                 
                  </p>
                <span>
                  {item.lastMessage}
              
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LeftSideBar;
