/**
 * Returns the best season info based on current month
 */
export function getCurrentSeason() {
  const month = new Date().getMonth() + 1 // 1-12
  if (month >= 10 || month <= 2) {
    return {
      name: 'Winter',
      quality: 'Peak Season',
      description: 'Perfect weather with cool breezes. Ideal for sightseeing and outdoor activities.',
      icon: '❄️',
    }
  } else if (month >= 3 && month <= 5) {
    return {
      name: 'Summer',
      quality: 'Good Season',
      description: 'Warm days perfect for hill stations. Great time for Munnar and Wayanad.',
      icon: '☀️',
    }
  } else {
    return {
      name: 'Monsoon',
      quality: 'Monsoon Season',
      description: 'Experience Kerala\'s lush green beauty. Ayurvedic retreats are highly recommended.',
      icon: '🌧️',
    }
  }
}

export function isGoodTimeToVisit(bestSeason) {
  const month = new Date().getMonth() + 1
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const parts = bestSeason.split(' - ')
  if (parts.length !== 2) return true
  const startIdx = monthNames.indexOf(parts[0]) + 1
  const endIdx = monthNames.indexOf(parts[1]) + 1
  if (startIdx <= endIdx) {
    return month >= startIdx && month <= endIdx
  }
  return month >= startIdx || month <= endIdx
}
