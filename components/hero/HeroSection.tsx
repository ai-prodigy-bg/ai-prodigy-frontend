"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { useTranslation } from "../../lib/translations"

const HERO_VIDEO = "/videos/prodigy-alien-cat-hero-headturn-scrub-v2.mp4"
const HERO_POSTER = "/images/prodigy/prodigy-alien-cat-pose-left-v1.webp"
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><"
const END_FRAME_EPSILON = 0.02
const SCRUB_FRAME_EPSILON = 1 / 48

function clampScrubTime(time: number, duration: number) {
  const maxTime = Math.max(0, duration - END_FRAME_EPSILON)
  return Math.max(0, Math.min(maxTime, time))
}

function getScrubTimeFromPointer(clientX: number, bounds: DOMRect, duration: number) {
  if (bounds.width <= 0) return clampScrubTime(duration * 0.5, duration)

  const progress = Math.max(0, Math.min(1, (clientX - bounds.left) / bounds.width))
  return clampScrubTime(progress * duration, duration)
}

function ScrambleIn({ text, delay, triggered }: { text: string; delay: number; triggered: boolean }) {
  const [display, setDisplay] = useState("\u00a0")

  useEffect(() => {
    if (!triggered) {
      setDisplay("\u00a0")
      return
    }

    let frame = 0
    let interval: ReturnType<typeof setInterval> | undefined

    const timer = setTimeout(() => {
      interval = setInterval(() => {
        const revealCursor = frame * 0.5
        const next = text
          .split("")
          .map((char, index) => {
            if (char === " ") return " "
            if (index < revealCursor) return char
            if (index < revealCursor + 3) {
              return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
            }
            return ""
          })
          .join("")

        setDisplay(next || "\u00a0")
        frame += 1

        if (revealCursor > text.length + 2 && interval) {
          clearInterval(interval)
          setDisplay(text)
        }
      }, 25)
    }, delay)

    return () => {
      clearTimeout(timer)
      if (interval) clearInterval(interval)
    }
  }, [delay, text, triggered])

  return <>{display}</>
}

export default function HeroSection() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const targetTimeRef = useRef(0)
  const scrubFrameRef = useRef<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [entranceComplete, setEntranceComplete] = useState(false)

  const seekToTarget = useCallback(() => {
    scrubFrameRef.current = null

    const video = videoRef.current
    if (!video || !Number.isFinite(video.duration)) return

    const nextTime = clampScrubTime(targetTimeRef.current, video.duration)
    if (Math.abs(video.currentTime - nextTime) < SCRUB_FRAME_EPSILON) return

    video.currentTime = nextTime
  }, [])

  const scheduleSeek = useCallback(() => {
    if (scrubFrameRef.current !== null) return
    scrubFrameRef.current = window.requestAnimationFrame(seekToTarget)
  }, [seekToTarget])

  useEffect(() => {
    const timer = setTimeout(() => setEntranceComplete(true), 800)
    const updateViewport = () => setIsMobile(window.innerWidth < 768)
    updateViewport()
    window.addEventListener("resize", updateViewport)
    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", updateViewport)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      if (isMobile) {
        video.loop = true
        video.play().catch(() => undefined)
        return
      }

      if (!Number.isFinite(video.duration) || video.duration <= 0) return

      targetTimeRef.current = clampScrubTime(video.duration * 0.5, video.duration)
      video.loop = false
      video.pause()
      video.currentTime = targetTimeRef.current
    }

    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    handleLoadedMetadata()

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
    }
  }, [isMobile])

  useEffect(() => {
    if (isMobile) return

    const handlePointerMove = (event: PointerEvent) => {
      const video = videoRef.current
      const section = sectionRef.current
      if (!video || !section || !Number.isFinite(video.duration)) return

      const bounds = section.getBoundingClientRect()
      const heroIsVisible = bounds.bottom > 0 && bounds.top < window.innerHeight
      if (!heroIsVisible) return

      targetTimeRef.current = getScrubTimeFromPointer(event.clientX, bounds, video.duration)
      scheduleSeek()
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true })

    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      if (scrubFrameRef.current !== null) {
        window.cancelAnimationFrame(scrubFrameRef.current)
        scrubFrameRef.current = null
      }
    }
  }, [isMobile, scheduleSeek])

  const titleLines = [
    { delay: 200, text: t("hero.title.line1").trim() },
    { delay: 500, text: t("hero.title.line2").trim() },
    { delay: 800, text: t("hero.title.line3").trim() },
  ].filter(({ text }) => text.length > 0)
  const sideLabel = t("hero.sideLabel").trim()
  const sideSubtitle = t("hero.sideSubtitle").trim()

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-screen min-h-[100dvh] overflow-hidden bg-black px-4 pb-8 pt-20 sm:px-6 sm:pb-12 sm:pt-24 md:px-8"
    >
      <video
        ref={videoRef}
        src={HERO_VIDEO}
        poster={HERO_POSTER}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: "68% center" }}
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.45)_44%,rgba(0,0,0,0.22)_100%)]" />

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-col"
        animate={{ opacity: entranceComplete ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        <div className="flex-1" />

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-3xl flex-col gap-4">
            <h1 className="font-sans text-[clamp(38px,6vw,68px)] font-normal leading-[0.98] tracking-[-0.03em] text-white">
              {titleLines.map(({ delay, text }, index) => (
                <span key={`${text}-${index}`}>
                  <ScrambleIn text={text} delay={delay} triggered={entranceComplete} />
                  {index < titleLines.length - 1 && <br />}
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ y: 25, opacity: 0 }}
              animate={entranceComplete ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
              className="max-w-sm text-[13px] leading-relaxed text-white/60 sm:text-[15px]"
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={entranceComplete ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <a
                href="#contact"
                className="flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-center text-[13px] font-bold text-black hover:bg-[#e2e2e6] md:px-8"
              >
                {t("hero.ctaStart")}
              </a>
              <a
                href="#projects"
                className="flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-white/10 px-6 text-center text-[13px] font-bold text-white hover:bg-white/15 md:px-8"
              >
                {t("hero.ctaPortfolio")}
              </a>
            </motion.div>
          </div>

          <div className="text-left md:max-w-[320px] md:text-right">
            {sideLabel && (
              <div className="mb-4 text-[13px] uppercase tracking-[0.2em] text-white/40">{sideLabel}</div>
            )}
            <div className="font-sans text-[clamp(30px,4vw,52px)] font-normal leading-[1] tracking-[-0.03em] text-white">
              <ScrambleIn text={t("hero.sideTitle.line1")} delay={1000} triggered={entranceComplete} />
              <br />
              <ScrambleIn text={t("hero.sideTitle.line2")} delay={1250} triggered={entranceComplete} />
            </div>
            {sideSubtitle && (
              <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-white/45 md:ml-auto">{sideSubtitle}</p>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
