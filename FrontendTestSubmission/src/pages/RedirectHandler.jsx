import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { resolveShort } from '../utils/api.js'
import { Typography } from '@mui/material'

export default function RedirectHandler(){
  const { code } = useParams()
  useEffect(()=>{
    (async ()=>{
      try{
        const { longUrl } = await resolveShort(code)
        window.location.href = longUrl
      }catch{
        // show error
      }
    })()
  }, [code])
  return <Typography>Redirecting...</Typography>
}
