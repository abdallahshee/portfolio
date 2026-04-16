import { Paper } from '@mantine/core'
const ServiceComponent = () => {
    return (
        <Paper
            radius={8}
            shadow="none"
            className="relative mx-auto w-full max-w-full overflow-hidden bg-white p-0 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:max-w-[26rem] dark:bg-slate-900"
        >
            <div className="relative h-[240px] overflow-hidden sm:h-[280px] lg:h-[320px]">
                <img
                    src="/images/services.jpg"
                    alt="Distributed software system with multiple connected services"
                    className="block h-full w-full rounded-lg object-cover"
                />
                {/* overlays */}
                <div className="absolute inset-0 bg-slate-950/45" />
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/25 via-transparent to-teal-500/20" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.30),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.22),transparent_32%)]" />

                {/* animated connection lines */}
                <div className="absolute inset-0 opacity-50">
                    <div className="flow-line absolute left-[18%] top-[22%] h-px w-[30%] rotate-[18deg] bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
                    <div className="flow-line flow-delay-1 absolute left-[42%] top-[28%] h-px w-[24%] rotate-[-22deg] bg-gradient-to-r from-transparent via-cyan-200 to-transparent" />
                    <div className="flow-line flow-delay-2 absolute left-[28%] top-[56%] h-px w-[34%] rotate-[10deg] bg-gradient-to-r from-transparent via-teal-200 to-transparent" />
                    <div className="flow-line flow-delay-3 absolute left-[54%] top-[64%] h-px w-[18%] rotate-[-28deg] bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
                </div>

                {/* floating system nodes (ALL SMALLER) */}

                {/* YELLOW (2) */}
                <div className="node-float absolute left-[12%] top-[18%] h-3 w-3 rounded-full bg-yellow-400 shadow-[0_0_18px_rgba(250,204,21,0.9)]" />
                <div className="node-float-slow absolute left-[82%] top-[30%] h-3 w-3 rounded-full bg-yellow-300 shadow-[0_0_18px_rgba(253,224,71,0.9)]" />

                {/* RED (2) */}
                <div className="node-float-delayed absolute left-[20%] top-[65%] h-3 w-3 rounded-full bg-red-400 shadow-[0_0_18px_rgba(248,113,113,0.9)]" />
                <div className="node-float-slow-delayed absolute left-[75%] top-[15%] h-3 w-3 rounded-full bg-red-300 shadow-[0_0_18px_rgba(252,165,165,0.9)]" />

                {/* GREEN (3) */}
                <div className="node-float absolute left-[30%] top-[75%] h-3 w-3 rounded-full bg-green-400 shadow-[0_0_18px_rgba(74,222,128,0.9)]" />
                <div className="node-float-slow absolute left-[55%] top-[55%] h-3 w-3 rounded-full bg-green-300 shadow-[0_0_18px_rgba(134,239,172,0.9)]" />
                <div className="node-float-extra absolute left-[10%] top-[50%] h-3 w-3 rounded-full bg-green-500 shadow-[0_0_18px_rgba(34,197,94,0.9)]" />

                {/* ORANGE (2) */}
                <div className="node-float-delayed absolute left-[45%] top-[15%] h-3 w-3 rounded-full bg-orange-400 shadow-[0_0_18px_rgba(251,146,60,0.9)]" />
                <div className="node-float-slow absolute left-[70%] top-[70%] h-3 w-3 rounded-full bg-orange-300 shadow-[0_0_18px_rgba(253,186,116,0.9)]" />

                {/* BLUE (2) */}
                <div className="node-float absolute left-[60%] top-[25%] h-3 w-3 rounded-full bg-blue-400 shadow-[0_0_18px_rgba(96,165,250,0.9)]" />
                <div className="node-float-slow-delayed absolute left-[25%] top-[35%] h-3 w-3 rounded-full bg-blue-300 shadow-[0_0_18px_rgba(147,197,253,0.9)]" />

                {/* TEAL (2) */}
                <div className="node-float-delayed absolute left-[65%] top-[50%] h-3 w-3 rounded-full bg-teal-400 shadow-[0_0_18px_rgba(45,212,191,0.9)]" />
                <div className="node-float-slow absolute left-[40%] top-[65%] h-3 w-3 rounded-full bg-teal-300 shadow-[0_0_18px_rgba(94,234,212,0.9)]" />

                {/* PINK (1) */}
                <div className="node-float-extra absolute left-[50%] top-[10%] h-3 w-3 rounded-full bg-pink-400 shadow-[0_0_18px_rgba(244,114,182,0.9)]" />

                {/* REMAINING (6 - MIX COLORS) */}
                <div className="node-float absolute left-[15%] top-[40%] h-2.5 w-2.5 rounded-full bg-indigo-300 shadow-[0_0_16px_rgba(165,180,252,0.9)]" />
                <div className="node-float-slow absolute left-[85%] top-[55%] h-2.5 w-2.5 rounded-full bg-purple-300 shadow-[0_0_16px_rgba(196,181,253,0.9)]" />
                <div className="node-float-delayed absolute left-[35%] top-[20%] h-2.5 w-2.5 rounded-full bg-sky-300 shadow-[0_0_16px_rgba(125,211,252,0.9)]" />
                <div className="node-float-slow-delayed absolute left-[75%] top-[40%] h-2.5 w-2.5 rounded-full bg-lime-300 shadow-[0_0_16px_rgba(190,242,100,0.9)]" />
                <div className="node-float-extra absolute left-[20%] top-[80%] h-2.5 w-2.5 rounded-full bg-amber-300 shadow-[0_0_16px_rgba(252,211,77,0.9)]" />
                <div className="node-float absolute left-[55%] top-[80%] h-2.5 w-2.5 rounded-full bg-fuchsia-300 shadow-[0_0_16px_rgba(240,171,252,0.9)]" />
            </div>
        </Paper>
    )
}

export default ServiceComponent