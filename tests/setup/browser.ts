import 'vitest-browser-react';
import '@apple-pie/slice/styles.css';
import '../../app/globals.css';

// vitest-browser-react automatically unmounts rendered components after each test.
// Add providers and reset application stores explicitly in suites that use them.
