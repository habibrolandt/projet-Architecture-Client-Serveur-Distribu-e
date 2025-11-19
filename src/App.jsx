"use client"

import { useState } from "react"
import ConnectionForm from "./components/ConnectionForm.jsx"
import GameInterface from "./components/GameInterface.jsx"
import GameHistory from "./components/GameHistory.jsx"

function App() {
  const [connected, setConnected] = useState(false)
  const [serverUrl, setServerUrl] = useState("ws://localhost:8000/ws")
  const [ws, setWs] = useState(null)
  const [gameState, setGameState] = useState({
    welcomeMessage: "",
    attempts: [],
    gameOver: false,
    secretNumber: null,
    totalAttempts: 0,
    timeRemaining: 30,
  })
  const [connectionError, setConnectionError] = useState("")

  const connectToServer = (url) => {
    try {
      setConnectionError("")
      const websocket = new WebSocket(url)

      websocket.onopen = () => {
        console.log("[CLIENT] Connecté au serveur")
        setConnected(true)
        setWs(websocket)
      }

      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        console.log("[CLIENT] Message reçu:", data)

        if (data.type === "welcome") {
          setGameState((prev) => ({
            ...prev,
            welcomeMessage: data.message,
            attempts: [],
            gameOver: false,
            timeRemaining: 30,
          }))
        } else if (data.type === "response") {
          setGameState((prev) => ({
            ...prev,
            attempts: [
              ...prev.attempts,
              {
                guess: data.guess,
                response: data.response,
                attemptNumber: data.attempt_number,
              },
            ],
            gameOver: data.game_over,
          }))
        } else if (data.type === "game_over") {
          setGameState((prev) => ({
            ...prev,
            secretNumber: data.secret_number,
            totalAttempts: data.total_attempts,
          }))
        } else if (data.type === "new_game") {
          setGameState({
            welcomeMessage: data.message,
            attempts: [],
            gameOver: false,
            secretNumber: null,
            totalAttempts: 0,
            timeRemaining: 30,
          })
        } else if (data.type === "timer_update") {
          setGameState((prev) => ({
            ...prev,
            timeRemaining: data.time_remaining,
          }))
        } else if (data.type === "timeout") {
          setGameState((prev) => ({
            ...prev,
            gameOver: true,
            secretNumber: data.secret_number,
            totalAttempts: prev.attempts.length,
          }))
        } else if (data.type === "error") {
          alert(data.message)
        }
      }

      websocket.onerror = (error) => {
        console.error("[CLIENT] Erreur WebSocket:", error)
        setConnectionError("Erreur de connexion au serveur")
      }

      websocket.onclose = () => {
        console.log("[CLIENT] Déconnecté du serveur")
        setConnected(false)
        setWs(null)
        setConnectionError("Connexion fermée")
      }
    } catch (error) {
      console.error("[CLIENT] Erreur:", error)
      setConnectionError("Impossible de se connecter au serveur")
    }
  }

  const sendGuess = (guess) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: "guess",
          guess: guess,
        }),
      )
    }
  }

  const startNewGame = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: "new_game",
        }),
      )
    }
  }

  const disconnect = () => {
    if (ws) {
      ws.close()
    }
    setConnected(false)
    setWs(null)
    setGameState({
      welcomeMessage: "",
      attempts: [],
      gameOver: false,
      secretNumber: null,
      totalAttempts: 0,
      timeRemaining: 30,
    })
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
            Jeu de Devinette
          </h1>
          <p className="text-gray-600 text-lg">Architecture Client-Serveur Distribuée</p>
        </div>

        {!connected ? (
          <ConnectionForm
            onConnect={connectToServer}
            serverUrl={serverUrl}
            setServerUrl={setServerUrl}
            connectionError={connectionError}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GameInterface
                gameState={gameState}
                onSendGuess={sendGuess}
                onNewGame={startNewGame}
                onDisconnect={disconnect}
              />
            </div>
            <div>
              <GameHistory attempts={gameState.attempts} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App