const BASE_URL = '/api/examen.php';

export type SysUser = {
  record: number;
  id: number;
  lastnames: string;
  names: string;
  mail: string;
  phone: string;
  user: string;
};

export type LoginResponse = SysUser[];

export async function login(user: string, pass: string): Promise<SysUser | null> {
  const url = `${BASE_URL}?user=${encodeURIComponent(user)}&pass=${encodeURIComponent(pass)}`;
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) throw new Error(`Login failed: ${res.status}`);
  const data: LoginResponse = await res.json();
  return data.length ? data[0] : null;
}

// Registrar asistencia
export async function registerAttendance(record_user: number, join_user: string): Promise<{ message?: string; error?: string }> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ record_user, join_user })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error ?? 'Error al registrar asistencia');
  return data;
}

// Listar asistencia por usuario)
export type AttendanceItem = {
  record_user: number;
  date: string;
  time: string;
  join_user: string;
};

export async function listAttendance(record_user: number): Promise<AttendanceItem[]> {
  const url = `${BASE_URL}?record=${encodeURIComponent(String(record_user))}`;
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) throw new Error(`Error listando asistencia: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data as AttendanceItem[] : [];
}
