export const Loader = ({ text = "Cargando..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-white animate-fade-in">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
      <p className="text-sm text-gray-300">{text}</p>
    </div>
  );
};
