import { FlexDiv, useWindow } from '@apple-pie/slice';

function App() {
	const { height } = useWindow();
	return (
		<FlexDiv
			width={'viewport'}
			height={height}
			alignItems={'center'}
			justify={'center'}
		>
			<h1>👋 Welcome.</h1>
		</FlexDiv>
	);
}

export default App;
