export default function SkeletonLoader({ className = '' }) {
  return (
    <div className={`w-full h-full flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center gap-4">
        {/* Animated Kerala logo */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-kerala-green to-kerala-teal opacity-20 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-kerala-teal border-t-transparent rounded-full loader-spin" />
          </div>
        </div>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-kerala-teal/40 animate-bounce" style={{animationDelay: '0ms'}} />
          <div className="w-2 h-2 rounded-full bg-kerala-teal/40 animate-bounce" style={{animationDelay: '150ms'}} />
          <div className="w-2 h-2 rounded-full bg-kerala-teal/40 animate-bounce" style={{animationDelay: '300ms'}} />
        </div>
      </div>
    </div>
  )
}
