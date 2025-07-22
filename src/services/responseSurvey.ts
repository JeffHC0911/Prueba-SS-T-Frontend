import authService from "./authService"

export async function sendSurveyResponse(data: {
    survey_id: string
    respondent_id: string
    answers: string[]
}) {
    const token = await authService.getToken()
    const response = await fetch('https://mb6bhivfcb.execute-api.us-east-1.amazonaws.com/createResponses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        throw new Error('No se pudo enviar la respuesta')
    }

    return response.json()
}
