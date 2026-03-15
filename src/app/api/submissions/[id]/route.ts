import { type NextRequest, NextResponse } from 'next/server';
import { getSubmissionById } from '@/db';
import type { RoastFeedback, SubmissionDetail } from '@/types/roast';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const submission = await getSubmissionById(id);

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 },
      );
    }

    const response: SubmissionDetail = {
      id: submission.id,
      code: submission.code,
      language: submission.language,
      roastMode: submission.roast_mode,
      createdAt: submission.created_at,
      roast: submission.roast_id
        ? {
            id: submission.roast_id,
            score: submission.score as number,
            feedback: submission.feedback as RoastFeedback,
            summary: submission.roast_summary as string,
            createdAt: submission.roast_created_at as Date,
          }
        : null,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Submission fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submission' },
      { status: 500 },
    );
  }
}
