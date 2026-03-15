import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createRoast, createSubmission } from '@/db';
import type { RoastFeedback, RoastResponse } from '@/types/roast';

const roastRequestSchema = z.object({
  code: z.string().min(1),
  language: z.string(),
  roastMode: z.enum(['brutal', 'roast']).default('roast'),
});

const roastResultSchema = z.object({
  score: z.number().min(0).max(10),
  feedback: z.array(
    z.object({
      line: z.number(),
      column: z.number().optional(),
      severity: z.enum(['error', 'warning', 'info', 'suggestion']),
      message: z.string(),
      category: z.string().optional(),
    }),
  ),
  summary: z.string(),
});

async function generateRoastWithAI(
  code: string,
  language: string,
  mode: 'brutal' | 'roast',
) {
  const tone =
    mode === 'brutal'
      ? 'Be extremely harsh, sarcastic, and unforgiving. No mercy.'
      : 'Be honest but somewhat playful. Point out real issues but also acknowledge occasional good decisions.';

  const { object } = await generateObject({
    model: openai('gpt-4o'),
    schema: roastResultSchema,
    prompt: `
You are an expert code reviewer. Your job is to roast terrible code.

${tone}

The code to review is in ${language}.
Code:
\`\`\`${language}
${code}
\`\`\`

Respond with a JSON object containing:
- score: A number from 0-10 (0 = completely broken, 10 = actually good code)
- feedback: An array of issues found, each with:
  - line: The line number where the issue is
  - column: (optional) The column number
  - severity: "error" for serious bugs, "warning" for bad practices, "info" for minor issues, "suggestion" for improvements
  - message: What you think about this code (keep it short, savage, and entertaining)
  - category: (optional) like "security", "performance", "readability", "best-practice", "logic"
- summary: A 1-2 sentence roast summary of the entire code

Make your feedback entertaining but accurate. Don't hold back.
`,
  });

  return object;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, language, roastMode } = roastRequestSchema.parse(body);

    const submission = await createSubmission({
      code,
      language,
      roastMode,
    });

    let roastResult: {
      score: number;
      feedback: RoastFeedback;
      summary: string;
    };

    try {
      roastResult = await generateRoastWithAI(code, language, roastMode);
    } catch (aiError) {
      console.error('AI generation failed, using fallback:', aiError);
      roastResult = {
        score: Math.random() * 5 + 1,
        feedback: [
          {
            line: 1,
            severity: 'error' as const,
            message:
              'AI failed to analyze this code. Consider submitting again.',
            category: 'system',
          },
        ],
        summary:
          'The AI failed to roast this code. Consider submitting again later.',
      };
    }

    const roast = await createRoast({
      submissionId: submission.id,
      score: roastResult.score,
      feedback: roastResult.feedback,
      summary: roastResult.summary,
    });

    const response: RoastResponse = {
      id: roast.id,
      submissionId: submission.id,
      score: roastResult.score,
      feedback: roastResult.feedback,
      summary: roastResult.summary,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Roast error:', error);
    return NextResponse.json(
      { error: 'Failed to roast code' },
      { status: 500 },
    );
  }
}
