import type { InputMode } from "./types"

interface Input2Props {
    mode2: string
    sen2: string
    file2: File[]
    setSen2: (v: string) => void
    setFile2: React.Dispatch<React.SetStateAction<File[]>>
    setMode2: (v: InputMode) => void
}

function Input2 ({
    mode2, sen2, file2,
    setSen2, setFile2, setMode2
    } : Input2Props) {
    return (
        <div className="flex-1 flex flex-col">
            <div className="h-7 flex items-center justify-between mb-3">
                <label
                    htmlFor="sen2"
                    className="block text-lg font-semibold text-gray-800"
                >
                    VĂN BẢN 2
                </label>

                {/* Dropdown */}
                <select
                    value={mode2}
                    onChange={(e) => {setMode2(e.target.value as InputMode);
                        console.log(e.target.value)
                    }}
                    className="w-36 p-2 border border-gray-300 rounded-lg bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-sm"
                    >
                    <option value="text">Text</option>
                    <option value="file">File</option>
                    <option value="db">Database</option>
                </select>
            </div>
            {
                mode2 === 'text' ?
                <textarea
                    id="sen2"
                    value={sen2}
                    onChange={(e) => setSen2(e.target.value)}
                    placeholder={sen2 ? sen2 : "Nhập đoạn văn bản thứ hai..."}
                    rows={10}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none shadow-sm transition duration-200 hover:shadow-md flex-1"
                    required
                /> : (
                    mode2 === 'file' ?
                    <div className='flex flex-col gap-3'>
                        <input
                            type="file"
                            id="file2"
                            accept=".pdf,.txt"
                            multiple
                            onChange={(e) => {
                                const files = e.target.files
                                if (files) setFile2((prev) => [...prev, ...Array.from(files)])
                            }}
                            className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-sm"
                        />
                        {/*Hiển thị các file đã chọn*/}
                        {file2 && file2.length > 0 && (
                            <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                                <p className="font-medium text-gray-700 mb-3">
                                Đã chọn {file2.length} file:
                                </p>
                                
                                <ul className="space-y-2">
                                {file2.map((file, index) => (
                                    <li 
                                    key={index} 
                                    className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-gray-100 group hover:border-gray-300 transition-colors"
                                    >
                                    <div className="flex-1 min-w-0">
                                        <span className="text-sm text-gray-700 truncate block">
                                        {file.name}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                        ({(file.size / 1024).toFixed(1)} KB)
                                        </span>
                                    </div>

                                    {/* Nút xóa từng file */}
                                    <button
                                        onClick={() => {
                                        setFile2(prev => prev.filter((_, i) => i !== index));
                                        }}
                                        className="ml-3 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                                        title="Xóa file này"
                                    >
                                        ✕
                                    </button>
                                    </li>
                                ))}
                                </ul>

                                {/* Nút xóa tất cả*/}
                                <button
                                    onClick={() => setFile2([])}
                                    className="mt-4 text-red-600 text-sm hover:underline flex items-center gap-1"
                                >
                                Xóa tất cả file
                                </button>
                            </div>
                        )}
                    </div> : <></>
                )
            }					
        </div>
)
}

export default Input2