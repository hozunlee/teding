"use client"

import React, { useState } from "react"

import { RingGauge } from "@/components/home/streak/RingGauge"
import { TreeRenderer } from "@/components/home/streak/TreeIcons"
import { StreakCard } from "@/components/home/StreakCard"
import { getSeason, getSeasonLabel, getDayInSeason } from "@/components/home/streak/utils"

export default function StreakTestPage() {
    const [streak, setStreak] = useState(25)
    const [longestStreak, setLongestStreak] = useState(100)
    const [preset, setPreset] = useState<"all" | "mixed" | "empty">("all")

    // 오늘이 속한 주의 날짜들 (월 ~ 일) 계산
    const now = new Date()
    const kstNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }))
    const offsetKst = new Date(kstNow.getTime() - 3 * 60 * 60 * 1000)
    const dayOfWeek = (offsetKst.getDay() + 6) % 7
    const monday = new Date(offsetKst)
    monday.setDate(offsetKst.getDate() - dayOfWeek)
    
    const weekDates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday)
        d.setDate(monday.getDate() + i)
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, "0")
        const date = String(d.getDate()).padStart(2, "0")
        return `${y}-${m}-${date}`
    })

    // 프리셋에 따른 주간 데이터 생성
    let weeklyProgress: string[] = []
    let weeklyCoins: string[] = []

    if (preset === "all") {
        weeklyProgress = weekDates
    } else if (preset === "mixed") {
        weeklyProgress = [weekDates[0], weekDates[2], weekDates[4], weekDates[6]] // 월, 수, 금, 일 스탬프
        weeklyCoins = [weekDates[1], weekDates[3]] // 화, 목 코인
        // 금은 빈 칸
    }

    const season = getSeason(streak)
    const seasonLabel = getSeasonLabel(streak)
    const dayInSeason = getDayInSeason(streak)

    // 마일스톤 세부 정보 계산
    let nextMilestone = 7
    let prevMilestone = 0
    if (streak >= 30) {
        nextMilestone = 100
        prevMilestone = 30
    } else if (streak >= 22) {
        nextMilestone = 30
        prevMilestone = 22
    } else if (streak >= 15) {
        nextMilestone = 21
        prevMilestone = 15
    } else if (streak >= 8) {
        nextMilestone = 14
        prevMilestone = 8
    } else if (streak >= 1) {
        nextMilestone = 7
        prevMilestone = 1
    }

    const progressPercent = Math.round(
        (Math.min(1, (streak - prevMilestone) / (nextMilestone - prevMilestone || 1))) * 100
    )

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* 헤더 */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400 bg-clip-text text-transparent">
                        🌲 Streak Growth Simulator
                    </h1>
                    <p className="text-slate-400 max-w-lg mx-auto text-sm">
                        스트릭 증가에 따른 나무 성장 비주얼, 링 게이지 채우기, 계절별 그라데이션 및 요일별 스탬프 크기 점진적 변화를 실시간으로 테스트합니다.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* 컨트롤러 보드 */}
                    <div className="md:col-span-1 bg-slate-800/80 backdrop-blur-md border border-slate-700/60 rounded-2xl p-6 space-y-6 shadow-2xl">
                        <h2 className="text-lg font-bold text-slate-200 border-b border-slate-700/60 pb-3 flex items-center gap-2">
                            ⚙️ 컨트롤러
                        </h2>

                        {/* 스트릭 인풋 및 슬라이더 */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-slate-400">스트릭 일수</label>
                                <div className="flex items-center gap-1.5">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={streak}
                                        onChange={(e) => setStreak(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
                                        className="w-16 bg-slate-950 border border-slate-700 rounded-md py-1 px-2 text-center text-sm font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
                                    />
                                    <span className="text-xs text-slate-500">일</span>
                                </div>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={streak}
                                onChange={(e) => setStreak(Number(e.target.value))}
                                className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
                            />
                            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                                <span>0일</span>
                                <span>30일</span>
                                <span>60일</span>
                                <span>100일</span>
                            </div>
                        </div>

                        {/* 최고 기록 설정 */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-slate-400">최고 스트릭</label>
                                <div className="flex items-center gap-1.5">
                                    <input
                                        type="number"
                                        min="0"
                                        max="365"
                                        value={longestStreak}
                                        onChange={(e) => setLongestStreak(Math.max(0, Number(e.target.value) || 0))}
                                        className="w-16 bg-slate-950 border border-slate-700 rounded-md py-1 px-2 text-center text-sm font-bold text-slate-300 focus:outline-none focus:border-slate-500"
                                    />
                                    <span className="text-xs text-slate-500">일</span>
                                </div>
                            </div>
                        </div>

                        {/* 출석 프리셋 */}
                        <div className="space-y-3">
                            <label className="text-xs font-semibold text-slate-400 block">주간 스탬프 프리셋</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(["all", "mixed", "empty"] as const).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPreset(p)}
                                        className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                                            preset === p
                                                ? "bg-emerald-500/20 border-emerald-500/80 text-emerald-400 shadow-md"
                                                : "bg-slate-900/60 border-slate-700/60 text-slate-400 hover:bg-slate-700/40"
                                        }`}
                                    >
                                        {p === "all" ? "전체 출석" : p === "mixed" ? "코인 혼합" : "빈 칸"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 정보 테이블 */}
                        <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 space-y-2.5 text-xs font-mono">
                            <div className="flex justify-between border-b border-slate-800 pb-1.5">
                                <span className="text-slate-500">판정 시즌</span>
                                <span className="text-emerald-400 font-bold">{seasonLabel} ({season})</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-800 pb-1.5">
                                <span className="text-slate-500">시즌 누적일</span>
                                <span className="text-slate-300">{dayInSeason}일차</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-800 pb-1.5">
                                <span className="text-slate-500">현재 마일스톤</span>
                                <span className="text-slate-300">{prevMilestone}일 → {nextMilestone}일</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">링 진행도</span>
                                <span className="text-indigo-400 font-bold">{progressPercent}%</span>
                            </div>
                        </div>
                    </div>

                    {/* 실시간 돋보기 뷰 (비주얼 검증) */}
                    <div className="md:col-span-2 bg-slate-800/80 backdrop-blur-md border border-slate-700/60 rounded-2xl p-6 flex flex-col justify-between shadow-2xl space-y-6">
                        <h2 className="text-lg font-bold text-slate-200 border-b border-slate-700/60 pb-3 flex items-center gap-2">
                            🔎 실시간 비주얼 상세 검증
                        </h2>

                        <div className="flex flex-col sm:flex-row items-center justify-around gap-8 py-4">
                            {/* 크게보기 (나무 돋보기) */}
                            <div className="flex flex-col items-center gap-3">
                                <span className="text-xs font-bold tracking-wider text-indigo-400 uppercase">
                                    돋보기 뷰 (200px)
                                </span>
                                <div className="w-52 h-52 bg-slate-950/80 border border-slate-700/50 rounded-full p-4 shadow-inner flex items-center justify-center relative overflow-hidden">
                                    <div className="w-48 h-48">
                                        <TreeRenderer streak={streak} />
                                    </div>
                                </div>
                                <span className="text-[11px] text-slate-400 text-center font-mono">
                                    마스킹 / 그라데이션 대비 확인
                                </span>
                            </div>

                            {/* 실제 스케일 (링 게이지) */}
                            <div className="flex flex-col items-center gap-3">
                                <span className="text-xs font-bold tracking-wider text-pink-400 uppercase">
                                    실제 스케일 링 게이지
                                </span>
                                <div className="w-44 h-44 bg-slate-950/40 rounded-full border border-slate-800/50 flex items-center justify-center relative">
                                    <RingGauge streak={streak} />
                                </div>
                                <span className="text-[11px] text-slate-400 text-center font-mono">
                                    게이지 채우기 상태 확인
                                </span>
                            </div>
                        </div>

                        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-[11px] text-slate-400 leading-relaxed">
                            <p className="font-semibold text-slate-300 mb-1">💡 디자인 가이드 & 구현 검증 포인트</p>
                            <ul className="list-disc pl-4 space-y-1">
                                <li><strong>배경 대비</strong>: 겨울 시즌의 흰 눈이 뚜렷하게 보이도록 어두운 슬레이트(Slate-900) 계열 대비 서클 백그라운드 그라데이션이 적용되었습니다.</li>
                                <li><strong>나무 성장성</strong>: 봄(꽃봉오리 활성화), 여름(풍성한 녹음), 가을(오렌지 단풍 낙엽), 겨울(가지 위 눈 쌓임)이 스트릭 증가에 따라 단계적으로 변화합니다.</li>
                                <li><strong>30일+ 겨울 누적</strong>: 30일 스트릭을 초과해도 겨울 테마 링 게이지가 100일까지 원활하게 도달하며, 눈 더미 깊이와 눈송이가 실시간으로 누적 성장합니다.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 실제 스트릭 카드 완성형 시뮬레이션 */}
                <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/60 rounded-2xl p-6 shadow-2xl space-y-6">
                    <div className="border-b border-slate-700/60 pb-3 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                            📱 실제 컴포넌트 프리뷰
                        </h2>
                        <span className="text-xs bg-slate-700/80 text-slate-300 px-2.5 py-1 rounded-full font-semibold">
                            모바일/태블릿 반응형
                        </span>
                    </div>

                    {/* 라이트 테마 카드의 시뮬레이션을 위해 백그라운드를 흰색계열로 감쌈 */}
                    <div className="bg-slate-50 text-slate-900 p-8 rounded-xl border border-slate-200 shadow-inner max-w-md mx-auto">
                        <StreakCard
                            currentStreak={streak}
                            longestStreak={longestStreak}
                            lastStudyDate={null}
                            weeklyProgress={weeklyProgress}
                            weeklyCoins={weeklyCoins}
                            isLoggedIn={true}
                        />
                    </div>

                    <div className="text-center">
                        <p className="text-xs text-slate-500">
                            * 이번 주 학습 현황판에서 <strong>월요일(18px)</strong>부터 <strong>일요일(30px)</strong>까지 우측으로 갈수록 스탬프가 2px씩 점진적으로 커지는 성장의 주간 리듬을 관찰하세요.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
