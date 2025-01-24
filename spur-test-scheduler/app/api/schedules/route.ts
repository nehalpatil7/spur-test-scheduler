import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);


export async function GET() {
    try {
        let { data: test_schedules, error } = await supabase
            .from('test_schedules')
            .select('*');

        if (error) {
            throw new Error(error.message);
        }

        console.log(test_schedules);

        return NextResponse.json(test_schedules);
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'An unexpected error occurred.' }, { status: 500 });
    }
}


// // POST API: Save a new schedule
// export async function POST(request: any) {
//     try {
//         const { test_suite_id, start_time, cadence } = await request.json();

//         // Validate input
//         if (!test_suite_id || !start_time || !cadence || cadence.length === 0) {
//             return NextResponse.json(
//                 { error: 'Missing required fields.' },
//                 { status: 400 }
//             );
//         }

//         // Check for overlapping schedules
//         const { data: existingSchedules, error: fetchError } = await supabase
//             .from('test_schedules')
//             .select('*')
//             .filter('test_suite_id', 'eq', test_suite_id);

//         if (fetchError) {
//             throw new Error(fetchError.message);
//         }

//         const overlapping = existingSchedules.some((schedule) => {
//             const scheduleStart = new Date(schedule.start_time).getTime();
//             const newStart = new Date(start_time).getTime();
//             return (
//                 scheduleStart === newStart &&
//                 cadence.some((day: string) => schedule.cadence.includes(day))
//             );
//         });

//         if (overlapping) {
//             return NextResponse.json(
//                 { error: 'Schedule overlaps with an existing one.' },
//                 { status: 400 }
//             );
//         }

//         // Insert new schedule into the database
//         const { data, error: insertError } = await supabase.from('test_schedules').insert([
//             {
//                 test_suite_id,
//                 start_time,
//                 cadence,
//             },
//         ]);

//         if (insertError) {
//             throw new Error(insertError.message);
//         }

//         return NextResponse.json({ message: 'Schedule saved successfully.', data });
//     } catch (error) {
//         return NextResponse.json(
//             { error: error instanceof Error ? error.message || 'An unexpected error occurred.' },
//             { status: 500 }
//         );
//     }
// }


export async function POST(request: any) {
    try {
        const { test_suite_id, start_time, cadence } = await request.json();

        console.log('Payload received:', { test_suite_id, start_time, cadence }); // Debug payload

        if (!test_suite_id || !start_time || !cadence) {
            throw new Error('Missing required fields');
        }

        const { data: existingSchedules, error: fetchError } = await supabase
            .from('test_schedules')
            .select('*');

        if (fetchError) {
            console.error('Fetch error:', fetchError); // Log fetch error
            throw fetchError;
        }

        const { data, error: insertError } = await supabase.from('test_schedules').insert([
            { test_suite_id, start_time, cadence },
        ]);

        if (insertError) {
            console.error('Insert error:', insertError); // Log insert error
            throw insertError;
        }

        return NextResponse.json({ message: 'Schedule saved successfully.', data });
    } catch (error) {
        console.error('Unexpected error:', error); // Log unexpected error
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'An unexpected error occurred.' },
            { status: 500 }
        );
    }
}
