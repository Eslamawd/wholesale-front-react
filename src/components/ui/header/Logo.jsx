import React from 'react'
import { Link } from 'react-router-dom';
import { Store } from 'lucide-react';


function Logo() {
  return (
    <Link 
      to="/" 
      className="flex items-center transition-opacity hover:opacity-80"
    >
      <div className="flex items-center">
        <img src='/vite.jpg' alt="ServexLB Logo" className="w-16 h-16 mr-2 rounded-full" /> 
        <span className="font-bold text-xl">ServexLB</span>
      </div>
    </Link>
  );
}

export default Logo