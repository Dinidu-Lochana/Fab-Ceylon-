import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../CSS/FoodList.css';

const ViewFoods = () => {
    const [foods, setFoods] = useState([]);

    useEffect(() => {
        const fetchFoods = async () => {
            const token = localStorage.getItem("admin");
            
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL_ADRESS}/api/admins/getfoods`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setFoods(response.data);
            } catch (error) {
                toast.error("Failed to fetch foods");
            }
        };

        fetchFoods();
    }, []);

    return (
        <div className="food-list-container">
            <h1>Foods</h1>
            <div className="food-items">
                {foods.map((food) => (
                    <div className="food-item" key={food._id}>
                        <img 
                            src={food.image} // Use the image directly
                            alt={food.foodName} 
                            className="food-image" 
                        />
                        <div className="food-details">
                            <h2 className="food-name">{food.foodName}</h2>
                            <p className="food-price">Price: Rs.{food.price}.00</p>
                            <p className="food-category">{food.foodCategory}</p>
                            <p className="food-delivery">
                                Delivery Available: {food.isDeliveryAvailable ? "Yes" : "No"}
                            </p>
                            <p className="food-description">{food.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            <ToastContainer />
        </div>
    );
};

export default ViewFoods;
