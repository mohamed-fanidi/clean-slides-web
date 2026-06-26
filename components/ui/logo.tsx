import { PieChart2 } from "@solar-icons/react/ssr";

export default function Logo() {
  return (
    <div className="flex items-center gap-1.5">
      <div className="size-6 rounded-md bg-secondary aspect-square flex items-center justify-center">
        <PieChart2
          weight="BoldDuotone"
          className="size-4 rotate90"
          color="#00bc7d"
        />
      </div>
      <span>CleanSlide</span>
    </div>
  );
}
