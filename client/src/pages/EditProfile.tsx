import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import {
  hideGlobalLoader,
  showGlobalLoader,
} from "../store/reducers/globalLoader";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { setUser } from "../store/reducers/user";

const editProfileSchema = yup.object({
  full_name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  address: yup.string().optional(),
});

type EditProfileForm = yup.InferType<typeof editProfileSchema>;

function EditProfile() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(editProfileSchema),
  });

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    if (!user) return;
    setValue("full_name", user.full_name ?? "");
    setValue("email", user.email ?? "");
    setValue("phone", user.phone ?? "");
    setValue("address", user.address ?? "");
  }, [setValue, user]);

  const onSubmit = async (data: EditProfileForm) => {
    try {
      dispatch(showGlobalLoader());
      const response = await axiosInstance.put("user/profile", data);
      dispatch(setUser(response.data));
      navigate("/profile");
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      dispatch(hideGlobalLoader());
    }
  };

  return (
    <div className="flex items-center justify-center md:min-h-[100dvh] md:p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Edit Profile
        </h2>

        {/* Full Name */}
        <div className="flex flex-col space-y-1">
          <label className="text-gray-700 font-semibold">Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            {...register("full_name")}
            className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
          />
          {errors.full_name && (
            <p className="text-sm text-red-500">{errors.full_name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col space-y-1">
          <label className="text-gray-700 font-semibold">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            {...register("email")}
            disabled
            className="p-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed focus:outline-none"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="flex flex-col space-y-1">
          <label className="text-gray-700 font-semibold">Phone Number</label>
          <input
            type="text"
            placeholder="Enter your phone number"
            {...register("phone")}
            className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        {/* Address */}
        <div className="flex flex-col space-y-1">
          <label className="text-gray-700 font-semibold">Address</label>
          <textarea
            placeholder="Enter your address"
            {...register("address")}
            rows={3}
            className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition resize-none"
          />
          {errors.address && (
            <p className="text-sm text-red-500">{errors.address.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition duration-300"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditProfile;
