import React from 'react'
import {useState,useEffect} from 'react'
import axios from 'axios'

export default function LoginPage() {

    //axios.get()
  //hook useEffects this hook helps you to do sideEffects on your Page
  //useEffect =>effect,return part (clean up function).dependency array
  //useEffects= to eliminate the side-effects of using class-based components.
  useEffect(()=>{
    async function res(){
    let resps =await axios.get('http://localhost:5000/sample')
    console.log(resps.data);
    }
    res();
  },[]);

  let [email,setEmail]=useState('');
  let [password,setPassword]=useState('');
  console.log(email);
  console.log(password);

  async function handleClick(){
    let resp=await axios.post('http://localhost:5000/backend/save',{email,password})
    console.log(resp.data);
  }

  return (
    <div>
        <div>Email id</div>
     <input type="text" placeholder="email" onChange={(e)=>setEmail(e.target.value)}/>
     <br/>
     <div>Password</div>
     <input type="text" placeholder="password" onChange={(e)=>setPassword(e.target.value)} />
     <br/>
     <button type="submit" onClick={handleClick}>Login</button>
    </div>
  )
}
