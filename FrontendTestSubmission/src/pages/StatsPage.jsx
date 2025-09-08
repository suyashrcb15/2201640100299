import React, { useEffect, useState } from 'react'
import { getAllStats } from '../utils/api.js'
import { Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material'

export default function StatsPage(){
  const [rows, setRows] = useState([])
  useEffect(()=>{ getAllStats().then(setRows) }, [])

  return (
    <Paper sx={{p:2}}>
      <Typography variant="h5" gutterBottom>All Short URLs (session)</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Short</TableCell>
            <TableCell>Original</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Expires</TableCell>
            <TableCell>Clicks</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(r=>(
            <TableRow key={r.code}>
              <TableCell>http://localhost:3000/{r.code}</TableCell>
              <TableCell>{r.longUrl}</TableCell>
              <TableCell>{new Date(r.createdAt).toLocaleString()}</TableCell>
              <TableCell>{new Date(r.expiry).toLocaleString()}</TableCell>
              <TableCell>{r.clicks}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}
