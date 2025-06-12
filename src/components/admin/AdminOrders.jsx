import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "../ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Clock, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from 'sonner';
import { getAllOrders } from '../../lib/adminApi';
import { useNavigate } from 'react-router-dom';
import { updateOrder } from '../../lib/orderApi';



// دالة جلب طلبات الجملة

// دالة تحديث حالة الطلب إلى مكتمل
const resolveOrderRequest = async (orderId) => {
  const response = await fetch(`/api/orders/${orderId}/resolve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to resolve order');
  return await response.json();
};

const AdminOrders = () => {
   const [orders, setOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const navigate = useNavigate()


  const processOrders = (orders) => {
    if (!orders || !Array.isArray(orders)) return [];
    return orders.map(order => {
      if (Array.isArray(order.services)) {
        order.services = order.services.map(service => {
          return {
            ...service,
            title: service?.title || `Service ${service?.id || 'Unknown'}`
          };
        });
      } else {
        order.services = [];
      }
      return order;
    });
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setIsLoading(true);
        const res = await getAllOrders();

        if (res.orders) {
          const processed = processOrders(res.orders);
          setOrders(processed);
          setPendingOrders(processed.filter(o => o.payment_status === 'pending'));
          setCompletedOrders(processed.filter(o => o.payment_status === 'completed'));
        }
      } catch (error) {
        toast.error("Failed to fetch orders");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);

  const resolveOrder = async (order) => {
    try {
      await updateOrder(order.id,{payment_status:'completed'});
      toast.success("Order status updated");

      const updated = orders.map(o =>
        o.id === order.id ? { ...o, payment_status: 'completed' } : o
      );

      setOrders(updated);
      setPendingOrders(updated.filter(o => o.payment_status === 'pending'));
      setCompletedOrders(updated.filter(o => o.payment_status === 'completed'));
    } catch (error) {
      console.error("Error resolving order:", error);
      toast.error("Failed to update order status");
    }
  };

  const displayOrders = activeTab === "pending"
    ? pendingOrders
    : activeTab === "completed"
      ? completedOrders
      : orders;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle>Orders</CardTitle>
          <CardDescription>Orders placed by users</CardDescription>
        </div>
        {pendingOrders.length > 0 && (
          <Badge variant="destructive" className="flex gap-1">
            <Clock className="h-3 w-3" />
            {pendingOrders.length} Pending
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending" className="relative">
              Pending
              {pendingOrders.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {pendingOrders.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : displayOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No orders found for this tab
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Id</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Services</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">{order.id}</TableCell>
                      <TableCell>{order.user?.email || 'Unknown'}</TableCell>
                      <TableCell>
                        {Array.isArray(order.services) && order.services.length > 0 ? (
                          order.services.map((service, index) => (
                            <div key={index}>
                      <Button 
                                  variant="ghost" 
                                   className="w-full justify-start relative" 
                                   onClick={() => navigate(`/services/${service.id}`)}
                                    >
                   {service.title}
                  </Button>
                              </div>
                          ))
                        ) : (
                          <div>No services listed</div>
                        )}
                      </TableCell>
                      <TableCell>
                        ${order.total?.toFixed(2) || order.totalPrice?.toFixed(2) || '0.00'}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${
                          order.payment_status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.payment_status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          order.payment_status === 'pending' ? 'bg-amber-100 text-amber-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.payment_status === 'pending' && <Clock className="h-3 w-3" />}
                          {order.payment_status === 'completed' && <CheckCircle className="h-3 w-3" />}
                          {order.payment_status || 'Unknown'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {order.created_at
                          ? format(new Date(order.created_at), 'PPP')
                          : 'Unknown date'}
                      </TableCell>
                      <TableCell>
                        {order.payment_status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1"
                            onClick={() => resolveOrder(order)}
                          >
                            <CheckCircle className="h-3 w-3" />
                            Mark as Completed
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="bg-muted/50 p-3 text-xs text-muted-foreground flex justify-between">
        <span>Total Orders: {orders.length}</span>
        <div className="flex gap-4">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-500"></span>
            Pending: {pendingOrders.length}
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            Completed: {completedOrders.length}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export { AdminOrders };
