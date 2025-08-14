/* eslint-disable @typescript-eslint/no-explicit-any */
import { Capacitor } from '@capacitor/core'
import { CapacitorHttp } from '@capacitor/core'

const BASE_URL = Capacitor.isNativePlatform()
  ? 'https://puce.estudioika.com/api/examen.php'
  : '/ika/examen.php'

type Json = Record<string, any> | Array<any>

async function httpGet(url: string, params?: Record<string, string>) {
  if (Capacitor.isNativePlatform()) {
    const { data, status } = await CapacitorHttp.get({ url, params })
    if (status < 200 || status >= 300) throw new Error(`HTTP ${status}`)
    return data as Json
  }
  const q = params
    ? `${url}${url.includes('?') ? '&' : '?'}${new URLSearchParams(params)}`
    : url
  const res = await fetch(q, { method: 'GET', headers: { Accept: 'application/json' }, cache: 'no-store' })
  const text = await res.text()
  if (!res.ok) throw new Error(`HTTP ${res.status} ${text.slice(0, 120)}`)
  try { return JSON.parse(text) } catch { throw new Error(`Respuesta no-JSON: ${text.slice(0, 200)}`) }
}

async function httpPost(url: string, body: Json) {
  if (Capacitor.isNativePlatform()) {
    const { data, status } = await CapacitorHttp.post({ url, data: body, headers: { 'Content-Type': 'application/json' } })
    if (status < 200 || status >= 300) throw new Error(data?.error ?? `HTTP ${status}`)
    return data as Json
  }
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body) })
  const text = await res.text()
  if (!res.ok) throw new Error(`HTTP ${res.status} ${text.slice(0, 120)}`)
  try { return JSON.parse(text) } catch { throw new Error(`Respuesta no-JSON: ${text.slice(0, 200)}`) }
}

export type SysUser = { record: number; id: number; lastnames: string; names: string; mail: string; phone: string; user: string; }

export async function login(user: string, pass: string) {
  const data = await httpGet(BASE_URL, { user, pass })
  return Array.isArray(data) && data.length ? (data[0] as SysUser) : null
}

export async function registerAttendance(record_user: number, join_user: string) {
  return httpPost(Capacitor.isNativePlatform() ? 'https://puce.estudioika.com/api/examen.php' : '/ika/examen.php', { record_user, join_user })
}

export type AttendanceItem = {
  record: number;
  date: string;
  time: string;
  join_date: string;
};

export async function listAttendance(record_user: number): Promise<AttendanceItem[]> {
  const data = await httpGet(BASE_URL, { record: String(record_user) });
  const arr = Array.isArray(data) ? (data as any[]) : [];
  return arr
    .map(d => ({
      record: Number(d.record),
      date: String(d.date),
      time: String(d.time),
      join_date: String(d.join_date),
    }))
    .sort((a, b) => (a.join_date < b.join_date ? 1 : -1));
}
