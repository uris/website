import { FlexDiv, ProgressIndicator, useWindow } from '@apple-pie/slice';
import './App.css';

function App() {
	const win = useWindow();
	return (
		<FlexDiv
			width={'viewport'}
			height={win.height}
			alignItems={'center'}
			justify={'center'}
		>
			<ProgressIndicator show inline size={24} stroke={1.5} />
			arriving soon.
		</FlexDiv>
	);
}

export default App;
