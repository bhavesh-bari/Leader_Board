import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/userModel';
import { validateJWT } from '../validateJWT';

export async function GET(request) {
    await dbConnect();
    try {
        const userId = validateJWT(request);
        const user = await User.findById(userId).select('history totalPoints');
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        const sortedHistory = user.history.sort((a, b) => new Date(b.date) - new Date(a.date));
        return NextResponse.json({
            history: sortedHistory,
            totalPoints: user.totalPoints,
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Unauthorized or server error', error: error.message }, { status: 401 });
    }
}