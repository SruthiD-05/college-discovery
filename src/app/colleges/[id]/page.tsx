'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
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
  reviews: { id: string; rating: number; comment: string }[]
}

export default function CollegeDetail() {
  const params = useParams()
  const id = params.id as string
  const [college, setCollege] = useState<College | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [tab, setTab] = useState('overview')

  useEffect(() => {
    if (!id) return
    fetch(`/api/colleges/${id}`)
      .then(r => {
        if (!r.ok) throw new Error('Failed')
        return r.json()
      })
      .then(data => { setCollege(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-gray-400 animate-pulse text-xl">Loading...</div>
    </div>
  )

  if (error || !college) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-red-400 text-xl">College not found</div>
    </div>
  )

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-400">🎓 CollegeFinder</Link>
        <Link href="/" className="text-sm text-gray-400 hover:text-white transition">← Back to Search</Link>
      </div>

      <div className="bg-gradient-to-b from-gray-900 to-gray-950 px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-start">
            <div>
              <span className={`text-xs px-2 py-1 rounded-full mb-3 inline-block ${college.type === 'Public' ? 'bg-green-900 text-green-300' : 'bg-purple-900 text-purple-300'}`}>
                {college.type}
              </span>
              <h1 className="text-4xl font-bold mb-2">{college.name}</h1>
              <p className="text-gray-400">📍 {college.location}, {college.state}</p>
            </div>
            <button className="border border-gray-700 hover:border-red-500 hover:text-red-400 px-4 py-2 rounded-lg transition">
              ♡ Save
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-8">
            <div className="bg-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">⭐ {college.rating}</div>
              <div className="text-gray-400 text-sm mt-1">Rating</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">₹{(college.fees / 100000).toFixed(1)}L</div>
              <div className="text-gray-400 text-sm mt-1">Fees/year</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{college.placement?.placementPct.toFixed(0)}%</div>
              <div className="text-gray-400 text-sm mt-1">Placement</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">₹{college.placement?.avgPackage.toFixed(1)}L</div>
              <div className="text-gray-400 text-sm mt-1">Avg Package</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <div className="flex gap-1 border-b border-gray-800 mb-6">
          {['overview', 'courses', 'placements', 'reviews'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm capitalize transition ${tab === t ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="space-y-4 pb-10">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="font-semibold text-lg mb-3">About {college.name}</h3>
              <p className="text-gray-400 leading-relaxed">
                {college.name} is a {college.type.toLowerCase()} institution located in {college.location}, {college.state}.
                It offers world-class education with a strong focus on research and industry connections.
                With a rating of {college.rating}/5 and {college.placement?.placementPct.toFixed(0)}% placement rate,
                it is one of the top choices for students across India.
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="font-semibold text-lg mb-3">Quick Facts</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex justify-between text-sm"><span className="text-gray-400">Location</span><span>{college.location}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-400">State</span><span>{college.state}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-400">Type</span><span>{college.type}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-400">Annual Fees</span><span>₹{college.fees.toLocaleString()}</span></div>
              </div>
            </div>
          </div>
        )}

        {tab === 'courses' && (
          <div className="space-y-3 pb-10">
            {college.courses.map(course => (
              <div key={course.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{course.name}</h4>
                  <p className="text-gray-400 text-sm">{course.duration} years</p>
                </div>
                <div className="text-blue-400 font-semibold">₹{course.fees.toLocaleString()}/yr</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'placements' && (
          <div className="space-y-4 pb-10">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-green-400">{college.placement?.placementPct.toFixed(1)}%</div>
                <div className="text-gray-400 text-sm mt-2">Placement Rate</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-blue-400">₹{college.placement?.avgPackage.toFixed(2)}L</div>
                <div className="text-gray-400 text-sm mt-2">Average Package</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-purple-400">₹{college.placement?.highestPkg.toFixed(2)}L</div>
                <div className="text-gray-400 text-sm mt-2">Highest Package</div>
              </div>
            </div>
          </div>
        )}

        {tab === 'reviews' && (
          <div className="space-y-3 pb-10">
            {college.reviews.map(review => (
              <div key={review.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-400">⭐ {review.rating}</span>
                </div>
                <p className="text-gray-300">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}