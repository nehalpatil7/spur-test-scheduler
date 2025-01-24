import { NextResponse } from 'next/server';

export async function GET() {
    const mockTestSuites = [
        {
            id: '1',
            name: 'Suite 1',
            created_at: '2024-10-10T07:00:00Z',
        },
        {
            id: '2',
            name: 'Suite 2',
            created_at: '2024-10-12T08:00:00Z',
        },
    ];

    return NextResponse.json(mockTestSuites);
}
