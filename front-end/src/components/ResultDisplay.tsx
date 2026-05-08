import { useMemo } from 'react'
import type { ApiChunk, ApiResponse } from './types'
import React from 'react'

interface ResultDisplayProps {
    results: ApiResponse
    currentChunk: number
    hoveredSen1: number | null
    hoveredSen2: number | null
    setCurrentChunk: (ind: number) => void
    setHoveredSen1: (ind: number | null) => void
    setHoveredSen2: (ind: number | null) => void
}

const MATCH_COLORS = [
    'decoration-red-400', 'decoration-blue-400', 'decoration-green-400', 
    'decoration-yellow-400', 'decoration-purple-400', 'decoration-pink-400',
    'decoration-orange-400', 'decoration-teal-400', 'decoration-indigo-400',
    'decoration-cyan-400', 'decoration-emerald-400', 'decoration-lime-400',
    'decoration-amber-400', 'decoration-rose-400', 'decoration-zinc-400',
    'decoration-fuchsia-400', 'decoration-violet-400', 'decoration-sky-400',
    'decoration-slate-400', 'decoration-gray-400',
]

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
                    if (!rev[sen2Ind]) rev[sen2Ind] = []
                    rev[sen2Ind].push(sen1Ind)
                })
            })
            return rev
        }, [result])

        const { colorMap1, colorMap2 } = useMemo(() => {
            const colorMap1: Record<number, string> = {}
            const colorMap2: Record<number, string> = {}
            let colorCounter = 0;

            // Duyệt qua tất cả các key trong matches (index của sen1)
            Object.keys(result.matches).forEach((key) => {
                const sen1Idx = parseInt(key);
                const matchedSen2Indices = result.matches[sen1Idx];

                if (matchedSen2Indices && matchedSen2Indices.length > 0 && !colorMap1[sen1Idx]) {
                    const colorClass = MATCH_COLORS[colorCounter % MATCH_COLORS.length]
                    colorCounter++

                    colorMap1[sen1Idx] = colorClass
                    matchedSen2Indices.forEach((sen2Idx) => {
                        colorMap2[sen2Idx] = colorClass
                        reverseMatches[sen2Idx].forEach((sen1Idx) =>{
                            if (!colorMap1[sen1Idx]) colorMap1[sen1Idx] = colorClass
                        })
                    })
                }
            });

            return { colorMap1, colorMap2 };
        }, [result.matches])

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
                
                <h2 className="text-center text-xl font-medium text-gray-500 mb-8">
                Kết quả - Chunk ID: {result.chunk_id}
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start"> 
                    {/* ==================== ĐOẠN VĂN BẢN 1 ==================== */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 h-[600px] flex flex-col">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-3 shrink-0">
                        📝 Đoạn văn bản 1
                        </h3>

                        {/* Khu vực chứa Text: Căn trái trên và có Scroll */}
                        <div className="flex-1 overflow-y-auto pr-2 text-left text-[15.5px] leading-relaxed text-gray-800 align-top">
                        <div className="w-full">
                            {result.sen1_sentences.map((sentence: string, idx: number) => {
                            const underlineColor = colorMap1[idx]
                            const isHighlighted =
                                hoveredSen1 === idx ||
                                (hoveredSen2 !== null && (reverseMatches[hoveredSen2] || []).includes(idx));
                            const hasNewline = sentence.includes('\n');

                            return (
                                <React.Fragment key={idx}>
                                {hasNewline && <br />}
                                <span
                                    onClick={() => setCurrentChunk(getNextChunk(currentChunk, idx))}
                                    onMouseEnter={() => {
                                    setHoveredSen1(idx);
                                    setHoveredSen2(null);
                                    }}
                                    onMouseLeave={() => setHoveredSen1(null)}
                                    className={`px-1 py-0.5 rounded transition-all duration-100 cursor-pointer inline-block 
                                    ${isHighlighted ? 'bg-blue-200 font-medium ring-2 ring-blue-400' : ''}
                                    ${underlineColor ? `underline decoration-2 underline-offset-4 ${underlineColor}` : ''}`}
                                >
                                    {sentence.trim()}
                                </span>
                                </React.Fragment>
                            );
                            })}
                        </div>
                        </div>
                    </div>

                    {/* ==================== ĐOẠN VĂN BẢN 2 ==================== */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 h-[600px] flex flex-col">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-3 shrink-0">
                        📝 Đoạn văn bản 2
                        </h3>

                        {/* Khu vực chứa Text: Căn trái trên và có Scroll */}
                        <div className="flex-1 overflow-y-auto pr-2 text-left text-[15.5px] leading-relaxed text-gray-800 whitespace-pre-line align-top">
                        <div className="w-full">
                            {result.sen2_sentences.map((sentence: string, idx: number) => {
                            const underlineColor = colorMap2[idx]                       
                            const isHighlighted =
                                hoveredSen2 === idx ||
                                (hoveredSen1 !== null && (result.matches[hoveredSen1] || []).includes(idx));
                            const hasNewline = sentence.includes('\n');

                            return (
                                <React.Fragment key={idx}>
                                {hasNewline && <br />}
                                <span
                                    onMouseEnter={() => {
                                    setHoveredSen2(idx);
                                    setHoveredSen1(null);
                                    }}
                                    onMouseLeave={() => setHoveredSen2(null)}
                                    className={`px-1 py-0.5 rounded transition-all duration-100 cursor-pointer inline-block 
                                    ${isHighlighted ? 'bg-blue-200 font-medium ring-2 ring-blue-400' : ''}
                                    ${underlineColor ? `underline decoration-2 underline-offset-4 ${underlineColor}` : ''}`}
                                >
                                    {sentence.trim()}
                                </span>
                                </React.Fragment>
                            );
                            })}
                        </div>
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