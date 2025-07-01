import React, { useEffect, useState } from "react";
import { FormLogin } from "../components/FormLogin";
import { FullScreenLoader } from "../components/FullScreenLoader";
import api from "../utils/api";

export const Login = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const despertarServidor = async () => {
      try {
        await api.get("/contratos/get");
        await api.get("/contratos/get");
      } catch (err) {
        console.error("Error despertando el servidor:", err);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 6000);
      }
    };

    despertarServidor();
  }, []);

  if (loading) {
    return <FullScreenLoader text="" color="blue-500" />;
  }

  return <FormLogin />;
};
