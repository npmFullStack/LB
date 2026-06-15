-- Create database
CREATE DATABASE IF NOT EXISTS lutong_bahay;

-- Connect to database
\c lutong_bahay;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recipes table
CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    ingredients TEXT[] NOT NULL,
    instructions TEXT[] NOT NULL,
    prep_time INTEGER, -- in minutes
    cook_time INTEGER, -- in minutes
    servings INTEGER,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Favorites table (for users to save favorite recipes)
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, recipe_id)
);

-- Recipe ratings table
CREATE TABLE recipe_ratings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, recipe_id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_recipes_user_id ON recipes(user_id);
CREATE INDEX idx_recipes_title ON recipes(title);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_recipe_ratings_recipe_id ON recipe_ratings(recipe_id);

-- Insert sample user (password is "password123" hashed with bcrypt)
INSERT INTO users (first_name, last_name, email, password_hash, avatar_url, bio)
VALUES (
    'Maria',
    'Santos',
    'maria.santos@example.com',
    '$2a$10$rQd5xX8Y9zZ1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6',
    'https://randomuser.me/api/portraits/women/1.jpg',
    'Home cook sharing authentic Filipino recipes passed down through generations.'
);

-- Insert sample recipes
INSERT INTO recipes (user_id, title, description, ingredients, instructions, prep_time, cook_time, servings, image_url)
VALUES (
    1,
    'Chicken Adobo',
    'Classic Filipino chicken adobo - tender chicken braised in vinegar, soy sauce, garlic, and black peppercorns.',
    ARRAY['2 lbs chicken thighs', '1/2 cup soy sauce', '1/2 cup vinegar', '6 cloves garlic', '2 bay leaves', '1 tsp black peppercorns', '1 cup water'],
    ARRAY['Marinate chicken in soy sauce, garlic, and peppercorns for 30 minutes.', 'Brown chicken in a pot.', 'Add marinade, vinegar, bay leaves, and water.', 'Simmer for 30 minutes until chicken is tender.', 'Serve with steamed rice.'],
    15,
    30,
    4,
    'https://example.com/adobo.jpg'
),
(
    1,
    'Sinigang na Baboy',
    'Sour and savory pork soup with tamarind, vegetables, and tender pork belly.',
    ARRAY['1 kg pork belly', '1 packet tamarind soup mix', '1 onion', '2 tomatoes', '4 cups water', '1 cup kangkong', '1 eggplant', '2 radishes'],
    ARRAY['Boil pork with onion and tomatoes for 45 minutes.', 'Add tamarind mix and radishes.', 'Add eggplant and cook for 5 minutes.', 'Add kangkong before serving.'],
    15,
    60,
    6,
    'https://example.com/sinigang.jpg'
);

-- Insert favorite for user 1
INSERT INTO favorites (user_id, recipe_id)
VALUES (1, 1);

-- Insert rating for user 1
INSERT INTO recipe_ratings (user_id, recipe_id, rating)
VALUES (1, 1, 5);