import { TextField, Button, Typography, Link, IconButton } from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { toast } from "react-toastify";
import { newRequest } from "../services/newRequest";
import { ApiStatus } from "../Enums/ApiStatus";

function MyForm({ close, setShowLogin }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = (data) => {
    console.log(data);
    newRequest("/auth/login", {
      method: "POST",
      data,
    })
      .then((res) => {
        if (res.data?.status == ApiStatus.success) {
          toast.success(res.data?.message);
          window.location.reload();
          close();
          return;
        }
        toast.error(res?.data?.message);
      })
      .catch((err) => {
        console.log(err);
        toast.error("something went wrong!");
      });
    // toast.success("login successfully!");
  };

  return (
    <div className="w-80">
      <Typography variant="h6" fontWeight={600}>
        Simply Speak
      </Typography>
      <Typography variant="body2" className="!mt-1">
        Sign in
      </Typography>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center flex-col justify-center w-full gap-4 mt-5"
      >
        <TextField
          label="Email"
          type="email"
          className="w-full"
          error={errors.email ? true : false}
          helperText={errors.email ? "Invalid email address" : ""}
          {...register("email", {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
          })}
        />
        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          className="w-full"
          error={errors.password ? true : false}
          helperText={
            errors.password ? "Password must be at least 6 characters long" : ""
          }
          {...register("password", { required: true, minLength: 6 })}
          InputProps={{
            endAdornment: (
              <IconButton onClick={handleShowPassword}>
                {showPassword ? (
                  <VisibilityOffOutlinedIcon />
                ) : (
                  <VisibilityOutlinedIcon />
                )}
              </IconButton>
            ),
          }}
        />
        <div className="flex w-full justify-end gap-4">
          <Button onClick={() => close()}>Cancel</Button>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </div>
      </form>
      <div className="mt-5 text-center">
        Don't have an account?{" "}
        <span
          onClick={() => {
            setShowLogin(false);
          }}
          className="!font-medium !cursor-pointer"
        >
          Sign up
        </span>
      </div>
      <div className="text-center flex flex-col mt-5 gap-1">
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{
            color: "#aaa",
          }}
        >
          By logging in, you agree to our terms and conditions.
        </Typography>
        <Typography
          sx={{
            color: "#aaa",
          }}
          variant="caption"
          color="textSecondary"
        >
          © 2023 SimplySpeak, Inc. All rights reserved.
        </Typography>
      </div>
    </div>
  );
}

export default MyForm;
