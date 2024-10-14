import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; 
import '../CSS/AddFood.css';

const AddFood = () => {
    const navigate = useNavigate();
    const [formData,setFormData] = useState({
        foodName : "",
        price : "",
        description : "",
        foodCategory : "",
        isDeliveryAvailable: ""
    })

    const changeHandler = (e)=>{
        setFormData({...formData,[e.target.name]:e.target.value})
    }

    const addFood = async () => {
        console.log("Add food Function Executed",formData)
        const response = await axios

        .post(
            `${process.env.REACT_APP_BACKEND_URL_ADRESS}/api/admins/createfood`,
            JSON.stringify({foodName:formData.foodName, price:formData.price, description:formData.description, foodCategory:formData.foodCategory, isDeliveryAvailable:formData.isDeliveryAvailable}),
            {
                headers: {
                    "Content-Type": "application/json",
                }
            }
        )
        .then((response)=> {
            toast.success("Successfully created Food", {containerId: 'successMessage'})
            navigate("/");  // navigate to viewfood
        })
        .catch((error)=>{
            toast.error(error.response.data.error,{containerId: 'ErrorMessage'})
            return { data: null };
        })


    }
    
    return (
        <div className='signup'>
        <div className="signup-container">
            <h1>Add food</h1>
            <div className="signup-field">
                <div className="input"><input type="text" placeholder='Food Name' name="foodName" className='name-input' value={formData.foodName} onChange={changeHandler}/></div>
                <div className="input"><input type="number" placeholder='Price' name="price" className='price-input' value={formData.price} onChange={changeHandler}/></div>
                <div className="input"><input type="text" placeholder='Description' name="description"  className='description-input' value={formData.description} onChange={changeHandler} /></div>
                <div className="input">
                    <select name="foodCategory" className='category-input' value={formData.foodCategory} onChange={changeHandler}>
                        <option value="" disabled>Select Category</option>
                        <option value="Appetizer">Appetizer</option>
                        <option value="Main Course">Main Course</option>
                        <option value="Dessert">Dessert</option>
                        <option value="Beverage">Beverage</option>
                        <option value="Salad">Salad</option>
                    </select>
                </div>
                <div className="input">
                    <select name="isDeliveryAvailable" className='delivery-input' value={formData.isDeliveryAvailable} onChange={changeHandler}>
                        <option value="" disabled>Is Delivery Available?</option>
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                    </select>
                </div>
            </div>
            <button onClick={addFood}>Add Food</button>
            
        </div>
        <ToastContainer containerId="successMessage" />
        <ToastContainer containerId="ErrorMessage" />
    </div>
      
    )
}

export default AddFood;