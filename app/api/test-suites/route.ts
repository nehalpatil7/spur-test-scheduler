import { NextResponse } from 'next/server';
import { supabase } from '../../../utils/supabase';


export async function GET() {
    try {
        const { data: suites, error } = await supabase
            .from('test_suites')
            .select('*');

        if (error) {
            throw new Error(error.message);
        }

        return NextResponse.json(suites);
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'An unexpected error occurred.' }, { status: 500 });
    }
}