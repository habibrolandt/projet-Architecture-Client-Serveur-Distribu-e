function GameHistory({ attempts }) {
  const getResponseStyle = (response) => {
    if (response === "Bravo") return "bg-green-100 text-green-700 border-green-300"
    if (response === "Grand") return "bg-orange-100 text-orange-700 border-orange-300"
    if (response === "Petit") return "bg-blue-100 text-blue-700 border-blue-300"
    return "bg-gray-100 text-gray-700 border-gray-300"
  }

  return (
    <div className="glass-effect rounded-2xl p-6 h-full">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        Historique
      </h3>

      {attempts.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="text-gray-500 text-sm">Aucune tentative pour le moment</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {attempts.map((attempt, index) => (
            <div
              key={index}
              className={`border-2 rounded-lg p-4 transition-all duration-300 ${getResponseStyle(attempt.response)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold opacity-70">Tentative #{attempt.attemptNumber}</span>
                <span className="text-2xl font-bold">{attempt.guess}</span>
              </div>
              <div className="text-sm font-semibold">→ {attempt.response}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default GameHistory
