'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface College {
  id: string
  name: string
  location: string
  state: string
  type: string
  fees: number
  rating: number
  placement: {
    avgPackage: number
    placementPct: number
  } | null
}

export default function Home() {
  const [colleges, setColleges] = useState<College[]>([])
  const [search, setSearch] = useState('')
  const [state, setState] = useState('')
  const [type, setType] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchColleges = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    if (state) params.append('state', state)
    if (type) params.append('type', type)
    const res = await fetch(`/api/colleges?${params}`)
    const data = await res.json()
    setColleges(data)
    setLoading(false)
  }

  useEffect(() => { fetchColleges() }, [state, type])

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-400">🎓 CollegeFinder</h1>
        <div className="flex gap-3">
          <Link href="/compare" className="text-sm text-gray-400 hover:text-white px-3 py-1 rounded border border-gray-700 hover:border-gray-500 transition">Compare</Link>
          <Link href="/saved" className="text-sm text-gray-400 hover:text-white px-3 py-1 rounded border border-gray-700 hover:border-gray-500 transition">Saved</Link>
          <Link href="/auth/login" className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded transition">Login</Link>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 px-6 py-12 text-center">
        <h2 className="text-4xl font-bold mb-3">Find Your Perfect College</h2>
        <p className="text-gray-400 mb-6">Search from 15+ top colleges across India</p>
        <div className="flex max-w-xl mx-auto gap-2">
          <input
            type="text"
            placeholder="Search colleges..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchColleges()}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={fetchColleges}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition"
          >
            Search
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 flex gap-3 border-b border-gray-800">
        <select
          value={state}
          onChange={e => setState(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="">All States</option>
          <option value="Maharashtra">Maharashtra</option>
          <option value="Delhi">Delhi</option>
          <option value="Tamil Nadu">Tamil Nadu</option>
          <option value="Karnataka">Karnataka</option>
          <option value="Rajasthan">Rajasthan</option>
          <option value="West Bengal">West Bengal</option>
          <option value="Telangana">Telangana</option>
          <option value="Uttar Pradesh">Uttar Pradesh</option>
        </select>
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="">All Types</option>
          <option value="Public">Public</option>
          <option value="Private">Private</option>
        </select>
        <span className="text-gray-500 text-sm self-center">{colleges.length} colleges found</span>
      </div>

      {/* College Cards */}
      <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-xl p-5 animate-pulse h-48" />
          ))
        ) : colleges.map(college => (
          <div key={college.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-blue-500 transition group">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg group-hover:text-blue-400 transition">{college.name}</h3>
                <p className="text-gray-400 text-sm">{college.location}, {college.state}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${college.type === 'Public' ? 'bg-green-900 text-green-300' : 'bg-purple-900 text-purple-300'}`}>
                {college.type}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
              <div className="bg-gray-800 rounded-lg p-2">
                <div className="text-yellow-400 font-bold">⭐ {college.rating}</div>
                <div className="text-gray-500 text-xs">Rating</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-2">
                <div className="text-blue-400 font-bold">₹{(college.fees / 100000).toFixed(1)}L</div>
                <div className="text-gray-500 text-xs">Fees/yr</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-2">
                <div className="text-green-400 font-bold">{college.placement?.placementPct.toFixed(0)}%</div>
                <div className="text-gray-500 text-xs">Placed</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/colleges/${college.id}`} className="flex-1 text-center text-sm bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition">
                View Details
              </Link>
              <button className="text-sm border border-gray-700 hover:border-red-500 hover:text-red-400 px-3 py-2 rounded-lg transition">
                ♡ Save
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}