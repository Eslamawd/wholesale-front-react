import React from 'react' 
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Settings, User, ShoppingBag, MessageCircle, LogOut, LogIn } from 'lucide-react';
import { Button } from "../button";

import { useAuth } from '../../../context/AuthContext';


function NavigationLinks() {

    const navegate = useNavigate();

    const { user, logout } = useAuth();



     const handleWhatsAppRedirect = () => {
               window.open(`https://wa.me/96178991908`, '_blank');
           };


    const handleLogout = () => { 
       logout().then(() => {
       navegate('/'); // Redirect to home page
       }).catch((error) => {
        console.error('Logout failed:', error);
      // Optionally, you can show an error message to the user
        alert('Logout failed. Please try again.');
       });
            };

  return (
    <nav className="hidden md:flex items-center space-x-4">
      <Button 
        variant="default" 
        size="icon" 
        className="text-green-500 hover:text-white hover:bg-green-500"
        onClick={handleWhatsAppRedirect}
        title="Contact us on WhatsApp"
      >
        <MessageCircle className="h-5 w-5" />
      </Button>
      
   
      {user && user?.role === 'admin' ? (
        <Link to="/admin">
          <Button variant="outline" size="sm" className="flex gap-2 items-center">
            <Settings className="h-4 w-4" />
            <span>Admin</span>
          </Button>
        </Link>
      ) : null}
      
      {user ? (
        <>
          <Link to="/account">
            <Button variant="outline" size="sm" className="flex gap-2 items-center">
              <User className="h-4 w-4" />
              <span>Account</span>
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex gap-2 items-center"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
          
      
        </>
      ) : (
        <>
          <Link to="/login">
            <Button  variant="default" size="sm" className="flex  gap-2 items-center">
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </Button>
          </Link>
          
          <Link to="/register">
            <Button variant="outline" size="sm">Register</Button>
          </Link>
        </>
      )}
      
    </nav>
  )
}

export default NavigationLinks