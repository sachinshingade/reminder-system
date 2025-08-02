import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

const registerSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .refine(
      (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      "Please enter a valid email address"
    ),
  password: z.string().min(6, "Password must be at least 6 characters long")
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema)
  });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const res = await axiosClient.post("/auth/register", data);
      if (res.data.success || res.data.token) {
        login();
        toast.success("Registration successful!");
        navigate("/");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch {
      toast.error(
        "Registration failed. Please check your information and try again."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 max-w-sm mx-auto space-y-4"
    >
      <h1 className="text-xl font-bold text-center">Register</h1>

      <div>
        <input
          {...register("email")}
          placeholder="Email"
          className="border rounded p-2 w-full focus:ring focus:ring-blue-200"
          type="email"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <input
          type="password"
          {...register("password")}
          placeholder="Password"
          className="border rounded p-2 w-full focus:ring focus:ring-blue-200"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
