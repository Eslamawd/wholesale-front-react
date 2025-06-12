import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { PlusCircle, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

// Initial wholesale users fallback
const initialUsers = [
  { id: "w1", username: "wholesaler1", company: "ABC Trading" },
  { id: "w2", username: "admin", company: "XYZ Distributors" },
];

const WholesaleUserManagement = () => {
  const [wholesaleUsers, setWholesaleUsers] = useState(initialUsers);
  const [newWholesaleUser, setNewWholesaleUser] = useState({
    username: "",
    company: "",
    password: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Fetch users from Laravel API on mount
  useEffect(() => {
    const fetchWholesaleUsers = async () => {
      try {
        const response = await axios.get("/api/wholesale-users");
        if (response.data && Array.isArray(response.data)) {
          setWholesaleUsers(response.data);
        } else {
          loadUsersFromLocalStorage();
        }
      } catch (error) {
        console.error("Error fetching wholesale users:", error);
        loadUsersFromLocalStorage();
      }
    };

    const loadUsersFromLocalStorage = () => {
      const savedUsers = localStorage.getItem("wholesaleUsers");
      if (savedUsers) {
        try {
          const parsedUsers = JSON.parse(savedUsers);
          setWholesaleUsers(parsedUsers);
        } catch (error) {
          console.error("Error parsing wholesale users:", error);
        }
      }
    };

    fetchWholesaleUsers();
  }, []);

  // Save to localStorage on user changes
  useEffect(() => {
    localStorage.setItem("wholesaleUsers", JSON.stringify(wholesaleUsers));
  }, [wholesaleUsers]);

  // Add user via Laravel API
  const handleAddWholesaleUser = async (e) => {
    e.preventDefault();
    if (!newWholesaleUser.username || !newWholesaleUser.password) {
      toast.error("Username and password are required");
      return;
    }

    try {
      const payload = {
        username: newWholesaleUser.username,
        company: newWholesaleUser.company || "wholesaler",
        password: newWholesaleUser.password,
      };

      const response = await axios.post("/api/wholesale-users", payload);

      if (response.data && response.data.id) {
        setWholesaleUsers((prev) => [
          ...prev,
          {
            id: response.data.id,
            username: response.data.username,
            company: response.data.company,
          },
        ]);

        toast.success("Wholesale user added successfully");
      } else {
        toast.error("Failed to add wholesale user");
      }
    } catch (error) {
      console.error("Error adding wholesale user:", error);
      toast.error("Error adding wholesale user");

      // Fallback to add locally
      setWholesaleUsers((prev) => [
        ...prev,
        {
          id: `w${prev.length + 1}`,
          username: newWholesaleUser.username,
          company: newWholesaleUser.company || "wholesaler",
        },
      ]);
    }

    setNewWholesaleUser({ username: "", company: "", password: "" });
    setShowAddForm(false);
  };

  // Remove user via Laravel API
  const handleRemoveWholesaleUser = async (id) => {
    try {
      await axios.delete(`/api/wholesale-users/${id}`);
      setWholesaleUsers((prev) => prev.filter((user) => user.id !== id));
      toast.success("Wholesale user removed successfully");
    } catch (error) {
      console.error("Error removing wholesale user:", error);
      toast.error("Error removing user");

      // Fallback: remove locally anyway
      setWholesaleUsers((prev) => prev.filter((user) => user.id !== id));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Prepare data for export
  const exportData = wholesaleUsers.map((user) => ({
    ID: user.id,
    Username: user.username,
    Company: user.company || "N/A",
  }));

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Wholesale User Management</h3>
        <div className="flex gap-2">
          <ExportData data={exportData} filename="wholesale-users" disabled={wholesaleUsers.length === 0} />
          <Button onClick={() => setShowAddForm((prev) => !prev)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Wholesale User
          </Button>
        </div>
      </div>

      {showAddForm && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <form onSubmit={handleAddWholesaleUser}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={newWholesaleUser.username}
                    onChange={(e) => setNewWholesaleUser((prev) => ({ ...prev, username: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company (Optional)</Label>
                  <Input
                    id="company"
                    value={newWholesaleUser.company}
                    onChange={(e) => setNewWholesaleUser((prev) => ({ ...prev, company: e.target.value }))}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={newWholesaleUser.password}
                      onChange={(e) => setNewWholesaleUser((prev) => ({ ...prev, password: e.target.value }))}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add User</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {wholesaleUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.company || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive/90"
                      onClick={() => handleRemoveWholesaleUser(user.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </>
  );
};

export default WholesaleUserManagement;
