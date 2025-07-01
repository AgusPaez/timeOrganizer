import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import es from "date-fns/locale/es";
import api from "../utils/api";

export const ModalDiaDetalle = ({
  isOpen,
  onClose,
  fecha,
  horaExistente,
  anotacionExistente,
  contratoId,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    reset({
      fecha: fecha ? format(fecha, "yyyy-MM-dd") : "",
      horas: horaExistente?.horas || "",
      comentario: horaExistente?.comentario || "",
      anotacion: anotacionExistente?.texto || "",
      tipo: anotacionExistente?.tipo || "diaria",
    });
  }, [fecha, horaExistente, anotacionExistente, reset]);

  const onSubmit = async (data) => {
    try {
      // Guardar horas
      if (data.horas) {
        if (horaExistente) {
          await api.put(`/horas/${horaExistente.id}`, {
            horas: Number(data.horas),
            comentario: data.comentario,
            fecha: data.fecha,
            contratoId,
          });
        } else {
          await api.post(`/horas`, {
            horas: Number(data.horas),
            comentario: data.comentario,
            fecha: data.fecha,
            contratoId,
          });
        }
      }

      // Guardar anotación
      if (data.anotacion?.trim()) {
        if (anotacionExistente) {
          await api.put(`/anotaciones/${anotacionExistente.id}`, {
            texto: data.anotacion,
            tipo: data.tipo,
            fecha: data.fecha,
            contratoId,
          });
        } else {
          await api.post(`/anotaciones`, {
            texto: data.anotacion,
            tipo: data.tipo,
            fecha: data.fecha,
            contratoId,
          });
        }
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error guardando datos:", err);
    }
  };

  const eliminarHora = async () => {
    if (
      horaExistente &&
      window.confirm(
        "¿Estás seguro de que querés eliminar las horas trabajadas de este día?"
      )
    ) {
      try {
        await api.delete(`/horas/${horaExistente.id}`);
        onSuccess();
        onClose();
      } catch (err) {
        console.error("Error eliminando horas:", err);
      }
    }
  };

  const eliminarAnotacion = async () => {
    if (
      anotacionExistente &&
      window.confirm(
        "¿Estás seguro de que querés eliminar la anotación de este día?"
      )
    ) {
      try {
        await api.delete(`/anotaciones/${anotacionExistente.id}`);
        onSuccess();
        onClose();
      } catch (err) {
        console.error("Error eliminando anotación:", err);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-lg border border-gray-700 text-white">
        <h2 className="text-lg font-semibold mb-4">
          Detalles del {format(fecha, "EEEE d MMMM", { locale: es })}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register("fecha")} />

          {/* Horas */}
          <div>
            <label className="block text-sm mb-1">Horas trabajadas</label>
            <select
              className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
              {...register("horas")}
            >
              <option value="">-- Seleccionar --</option>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n} hs
                </option>
              ))}
            </select>
          </div>

          {/* Comentario de horas */}
          <div>
            <label className="block text-sm mb-1">Comentario</label>
            <textarea
              className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
              rows={2}
              {...register("comentario")}
            />
          </div>

          {horaExistente && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={eliminarHora}
                className="text-red-400 text-xs underline hover:text-red-300"
              >
                🗑️ Eliminar horas trabajadas
              </button>
            </div>
          )}

          <hr className="border-gray-700 my-2" />

          {/* Anotación */}
          <div>
            <label className="block text-sm mb-1">Anotación</label>
            <textarea
              className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
              rows={2}
              {...register("anotacion")}
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm mb-1">Tipo de anotación</label>
            <select
              className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
              {...register("tipo")}
            >
              <option value="diaria">Diaria</option>
              <option value="semanal">Semanal</option>
            </select>
          </div>

          {anotacionExistente && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={eliminarAnotacion}
                className="text-red-400 text-xs underline hover:text-red-300"
              >
                🗑️ Eliminar anotación
              </button>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-white"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
