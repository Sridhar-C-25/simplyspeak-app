import {
  TextField,
  Button,
  Typography,
  Link,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { newRequest } from "../services/newRequest";
import { ApiStatus } from "../Enums/ApiStatus";
import { toast } from "react-toastify";

function MySignupForm({ close, setShowLogin }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onSubmit = (data) => {
    setLoading(true);
    newRequest("/auth/signup", {
      method: "POST",
      data,
    })
      .then((res) => {
        setLoading(false);
        if (res.data?.status == ApiStatus.success) {
          toast.success(res.data?.message);
          close();
          return;
        }
        toast.error(res?.data?.message);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error("something went wrong!");
      });
  };

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  return (
    <div className="w-80">
      <Typography variant="h6" fontWeight={600}>
        Simply Speak
      </Typography>
      <Typography variant="body2" className="!mt-1">
        Sign up
      </Typography>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center flex-col justify-center w-full gap-4 mt-5"
      >
        <TextField
          label="Username"
          className="w-full"
          error={errors.username ? true : false}
          helperText={errors.username ? "Username is required" : ""}
          {...register("username", {
            required: true,
          })}
        />
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
        <TextField
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          className="w-full"
          error={errors.confirmPassword ? true : false}
          helperText={errors.confirmPassword ? "Passwords do not match" : ""}
          {...register("confirmPassword", {
            required: true,
            validate: (value) => value === password,
          })}
          InputProps={{
            endAdornment: (
              <IconButton onClick={handleShowConfirmPassword}>
                {showConfirmPassword ? (
                  <VisibilityOffOutlinedIcon />
                ) : (
                  <VisibilityOutlinedIcon />
                )}
              </IconButton>
            ),
          }}
        />
        <div className="flex w-full justify-end gap-4">
          <Button
            onClick={() => {
              close();
              setShowLogin(true);
            }}
          >
            Cancel
          </Button>
          <Button disabled={loading} type="submit" variant="contained">
            {loading && <CircularProgress size={14} className="mr-1" />} Submit
          </Button>
        </div>
      </form>
      <div className="mt-5 text-center">
        Already have an account?{" "}
        <span
          onClick={() => {
            setShowLogin(true);
          }}
          className="!font-medium !cursor-pointer"
        >
          Sign in
        </span>
      </div>
    </div>
  );
}

export default MySignupForm;
