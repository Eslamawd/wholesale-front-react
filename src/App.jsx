
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { AnimatePresence } from 'motion/react'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import NotFound from './Pages/NotFound'
import { Toaster } from './components/ui/Toster'
import { Toaster as Sonner } from "sonner";

import Home from './Pages/Home'
import Login from './Pages/Login'
import Register from './Pages/Register'
import ResetPassword from './Pages/ResetPassword'
import AdminPanel from './Pages/AdminPanal'
import Services from './Pages/Services'
import ServiceDetail from './Pages/ServiceDetail'
import About from './Pages/About'
import Contact from './Pages/Contact'
import Checkout from './Pages/Checkout'
import Account from './Pages/Account'
import Payment from './Pages/Payment'
import { User } from 'lucide-react'
import UserRoute from './components/UserRoute'

function App() {


  return (
    <>
    <AuthProvider>
        <Toaster />
                  <Sonner/>
                  <BrowserRouter>
                 
                    <AnimatePresence mode="wait">
                      <Routes>
                       
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/services/:id" element={<ServiceDetail />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route element={
                          <UserRoute />
                        }>
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/payment" element={<Payment/>} />
                        </Route>

                        
                     
                        
                        <Route path="/reset-password" element={<ResetPassword />} />

                             

                         <Route path="/admin/*" element={
                        
                            <AdminPanel />
                          
                        } />

                     

                     
                    
                        
                        {/* 404 route */}
                        <Route path="*" element={<NotFound/>} />
                    
                      </Routes>
                    </AnimatePresence>
                  
                  </BrowserRouter>
                  </AuthProvider>

    </>
  )
}

export default App
