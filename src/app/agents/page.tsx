"use client";
import { useEffect, useState } from 'react';

type Agent = {
  id: string;
  name: string;
  description?: string;
  selected?: boolean;
};

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [detailAgent, setDetailAgent] = useState<Agent | null>(null);

  useEffect(() => {
    fetchAgents();
  }, []);

  async function fetchAgents() {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agents`);
      const data = await res.json();
      setAgents(data);
    } catch (e) {
      console.error('Error fetching agents', e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSelect(a: Agent) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agents/${a.id}/select`, { method: 'POST' });
      if (res.ok) {
        setAgents((prev) => prev.map(p => p.id === a.id ? { ...p, selected: true } : p));
        setSelectedAgent({ ...a, selected: true });
      }
    } catch (e) {
      console.error('select error', e);
    }
  }

  async function openDetails(a: Agent) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agents/${a.id}`);
      if (!res.ok) return;
      const data = await res.json();
      setDetailAgent(data);
    } catch (e) {
      console.error('detail error', e);
    }
  }

  return (
    <main className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-black mb-6">Agentes</h1>

        {loading && <p>Cargando agentes...</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((a) => (
            <div key={a.id} className="bg-white border rounded-lg shadow p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-black">{a.name}</h3>
                <p className="text-gray-600 mt-2 line-clamp-3">{a.description ?? 'Sin descripción'}</p>
              </div>

              <div className="mt-4 flex gap-2">
                <button onClick={() => handleSelect(a)} className={`px-3 py-1 rounded ${a.selected ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}>
                  {a.selected ? 'Seleccionado' : 'Seleccionar'}
                </button>
                <button onClick={() => openDetails(a)} className="px-3 py-1 rounded border">Ver detalles</button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal detalles */}
        {detailAgent && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
              <h2 className="text-xl font-bold text-black mb-2">{detailAgent.name}</h2>
              <p className="text-black mb-4">{detailAgent.description ?? 'Sin descripción'}</p>
              <pre className="text-sm bg-gray-100 p-2 rounded text-black">{JSON.stringify(detailAgent, null, 2)}</pre>
              <div className="mt-4 flex justify-end">
                <button onClick={() => setDetailAgent(null)} className="px-4 py-2 rounded bg-gray-200">Cerrar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
