import React, { useState } from "react";
import { useForm } from "react-hook-form";
import authService from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader } from "./Loader";

export const FormLogin = () => {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      const res = await authService.login(data.email, data.password);
      login(res.token);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.error || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="h-[90vh] flex items-center justify-center bg-gradient-to-br">
      <div className="w-full max-w-sm bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
        <h2 className="text-center text-white text-2xl font-semibold mb-6 tracking-wide">
          Iniciar sesión
        </h2>

        {loading ? (
          <Loader text="Iniciando sesión..." />
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <input
              type="email"
              placeholder="Correo electrónico"
              {...register("email")}
              className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
            />
            <input
              type="password"
              placeholder="Contraseña"
              {...register("password")}
              className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
            />
            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}
            <button
              type="submit"
              className="w-full py-2 mt-2 cursor-pointer rounded-md bg-white text-gray-900 font-semibold hover:bg-gray-200 transition-all"
            >
              Ingresar
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
