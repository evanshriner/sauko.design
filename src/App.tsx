import './App.css';
import { ThemeProvider } from '@emotion/react';
import { theme } from './theme/theme';
import Home from './modules/home';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Home />
    </ThemeProvider>
  );
}

export default App;
