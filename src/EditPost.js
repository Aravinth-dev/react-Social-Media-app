import React, { useEffect } from 'react'
import { useParams,Link } from 'react-router-dom'

const EditPost = ({posts,handleEdit,editBody,setEditBody,editTitle,setEditTitle}) => {
  const {id} = useParams()
  const post = posts.find(post => (post.id).toString() === id);
  useEffect(() => {
    if (post) {
      setEditBody(post.body)
      setEditTitle(post.title);
  }
}, [post,setEditTitle,setEditBody])
  return (
    <main className='NewPost'>
      {editTitle && 
      <>
      <h2>Edit Post</h2>
      <form className='newPostForm' onSubmit={(e) => e.preventDefault()}>
          <label htmlFor='postTitle'>Title:</label>
          <input
          id='editTitle'
          type="text"
          required
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
           />
          <label htmlFor="postBody">Post:</label>
          <textarea  
          id="postBody"
          required
          value={editBody}
          onChange={e => setEditBody(e.target.value)}
          />
          <button type='submit' onClick={() => handleEdit(post.id)}>Submit</button>
        </form>
      </>}
      {!editTitle && 
      <>
      <p>Page Not Found</p>
      <p>Well, that;s disappointing.</p>
      <p> <Link to='/'>Visit Our HomePage</Link></p>
      </>}
    </main>
  )
}

export default EditPost