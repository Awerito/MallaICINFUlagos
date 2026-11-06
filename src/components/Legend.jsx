import areas from "../data/areas.json";

export default function Legend() {
  return (
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
  );
}
