
import React from "react";
import { motion } from "framer-motion";
import MainLayout from "../components/MainLayout";
import { Search } from "lucide-react";
import { Input } from "../components/ui/Input";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ServiceCard from "../components/services/ServiceCard";
import { loadServices } from "../lib/serviceApi";
import { loadCategory } from "../lib/categoryApi";



const ServicesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [ categories, setCategories ] = useState()
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);


  useEffect(() => {
    const featchData = async() => {
      try {
          
            const [data, res] = await Promise.all([
              loadServices(),
              loadCategory()
    
            ]) 
            console.log(res)
           if(data.services) {
              setServices(data.services);
              setFilteredServices(data.services)
            }
            if (res.categories) {
              setCategories(res.categories);
            }
          } catch (error) {
            console.error("Error loading services:", error);
            toast.error("Failed to load services");
          }
        }
        featchData()
  
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const results = services.filter(service =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (service.description && service.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredServices(results);
    } else {
      setFilteredServices(services);
    }
  }, [searchQuery, services]);


  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="container py-8"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Our Services</h1>
          <p className="text-muted-foreground">
            Explore our wide range of services designed to meet your needs.
          </p>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for services..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => {
            return (
              <ServiceCard
                key={service.id}
                service={service}
              />
            );
          })}
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default ServicesPage;