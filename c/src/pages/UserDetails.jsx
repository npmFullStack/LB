// src/pages/UserDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import RecipeCard from "@/components/RecipeCard";
import { users, recipes } from "@/data/mock_data";
import { MapPin, Calendar, Users, Heart, UserPlus, UserCheck } from "lucide-react";

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
            const recipesByUser = recipes.filter(recipe => recipe.uploader.id === foundUser.id);
            setUserRecipes(recipesByUser);
            
            // Check if current user is following (mock - would come from auth state)
            // For demo, let's check localStorage or default to false
            const followingStatus = localStorage.getItem(`following_${userId}`) === 'true';
            setIsFollowing(followingStatus);
        }
    }, [userId]);

    const handleFollow = () => {
        const newStatus = !isFollowing;
        setIsFollowing(newStatus);
        setCurrentFollowers(prev => newStatus ? prev + 1 : prev - 1);
        // Store following status in localStorage (mock)
        localStorage.setItem(`following_${userId}`, newStatus);
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">User Not Found</h2>
                    <p className="text-gray-600 mb-4">The user you're looking for doesn't exist.</p>
                    <Button onClick={() => navigate(-1)}>Go Back</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Profile Header */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        {/* Avatar */}
                        <div className="relative">
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-primary/20"
                            />
                            <div className="absolute bottom-0 right-0 bg-green-500 rounded-full w-4 h-4 border-2 border-white"></div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                    {user.name}
                                </h1>
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
                            
                            <p className="text-gray-600 mb-4 max-w-2xl">{user.bio}</p>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>{user.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>Joined {user.joinDate}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex gap-8">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-800">{userRecipes.length}</div>
                            <div className="text-sm text-gray-500">Recipes</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-800">{currentFollowers}</div>
                            <div className="text-sm text-gray-500">Followers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-800">{user.following}</div>
                            <div className="text-sm text-gray-500">Following</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* User's Recipes */}
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
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
                        <p className="text-gray-500">No recipes uploaded yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDetails;