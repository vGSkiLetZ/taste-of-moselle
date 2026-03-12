"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";
import Button from "@/components/ui/Button";
import SectionDivider from "@/components/ui/SectionDivider";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <SectionDivider />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          className="paper-texture bg-moselle-cream rounded-[var(--radius-card)] stamp-border p-8 sm:p-10 text-center mt-6 relative overflow-hidden"
        >
          {/* Coin décoratif vintage */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-moselle-brown/25 rounded-tl-sm" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-moselle-brown/25 rounded-tr-sm" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-moselle-brown/25 rounded-bl-sm" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-moselle-brown/25 rounded-br-sm" />
          <div className="relative z-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-16 h-16 mx-auto mb-5 bg-moselle-green/10 rounded-full flex items-center justify-center border border-moselle-green/20"
            >
              <Mail className="text-moselle-green" size={30} />
            </motion.div>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-extrabold text-moselle-text mb-2 tracking-tight">
              <span className="italic">La Fourchette</span> Mosellane
            </h2>
            <p className="font-[family-name:var(--font-accent)] text-2xl text-moselle-text-light mb-1">
              Notre newsletter mensuelle
            </p>
            <p className="font-[family-name:var(--font-body)] italic text-sm text-moselle-text-light mb-6">
              Les meilleures découvertes du mois, directement dans votre boîte mail.
            </p>

            {submitted ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="bg-moselle-green-pale/50 rounded-xl p-4"
              >
                <p className="font-[family-name:var(--font-heading)] font-semibold text-moselle-green">
                  Merci ! Vous recevrez bientôt notre prochaine Fourchette.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.fr"
                  required
                  className="flex-1 px-5 py-3 rounded-full border-2 border-moselle-cream-dark bg-moselle-white text-moselle-text placeholder:text-moselle-text-light/60 focus:outline-none focus:border-moselle-green focus:ring-2 focus:ring-moselle-green/20 transition-all duration-200"
                />
                <Button type="submit">
                  <Send size={16} />
                  S&apos;abonner
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
