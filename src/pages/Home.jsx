import React from "react";
import { ResumenContrato } from "../components/ResumenContrato";
import { HorasTotales } from "../components/HorasTotales";
import { HorasDeLaSemana } from "../components/HorasDeLaSemana";
import { SeccionAnotaciones } from "../components/SeccionAnotaciones";

export const Home = () => {
  return (
    <>
      <ResumenContrato />
      <HorasTotales />
      <HorasDeLaSemana />
      <SeccionAnotaciones />
    </>
  );
};
