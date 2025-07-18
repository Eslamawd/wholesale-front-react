import React, { useEffect, useState } from 'react'
import MainLayout from '../components/MainLayout'
import { motion } from 'framer-motion';

import { Link, useNavigate } from "react-router-dom";
import { 
  PlayCircle, 
  ShoppingCart, 
  Zap, 
  Shield, 
  Search,
  CreditCard,
  Clock,
  ArrowRight,
  Star,
  Gamepad2,
  ThumbsUp
} from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/Dialog';
import { Card, CardContent } from '../components/ui/Card';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { loadServices } from '../lib/serviceApi';
import { loadCategory } from '../lib/categoryApi';
import { toast } from 'sonner';


const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Regular Customer",
    comment: "I've been using Servexlb for all my streaming needs. Their service is incredibly fast and reliable. Highly recommended!",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Gamer",
    comment: "The gaming credits I purchased were delivered instantly. Great service with competitive prices. Will definitely use again!",
    avatar: "https://randomuser.me/api/portraits/men/55.jpg",
    rating: 5
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Content Creator",
    comment: "As a social media influencer, I need reliable services. Servexlb has been my go-to for all my digital service needs.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 4
  }
];



function Home() {
  const { user } = useAuth()  
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);




  useEffect(() => {
        const fetchData = async () => {
          
            try {
                const [servicesData, categoriesRes, ] = await Promise.all([
                    loadServices(),
                    loadCategory(),
                ]);

                if (servicesData && Array.isArray(servicesData.products.data)) {
                    setServices(servicesData.products.data);
                } else {
                    // Handle case where servicesData.services is not an array
                    setServices([]);
                    toast.warning("No services found from the API.");
                }

                if (categoriesRes && Array.isArray(categoriesRes.categories.data)) {
                    setCategories(categoriesRes.categories.data);
                } else {
                    setCategories([]);
                    toast.warning("No categories found from the API.");
                }

            
            } catch (err) {
                console.error("Error loading data:", err);
                toast.error("Failed to load services.");
            } 
        };

        fetchData();
    }, []); // Empty dependency array means this runs once on mount




    
  // Show purchase confirmation dialog



  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="space-y-16"
      >
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 to-primary/5 py-16 md:py-28">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <motion.h1 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Buy Streaming, Gaming, and Social Media Services Instantly
                </motion.h1>
                <motion.p 
                  className="text-xl text-muted-foreground"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Get instant access to premium digital services with guaranteed delivery and 24/7 support.
                </motion.p>
                
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link to="/services">
                    <Button size="lg" className="w-full sm:w-auto">
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      View Services
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      <PlayCircle className="mr-2 h-5 w-5" />
                      Get Started
                    </Button>
                  </Link>
                </motion.div>
                
                <motion.div 
                  className="relative mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <Input
                    type="search"
                    placeholder="Search for services..."
                    className="pl-10 py-6 text-base rounded-lg w-full shadow-sm"
                  />
                  <Button className="absolute right-1.5 top-1.5 hidden sm:flex">
                    Search
                  </Button>
                </motion.div>
              </div>
              
              <motion.div 
                className="rounded-xl overflow-hidden shadow-2xl border relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1000&auto=format&fit=crop" 
                  alt="Digital Services" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-6">
                  <p className="text-lg font-medium">Your one-stop shop for digital services</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>




        {/* Categories Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Browse by Category
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore our wide range of digital services designed to make your online experience better.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link to={`/categories/${category.id}`} key={category.id}>
                  <Card className="bg-card h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="bg-primary/10 rounded-full  flex items-center justify-center ">
                        <img 
                          src={category.image}
                          alt={category.name_en}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {category.name_ar}
                      </h3>
                     
                      <div className="text-primary font-medium flex items-center mt-auto">
                        Browse Services
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            
          </div>
           <Link to="/categories">
                <Button size="lg" variant="outline" className="mt-5">
                  View All Categories
                  <ArrowRight className="ml-2  h-4 w-4" />
                </Button>
              </Link>
        </section>

        {/* Featured Services Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Featured Services
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Check out our most popular digital services with instant delivery.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service) => (
                <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-48">
                    <img 
                      src={service.image} 
                      alt={service.name} 
                      className="w-full h-full object-cover"
                    />
                  
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{service.name_ar}</h3>
                      <span className="text-lg font-bold">${service.price}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {service.category.name_ar}
                      </span>
                {user ? (
  service.subscription ? (
    <Button size="sm" onClick={() => navigate(`/streams/${service.id}`)}>
      <Clock className="h-4 w-4 mr-2" />
      Subscribe Now
    </Button>
  ) : (
    <Button size="sm" onClick={() => navigate(`/services/${service.id}`)}>
      <CreditCard className="h-4 w-4 mr-2" />
      Order Now
    </Button>
  )
                        ) : (
                          <Button size="sm" onClick={() => navigate(`/login`)}>
                            <CreditCard className="h-4 w-4 mr-2" />
                            Order Now
                          </Button>
                        )}

                     
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Link to="/services">
                <Button size="lg" variant="outline">
                  View All Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Why Choose Servexlb?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We provide the best digital services with instant delivery and excellent support.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6">
                <div className="bg-primary/10 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Instant Delivery
                </h3>
                <p className="text-muted-foreground">
                  Get your services delivered instantly after purchase. No waiting needed.
                </p>
              </Card>

              <Card className="p-6">
                <div className="bg-primary/10 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Secure Payments
                </h3>
                <p className="text-muted-foreground">
                  All transactions are secure and encrypted for your peace of mind.
                </p>
              </Card>

              <Card className="p-6">
                <div className="bg-primary/10 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  24/7 Support
                </h3>
                <p className="text-muted-foreground">
                  Our dedicated support team is always ready to assist you with any issues.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                What Our Customers Say
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Don't just take our word for it - check out what our satisfied customers have to say.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="p-6">
                  <div className="flex items-start mb-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      <div className="flex mt-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star 
                            key={index} 
                            className={`w-4 h-4 ${index < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.comment}"</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Card className="bg-primary text-primary-foreground p-8 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                  <p className="text-primary-foreground/90 mb-6">
                    Create an account today and get access to all our premium digital services.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  { user ? null : (

                  <Link to="/register" className="w-full sm:w-auto">
                    <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                      Sign Up Now
                    </Button>
                  </Link>
                  )

                  }
                  <Link to="/services" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className=" border-white  hover:bg-white/20 w-full sm:w-auto">
                      Browse Services
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </section>

   
      </motion.div>
    </MainLayout>
  )
}

export default Home