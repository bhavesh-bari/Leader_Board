import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/userModel';
import { validateJWT } from '../validateJWT'; // Import your JWT helper

export async function GET(request) {
    await dbConnect();

    try {
        // 1. Fetch and create the full leaderboard list (same as before)
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

        // 2. Check for a valid token to identify the current user
        let currentUserData = null;
        try {
            const userId = validateJWT(request); // This will throw an error if token is invalid
            if (userId) {
                // Find the current user within the leaderboard array we just created
                const foundUser = leaderboard.find(user => user._id.toString() === userId);
                
                if (foundUser) {
                    currentUserData = {
                        rank: foundUser.rank,
                        totalPoints: foundUser.totalPoints,
                        // You can add more fields here if needed
                    };
                }
            }
        } catch (error) {
            // This is not a critical error; it just means no user is logged in.
            // We can proceed without current user data.
        }

        // 3. Send the response with both the leaderboard and current user data
        return NextResponse.json({
            success: true,
            leaderboard,
            currentUserData, // This will be the user's data or null
        });

    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            message: 'Server error while fetching leaderboard', 
            error: error.message 
        }, { status: 500 });
    }
}