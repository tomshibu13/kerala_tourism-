import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getDestinations, saveTrip } from '../api'
import { destinations as staticDestinations, categories } from '../data/destinations'
import { getCurrentSeason } from '../utils/seasonHelper'

export default function TripPlannerPage() {
  const [destinations, setDestinations] = useState(staticDestinations)
  const [selectedDestinations, setSelectedDestinations] = useState([])
  const [tripDays, setTripDays] = useState(5)
  const [startDate, setStartDate] = useState('')
  const [activeStep, setActiveStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [savedTripId, setSavedTripId] = useState(null)

  const season = getCurrentSeason()

  useEffect(() => {
    getDestinations()
      .then((data) => {
        const mapped = data.map((d) => ({ ...d, id: d.destinationId || d.id || d._id }))
        if (mapped.length > 0) setDestinations(mapped)
      })
      .catch(() => {})
  }, [])

  const toggleDestination = (id) => {
    setSelectedDestinations((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    )
  }

  const selectedDetails = destinations.filter((d) => selectedDestinations.includes(d.id))

  const handleSaveTrip = async () => {
    setSaving(true)
    try {
      const result = await saveTrip({
        destinations: selectedDestinations,
        tripDays,
        startDate,
      })
      setSavedTripId(result._id)
    } catch (err) {
      console.error('Failed to save trip:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-kerala-teal text-sm font-medium tracking-[0.2em] uppercase mb-4">
            Plan Your Journey
          </p>
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-kerala-white mb-4">
            Trip <span className="bg-gradient-to-r from-kerala-gold to-kerala-gold-light bg-clip-text text-transparent">Planner</span>
          </h1>
          <p className="text-kerala-white/50 text-lg max-w-xl mx-auto">
            Build your perfect Kerala itinerary in a few simple steps
          </p>
        </div>

        {/* Season Banner */}
        <div className="glass-light rounded-2xl p-5 mb-10 flex flex-wrap items-center gap-4">
          <span className="text-2xl">{season.icon}</span>
          <div className="flex-1">
            <p className="text-kerala-white font-medium text-sm">{season.name} — {season.quality}</p>
            <p className="text-kerala-white/40 text-xs">{season.description}</p>
          </div>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-12 overflow-x-auto pb-2">
          {['Select Destinations', 'Set Dates', 'Your Itinerary'].map((step, i) => (
            <button
              key={step}
              onClick={() => setActiveStep(i + 1)}
              className={`flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                activeStep === i + 1
                  ? 'bg-kerala-teal/15 text-kerala-teal border border-kerala-teal/30'
                  : activeStep > i + 1
                    ? 'text-kerala-teal-light/60 border border-kerala-teal/10 bg-kerala-teal/5'
                    : 'text-kerala-white/30 border border-white/5'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                activeStep > i + 1
                  ? 'bg-kerala-teal text-white'
                  : activeStep === i + 1
                    ? 'bg-kerala-teal/20 text-kerala-teal'
                    : 'bg-white/5 text-kerala-white/30'
              }`}>
                {activeStep > i + 1 ? '✓' : i + 1}
              </span>
              {step}
            </button>
          ))}
        </div>

        {/* Step 1: Select Destinations */}
        {activeStep === 1 && (
          <div>
            <h2 className="font-heading text-2xl text-kerala-white mb-6">Choose your destinations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {destinations.map((dest) => {
                const isSelected = selectedDestinations.includes(dest.id)
                return (
                  <button
                    key={dest.id}
                    id={`select-${dest.id}`}
                    onClick={() => toggleDestination(dest.id)}
                    className={`flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-300 ${
                      isSelected
                        ? 'glass border-kerala-teal/40 shadow-lg shadow-kerala-green/10'
                        : 'glass-light hover:border-white/15'
                    }`}
                  >
                    <div className="relative">
                      <img src={dest.image} alt={dest.name} className="w-16 h-16 rounded-xl object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 rounded-xl bg-kerala-teal/30 flex items-center justify-center">
                          <span className="text-white text-lg font-bold">✓</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-kerala-white font-medium text-sm">{dest.name}</p>
                      <p className="text-kerala-white/40 text-xs">{dest.subtitle}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-kerala-gold text-xs">★ {dest.rating}</span>
                        <span className="text-kerala-white/20">•</span>
                        <span className="text-kerala-white/30 text-xs">{dest.category}</span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
            {selectedDestinations.length > 0 && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setActiveStep(2)}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-kerala-green to-kerala-teal text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-kerala-green/30 hover:scale-105"
                >
                  Continue with {selectedDestinations.length} destination{selectedDestinations.length > 1 ? 's' : ''} →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Set Dates */}
        {activeStep === 2 && (
          <div className="max-w-lg mx-auto">
            <h2 className="font-heading text-2xl text-kerala-white mb-6 text-center">Set your travel details</h2>
            <div className="glass-light rounded-2xl p-8 space-y-6">
              <div>
                <label className="block text-kerala-white/60 text-sm mb-2">Start Date</label>
                <input
                  id="trip-start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-kerala-white text-sm focus:outline-none focus:border-kerala-teal/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-kerala-white/60 text-sm mb-2">Number of Days: <span className="text-kerala-teal font-bold">{tripDays}</span></label>
                <input
                  id="trip-days-slider"
                  type="range"
                  min="2"
                  max="14"
                  value={tripDays}
                  onChange={(e) => setTripDays(parseInt(e.target.value))}
                  className="w-full accent-kerala-teal"
                />
                <div className="flex justify-between text-kerala-white/30 text-xs mt-1">
                  <span>2 days</span>
                  <span>14 days</span>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveStep(1)}
                  className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-kerala-white/60 font-medium transition-all hover:border-kerala-teal/30 hover:text-kerala-white"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setActiveStep(3)}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-kerala-green to-kerala-teal text-white font-semibold transition-all hover:shadow-lg hover:shadow-kerala-green/30"
                >
                  Generate Plan →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Itinerary */}
        {activeStep === 3 && (
          <div>
            <h2 className="font-heading text-2xl text-kerala-white mb-2 text-center">Your Itinerary</h2>
            <p className="text-kerala-white/40 text-sm text-center mb-10">
              {tripDays} days • {selectedDetails.length} destination{selectedDetails.length > 1 ? 's' : ''}
              {startDate && ` • Starting ${new Date(startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`}
            </p>

            <div className="relative max-w-3xl mx-auto">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-kerala-teal via-kerala-green to-kerala-gold" />

              {selectedDetails.map((dest, i) => {
                const daysPerDest = Math.max(1, Math.floor(tripDays / selectedDetails.length))
                const dayStart = i * daysPerDest + 1
                const dayEnd = i === selectedDetails.length - 1 ? tripDays : dayStart + daysPerDest - 1

                return (
                  <div key={dest.id} className="relative flex gap-6 mb-8 pl-4">
                    {/* Timeline dot */}
                    <div className="relative z-10 mt-6">
                      <div className="w-5 h-5 rounded-full bg-kerala-charcoal border-2 border-kerala-teal flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-kerala-teal" />
                      </div>
                    </div>

                    {/* Card */}
                    <div className="flex-1 glass-light rounded-2xl overflow-hidden hover:border-kerala-teal/20 transition-all duration-300">
                      <div className="flex flex-col md:flex-row">
                        <img src={dest.image} alt={dest.name} className="w-full md:w-40 h-32 md:h-auto object-cover" />
                        <div className="p-5 flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded-full bg-kerala-teal/10 text-kerala-teal text-xs font-medium">
                              Day {dayStart}{dayEnd > dayStart ? `–${dayEnd}` : ''}
                            </span>
                            <span className="text-kerala-white/30 text-xs">{dest.category}</span>
                          </div>
                          <h3 className="font-heading text-lg font-semibold text-kerala-white mb-1">{dest.name}</h3>
                          <p className="text-kerala-white/40 text-sm mb-3">{dest.subtitle}</p>
                          <div className="flex flex-wrap gap-2">
                            {dest.highlights.slice(0, 3).map((h) => (
                              <span key={h} className="px-2 py-1 rounded-lg bg-white/5 text-kerala-white/40 text-xs">{h}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="text-center mt-10 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setActiveStep(1)}
                className="px-6 py-3 rounded-xl border border-white/10 text-kerala-white/60 font-medium transition-all hover:border-kerala-teal/30 hover:text-kerala-white"
              >
                ← Modify Plan
              </button>
              <button
                onClick={handleSaveTrip}
                disabled={saving}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-kerala-green to-kerala-teal text-white font-semibold transition-all hover:shadow-lg hover:shadow-kerala-green/30 disabled:opacity-50"
              >
                {saving ? 'Saving...' : savedTripId ? '✓ Saved!' : 'Save Itinerary'}
              </button>
            </div>
            {savedTripId && (
              <p className="text-center text-kerala-teal/60 text-sm mt-4">
                Trip saved successfully! ID: {savedTripId}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
