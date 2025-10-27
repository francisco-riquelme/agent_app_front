'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch (e) {
        // ignore
      }

      if (res.ok) {
        localStorage.setItem('token', data?.token ?? '');
        if (data?.email) localStorage.setItem('email', data.email);
        router.push('/home');
        setMessage('✅ Registro exitoso. Usuario creado.');
        return;
      }

      if (res.status === 400) {
        setMessage(`❌ ${data?.detail ?? 'Datos inválidos.'}`);
      } else if (data?.detail) {
        setMessage(`❌ ${data.detail}`);
      } else {
        setMessage('❌ Error en el servidor. Intenta más tarde.');
      }
    } catch (err) {
      setMessage('⚠️ Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
  <h1 className="text-2xl font-semibold mb-4 text-center text-black">Registro de usuario</h1>

        <form onSubmit={handleRegister} className="flex flex-col gap-3">
          <div>
            <label className="block text-sm font-medium text-black">Correo electrónico</label>
            <input
              className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!errors.email}
            />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Contraseña</label>
            <input
              className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              type="password"
              placeholder="Contraseña (mínimo 6 caracteres)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!errors.password}
            />
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 w-full py-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        {message && <p className="mt-4 text-center text-sm text-green-600">{message}</p>}
      </div>
    </main>
  );
}
