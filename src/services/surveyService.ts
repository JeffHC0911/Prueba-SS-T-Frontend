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
  questions?: string[]
  start_date?: string
  end_date?: string
}

export async function getSurveyQuestions(surveyId: string): Promise<any[]> {
  const token = await authService.getToken()
  const response = await fetch(`https://mb6bhivfcb.execute-api.us-east-1.amazonaws.com/getQuestions?survey_id=${surveyId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Error fetching survey questions')
  }

  return response.json()
}


export async function updateSurveyStatus(survey_id: string, status: string, start_date?: string, end_date?: string) {

const token = await authService.getToken()

  const response = await fetch('https://mb6bhivfcb.execute-api.us-east-1.amazonaws.com/updateSurvey', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
     },
    body: JSON.stringify({ survey_id, status, start_date, end_date  })
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

export async function deleteSurvey(survey_id: string) {
  const token = await authService.getToken()

  const response = await fetch('https://mb6bhivfcb.execute-api.us-east-1.amazonaws.com/deleteSurvey', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ survey_id })
  })

  if (!response.ok) {
    const errMsg = await response.text()
    throw new Error(`Error al eliminar encuesta: ${errMsg}`)
  }

  return response.json()
}

export async function submitSurveyResponse(
  survey_id: string,
  answers: any,
  respondent_id?: string,
  metadata?: any
) {

  const token = await authService.getToken()
  const response = await fetch('https://mb6bhivfcb.execute-api.us-east-1.amazonaws.com/createResponses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
     },
    body: JSON.stringify({
      survey_id,
      respondent_id,
      answers,
      metadata
    })
  })

  if (!response.ok) {
    throw new Error('Error al enviar la respuesta')
  }

  return response.json()
}

export async function getSurveyById(id: string) {
  const token = await authService.getToken()
  const response = await fetch(`https://mb6bhivfcb.execute-api.us-east-1.amazonaws.com/getSurveyId/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })

  if (!response.ok) {
    throw new Error('Error al obtener encuesta')
  }
  return response.json()
}


