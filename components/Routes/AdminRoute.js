import {useState,useEffect} from 'react';
import { useAuth } from '../../context/auth';
import {Outlet} from 'react-router-dom';
import axios from 'axios';
import Spinner from '../Spinner';
// toast msg to show "Unauthorized Access" msg when ok=false(role=0)
import toast from "react-hot-toast";

export default function AdminRoute(){
    const [ok,setOk] =useState(false);
    const [auth] =useAuth();

    useEffect(()=>{
        const authCheck = async() => {
            const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/admin-auth`);
            if(res.data.ok){
                setOk(true)
            }else{
                setOk(false)
                const timeout = setTimeout(()=>{
                    toast.error(res.data.message);
                },3000)
                // cleaner for setTimeout
                return () => clearTimeout(timeout);
            }
        }
        if(auth?.token) authCheck();
        //eslint-disable-next-line
    }, [auth?.token]);

    return ok ? <Outlet /> : <Spinner path=''/> 
}