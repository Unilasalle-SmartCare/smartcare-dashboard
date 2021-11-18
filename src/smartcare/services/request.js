import axios from 'axios'
import { toast } from 'react-toastify'

export const request = ({ method, endpoint, params }) => {
  
  const response = axios[method](endpoint, params)
  
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