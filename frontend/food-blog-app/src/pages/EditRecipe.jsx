import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditRecipe() {
    const [recipeData, setRecipeData] = useState({
        title: "",
        ingredients: "",
        instructions: "",
        time: "",
        file: null,
    });
    
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/recipe/${id}`);
                const res = response.data;
                setRecipeData({
                    title: res.title,
                    ingredients: res.ingredients.join(", "), // Convert array to string
                    instructions: res.instructions,
                    time: res.time,
                    file: null, // Don't pre-load the image
                });
            } catch (error) {
                console.error("Error fetching recipe:", error);
            }
        };
        getData();
    }, [id]);

    const onHandleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "file") {
            setRecipeData((prev) => ({ ...prev, file: files[0] }));
        } else if (name === "ingredients") {
            setRecipeData((prev) => ({ ...prev, ingredients: value }));
        } else {
            setRecipeData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const onHandleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", recipeData.title);
        formData.append("time", recipeData.time);
        formData.append("ingredients", JSON.stringify(recipeData.ingredients.split(","))); // Convert string to array
        formData.append("instructions", recipeData.instructions);
        if (recipeData.file) {
            formData.append("file", recipeData.file);
        }

        try {
            await axios.put(`http://localhost:5000/recipe/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });
            navigate("/myRecipe");
        } catch (error) {
            console.error("Error updating recipe:", error);
        }
    };

    return (
        <div className="container">
            <form className="form" onSubmit={onHandleSubmit}>
                <div className="form-control">
                    <label>Title</label>
                    <input
                        type="text"
                        className="input"
                        name="title"
                        onChange={onHandleChange}
                        value={recipeData.title}
                    />
                </div>
                <div className="form-control">
                    <label>Time</label>
                    <input
                        type="text"
                        className="input"
                        name="time"
                        onChange={onHandleChange}
                        value={recipeData.time}
                    />
                </div>
                <div className="form-control">
                    <label>Ingredients</label>
                    <textarea
                        className="input-textarea"
                        name="ingredients"
                        rows="5"
                        onChange={onHandleChange}
                        value={recipeData.ingredients}
                    />
                </div>
                <div className="form-control">
                    <label>Instructions</label>
                    <textarea
                        className="input-textarea"
                        name="instructions"
                        rows="5"
                        onChange={onHandleChange}
                        value={recipeData.instructions}
                    />
                </div>
                <div className="form-control">
                    <label>Recipe Image</label>
                    <input type="file" className="input" name="file" onChange={onHandleChange} />
                </div>
                <button type="submit">Edit Recipe</button>
            </form>
        </div>
    );
}
