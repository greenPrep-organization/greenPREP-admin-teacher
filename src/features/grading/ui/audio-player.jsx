import { Button } from 'antd'
import PropTypes from 'prop-types'
import { useState, useEffect, useRef, useCallback } from 'react'

const AudioPlayer = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef(null)
  const progressBarRef = useRef(null)
  const containerRef = useRef(null)

  const handleTimeUpdate = useCallback(() => {
    setCurrentTime(audioRef.current.currentTime)
    updateProgress()
  }, [])

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      setDuration(audioRef.current.duration)
    }
  }, [])

  const handleEnded = useCallback(() => {
    setIsPlaying(false)
    setProgress(100)
  }, [])

  const handleKeyPress = useCallback(
    e => {
      if (!containerRef.current?.contains(document.activeElement)) return
      switch (e.key) {
        case 'ArrowLeft':
          seekAudio(-5) // Seek back 5 seconds
          break
        case 'ArrowRight':
          seekAudio(5) // Seek forward 5 seconds
          break
      }
    },
    [isPlaying]
  )

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    window.addEventListener('keydown', handleKeyPress)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleTimeUpdate, handleEnded, handleLoadedMetadata, handleKeyPress])

  useEffect(() => {
    // Reset progress when audio URL changes
    setProgress(0)
    setCurrentTime(0)
    setIsPlaying(false)
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.pause()

      // Force load the new audio
      audioRef.current.load()
    }
  }, [audioUrl])

  const formatTime = seconds => {
    if (isNaN(seconds)) return '00:00'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const updateProgress = () => {
    if (audioRef.current) {
      const { currentTime, duration } = audioRef.current
      if (duration > 0) {
        setProgress((currentTime / duration) * 100)
      }
    }
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error)
        })
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleDownload = () => {
    if (audioUrl) {
      const link = document.createElement('a')
      link.href = audioUrl
      link.download = audioUrl.split('/').pop() || 'audio.mp3'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleProgressBarClick = e => {
    if (progressBarRef.current && audioRef.current) {
      const progressBar = progressBarRef.current
      const rect = progressBar.getBoundingClientRect()
      const offsetX = e.clientX - rect.left
      const newProgress = (offsetX / rect.width) * 100

      // Clamp the progress between 0 and 100
      const clampedProgress = Math.max(0, Math.min(newProgress, 100))

      // Update the audio time
      const newTime = (clampedProgress / 100) * audioRef.current.duration
      audioRef.current.currentTime = newTime

      // Update the UI
      setProgress(clampedProgress)
      setCurrentTime(newTime)
    }
  }

  const seekAudio = seconds => {
    if (audioRef.current) {
      const newTime = Math.max(0, Math.min(audioRef.current.currentTime + seconds, audioRef.current.duration))
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
      updateProgress()
    }
  }

  return (
    <>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      <div
        ref={containerRef}
        className="flex h-12 w-full items-center rounded-lg border border-solid border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        tabIndex={0}
        role="button"
      >
        <Button
          type="text"
          icon={<span className="flex h-full w-full items-center justify-center">{isPlaying ? '❚❚' : '▶'}</span>}
          onClick={togglePlay}
          className="flex h-8 w-8 min-w-0 items-center justify-center rounded-full bg-blue-600 p-0 text-white shadow hover:bg-blue-700"
          style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
        />
        <div className="mx-4 flex flex-1 items-center gap-2">
          <span className="min-w-[40px] text-center text-xs text-gray-500">{formatTime(currentTime)}</span>
          <div
            ref={progressBarRef}
            className="relative h-[4px] flex-1 cursor-pointer overflow-hidden bg-gray-300"
            onClick={handleProgressBarClick}
          >
            <div className="absolute left-0 top-0 h-full bg-yellow-500" style={{ width: `${progress}%` }} />
          </div>
          <span className="min-w-[40px] text-center text-xs text-gray-500">{formatTime(duration)}</span>
        </div>
        <Button
          type="text"
          icon={<span className="flex h-full w-full items-center justify-center">⬇</span>}
          onClick={handleDownload}
          className="flex h-8 w-8 min-w-0 items-center justify-center rounded-full border border-blue-600 bg-white p-0 text-blue-600 hover:bg-blue-100"
        />
      </div>
    </>
  )
}

AudioPlayer.propTypes = {
  audioUrl: PropTypes.string.isRequired
}

export default AudioPlayer
