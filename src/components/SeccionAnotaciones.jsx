import React, { useEffect, useState } from "react";
import api from "../utils/api";
import {
  startOfWeek,
  addDays,
  format,
  parseISO,
  isSameDay,
  addWeeks,
  subWeeks,
  addHours,
} from "date-fns";
import es from "date-fns/locale/es";
import { ModalDiaDetalle } from "./ModalDiaDetalle";

export const SeccionAnotaciones = ({ contratoId = 1 }) => {
  const [anotaciones, setAnotaciones] = useState([]);
  const [horas, setHoras] = useState([]);
  const [semanaBase, setSemanaBase] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [semana, setSemana] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [horaDelDia, setHoraDelDia] = useState(null);
  const [anotacionDelDia, setAnotacionDelDia] = useState(null);

  useEffect(() => {
    const fetchAnotaciones = async () => {
      try {
        const [resAnotaciones, resHoras] = await Promise.all([
          api.get("/anotaciones", { params: { contratoId } }),
          api.get("/horas", { params: { contratoId } }),
        ]);
        setAnotaciones(resAnotaciones.data || []);
        setHoras(resHoras.data || []);
      } catch (err) {
        console.error("Error al obtener datos:", err);
      }
    };

    fetchAnotaciones();
  }, [contratoId]);

  useEffect(() => {
    const dias = Array.from({ length: 5 }, (_, i) => addDays(semanaBase, i));
    setSemana(dias);
  }, [semanaBase]);

  const getNotasDelDia = (dia) =>
    anotaciones.filter((nota) =>
      isSameDay(addHours(parseISO(nota.fecha), 3), dia)
    );

  const getHorasDelDia = (dia) =>
    horas.filter((h) => isSameDay(addHours(parseISO(h.fecha), 3), dia));

  const siguienteSemana = () => {
    setSemanaBase((prev) => addWeeks(prev, 1));
  };

  const anteriorSemana = () => {
    setSemanaBase((prev) => subWeeks(prev, 1));
  };
  const abrirModalConDatos = (dia) => {
    setFechaSeleccionada(dia);
    setHoraDelDia(
      horas.find((h) => isSameDay(addHours(parseISO(h.fecha), 3), dia)) || null
    );
    setAnotacionDelDia(
      anotaciones.find((a) => isSameDay(addHours(parseISO(a.fecha), 3), dia)) ||
        null
    );
    setModalAbierto(true);
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-inner p-6 space-y-5 text-white w-full my-2">
      {/* Encabezado y navegación */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h2 className="text-lg font-semibold tracking-wide text-center sm:text-left">
          📅 Anotaciones semanales
        </h2>
        <div className="flex justify-center sm:justify-end gap-2">
          <button
            onClick={anteriorSemana}
            className="px-3 py-1 rounded-md bg-gray-800 hover:bg-gray-700 text-sm border border-gray-600 transition"
          >
            ← Semana anterior
          </button>
          <button
            onClick={siguienteSemana}
            className="px-3 py-1 rounded-md bg-gray-800 hover:bg-gray-700 text-sm border border-gray-600 transition"
          >
            Semana siguiente →
          </button>
        </div>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {semana.map((dia) => {
          const notas = getNotasDelDia(dia);
          const horasDia = getHorasDelDia(dia);
          return (
            <div
              key={dia.toISOString()}
              onClick={() => abrirModalConDatos(dia)}
              className="cursor-pointer bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col min-h-[200px] transition hover:shadow-md hover:border-emerald-500"
            >
              <div className="text-sm font-semibold mb-2 text-white/90">
                {format(dia, "EEEE d MMM", { locale: es })}
              </div>

              {/* Horas trabajadas */}
              {horasDia.length > 0 ? (
                <div className="flex flex-col gap-2 mb-2">
                  {horasDia.map((h) => (
                    <div
                      key={h.id}
                      className="bg-emerald-600/70 text-xs text-white rounded-md p-2"
                    >
                      <p>
                        <strong>{h.horas} hs</strong>
                      </p>
                      {h.comentario && (
                        <p className="text-white/90 italic mt-1">
                          "{h.comentario}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 italic mb-2">
                  No se registraron horas
                </p>
              )}

              {/* Anotaciones */}
              {notas.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {notas.map((nota) => (
                    <div
                      key={nota.id}
                      className={`text-xs p-2 rounded-md break-words transition-all
                    ${
                      nota.tipo === "semanal"
                        ? "bg-blue-600/80 text-white"
                        : "bg-orange-600/80 text-white"
                    }`}
                    >
                      {nota.texto}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 italic">Sin anotaciones</p>
              )}
            </div>
          );
        })}
      </div>
      <ModalDiaDetalle
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        fecha={fechaSeleccionada}
        horaExistente={horaDelDia}
        anotacionExistente={anotacionDelDia}
        contratoId={contratoId}
        onSuccess={() => {
          // Recargar horas y anotaciones
          setModalAbierto(false);
          setSemanaBase((prev) => new Date(prev)); // Forzar recarga
        }}
      />
    </div>
  );
};
