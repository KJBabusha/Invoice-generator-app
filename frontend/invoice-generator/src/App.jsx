import{
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
}from "react-router-dom";
import {Toaster} from "react-hot-toast";
import LandingPage from "./pages/LandingPage/LandingPage";
import SignUp from "./pages/Auth/SignUp";
import Login from "./pages/Auth/Login";
import ProfilePage from "./pages/Profile/ProfilePage";
import InvoiceDetail from "./pages/invoices/InvoiceDetail";
import CreateInvoice from "./pages/invoices/CreateInvoice";
import AllInvoices from "./pages/invoices/AllInvoices";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard/Dashboard";
import { AuthProvider } from "./context/AuthContext";


const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public React */}
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/login" element={<Login/>}/>

          {/* Procted Routes  */}
          <Route path= "/" element={<ProtectedRoute/>}>
            <Route path = "dashboard" element= {<Dashboard/>}/>   
            <Route path = "invoice" element= {<AllInvoices/>}/>   
            <Route path = "invoice/new" element= {<CreateInvoice/>}/>   
            <Route path = "invoice/:id" element= {<InvoiceDetail/>}/>   
            <Route path = "profile" element= {<ProfilePage/>}/>   
          </Route>

          {/* Catch all route  */}
          <Route path=" *" element = {<Navigate to="/" replace />}/>
        </Routes> 
      </Router>

      <Toaster
        toastOptions={{
          className:"",
          style:{
            fontSize:"13px"
          },
        }}
      />
      
    </AuthProvider>
  )
}

export default App