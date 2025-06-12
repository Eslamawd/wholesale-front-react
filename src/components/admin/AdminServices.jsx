// src/components/admin/AdminServices.jsx

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { PlusCircle, Pencil, Trash2, Search } from "lucide-react";
import { Input } from "../ui/Input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/Dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { toast } from "sonner";

import CreateServiceForm from "./customization/CreateServiceForm";
import UpdateServiceForm from "./customization/UpdateServiceForm";
import { deleteService, loadServices } from "../../lib/serviceApi";
import { loadCategory } from "../../lib/categoryApi";

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const [data, res] = await Promise.all([loadServices(), loadCategory()]);
        if (data.services) {
          setServices(data.services);
        }
        if (res.categories) {
          setCategories(res.categories);
          setActiveTab(res.categories[0]?.id?.toString() || "");
        }
      } catch (error) {
        console.error("Error loading services:", error);
        toast.error("Failed to load services");
      }
    };
    fetchServices();
  }, []);

  const handleEditService = (service) => {
    setSelectedService(service);
    setIsNew(false);
    setIsUpdate(true);
    setIsDialogOpen(true);
  };

  const handleAddNewService = () => {
    setIsNew(true);
    setIsUpdate(false);
    setSelectedService(null);
    setIsDialogOpen(true);
  };

  const handleDeleteService = (service) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteService = async () => {
    if (!selectedService) return;
    setIsDeleting(true);
    try {
      await deleteService(selectedService.id);
      toast.success("Service deleted");
      setIsDeleteDialogOpen(false);
      setSelectedService(null);
      setServices((prev) => prev.filter((serv) => serv.id !== selectedService.id));
    } catch (err) {
      console.error("Error deleting service:", err);
      toast.error("Failed to delete service");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredServices = services.filter(
    (s) =>
      (!activeTab || s.category_id?.toString() === activeTab) &&
      (s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Service Management</h2>
        <Button onClick={handleAddNewService}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="relative flex-grow mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v)}>
        <TabsList className="mb-4 overflow-x-auto">
          <TabsTrigger key={'0'} value="" >All</TabsTrigger>
          {categories?.map((category) => (
            <TabsTrigger key={category.id} value={category.id.toString()}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <ServiceList
            services={filteredServices}
            onEdit={handleEditService}
            onDelete={handleDeleteService}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>{isNew ? "Add New Service" : "Update Service"}</DialogTitle>
            <DialogDescription>
              {isNew ? "Fill in the details to create a new service." : "Edit the service details."}
            </DialogDescription>
          </DialogHeader>

          {isNew ? (
            <CreateServiceForm
              onSuccess={(newService) => {
                setServices((prev) => [...prev, newService]);
                setIsDialogOpen(false);
              }}
              onCancel={() => setIsDialogOpen(false)}
            />
          ) : (
            <UpdateServiceForm
              service={selectedService}
              onSuccess={(updatedService) => {
                setServices((prev) =>
                  prev.map((serv) => (serv.id === updatedService.id ? updatedService : serv))
                );
                setIsDialogOpen(false);
              }}
              onCancel={() => setIsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-red-200">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedService?.name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteService}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminServices;

const ServiceList = ({ services, onEdit, onDelete }) => {
  if (services.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No services found. Add a new service to get started.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service) => (
        <Card key={service.id} className="overflow-hidden">
          <div className="aspect-video relative bg-gray-100">
            {service.image_path && (
              <img
                src={service.image_path}
                alt={service.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/placeholder.svg";
                }}
              />
            )}
          </div>

          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-lg">{service.title}</CardTitle>
          </CardHeader>

          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {service.description}
            </p>

            <div className="flex items-center justify-between mt-2">
              <span className="font-semibold">${parseFloat(service.price).toFixed(2)}</span>
              <div className="flex space-x-1">
                <Button size="sm" variant="outline" onClick={() => onEdit(service)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  onClick={() => onDelete(service)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
