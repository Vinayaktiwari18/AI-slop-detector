import { useState } from 'react'

export function useFileReader() {
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) setFile(f)
  }

  const onDragOver = (e) => { e.preventDefault(); setDragging(true) }
  const onDragLeave = () => setDragging(false)
  const onFileChange = (e) => { if (e.target.files[0]) setFile(e.target.files[0]) }
  const clear = () => setFile(null)

  return { file, dragging, onDrop, onDragOver, onDragLeave, onFileChange, clear }
}