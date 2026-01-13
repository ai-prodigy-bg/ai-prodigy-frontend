"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useTranslation } from "../../lib/translations"
import { useIsMobile } from "../../hooks/use-mobile"

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
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitResult({ type: null, message: '' })

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
          type: 'success', 
          message: t('contact.form.success') || 'Thank you! Your message has been sent successfully.' 
        })
        setFormData({ name: "", email: "", project: "", message: "" })
      } else {
        setSubmitResult({ 
          type: 'error', 
          message: result.message || t('contact.form.error') || 'Something went wrong. Please try again.' 
        })
      }
    } catch (error) {
      setSubmitResult({ 
        type: 'error', 
        message: t('contact.form.error') || 'Network error. Please check your connection and try again.' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="min-h-screen py-20 px-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => {
          const positions = [
            { left: 10, top: 15 },
            { left: 90, top: 25 },
            { left: 30, top: 45 },
            { left: 70, top: 65 },
            { left: 20, top: 85 },
            { left: 80, top: 10 },
            { left: 50, top: 75 },
            { left: 40, top: 35 }
          ];
          const pos = positions[i] || { left: 50, top: 50 };
          
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/20 rounded-full"
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
              }}
              animate={{
                scale: [1, 2, 1],
                opacity: [0.2, 0.8, 0.2],
                x: [0, (i % 2 === 0 ? 30 : -30), 0],
                y: [0, (i % 3 === 0 ? 40 : -40), 0],
              }}
              transition={{
                duration: 4 + (i * 0.2),
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.5,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2
            className="font-heading font-bold text-5xl md:text-7xl mb-6 text-balance"
            animate={{
              backgroundImage: [
                "linear-gradient(45deg, oklch(0.65 0.25 285), oklch(0.7 0.25 340))",
                "linear-gradient(45deg, oklch(0.7 0.25 340), oklch(0.6 0.2 160))",
                "linear-gradient(45deg, oklch(0.6 0.2 160), oklch(0.65 0.25 285))",
                "linear-gradient(45deg, oklch(0.65 0.25 285), oklch(0.7 0.25 340))",
              ],
            }}
            transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            style={{
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            {t('contact.title').split('<br/>')[0]}
            <br />
            <span>
              {t('contact.title').split('<br/>')[1]}
            </span>
          </motion.h2>
          <p className="text-xl md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty px-4">
            {t('contact.subtitle')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 md:p-8 relative overflow-hidden">
              {/* Magnetic Form Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 rounded-2xl"
                animate={{
                  background: [
                    "radial-gradient(circle at 20% 20%, oklch(0.65 0.25 285 / 0.1), transparent 50%)",
                    "radial-gradient(circle at 80% 80%, oklch(0.7 0.25 340 / 0.1), transparent 50%)",
                    "radial-gradient(circle at 50% 50%, oklch(0.6 0.2 160 / 0.1), transparent 50%)",
                    "radial-gradient(circle at 20% 20%, oklch(0.65 0.25 285 / 0.1), transparent 50%)",
                  ],
                }}
                transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid sm:grid-cols-2 gap-6">
                  <motion.div whileHover={{ scale: 1.02 }} whileFocus={{ scale: 1.02 }} className="relative">
                    <motion.input
                      type="text"
                      name="name"
                      placeholder={t('contact.form.name')}
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 md:py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 min-h-[48px] caret-primary"
                      whileFocus={{
                        boxShadow: "0 0 20px oklch(0.65 0.25 285 / 0.3)",
                        borderColor: "oklch(0.65 0.25 285)",
                      }}
                      data-magnetic
                    />
                    <motion.div
                      className="absolute inset-0 rounded-xl border-2 border-primary/50 pointer-events-none"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileFocus={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} whileFocus={{ scale: 1.02 }} className="relative">
                    <motion.input
                      type="email"
                      name="email"
                      placeholder={t('contact.form.email')}
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 md:py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 min-h-[48px] caret-primary"
                      whileFocus={{
                        boxShadow: "0 0 20px oklch(0.65 0.25 285 / 0.3)",
                        borderColor: "oklch(0.65 0.25 285)",
                      }}
                      data-magnetic
                    />
                    <motion.div
                      className="absolute inset-0 rounded-xl border-2 border-primary/50 pointer-events-none"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileFocus={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileFocus={{ scale: 1.02 }} className="relative">
                  <label htmlFor="project-select" className="sr-only">
                    {t('contact.form.projectTypeLabel')}
                  </label>
                  <motion.select
                    id="project-select"
                    name="project"
                    value={formData.project}
                    onChange={handleInputChange}
                    aria-label={t('contact.form.projectTypeLabel')}
                    className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 md:py-4 text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 min-h-[48px]"
                    whileFocus={{
                      boxShadow: "0 0 20px oklch(0.65 0.25 285 / 0.3)",
                      borderColor: "oklch(0.65 0.25 285)",
                    }}
                    data-magnetic
                  >
                    <option value="">{t('contact.form.projectTypes.select')}</option>
                    <option value="web-app">{t('contact.form.projectTypes.web')}</option>
                    <option value="mobile-app">{t('contact.form.projectTypes.mobile')}</option>
                    <option value="website">{t('contact.form.projectTypes.website')}</option>
                    <option value="ecommerce">{t('contact.form.projectTypes.ecommerce')}</option>
                    <option value="other">{t('contact.form.projectTypes.other')}</option>
                  </motion.select>
                  <motion.div
                    className="absolute inset-0 rounded-xl border-2 border-primary/50 pointer-events-none"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileFocus={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileFocus={{ scale: 1.02 }} className="relative">
                  <motion.textarea
                    name="message"
                    placeholder={t('contact.form.message')}
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 md:py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 resize-none min-h-[48px] caret-primary"
                    whileFocus={{
                      boxShadow: "0 0 20px oklch(0.65 0.25 285 / 0.3)",
                      borderColor: "oklch(0.65 0.25 285)",
                    }}
                    data-magnetic
                  />
                  <motion.div
                    className="absolute inset-0 rounded-xl border-2 border-primary/50 pointer-events-none"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileFocus={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>

                {/* Success/Error Message */}
                {submitResult.type && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl text-center font-medium ${
                      submitResult.type === 'success' 
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    {submitResult.message}
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={!isSubmitting ? {
                    scale: 1.05,
                    boxShadow: "0 0 40px oklch(0.65 0.25 285 / 0.6)",
                    y: -5,
                  } : {}}
                  whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                  className={`w-full px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 relative overflow-hidden ${
                    isSubmitting 
                      ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                  data-magnetic
                >
                  {!isSubmitting && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">
                    {isSubmitting ? t('contact.form.sending') || 'Sending...' : t('contact.form.submit')}
                  </span>
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="font-heading font-bold text-3xl mb-6 text-foreground">{t('contact.info.title')}</h3>
              <p className="text-lg text-muted-foreground mb-8 text-pretty">
                {t('contact.info.subtitle')}
              </p>
            </div>

            <div className="space-y-6">
              {[
                { icon: "📧", label: t('contact.info.labels.email'), value: t('contact.info.email'), href: "mailto:support@prodigycorp.io", clickable: true },
                { icon: "📱", label: t('contact.info.labels.phone'), value: t('contact.info.phone'), href: "tel:+359899520856", clickable: true },
                { icon: "📍", label: t('contact.info.labels.location'), value: t('contact.info.location'), href: "#", clickable: false },
              ].map((contact, index) => {
                const ContactComponent = (contact.clickable && isMobile) ? motion.a : motion.div
                const contactProps = (contact.clickable && isMobile) ? { href: contact.href } : {}
                
                return (
                  <ContactComponent
                    key={contact.label}
                    {...contactProps}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{
                      scale: 1.05,
                      x: 10,
                      boxShadow: "0 10px 30px oklch(0.65 0.25 285 / 0.2)",
                    }}
                    className="flex items-center gap-4 p-4 bg-card/30 backdrop-blur-sm border border-border/30 rounded-xl hover:border-primary/50 transition-all duration-300 group"
                    data-magnetic
                  >
                    <motion.div
                      className="text-2xl"
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                    >
                      {contact.icon}
                    </motion.div>
                    <div>
                      <p className="text-sm text-muted-foreground">{contact.label}</p>
                      <p className="text-foreground font-medium group-hover:text-primary transition-colors">
                        {contact.value}
                      </p>
                    </div>
                  </ContactComponent>
                )
              })}
            </div>

            {/* Floating Elements */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-primary/20 rounded-full"
                  style={{
                    right: `${10 + i * 20}%`,
                    top: `${20 + i * 15}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0.2, 0.8, 0.2],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 4 + i * 0.5,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.3,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
