import { useEffect, useState } from "react";
import api from "../utils/api";
import { addHours, format, parseISO } from "date-fns";
import es from "date-fns/locale/es";

export const HorasTotales = ({ horasTotalesContrato = 240 }) => {
  const [total, setTotal] = useState(null);
  const [horasPorMes, setHorasPorMes] = useState({});
  const [resumenFinal, setResumenFinal] = useState({
    totalHoras: 0,
    totalContrato: 0,
    totalExtras: 0,
  });
  const [mesActivo, setMesActivo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resTotal, resHoras] = await Promise.all([
          api.get("/horas/total", { params: { contratoId: 1 } }),
          api.get("/horas", { params: { contratoId: 1 } }),
        ]);

        const horas = resHoras.data;

        const porMes = {};
        let totalHoras = 0;
        let totalExtras = 0;

        horas.forEach((h) => {
          const fecha = parseISO(h.fecha);
          const key = format(fecha, "MMMM yyyy", { locale: es });

          if (!porMes[key]) porMes[key] = { horas: 0, detalles: [] };

          porMes[key].horas += h.horas;
          porMes[key].detalles.push(h);

          totalHoras += h.horas;
        });

        const meses = Object.keys(porMes).length;
        const totalContrato = meses * 24;

        totalExtras = totalHoras - totalContrato;

        setHorasPorMes(porMes);
        setResumenFinal({
          totalHoras,
          totalContrato,
          totalExtras: totalExtras > 0 ? totalExtras : 0,
        });

        setTotal(resTotal.data.totalHoras || 0);
      } catch (err) {
        console.error("Error al obtener horas:", err);
      }
    };

    fetchData();
  }, []);

  if (total === null) return <p className="p-4">Cargando horas totales...</p>;

  const porcentaje = Math.min(
    100,
    (total / horasTotalesContrato) * 100
  ).toFixed(1);

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 shadow-inner w-full space-y-4 my-2 text-white">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-wide">Total trabajado</h2>
        <span className="text-md text-gray-400">⏱️</span>
      </div>

      {/* Gráfico */}
      <div className="flex flex-col items-center space-y-2">
        <div className="relative w-28 h-28">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(#10b981 ${
                porcentaje * 3.6
              }deg, #374151 ${porcentaje * 3.6}deg)`,
            }}
          />
          <div className="absolute inset-2 rounded-full bg-gray-900 flex items-center justify-center">
            <span className="text-white text-lg font-semibold">
              {porcentaje}%
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-300 text-center">
          {total} / {horasTotalesContrato} hs completadas
        </p>
      </div>

      {/* Acordeón de meses */}
      <div className="text-sm text-gray-300 space-y-2">
        {Object.entries(horasPorMes).map(([mes, datos]) => {
          const extras = datos.horas - 24;
          const abierto = mesActivo === mes;

          return (
            <div key={mes} className="border-b border-gray-700 pb-1">
              <button
                onClick={() => setMesActivo(abierto ? null : mes)}
                className="w-full text-left flex cursor-pointer justify-between items-center py-1 hover:text-emerald-400 transition-colors"
              >
                <span className="capitalize">{mes}</span>
                <span>
                  {datos.horas} / 24 hs trabajadas{" "}
                  {extras > 0 && (
                    <span className="text-emerald-400">
                      +{extras} hs extras
                    </span>
                  )}
                </span>
              </button>

              {/* Contenido desplegable */}
              {abierto && (
                <div className="pl-4 py-2 space-y-1">
                  {datos.detalles
                    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
                    .map((detalle) => (
                      <div
                        key={detalle.id}
                        className="flex justify-between text-gray-400 border-l-2 border-emerald-500 pl-2"
                      >
                        <span>
                          {format(
                            addHours(parseISO(detalle.fecha), 3),
                            "dd MMMM",
                            {
                              locale: es,
                            }
                          )}
                        </span>
                        <span>{detalle.horas} hs</span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Resumen final */}
      <div className="mt-3 border-t border-gray-700 pt-3 text-gray-200 text-sm text-center">
        <p>
          <strong>{resumenFinal.totalHoras}</strong> hs trabajadas /{" "}
          <strong>{resumenFinal.totalContrato}</strong> hs contrato
          {resumenFinal.totalExtras > 0 && (
            <>
              {" "}
              /{" "}
              <strong className="text-emerald-400">
                {resumenFinal.totalExtras}
              </strong>{" "}
              hs extras
            </>
          )}
        </p>
      </div>
    </div>
  );
};
