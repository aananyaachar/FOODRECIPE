import React, { useEffect, useState } from 'react';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import foodImg from '../assets/foodRecipe.png';
import { BsStopwatchFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from 'axios';

export default function RecipeItems() {
    const recipes = useLoaderData();
    const [allRecipes, setAllRecipes] = useState([]);
    const navigate = useNavigate();
    const [isFavRecipe, setIsFavRecipe] = useState(false);
    
    let path = window.location.pathname === "/myRecipe";
    let favItems = JSON.parse(localStorage.getItem("fav")) ?? [];

    useEffect(() => {
        setAllRecipes(recipes);
    }, [recipes]);

    // ✅ Fixed onDelete Function
    const onDelete = async (id) => {
        if (!id) {
            console.error("Invalid recipe ID:", id);
            return;
        }

        try {
            console.log("Deleting recipe ID:", id);

            await axios.delete(`http://localhost:5000/recipe/${id}`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });

            // ✅ Update state after successful deletion
            setAllRecipes(prevRecipes => prevRecipes.filter(recipe => recipe._id !== id));

            // ✅ Update favorites in localStorage
            let updatedFavItems = favItems.filter(recipe => recipe._id !== id);
            localStorage.setItem("fav", JSON.stringify(updatedFavItems));

            console.log("Recipe deleted successfully!");
        } catch (error) {
            console.error("Delete failed:", error.response?.data || error.message);
            alert("Failed to delete recipe. Please try again.");
        }
    };

    // ✅ Favorite Recipe Toggle Function
    const favRecipe = (item) => {
        let filterItem = favItems.filter(recipe => recipe._id !== item._id);
        favItems = favItems.some(recipe => recipe._id === item._id) ? filterItem : [...favItems, item];
        localStorage.setItem("fav", JSON.stringify(favItems));
        setIsFavRecipe(prev => !prev);
    };

    return (
        <div className='card-container'>
            {allRecipes?.map((item, index) => (
                <div key={index} className='card' onDoubleClick={() => navigate(`/recipe/${item._id}`)}>
                    <img src={`http://localhost:5000/images/${item.coverImage}`} alt={item.title} width="120px" height="100px" />
                    <div className='card-body'>
                        <div className='title'>{item.title}</div>
                        <div className='icons'>
                            <div className='timer'><BsStopwatchFill /> {item.time}</div>
                            {!path ? (
                                <FaHeart 
                                    onClick={() => favRecipe(item)} 
                                    style={{ color: favItems.some(res => res._id === item._id) ? "red" : "" }} 
                                />
                            ) : (
                                <div className='action'>
                                    <Link to={`/editRecipe/${item._id}`} className="editIcon"><FaEdit /></Link>
                                    <MdDelete onClick={() => onDelete(item._id)} className='deleteIcon' />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
