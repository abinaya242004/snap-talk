import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { motion } from "framer-motion";
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { TbMessageCircleHeart } from "react-icons/tb";
import { loginSuccess, setError } from "../redux/slices/authSlice";
import Input from "../components/Input";
import Button from "../components/Button";
import ThemeToggle from "../components/ThemeToggle";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoadingLocal] = useState(false);
  const [error, setErrorLocal] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorLocal("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoadingLocal(true);
    setErrorLocal("");

    try {
      const response = await axios.post(
        "https://snap-talk-3-bl2l.onrender.com/api/auth/login",
        formData,
      );

      dispatch(
        loginSuccess({
          user: response.data.user,
          token: response.data.token,
        }),
      );

      navigate("/rooms");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setErrorLocal(errorMsg);
      dispatch(setError(errorMsg));
    } finally {
      setLoadingLocal(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#fdfdfd] dark:bg-[#0b0b0d] overflow-hidden relative">
      {/* Decorative Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--primary-accent)]/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--secondary-accent)]/5 blur-[100px] pointer-events-none" />

      <div className="absolute top-8 right-8">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[400px] px-6"
      >
        {/* Logo Section */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-[var(--primary-accent)] to-[var(--secondary-accent)] flex items-center justify-center text-white shadow-xl shadow-pink-500/20"
          >
            <TbMessageCircleHeart size={44} />
          </motion.div>
          <h1 className="text-3xl font-black text-[var(--text-main)] tracking-tighter">
            Snap <span className="text-[var(--primary-accent)]">Talk</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium mt-1">
            Welcome back!
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-[#121215] p-8 rounded-[32px] border border-zinc-100 dark:border-zinc-800 shadow-2xl shadow-black/[0.03]">
          <form onSubmit={handleLogin} className="space-y-4">
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
                className="py-2.5"
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
                error={error}
                className="py-2.5"
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !formData.username || !formData.password}
              fullWidth
              size="lg"
              className="py-3.5 rounded-2xl text-sm font-bold bg-[var(--primary-accent)] text-white shadow-lg shadow-pink-500/20 transition-all active:scale-[0.98] mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-zinc-500 text-xs font-medium">
              New here?{" "}
              <Link
                to="/register"
                className="text-[var(--primary-accent)] hover:underline font-bold transition-all ml-1"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
