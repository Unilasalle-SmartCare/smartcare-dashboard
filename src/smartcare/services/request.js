import axios from 'axios'
import { toast } from 'react-toastify'

export const request = ({ method, endpoint, data }) => {
  
  const config = {
    method: (method || '').toLowerCase(),
    url: endpoint
  }
  
  if (data) {
    config.data = data
  }

  const response = axios(config)
  
  toast.promise(
    response,
    {
      pending: 'Aguardando resposta.',
      success: 'Tudo certo! 👌',
      error: 'Ops, algo deu errado. 🤯'
    }
  )

  return response
    .then(response => response)
    .catch(error => error.response)
}