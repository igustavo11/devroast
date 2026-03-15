'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  CodeEditorBody,
  CodeEditorHeader,
  CodeEditorRoot,
  MAX_LINES,
} from '@/components/ui/code-editor';
import { Toggle } from '@/components/ui/toggle';

const PLACEHOLDER_CODE = '';

export function CodeEditorSection() {
  const [code, setCode] = useState(PLACEHOLDER_CODE);
  const [roastMode, setRoastMode] = useState(true);
  const [_activeLang, setActiveLang] = useState('javascript');

  const lineCount = code.split('\n').length;
  const exceededLimit = lineCount > MAX_LINES;

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

        <Button size="md" disabled={exceededLimit}>
          $ roast_my_code
        </Button>
      </div>
    </div>
  );
}
