import { v4 as uuidv4 } from 'uuid'
import authService from './authService'

export async function listSurveys() {
  const token = await authService.getToken()

const response = await fetch('https://mb6bhivfcb.execute-api.us-east-1.amazonaws.com/getSurvey', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`Error al listar encuestas: ${errText}`)
  }

  // Parseamos JSON de respuesta
  const data = await response.json()

  // Si la Lambda devuelve un objeto con 'body' que es string JSON:
  if (data.body && typeof data.body === 'string') {
    return JSON.parse(data.body)
  }

  return data
}

export interface Survey {
  PK: string
  SK: string
  entityType: string
  survey_id: string
  title: string
  description: string
  admin_id: string
  created_at: string
  updated_at: string
  status: 'borrador' | 'publicado' | 'archivado'
  // agrega otros campos si tienes
}

export async function updateSurveyStatus(survey_id: string, status: string) {
  const response = await fetch(`/api/surveys/${survey_id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  })

  if (!response.ok) {
    throw new Error('Error al actualizar el estado de la encuesta')
  }

  return response.json()
}



export async function createSurvey(data: {
  title: string
  description?: string
  admin_id: string
  branding?: Record<string, any>
  template_id?: string | null
}) {
  const surveyId = uuidv4()
  const now = new Date().toISOString()

  const item = {
    PK: `SURVEY#${surveyId}`,
    SK: 'METADATA',
    entityType: 'Survey',
    survey_id: surveyId,
    title: data.title,
    description: data.description || '',
    admin_id: data.admin_id,
    branding: data.branding || {},
    template_id: data.template_id ?? null,
    created_at: now,
    updated_at: now
  }
  
  
  

const token = await authService.getToken()

const response = await fetch('https://mb6bhivfcb.execute-api.us-east-1.amazonaws.com/createSurvey', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`  // <-- importante enviar el token
  },
  body: JSON.stringify(item),
})


  if (!response.ok) {
    const errMsg = await response.text()
    throw new Error(`Error al crear encuesta: ${errMsg}`)
  }

  return await response.json()
}
