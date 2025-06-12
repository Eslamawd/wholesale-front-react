import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Clock, Tag, Check,
  CreditCard, Minus, Plus
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import Header from '../components/Header';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../components/ui/Dialog";
import { Input } from "../components/ui/Input";
import { getServie } from '../lib/serviceApi';
import { addOrder } from '../lib/orderApi';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with real API
        const res = await getServie(id)
       
        setService(res.service);
      } catch (error) {
        console.error("Failed to fetch service:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const showPurchaseConfirmation = () => {
    setIsConfirmDialogOpen(true);
  };

  const handleBuyNow = async () => {
    setIsPurchasing(true);
    try {
      // Simulate API call
      await addOrder({ services: [{
        quantity: quantity,
        id: service.id
     },
     ]})
      setIsConfirmDialogOpen(false);
      navigate("/checkout"); // or a success page
    } catch (err) {
      console.error("Purchase failed", err);
    } finally {
      setIsPurchasing(false);
    }
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    } else if (e.target.value === '') {
      setQuantity(1);
    }
  };

  const totalPrice = service ? (service.price * quantity).toFixed(2) : '0.00';

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
            <p className="text-muted-foreground mb-6">The service you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/services">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Services
              </Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/services">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg shadow-sm p-6">
              <div className="flex flex-wrap items-center justify-between mb-4">
                 <div className="relative aspect-video w-full mb-3 bg-gray-100 rounded-md overflow-hidden">
          <img 
            src={`${service.image_path }`} 
            alt={service.name} 
            className="object-cover w-full h-full"
          />
        </div>
                <h1 className="text-2xl md:text-3xl font-bold">{service.title}</h1>
                <Badge variant="outline" className="mr-2">{service.category?.name}</Badge>
              </div>

              <p className="text-muted-foreground mb-6">{service.description}</p>

              <div className="flex flex-wrap gap-4 mb-8">
              
                <div className="flex items-center text-sm text-muted-foreground">
                  <Tag className="h-4 w-4 mr-1" />
                  ${service.price}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Features & Benefits</h3>
             
                  <p className="text-muted-foreground">No features available</p>
            
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-2">Purchase Options</h2>
              <p className="text-sm text-muted-foreground mb-4">Select your preferred options below</p>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-medium">Base Price:</span>
                  <span className="font-bold">${service.price}</span>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1.5">Quantity</label>
                  <div className="flex items-center">
                    <Button type="button" size="icon" variant="outline" className="h-9 w-9 rounded-r-none" onClick={decreaseQuantity} disabled={quantity <= 1}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="h-9 rounded-none border-x-0 w-16 px-0 text-center"
                    />
                    <Button type="button" size="icon" variant="outline" className="h-9 w-9 rounded-l-none" onClick={increaseQuantity}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Total Price:</span>
                  <span className="text-xl font-bold">${totalPrice}</span>
                </div>
                <Button className="w-full" size="lg" onClick={showPurchaseConfirmation}>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Buy Now
                </Button>
                <p className="mt-4 text-sm text-muted-foreground text-center">
                  Your purchase is protected by our satisfaction guarantee.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="bg-amber-100">
          <DialogHeader>
            <DialogTitle>Confirm Purchase</DialogTitle>
            <DialogDescription>
              Are you sure you want to purchase <strong>{service.name}</strong>?
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Base Price:</span>
              <span className="font-bold">${service.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Quantity:</span>
              <span>{quantity}</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="font-medium">Total Price:</span>
              <span className="font-bold">${totalPrice}</span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBuyNow} disabled={isPurchasing}>
              {isPurchasing ? "Processing..." : "Confirm Purchase"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceDetail;
