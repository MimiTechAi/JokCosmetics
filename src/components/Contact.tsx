'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'

interface ContactFormData {
  name: string
  email: string
  message: string
}

export function Contact() {
  const { register, handleSubmit, formState: { errors } } = useForm<ContactFormData>()

  const onSubmit = async (data: ContactFormData) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      // Handle success
      alert('Nachricht erfolgreich gesendet!')
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Fehler beim Senden der Nachricht. Bitte versuchen Sie es später erneut.')
    }
  }

  return (
    <section id="contact" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text animate-shimmer"
          >
            Kontakt
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Kontaktinformationen</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Adresse</h4>
                  <p>Wilhelmstraße 17, 75378 Bad Liebenzell</p>
                </div>
                <div>
                  <h4 className="font-medium">Telefon</h4>
                  <p>+49 1735 3909280</p>
                </div>
                <div>
                  <h4 className="font-medium">Email</h4>
                  <p>thansuda22@googlemail.com</p>
                </div>
                <div>
                  <h4 className="font-medium">Öffnungszeiten</h4>
                  <p>Montag - Samstag: 10:00 - 18:00 Uhr</p>
                  <p className="text-sm text-gray-600">Nur nach Terminvereinbarung</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Input
                  {...register('name', { required: true })}
                  placeholder="Name"
                  className="w-full"
                />
                {errors.name && (
                  <span className="text-red-500 text-sm">Name ist erforderlich</span>
                )}
              </div>
              <div>
                <Input
                  {...register('email', {
                    required: true,
                    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  })}
                  type="email"
                  placeholder="Email"
                  className="w-full"
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">
                    Gültige Email-Adresse erforderlich
                  </span>
                )}
              </div>
              <div>
                <Textarea
                  {...register('message', { required: true })}
                  placeholder="Ihre Nachricht"
                  className="w-full h-32"
                />
                {errors.message && (
                  <span className="text-red-500 text-sm">
                    Nachricht ist erforderlich
                  </span>
                )}
              </div>
              <Button type="submit" className="w-full">
                Nachricht senden
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
