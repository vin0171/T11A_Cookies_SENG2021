import { createGlobalStyle } from 'styled-components'; 
import { BrowserRouter } from 'react-router-dom';
import Router from './Router';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();


export const API_URL = 'http://localhost:8080';
export const API_URL2 = 'https://gzwmrl0sz7.execute-api.us-east-1.amazonaws.com/';

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
