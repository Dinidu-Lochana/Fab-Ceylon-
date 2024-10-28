import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';  

export default function ViewFoods() {
    const [foods, setFoods] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the foods when the component is mounted
        const fetchFoods = async () => {
            try {
                const token = localStorage.getItem("admin");
                let adminId = null;

                if (token) {
                    const decodedToken = jwtDecode(token);
                    adminId = decodedToken._id;  // Get admin ID from the token
                }

                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL_ADRESS}/api/admins/getfoods`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Send token in the header
                    },
                });

                setFoods(response.data);  // Store foods in state
            } catch (error) {
                toast.error(error.response?.data?.error || "An error occurred");
            }
        };

        fetchFoods();
    }, []);  // Empty dependency array to fetch once on mount

    return (
        <div className="view-foods">
            <h1>List of Foods</h1>
            {foods.length > 0 ? (
                <ul>
                    {foods.map((food) => (
                        <li key={food._id}>
                            <h2>{food.foodName}</h2>
                            <p>Price: {food.price}</p>
                            <p>Description: {food.description}</p>
                            <p>Category: {food.foodCategory}</p>
                            <p>Delivery Available: {food.isDeliveryAvailable ? 'Yes' : 'No'}</p>
                            <img src={food.image} alt={food.foodName} style={{ width: '200px', height: 'auto' }} />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No foods found.</p>
            )}
            <ToastContainer />
        </div>
    );
}
