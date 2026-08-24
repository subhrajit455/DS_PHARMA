import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import toastUtil from "@/shared/utils/toast";
import { API_BASE_URL, API_ENDPOINTS } from "@/services/api/baseURL";
import { Button } from "@/admin/components/ui/Button";
import { Input } from "@/admin/components/ui/Input";
import { Label } from "@/admin/components/ui/Label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/admin/components/ui/Card";
import { ShieldCheck, Sparkles, Mail, Lock, Eye, EyeOff } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/${API_ENDPOINTS.ADMIN_LOGIN}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: email,
            password,
          }),
        },
      );
      const data = await response.json();
      console.log("Admin login response", data);

      if (data.success) {
        const serverUser = data?.data?.user || {};
        const token = data.token || data?.data?.token;

        if (!token) {
          throw new Error("Missing auth token");
        }

        const adminUser = {
          ...serverUser,
          role: serverUser.role || "admin", // Ensure role is set for admin route protection
        };

        // Persist token and auth state
        // login(adminUser, token);
        toastUtil.success(
          `Welcome back, ${adminUser.userId || adminUser.email || "Admin"}!`,
        );
        localStorage.setItem("adminToken", token);
        localStorage.setItem("adminUser", JSON.stringify(adminUser));
        navigate("/admin/products");
      } else {
        throw new Error(data.message || "Invalid credentials");
      }
    } catch (error) {
      toastUtil.error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-emerald-900 to-teal-900 px-4 py-12 relative overflow-hidden">
      {/* Animated gradient blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      <Card className="w-full max-w-md shadow-2xl shadow-emerald-500/20 backdrop-blur-xl bg-white/95 border-emerald-100 relative z-10">
        <CardHeader className="space-y-3 text-center pb-8">
          <div
            className="flex items-center justify-center"
            style={{ marginBottom: "10px" }}
          >
            <div className="mx-auto bg-linear-to-br from-emerald-500 to-teal-600 p-4 rounded-2xl w-fit shadow-lg shadow-emerald-500/30 mb-2">
              <ShieldCheck className="h-10 w-10 text-white " />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold bg-linear-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent flex items-center justify-center gap-2">
              Admin Login
              <Sparkles className="h-6 w-6 text-emerald-600" />
            </CardTitle>
            <CardDescription className="text-base mt-2 text-gray-600">
              Enter your credentials to access the dashboard
            </CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handleLogin}>
          <CardContent className="space-y-5">
            <div className="space-y-2" style={{ marginBottom: "20px" }}>
              <Label htmlFor="email" className="text-gray-700 font-semibold">
                USER ID
              </Label>
              <Input
                id="email"
                type="text"
                // placeholder="admin@dspharma.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
                // icon={Mail}
              />
            </div>

            <div className="space-y-2" style={{ marginBottom: "20px" }}>
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-gray-700 font-semibold"
                >
                  Password
                </Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-2">
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold shadow-2xl"
              isLoading={isLoading}
              style={{
                background: "linear-gradient(to right, #10b981, #0d9488)",
                color: "white",
              }}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
