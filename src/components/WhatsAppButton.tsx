"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Sparkles, Phone } from 'lucide-react'

// Replace with your actual WhatsApp number
// Format: 254768842000 (Kenya number without the leading 0)
const WHATSAPP_NUMBER = "254768842000"
const PHONE_NUMBER = "+254768842000"

// Pre-written messages for different scenarios
const quickMessages = [
  "Hi! I'd like to get a quote for my wedding.",
  "Hello! Do you have availability for my event date?",
  "I'd love to see your portfolio.",
  "What packages do you offer?",
]

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [showNotification, setShowNotification] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Show notification after 10 seconds if not opened
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowNotification(true)
        setTimeout(() => setShowNotification(false), 5000)
      }
    }, 10000)

    return () => clearTimeout(timer)
  }, [isOpen])

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        // Don't clear message - preserve what they wrote
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Handle escape key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        // Don't clear message - preserve what they wrote
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen])

  const handleSendMessage = () => {
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    setIsOpen(false)
    // Clear message after sending
    setMessage("")
  }

  const handleQuickMessage = (quickMsg: string) => {
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(quickMsg)}`
    window.open(whatsappUrl, '_blank')
    setIsOpen(false)
  }

  const handleCall = () => {
    window.location.href = `tel:${PHONE_NUMBER}`
    setIsOpen(false)
  }

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-6 right-6 z-50"
      >
        {/* Notification Badge */}
        <AnimatePresence>
          {showNotification && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute bottom-14 right-0 mb-2 w-48 p-2 bg-foreground text-background text-[10px] rounded-lg shadow-lg"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3 h-3" />
                <span>Got questions? Chat with us!</span>
              </div>
              <div className="absolute -bottom-1 right-4 w-2 h-2 bg-foreground rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Button */}
        <motion.button
          ref={buttonRef}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
            isOpen 
              ? 'bg-foreground/90 text-background' 
              : 'bg-[#25D366] text-white hover:bg-[#20b859]'
          }`}
        >
          {isOpen ? (
            <X size={24} />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M12.032 2.002c-5.514 0-9.99 4.476-9.99 9.99 0 1.75.454 3.478 1.318 5.003l-1.326 3.902 4.08-1.24c1.425.744 3.04 1.138 4.694 1.138 5.514 0 9.99-4.476 9.99-9.99 0-5.514-4.476-9.99-9.99-9.99zm4.81 12.464c-.1.284-.364.592-.664.68-.3.088-1.728.614-1.99.684-.262.07-.456.105-.662-.098-.204-.204-.784-.784-.96-.942-.178-.158-.316-.18-.474-.06-.158.12-.664.472-.848.57-.184.098-.31.15-.474-.048-.164-.198-.692-.82-.946-1.164-.254-.344-.544-.844-.166-.944.38-.1.646-.376.884-.64.238-.264.318-.454.476-.752.16-.298.08-.56-.044-.786-.124-.226-.652-1.476-.894-2.01-.232-.516-.47-.454-.646-.464-.176-.01-.38-.016-.586-.016-.206 0-.54.078-.822.39-.282.312-1.078 1.052-1.078 2.568 0 1.516 1.104 2.98 1.258 3.186.154.206 2.166 3.364 5.226 4.54.73.28 1.302.446 1.746.57.734.23 1.404.198 1.932.12.592-.09 1.822-.744 2.078-1.462.256-.718.256-1.334.18-1.462-.076-.128-.28-.204-.58-.33z" />
            </svg>
          )}
        </motion.button>
      </motion.div>

      {/* Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[350px] max-w-[calc(100vw-2rem)] bg-background border border-foreground/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#25D366] p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="currentColor"
                    >
                      <path d="M12.032 2.002c-5.514 0-9.99 4.476-9.99 9.99 0 1.75.454 3.478 1.318 5.003l-1.326 3.902 4.08-1.24c1.425.744 3.04 1.138 4.694 1.138 5.514 0 9.99-4.476 9.99-9.99 0-5.514-4.476-9.99-9.99-9.99zm4.81 12.464c-.1.284-.364.592-.664.68-.3.088-1.728.614-1.99.684-.262.07-.456.105-.662-.098-.204-.204-.784-.784-.96-.942-.178-.158-.316-.18-.474-.06-.158.12-.664.472-.848.57-.184.098-.31.15-.474-.048-.164-.198-.692-.82-.946-1.164-.254-.344-.544-.844-.166-.944.38-.1.646-.376.884-.64.238-.264.318-.454.476-.752.16-.298.08-.56-.044-.786-.124-.226-.652-1.476-.894-2.01-.232-.516-.47-.454-.646-.464-.176-.01-.38-.016-.586-.016-.206 0-.54.078-.822.39-.282.312-1.078 1.052-1.078 2.568 0 1.516 1.104 2.98 1.258 3.186.154.206 2.166 3.364 5.226 4.54.73.28 1.302.446 1.746.57.734.23 1.404.198 1.932.12.592-.09 1.822-.744 2.078-1.462.256-.718.256-1.334.18-1.462-.076-.128-.28-.204-.58-.33z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Chat with us</h3>
                    <p className="text-xs text-white/80">Typically replies in minutes</p>
                  </div>
                </div>
                <button
                  onClick={handleCall}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors text-xs"
                >
                  <Phone size={12} />
                  <span>Call</span>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-4">
              {/* Welcome Message */}
              <div className="mb-4 flex">
                <div className="max-w-[85%] bg-foreground/5 border border-foreground/10 rounded-2xl rounded-tl-none p-3">
                  <p className="text-sm text-foreground/80">
                    👋 Hi there! Welcome to Events District.
                  </p>
                  <p className="text-xs text-foreground/50 mt-1">
                    How can we help you today?
                  </p>
                </div>
              </div>

              {/* Quick Reply Buttons */}
              <div className="mb-4">
                <p className="text-[10px] text-foreground/40 mb-2">Quick replies:</p>
                <div className="flex flex-wrap gap-2">
                  {quickMessages.map((msg, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickMessage(msg)}
                      className="text-xs px-3 py-1.5 bg-foreground/5 border border-foreground/10 rounded-full text-foreground/70 hover:bg-foreground/10 hover:text-foreground transition-colors"
                    >
                      {msg.length > 30 ? msg.substring(0, 27) + '...' : msg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Message Input */}
              <div className="border-t border-foreground/10 pt-4">
                <p className="text-[10px] text-foreground/40 mb-2">Or type your message:</p>
                <div className="flex gap-2">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your question here..."
                    rows={2}
                    className="flex-1 px-3 py-2 bg-foreground/5 border border-foreground/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-foreground/30 transition-colors resize-none placeholder:text-foreground/40"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#20b859] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>

              {/* Footer Note */}
              <p className="text-[8px] text-foreground/30 text-center mt-4">
                We'll respond via WhatsApp within minutes
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}