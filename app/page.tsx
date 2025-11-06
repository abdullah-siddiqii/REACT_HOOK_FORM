'use client'
import { useState } from "react";
import {
  useForm,
  SubmitHandler,
  useWatch,
  Control,
  FieldErrors,
} from "react-hook-form";
import {
  TextField,
  Button,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Stack,
} from "@mui/material";
import { Edit, Trash2 } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import Swal from "sweetalert2";

type FormData = {
  name: string;
  email: string;
  age: number | "";
};

// 👀 Age Watcher Component
function AgeWatcher({
  control,
  errors,
}: {
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
}) {
  const age = useWatch({ control, name: "age", defaultValue: "" });

  if (errors.age) {
    const baseMessage = (errors.age as any).message || "Invalid age";
    const entered = age === "" || age === undefined ? "no value" : String(age);

    return (
      <Typography color="error" variant="body2">
        {baseMessage} {entered !== "no value" ? `but you entered ${entered}` : ""}
      </Typography>
    );
  }

  return null;
}

export default function Home() {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { name: "", email: "", age: "" },
  });

  const [data, setData] = useState<FormData[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const onSubmit: SubmitHandler<FormData> = (formData) => {
    if (editingIndex !== null) {
      const updated = [...data];
      updated[editingIndex] = formData;
      setData(updated);
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
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteRecord(index);
      }
    });
  };

  const deleteRecord = (index: number) => {
    const updated = data.filter((_, i) => i !== index);
    setData(updated);
    toast.success("Record deleted successfully!");
    if (editingIndex === index) {
      reset({ name: "", email: "", age: "" });
      setEditingIndex(null);
    }
  };

  return (
    <Box
      sx={{
        maxHeight: "100vh",
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, white 0%, rgba(255, 255, 255, 0.8) 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        py: 6,
      }}
    >
      <Toaster position="top-center" reverseOrder={false} />

      <Container maxWidth="md">
        <Paper
          elevation={10}
          sx={{
            p: 5,
            borderRadius: 4,
            backdropFilter: "blur(12px)",
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          }}
        >
          <Typography
            variant="h3"
            align="center"
            sx={{
              fontWeight: "bold",
              mb: 3,
              color: "black",
              textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
            }}
          >
            React Hook Form
          </Typography>

          {/* Form */}
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              display: "grid",
              gap: 3,
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
            <TextField
              label="Name"
              variant="outlined"
              placeholder="Enter Name here"
              {...register("name", { required: "Name is required" })}
              error={!!errors.name}
              helperText={errors.name?.message}
                      slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />

            <TextField
              label="Email"
              variant="outlined"
              placeholder="Enter Email here"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
              })}
              error={!!errors.email}
              slotProps={{ inputLabel: { shrink: true } }}
              helperText={errors.email?.message}
              fullWidth
            />

            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <TextField
                type="number"
                label="Age"
                placeholder="Enter Age here"
                variant="outlined"
                {...register("age", {
                  valueAsNumber: true,
                  required: "Age is required",
                  min: { value: 18, message: "Age must be at least 18" },
                  max: { value: 50, message: "Age must be less than 50" },
                })}
                     slotProps={{ inputLabel: { shrink: true } }}
                error={!!errors.age}
              />
              <AgeWatcher control={control} errors={errors} />
            </Box>
<Box sx={{ gridColumn: "1 / -1", display: "flex", justifyContent: "center" }}>
  <Button
    type="submit"
    variant="contained"
    color={editingIndex !== null ? "warning" : "primary"}
    sx={{
      fontWeight: "bold",
      fontSize: "1rem",
      py: 1.2,
      px: 6,
      width: "30%",
      background:
        editingIndex !== null
          ? "linear-gradient(95deg, #764ba2, #667eea)"
          : "linear-gradient(95deg,#764ba2, #667eea)",
    }}
  >
    {editingIndex !== null ? "Update" : "Add"}
  </Button>
  </Box>
</Box>


          {/* Table */}
          {data.length > 0 ? (
     <Box
  sx={{
    overflowX: "auto",
    maxHeight: 400,
    position: "relative", 
        mt: 4,// sticky ka reference milta hai
  }}
>
  <Table
    stickyHeader
    sx={{
        backgroundColor: "white",
      borderRadius: 2,
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      minWidth: 650,
    }}
  >
    <TableHead>
      <TableRow>
        {["Name", "Email", "Age", "Actions"].map((head) => (
          <TableCell
            key={head}
            sx={{
              color: "white",
              fontWeight: "bold",
              backgroundColor: "#764ba2", // background zaroori hai sticky ke liye
              position: "sticky",
              top: 0,
              zIndex: 2, // header hamesha upar rahe
            }}
          >
            {head}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>

    <TableBody>
      {data.map((item, i) => (
        <TableRow
          key={i}
          sx={{
            "&:hover": {
              backgroundColor: "rgba(118, 75, 162, 0.1)",
              transition: "0.3s",
            },
          }}
        >
          <TableCell>{item.name}</TableCell>
          <TableCell>{item.email}</TableCell>
          <TableCell>{item.age}</TableCell>
          <TableCell>
            <Stack direction="row" spacing={1}>
              <Button
                onClick={() => handleEdit(i)}
                startIcon={<Edit size={18} color="blue" />}
                variant="outlined"
              >
                Edit
              </Button>
              <Button
                onClick={() => handleDelete(i)}
                startIcon={<Trash2 size={18} color="red" />}
                variant="outlined"
                color="error"
              >
                Delete
              </Button>
            </Stack>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</Box>

          ) : (
            <Typography
              variant="body1"
              align="center"
              sx={{
                mt: 4,
                color: "gray",
                fontStyle: "italic",
              }}
            >
              No records yet. Add some!
            </Typography>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
