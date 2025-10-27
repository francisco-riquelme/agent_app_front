"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';

type Message = { id: number; from: 'user' | 'bot'; text: string };

export default function HomePage() {
  const [email, setEmail] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, from: 'bot', text: 'Hola, ¿en qué puedo ayudarte hoy?' },
  ]);
  const [input, setInput] = useState('');
  const router = useRouter();
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const e = localStorage.getItem('email');
    if (!token) {
      router.push('/login');
      return;
    }
    setEmail(e);
  }, [router]);

  useEffect(() => {
    // scroll bottom on new messages
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    router.push('/login');
  }

  function sendMessage() {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), from: 'user', text: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput('');

    // respuesta simulada (puedes llamar al endpoint /intent aquí)
    setTimeout(() => {
      const botMsg: Message = { id: Date.now() + 1, from: 'bot', text: `Recibí: ${userMsg.text}` };
      setMessages((m) => [...m, botMsg]);
    }, 600);
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 border-r p-4">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-black">Agente</h2>
          {email && <p className="text-sm text-gray-700">{email}</p>}
        </div>
        <nav className="flex flex-col gap-2">
          <Link href="/home" className="block px-4 py-3 rounded-lg text-black font-medium hover:bg-gray-200">Chat</Link>
          <Link href="/agents" className="block px-4 py-3 rounded-lg text-black font-medium hover:bg-gray-200">Agentes</Link>
          <Link href="/my-agents" className="block px-4 py-3 rounded-lg text-black font-medium hover:bg-gray-200">Mis Agentes</Link>
          <Link href="/profile" className="block px-4 py-3 rounded-lg text-black font-medium hover:bg-gray-200">Mis Datos</Link>
          <button onClick={handleLogout} className="mt-4 text-left px-4 py-3 rounded-lg bg-red-50 text-red-700 font-semibold hover:bg-red-100">Cerrar sesión</button>
        </nav>
      </aside>

      {/* Main chat area */}
      <main className="flex-1 flex flex-col">
        <header className="p-4 border-b">
          <h1 className="text-2xl font-bold text-black">Chat</h1>
        </header>

        <div ref={listRef} className="flex-1 p-6 overflow-y-auto bg-white">
          <div className="max-w-2xl mx-auto flex flex-col gap-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`${m.from === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-black'} rounded-lg px-4 py-2 max-w-[80%]`}>{m.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t">
          <div className="max-w-2xl mx-auto flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
              placeholder="Escribe un mensaje..."
              className="flex-1 border rounded px-3 py-2 text-black"
            />
            <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-2 rounded">Enviar</button>
          </div>
        </div>
      </main>
    </div>
  );
}
