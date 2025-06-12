import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/button";
import { ShoppingCart, Info, Check, Clock, Star, Gift, Zap, CreditCard, Badge } from 'lucide-react';

import { toast } from 'sonner';

import PurchaseDialog from '../../components/PurchaseDialog';
import { useNavigate } from 'react-router-dom';



const ServiceCard = ({ 
  service, 
  onClick,
}) => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);


  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    
    
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  



  const showPurchaseConfirmation = async () => {
 
  
    setIsConfirmDialogOpen(true);
  };

  const handlePurchase = () => {
    setIsConfirmDialogOpen(false);
    toast.success('Purchase completed', {
      description: `Your purchase of ${service.name} was successful`,
    });
  };

  return (
    <Card 
      className="overflow-hidden transition-all duration-300 hover:shadow-md h-full flex flex-col"
      onClick={handleCardClick}
      key={service.id}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-1">{service.name}</CardTitle>
        
        </div>
    
      </CardHeader>
      
      <CardContent className="px-4 py-2 flex-grow">
        <div className="relative aspect-video w-full mb-3 bg-gray-100 rounded-md overflow-hidden">
          <img 
            src={`${service.image_path }`} 
            alt={service.name} 
            className="object-cover w-full h-full"
          />
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {service.description || 'No description available'}
        </p>
        

        
        <div className="mt-auto">
          <div className="flex justify-between items-baseline">
        
          </div>
          
          <Button 
            className="w-full bg-black mt-3"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              showPurchaseConfirmation();
            }}
            disabled={isPurchasing}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Buy Now
          </Button>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-3 pt-0 flex gap-2">
        <Button 
          className="flex-1"
          size="sm"
          onClick={handleAddToCart}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </span>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-1" /> Add to Cart
            </>
          )}
        </Button>
        
    { service && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={()=> navigate(`/services/${service.id}`)}
          >
            <Info className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
      
      <PurchaseDialog
        service={service}
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        onPurchase={handlePurchase}
      />
    </Card>
  );
};

export default ServiceCard;

