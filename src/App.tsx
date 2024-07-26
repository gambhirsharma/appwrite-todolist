import NotePage from './pages/NotePage'
import  NoteProvider from './context/NoteContext.tsx'

function App() {

  return (
    <main className="app">
      <NoteProvider>
        <NotePage />
      </NoteProvider>
    </main>
  )
}

export default App
