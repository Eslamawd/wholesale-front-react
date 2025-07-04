// src/components/admin/customization/CreateServiceForm.jsx

import React, { useState } from "react";
import { Button } from "../../ui/button.jsx";
import { Input } from "../../ui/Input.jsx";
import { Label } from "../../ui/Label.jsx";
import { Separator } from "../../ui/Separator.jsx";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { updateCategory } from "../../../lib/categoryApi.js";

function UpdateCategoryForm({category, onSuccess, onCancel }) {
  // فقط الحقول اللازمة لإنشاء خدمة جديدة
  const [formData, setFormData] = useState({
    name: category.name || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  // 1) جلب قائمة الفئات عند التحميل


 // 2) تغيير قيم الحقول النصية والأرقام والقائمة
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
 
    const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("please enter a service name");
      return;
    }
    setIsLoading(true);
    try {
        
      
 
     const res = await updateCategory(category.id, formData);
   
     if (res.category.name) {

      toast.success("Updated Category successfully!");
      onSuccess(res.category);
      onCancel()
      navigate("/admin/categories");
     }
     
    } catch (err) {
      console.error("Error creating service:", err);
      toast.error("Failed to create service. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-black rounded-lg shadow">
    
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={category.name}
                required
              />
            </div>
          </div>
   
      <Separator />

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Update Category"}
        </Button>
      </div>
    </form>
  );
}
export default  UpdateCategoryForm;

