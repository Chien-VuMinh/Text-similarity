import React, { useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import InputForm from './components/InputForm';
import type { ApiResponse, InputMode } from './components/types';
import ResultDisplay from './components/ResultDisplay';

const TextSimilarityForm: React.FC = () => {
	const [sen1, setSen1] = useState<string>('');
	const [sen2, setSen2] = useState<string>('');
	const [model, setModel] = useState<string>('gemini'); // default gemini
	const [loading, setLoading] = useState<boolean>(false);
	const [result, setResult] = useState<ApiResponse | string | null>(null)
	const [error, setError] = useState<string | null>(null);
	const [mode, setMode] = useState<InputMode>('text')
	const [file, setFile] = useState<File>()
	const [hoveredSen1, setHoveredSen1] = useState<number | null>(null)
	const [hoveredSen2, setHoveredSen2] = useState<number | null>(null)

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		if (!sen1.trim() || !sen2.trim()) {
			setError('Vui lòng nhập cả hai đoạn văn bản!');
			return;
		}

		setLoading(true);
		setError(null);
		setResult(null);

		try {
			const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/sentences', 
				{sen1, sen2, model}, 
				{timeout: 60000,}
			);

			setResult(response.data)
		} catch (err: any) {
			console.log(err.response?.data)
			setError(err.response?.data?.detail || 'Có lỗi xảy ra khi gọi API. Kiểm tra backend!');
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
	<div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-6">
		{/* Header */}
		<Header />

		{/* InputForm */}
		<InputForm 
			sen1={sen1}
			sen2={sen2}
			model={model}
			mode={mode}
			file={file}
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

		{result && (result as ApiResponse).sen1_sentences && (result as ApiResponse).sen2_sentences && 
			<ResultDisplay
				result={result as ApiResponse}
				hoveredSen1={hoveredSen1}
				hoveredSen2={hoveredSen2}
				setHoveredSen1={setHoveredSen1}
				setHoveredSen2={setHoveredSen2}
			/>
		}
	</div>
	);
};

export default TextSimilarityForm;