import React, { useState } from 'react';
import './CSS/LoginCustomer.css';
import Fab_Ceylon_Logo_PVT from '../Assets/Fab_Ceylon_Logo_PVT.png';
import Lock from '../Assets/Lock.png';
import User_Icon from '../Assets/User_Icon.png';
import { Link } from 'react-router-dom';
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; 
const LoginCustomer = () => {
    const navigate = useNavigate();
    const [state,setState] = useState("Login");
    const [formData,setFormData] = useState({
        contactNumber:"",
        password:"",
    })

    const changeHandler = (e)=>{
        setFormData({...formData,[e.target.name]:e.target.value})
    }

    const login = async () =>{
        console.log("Login Function Executed",formData);
        let responseData;
 
        const response = await axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL_ADRESS}/api/customers/login`,
          JSON.stringify({ contactNumber: formData.contactNumber, password: formData.password }),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response)=>{
            localStorage.setItem("user", JSON.stringify(response.data));
            toast.success("successfully logged in", {containerId: 'successMessage'})
            navigate("/");
        })
        .catch((error)=> {
            toast.error(error.response.data.error,{containerId: 'ErrorMessage'})
          return { data: null };
        });
       
    }

    return (
        <div className='loginsignup'>
            <div className="loginsignup-container">
                <img className='fabceylon-logopvt' src={Fab_Ceylon_Logo_PVT} alt="" />
                <h1>Login</h1>
                <div className="loginsignup-field">
                    <div className="input"><img src={User_Icon} alt="" /> <input
							type="text"
							placeholder="Contact Number"
							name="contactNumber"
							onChange={changeHandler}
							value={formData.contactNumber}
							required

					/></div>
                    <div className="input"><img src={Lock} alt="" /> <input
							type="password"
							placeholder="Password"
							name="password"
							onChange={changeHandler}
							value={formData.password}
							required
						/>
                    </div>
                </div>
                <button onClick={login}>Login</button>
                <p className='loginsignup-login'>
                    Don't have an Account?&nbsp;  
                    <Link to="/signup"><span>Sign Up</span></Link>
                </p>
            </div>
            <ToastContainer containerId="successMessage" />
            <ToastContainer containerId="ErrorMessage" />
        </div>
    );
}

export default LoginCustomer;
