import React, { useState } from 'react'
import './Login.css'
import assets from '../../assets/assets'
import { signup,signin,resetPass } from '../../config/firebase'

const Login = () => {
  // using state to transition from login to signup in form
  const [currstate,setCurrentState]=useState('Sign Up');
  const [username,setUserName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");

  const onSubmitHandler=(event)=>{
    event.preventDefault();
    if(currstate=="Sign Up"){
      signup(username,email,password);
    }else{
      signin(email,password);
    }
  }

  return (
    <div className='login slide-down'>
      <img src={assets.logo_big} alt="1" className='logo' />
      <form onSubmit={onSubmitHandler} className='login-form'>
        <h2>{currstate}</h2>
        {currstate==='Sign Up'?<input onChange={(e)=>setUserName(e.target.value)} value={username} type="text" placeholder='Username' className='form-input' required/>:null}
        
        <input type="email" onChange={(e)=>setEmail(e.target.value)} value={email} placeholder='Email' className='form-input' required/>
        <input type="password" onChange={(e)=>setPassword(e.target.value)} value={password} placeholder='Password' className='form-input' required/>
        <button type='submit' >{currstate==='Sign Up'?'Sign Up':'Login'}</button>
        <div className='login-term'>
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>
        <div className='login-forgot'>
          {
            currstate==='Sign Up'?
            <p className='login-toggle'>Already have an account <span onClick={()=>setCurrentState('Login')}>Login</span></p>
            :
            <p className='login-toggle'>Create account <span onClick={()=>setCurrentState('Sign Up')}>Signup</span></p>

          }
          {currstate==="Login"?<p className='login-toggle'>Forgot Password <span onClick={()=>resetPass(email)}>Reset here</span></p>:null}
        </div>
      </form>
    </div>
  )
}

export default Login