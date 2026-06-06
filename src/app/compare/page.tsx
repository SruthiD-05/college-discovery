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
  placement: { avgPackage: number; highestPkg: number; placementPct: number } | null
  courses: { id: string; name: string; duration: number; fees: number }[]
}

export default function ComparePage() {
  const [allColleges, setAllColleges] = useState<College[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [compared, setCompared] = useState<College[]>([])

  useEffect(() => {
    fetch('/api/colleges')
      .then(r => r.json())
      .then(setAllColleges)
  }, [])

  const toggleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(s => s !== id))
    } else if (selected.length < 3) {
      setSelected([...selected, id])
    }
  }

  const handleCompare = async () => {
    const results = await Promise.all(
      selected.map(id => fetch(`/api/colleges/${id}`).then(r => r.json()))
    )
    setCompared(results)
  }

  const rows = [
    { label: 'Location', key: (c: College) => `${c.location}, ${c.state}` },
    { label: 'Type', key: (c: College) => c.type },
    { label: 'Annual Fees', key: (c: College) => `₹${c.fees.toLocaleString()}` },
    { label: 'Rating', key: (c: College) => `⭐ ${c.rating}` },
    { label: 'Placement %', key: (c: College) => `${c.placement?.placementPct.toFixed(1)}%` },
    { label: 'Avg Package', key: (c: College) => `₹${c.placement?.avgPackage.toFixed(2)}L` },
    { label: 'Highest Package', key: (c: College) => `₹${c.placement?.highestPkg.toFixed(2)}L` },
    { label: 'Courses', key: (c: College) => `${c.courses?.length || 0} courses` },
  ]

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-400">🎓 CollegeFinder</Link>
        <Link href="/" className="text-sm text-gray-400 hover:text-white transition">← Back to Search</Link>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-2">Compare Colleges</h1>
        <p className="text-gray-400 mb-6">Select up to 3 colleges to compare side by side</p>

        {/* College Selector */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
          {allColleges.map(college => (
            <button
              key={college.id}
              onClick={() => toggleSelect(college.id)}
              className={`p-3 rounded-xl border text-left transition text-sm ${
                selected.includes(college.id)
                  ? 'border-blue-500 bg-blue-900/30 text-blue-300'
                  : 'border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-500'
              } ${selected.length >= 3 && !selected.includes(college.id) ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <div className="font-medium">{college.name}</div>
              <div className="text-xs text-gray-500 mt-1">{college.location}</div>
              {selected.includes(college.id) && <div className="text-xs text-blue-400 mt-1">✓ Selected</div>}
            </button>
          ))}
        </div>

        <button
          onClick={handleCompare}
          disabled={selected.length < 2}
          className="mb-8 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition"
        >
          Compare {selected.length} College{selected.length !== 1 ? 's' : ''}
        </button>

        {/* Comparison Table */}
        {compared.length >= 2 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-4 bg-gray-900 border border-gray-800 text-gray-400 font-medium w-36">Feature</th>
                  {compared.map(c => (
                    <th key={c.id} className="p-4 bg-gray-900 border border-gray-800 text-center">
                      <div className="font-bold text-white">{c.name}</div>
                      <div className="text-xs text-gray-400 mt-1">{c.location}</div>
                      <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${c.type === 'Public' ? 'bg-green-900 text-green-300' : 'bg-purple-900 text-purple-300'}`}>
                        {c.type}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-gray-900/50' : 'bg-gray-950'}>
                    <td className="p-4 border border-gray-800 text-gray-400 text-sm font-medium">{row.label}</td>
                    {compared.map(c => (
                      <td key={c.id} className="p-4 border border-gray-800 text-center text-sm font-medium">
                        {row.key(c)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}