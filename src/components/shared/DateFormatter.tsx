"use client"

import { useState, useEffect } from "react"

function formatKoreanDate(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

function relativeTime(date: Date): string {
  const now = Date.now()
  const diff = now - date.getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  const months = Math.floor(diff / 2592000000)

  if (mins < 1) return "방금 전"
  if (mins < 60) return `${mins}분 전`
  if (hours < 24) return `${hours}시간 전`
  if (days < 30) return `${days}일 전`
  return `${months}개월 전`
}

export default function DateFormatter({ date }: { date: string | Date }) {
  const [label, setLabel] = useState("")

  useEffect(() => {
    const d = typeof date === "string" ? new Date(date) : date
    setLabel(relativeTime(d))
  }, [date])

  return <span>{label}</span>
}
