import { createGlobalStyle } from 'styled-components'; 
import { BrowserRouter } from 'react-router-dom';
import Router from './Router';

export const API_URL = 'http://localhost:5005';

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
  }
  
  #root {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .MuiButton-root {
    background-color: #007BFF !important;
    color: white !important;
    &:hover {
      background-color: #0056b3 !important;
    }
  }
`
function App() {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </>
  );
}

export default App;
