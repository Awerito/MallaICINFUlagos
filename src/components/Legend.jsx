import areas from "../data/areas.json";

export default function Legend() {
  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-wrap gap-x-6 gap-y-2.5">
        {Object.entries(areas).map(([areaId, area]) => (
          <li key={areaId} className="flex items-center gap-2">
            <span
              className="inline-block size-4 border-2 border-ink"
              style={{ background: area.color }}
            />
            {area.label}
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted">
        Licenciatura en Ciencias de la Ingeniería: todo aprobado hasta el 8°
        semestre · Título de Ingeniería Civil en Informática: toda la malla
        aprobada
      </p>
    </div>
  );
}
