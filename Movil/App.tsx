import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://zetuihzjpnbfhvzclajx.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_xopbldJcB-FPwrCcWgY6rA_8GTu_XV7'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export default function App() {
  const [currentTab, setCurrentTab] = useState<'agenda' | 'fotos' | 'eventos' | 'bitacora'>('agenda')
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const { data } = await supabase
          .from('eventos')
          .select('*')
          .order('fecha_evento', { ascending: true })
        if (data) setEvents(data)
      } catch {
        // Fallback silencioso
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />

      {/* Header Móvil */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>V.v Decoración</Text>
          <Text style={styles.headerTitle}>Panel Móvil del Dueño</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>EN CAMPO</Text>
        </View>
      </View>

      {/* Contenido según Tab Activo */}
      <ScrollView contentContainerStyle={styles.content}>
        {currentTab === 'agenda' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Agenda de Hoy & Próximos Montajes</Text>
            {loading ? (
              <ActivityIndicator color="#D4AF37" style={{ marginTop: 24 }} />
            ) : events.length === 0 ? (
              <View style={styles.card}>
                <Text style={styles.cardText}>No hay montajes pendientes registrados.</Text>
              </View>
            ) : (
              events.map((evt) => (
                <View key={evt.id} style={styles.card}>
                  <Text style={styles.cardDate}>{evt.fecha_evento} · {evt.hora_evento || 'Horario por confirmar'}</Text>
                  <Text style={styles.cardTitle}>{evt.titulo}</Text>
                  <Text style={styles.cardSubtitle}>Lugar: {evt.ubicacion}</Text>
                  <Text style={styles.cardSubtitle}>Cliente: {evt.cliente_nombre} ({evt.cliente_telefono})</Text>
                  <View style={styles.statusRow}>
                    <Text style={styles.statusText}>{evt.estado?.toUpperCase()}</Text>
                    <Text style={styles.priceText}>Bs. {evt.total_bs}</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {currentTab === 'fotos' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cámara & Subida de Fotos</Text>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Captura en Vivo desde el Evento</Text>
              <Text style={styles.cardSubtitle}>
                Toma una fotografía directa del salón decorado para enviarla en alta fidelidad al bucket de Supabase Storage.
              </Text>
              <TouchableOpacity style={styles.goldButton}>
                <Text style={styles.goldButtonText}>Abrir Cámara del Teléfono</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {currentTab === 'eventos' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumen de Eventos</Text>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Total Registrados: {events.length}</Text>
              <Text style={styles.cardSubtitle}>
                Controla los saldos pendientes por cobrar directamente al finalizar el montaje.
              </Text>
            </View>
          </View>
        )}

        {currentTab === 'bitacora' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Registro Rápido de Bitácora</Text>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Auditoría en Ruta</Text>
              <Text style={styles.cardSubtitle}>
                Guarda notas rápidas de entregas, señas recibidas en efectivo o incidencias.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Tabs de Navegación Nativa */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setCurrentTab('agenda')}
        >
          <Text style={[styles.tabText, currentTab === 'agenda' && styles.tabTextActive]}>
            Agenda
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setCurrentTab('fotos')}
        >
          <Text style={[styles.tabText, currentTab === 'fotos' && styles.tabTextActive]}>
            Cámara
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setCurrentTab('eventos')}
        >
          <Text style={[styles.tabText, currentTab === 'eventos' && styles.tabTextActive]}>
            Eventos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setCurrentTab('bitacora')}
        >
          <Text style={[styles.tabText, currentTab === 'bitacora' && styles.tabTextActive]}>
            Bitácora
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.25)',
    backgroundColor: '#0E0E11',
  },
  headerSubtitle: {
    color: '#D4AF37',
    fontSize: 12,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#F9F6F0',
    fontSize: 18,
    fontWeight: 'bold',
  },
  badge: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderWidth: 1,
    borderColor: '#D4AF37',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#F3D37A',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: '#F3D37A',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  card: {
    backgroundColor: '#0E0E11',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
    borderRadius: 14,
    padding: 14,
    gap: 4,
    marginBottom: 8,
  },
  cardDate: {
    color: '#D4AF37',
    fontSize: 12,
    fontWeight: '600',
  },
  cardTitle: {
    color: '#F9F6F0',
    fontSize: 15,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    color: '#C4B9A5',
    fontSize: 12,
  },
  cardText: {
    color: '#7D7568',
    fontSize: 13,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212, 175, 55, 0.15)',
  },
  statusText: {
    color: '#4ADE80',
    fontSize: 11,
    fontWeight: 'bold',
  },
  priceText: {
    color: '#F9F6F0',
    fontSize: 13,
    fontWeight: 'bold',
  },
  goldButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  goldButtonText: {
    color: '#050505',
    fontWeight: 'bold',
    fontSize: 14,
  },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#0E0E11',
    borderTopWidth: 1,
    borderTopColor: 'rgba(212, 175, 55, 0.25)',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    color: '#7D7568',
    fontSize: 12,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#D4AF37',
  },
})
