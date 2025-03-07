const Recipes = require("../models/recipe");
const multer = require("multer");

// Setup Multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/images"); // Save images in public/images
    },
    filename: function (req, file, cb) {
        const filename = Date.now() + "-" + file.originalname;
        cb(null, filename);
    },
});

const upload = multer({ storage: storage });

const getRecipes = async (req, res) => {
    try {
        const recipes = await Recipes.find();
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ message: "Error fetching recipes" });
    }
};

const getRecipe = async (req, res) => {
    try {
        const recipe = await Recipes.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        res.json(recipe);
    } catch (err) {
        res.status(500).json({ message: "Error fetching recipe" });
    }
};

const addRecipe = async (req, res) => {
    try {
        console.log(req.user);
        const { title, ingredients, instructions, time } = req.body;

        if (!title || !ingredients || !instructions) {
            return res.status(400).json({ message: "Required fields can't be empty" });
        }

        const parsedIngredients = JSON.parse(ingredients); // Convert string back to array

        const newRecipe = await Recipes.create({
            title,
            ingredients: parsedIngredients,
            instructions,
            time,
            coverImage: req.file.filename,
            createdBy: req.user.id,
        });

        res.status(201).json(newRecipe);
    } catch (err) {
        res.status(500).json({ message: "Error adding recipe", error: err.message });
    }
};

const editRecipe = async (req, res) => {
    try {
        const { title, ingredients, instructions, time } = req.body;
        let recipe = await Recipes.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        let coverImage = req.file?.filename ? req.file.filename : recipe.coverImage;
        await Recipes.findByIdAndUpdate(req.params.id, { title, ingredients, instructions, time, coverImage }, { new: true });

        res.json({ message: "Recipe updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error updating recipe", error: err.message });
    }
};

const deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipes.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        await Recipes.deleteOne({ _id: req.params.id });
        res.json({ status: "ok", message: "Recipe deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting recipe" });
    }
};

module.exports = { getRecipes, getRecipe, addRecipe, editRecipe, deleteRecipe, upload };
