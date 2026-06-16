import { db, storage } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Upload an image file to Firebase Storage and return its download URL
export const uploadBlogImage = async (file) => {
  const ext = file.name.split('.').pop();
  const fileName = `blogs/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const storageRef = ref(storage, fileName);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};


const blogColRef = collection(db, 'blogs');

// Create a new blog post (Admin)
export const createBlogPost = async (postData) => {
  const newPost = {
    title: postData.title || '',
    excerpt: postData.excerpt || '',
    content: postData.content || '',
    author: postData.author || 'Bliss Town Team',
    coverImage: postData.coverImage || '',
    tags: postData.tags || [],
    published: postData.published || false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const docRef = await addDoc(blogColRef, newPost);
  return { id: docRef.id, ...newPost };
};

// Fetch all blog posts (Admin - includes drafts)
export const fetchAllBlogPosts = async () => {
  const q = query(blogColRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

// Fetch only published blog posts (Public) - filtered client-side to avoid composite index requirement
export const fetchPublishedBlogPosts = async () => {
  const q = query(blogColRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(post => post.published === true);
};

// Fetch a single blog post by ID (Public + Admin)
export const fetchBlogPostById = async (id) => {
  const docRef = doc(db, 'blogs', id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
};

// Update an existing blog post (Admin)
export const updateBlogPost = async (id, updatedData) => {
  const docRef = doc(db, 'blogs', id);
  await updateDoc(docRef, {
    ...updatedData,
    updatedAt: new Date().toISOString(),
  });
};

// Toggle publish/unpublish (Admin)
export const toggleBlogPublish = async (id, currentPublished) => {
  const docRef = doc(db, 'blogs', id);
  await updateDoc(docRef, {
    published: !currentPublished,
    updatedAt: new Date().toISOString(),
  });
};

// Delete a blog post (Admin)
export const deleteBlogPost = async (id) => {
  const docRef = doc(db, 'blogs', id);
  await deleteDoc(docRef);
};
