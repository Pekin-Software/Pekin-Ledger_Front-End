import React, { useState, useMemo} from "react";
import { Calendar } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

const data = [
  { month: "Sep", revenue: 2220000, profit: 1500000 },
  { month: "Oct", revenue: 2000000, profit: 1500000 },
  { month: "Nov", revenue: 1500000, profit: 2500000 }, 
  { month: "Dec", revenue: 800000, profit: 1200000 },
  { month: "Jan", revenue: 900000, profit: 1500000 },
  { month: "Feb", revenue: 2203123, profit: 1400000 },
  { month: "Mar", revenue: 2203123, profit: 1700000 },
  { month: "April", revenue: 2203123, profit: 1550000 },
  { month: "May", revenue: 2803123, profit: 1900000 },
  { month: "June", revenue: 2203123, profit: 2000000 },
  { month: "Jul", revenue: 2203123, profit: 3000000 },
  { month: "Aug", revenue: 2203123, profit: 1900000 },
];
// Get current month abbreviation (e.g., "Aug")



// Custom vertical line (cursor)
const CustomCursor = ({ points, height }) => {
  const { x } = points[0];
  return (
    <line
      x1={x}
      y1={0}
      x2={x}
      y2={height}
      stroke="#E5E7EB"
      strokeDasharray="2 2"
    />
  );
};

// const CustomTooltip = ({ active, payload, label, coordinate, setHover }) => {
//   React.useEffect(() => {
//     setHover(active); // trigger glow
//   }, [active, setHover]);
//   const currentMonth= new Date().toLocaleString("default", { month: "short", year: "numeric" });
//   if (!active || !payload || !payload.length) return null;

//   return (
//     <AnimatePresence>
//       <motion.div
//         initial={{ opacity: 0, y: 4 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: 4 }}
//         transition={{ duration: 0.2 }}
//         style={{
//           // position: "absolute",
//           left: coordinate.x,  // use the coordinate prop
//           top: coordinate.y - 40, // shift upward to appear above dot
//           transform: "translateX(-50%)",
//           pointerEvents: "none",
//           zIndex: 10,
//         }}
//       >
//         <div
//           style={{
//             background: "#fff",
//             padding: "10px 14px",
//             border: "1px solid #E5E7EB",
//             borderRadius: "8px",
//             boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
//             fontSize: "8px",
//           }}
//         >
//           {label === currentMonth && (
//             <p style={{ margin: 0, fontWeight: "500", fontSize: "10px", color: "#6B7280" }}>
//               This Month
//             </p>
//           )}
//           <p style={{ margin: 0, fontWeight: "bold", fontSize: "12px", color: "#111827" }}>
//             {payload[0].value.toLocaleString()}
//           </p>
//           <p style={{ margin: 0, fontSize: "10px", color: "#9CA3AF" }}>{label}</p>
//         </div>

//         <div
//           style={{
//             position: "absolute",
//             bottom: "-5px",
//             left: "50%",
//             transform: "translateX(-50%) rotate(45deg)",
//             width: "10px",
//             height: "10px",
//             background: "#fff",
//             borderLeft: "1px solid #E5E7EB",
//             borderBottom: "1px solid #E5E7EB",
//           }}
//         />
//       </motion.div>
//     </AnimatePresence>
//   );
// };

// Pulsing active dot

