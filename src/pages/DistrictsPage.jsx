import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getDistricts } from '../api'

gsap.registerPlugin(ScrollTrigger)

export default function DistrictsPage() {
  const [districts, setDistricts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeDistrict, setActiveDistrict] = useState(null)
  const [filterCategory, setFilterCategory] = useState('all')

  useEffect(() => {
    getDistricts()
      .then((data) => {
        setDistricts(data)
        if (data.length > 0) setActiveDistrict(data[0].districtId)
      })
      .catch((err) => console.error('Failed to fetch districts:', err))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.districts-header', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      })
    })
    return () => ctx.revert()
  }, [])

  const selected = districts.find((d) => d.districtId === activeDistrict)
  const activityCategories = selected
    ? ['all', ...new Set(selected.activities.map((a) => a.category))]
    : ['all']
  const filteredActivities = selected
    ? selected.activities.filter((a) => filterCategory === 'all' || a.category === filterCategory)
    : []

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="districts-header text-center mb-12">
          <p className="text-kerala-teal text-sm font-medium tracking-[0.2em] uppercase mb-4">
            All 14 Districts
          </p>
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-kerala-white mb-4">
            Kerala <span className="bg-gradient-to-r from-kerala-gold to-kerala-gold-light bg-clip-text text-transparent">Districts</span>
          </h1>
          <p className="text-kerala-white/50 text-lg max-w-xl mx-auto">
            Explore every district and discover unique activities across God's Own Country
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-10 h-10 border-2 border-kerala-teal/30 border-t-kerala-teal rounded-full animate-spin mb-4" />
            <p className="text-kerala-white/50">Loading districts...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* District List */}
            <div className="lg:col-span-1 space-y-2 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
              {districts.map((district, i) => (
                <button
                  key={district.districtId}
                  id={`district-${district.districtId}`}
                  onClick={() => {
                    setActiveDistrict(district.districtId)
                    setFilterCategory('all')
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-300 ${
                    activeDistrict === district.districtId
                      ? 'glass border-kerala-teal/40 shadow-lg shadow-kerala-green/10'
                      : 'glass-light hover:border-white/15'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
                    activeDistrict === district.districtId
                      ? 'bg-gradient-to-br from-kerala-green to-kerala-teal text-white'
                      : 'bg-white/5 text-kerala-white/40'
                  }`}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm transition-colors ${
                      activeDistrict === district.districtId ? 'text-kerala-white' : 'text-kerala-white/70'
                    }`}>{district.name}</p>
                    <p className="text-kerala-white/30 text-xs truncate">{district.nickname}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                    activeDistrict === district.districtId
                      ? 'bg-kerala-teal/20 text-kerala-teal'
                      : 'bg-white/5 text-kerala-white/30'
                  }`}>
                    {district.activities.length}
                  </span>
                </button>
              ))}
            </div>

            {/* District Details */}
            <div className="lg:col-span-2">
              {selected ? (
                <div className="space-y-8">
                  {/* District Hero Card */}
                  <div className="relative glass-light rounded-3xl overflow-hidden">
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={selected.image}
                        alt={selected.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-kerala-charcoal via-kerala-charcoal/50 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-3 py-1 rounded-full bg-kerala-teal/20 border border-kerala-teal/30 text-kerala-teal text-xs font-medium">
                            {selected.nickname}
                          </span>
                        </div>
                        <h2 className="font-heading text-3xl md:text-4xl font-bold text-kerala-white">
                          {selected.name}
                        </h2>
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="text-kerala-white/60 text-sm leading-relaxed mb-6">
                        {selected.description}
                      </p>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {[
                          { label: 'Area', value: selected.area, icon: '📐' },
                          { label: 'Population', value: selected.population, icon: '👥' },
                          { label: 'Activities', value: `${selected.activities.length}+`, icon: '🎯' },
                          { label: 'Famous For', value: `${selected.famousFor.length} spots`, icon: '⭐' },
                        ].map((stat) => (
                          <div key={stat.label} className="glass rounded-xl p-3 text-center">
                            <span className="text-lg">{stat.icon}</span>
                            <p className="text-kerala-white font-semibold text-sm mt-1">{stat.value}</p>
                            <p className="text-kerala-white/30 text-xs">{stat.label}</p>
                          </div>
                        ))}
                      </div>

                      {/* Famous For */}
                      <div className="flex flex-wrap gap-2">
                        {selected.famousFor.map((item) => (
                          <span key={item} className="px-3 py-1.5 rounded-xl bg-kerala-gold/10 border border-kerala-gold/20 text-kerala-gold text-xs font-medium">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Activities Section */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-heading text-2xl font-semibold text-kerala-white">
                        Things to Do
                      </h3>
                      <span className="text-kerala-white/30 text-sm">{filteredActivities.length} activities</span>
                    </div>

                    {/* Activity Category Filters */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {activityCategories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setFilterCategory(cat)}
                          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
                            filterCategory === cat
                              ? 'bg-kerala-teal/20 text-kerala-teal border border-kerala-teal/30'
                              : 'text-kerala-white/40 border border-white/5 hover:border-white/15 hover:text-kerala-white/60'
                          }`}
                        >
                          {cat === 'all' ? 'All' : cat}
                        </button>
                      ))}
                    </div>

                    {/* Activity Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {filteredActivities.map((activity, i) => (
                        <div
                          key={activity.name}
                          className="activity-card group glass-light rounded-2xl p-5 hover:border-kerala-teal/30 transition-all duration-300 hover:shadow-lg hover:shadow-kerala-teal/5"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-kerala-green/20 to-kerala-teal/20 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                              {activity.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-kerala-white font-semibold text-sm">{activity.name}</h4>
                              </div>
                              <p className="text-kerala-white/40 text-xs leading-relaxed mb-2">
                                {activity.description}
                              </p>
                              <span className="inline-block px-2 py-0.5 rounded-md bg-white/5 text-kerala-white/30 text-[10px] font-medium uppercase tracking-wider">
                                {activity.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glass-light rounded-2xl p-12 text-center">
                  <p className="text-4xl mb-4">🗺️</p>
                  <p className="text-kerala-white/50">Select a district to see details and activities</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
