import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewFoods = () => {
    const [foods, setFoods] = useState([]);

    useEffect(() => {
        // Fetch foods for the admin
        const fetchFoods = async () => {
            const token = localStorage.getItem("admin"); // Retrieve the token from local storage
            
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL_ADRESS}/api/admins/getfoods`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setFoods(response.data); // Set the foods in the state
            } catch (error) {
                toast.error("Failed to fetch foods");
            }
        };

        fetchFoods();
    }, []);

    return (
        <div>
            <h1>Your Foods</h1>
            <ul>
                {foods.map((food) => (
                    <div>
                        <img src={`/${food.image}`} alt={food.foodName} width="100" />
                        <li key={food._id}>
                        <h2>{food.foodName}</h2>
                        <p>Price: {food.price}</p>
                        <p>{food.description}</p>
                        </li>
                    </div>
                    
                ))}
            </ul>
            <ToastContainer />
        </div>
    );
};

export default ViewFoods;
