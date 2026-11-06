import { useLayoutEffect, useState } from "react";

function arrowPathBetween(boardElement, fromId, toId) {
  const board = boardElement.getBoundingClientRect();
  const from = boardElement
    .querySelector(`[data-course-id="${fromId}"]`)
    .getBoundingClientRect();
  const to = boardElement
    .querySelector(`[data-course-id="${toId}"]`)
    .getBoundingClientRect();
  const startX = from.right - board.left;
  const startY = from.top - board.top + from.height / 2;
  const endX = to.left - board.left - 3;
  const endY = to.top - board.top + to.height / 2;
  const isAdjacentColumn = endX - startX < 24;
  if (isAdjacentColumn) {
    const tipX = endX + 2;
    const baseX = tipX - 10;
    return {
      headOnly: true,
      d: `M${baseX},${endY - 7} L${tipX},${endY} L${baseX},${endY + 7} z`,
    };
  }
  const bend = Math.max(24, (endX - startX) / 2);
  return {
    headOnly: false,
    d: `M${startX},${startY} C${startX + bend},${startY} ${endX - bend},${endY} ${endX},${endY}`,
  };
}

export default function PrerequisiteArrows({ boardRef, arrows }) {
  const [paths, setPaths] = useState([]);

  useLayoutEffect(() => {
    function measure() {
      setPaths(
        arrows.map((arrow) => ({
          ...arrow,
          ...arrowPathBetween(boardRef.current, arrow.fromId, arrow.toId),
        })),
      );
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [arrows, boardRef]);

  return (
    <svg className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible">
      <defs>
        <marker
          id="arrow-head"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" className="fill-ink" />
        </marker>
      </defs>
      {paths.map((path) => (
        <path
          key={`${path.fromId}-${path.toId}`}
          d={path.d}
          markerEnd={path.headOnly ? undefined : "url(#arrow-head)"}
          className={`${path.headOnly ? "fill-ink" : "fill-none stroke-ink stroke-[2.5] [stroke-linecap:round]"} ${path.isPreview ? "opacity-45" : ""}`}
        />
      ))}
    </svg>
  );
}
