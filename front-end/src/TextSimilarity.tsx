import React, { useState } from 'react'
import axios from 'axios'
import Header from './components/Header'
import InputForm from './components/InputForm'
import type { ApiChunk, ApiResponse, InputMode } from './components/types'
import ResultDisplay from './components/ResultDisplay'

const TextSimilarityForm: React.FC = () => {
	const [sen1, setSen1] = useState<string>('')
	const [sen2, setSen2] = useState<string>('')
	const [model, setModel] = useState<string>('gemini') // default gemini
	const [loading, setLoading] = useState<boolean>(false)
	const [result, setResult] = useState<ApiResponse>([])
	const [error, setError] = useState<string | null>(null)
	const [currentChunk, setCurrentChunk] = useState(0)	// Pagination index
	const [mode, setMode] = useState<InputMode>('text')
	const [file, setFile] = useState<File>()
	const [hoveredSen1, setHoveredSen1] = useState<number | null>(null)
	const [hoveredSen2, setHoveredSen2] = useState<number | null>(null)

	const handleSubmit = async (e: any) => {
		e.preventDefault()
		if (!sen1.trim() || (mode === 'text' && !sen2.trim()) || (mode === 'file' && !file)) {
			setError('Vui lòng nhập cả hai đoạn văn bản!')
			return
		}

		setLoading(true)
		setError(null)
		setResult([])
		setCurrentChunk(0)

		try {
			if (mode === 'text') {
				const response = await axios.post(
					import.meta.env.VITE_BACKEND_URL + '/sentences', 
					{ sen1, sen2, model }, 
					{ timeout: 60000 }
				)
				setResult([response.data])
			}
			else if (mode === 'file') {
				const formData = new FormData()
				formData.append('sen1', sen1)
				formData.append('file', file!)
				formData.append('model', model)

				const response = await fetch(
					import.meta.env.VITE_BACKEND_URL + '/files', 
					{ method: 'POST', body: formData }
				)

				if (!response.ok) {
					const errText = await response.text()
					throw new Error(errText || 'Upload file thất bại')
				}

				if (!response.body) throw new Error('Backend không trả về stream')

				const reader = response.body.getReader()
				const decoder = new TextDecoder()
				let buffer = ''

				while (true) {
					const { done, value } = await reader.read()
					if (done) break

					buffer += decoder.decode(value, { stream: true })

					// Tách từng dòng JSON (backend yield từng chunk một dòng)
					const lines = buffer.split('\n')
					buffer = lines.pop() || ''   // giữ phần chưa hoàn chỉnh

					for (const line of lines) {
						const trimmed = line.trim()
						if (trimmed) {
							try {
								const chunk: ApiChunk = JSON.parse(trimmed)
								setResult(prev => [...prev, chunk])
							} catch (parseErr) {
								console.warn('Không parse được chunk:', trimmed)
							}
						}
					}
				}
				setLoading(false)
			}
			
		} catch (err: any) {
			console.log(err.response?.data)
			setError(err.response?.data?.detail || 'Có lỗi xảy ra khi gọi API. Kiểm tra backend!')
			console.error(err)
		} finally {
			if (mode === 'text') setLoading(false)
		}
	}

	return (
	<div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-6">
		<Header />

		<InputForm 
			sen1={sen1}
			sen2={sen2}
			model={model}
			mode={mode}
			loading={loading}
			setSen1={setSen1}
			setSen2={setSen2}
			setModel={setModel}
			setMode={setMode}
			setFile={setFile}
			handleSubmit={handleSubmit}
		/>

		{/* HIển thị kết quả */}
		{error && (
		<div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl max-w-5xl w-full">
			{error}
		</div>
		)}

		{result.length > 0 ? (
			<div className="mt-12 w-full max-w-6xl">
				<ResultDisplay
					results={result}
					currentChunk={currentChunk}
					hoveredSen1={hoveredSen1}
					hoveredSen2={hoveredSen2}
					setCurrentChunk={setCurrentChunk}
					setHoveredSen1={setHoveredSen1}
					setHoveredSen2={setHoveredSen2}
				/>

				{/* Pagination khi có nhiều hơn 1 chunk */}
				{result.length > 1 && (
					<div className="flex justify-center items-center gap-4 mt-8">
						<button
							onClick={() => setCurrentChunk((prev) => Math.max(0, prev - 1))}
							disabled={currentChunk === 0}
							className="px-6 py-3 bg-primary text-white rounded-full disabled:opacity-50"
						>
							← Trước
						</button>
						<span className="text-lg font-bold text-primary px-4 py-2 rounded-lg">
							{currentChunk + 1} / {result.length}
						</span>
						<button
							onClick={() => setCurrentChunk((prev) => Math.min(result.length - 1, prev + 1))}
							disabled={currentChunk === result.length - 1}
							className="px-6 py-3 bg-primary text-white rounded-full disabled:opacity-50"
						>
							Sau →
						</button>
					</div>
				)}
			</div>
		) : (
			<></>
		)}
	</div>
	)
}

export default TextSimilarityForm