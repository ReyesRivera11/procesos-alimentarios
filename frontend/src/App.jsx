import { NextUIProvider } from "@nextui-org/react";
import { AuthProvider } from "./context/auth-context"
import AppRoutes from "./routes/AppRoutes"
import { BrowserRouter as Router } from 'react-router-dom';

function App() {

  return (
    <AuthProvider >
      <NextUIProvider>
        <Router>
          <AppRoutes />
        </Router>
      </NextUIProvider>
    </AuthProvider>


  )
}

export default App
