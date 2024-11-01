import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../CSS/FoodList.css';
import { Link } from 'react-router-dom';


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

    const buttonStyle = {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        transition: 'transform 0.2s, background-color 0.2s, box-shadow 0.2s',
    };

    return (
        <div className="food-list-container">
            <h1>Foods</h1>
            <div className="food-items">
                {foods.map((food) => (
                    <div className="food-item" key={food._id}>
                        <img 
                        src={`${process.env.REACT_APP_BACKEND_URL_ADRESS}/${food.image.replace("\\", "/")}`} // Adjust path format
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
                        
                        <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/updatefoods">
                <button
                    style={buttonStyle}
                    onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#45a049';
                        e.target.style.transform = 'translateY(-3px)';
                        e.target.style.boxShadow = '0px 8px 12px rgba(0, 0, 0, 0.3)';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.backgroundColor = '#4CAF50';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseDown={(e) => {
                        e.target.style.transform = 'translateY(1px)';
                        e.target.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseUp={(e) => {
                        e.target.style.transform = 'translateY(-3px)';
                        e.target.style.boxShadow = '0px 8px 12px rgba(0, 0, 0, 0.3)';
                    }}
                >
                    Update
                </button>
            </Link>
            <Link to="/deletefood">
                <button
                    style={buttonStyle}
                    onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#c70000';
                        e.target.style.transform = 'translateY(-3px)';
                        e.target.style.boxShadow = '0px 8px 12px rgba(0, 0, 0, 0.3)';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.backgroundColor = '#c70000';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseDown={(e) => {
                        e.target.style.transform = 'translateY(1px)';
                        e.target.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseUp={(e) => {
                        e.target.style.transform = 'translateY(-3px)';
                        e.target.style.boxShadow = '0px 8px 12px rgba(0, 0, 0, 0.3)';
                    }}
                >
                    Delete
                </button>
            </Link>
        </div>
                       
                    </div>
                ))}
            </div>
            <ToastContainer />
        </div>
    );
};

export default ViewFoods;
