import authService from './authService'

export interface CreateQuestionPayload {
  survey_id: string
  question_id: string
  text: string
  type: string
  options?: string[]
  required: boolean
}

export async function createQuestion(data: CreateQuestionPayload) {
  const token = await authService.getToken()

  const response = await fetch('https://mb6bhivfcb.execute-api.us-east-1.amazonaws.com/createQuestions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(`Error al crear pregunta: ${message}`)
  }

  return response.json()
}
