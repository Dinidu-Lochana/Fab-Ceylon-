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
    const [file, setFile] = useState(null); 
    const [imagePreview, setImagePreview] = useState(null); 
    const [formData, setFormData] = useState({
        foodName: '',
        price: '',
        description: '',
        foodCategory: '',
        isDeliveryAvailable: ''
    });

    const changeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const imageFile = e.target.files[0];
        setFile(imageFile); 
        setImagePreview(URL.createObjectURL(imageFile)); 
    };

    const addFood = async () => {
        const token = localStorage.getItem('admin');
        let adminId = null;
        if (token) {
            const decodedToken = jwtDecode(token);
            adminId = decodedToken._id;
        }

        const formDataObj = new FormData();
        formDataObj.append('foodName', formData.foodName);
        formDataObj.append('price', formData.price);
        formDataObj.append('description', formData.description);
        formDataObj.append('foodCategory', formData.foodCategory);
        formDataObj.append('isDeliveryAvailable', formData.isDeliveryAvailable);
        formDataObj.append('image', file); 
        formDataObj.append('admin_id', adminId);

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL_ADRESS}/api/admins/createfood`,
                formDataObj,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            toast.success('Successfully created Food', { containerId: 'successMessage' });
            navigate('/foods');
        } catch (error) {
            toast.error(error.response?.data?.error || 'An error occurred', { containerId: 'ErrorMessage' });
        }
    };

    return (
        <div className='signup'>
            <style>{`
                .input-field {
                    position: relative;
                    width: 100%;
                    margin-bottom: 20px;
                }

                input[type='file'] {
                    display: none;
                }

                .custom-file-upload {
                    display: inline-block;
                    padding: 10px 20px;
                    cursor: pointer;
                    background-color: #964B00;
                    color: white;
                    border-radius: 5px;
                    font-weight: bold;
                    transition: background-color 0.3s;
                }

                .custom-file-upload:hover {
                    background-color: #45a049;
                }

                .image-preview {
                    margin-top: 10px;
                    display: flex;
                    justify-content: center;
                }

                .image-preview img {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    border: 2px solid #4CAF50;
                    object-fit: cover;
                }

                button {
                    padding: 10px 20px;
                    background-color: brown;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: background-color 0.3s;
                }

                button:hover {
                    background-color: darkred;
                }
            `}</style>

            <div className='signup-container'>
                <h1>Add Food</h1>
                <div className='signup-field'>
                    {imagePreview && (
                        <div className="image-preview">
                            <img src={imagePreview} alt="Selected" />
                        </div>
                    )}
                    <div className='input-field'>
                        <label className="custom-file-upload">
                            <input type='file' accept='image/*' onChange={handleImageChange} />
                            Upload Image
                        </label>
                    </div>
                    <div className='input'>
                        <input
                            type='text'
                            placeholder='Food Name'
                            name='foodName'
                            className='name-input'
                            value={formData.foodName}
                            onChange={changeHandler}
                        />
                    </div>
                    <div className='input'>
                        <input
                            type='number'
                            placeholder='Price'
                            name='price'
                            className='price-input'
                            value={formData.price}
                            onChange={changeHandler}
                        />
                    </div>
                    <div className='input'>
                        <textarea
                            placeholder='Description'
                            name='description'
                            className='description-input'
                            value={formData.description}
                            onChange={changeHandler}
                            rows={4}
                            style={{ resize: 'none', width: '100%', borderRadius: '20px', padding: '10px' }}
                        />
                    </div>
                    <div className='input'>
                        <select
                            name='foodCategory'
                            className='category-input'
                            value={formData.foodCategory}
                            onChange={changeHandler}
                        >
                            <option value='' disabled>Select Category</option>
                            <option value="Appetizer">Appetizer</option>
                            <option value="Salad-&-Soup">Salad & Soup</option>
                            <option value="Pasta-&-Spaghetti">Pasta & Spaghetti</option>
                            <option value="Fried-Rice">Fried Rice</option>
                            <option value="Biriyani">Biriyani</option>
                            <option value="Kottu">Kottu</option>
                            <option value="Noodles">Noodles</option>
                            <option value="Add-On">Add-On</option>
                            <option value="Side-Dishes">Side Dishes</option>
                            <option value="Fab-Signature-Shovel-Rice">Fab Signature Shovel Rice</option>
                            <option value="Burger-&-Submarine">Burger & Submarine</option>
                            <option value="Sandwiches-&-Submarines">Sandwiches & Submarines</option>
                            <option value="Dessert">Dessert</option>
                            <option value="Bubble-Tea">Bubble Tea</option>
                            <option value="Iced-Tea-&-Coffee">Iced Tea & Coffee</option>
                            <option value="Hot-Beverage">Hot Beverage</option>
                            <option value="Mojito">Mojito</option>
                            <option value="Milk-Shake">Milk Shake</option>
                            <option value="Cocktails">Cocktails</option>
                        </select>
                    </div>
                    <div className='input'>
                        <select
                            name='isDeliveryAvailable'
                            className='delivery-input'
                            value={formData.isDeliveryAvailable}
                            onChange={changeHandler}
                        >
                            <option value='' disabled>Is Delivery Available?</option>
                            <option value='1'>Yes</option>
                            <option value='0'>No</option>
                        </select>
                    </div>
                </div>
                <button onClick={addFood}>Add Food</button>
            </div>
            <ToastContainer containerId='successMessage' />
            <ToastContainer containerId='ErrorMessage' />
        </div>
    );
};


export default AddFood;