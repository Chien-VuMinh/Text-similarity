import React from 'react'
import type { InputMode } from './types'
import SystemConfig from './SystemConfig'
import Input1 from './Input1'
import Input2 from './Input2'

interface InputFormProps {
    sen1: string
    sen2: string
	file2: File[]
    model: string
	threshold: number
	mode1: InputMode
    mode2: InputMode
    loading: boolean
    setSen1: (v: string) => void
    setSen2: (v: string) => void
    setModel: (v: string) => void
	setThreshold: (v: number) => void
    setMode1: (v: InputMode) => void
	setMode2: (v: InputMode) => void
	setFile1: React.Dispatch<React.SetStateAction<File[]>>
    setFile2: React.Dispatch<React.SetStateAction<File[]>>
    handleSubmit: (e: React.SubmitEvent) => void
	handleUpdateDB?: () => void
}

function InputForm({
    sen1, sen2, file2, model, threshold, mode1, mode2, loading,
    setSen1, setSen2, setModel, setThreshold, setMode1, setMode2, setFile1, setFile2, handleSubmit, handleUpdateDB
    } : InputFormProps) {
    return (
        <form
		onSubmit={handleSubmit}
		className="w-full max-w-5xl bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200"
		>
			{/* Hai textarea nằm ngang */}
			<div className="flex flex-col md:flex-row gap-6 p-8 pb-0">
				{/* Input1 */}
				<Input1 
				    mode1={mode1}
					sen1={sen1}
					setSen1={setSen1}
					setFile1={setFile1}
					setMode1={setMode1}
				/>

				{/* Input2 */}
				<Input2
				    mode2={mode2}
					sen2={sen2}
					file2={file2}
					loading={loading}
					setSen2={setSen2}
					setFile2={setFile2}
					setMode2={setMode2}
					handleUpdateDB={handleUpdateDB}
				/>

			</div>

			<SystemConfig 
				model={model}
				threshold={threshold}
				setModel={setModel}
				setThreshold={setThreshold}
			/>

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