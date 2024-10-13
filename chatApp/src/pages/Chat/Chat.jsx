import React, { useContext,useState, useEffect } from 'react'
import './Chat.css'
import LeftSideBar from '../../components/LeftSideBar/LeftSideBar'
import ChatBox from '../../components/ChatBox/ChatBox'
import RightSideBar from '../../components/RightSideBar/RightSideBar'
import { AppContext } from '../../context/AppContext'

const Chat = () => {
  const {chatData,userData}=useContext(AppContext);
  const [loading,setLoading]=useState(true);

  

  useEffect(()=>{
    if(userData && chatData){
      setLoading(false);
    }
  },[userData,chatData]);

  return (
    <div className='chat slide-down'>
      {
        loading?
        <p className='loading'>Loading...</p>
        :
        <div className='chat-container'>
          <LeftSideBar/>
          <ChatBox/>
          <RightSideBar/>
        </div>
      }
       
    </div>
  )
}

export default Chat;