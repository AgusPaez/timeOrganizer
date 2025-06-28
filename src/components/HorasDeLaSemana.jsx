import { useEffect, useState } from "react";
import api from "../utils/api";
import { format, parseISO, addHours } from "date-fns";
import es from "date-fns/locale/es";

export const HorasDeLaSemana = ({ contratoId = 1 }) => {
  const [registros, setRegistros] = useState([]);
  const [total, setTotal] = useState(0);
  const [abierto, setAbierto] = useState(null);

  const toggleAcordeon = (fecha) => {
    setAbierto((prev) => (prev === fecha ? null : fecha));
  };

  useEffect(() => {
    const fetchHorasSemana = async () => {
      try {
        const hoy = new Date();
        const dia = hoy.getDay();
        const lunes = new Date(hoy);
        const diferencia = dia === 0 ? -6 : 1 - dia;
        lunes.setDate(hoy.getDate() + diferencia);
        const desde = format(lunes, "yyyy-MM-dd");

        const res = await api.get("/horas/semana", {
          params: { contratoId, desde },
        });

        const datosOrdenados = [...res.data].sort((a, b) =>
          a.fecha.localeCompare(b.fecha)
        );

        setRegistros(datosOrdenados);
        const suma = datosOrdenados.reduce((acc, item) => acc + item.horas, 0);
        setTotal(suma);
      } catch (err) {
        console.error("Error al obtener horas de la semana:", err);
      }
    };

    fetchHorasSemana();
  }, [contratoId]);

  const agrupadoPorFecha = registros.reduce((acc, item) => {
    if (!acc[item.fecha]) {
      acc[item.fecha] = [];
    }
    acc[item.fecha].push(item);
    return acc;
  }, {});

  const fechasOrdenadas = Object.keys(agrupadoPorFecha).sort();

  let acumuladas = 0;

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 shadow-inner w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white tracking-wide">
          🗓️ Horas de la semana
        </h2>
        <span className="text-sm text-gray-400">{total} hs</span>
      </div>

      <ul className="divide-y divide-gray-700 text-sm text-gray-300">
        {fechasOrdenadas.map((fecha) => {
          const items = agrupadoPorFecha[fecha];
          const horasDia = items.reduce((sum, item) => sum + item.horas, 0);

          let normales = 0;
          let extras = 0;

          if (acumuladas >= 6) {
            extras = horasDia;
          } else if (acumuladas + horasDia <= 6) {
            normales = horasDia;
          } else {
            normales = 6 - acumuladas;
            extras = horasDia - normales;
          }

          acumuladas += horasDia;

          const fechaFormateada = format(
            addHours(parseISO(fecha), 3),
            "EEEE dd/MM",
            { locale: es }
          );

          return (
            <li key={fecha} className="py-2">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleAcordeon(fecha)}
              >
                <span className="capitalize text-white">{fechaFormateada}</span>
                <span className="font-medium text-white flex items-center gap-2">
                  {normales > 0 && <span>{normales} hs</span>}
                  {extras > 0 && (
                    <span className="text-green-400 text-xs bg-green-900 px-2 py-0.5 rounded-full">
                      + {extras}hs ex
                    </span>
                  )}
                </span>
              </div>

              {abierto === fecha && (
                <div className="mt-2 ml-4 space-y-1 text-gray-400 text-sm">
                  {items.map((registro, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:justify-between"
                    >
                      <span className="italic">
                        {registro.comentario || "Sin comentarios"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