const CustomTooltip = ({ active, payload, label, coordinate, setHover }) => {
  React.useEffect(() => {
    setHover(active); // trigger glow
  }, [active, setHover]);

  const currentMonth = new Date().toLocaleString("default", {
    month: "short",
    year: "numeric",
  });

  if (!active || !payload || !payload.length) return null;

  const tooltipMonthYear = `${label} ${new Date().getFullYear()}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 4 }}
        transition={{ duration: 0.2 }}
        style={{
          left: coordinate.x,
          top: coordinate.y - 50,
          transform: "translateX(-50%)",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "10px 14px",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
            fontSize: "10px",
            minWidth: "130px",
          }}
        >
          {/* Month + Year */}
          <p
            style={{
              margin: 0,
              fontWeight: "600",
              fontSize: "12px",
              color: "#111827",
            }}
          >
            {tooltipMonthYear}
          </p>

          {/* This Month tag */}
          {tooltipMonthYear === currentMonth && (
            <p
              style={{
                margin: "2px 0",
                fontWeight: "500",
                fontSize: "10px",
                color: "#6B7280",
              }}
            >
              This Month
            </p>
          )}

          {/* Revenue */}
          {payload.find((p) => p.dataKey === "revenue") && (
            <p style={{ margin: "2px 0", fontSize: "11px", color: "#374151" }}>
              Revenue:{" "}
              <span style={{ fontWeight: "bold" }}>
                {payload
                  .find((p) => p.dataKey === "revenue")
                  .value.toLocaleString()}
              </span>
            </p>
          )}

          {/* Profit */}
          {payload.find((p) => p.dataKey === "profit") && (
            <p style={{ margin: "2px 0", fontSize: "11px", color: "#374151" }}>
              Profit:{" "}
              <span style={{ fontWeight: "bold" }}>
                {payload
                  .find((p) => p.dataKey === "profit")
                  .value.toLocaleString()}
              </span>
            </p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const PulsingDot = ({ cx=0, cy=0, fill = "#000" }) => (
  <>
    <motion.circle
      cx={cx}
      cy={cy}
      r={8}
      fill={fill}
      opacity={0.2}
      animate={{ r: [8, 14, 8], opacity: [0.2, 0, 0.2] }}
      transition={{ repeat: Infinity, duration: 1.5 }}
    />
    <circle cx={cx} cy={cy} r={6} fill={fill} stroke="#fff" strokeWidth={2} />
  </>
);

const CustomLegend = () => (
  <div className="legend">
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      <span style={{ width: "12px", height: "12px", background: "#1570ef93", borderRadius: "50%" }} />
      Revenue
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      <span style={{ width: "12px", height: "12px", background: "#69676291", borderRadius: "50%" }} />
      Profit
    </div>
  </div>
);

function ProfitRevenueChart() {
  const [hover, setHover] = useState(false);
   const maxValue = useMemo(() => {
    return Math.max(...data.map((d) => Math.max(d.revenue, d.profit)));
  }, []);

const ticks = useMemo(() => {
  const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
  const niceMax = Math.ceil(maxValue / magnitude) * magnitude;
  const step = niceMax / 5;
  return Array.from({ length: 6 }, (_, i) => step * i);
}, [maxValue]);

const yDomain = [0, ticks[ticks.length - 1]]; // force domain to end at last tick

  return (
    <>
     <span className="chart-header">
       <p className="card-title">Profit & Revenue</p>
        <CustomLegend />
      <button className="chart-selector"><Calendar size={16} />Weekly</button>
     </span>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
        >
          <CartesianGrid 
            stroke="#64646dff"  
            strokeWidth={0.6}  
            vertical={false}  
            horizontal={true} // ensure each tick has a grid
          />

          <XAxis 
          dataKey="month" 
          tick={{ fontSize: 12, fill: "#6B7280" }}
         
          />
          <YAxis 
          tick={{ fontSize: 12, fill: "#6B7280" }}
            domain={yDomain}
            ticks={ticks} // dynamic ticks
            allowDecimals={false}  // avoids weird float ticks
            tickFormatter={(value) => {
              if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
              if (value >= 1_000) return (value / 1_000).toFixed(0) + "K";
              return value;
            }}
          />

          <Tooltip content={<CustomTooltip setHover={setHover} />} cursor={<CustomCursor />} />

         
          {/* Revenue Glow - Cinematic Fade */}
          <AnimatePresence>
            {hover && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.05 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                
              </motion.g>
            )}
          </AnimatePresence>
            
          {/* Main Revenue Line */}
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#1570ef93"
            strokeWidth={2}   dot={false}
            activeDot={false}
          />

          {/* Profit Line */}
          <Line
            type="monotone"
            dataKey="profit"
            stroke="#69676291"
            strokeWidth={2}  dot={false}
            activeDot={(props) => <PulsingDot {...props} fill="#2b2a29c9" />}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}

export default React.memo(ProfitRevenueChart);
