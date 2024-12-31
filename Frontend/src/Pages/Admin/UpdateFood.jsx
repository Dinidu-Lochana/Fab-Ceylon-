import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../CSS/UpdateFood.css';
import { jwtDecode } from 'jwt-decode';

const UpdateFood = () => {
    const { id } = useParams(); // Get food ID from the URL
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        foodName: "",
        price: "",
        description: "",
        foodCategory: "",
        isDeliveryAvailable: "",
        image: ""
    });

    useEffect(() => {
        const fetchFood = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL_ADRESS}/api/admins/updatefood/${id}`
                );
                setFormData(response.data);
            } catch (error) {
                toast.error("Failed to fetch food details", { containerId: 'ErrorMessage' });
            }
        };
        fetchFood();
    }, [id]);

    const changeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

       
    if (!file) {
        console.error("No file selected");
        return;
    }

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({ ...formData, image: reader.result });
        };
        reader.readAsDataURL(file);
    };

    const updateFood = async () => {
        console.log("Update food Function Executed", formData);

        const token = localStorage.getItem("admin");
        let adminId = null;
        if (token) {
            const decodedToken = jwtDecode(token);
            adminId = decodedToken._id;
        }

        const payload = {
            ...formData,
            admin_id: adminId,
        };

        try {
            const response = await axios.put(
                `${process.env.REACT_APP_BACKEND_URL_ADRESS}/api/admins/updatefood/${id}`,
                JSON.stringify(payload),
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            toast.success("Successfully updated Food", { containerId: 'successMessage' });
            navigate("/"); 
        } catch (error) {
            toast.error(error.response?.data?.error || "An error occurred", { containerId: 'ErrorMessage' });
        }
    };

    return (
        <div className='signup'>
            <div className="signup-container">
                <h1>Update Food</h1>
                <div className="signup-field">
                <div className="input">
          <label htmlFor="file-upload" className="custom-file-upload">
           Upload Image
           </label>
          <input id="file-upload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
          </div>

                    <div className="input">
                        <input type="text" placeholder='Food Name' name="foodName" className='name-input' value={formData.foodName} onChange={changeHandler} />
                    </div>
                    <div className="input">
                        <input type="number" placeholder='Price' name="price" className='price-input' value={formData.price} onChange={changeHandler} />
                    </div>
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
                <button onClick={updateFood}>Update Food</button>
            </div>
            <ToastContainer containerId="successMessage" />
            <ToastContainer containerId="ErrorMessage" />
        </div>
    );
};

export default UpdateFood;