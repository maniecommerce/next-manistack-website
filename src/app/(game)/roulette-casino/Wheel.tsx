"use client";
import { motion } from "framer-motion";

export default function Wheel({
  wheelRotation,
  EURO_NUMBERS,
  setSpinning,
  setAutoPlay,
  autoPlay,
  lastResult,
  round,
  isRed
}: any) {
 

  return (
    <div className="col-span-1 flex flex-col items-center gap-4">
      <div className="relative w-72 h-72">
        <motion.div
          animate={{ rotate: wheelRotation }}
          transition={{ ease: [0.22, 1, 0.36, 1], duration: 5 }}
          className="absolute inset-0 rounded-full overflow-hidden"
        >
          {/* Wheel rings - render pockets */}
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow
                  dx="0"
                  dy="2"
                  stdDeviation="2"
                  floodColor="#000"
                  floodOpacity="0.6"
                />
              </filter>
            </defs>
            <g transform="translate(100,100)">
              {EURO_NUMBERS.map((num: any, i: any) => {
                const angle = (360 / EURO_NUMBERS.length) * i;
                const start = (angle * Math.PI) / 180;
                const end =
                  ((angle + 360 / EURO_NUMBERS.length) * Math.PI) / 180;
                const rOuter = 95;
                const rInner = 50;
                const x1 = Math.cos(start) * rInner;
                const y1 = Math.sin(start) * rInner;
                const x2 = Math.cos(start) * rOuter;
                const y2 = Math.sin(start) * rOuter;
                const x3 = Math.cos(end) * rOuter;
                const y3 = Math.sin(end) * rOuter;
                const x4 = Math.cos(end) * rInner;
                const y4 = Math.sin(end) * rInner;
                const path = `M ${x1} ${y1} L ${x2} ${y2} A ${rOuter} ${rOuter} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${rInner} ${rInner} 0 0 0 ${x1} ${y1}`;
                const color =
                  num === 0 ? "#2f855a" : isRed(num) ? "#e11d48" : "#0f172a";
                return (
                  <g key={num} transform={`rotate(${angle})`}>
                    <path
                      d={path}
                      fill={color}
                      stroke="#111827"
                      strokeWidth="0.5"
                    />
                    {/* Number label */}
                    <g
                      transform={`rotate(${
                        360 / EURO_NUMBERS.length / 2
                      }) translate(${(rInner + rOuter) / 2},0)`}
                    >
                      <text
                        x="0"
                        y="3"
                        fontSize="6"
                        textAnchor="middle"
                        fill="#fff"
                        style={{ fontFamily: "monospace" }}
                      >
                        {num}
                      </text>
                    </g>
                  </g>
                );
              })}
              {/* Inner hub */}
              <circle r="40" fill="#0b1220" />
              <circle r="28" fill="#111827" />
            </g>
          </svg>
        </motion.div>

        {/* Pointer */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center shadow-lg text-slate-900 font-bold">
          ▲
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setSpinning(false)}
          className="px-4 py-2 rounded-lg bg-slate-700/60"
        >
          Reset
        </button>
        <button
          onClick={() => setAutoPlay((a:any) => !a)}
          className={`px-4 py-2 rounded-lg ${
            autoPlay ? "bg-amber-400 text-slate-900" : "bg-slate-700/60"
          }`}
        >
          {autoPlay ? "Auto: ON" : "Auto: OFF"}
        </button>
      </div>

      <div className="text-center">
        <div className="text-xs text-slate-400">Last Result</div>
        <div className="mt-2 inline-flex items-center gap-2">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              lastResult === null
                ? "bg-slate-700/40"
                : "bg-amber-400 text-slate-900"
            }`}
          >
            {lastResult === null ? "—" : lastResult}
          </div>
          <div className="text-sm text-slate-300">Round #{round - 1}</div>
        </div>
      </div>
    </div>
  );
}
