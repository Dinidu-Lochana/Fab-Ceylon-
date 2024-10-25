import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; 
import '../CSS/AddFood.css';
import { jwtDecode } from 'jwt-decode';

const AddFood = () => {
    const navigate = useNavigate();
    const [formData,setFormData] = useState({
        foodName : "",
        price : "",
        description : "",
        foodCategory : "",
        isDeliveryAvailable: "",
        
    })

    const changeHandler = (e)=>{
        setFormData({...formData,[e.target.name]:e.target.value})
    }

    const addFood = async () => {
        console.log("Add food Function Executed", formData);

        // Get token from local storage and decode it to extract admin_id
        const token = localStorage.getItem("admin");
        let adminId = null;
        if (token) {
            const decodedToken = jwtDecode(token);
            adminId = decodedToken._id; // Replace 'admin_id' with the actual field name in the token payload
        }

        const payload = {
            foodName: formData.foodName,
            price: formData.price,
            description: formData.description,
            foodCategory: formData.foodCategory,
            isDeliveryAvailable: formData.isDeliveryAvailable,
            admin_id: adminId,
        };

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL_ADRESS}/api/admins/createfood`,
                JSON.stringify(payload),
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            toast.success("Successfully created Food", { containerId: 'successMessage' });
            navigate("/");
        } catch (error) {
            toast.error(error.response?.data?.error || "An error occurred", { containerId: 'ErrorMessage' });
        }
    };
    
    return (
        <div className='signup'>
        <div className="signup-container">
            <h1>Add food</h1>
            <div className="signup-field">
                <div className="input"><input type="text" placeholder='Food Name' name="foodName" className='name-input' value={formData.foodName} onChange={changeHandler}/></div>
                <div className="input"><input type="number" placeholder='Price' name="price" className='price-input' value={formData.price} onChange={changeHandler}/></div>
                <div className="input">
                <textarea 
                    placeholder='Description' 
                    name="description"  
                    className='description-input' 
                    value={formData.description} 
                    onChange={changeHandler} 
                    rows={4} 
                    style={{ resize: 'none', width: '100%', borderRadius: '20px', padding: '10px' }} 
                />
            </div>
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