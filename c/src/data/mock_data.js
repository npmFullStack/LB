// src/data/mock_data.js
import recipe1 from "@/assets/images/recipe1.png";
import recipe2 from "@/assets/images/recipe2.png";
import recipe3 from "@/assets/images/recipe3.png";
import avatar1 from "@/assets/avatar/avatar1.png";
import avatar2 from "@/assets/avatar/avatar2.png";
import avatar3 from "@/assets/avatar/avatar3.png";

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
        ingredients: ["Chicken", "Soy Sauce", "Vinegar", "Garlic", "Bay Leaves", "Black Pepper"],
        steps: [
            "Marinate chicken in soy sauce, garlic, and black pepper for at least 30 minutes.",
            "In a pot, sauté garlic until fragrant.",
            "Add marinated chicken and cook until browned.",
            "Pour in vinegar and bring to a boil without stirring.",
            "Add bay leaves and simmer until chicken is tender.",
            "Serve hot with steamed rice."
        ],
        uploader: {
            name: "Maria Santos",
            avatar: avatar1,
            joinDate: "January 2023"
        }
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
        ingredients: ["Ice", "Evaporated Milk", "Ube Halaya", "Leche Flan", "Sweetened Beans", "Fruits", "Saba Banana", "Macapuno"],
        steps: [
            "Layer sweetened beans, fruits, macapuno, and ube halaya in a tall glass.",
            "Add crushed ice until almost full.",
            "Pour evaporated milk over the ice.",
            "Top with leche flan and a scoop of ube ice cream.",
            "Mix everything together before eating."
        ],
        uploader: {
            name: "Juan Dela Cruz",
            avatar: avatar2,
            joinDate: "March 2023"
        }
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
        ingredients: ["Pork Belly", "Tamarind", "Kangkong", "Radish", "Eggplant", "String Beans", "Tomato", "Onion"],
        steps: [
            "Boil pork in water until tender, skimming off scum.",
            "Add onion, tomato, and tamarind (or sinigang mix).",
            "Simmer until pork is very tender.",
            "Add radish and eggplant, cook for 5 minutes.",
            "Add string beans and kangkong stalks, cook for 2 minutes.",
            "Add kangkong leaves, turn off heat, and serve hot."
        ],
        uploader: {
            name: "Jose Rizal",
            avatar: avatar3,
            joinDate: "February 2023"
        }
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
        ingredients: ["Kapeng Barako Beans", "Hot Water", "Sugar", "Milk (optional)"],
        steps: [
            "Grind Kapeng Barako beans to a medium-coarse consistency.",
            "Place ground coffee in a French press or coffee maker.",
            "Pour hot water (just below boiling) over the grounds.",
            "Let it steep for 4-5 minutes.",
            "Press or strain the coffee.",
            "Add sugar and milk to taste."
        ],
        uploader: {
            name: "Maria Santos",
            avatar: avatar1,
            joinDate: "January 2023"
        }
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
        ingredients: ["Ground Pork", "Carrots", "Onions", "Spring Roll Wrappers", "Egg", "Garlic", "Salt", "Pepper", "Cooking Oil"],
        steps: [
            "Mix ground pork, finely chopped carrots, onions, garlic, salt, and pepper.",
            "Place a spoonful of mixture on a spring roll wrapper.",
            "Roll tightly and seal the edge with beaten egg.",
            "Heat oil in a deep pan to medium-high heat.",
            "Fry lumpia until golden brown and crispy.",
            "Drain on paper towels and serve with sweet and sour sauce."
        ],
        uploader: {
            name: "Juan Dela Cruz",
            avatar: avatar2,
            joinDate: "March 2023"
        }
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
        ingredients: ["Egg Yolks", "Condensed Milk", "Evaporated Milk", "Sugar", "Vanilla Extract"],
        steps: [
            "Melt sugar in a saucepan over low heat until golden brown.",
            "Pour caramel into llanera molds, tilting to coat the bottom.",
            "Mix egg yolks, condensed milk, evaporated milk, and vanilla.",
            "Strain the mixture to remove lumps.",
            "Pour into molds and cover with foil.",
            "Steam or bake in a water bath for 45-50 minutes.",
            "Cool completely and refrigerate.",
            "Flip onto a plate before serving."
        ],
        uploader: {
            name: "Jose Rizal",
            avatar: avatar3,
            joinDate: "February 2023"
        }
    }
];