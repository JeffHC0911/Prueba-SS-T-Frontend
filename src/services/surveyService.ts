import { v4 as uuidv4 } from 'uuid'
import authService from './authService'

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
