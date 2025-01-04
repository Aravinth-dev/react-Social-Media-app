import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "./Header";
import Nav from "./Nav";
import Home from "./Home";
import NewPost from "./NewPost";
import PostPage from "./PostPage";
import About from "./About";
import Missing from "./Missing";
import Footer from "./Footer";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import api from "./api/post"
import EditPost from "./EditPost";
import useWindowSize from "./hooks/useWindowSize";
import useAxiosFetch from "./hooks/useAxiosFetch";



function App() {
  const [posts, setPost] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [postTitle, setPostTitle] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [editBody, setEditBody] = useState("");
  const navigate = useNavigate()
  const {width} = useWindowSize();
  const {data, fetchError, isLoading} = useAxiosFetch('http://localhost:3500/posts')

  useEffect(() => {
    setPost(data)
  },[data])


  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     try{
  //       const response = await api.get("/posts")
  //       setPost(response.data)
  //     }catch(err){
  //       if(err.response){
  //         //Not in the 200 respone
  //         console.log(err.response.data)
  //         console.log(err.response.status)
  //         console.log(err.response.header)
  //       }else{
  //         console.log(`Error: ${err.message}`);
  //       }
  //     }
  //   }

  //   fetchPosts();
  // }, [])


  useEffect(() => {
    const filterResult = posts.filter(
      (post) =>
        ((post.body)?.toLowerCase() || "").includes(search.toLowerCase()) ||
        ((post.title)?.toLowerCase() || "").includes(search.toLowerCase()));

    setSearchResult(filterResult.reverse());
  }, [posts, search]);

  const handleSubmit = async(e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), "MMMM dd, yyyy pp");
    const newPost = {
      id: id,
      title: postTitle,
      datetime: datetime,
      body: postBody,
    };
    try{
      const respone = await api.post("/posts",newPost)
    setPost([...posts, respone.data]);
    setPostTitle("");
    setPostBody("");
    navigate('/')
    }catch(err){
      console.log(`Error: ${err.message}`);
    }
  };

  const handleEdit = async (id) => {
    const datetime = format(new Date(), "MMMM dd, yyyy pp");
    const updatedPost = {
      id,
      title: editTitle,
      datetime: datetime,
      body: editBody,
    };
    try{
      const response = await api.put(`/posts/${id}`, updatedPost);
      setPost(posts.map(post => post.id === id ? {...response.data}:post));
      setEditTitle('');
      setEditBody('');
      navigate('/')
    }catch(err){
      console.log(`Error ${err.message}`)
    }
  }

  const handleDelete = async(id) => {
    try{
      await api.delete(`/posts/${id}`);
      const postsList = posts.filter(post => post.id !== id);
      setPost(postsList);
      navigate('/')
    }catch(err){
      console.log(`Error: ${err.message}`)
    }

  }
  return (
    <div className="App">
      <Header title="Social Media" width={width} />
      <Nav Search={search} setSearch={setSearch} />
      <Routes>
        <Route path="/" element={
        <Home 
        posts={searchResult}
        fetchError={fetchError} 
        isLoading={isLoading}
        />} />
        <Route path="Post">
        <Route index element={
        <NewPost
          handleSubmit={handleSubmit}
          postTitle={postTitle}
          setPostTitle={setPostTitle}
          postBody={postBody}
          setPostBody={setPostBody}
        />} />
        <Route path=":id" element={<PostPage posts={posts} handleDelete ={handleDelete}/>} />
        </Route>
        <Route path="/edit/:id" element={<EditPost posts={posts} handleEdit={handleEdit} editBody={editBody} editTitle={editTitle}  setEditBody={setEditBody} setEditTitle={setEditTitle}/>} ></Route>
        <Route path="About" element={
        <About />} />
        <Route path="*" element={
        <Missing />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
