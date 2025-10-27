"use client"

import { useState } from "react"

function ConnectionForm({ onConnect, serverUrl, setServerUrl, connectionError }) {
  const [customUrl, setCustomUrl] = useState("")

  const handleConnect = () => {
    const url = customUrl || serverUrl
    onConnect(url)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-effect rounded-2xl p-8">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Connexion au Serveur</h2>
          <p className="text-gray-600">Entrez l'adresse du serveur Python pour commencer à jouer</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Adresse du serveur WebSocket</label>
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder={serverUrl}
              className="input-field"
            />
            <p className="text-xs text-gray-500 mt-2">Format: ws://[IP_SERVEUR]:8000/ws</p>
          </div>

          {connectionError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-semibold text-red-800">Erreur de connexion</p>
                <p className="text-sm text-red-600">{connectionError}</p>
              </div>
            </div>
          )}

          <button onClick={handleConnect} className="btn-primary w-full">
            Se connecter au serveur
          </button>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <p className="text-sm font-semibold text-blue-800 mb-2">Instructions:</p>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Démarrez le serveur Python sur PC 1</li>
              <li>Notez l'adresse IP du serveur</li>
              <li>Entrez l'adresse complète (ex: ws://192.168.1.10:8000/ws)</li>
              <li>Cliquez sur "Se connecter"</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConnectionForm
