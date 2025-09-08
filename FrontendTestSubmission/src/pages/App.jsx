import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import ShortenerPage from './ShortenerPage.jsx'
import StatsPage from './StatsPage.jsx'
import RedirectHandler from './RedirectHandler.jsx'
import { AppBar, Toolbar, Button, Container } from '@mui/material'

export default function App(){
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">Shortener</Button>
          <Button color="inherit" component={Link} to="/stats">Statistics</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{mt:3}}>
        <Routes>
          <Route path="/" element={<ShortenerPage/>} />
          <Route path="/stats" element={<StatsPage/>} />
          <Route path="/:code" element={<RedirectHandler/>} />
        </Routes>
      </Container>
    </>
  )
}
