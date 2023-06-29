import Awards from './Awards'
import Calendar from './Calendar'
import Form from './Form'
import Forms from './Forms'
import Qualifications from './Qualifications'
import Ranks from './Ranks'
import React from 'react'
import Roster from './Roster'
import User from './User'
import { Alert } from '../components/Alert'
import { Footer } from '../components/Footer'
import { Navigate, Route, Routes, useSearchParams, useLocation } from 'react-router-dom'
import { config } from '../constants'
import { Flowbite } from 'flowbite-react'
import Newsfeed from './Newsfeed'

function App() {
  const [searchParams] = useSearchParams()

  const apiKey = searchParams.get('apikey') ?? config.app.API_KEY ?? null
  const perscomId = searchParams.get('perscomid') ?? config.app.PERSCOM_ID ?? null

  const theme = {
    accordion: {
      root: {
        base: 'bg-blue-700'
      }
    },
    card: {
      root: {
        base: 'flex rounded-lg bg-white shadow dark:bg-gray-800',
        children: 'flex h-full flex-col justify-center gap-2 p-6'
      }
    },
    pagination: {
      base: 'ml-auto',
      pages: {
        previous: {
          base: 'ml-0 rounded-l-lg shadow bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
        },
        next: {
          base: 'rounded-r-lg shadow bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
        },
        selector: {
          base: 'w-12 shadow bg-white py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
        }
      }
    },
    table: {
      root: {
        shadow: 'absolute bg-white dark:bg-black w-full h-full top-0 left-0 rounded-lg shadow -z-10'
      }
    }
  }

  return (
    <Flowbite theme={{ theme }}>
      <div className='m-0.5'>
        {apiKey && perscomId ? (
          <Routes>
            <Route path='/' element={<Roster />}></Route>
            <Route path='/awards' element={<Awards />}></Route>
            <Route path='/calendar' element={<Calendar />}></Route>
            <Route path='/forms' element={<Forms />}></Route>
            <Route path='/forms/:id' element={<Form />}></Route>
            <Route path='/newsfeed' element={<Newsfeed />}></Route>
            <Route path='/qualifications' element={<Qualifications />}></Route>
            <Route path='/ranks' element={<Ranks />}></Route>
            <Route path='/roster' element={<Roster />}></Route>
            <Route path='/users/:id' element={<User />}></Route>
            <Route path='*' element={<Navigate to={`/${useLocation().search}`} />}></Route>
          </Routes>
        ) : (
          <Alert message='Please make sure all required widget parameters have been included.' type='failure' />
        )}
      </div>
      <Footer />
    </Flowbite>
  )
}

export default App
