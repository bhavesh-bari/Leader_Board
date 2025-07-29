import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/userModel';
import { validateJWT } from '../validateJWT';

export async function POST(request) {
    await dbConnect();
    try {
        const userId = validateJWT(request);
        const { fromUser } = await request.json();
        const pointsClaimed = Math.floor(Math.random() * 10) + 1;
        const newHistoryEntry = {
            userName: fromUser.name,
            imageUrl: fromUser.imageUrl,
            points: pointsClaimed,
        };
        const updatedUser = await User.findByIdAndUpdate(userId, {
            $inc: { totalPoints: pointsClaimed },
            $push: { history: { $each: [newHistoryEntry], $position: 0 } }
        }, { new: true }).select('totalPoints');

        if (!updatedUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/socket`, { method: 'POST' });
        
        return NextResponse.json({
            message: `Successfully claimed ${pointsClaimed} points!`,
            pointsClaimed: pointsClaimed,
            newTotalPoints: updatedUser.totalPoints,
        });

    } catch (error) {
        return NextResponse.json({ message: 'Unauthorized or server error', error: error.message }, { status: 401 });
    }
}