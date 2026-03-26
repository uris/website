import { ThemeProvider } from '@apple-pie/slice';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const root = document.getElementById('root');
if (root) {
	createRoot(root).render(
		<StrictMode>
			<ThemeProvider system global>
				<App />
			</ThemeProvider>
		</StrictMode>,
	);
}
