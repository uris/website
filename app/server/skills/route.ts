import { NextResponse } from 'next/server';
import { getSkillsAIData } from '@/skills/server';
import type { BaseResponse } from '@/src/lib/shared/types';

export async function GET(_req: Request) {
	try {
		const skills = getSkillsAIData();

		if (!skills) {
			const response: BaseResponse = {
				success: false,
				data: null,
				status: 404,
				message: 'Skills data not found',
			};
			return NextResponse.json(response, { status: response.status });
		}

		const response: BaseResponse = { success: true, data: skills, status: 200 };
		return NextResponse.json(response, { status: response.status });
	} catch {
		return NextResponse.json(
			{ success: false, data: null, status: 500, message: 'Unable to load data' },
			{ status: 500 },
		);
	}
}
