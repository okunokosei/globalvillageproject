// frontend/src/app/page.tsx
"use client"; // これを追加しておくと安全です

export default function Home() {
  return (
    <div style={{ padding: "50px", fontFamily: "sans-serif" }}>
      <h1>Global Village Project</h1>
      <p>Frontend Deploy Test: Success! 🚀</p>
      <p>Backend URL: {process.env.NEXT_PUBLIC_API_URL || "Not set"}</p>
    </div>
  );
}