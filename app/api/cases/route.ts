import cases from '@/app/data/cases.json';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(cases);
}
