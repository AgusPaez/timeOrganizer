import React, { useEffect, useState } from "react";
import { FullScreenLoader } from "../components/FullScreenLoader";
import { ResumenContrato } from "../components/ResumenContrato";
import { HorasTotales } from "../components/HorasTotales";
import { HorasDeLaSemana } from "../components/HorasDeLaSemana";
import { SeccionAnotaciones } from "../components/SeccionAnotaciones";

export const Home = () => {
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      const readyTimer = setTimeout(() => {
        setReady(true);
      }, 1000);

      return () => clearTimeout(readyTimer);
    }
  }, [loading]);

  if (loading) return <FullScreenLoader text="" />;

  return (
    <div
      className={`transition-opacity duration-700 ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    >
      <ResumenContrato />
      <HorasTotales />
      <HorasDeLaSemana />
      <SeccionAnotaciones />
    </div>
  );
};
