import React from 'react'

export default function PostPage({ params }: { params: { id: string }}) {
  return (
    <div>{params.id}</div>
  )
}
