// src/data/mock_data.js
import recipe1 from "@/assets/images/recipe1.png";
import recipe2 from "@/assets/images/recipe2.png";
import recipe3 from "@/assets/images/recipe3.png";

export const recipes = [
    {
        id: 1,
        title: "Chicken Adobo",
        description: "A classic Filipino dish made with chicken braised in vinegar, soy sauce, garlic, and black pepper.",
        image: recipe1,
        category: "Main Dish",
        servings: 4,
        cookTime: "45 min",
        difficulty: "Easy",
        rating: 4.8,
        ingredients: ["Chicken", "Soy Sauce", "Vinegar", "Garlic", "Bay Leaves", "Black Pepper"]
    },
    {
        id: 2,
        title: "Halo-Halo",
        description: "A popular Filipino dessert made with crushed ice, evaporated milk, and various sweetened fruits and beans.",
        image: recipe2,
        category: "Dessert",
        servings: 2,
        cookTime: "15 min",
        difficulty: "Easy",
        rating: 4.9,
        ingredients: ["Ice", "Evaporated Milk", "Ube Halaya", "Leche Flan", "Sweetened Beans", "Fruits"]
    },
    {
        id: 3,
        title: "Sinigang na Baboy",
        description: "A sour tamarind-based soup with pork, vegetables, and a savory broth that warms the soul.",
        image: recipe3,
        category: "Soup",
        servings: 6,
        cookTime: "60 min",
        difficulty: "Medium",
        rating: 4.7,
        ingredients: ["Pork", "Tamarind", "Kangkong", "Radish", "Eggplant", "String Beans"]
    },
    {
        id: 4,
        title: "Kapeng Barako",
        description: "Strong, bold Filipino coffee brewed from Liberica beans, perfect for starting your day.",
        image: recipe1,
        category: "Beverage",
        servings: 2,
        cookTime: "10 min",
        difficulty: "Easy",
        rating: 4.6,
        ingredients: ["Kapeng Barako Beans", "Hot Water", "Sugar", "Milk (optional)"]
    },
    {
        id: 5,
        title: "Lumpiang Shanghai",
        description: "Crispy Filipino spring rolls filled with ground pork, carrots, and seasonings.",
        image: recipe2,
        category: "Appetizer",
        servings: 8,
        cookTime: "30 min",
        difficulty: "Medium",
        rating: 4.8,
        ingredients: ["Ground Pork", "Carrots", "Onions", "Spring Roll Wrappers", "Egg", "Garlic"]
    },
    {
        id: 6,
        title: "Leche Flan",
        description: "A creamy, smooth caramel custard dessert that melts in your mouth.",
        image: recipe3,
        category: "Dessert",
        servings: 8,
        cookTime: "90 min",
        difficulty: "Hard",
        rating: 4.9,
        ingredients: ["Egg Yolks", "Condensed Milk", "Evaporated Milk", "Sugar", "Vanilla"]
    }
];