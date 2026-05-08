import type { InputMode } from "./types";

interface Input1Props {
    mode1: string
    sen1: string
    setSen1: (v: string) => void
    setFile1: React.Dispatch<React.SetStateAction<File[]>>
    setMode1: (v: InputMode) => void
}

function Input1({
    mode1, sen1,
    setSen1, setFile1, setMode1
    } : Input1Props) {
    return (
        <div className="flex-1 flex flex-col">
            <div className="h-7 flex items-center justify-between mb-3">
                <label htmlFor="sen1" className="block text-lg font-semibold text-gray-800 mb-3">
                    VĂN BẢN 1
                </label>						

                {/* Dropdown */}
                <select
                    value={mode1}
                    onChange={(e) => {setMode1(e.target.value as InputMode);
                        console.log(e.target.value)
                    }}
                    className="w-36 p-2 border border-gray-300 rounded-lg bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-sm"
                    >
                    <option value="text">Text</option>
                    <option value="file">File</option>
                </select>
            </div>

            {
                mode1 === 'text' ?
                <textarea
                    id="sen1"
                    value={sen1}
                    onChange={(e) => setSen1(e.target.value)}
                    placeholder={sen1 ? sen1 : "Nhập đoạn văn bản đầu tiên..."}
                    rows={10}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none shadow-sm transition duration-200 hover:shadow-md"
                    required
                /> : (
                    mode1 === 'file' ?
                    <input
                        type="file"
                        id="file1"
                        accept=".pdf,.txt"
                        onChange={(e) => {
                            const file = e.target.files
                            if (file) setFile1(Array.from(file))
                        }}
                        className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-sm"
                    /> : <></>
                )
            }
            
        </div>
    )
}

export default Input1