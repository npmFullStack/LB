// src/components/UserStatCard.jsx
import React from "react";

const UserStatCard = ({ value, label }) => {
    return (
        <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
        </div>
    );
};

export default UserStatCard;
