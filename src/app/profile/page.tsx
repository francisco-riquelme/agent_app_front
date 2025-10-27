"use client";

export default function ProfilePage() {
  const email = typeof window !== 'undefined' ? localStorage.getItem('email') : null;

  return (
    <main className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-black mb-4">Mis Datos</h1>
        <p className="text-black">Email: {email ?? 'No disponible'}</p>
        <p className="text-black mt-2">Aquí podrás editar tus datos. (Placeholder)</p>
      </div>
    </main>
  );
}
