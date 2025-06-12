// src/components/admin/customization/CreateServiceForm.jsx

import React, { useState, useEffect } from "react";
import { Button } from "../../ui/button.jsx";
import { Input } from "../../ui/Input.jsx";
import { Textarea } from "../../ui/textarea.jsx";
import { Label } from "../../ui/Label.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs.jsx";
import { Separator } from "../../ui/Separator.jsx";
import { ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { addService } from "../../../lib/serviceApi.js";
import { loadCategory } from "../../../lib/categoryApi.js";


export default function CreateServiceForm({ onSuccess, onCancel }) {
  // فقط الحقول اللازمة لإنشاء خدمة جديدة
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    imageFile: null,
    imageUrl: "",    
    categoryId: ""
  });

  const [serviceCategories, setServiceCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("basic");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await loadCategory()
        if (res.categories) { 
          toast.success("Categories loaded successfully!");
          setServiceCategories(res.categories || []);
        }
        toast.success("Categories Get");
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        toast.error("فشل في جلب الفئات");
      }
    }
    fetchCategories();
  }, []);

  // 2) تغيير قيم الحقول النصية والأرقام والقائمة
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };
  const handleSelectChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 3) رفع الصورة: نخزن الملف والمعاينة فقط (بلا حفظ مسبق)
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

  // 4) عند الضغط على "Create Service"
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("please enter a service name");
      return;
    }
    if (!formData.categoryId) {
      toast.error("please select a category");
      return;
    }

    setIsLoading(true);
    try {
      // نجمع بيانات multipart/form-data
      const payload = new FormData();
      payload.append("title", formData.name);
      payload.append("description", formData.description);
      payload.append("price", formData.price.toString());
      payload.append("category_id", formData.categoryId);
      
      if (formData.imageFile) {
        payload.append("image_path", formData.imageFile);
      }
     const res = await addService(payload);
   
     if (res.service.title && res.service.description && res.service.price && res.service.image_path) {
      toast.success("Created service successfully!");
      onSuccess && onSuccess(res.service);
     }
     
    } catch (err) {
      console.error("Error creating service:", err);
      toast.error("Failed to create service. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-gray-50 rounded-lg shadow">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-white rounded shadow-sm">
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
                placeholder="Enter service name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryId">Category</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(val) => handleSelectChange("categoryId", val)}
              >
                <SelectTrigger name="categoryId" id="categoryId">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                
{serviceCategories
  .map((cat) => (
    <SelectItem key={cat.id} value={cat.id}>
      {cat.name}
    </SelectItem>
  ))}
</SelectContent>

                
           
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter service description"
              rows={3}
            />
          </div>

       
          <div className="space-y-2">
            <Label htmlFor="image">
              <ImageIcon className="inline-block mr-1 h-5 w-5" />
              Upload Image
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
                onError={() => setFormData((prev) => ({ ...prev, imageUrl: "" }))}
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
                value={formData.price}
                onChange={handleNumberChange}
                placeholder="0.00"
              />
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
          {isLoading ? "Saving..." : "Create Service"}
        </Button>
      </div>
    </form>
  );
}
