import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MainLayout from "../components/MainLayout";
import { Search, Loader2 } from "lucide-react"; // Added Loader2 icon
import { Input } from "../components/ui/Input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/Select"; // Import Select components
import { toast } from "sonner";
import ServiceCard from "../components/services/ServiceCard";
import { loadServices } from "../lib/serviceApi";
import { loadCategory } from "../lib/categoryApi";
import { Button } from "../components/ui/button"; // Assuming you might use this for a retry button

const ServicesPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all"); // State for selected category
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state for fetch failures

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [servicesData, categoriesRes] = await Promise.all([
                    loadServices(),
                    loadCategory()
                ]);

                if (servicesData && Array.isArray(servicesData.services)) {
                    setServices(servicesData.services);
                    setFilteredServices(servicesData.services); // Initialize filtered services
                } else {
                    // Handle case where servicesData.services is not an array
                    setServices([]);
                    setFilteredServices([]);
                    toast.warning("No services found from the API.");
                }

                if (categoriesRes && Array.isArray(categoriesRes.categories)) {
                    setCategories(categoriesRes.categories);
                } else {
                    setCategories([]);
                    toast.warning("No categories found from the API.");
                }
            } catch (err) {
                console.error("Error loading data:", err);
                setError("Failed to load services. Please try again later.");
                toast.error("Failed to load services.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Empty dependency array means this runs once on mount

    // Effect for filtering based on search query and selected category
    useEffect(() => {
        let currentFiltered = services;

        // Apply category filter first
        if (selectedCategory !== "all") {
            currentFiltered = currentFiltered.filter(
                service => service.category_id && service.category_id === parseInt(selectedCategory)
            );
        }

        // Apply search query filter
        if (searchQuery) {
            currentFiltered = currentFiltered.filter(
                service =>
                    (service.title && service.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (service.description && service.description.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        setFilteredServices(currentFiltered);
    }, [searchQuery, selectedCategory, services]);


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

                {/* Search and Filter Section */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search for services..."
                            className="pl-10 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {categories.length > 0 && (
                        <Select onValueChange={setSelectedCategory} value={selectedCategory}>
                            <SelectTrigger className="md:w-[200px] w-full">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent className='bg-black text-white'>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map(category => (
                                    <SelectItem  key={category.id} value={String(category.id)}>
                                        {category.name || `Category ${category.id}`} {/* Use name if available, else a placeholder */}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>

                {/* Content Display based on Loading/Error/Data */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="ml-2 text-muted-foreground">Loading services...</span>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <h2 className="text-xl font-bold text-destructive mb-4">Error Loading Services</h2>
                        <p className="text-muted-foreground mb-6">{error}</p>
                        {/* Optionally add a retry button */}
                        {/* <Button onClick={() => window.location.reload()}>Retry</Button> */}
                    </div>
                ) : filteredServices.length === 0 ? (
                    <div className="text-center py-12">
                        <h2 className="text-xl font-bold mb-4">No Services Found</h2>
                        <p className="text-muted-foreground">
                            {searchQuery || selectedCategory !== "all"
                                ? "Your search and filter returned no results."
                                : "There are no services available at the moment."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredServices.map(service => (
                            <ServiceCard
                                key={service.id}
                                service={service}
                            />
                        ))}
                    </div>
                )}
            </motion.div>
        </MainLayout>
    );
};

export default ServicesPage;