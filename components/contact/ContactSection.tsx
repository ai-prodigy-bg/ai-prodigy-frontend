"use client"

import { useState } from "react"
import type React from "react"
import { motion } from "framer-motion"
import { useTranslation } from "../../lib/translations"
import { useIsMobile } from "../../hooks/use-mobile"

const CONTACT_VIDEO = "/videos/prodigy-neural-atmosphere-loop-v1.mp4"
const CONTACT_POSTER = "/images/prodigy/prodigy-neural-atmosphere-v1.webp"

function PhoneIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <rect x="7.5" y="2.75" width="9" height="18.5" rx="2.25" />
      <path strokeLinecap="round" d="M10.75 17.75h2.5" />
    </svg>
  )
}

export default function ContactSection() {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    project: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitResult({ type: null, message: "" })

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "88ab9b06-511c-4c5a-9531-9137d2aa69f9",
          name: formData.name,
          email: formData.email,
          projectType: formData.project,
          message: formData.message,
          botcheck: false,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setSubmitResult({
          type: "success",
          message: t("contact.form.success") || "Thank you! Your message has been sent successfully.",
        })
        setFormData({ name: "", email: "", project: "", message: "" })
      } else {
        setSubmitResult({
          type: "error",
          message: result.message || t("contact.form.error") || "Something went wrong. Please try again.",
        })
      }
    } catch {
      setSubmitResult({
        type: "error",
        message: t("contact.form.error") || "Network error. Please check your connection and try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const fieldClass =
    "min-h-12 w-full rounded-lg border border-white/10 bg-black/70 px-4 py-3 text-[14px] text-white outline-none placeholder:text-white/35 focus:border-white/35 focus:bg-black md:py-4"

  return (
    <section id="contact" className="relative min-h-screen overflow-hidden bg-black px-6 py-32">
      <video
        src={CONTACT_VIDEO}
        poster={CONTACT_POSTER}
        className="absolute inset-0 h-full w-full object-cover opacity-35"
        muted
        loop
        autoPlay
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto mb-20 max-w-3xl text-center"
        >
          <h2 className="mb-8 text-[clamp(34px,7vw,72px)] font-normal leading-[1.08] tracking-[-0.03em] text-white">
            {t("contact.title").split("<br/>")[0]}
            <br />
            {t("contact.title").split("<br/>")[1]}
          </h2>
          <p className="mx-auto max-w-xl text-[15px] leading-relaxed text-white/50 sm:text-[17px]">
            {t("contact.subtitle")}
          </p>
        </motion.div>

        <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85 }}
            viewport={{ once: true, amount: 0.25 }}
            className="rounded-lg border border-white/10 bg-black/75 p-5 backdrop-blur-sm md:p-7"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <input
                  type="text"
                  name="name"
                  placeholder={t("contact.form.name")}
                  value={formData.name}
                  onChange={handleInputChange}
                  className={fieldClass}
                />
                <input
                  type="email"
                  name="email"
                  placeholder={t("contact.form.email")}
                  value={formData.email}
                  onChange={handleInputChange}
                  className={fieldClass}
                />
              </div>

              <label htmlFor="project-select" className="sr-only">
                {t("contact.form.projectTypeLabel")}
              </label>
              <select
                id="project-select"
                name="project"
                value={formData.project}
                onChange={handleInputChange}
                aria-label={t("contact.form.projectTypeLabel")}
                className={fieldClass}
              >
                <option value="">{t("contact.form.projectTypes.select")}</option>
                <option value="web-app">{t("contact.form.projectTypes.web")}</option>
                <option value="mobile-app">{t("contact.form.projectTypes.mobile")}</option>
                <option value="website">{t("contact.form.projectTypes.website")}</option>
                <option value="ecommerce">{t("contact.form.projectTypes.ecommerce")}</option>
                <option value="other">{t("contact.form.projectTypes.other")}</option>
              </select>

              <textarea
                name="message"
                placeholder={t("contact.form.message")}
                value={formData.message}
                onChange={handleInputChange}
                rows={5}
                className={fieldClass}
              />

              {submitResult.type && (
                <div
                  className={`rounded-lg border p-4 text-center text-sm ${
                    submitResult.type === "success"
                      ? "border-white/15 bg-white/10 text-white"
                      : "border-red-400/30 bg-red-500/10 text-red-200"
                  }`}
                >
                  {submitResult.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full rounded-lg px-8 py-4 text-[15px] font-bold ${
                  isSubmitting ? "bg-white/20 text-white/45" : "bg-white text-black hover:bg-[#e2e2e6]"
                }`}
              >
                {isSubmitting ? t("contact.form.sending") || "Sending..." : t("contact.form.submit")}
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.12 }}
            viewport={{ once: true, amount: 0.25 }}
            className="space-y-8"
          >
            <div>
              <h3 className="mb-5 text-[clamp(28px,5vw,48px)] font-normal leading-[1.05] tracking-[-0.03em] text-white">
                {t("contact.info.title")}
              </h3>
              <p className="text-[15px] leading-relaxed text-white/50 sm:text-[17px]">
                {t("contact.info.subtitle")}
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: "@", label: t("contact.info.labels.email"), value: t("contact.info.email"), href: "mailto:support@prodigycorp.io", clickable: true },
                { icon: <PhoneIcon />, label: t("contact.info.labels.phone"), value: t("contact.info.phone"), href: "tel:+359899520856", clickable: true },
                { icon: "BG", label: t("contact.info.labels.location"), value: t("contact.info.location"), href: "#", clickable: false },
              ].map((contact) => {
                const ContactComponent = contact.clickable && isMobile ? "a" : "div"
                const contactProps = contact.clickable && isMobile ? { href: contact.href } : {}

                return (
                  <ContactComponent
                    key={contact.label}
                    {...contactProps}
                    className="flex items-center gap-4 rounded-lg border border-white/10 bg-black/70 p-4 backdrop-blur-sm"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-sm font-bold text-white/65">
                      {contact.icon}
                    </div>
                    <div>
                      <p className="text-[12px] uppercase tracking-[0.16em] text-white/35">{contact.label}</p>
                      <p className="text-[14px] text-white/75">{contact.value}</p>
                    </div>
                  </ContactComponent>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
