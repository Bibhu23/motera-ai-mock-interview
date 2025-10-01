import { useRef, useEffect } from 'react'
import * as faceapi from 'face-api.js'
import { useNavigate } from 'react-router-dom'
import './LiveVideoInterviewPage.css'

function LiveVideoInterviewPage() {
    const videoRef = useRef()
    const canvasRef = useRef()
    const navigate = useNavigate()
    let noFaceStartTime = null
    let detectionInterval = null

    useEffect(() => {
        startVideo()
        loadModels()
        return () => {
            clearInterval(detectionInterval)
        }
    }, [])

    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream
                }
            })
            .catch(err => console.error("Camera error:", err))
    }

    const loadModels = async () => {
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.faceExpressionNet.loadFromUri('/models')
        ])
    }

    const handleVideoPlay = () => {
        const video = document.getElementById('interviewVideo') // use unique id
        const canvas = canvasRef.current

        if (!video || !canvas) return

        const displaySize = { width: 640, height: 480 }
        faceapi.matchDimensions(canvas, displaySize)

        if (detectionInterval) clearInterval(detectionInterval)

        detectionInterval = setInterval(async () => {
            if (!video || video.readyState !== 4) return

            const detections = await faceapi
                .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceExpressions()

            const resized = faceapi.resizeResults(detections, displaySize)
            const ctx = canvas.getContext("2d")
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            if (detections.length > 0) {
                faceapi.draw.drawDetections(canvas, resized)
                faceapi.draw.drawFaceLandmarks(canvas, resized)
                faceapi.draw.drawFaceExpressions(canvas, resized)
                noFaceStartTime = null
            } else {
                if (!noFaceStartTime) {
                    noFaceStartTime = Date.now()
                } else {
                    const elapsed = Date.now() - noFaceStartTime
                    if (elapsed > 5000) {
                        eliminateCandidate()
                    }
                }
            }
        }, 500)
    }

    const eliminateCandidate = () => {
        const stream = videoRef.current?.srcObject
        if (stream) {
            stream.getTracks().forEach(track => track.stop())
        }
        clearInterval(detectionInterval)
        alert("❌ Candidate eliminated! Redirecting...")
        navigate("/")
    }

    return (
        <div className="myapp">
            <h1>Face Detection</h1>
            <div className="appvide">
                <video
                    id="interviewVideo"
                    ref={videoRef}
                    autoPlay
                    muted
                    onPlay={handleVideoPlay}
                />
                <canvas ref={canvasRef} className="appcanvas" />
            </div>
        </div>
    )
}

export default LiveVideoInterviewPage