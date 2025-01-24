import { NextResponse } from 'next/server';
import { supabase } from '../../../utils/supabase';


export async function GET() {
    try {
        const { data: test_schedules, error } = await supabase
            .from('test_schedules')
            .select('*');

        if (error) {
            throw new Error(error.message);
        }

        return NextResponse.json(test_schedules);
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'An unexpected error occurred.' }, { status: 500 });
    }
}


export async function POST(request: Request) {
    try {
        const { test_suite_name, test_suite_id, start_time, cadence, user_id } = await request.json();

        console.log('Payload received:', { test_suite_name, test_suite_id, start_time, cadence, user_id }); // Debug payload

        if (!test_suite_name || !test_suite_id || !start_time || !cadence || !user_id) {
            throw new Error('Missing required fields');
        }

        const { error: fetchError } = await supabase
            .from('test_schedules')
            .select('*');

        if (fetchError) {
            console.error('Fetch error:', fetchError); // Log fetch error
            throw fetchError;
        }

        const { data, error: insertError } = await supabase.from('test_schedules').insert([
            { test_suite_name, test_suite_id, start_time, cadence, user_id  },
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


export async function PUT(request: Request) {
    try {
        const { id, test_suite_name, start_time, cadence } = await request.json();

        console.log('Payload received:', id, test_suite_name, start_time, cadence); // Debug payload

        if (!id) return NextResponse.json({ error: "Schedule ID is required" });

        // Validate input
        if (!test_suite_name || !start_time) {
            throw new Error("Invalid input data");
        }

        // Update the schedule in Supabase
        const { data, error } = await supabase
            .from('test_schedules')
            .update({ test_suite_name: test_suite_name, start_time: start_time, cadence: cadence })
            .eq('id', id)
            .select();

        if (error) {
            console.error("Error updating schedule:", error.message);
            return NextResponse.json({ error: error.message });
        }

        return NextResponse.json({ message: 'Schedule updated successfully.', data });
    } catch (error) {
        console.error('Unexpected error:', error); // Log unexpected error
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'An unexpected error occurred.' },
            { status: 500 }
        );
    }
}