"use client"

export default function EnvDebug() {
  return (
    <div className="p-4 bg-gray-100 rounded-md">
      <h2 className="text-lg font-bold mb-2">Environment Variables</h2>
      <pre className="bg-white p-2 rounded">NEXT_PUBLIC_API_URL: {process.env.NEXT_PUBLIC_API_URL || "not set"}</pre>
    </div>
  )
}

