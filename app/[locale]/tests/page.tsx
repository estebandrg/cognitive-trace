'use client';

import TestModeSelection from '@/components/tests/orchestration/test-mode-selection';
import { DbTestButton } from '@/components/tests/orchestration/db-test-button';

export default function TestsPage() {
  // This page now only shows the mode selection
  // Individual routes handle their own logic
  return (
    <>
      <TestModeSelection />
      <DbTestButton />
    </>
  );
}
