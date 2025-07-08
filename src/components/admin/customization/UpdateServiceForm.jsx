// src/components/admin/customization/UpdateServiceForm.jsx

import React, { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/Input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/Label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Separator } from "../../ui/Separator";
import { ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { updateService } from "../../../lib/serviceApi.js";
export default function UpdateServiceForm({ service, onSuccess, onCancel }) {
  // هنا نهيئ الحالة بقيم 'product' عند فتح المكوّن
  const [formData, setFormData] = useState({
    name: service?.name_ar || "",
    price: service?.price || 0,
    imageFile: null,
    imageUrl: service?.image || "",
    categoryId: service?.category.name_ar || "",

  });

  const [activeTab, setActiveTab] = useState("basic");
  const [isLoading, setIsLoading] = useState(false);
  const DEFAULT_IMAGE = "/images/default-image.png";


  // 2) تغييرات الحقول النصية والأرقام
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };


  // 3) رفع الصورة (لو رغب المستخدم في تغييرها)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imageUrl: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  // 4) عند الضغط على "Update Service"
const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
        toast.error("اسم الخدمة مطلوب");
        return;
    }
    if (!formData.categoryId) {
        toast.error("يرجى اختيار الفئة");
        return;
    }

    setIsLoading(true);
    try {
        const payload = new FormData();
        payload.append("name_ar", formData.name);
        payload.append("price", formData.price);
        payload.append("_method", "PATCH"); // Laravel expects this for updates
      if (formData.imageFile) {
            payload.append("image_path", formData.imageFile);
        }


        const res = await updateService(service.id, payload);
        
         if (res.product.name_ar && res.product.price) {
              toast.success("Created service successfully!");
              onSuccess && onSuccess(res.product);
             } else {
             // Handle cases where res.service might not be present but no error was thrown
            toast.warning("Service updated, but response was unexpected.");
        }
    } catch (err) {
        console.error("Error updating service:", err);
        // Improved error message for the user
        toast.error(`فشل في تحديث الخدمة: ${err.response?.data?.message || 'خطأ غير معروف'}`);
        // If it's a validation error, you might want to show specific messages
        if (err.response && err.response.status === 422) {
            Object.values(err.response.data.errors).forEach(messages => {
                messages.forEach(message => toast.error(message));
            });
        }
    } finally {
        setIsLoading(false);
    }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-black rounded-lg shadow">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-black rounded shadow-sm">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
        </TabsList>

        {/* تبويب Basic Info */}
        <TabsContent value="basic" className="pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Service name"
                required
              />
            </div>

           
          </div>

         

          <div className="space-y-2">
            <Label htmlFor="image">
              <ImageIcon className="inline-block mr-1 h-5 w-5" />
              Update Image
            </Label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="mt-2 w-24 h-24 object-cover border rounded"
                onError={() => setFormData((prev) => ({ ...prev, imageUrl: DEFAULT_IMAGE }))}
              />
            )}
          </div>
        </TabsContent>

        {/* تبويب Pricing */}
        <TabsContent value="pricing" className="pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Base Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleNumberChange}
                placeholder="0.00"
              />
              <p className="text-xs text-muted-foreground">
                Base price for single unit or month
              </p>
            </div>
          
          </div>
        </TabsContent>
      </Tabs>

      <Separator />

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Update Service"}
        </Button>
      </div>
    </form>
  );
}
