import { NextResponse } from 'next/server';

export async function GET() {
    const mockSchedules = [
        {
            id: '1',
            test_suite_name: 'Demo Suite',
            start_time: '2024-10-10T07:00:00Z',
        },
        {
            id: '2',
            test_suite_name: 'Authentication Suite',
            start_time: '2024-10-12T08:00:00Z',
        },
    ];

    return NextResponse.json(mockSchedules);
}
