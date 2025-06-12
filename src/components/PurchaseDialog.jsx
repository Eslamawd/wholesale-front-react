
import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/Dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Loader2, Clock } from "lucide-react";

import { toast } from 'sonner';
import { addOrder } from '../lib/orderApi';
import { useAuth } from '../context/AuthContext';

export const PurchaseDialog = ({
  service,
  open,
  onPurchase,
  onOpenChange,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const { user } = useAuth()



 
 
    const handlePurchase = async (e) => {
    e.preventDefault();
    if (!service) {
      toast.error("please enter a service");
      return;
    }
    setIsProcessing(true);
    try {
      
 
     const res = await addOrder({ services: [{
        quantity: quantity,
        id: service.id
     },
     ]

    });
   
     if (res.id) {

      toast.success("Created New Order successfully!");
     
     }
     
    } catch (err) {
      console.error("Error creating service:", err);
      toast.error("Failed to create service. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };


  const handleSave = async (e) => {
      setQuantity(e)
      setTotalPrice(e * service.price)
  }


 


  
 

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] bg-amber-100">
          <DialogHeader>
            <DialogTitle>Complete Your Purchase</DialogTitle>
            <DialogDescription>
              Review your order details and confirm your purchase.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="bg-muted p-3 rounded-md">
              <div className="flex justify-between mb-1 text-sm">
                <span>Service:</span>
                <span className="font-medium">{service.title}</span>
              </div>
              
        
              
              <div className="flex justify-between mb-1 text-sm">
                <span>Quantity:</span>
                <span>{quantity}</span>
              </div>
              
              <div className="flex justify-between font-medium border-t pt-2 mt-2">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
        
         
              <div className="flex flex-col space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  name="quantity"
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => handleSave(parseInt(e.target.value) || 1)}
                />
              </div>
            
         
        
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handlePurchase} disabled={isProcessing }>
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isProcessing ? 'Processing...' : `Pay $${totalPrice.toFixed(2)}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
   
    </>
  );
};

export default PurchaseDialog;
