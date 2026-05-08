import React, { useState } from 'react'
import axios from 'axios'
import Header from './components/Header'
import InputForm from './components/InputForm'
import type { ApiChunk, ApiResponse, InputMode } from './components/types'
import ResultDisplay from './components/ResultDisplay'

const TextSimilarityForm: React.FC = () => {
	const [sen1, setSen1] = useState<string>('')
	const [sen2, setSen2] = useState<string>('')
	const [threshold, setThreshold] = useState<number>(0.7)
	const [model, setModel] = useState<string>('bge') // default gemini
	const [loading, setLoading] = useState<boolean>(false)
	const [result, setResult] = useState<ApiResponse>([])
	const [error, setError] = useState<string | null>(null)
	const [currentChunk, setCurrentChunk] = useState(0)	// Pagination index
	const [mode1, setMode1] = useState<InputMode>('text')
	const [mode2, setMode2] = useState<InputMode>('text')
	const [file1, setFile1] = useState<File[]>([])
	const [file2, setFile2] = useState<File[]>([])
	const [hoveredSen1, setHoveredSen1] = useState<number | null>(null)
	const [hoveredSen2, setHoveredSen2] = useState<number | null>(null)

	const runStream = async (response: Response) => {
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

			buffer += decoder.decode(value, { stream : true })

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

	const handleSubmit = async (e: any) => {
		e.preventDefault()
		if ((mode1 === 'text' && !sen1.trim()) || 
			(mode1 === 'file' && file1.length === 0) || 
			(mode2 === 'text' && !sen2.trim()) || 
			(mode2 === 'file' && file2.length === 0)) {
			setError('Vui lòng nhập đầy đủ đầu vào!')
			return
		}

		setLoading(true)
		setError(null)
		setResult([])
		setCurrentChunk(0)

		try {
			if (mode1 === 'text' && mode2 === 'text') {
				const response = await axios.post(
					import.meta.env.VITE_BACKEND_URL + '/sentences', 
					{ sen1, sen2, model, threshold }, 
					{ timeout: 60000 }
				)
				setResult([response.data])
			}
			else if (mode1 === 'file' && mode2 === 'text') {
				const formData = new FormData()
				formData.append('file', file1[0])
				formData.append('sen', sen2)
				formData.append('model', model)
				formData.append('threshold', threshold.toString())

				const response = await fetch(
					import.meta.env.VITE_BACKEND_URL + '/files/file_sen', 
					{ method: 'POST', body: formData }
				)
				
				await runStream(response)
			}
			else if (mode1 === 'text' && mode2 === 'file') {
				const formData = new FormData()
				formData.append('sen', sen1)
				file2.forEach(file => {
					formData.append('files', file)
				})
				formData.append('model', model)
				formData.append('threshold', threshold.toString())

				const response = await fetch(
					import.meta.env.VITE_BACKEND_URL + '/files/sen_files', 
					{ method: 'POST', body: formData }
				)

				await runStream(response)
			}
			else if (mode1 === 'file' && mode2 === 'file') {
				const formData = new FormData()

				formData.append('file1', file1[0])
				file2.forEach(file => {
					formData.append('file2', file)
				})
				formData.append('model', model)
				formData.append('threshold', threshold.toString())

				const response = await fetch(
					import.meta.env.VITE_BACKEND_URL + '/files/file_files', 
					{ method: 'POST', body: formData }
				)

				await runStream(response)
			}
			else if (mode1 === 'file' && mode2 === 'db') {
				const formData = new FormData()

				formData.append('file', file1[0])
				formData.append('model', model)
				formData.append('threshold', threshold.toString())

				const response = await fetch(
					import.meta.env.VITE_BACKEND_URL + '/db/files', 
					{ method: 'POST', body: formData }
				)

				await runStream(response)
			}
			else if (mode1 === 'text' && mode2 === 'db') {
				const formData = new FormData()

				formData.append('sen', sen1)
				formData.append('model', model)
				formData.append('threshold', threshold.toString())

				const response = await fetch(
					import.meta.env.VITE_BACKEND_URL + '/db/sen', 
					{ method: 'POST', body: formData }
				)

				await runStream(response)
			}
			
		} catch (err: any) {
			console.log(err.response?.data)
			setError(err.response?.data?.detail || 'Có lỗi xảy ra khi gọi API. Kiểm tra backend!')
			console.error(err)
			setLoading(false)
		} finally {
			if (mode2 === 'text') setLoading(false)
		}
	}

	return (
	<div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-6">
		<Header />

		<InputForm 
			sen1={sen1}
			sen2={sen2}
			file2={file2}
			model={model}
			threshold={threshold}
			mode1={mode1}
			mode2={mode2}
			loading={loading}
			setSen1={setSen1}
			setSen2={setSen2}
			setModel={setModel}
			setThreshold={setThreshold}
			setMode1={setMode1}
			setMode2={setMode2}
			setFile1={setFile1}
			setFile2={setFile2}
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