import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Clock, Tag, Check,
    CreditCard, Minus, Plus, Loader2
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
import { Label } from "../components/ui/Label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/Select";

import { getServie } from '../lib/serviceApi';
import { addOrder } from '../lib/orderApi';
import { toast } from 'sonner';

const ServiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isProcessingPurchase, setIsProcessingPurchase] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [extraParamsInput, setExtraParamsInput] = useState({});

    // State for parsed ZDDK data
    const [parsedZddkQtyValues, setParsedZddkQtyValues] = useState(null);
    const [parsedZddkRequiredParams, setParsedZddkRequiredParams] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getServie(id);
                const fetchedService = res.service;
                setService(fetchedService);

                // --- ZDDK Specific Parsing - CRITICAL FIX HERE ---
                let qtyValues = fetchedService.zddk_qty_values;
                if (typeof qtyValues === 'string') {
                    try {
                        qtyValues = JSON.parse(qtyValues);
                    } catch (e) {
                        console.error("Failed to parse zddk_qty_values:", e);
                        qtyValues = null; // Set to null if parsing fails
                    }
                }
                setParsedZddkQtyValues(qtyValues);

                let initialQuantity = 1;
                if (fetchedService.is_zddk_product && qtyValues) {
                    if (fetchedService.product_type === 'amount' && typeof qtyValues === 'object' && qtyValues.min) {
                        initialQuantity = parseInt(qtyValues.min);
                    } else if (fetchedService.product_type === 'specificPackage' && Array.isArray(qtyValues) && qtyValues.length > 0) {
                        initialQuantity = parseInt(qtyValues[0]); // Default to the first package value
                    }
                }
                setQuantity(initialQuantity);

                let requiredParams = fetchedService.zddk_required_params;
                if (typeof requiredParams === 'string') {
                    try {
                        requiredParams = JSON.parse(requiredParams);
                    } catch (e) {
                        console.error("Failed to parse zddk_required_params:", e);
                        requiredParams = []; // Set to empty array if parsing fails
                    }
                }
                setParsedZddkRequiredParams(Array.isArray(requiredParams) ? requiredParams : []);

                const initialExtraParams = {};
                (Array.isArray(requiredParams) ? requiredParams : []).forEach(paramName => {
                    initialExtraParams[paramName] = '';
                });
                setExtraParamsInput(initialExtraParams);
                // --- End ZDDK Specific Parsing ---

            } catch (error) {
                console.error("Failed to fetch service:", error);
                toast.error("Failed to load service details.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Update total price when quantity or service (price, type) changes
    const totalPrice = React.useMemo(() => {
        if (!service) return '0.00';

        let calculatedPrice = 0;
        if (service.is_zddk_product) {
            if (service.product_type === 'specificPackage') {
                // For specific packages, the selected quantity IS the price/value
                calculatedPrice = parseFloat(quantity); 
            } else if (service.product_type === 'amount') {
                // For 'amount' products, the 'quantity' selected by the user represents the actual value/price.
                // The service.price of "0.00" is a placeholder in this case.
                calculatedPrice = parseFloat(quantity); 
            } else {
                // Fallback for other ZDDK product types or if logic needs refinement
                calculatedPrice = quantity * parseFloat(service.price);
            }
        } else {
            // For non-ZDDK products
            calculatedPrice = quantity * parseFloat(service.price);
        }
        // Ensure the output is always a string with 2 decimal places
        return calculatedPrice.toFixed(2);
    }, [quantity, service]);


    const handleExtraParamChange = (paramName, value) => {
        setExtraParamsInput(prev => ({
            ...prev, // Spread previous state correctly
            [paramName]: value,
        }));
    };

    const handleBuyNow = async () => {
        if (!service) {
            toast.error("Service data not available.");
            return;
        }

        // Validate required parameters for ZDDK products
        for (const paramName of parsedZddkRequiredParams) {
            if (!extraParamsInput[paramName] || extraParamsInput[paramName].trim() === '') {
                toast.error(`Please enter a value for "${paramName}".`);
                return; // Stop if any required param is missing
            }
        }
        
        setIsProcessingPurchase(true);

        const orderData = {
            services: [{
                quantity: quantity,
                id: service.id,
                extra_params: extraParamsInput // Include extra params here
            }]
        };

        try {
            const res = await addOrder(orderData);

            if (res && res.id) { // Assuming a successful response includes an 'id' or similar identifier
                toast.success("Order created successfully!");
                setIsConfirmDialogOpen(false);
                navigate("/checkout"); // Redirect to checkout or a success page
            } else if (res && res.error) {
                toast.error(`Failed to create order: ${res.error}`);
            } else {
                toast.error("Failed to create order. Please try again.");
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "Failed to create order due to network or server error.";
            console.error("Purchase failed", err);
            toast.error(errorMessage);
        } finally {
            setIsProcessingPurchase(false);
        }
    };

    const handleQuantityChange = (value) => {
        const newQty = parseInt(value);
        if (service.is_zddk_product && service.product_type === 'amount' && parsedZddkQtyValues) {
            const min = parseInt(parsedZddkQtyValues.min || 1);
            const max = parseInt(parsedZddkQtyValues.max || Infinity);
            if (!isNaN(newQty)) {
                setQuantity(Math.max(min, Math.min(newQty, max)));
            } else if (value === '') {
                setQuantity(''); // Allow empty for typing
            }
        } else if (service.is_zddk_product && service.product_type === 'specificPackage' && Array.isArray(parsedZddkQtyValues)) {
             // For specificPackage, quantity must be one of the predefined values
            if (parsedZddkQtyValues.includes(newQty)) {
                setQuantity(newQty);
            } else if (value === '') { // Allow empty during selection
                setQuantity('');
            } else if (parsedZddkQtyValues.length > 0) {
                 // If an invalid value is entered, revert to first valid option
                setQuantity(parseInt(parsedZddkQtyValues[0]));
            }
        }
        else if (!isNaN(newQty) && newQty > 0) {
            setQuantity(newQty);
        } else if (value === '') {
            setQuantity(1); // Default to 1 if input is cleared for non-ZDDK or unhandled types
        }
    };

    const minQuantity = service?.is_zddk_product && service.product_type === 'amount' && typeof parsedZddkQtyValues === 'object' && parsedZddkQtyValues.min
        ? parseInt(parsedZddkQtyValues.min) : 1;
    const maxQuantity = service?.is_zddk_product && service.product_type === 'amount' && typeof parsedZddkQtyValues === 'object' && parsedZddkQtyValues.max
        ? parseInt(parsedZddkQtyValues.max) : undefined;


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
                                        src={`${service.image_path}`}
                                        alt={service.title}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold">{service.title}</h1>
                                {service.category?.name && (
                                    <Badge variant="outline" className="mr-2">{service.category.name}</Badge>
                                )}
                            </div>

                            <p className="text-muted-foreground mb-6">{service.description}</p>

                            <div className="flex flex-wrap gap-4 mb-8">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Tag className="h-4 w-4 mr-1" />
                                    ${service.price} {/* Base price display */}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Features & Benefits</h3>
                                {service.features && service.features.length > 0 ? (
                                    <ul className="list-disc list-inside space-y-1">
                                        {service.features.map((feature, index) => (
                                            <li key={index} className="flex items-center text-muted-foreground">
                                                <Check className="h-4 w-4 mr-2 text-green-500" /> {feature}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-muted-foreground">No features available</p>
                                )}
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
                                    <Label htmlFor="quantity">Quantity</Label>
                                    {service.is_zddk_product && service.product_type === 'specificPackage' && Array.isArray(parsedZddkQtyValues) && parsedZddkQtyValues.length > 0 ? (
                                        <Select onValueChange={handleQuantityChange} value={String(quantity)}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select quantity" />
                                            </SelectTrigger>
                                            <SelectContent className='bg-blue-200'>
                                                {parsedZddkQtyValues.map((value, index) => (
                                                    <SelectItem key={index} value={String(value)}>
                                                        {value}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <div className="flex items-center">
                                            <Button type="button" size="icon" variant="outline" className="h-9 w-9 rounded-r-none" onClick={() => handleQuantityChange(quantity - 1)} disabled={quantity <= minQuantity}>
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <Input
                                                id="quantity"
                                                type="number"
                                                min={minQuantity}
                                                max={maxQuantity}
                                                value={quantity === '' ? '' : quantity} // Ensure empty string works for input
                                                onChange={(e) => handleQuantityChange(e.target.value)}
                                                className="h-9 rounded-none border-x-0 w-16 px-0 text-center"
                                            />
                                            <Button type="button" size="icon" variant="outline" className="h-9 w-9 rounded-l-none" onClick={() => handleQuantityChange(quantity + 1)} disabled={maxQuantity !== undefined && quantity >= maxQuantity}>
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {/* Dynamic Extra Parameters for ZDDK Products */}
                                {service.is_zddk_product && parsedZddkRequiredParams.length > 0 && (
                                    <div className="space-y-3 pt-2">
                                        <h4 className="font-semibold text-sm">Required Information:</h4>
                                        {parsedZddkRequiredParams.map((paramName) => (
                                            <div className="flex flex-col space-y-1" key={paramName}>
                                                <Label htmlFor={paramName}>{paramName}</Label>
                                                <Input
                                                    id={paramName}
                                                    type="text"
                                                    value={extraParamsInput[paramName] || ''}
                                                    onChange={(e) => handleExtraParamChange(paramName, e.target.value)}
                                                    placeholder={`Enter ${paramName}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="border-t pt-4 mb-6">
                                <div className="flex justify-between mb-2">
                                    <span className="font-medium">Total Price:</span>
                                    <span className="text-xl font-bold">${totalPrice}</span>
                                </div>
                                <Button className="w-full" size="lg" onClick={() => setIsConfirmDialogOpen(true)}>
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

            {/* Confirmation Dialog */}
            <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                <DialogContent className="bg-amber-100">
                    <DialogHeader>
                        <DialogTitle>Confirm Purchase</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to purchase <strong>{service.title}</strong>?
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
                         {parsedZddkRequiredParams.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="font-medium text-sm mt-2">Submitted Details:</h4>
                                {parsedZddkRequiredParams.map(paramName => (
                                    <div key={`confirm-${paramName}`} className="flex justify-between text-sm text-muted-foreground">
                                        <span>{paramName}:</span>
                                        <span className="font-semibold">{extraParamsInput[paramName] || 'N/A'}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="flex justify-between border-t pt-3">
                            <span className="font-medium">Total Price:</span>
                            <span className="font-bold">${totalPrice}</span>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)} disabled={isProcessingPurchase}>
                            Cancel
                        </Button>
                        <Button onClick={handleBuyNow} disabled={isProcessingPurchase || parseFloat(totalPrice) <= 0}>
                            {isProcessingPurchase && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isProcessingPurchase ? "Processing..." : "Confirm Purchase"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ServiceDetail;