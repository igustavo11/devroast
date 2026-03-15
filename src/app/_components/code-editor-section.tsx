'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  CodeEditorBody,
  CodeEditorHeader,
  CodeEditorRoot,
  MAX_LINES,
} from '@/components/ui/code-editor';
import { Toggle } from '@/components/ui/toggle';
import { trpc } from '@/trpc/client';

const PLACEHOLDER_CODE = '';

export function CodeEditorSection() {
  const router = useRouter();
  const [code, setCode] = useState(PLACEHOLDER_CODE);
  const [roastMode, setRoastMode] = useState(true);
  const [activeLang, setActiveLang] = useState('javascript');

  const lineCount = code.split('\n').length;
  const exceededLimit = lineCount > MAX_LINES;

  const submitRoast = trpc.roast.submit.useMutation({
    onSuccess(data) {
      router.push(`/roast/${data.submissionId}`);
    },
  });

  function handleRoast() {
    if (!code.trim() || exceededLimit || submitRoast.isPending) return;
    submitRoast.mutate({
      code,
      language: activeLang,
      roastMode: roastMode ? 'roast' : 'brutal',
    });
  }

  return (
    <div className="w-full max-w-[780px] flex flex-col gap-4">
      <CodeEditorRoot
        value={code}
        onChange={setCode}
        onLanguageDetected={setActiveLang}
        className="border border-border-primary bg-bg-input flex flex-col h-[360px]"
      >
        <CodeEditorHeader />
        <CodeEditorBody />
      </CodeEditorRoot>

      {/* Actions Bar */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <Toggle checked={roastMode} onCheckedChange={setRoastMode} />
            <span className="font-mono text-[13px] text-accent-green">
              roast mode
            </span>
          </div>
          <span className="font-mono text-[12px] text-text-tertiary">
            {'// maximum sarcasm enabled'}
          </span>
        </div>

        <Button
          size="md"
          disabled={exceededLimit || submitRoast.isPending || !code.trim()}
          onClick={handleRoast}
        >
          {submitRoast.isPending ? '$ roasting...' : '$ roast_my_code'}
        </Button>
      </div>

      {submitRoast.isError && (
        <p className="font-mono text-[12px] text-accent-red">
          {'// error: '}
          {submitRoast.error.message}
        </p>
      )}
    </div>
  );
}
