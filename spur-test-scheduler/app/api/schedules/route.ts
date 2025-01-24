import { NextResponse } from 'next/server';
import { supabase } from '../../../utils/supabase';


export async function GET() {
    try {
        let { data: test_schedules, error } = await supabase
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


export async function POST(request: any) {
    try {
        const { test_suite_name, test_suite_id, start_time, cadence, user_id } = await request.json();

        console.log('Payload received:', { test_suite_name, test_suite_id, start_time, cadence, user_id }); // Debug payload

        if (!test_suite_name || !test_suite_id || !start_time || !cadence || !user_id) {
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
