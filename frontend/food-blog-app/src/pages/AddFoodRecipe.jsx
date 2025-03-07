import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddFoodRecipe() {
    const [recipeData, setRecipeData] = useState({
        title: "",
        time: "",
        ingredients: "",
        instructions: "",
        file: null,
    });

    const navigate = useNavigate();

    const onHandleChange = (e) => {
        let { name, value, files } = e.target;

        if (name === "ingredients") {
            value = value.split(",").map((item) => item.trim()); // Convert to array
        } else if (name === "file") {
            value = files[0]; // Store file
        }

        setRecipeData((prev) => ({ ...prev, [name]: value }));
    };

    const onHandleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found. Please log in.");
            alert("You must be logged in to add a recipe.");
            return;
        }

        const formData = new FormData();
        formData.append("title", recipeData.title);
        formData.append("time", recipeData.time);
        formData.append("ingredients", JSON.stringify(recipeData.ingredients)); // Convert array to JSON
        formData.append("instructions", recipeData.instructions);
        formData.append("file", recipeData.file);

        try {
            const response = await axios.post("http://localhost:5000/recipe", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Recipe added:", response.data);
            navigate("/");
        } catch (error) {
            console.error("Upload failed:", error.response?.data || error.message);
            alert(error.response?.data?.message || "Failed to add recipe. Please try again.");
        }
    };

    return (
        <div className="container">
            <form className="form" onSubmit={onHandleSubmit}>
                <div className="form-control">
                    <label>Title</label>
                    <input type="text" className="input" name="title" value={recipeData.title} onChange={onHandleChange} required />
                </div>
                <div className="form-control">
                    <label>Time</label>
                    <input type="text" className="input" name="time" value={recipeData.time} onChange={onHandleChange} required />
                </div>
                <div className="form-control">
                    <label>Ingredients (comma-separated)</label>
                    <textarea className="input-textarea" name="ingredients" rows="5" value={recipeData.ingredients} onChange={onHandleChange} required></textarea>
                </div>
                <div className="form-control">
                    <label>Instructions</label>
                    <textarea className="input-textarea" name="instructions" rows="5" value={recipeData.instructions} onChange={onHandleChange} required></textarea>
                </div>
                <div className="form-control">
                    <label>Recipe Image</label>
                    <input type="file" className="input" name="file" onChange={onHandleChange} required />
                </div>
                <button type="submit">Add Recipe</button>
            </form>
        </div>
    );
}
