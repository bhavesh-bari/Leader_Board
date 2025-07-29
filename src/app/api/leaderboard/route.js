import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/userModel';
import { validateJWT } from '../validateJWT'; 

export async function GET(request) {
    await dbConnect();

    try {
       
        const users = await User.find({})
            .sort({ totalPoints: -1, name: 1 })
            .select('name totalPoints imageUrl');

        let rank = 1;
        let lastPoints = -1;
        const leaderboard = users.map((user, index) => {
            if (user.totalPoints < lastPoints) {
                rank = index + 1;
            }
            lastPoints = user.totalPoints;
            
            return {
                _id: user._id,
                name: user.name,
                totalPoints: user.totalPoints,
                imageUrl: user.imageUrl,
                rank: rank,
            };
        });

        let currentUserData = null;
        try {
            const userId = validateJWT(request); 
            if (userId) {
                
                const foundUser = leaderboard.find(user => user._id.toString() === userId);
                
                if (foundUser) {
                    currentUserData = {
                        rank: foundUser.rank,
                        totalPoints: foundUser.totalPoints,
                       
                    };
                }
            }
        } catch (error) {
            console.error("JWT validation failed:", error.message);
            
        }

       
        return NextResponse.json({
            success: true,
            leaderboard,
            currentUserData, 
        });

    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            message: 'Server error while fetching leaderboard', 
            error: error.message 
        }, { status: 500 });
    }
}