import { useEffect, useState } from "react";
import api from "../utils/api";
import { addHours } from "date-fns";

export const ResumenContrato = () => {
  const [contrato, setContrato] = useState(null);

  useEffect(() => {
    const fetchContrato = async () => {
      try {
        const res = await api.get("/contratos/get");
        setContrato(res.data);
      } catch (err) {
        console.error("Error al cargar contrato:", err);
      }
    };
    fetchContrato();
  }, []);

  if (!contrato) return <p className="p-6">Cargando contrato...</p>;

  const fechaInicio = addHours(
    new Date(contrato.fechaInicio),
    3
  ).toLocaleDateString();
  const fechaFin = addHours(
    new Date(contrato.fechaFin),
    3
  ).toLocaleDateString();

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 shadow-inner w-full  space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white tracking-wide">
          Contrato Antonella Rabiti
        </h2>
        <span className="text-sm text-gray-400">🗓️</span>
      </div>
      <p className="text-sm text-gray-300">
        Desde <span className="font-medium text-white">{fechaInicio}</span>{" "}
        hasta <span className="font-medium text-white">{fechaFin}</span>
      </p>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p className="text-sm text-gray-300">
          Total:{" "}
          <span className="font-semibold text-white">
            {contrato.horasTotales} hs
          </span>
        </p>
        <p className="text-xs text-gray-500">
          {contrato.horasMensuales} hs/mes esperadas
        </p>
      </div>
    </div>
  );
};
