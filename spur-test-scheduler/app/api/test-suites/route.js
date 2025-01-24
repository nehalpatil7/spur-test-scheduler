import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const { data: suites, error } = await supabase
            .from('test_suites')
            .select('*');

            console.log(data);
        if (error) {
            throw new Error(error.message);
        }

        return NextResponse.json(suites);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}