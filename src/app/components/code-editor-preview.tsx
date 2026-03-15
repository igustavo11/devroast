'use client';

import { useState } from 'react';
import {
  CodeEditorBody,
  CodeEditorHeader,
  CodeEditorRoot,
} from '@/components/ui/code-editor';

const SAMPLE_JS = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }

  if (total > 100) {
    console.log("discount applied");
    total = total * 0.9;
  }

  // TODO: handle tax calculation
  return total;
}`;

const SAMPLE_PY = `def calculate_total(items):
    total = sum(item['price'] for item in items)

    if total > 100:
        print("discount applied")
        total *= 0.9

    # TODO: handle tax calculation
    return total`;

export function CodeEditorPreview() {
  const [code, setCode] = useState(SAMPLE_JS);
  const [codePy, setCodePy] = useState(SAMPLE_PY);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Auto-detect demo */}
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[11px] text-text-tertiary">
          {'// javascript — auto-detected'}
        </span>
        <CodeEditorRoot
          value={code}
          onChange={setCode}
          className="w-full border border-border-primary bg-bg-input flex flex-col h-[240px]"
        >
          <CodeEditorHeader />
          <CodeEditorBody />
        </CodeEditorRoot>
      </div>

      {/* Python demo */}
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[11px] text-text-tertiary">
          {'// python — auto-detected'}
        </span>
        <CodeEditorRoot
          value={codePy}
          onChange={setCodePy}
          className="w-full border border-border-primary bg-bg-input flex flex-col h-[200px]"
        >
          <CodeEditorHeader />
          <CodeEditorBody />
        </CodeEditorRoot>
      </div>
    </div>
  );
}
