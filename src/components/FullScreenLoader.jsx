export const FullScreenLoader = ({
  text = "Inicializando la aplicación...",
  color = "emerald-500",
}) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 text-white">
      <div
        className={`w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mb-4 border-${color}`}
      />
      <p className="text-md text-gray-300">{text}</p>
    </div>
  );
};
