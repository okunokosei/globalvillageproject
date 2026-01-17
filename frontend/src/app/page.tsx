"use client";
import { useEffect, useState } from 'react';

const Home = () => {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/health/`)
    .then((res) => res.json())
    .then((data) => setMessage(data.message))
    .catch((err) => setMessage("Error: failed to fetch data"));
  }, []);

  return (
    <div className="p-[50px] font-sans">
      <h1 className="text-3xl font-bold">Global Village Project</h1>
      <h2 className="text-3xl font-bold">Data Fetch Test</h2>
      <p className="text-[20px] text-blue-600">
        Backend Response: <strong className="font-bold">{message}</strong>
      </p>
    </div>
  );
};