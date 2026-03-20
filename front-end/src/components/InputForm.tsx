import React from 'react'
import type { InputMode } from './types'

interface InputFormProps {
    sen1: string
    sen2: string
    model: string
    mode: InputMode
    file: File | undefined
    loading: boolean
    setSen1: (v: string) => void
    setSen2: (v: string) => void
    setModel: (v: string) => void
    setMode: (v: InputMode) => void
    setFile: (file: File | undefined) => void
    handleSubmit: (e: React.SubmitEvent) => void
}

function InputForm({
    sen1, sen2, model, mode, file, loading,
    setSen1, setSen2, setModel, setMode, setFile, handleSubmit,
    } : InputFormProps) {
    return (
        <form
		onSubmit={handleSubmit}
		className="w-full max-w-5xl bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200"
		>
			{/* Hai textarea nằm ngang */}
			<div className="flex flex-col md:flex-row gap-6 p-8">
				{/* Sen1 */}
				<div className="flex-1">
					<label htmlFor="sen1" className="block text-lg font-semibold text-gray-800 mb-3">
						Đoạn văn bản 1 (Sen1)
					</label>

					<textarea
						id="sen1"
						value={sen1}
						onChange={(e) => setSen1(e.target.value)}
						placeholder={sen1 ? sen1 : "Nhập đoạn văn bản đầu tiên..."}
						rows={10}
						className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none shadow-sm transition duration-200 hover:shadow-md"
						required
					/>
				</div>

				{/* Sen2 + Dropdown */}
				<div className="flex-1 flex flex-col">
					<div className="h-7 flex items-center justify-between mb-3">
						<label
						htmlFor="sen2"
						className="block text-lg font-semibold text-gray-800"
						>
						Đoạn văn bản 2 (Sen2)
						</label>

						{/* Dropdown */}
						<select
							value={mode}
							onChange={(e) => setMode(e.target.value as InputMode)}
							className="w-36 p-2 border border-gray-300 rounded-lg bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-sm"
							>
							<option value="text">Text</option>
							<option value="file">File</option>
							<option value="db">Database</option>
						</select>
					</div>
					{
						mode === 'text' ?
						<textarea
							id="sen2"
							value={sen2}
							onChange={(e) => setSen2(e.target.value)}
							placeholder={sen2 ? sen2 : "Nhập đoạn văn bản thứ hai..."}
							rows={10}
							className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none shadow-sm transition duration-200 hover:shadow-md flex-1"
							required
						/> : (
							mode === 'file' ?
							<input
								type="file"
								id="sen2-file"
								onChange={(e) => setFile(e.target.files?.[0])}
								className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-sm"
							/> : <></>
						)
					}

					{/* Dropdown model */}
					<div className="mt-4">
						<div className='h-7'>
							<label htmlFor="model" className="block text-lg font-semibold text-gray-800 mb-2">
								Chọn mô hình
							</label>
						</div>
						
						<select
							id="model"
							value={model}
							onChange={(e) => setModel(e.target.value)}
							className="w-30 p-3 border border-gray-300 rounded-xl bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-sm transition duration-200 hover:shadow-md"
							>
							<option value="bge">BGE</option>
							<option value="gemini">Gemini</option>
							<option value="qwen">Qwen</option>
							{/* Thêm model*/}
						</select>
					</div>
				</div>
			</div>

			{/* Button submit */}
			<div className="px-8 pb-8 flex justify-center">
				<button
				type="submit"
				disabled={loading}
				className={`px-10 py-4 bg-primary text-white font-bold text-lg rounded-full shadow-lg hover:bg-primaryDark focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300 transform hover:scale-105 ${
					loading ? 'opacity-70 cursor-not-allowed' : ''
				}`}
				>
				{loading ? (
					<span className="flex items-center">
						<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
							<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Đang xử lý...
					</span>
				) : (
					'Phân tích tương đồng'
				)}
				</button>
			</div>
		</form>
    )
}

export default InputForm