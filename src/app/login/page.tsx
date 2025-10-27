"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    // client-side validations
    const newErrors: { email?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) newErrors.email = 'El email es obligatorio.';
    else if (!emailRegex.test(email)) newErrors.email = 'Email inválido.';
    if (!password) newErrors.password = 'La contraseña es obligatoria.';
    else if (password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // intentamos parsear la respuesta JSON (si existe)
      let data: any = null;
      try {
        data = await res.json();
      } catch (e) {
        // no JSON en respuesta
      }

      if (res.ok) {
        localStorage.setItem('token', data?.token ?? '');
        if (data?.email) localStorage.setItem('email', data.email);
        router.push('/home');
        return;
      }

      // manejos de error más amigables según status
      if (res.status === 401) {
        setMsg('❌ Email o contraseña incorrectos.');
      } else if (res.status === 400) {
        setMsg('❌ ' + (data?.detail ?? 'Solicitud inválida.'));
      } else if (data?.detail) {
        setMsg('❌ ' + data.detail);
      } else {
        setMsg('❌ Error en el servidor. Intenta más tarde.');
      }
    } catch (err) {
      // fallo de red o similar
      setMsg('⚠️ Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
  <h1 className="text-2xl font-semibold mb-4 text-center text-black">Iniciar sesión</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <div>
            <label className="block text-sm font-medium text-black">Email</label>
            <input
              className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && <p id="email-error" className="text-sm text-red-600 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Contraseña</label>
            <input
              className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            {errors.password && <p id="password-error" className="text-sm text-red-600 mt-1">{errors.password}</p>}
          </div>

          <button
            className={`mt-2 w-full py-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Entrar'}
          </button>
        </form>

        {msg && <p className="mt-4 text-center text-sm text-red-600">{msg}</p>}
      </div>
    </main>
  );
}
