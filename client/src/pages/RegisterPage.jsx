import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { motion } from "framer-motion";
import { FiUser, FiLock, FiEye, FiEyeOff, FiCheckCircle } from "react-icons/fi";
import { TbMessageCircleHeart } from "react-icons/tb";
import { registerSuccess, setError } from "../redux/slices/authSlice";
import Input from "../components/Input";
import Button from "../components/Button";
import ThemeToggle from "../components/ThemeToggle";

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setErrorLocal] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorLocal("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorLocal("");

    if (formData.password !== formData.confirmPassword) {
      setErrorLocal("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setErrorLocal("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          username: formData.username,
          password: formData.password,
        }
      );

      dispatch(
        registerSuccess({
          user: response.data.user,
        })
      );

      navigate("/");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Registration failed. Please try again.";
      setErrorLocal(errorMsg);
      dispatch(setError(errorMsg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-white">
      {/* Left Panel: Branding & Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[var(--bg-main)] items-center justify-center overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[var(--primary-accent)]/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[var(--secondary-accent)]/20 blur-[120px]" />
        
        <div className="relative z-10 text-center px-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-32 h-32 mx-auto mb-8 rounded-[40px] bg-gradient-to-br from-[var(--primary-accent)] to-[var(--secondary-accent)] flex items-center justify-center text-white shadow-2xl shadow-pink-500/40"
          >
            <TbMessageCircleHeart size={70} />
          </motion.div>
          
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-6xl font-black text-[var(--text-main)] mb-6 tracking-tighter"
          >
            Snap <span className="text-[var(--primary-accent)]">Talk</span>
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl text-[var(--text-muted)] font-medium max-w-md mx-auto leading-relaxed"
          >
            Experience the future of communication. Beautiful, private, and blazingly fast.
          </motion.p>
        </div>

        <div className="absolute top-8 left-8">
          <ThemeToggle />
        </div>
      </div>

      {/* Right Panel: Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-32 bg-white dark:bg-[#0b0b0d] transition-colors relative">
        <div className="absolute top-8 right-8 lg:hidden">
          <ThemeToggle />
        </div>

        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[380px] bg-white dark:bg-[#121215] p-8 rounded-[32px] border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-black/[0.02]"
        >
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-black text-[#1a1a1a] dark:text-white mb-1 leading-tight">Create Account</h2>
            <p className="text-zinc-500 text-xs font-medium tracking-wide uppercase">Join Snap Talk</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-3">
              <Input
                label="Username"
                name="username"
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                icon={FiUser}
                required
                minLength="3"
                className="py-2.5 px-4 rounded-xl text-sm"
              />

              <Input
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                icon={FiLock}
                rightIcon={showPassword ? FiEyeOff : FiEye}
                onRightIconClick={() => setShowPassword(!showPassword)}
                required
                minLength="6"
                className="py-2.5 px-4 rounded-xl text-sm"
              />

              <Input
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm"
                value={formData.confirmPassword}
                onChange={handleChange}
                icon={FiCheckCircle}
                rightIcon={showConfirmPassword ? FiEyeOff : FiEye}
                onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                required
                minLength="6"
                error={error}
                className="py-2.5 px-4 rounded-xl text-sm"
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !formData.username || !formData.password || !formData.confirmPassword}
              fullWidth
              size="lg"
              className="py-3 rounded-xl text-sm font-bold bg-[var(--primary-accent)] hover:bg-[var(--primary-accent)]/90 text-white shadow-lg shadow-pink-500/20 transition-all active:scale-[0.98] mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                "Register"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-zinc-500 text-xs font-medium">
              Member?{" "}
              <Link
                to="/"
                className="text-[var(--primary-accent)] hover:underline font-bold transition-all ml-1"
              >
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
