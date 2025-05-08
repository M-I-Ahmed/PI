import { useEffect, useState } from 'react'
import mqtt, { MqttClient } from 'mqtt'

export function useMqtt() {
  const [client, setClient] = useState<MqttClient | null>(null)

  useEffect(() => {
    const mqttUrl = 'wss://test.mosquitto.org:8081' // Or your broker URL
    const options = {
      keepalive: 60,
      reconnectPeriod: 1000,
    }

    const mqttClient = mqtt.connect(mqttUrl, options)
    setClient(mqttClient)

    return () => {
      mqttClient.end(true)
    }
  }, [])

  return { client }
}
