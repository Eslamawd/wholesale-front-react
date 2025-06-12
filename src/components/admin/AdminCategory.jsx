// src/components/admin/AdminCategory.jsx

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { PlusCircle, Pencil, Trash2, GiftIcon, RotateCw, Zap, Search, ContainerIcon } from "lucide-react";
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

// استدعِ مكوّني الإنشاء والتحديث اللذين أنشأتهما
import CreateCategoryForm from "./customization/CreateCategoryForm";
import { deleteCategory, loadCategory } from "../../lib/categoryApi";
import UpdateCategoryForm from "./customization/UpdateCategoryForm";

// الدوال الجاهزة للتعامل مع Laravel API


const AdminCategory = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  // جلب الخدمات عند التحميل
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await loadCategory();
      
        if (res.categories) {
          setCategories(res.categories);
        }
      } catch (error) {
        console.error("Error loading category:", error);
        toast.error("Failed to load category");
      }
    };
    fetchCategory();
  }, []);




 

  // فتح نافذة التعديل
  const handleEditCategory = async (category) => {
   try { 
    setSelectedCategory(category);
    setIsNew(false);
    setIsUpdate(true);
    setIsDialogOpen(true);}
    catch (error) {
        console.error("Error opening edit dialog:", error);
        toast.error("Failed to open edit dialog");
      }
  };

  // فتح نافذة الإضافة
  const handleAddNewCategory = async () => {
    try{
    setIsNew(true);
    setIsUpdate(false);
    setSelectedCategory(null); 
    setIsDialogOpen(true);}
    catch (error) {
      console.error("Error opening add dialog:", error);
      toast.error("Failed to open add dialog");
    }
  };

  
  const handleUpdateCategory = async (category) => {
    try{
    const updatedCateg = categories.map((u) => (u.id === selectedCategory.id ? category : u));
    setCategories(updatedCateg)
    }
    catch (error) {
      console.error("Error opening add dialog:", error);
      toast.error("Failed to open add dialog");
    }
  };





  
  const handleDeleteCategory = (category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };
  const confirmDeleteCategory = async () => {
    if (!selectedCategory) return;
    setIsDeleting(true);
    try {
      await deleteCategory(selectedCategory.id);
      const deletedRes = categories.filter((u) => u.id !== selectedCategory.id);
      setCategories(deletedRes); 
      toast.success("Category deleted");
      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
    } catch (err) {
      console.error("Error deleting category:", err);
      toast.error("Failed to delete category");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* العنوان وزرّ الإضافة */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Category Management</h2>
        <Button onClick={handleAddNewCategory}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

   
     
  
             <CategoryList
            categories={categories}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
          />
        
       
      {/* حوار الإضافة / التعديل */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>{isNew && 'Add New category'}  {isUpdate && "Update Your Category "}</DialogTitle>
            <DialogDescription>
              {isNew
                && "Fill in the details to create a new category."
               }
               {isUpdate && "Update Your Category "}
            </DialogDescription>
          </DialogHeader>

          {isNew &&
            <CreateCategoryForm
              onSuccess={handleAddNewCategory}
              onCancel={() => {
                setIsDialogOpen(false);
              }}

            />
           }
            {isUpdate &&
            <UpdateCategoryForm
            category={selectedCategory}  
            onSuccess={handleUpdateCategory}
            onCancel={() => {
                setIsDialogOpen(false);
              }}
             />
            }
        </DialogContent>
      </Dialog>
       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete{" "}
                    {selectedCategory?.name}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={confirmDeleteCategory}
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

export default AdminCategory;





const CategoryList = ({ categories, onEdit, onDelete }) => {
  if (categories.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No categories found. Add a new category to get started.
        </CardContent>
      </Card>
    );
  }

  return (
         <Table className="w-full"> 
                <TableHeader>
                  <TableRow>
                    <TableHead>id</TableHead>
                    <TableHead>name</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id} className="" >
                      <TableCell className="">
                        {category.id}
                      </TableCell>
                      <TableCell className="">
                        {category.name}
                      </TableCell>
           
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(category)}
                          >
                            <ContainerIcon className="h-4 w-4 mr-1" />
                            Edit Catgory
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onDelete(category)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
                );
};
