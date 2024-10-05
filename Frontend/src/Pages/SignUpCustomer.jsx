import React, { useState } from 'react';
import './CSS/SignUpCustomer.css';
import Fab_Ceylon_Logo_PVT from '../Assets/Fab_Ceylon_Logo_PVT.png';
import Lock from '../Assets/Lock.png';
import User_Icon from '../Assets/User_Icon.png';
import { Link } from 'react-router-dom';
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; 
const SignUpCustomer = () => {
    const navigate = useNavigate();
    const [state,setState] = useState("Login");
    const [confirmPassword,setConfirmPassword] = useState("")
    const [formData,setFormData] = useState({
        name:"",
        contactNumber:"",
        password:"",
        
    })

    const changeHandler = (e)=>{
        setFormData({...formData,[e.target.name]:e.target.value})
    }

    
    const signup = async () =>{
        if(formData.password != confirmPassword){
            toast.error("unmatching password and Confirm password ",{containerId: 'ErrorMessage'});
            return;
        }
        console.log("Signup Function Executed",formData);

    const response = await axios
    .post(
    `${process.env.REACT_APP_BACKEND_URL_ADRESS}/api/customers/signup`,
    JSON.stringify({name:formData.name, contactNumber: formData.contactNumber, password: formData.password }),
    {
        headers: {
        "Content-Type": "application/json",
        },
    }
    )
    .then((response)=>{
        localStorage.setItem("user", JSON.stringify(response.data));
        toast.success("successfully created account", {containerId: 'successMessage'})
        navigate("/");
    })
    .catch((error)=> {
        toast.error(error.response.data.error,{containerId: 'ErrorMessage'})
    return { data: null };
    });
    }

    return (
        <div className='signup'>
            <div className="signup-container">
                <img className='fabceylon-logopvt' src={Fab_Ceylon_Logo_PVT} alt="" />
                <h1>Sign Up</h1>
                <div className="signup-field">
                    <div className="input"><img src={User_Icon} alt="" /> <input type="text" placeholder='Name' name="name" className='name-input' value={formData.name} onChange={changeHandler}/></div>
                    <div className="input"><img src={User_Icon} alt="" /> <input type="text" placeholder='Phone Number' name="contactNumber" className='phonenumber-input' value={formData.contactNumber} onChange={changeHandler}/></div>
                    <div className="input"><img src={Lock} alt="" /> <input type="password" placeholder='Password' name="password"  className='password-input' value={formData.password} onChange={changeHandler} /></div>
                    <div className="input"><img src={Lock} alt="" /> <input type="password" placeholder='Confirm Password' className='password-input' value={confirmPassword} onChange={(e)=>{setConfirmPassword(e.target.value)}}/></div>
                </div>
                <button onClick={signup}>Sign Up</button>
                <p className='signup-login'>
                    Already have an Account?&nbsp; 
                    <Link to="/login"><span>Login</span></Link>
                </p>
            </div>
            <ToastContainer containerId="successMessage" />
            <ToastContainer containerId="ErrorMessage" />
        </div>
    );
}

export default SignUpCustomer;