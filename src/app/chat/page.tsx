'use client';
import { useState } from 'react';

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState<{role:'user'|'assistant', text:string}[]>([]);

  async function send() {
    const text = input.trim();
    if (!text) return;
    setMsgs(m => [...m, {role:'user', text}]);
    setInput('');

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/intent', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      setMsgs(m => [...m, {role:'assistant', text: data.reply ?? JSON.stringify(data)}]);
    } catch (e:any) {
      setMsgs(m => [...m, {role:'assistant', text: 'No pude conectar con el backend.'}]);
    }
  }

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Agente Orquestador (MVP)</h1>
      <div className="border rounded-xl p-4 space-y-3 mb-4 bg-white/5">
        {msgs.map((m,i)=>(
          <div key={i} className={m.role==='user'?'text-right':''}>
            <span className={`inline-block rounded-xl px-3 py-2 ${m.role==='user'?'bg-blue-600 text-white':'bg-gray-200 text-gray-900'}`}>
              {m.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded-xl px-3 py-2"
          placeholder="ej: Crea reunión de apoderados el 10/11 a las 18:00..."
          value={input}
          onChange={e=>setInput(e.target.value)}
          onKeyDown={e=> e.key==='Enter' && send()}
        />
        <button onClick={send} className="px-4 py-2 rounded-xl bg-black text-white">Enviar</button>
      </div>
    </main>
  );
}
