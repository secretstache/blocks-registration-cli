#!/usr/bin/env node

import { run } from '../src/index.js';

try {
  await run();
} catch (error) {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
}
