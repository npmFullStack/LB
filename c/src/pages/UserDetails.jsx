// src/pages/UserDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import RecipeCard from "@/components/RecipeCard";
import UserStatCard from "@/components/UserStatCard";
import { users, recipes } from "@/data/mock_data";
import { UserPlus, UserCheck } from "lucide-react";

const UserDetails = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [userRecipes, setUserRecipes] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [currentFollowers, setCurrentFollowers] = useState(0);

    useEffect(() => {
        // Find user by ID from mock_data
        const foundUser = users.find(u => u.id === parseInt(userId));

        if (foundUser) {
            setUser(foundUser);
            setCurrentFollowers(foundUser.followers);
            // Find all recipes by this user
            const recipesByUser = recipes.filter(
                recipe => recipe.uploader.id === foundUser.id
            );
            setUserRecipes(recipesByUser);

            // Check if current user is following (mock - would come from auth state)
            // For demo, let's check localStorage or default to false
            const followingStatus =
                localStorage.getItem(`following_${userId}`) === "true";
            setIsFollowing(followingStatus);
        }
    }, [userId]);

    const handleFollow = () => {
        const newStatus = !isFollowing;
        setIsFollowing(newStatus);
        setCurrentFollowers(prev => (newStatus ? prev + 1 : prev - 1));
        // Store following status in localStorage (mock)
        localStorage.setItem(`following_${userId}`, newStatus);
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        User Not Found
                    </h2>
                    <p className="text-gray-600 mb-4">
                        The user you're looking for doesn't exist.
                    </p>
                    <Button onClick={() => navigate(-1)}>Go Back</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Profile Header - Centered */}
            <div className="bg-white">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col items-center text-center">
                        {/* Avatar */}
                        <div className="relative mb-4">
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-primary/20"
                            />
                            <div className="absolute bottom-0 right-0 bg-green-500 rounded-full w-4 h-4 border-2 border-white"></div>
                        </div>

                        {/* User Name */}
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                            {user.name}
                        </h1>

                        {/* Bio */}
                        <p className="text-gray-600 mb-4 max-w-2xl">
                            {user.bio}
                        </p>

                        {/* Follow Button */}
                        <Button
                            variant={isFollowing ? "outline" : "primary"}
                            size="sm"
                            onClick={handleFollow}
                            icon={isFollowing ? UserCheck : UserPlus}
                            iconClassName="w-4 h-4"
                        >
                            {isFollowing ? "Following" : "Follow"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stats Bar - Centered */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-center gap-8">
                        <UserStatCard
                            value={userRecipes.length}
                            label="Recipes"
                        />
                        <UserStatCard
                            value={currentFollowers}
                            label="Followers"
                        />
                        <UserStatCard
                            value={user.following}
                            label="Following"
                        />
                    </div>
                </div>
            </div>

            {/* User's Recipes */}
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Recipes by {user.name}
                </h2>

                {userRecipes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {userRecipes.map(recipe => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl">
                        <p className="text-gray-500">
                            No recipes uploaded yet.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDetails;
