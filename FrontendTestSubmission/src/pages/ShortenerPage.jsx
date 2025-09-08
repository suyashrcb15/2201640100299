import React, { useState } from 'react'
import { TextField, Button, Grid, Typography, Paper } from '@mui/material'
import { createShortUrl } from '../utils/api.js'
import logger from '../utils/logger.js'

export default function ShortenerPage(){
  const [items, setItems] = useState([{url:'', code:'', validity:''}])
  const [results, setResults] = useState([])

  const addRow = ()=>{
    if(items.length>=5) return;
    setItems([...items, {url:'', code:'', validity:''}])
  }
  const update = (i, field, value)=>{
    const copy=[...items]; copy[i][field]=value; setItems(copy)
  }
  const submit = async ()=>{
    const outs = []
    for(const it of items){
      if(!it.url) continue;
      try{
        const res = await createShortUrl(it.url, it.code, it.validity)
        logger.log('Shortened', res)
        outs.push(res)
      }catch(e){
        outs.push({ error: e.response?.data?.error || 'Error', longUrl: it.url })
      }
    }
    setResults(outs)
  }

  return (
    <>
      <Typography variant="h5" gutterBottom>Shorten up to 5 URLs</Typography>
      {items.map((it, idx)=>(
        <Paper key={idx} sx={{p:2, mb:2}}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Long URL" value={it.url} onChange={e=>update(idx,'url',e.target.value)} />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField fullWidth label="Validity (mins, default 30)" value={it.validity} onChange={e=>update(idx,'validity',e.target.value)} />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField fullWidth label="Custom shortcode (optional)" value={it.code} onChange={e=>update(idx,'code',e.target.value)} />
            </Grid>
          </Grid>
        </Paper>
      ))}
      <Button variant="outlined" onClick={addRow} disabled={items.length>=5} sx={{mr:2}}>Add another</Button>
      <Button variant="contained" onClick={submit}>Shorten</Button>

      {results.length>0 && (
        <div style={{marginTop:20}}>
          <Typography variant="h6">Results</Typography>
          {results.map((r, i)=>(
            <div key={i}>
              {r.error ? (
                <Typography color="error">{r.longUrl}: {r.error}</Typography>
              ):(
                <Typography>
                  <a href={r.shortUrl}>{r.shortUrl}</a> — expires at {new Date(r.expiry).toLocaleString()}
                </Typography>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
