import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";

import { toast } from "sonner";
import { loadOrder } from "../lib/orderApi";
import MainLayout from "../components/MainLayout";



const Checkout = () => {

    const [orders, setOrders] = useState([])
 

  useEffect(() => {
 
      const fetchServices = async () => {
          try {
          
            const res = await loadOrder()
    
          
            console.log(res)
         
            if (res.orders) {
              setOrders(res.orders);
            }
          } catch (error) {
            console.error("Error loading services:", error);
            toast.error("Failed to load services");
          }
        };
        fetchServices();

  }, []);

 
  return (
    <MainLayout>
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Checkout</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Order Summary</h3>
              {orders.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-md border"
                >
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-green-900/20 dark:text-green-400">{item.total_price}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.payment_status === 'completed' 
                            ? 'bg-green-100 text-green-800 '
                            : 'bg-red-100 text-red-800 '
                        }`}>
                          {item.payment_status}
                        </span>
                  {item.services.map((serv) => (
                    <div>
                    <span>{serv.title} </span>
                    <span>{serv.price} </span>
                    </div>
                    
                  ))}
                </div>
              ))}
          
              </div>
          </div>

        </CardContent>
      </Card>
    </div>
    </MainLayout>
  );
};

export default Checkout;
