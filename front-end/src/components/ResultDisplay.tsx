import { useMemo } from 'react'
import type { ApiChunk, ApiResponse } from './types'

interface ResultDisplayProps {
    results: ApiResponse
    currentChunk: number
    hoveredSen1: number | null
    hoveredSen2: number | null
    setCurrentChunk: (ind: number) => void
    setHoveredSen1: (ind: number | null) => void
    setHoveredSen2: (ind: number | null) => void
}

function ResultDisplay({
    results, currentChunk, hoveredSen1, hoveredSen2,
    setCurrentChunk, setHoveredSen1, setHoveredSen2
    } : ResultDisplayProps) {
        const result: ApiChunk = results[currentChunk]
        const len: number = results.length
        
        const reverseMatches: Record<number, number[]> = useMemo(() =>{
            const matches = result?.matches || {}
            const rev : Record<number, number[]> = {}
            Object.keys(matches).forEach((key) => {
                const sen1Ind: number = parseInt(key);
                (matches[sen1Ind] as number[]).forEach((sen2Ind) =>{
                    if (!rev[sen2Ind]) rev[sen2Ind] = [];
                    rev[sen2Ind].push(sen1Ind)
                })
            })
            return rev
        }, [result])

        const getNextChunk = ((currentChunk: number, senIdx: number) : number => {
            let nextChunk = currentChunk + 1
            for (nextChunk; nextChunk < len; nextChunk++) {
                const matches = results[nextChunk].matches
                if (senIdx in matches) return nextChunk
            }

            for (nextChunk = 0; nextChunk < currentChunk; nextChunk++) {
                const matches = results[nextChunk].matches
                if (senIdx in matches) return nextChunk
            }

            return currentChunk
        })

        return (
            <div className="mt-12 w-full max-w-6xl">
                <h2 className="text-3xl font-bold text-center text-primary mb-10">
                    Kết quả Phân tích Tương đồng
                </h2>
                <h2>Kết quả - Chunk ID: {result.chunk_id}</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* ==================== ĐOẠN VĂN BẢN 1 (SEN1) ==================== */}
                    <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                        📝 Đoạn văn bản 1
                        </h3>

                        <div className="text-left text-[15.5px] leading-relaxed text-gray-800">
                            {result.sen1_sentences.map((sentence: string, idx: number) => {
                                const isHighlighted =
                                    hoveredSen1 === idx ||
                                    (hoveredSen2 !== null && (reverseMatches[hoveredSen2] || []).includes(idx));

                                return (
                                    <span
                                        key={idx}
                                        onClick={() => setCurrentChunk(getNextChunk(currentChunk, idx))}
                                        onMouseEnter={() => {
                                            setHoveredSen1(idx);
                                            setHoveredSen2(null);
                                        }}
                                        onMouseLeave={() => setHoveredSen1(null)}
                                        className={`px-1 py-0.5 rounded transition-all duration-100 cursor-pointer ${
                                        isHighlighted
                                            ? 'bg-blue-200 font-medium ring-2 ring-blue-400'
                                            : ''
                                        }`}
                                    >
                                        {sentence}
                                    </span>
                                );
                            })}
                        </div>
                    </div>

                    {/* ==================== ĐOẠN VĂN BẢN 2 (SEN2) ==================== */}
                    <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                            📝 Đoạn văn bản 2
                        </h3>

                        <div className="text-left text-[15.5px] leading-relaxed text-gray-800">
                        {result.sen2_sentences.map((sentence: string, idx: number) => {
                            const isHighlighted =
                            hoveredSen2 === idx ||
                            (hoveredSen1 !== null && (result.matches[hoveredSen1] || []).includes(idx));

                            return (
                                <span
                                    key={idx}
                                    onMouseEnter={() => {
                                        setHoveredSen2(idx);
                                        setHoveredSen1(null);
                                    }}
                                    onMouseLeave={() => setHoveredSen2(null)}
                                    className={`px-1 py-0.5 rounded transition-all duration-100 cursor-pointer ${
                                    isHighlighted
                                        ? 'bg-blue-200 font-medium ring-2 ring-blue-400'
                                        : ''
                                    }`}
                                >
                                    {sentence}
                                </span>
                            );
                        })}
                        </div>
                    </div>
                </div>

                {/* Thông báo nếu không có tương đồng */}
                {Object.keys(result.matches || {}).length === 0 && (
                <div className="mt-8 text-center text-amber-600 bg-amber-50 border border-amber-200 p-6 rounded-2xl text-lg">
                    Không tìm thấy câu nào tương đồng giữa hai đoạn văn bản.
                </div>
                )}
            </div>
        )
}

export default ResultDisplay