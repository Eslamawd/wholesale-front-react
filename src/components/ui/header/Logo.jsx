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
        <Store className="h-6 w-6 mr-2" />
        <span className="font-bold text-xl">ServexLB</span>
      </div>
    </Link>
  );
}

export default Logo