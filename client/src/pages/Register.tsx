import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import {
  hideGlobalLoader,
  showGlobalLoader,
} from "../store/reducers/globalLoader";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate, Link } from "react-router-dom"; // <-- added Link

// Yup schema
const registerSchema = yup.object({
  full_name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

type RegisterForm = yup.InferType<typeof registerSchema>;

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: yupResolver(registerSchema),
  });

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterForm) => {
    try {
      dispatch(showGlobalLoader());
      const res = await axiosInstance.post("/auth/register", data);
      if (res.status === 201) {
        navigate("/login");
      }
    } catch (err) {
      console.error("Registration error:", err);
    } finally {
      dispatch(hideGlobalLoader());
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[100dvh] bg-gradient-to-r from-green-100 to-blue-100 px-4">
      <div className="w-full max-w-md bg-white !shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              {...register("full_name")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.full_name && (
              <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 transition-colors text-white py-2 rounded-lg font-semibold"
          >
            Register
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-500 hover:underline font-medium"
          >
            Login
          </Link>
        </p>

        <p className="text-center text-gray-400 text-xs mt-6">
          © 2025 Vertx. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Register;
