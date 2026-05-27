import type { InputMode } from "./types";

interface SystemConfigProps {
    model: string
    threshold: number
    setModel: (v: InputMode) => void
    setThreshold: (v: number) => void
}
function SystemConfig({
    model, threshold,
    setModel, setThreshold
    } : SystemConfigProps) {
    return (
        <div className="mt-4 pb-4">
            <label className="block text-lg font-semibold text-gray-800 mb-2 text-center">
                Cấu hình hệ thống
            </label>
            
            <div className="flex gap-4 items-center justify-center">
                {/* Dropdown model */}
                <div>
                <select
                    id="model"
                    value={model}
                    onChange={(e) => setModel(e.target.value as InputMode)}
                    className="w-48 p-3 border border-gray-300 rounded-xl bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-sm transition duration-200 hover:shadow-md"
                >
                    <option value="bge">BGE</option>
                    <option value="gemini">Gemini</option>
                </select>
                </div>

                {/* Input Threshold */}
                <div className="w-32">
                <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={threshold}
                    onChange={(e) => {
                    let val: number = parseFloat(e.target.value);
                        if (val > 1) val = 1;
                        if (val < 0) val = 0;

                        setThreshold(isNaN(val) ? 0 : val);
                    }}
                    placeholder="Ngưỡng tương đồng"
                    className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-sm transition duration-200 hover:shadow-md"
                />
                </div>
            </div>
        </div>
    )
}

export default SystemConfig