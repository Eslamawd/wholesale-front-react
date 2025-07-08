import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/button";
import { ShoppingCart, Info, Check, Clock, Star, Gift, Zap, CreditCard, Badge } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ServiceCard = ({ 
    service, 
   
}) => {
    const navigate = useNavigate();
    const { user } = useAuth();

  

  

    return (
        <Card 
            className="overflow-hidden transition-all duration-300 hover:shadow-md h-full flex flex-col"
            onClick={()=> navigate(`/services/${service.id}`)}
            key={service.id}
        >
            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold line-clamp-1">{service.name_ar}</CardTitle> {/* Changed from service.name */}
                </div>
            </CardHeader>
            
            <CardContent className="px-4 py-2 flex-grow">
                <div className="relative aspect-video w-full mb-3 bg-gray-100 rounded-md overflow-hidden">
                    <img 
                        src={`${service.image }`} 
                        alt={service.name_en}  
                        className="object-cover w-full h-full"
                    />
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {service?.category?.name_en}
                </p>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {service?.price}
                </p>
                
                <div className="mt-auto">
                    <div className="flex justify-between items-baseline">
                        {/* Price display logic can go here if desired */}
                    </div>
                    {
                      user ? 
                      <Button 
                        className="w-full bg-black mt-3"
                        size="sm"
                        onClick={()=> navigate(`/services/${service.id}`)}
                      
                    >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Buy Now
                    </Button> :
                    <Button 
                        className="w-full bg-black mt-3"
                        size="sm"
                        onClick={()=> navigate(`/login`)}
                    >
                         <ShoppingCart className="h-4 w-4 mr-1" />
                        Buy Now
                    </Button>

                    }
                    
                    
                </div>
            </CardContent>
            
            <CardFooter className="px-4 py-3 pt-0 flex gap-2">
               

            </CardFooter>
            
        
        </Card>
    );
};

export default ServiceCard;