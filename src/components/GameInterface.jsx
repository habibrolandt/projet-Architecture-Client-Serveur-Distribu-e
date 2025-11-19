"use client"

import { useState, useEffect } from "react"

function GameInterface({ gameState, onSendGuess, onNewGame, onDisconnect }) {
  const [guess, setGuess] = useState("")
  const [lastResponse, setLastResponse] = useState(null)

  useEffect(() => {
    if (gameState.attempts.length > 0) {
      const last = gameState.attempts[gameState.attempts.length - 1]
      setLastResponse(last.response)
    }
  }, [gameState.attempts])

  const handleSubmit = (e) => {
    e.preventDefault()
    const number = Number.parseInt(guess)

    if (isNaN(number) || number < 0 || number > 100) {
      alert("Veuillez entrer un nombre entre 0 et 100")
      return
    }

    onSendGuess(number)
    setGuess("")
  }

  const getResponseColor = (response) => {
    if (response === "Bravo") return "text-green-600"
    if (response === "Grand") return "text-orange-600"
    if (response === "Petit") return "text-blue-600"
    return "text-gray-600"
  }

  const getResponseIcon = (response) => {
    if (response === "Bravo") return "🎉"
    if (response === "Grand") return "⬇"
    if (response === "Petit") return "⬆"
    return "❓"
  }

  const getTimerColor = () => {
    if (gameState.timeRemaining > 20) return "text-green-600"
    if (gameState.timeRemaining > 10) return "text-orange-600"
    return "text-red-600"
  }

  const getTimerBgColor = () => {
    if (gameState.timeRemaining > 20) return "from-green-50 to-green-100"
    if (gameState.timeRemaining > 10) return "from-orange-50 to-orange-100"
    return "from-red-50 to-red-100"
  }

  return (
    <div className="glass-effect rounded-2xl p-8">
      {/* Barre de statut */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-gray-700">Connecté au serveur</span>
        </div>
        <button
          onClick={onDisconnect}
          className="text-sm text-red-600 hover:text-red-700 font-semibold"
        >
          Déconnecter
        </button>
      </div>

      {/* Timer */}
      {!gameState.gameOver && (
        <div className="mb-6">
          <div
            className={`bg-gradient-to-r ${getTimerBgColor()} rounded-xl p-6 border-2 ${
              gameState.timeRemaining <= 10
                ? "border-red-300 animate-pulse"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-700">Temps restant</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl">⏱</span>
                {/* ✅ Correction de la syntaxe JSX ici */}
                <span className={`text-4xl font-bold ${getTimerColor()}`}>
                  {gameState.timeRemaining}s
                </span>
              </div>
            </div>
            <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  gameState.timeRemaining > 20
                    ? "bg-green-500"
                    : gameState.timeRemaining > 10
                    ? "bg-orange-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${(gameState.timeRemaining / 30) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Message d’accueil */}
      {gameState.welcomeMessage && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6 border border-blue-100">
          <p className="text-center text-lg font-semibold text-gray-800">
            {gameState.welcomeMessage}
          </p>
        </div>
      )}

      {/* Dernière réponse */}
      {lastResponse && !gameState.gameOver && (
        <div className="mb-6 text-center">
          <div
            className={`inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-white shadow-lg border-2 ${
              lastResponse === "Bravo"
                ? "border-green-300"
                : lastResponse === "Grand"
                ? "border-orange-300"
                : "border-blue-300"
            }`}
          >
            <span className="text-4xl">{getResponseIcon(lastResponse)}</span>
            {/* ✅ Correction syntaxe JSX ici aussi */}
            <span className={`text-3xl font-bold ${getResponseColor(lastResponse)}`}>
              {lastResponse}
            </span>
          </div>
        </div>
      )}

      {/* Fin de partie */}
      {gameState.gameOver && (
        <div className="mb-6 text-center">
          <div
            className={`rounded-xl p-8 border-2 ${
              gameState.totalAttempts > 0
                ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300"
                : "bg-gradient-to-r from-red-50 to-orange-50 border-red-300"
            }`}
          >
            <div className="text-6xl mb-4 animate-bounce-slow">
              {gameState.totalAttempts > 0 ? "🎉" : "⏰"}
            </div>
            <h3
              className={`text-3xl font-bold mb-2 ${
                gameState.totalAttempts > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {gameState.totalAttempts > 0 ? "Bravo!" : "Temps écoulé!"}
            </h3>
            <p className="text-lg text-gray-700 mb-1">
              Le nombre était{" "}
              <span className="font-bold text-2xl text-purple-600">
                {gameState.secretNumber}
              </span>
            </p>
            {gameState.totalAttempts > 0 && (
              <p className="text-gray-600">
                Trouvé en{" "}
                <span className="font-semibold">{gameState.totalAttempts}</span>{" "}
                tentative{gameState.totalAttempts > 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Formulaire */}
      {!gameState.gameOver ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Votre proposition (0–100)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              className="input-field"
              placeholder="Entrez un nombre..."
              autoFocus
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Envoyer ma proposition
          </button>
        </form>
      ) : (
        <button onClick={onNewGame} className="btn-primary w-full">
          Nouvelle partie
        </button>
      )}

      {/* Statistiques */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
          <p className="text-sm text-blue-600 font-semibold mb-1">Tentatives</p>
          <p className="text-3xl font-bold text-blue-700">
            {gameState.attempts.length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center">
          <p className="text-sm text-purple-600 font-semibold mb-1">Statut</p>
          <p className="text-lg font-bold text-purple-700">
            {gameState.gameOver ? "Terminé" : "En cours"}
          </p>
        </div>
      </div>
    </div>
  )
}

export default GameInterface
