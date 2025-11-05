'use client';
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Edit, Trash2 } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import Swal from 'sweetalert2';


type FormData = {
  name: string;
  email: string;
  age: number | ""; // allow number or empty string
};

export default function Home() {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: { name: "", email: "", age: "" },
  });

  const [data, setData] = useState<FormData[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const liveAge = watch("age", ""); // ✅ track from start

  // ✅ Handle form submission
  const onSubmit: SubmitHandler<FormData> = (formData) => {
    if (editingIndex !== null) {
      const updatedData = [...data];
      updatedData[editingIndex] = formData;
      setData(updatedData);
      reset({ name: "", email: "", age: "" });
      setEditingIndex(null);
      toast.success("Record updated successfully!");
    } else {
      setData([...data, formData]);
      reset({ name: "", email: "", age: "" });
      toast.success("New record added!");
    }
  };

  const handleEdit = (index: number) => {
    const item = data[index];
    reset(item);
    setEditingIndex(index);
    toast("You can now edit the selected record.", { icon: "✏️" });
  };
const handleDelete = (index: number) => {
  Swal.fire({
    title: "Are you sure?",
    text: "This record will be deleted permanently!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      const updatedData = data.filter((_, i) => i !== index);
      setData(updatedData);

      Swal.fire("Deleted!", "Your record has been deleted.", "success");
    }
  });
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center px-4 py-10">
      {/* ✅ Toast notifications */}
      <Toaster position="top-center" reverseOrder={false} />

      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-3xl w-full">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-8 tracking-wide">
          React Hook Form with Table
        </h1>

        {/* ✅ FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">Name</label>
            <input
              {...register("name", { required: "Name is required" })}
              placeholder="Enter full name"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-black"
            />
            {errors.name && (
              <span className="text-red-500 text-sm mt-1">{errors.name.message}</span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-900">Email</label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
              })}
              placeholder="example@mail.com"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2  focus:ring-blue-400 transition-all text-black"
            />
            {errors.email && (
              <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>
            )}
          </div>

          {/* ✅ AGE INPUT with live tracking */}
          <div>
            <label className="block mb-1 text-gray-700 font-bold">Age:</label>
            <input
              type="number"
              {...register("age", {
                valueAsNumber: true,
                required: "Age is required",
                min: { value: 18, message: "Age must be at least 18" },
                max: { value: 50, message: "Age must be less than 50" },
              })}
              placeholder="Enter your age"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-black"
            />

            {/* 👇 Error or Live age */}
            <p className="text-blue-600 font-semibold mt-2">
              {errors.age ? (
                <span className="text-red-500 text-sm">{errors.age.message}</span>
              ) : liveAge ? (
                <span className="text-blue-600 text-sm">Current Age: {liveAge}</span>
              ) : null}
            </p>
          </div>

          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              className={`w-40 text-white cursor-pointer font-semibold px-6 py-2 rounded-lg transition-all duration-300 shadow-md ${
                editingIndex !== null
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {editingIndex !== null ? "Update" : "Add"}
            </button>
          </div>
        </form>

        {/* ✅ TABLE */}
        {data.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
            <table className="min-w-full text-center">
              <thead className="bg-blue-600 text-white uppercase text-sm tracking-wider">
                <tr>
                  <th className="px-6 py-3 border-r text-white">Name</th>
                  <th className="text-white px-6 py-3 border-r">Email</th>
                  <th className="text-white px-6 py-3 border-r">Age</th>
                  <th className="px-6 py-3 text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {data.map((item, index) => (
                  <tr key={index} className="border-t  transition-all">
                    <td className="px-6 py-3 text-black">{item.name}</td>
                    <td className="px-6 py-3 text-black">{item.email}</td>
                    <td className="px-6 py-3 text-black">{item.age}</td>
                    <td className="px-6 py-3 space-x-2">
                      <div className="flex justify-center gap-4">
                      <button
                        onClick={() => handleEdit(index)}
                        className="text-black font-semibold px-3 py-1 rounded-lg hover:bg-blue-200 transition-all cursor-pointer"
                      >
                        <Edit size={20} color="blue" />
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="text-white font-semibold px-3 py-1 rounded-lg hover:bg-red-200 transition-all cursor-pointer"
                      >
                        <Trash2 size={20} color="red" />
                      </button></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center italic">No records yet. Add some!</p>
        )}
      </div>
    </div>
  );
}
