import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AuthCallbackPage() {
  const [params] = useSearchParams()
  const { setTokens } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const token = params.get('token')
    const refresh = params.get('refresh') || ''
    if (token) {
      setTokens(token, refresh)
      navigate('/', { replace: true })
    } else {
      navigate('/login', { replace: true })
    }
  }, [])

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
