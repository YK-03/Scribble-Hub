import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// Initialize Firebase as the first step
import './firebase'

createRoot(document.getElementById("root")!).render(<App />);
