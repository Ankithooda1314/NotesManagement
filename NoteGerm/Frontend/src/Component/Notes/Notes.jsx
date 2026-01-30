import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { createNote, resetSuccess, clearError } from "../../ReduxApi/Notes/CreateSlice.js"
import { toast } from "react-toastify";
import { useEffect } from "react";
import { getNotes } from "../../ReduxApi/Notes/GetNoteSlice.js";
import jwt_decode from "jwt-decode";
import { updateNote, resetUpdateSuccess, clearUpdateError } from "../../ReduxApi/Notes/UpdateNoteSlice";
import { deleteNote, resetDeleteSuccess, clearDeleteError } from "../../ReduxApi/Notes/DeleteNoteSlice.js";
import { Oval } from "react-loader-spinner";
import { Eye, Pencil, Trash2 } from "lucide-react"
import imageCompression from "browser-image-compression";

const Notes = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  let nameLogin = null;

  if (token) {
    const decode = jwt_decode(token);
    nameLogin = decode.id ? decode.id : null;
  }

  const dispatch = useDispatch();
  const { loading, success, error, note } = useSelector(state => state.notes);
  const { notes: backendNotes, loading: getLoading, error: getError } = useSelector(state => state.getNote);
  const { loadings, successs, errors } = useSelector(state => state.updateNote);
  const { loadingss, successss, messages, errorss } = useSelector(state => state.deleteNote);

  const notes = backendNotes || [];
  const allData = notes.filter(note =>
    note.user && note.user.toString() === nameLogin
  );

  useEffect(() => {
    dispatch(getNotes());
  }, [dispatch]);

  // Add compression loading state
  const [compressing, setCompressing] = useState(false);
  
  const compressImage = async (file) => {
    setCompressing(true); // Start compression loading
    const options = {
      maxSizeMB: 0.2,           // 200 KB max
      maxWidthOrHeight: 1024,   // resize if large
      useWebWorker: true
    };

    try {
      const compressedFile = await imageCompression(file, options);
      console.log("Original size:", (file.size / 1024).toFixed(2), "KB");
      console.log("Compressed size:", (compressedFile.size / 1024).toFixed(2), "KB");
      setCompressing(false); // End compression loading
      return compressedFile;
    } catch (error) {
      console.error("Compression error:", error);
      setCompressing(false); // End compression loading even on error
      return file;
    }
  };

  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedNote, setSelectedNote] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imgUrl: ''
  })
  const [selectedImageFile, setSelectedImageFile] = useState(null)
  const [previewImage, setPreviewImage] = useState('')
  const [dragActive, setDragActive] = useState(false)

  const updateNoteWithFreshImage = (notesArray) => {
    return notesArray.map(note => {
      if (selectedNote && note._id === selectedNote._id) {
        const timestamp = localStorage.getItem('imageUpdateTimestamp');
        if (timestamp && note.imgUrl) {
          const separator = note.imgUrl.includes('?') ? '&' : '?';
          return {
            ...note,
            imgUrl: `${note.imgUrl}${separator}t=${timestamp}`
          };
        }
      }
      return note;
    });
  };

  const filteredNotes = updateNoteWithFreshImage(allData.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.description.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  // Handle file selection with compression loader
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      return;
    }

    try {
      // Show temporary preview with loader
      const tempUrl = URL.createObjectURL(file);
      setPreviewImage(tempUrl);
      
      const compressedImage = await compressImage(file);
      
      // Replace with compressed image
      setSelectedImageFile(compressedImage);
      const finalUrl = URL.createObjectURL(compressedImage);
      setPreviewImage(finalUrl);
      setFormData(prev => ({ ...prev, imgUrl: finalUrl }));
      
      // Clean up temporary URL
      URL.revokeObjectURL(tempUrl);
    } catch (err) {
      toast.error("Image compression failed");
      setCompressing(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Invalid image file");
      return;
    }

    try {
      // Show temporary preview with loader
      const tempUrl = URL.createObjectURL(file);
      setPreviewImage(tempUrl);
      
      const compressedImage = await compressImage(file);
      
      // Replace with compressed image
      setSelectedImageFile(compressedImage);
      const finalUrl = URL.createObjectURL(compressedImage);
      setPreviewImage(finalUrl);
      setFormData(prev => ({ ...prev, imgUrl: finalUrl }));
      
      // Clean up temporary URL
      URL.revokeObjectURL(tempUrl);
    } catch (err) {
      toast.error("Image compression failed");
      setCompressing(false);
    }
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);

    if (selectedImageFile) {
      data.append("image", selectedImageFile);
    }

    dispatch(createNote(data));
  };

  useEffect(() => {
    if (success && note) {
      toast.success("Note Created Successfully 🎉");
      dispatch(getNotes());
      resetForm();
      setShowAddModal(false);
      dispatch(resetSuccess());
    }

    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [success, error, note, dispatch]);

  useEffect(() => {
    if (successs) {
      toast.success("Note Updated Successfully ✅");
      const timestamp = Date.now();
      localStorage.setItem('imageUpdateTimestamp', timestamp);
      dispatch(getNotes());
      setTimeout(() => {
        setShowEditModal(false);
        resetForm();
        dispatch(resetUpdateSuccess());
      }, 200);
    }
  }, [successs, dispatch]);

  const handleUpdateNote = (e) => {
    e.preventDefault();
    const timestamp = Date.now();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);

    if (selectedImageFile) {
      data.append("image", selectedImageFile);
    }

    if (!selectedImageFile && !previewImage && !formData.imgUrl) {
      data.append("removeImage", "true");
    }

    localStorage.setItem('imageUpdateTimestamp', timestamp);
    dispatch(updateNote({ id: selectedNote._id, formData: data }));
  };

  const handleViewNote = (note) => {
    setSelectedNote(note)
    setShowViewModal(true)
  }

  useEffect(() => {
    if (successss) {
      toast.success(messages || "Note Deleted Successfully ✅");
      dispatch(getNotes());
      setShowViewModal(false);
      dispatch(resetDeleteSuccess());
    }

    if (errorss) {
      toast.error(errorss);
      dispatch(clearDeleteError());
    }
  }, [successss, errorss, messages, dispatch]);

  const handleDeleteNote = (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      dispatch(deleteNote(id));
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', imgUrl: '' })
    setSelectedImageFile(null)
    setPreviewImage('')
    setDragActive(false)
    setCompressing(false) // Reset compression state

    if (previewImage) {
      URL.revokeObjectURL(previewImage)
    }
  }

  const openAddModal = () => {
    resetForm()
    setShowAddModal(true)
  }

  const openEditModal = (note) => {
    setSelectedNote(note)
    setFormData({
      title: note.title,
      description: note.description,
      imgUrl: note.imgUrl
    })
    setPreviewImage(note.imgUrl || '')
    setShowEditModal(true)
  }

  const clearSearch = () => {
    setSearchTerm('')
  }

  return (
    <div className='w-full bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-4 md:p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Search and Stats Bar with Add Button */}
        <div className='bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-8'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <div className='flex-1 w-full'>
              <div className='relative'>
                <input
                  type='text'
                  placeholder='🔍 Search notes by title or description...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full px-6 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-gray-50'
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1'
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-3'>
                <div className='bg-blue-50 px-4 py-2 rounded-lg'>
                  <span className='text-sm text-gray-600'>Total:</span>
                  <span className='ml-2 font-bold text-blue-600'>{notes.length}</span>
                </div>
                <div className='bg-green-50 px-4 py-2 rounded-lg'>
                  <span className='text-sm text-gray-600'>Found:</span>
                  <span className='ml-2 font-bold text-green-600'>{filteredNotes.length}</span>
                </div>
              </div>

              <button
                onClick={openAddModal}
                className='px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 font-medium'
              >
                <span className='text-xl'>+</span>
                <span>Add Note</span>
              </button>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        {filteredNotes.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12'>
            {filteredNotes.map((note) => (
              <div
                key={note._id}
                className='group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1'
              >
                {note.imgUrl ? (
                  <div className='relative h-48 overflow-hidden'>
                    <img
                      src={note.imgUrl}
                      alt={note.title}
                      className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                      onClick={() => handleViewNote(note)}
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                  </div>
                ) : (
                  <div
                    className='h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center cursor-pointer'
                    onClick={() => handleViewNote(note)}
                  >
                    <span className='text-4xl text-gray-400'>📄</span>
                  </div>
                )}

                <div className='p-5'>
                  <div className='flex items-start justify-between mb-3'>
                    <h3
                      className='text-lg font-bold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors line-clamp-1 flex-1'
                      onClick={() => handleViewNote(note)}
                    >
                      {note.title}
                    </h3>
                    {note.imgUrl && (
                      <span className='text-xs text-gray-400 ml-2'>📷</span>
                    )}
                  </div>

                  <p className='text-gray-600 text-sm line-clamp-3 mb-4'>
                    {note.description}
                  </p>

                  <div className='flex gap-1 justify-center pt-3 border-t border-gray-100'>
                    <button
                      onClick={() => handleViewNote(note)}
                      className='flex-1 px-3 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition-all duration-300 hover:scale-105 flex items-center justify-center '
                    >
                      <Eye size={16} />
                      View
                    </button>

                    <button
                      onClick={() => openEditModal(note)}
                      className='flex-1 px-3 py-2 bg-green-50 text-green-600 text-sm font-medium rounded-lg hover:bg-green-100 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-1'
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteNote(note._id)}
                      className='flex-1 px-3 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-1'
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center py-16 bg-white rounded-2xl shadow-lg'>
            <div className='text-6xl mb-4'>📝</div>
            <h3 className='text-2xl font-bold text-gray-800 mb-2'>No notes found</h3>
            <p className='text-gray-600 max-w-md mx-auto mb-6'>
              {searchTerm ? 'Try a different search term' : 'Start by creating your first note!'}
            </p>
            <button
              onClick={openAddModal}
              className='px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105'
            >
              + Create Your First Note
            </button>
          </div>
        )}

        {/* Add Note Modal with Compression Loader */}
        {showAddModal && (
          <div className='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl'>
              <div className='sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center'>
                <div>
                  <h2 className='text-2xl font-bold text-gray-800'>✨ Create New Note</h2>
                  <p className='text-gray-600 text-sm mt-1'>Add your thoughts and ideas</p>
                </div>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    resetForm()
                  }}
                  className='text-gray-400 hover:text-gray-600 text-2xl'
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddNote} className='p-6'>
                {/* Image Upload Section */}
                <div className='mb-8'>
                  <label className='block text-gray-700 font-semibold mb-3'>
                    Add Image (Optional)
                  </label>

                  {/* Image Preview with Compression Loader */}
                  {previewImage ? (
                    <div className='relative mb-4'>
                      <img
                        src={previewImage}
                        alt='Preview'
                        className={`w-full h-64 object-cover rounded-xl shadow-lg ${loading || compressing ? "opacity-50" : ""
                          }`}
                      />
                      {(loading || compressing) && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
                          <Oval height={50} width={50} color="#fff" />
                          {compressing && (
                            <div className="absolute bottom-4 text-white text-sm">
                              Compressing image...
                            </div>
                          )}
                        </div>
                      )}
                      <button
                        type='button'
                        onClick={() => {
                          setPreviewImage('');
                          setSelectedImageFile(null);
                          setFormData(prev => ({ ...prev, imgUrl: '' }));
                        }}
                        className='absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors'
                        disabled={compressing}
                      >
                        ✕ Remove
                      </button>
                    </div>
                  ) : (
                    /* Drag & Drop Area with Compression Loader */
                    <div
                      className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${dragActive
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                        } ${compressing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => !compressing && document.getElementById('fileInput').click()}
                    >
                      {compressing ? (
                        <div className="flex flex-col items-center justify-center">
                          <Oval height={50} width={50} color="#4f46e5" />
                          <p className='text-gray-700 font-medium mt-4'>Compressing image...</p>
                          <p className='text-gray-500 text-sm mt-2'>
                            Please wait while we optimize your image
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className='text-5xl mb-4 text-gray-400'>📸</div>
                          <p className='text-gray-700 font-medium mb-2'>
                            Drag & drop an image here, or click to browse
                          </p>
                          <p className='text-gray-500 text-sm'>
                            Supports JPG, PNG up to 5MB (will be compressed to ~200KB)
                          </p>
                        </>
                      )}
                      <input
                        id='fileInput'
                        type='file'
                        accept='image/*'
                        onChange={handleFileChange}
                        className='hidden'
                        disabled={compressing}
                      />
                    </div>
                  )}

                  {/* URL Input as Alternative */}
                  <div className='mt-4'>
                    <label className='block text-gray-700 text-sm font-medium mb-2'>
                      Or enter image URL:
                    </label>
                    <input
                      type='url'
                      value={formData.imgUrl}
                      onChange={(e) => setFormData({ ...formData, imgUrl: e.target.value })}
                      className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                      placeholder='https://example.com/image.jpg'
                      disabled={compressing}
                    />
                  </div>
                </div>

                {/* Title Input */}
                <div className='mb-6'>
                  <label className='block text-gray-700 font-semibold mb-2'>
                    Note Title *
                  </label>
                  <input
                    type='text'
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium'
                    placeholder='Enter a descriptive title'
                    disabled={compressing}
                  />
                </div>

                {/* Description Input */}
                <div className='mb-8'>
                  <label className='block text-gray-700 font-semibold mb-2'>
                    Description *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-40 resize-none'
                    placeholder='Write your note here...'
                    disabled={compressing}
                  />
                </div>

                {/* Form Actions */}
                <div className='flex gap-4 sticky bottom-0 bg-white pt-4 border-t border-gray-200'>
                  <button
                    type='button'
                    onClick={() => {
                      setShowAddModal(false)
                      resetForm()
                    }}
                    className={`flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-300 hover:scale-105 ${compressing ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    disabled={compressing}
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    disabled={loading || compressing}
                    className={`flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-xl 
            hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2
            ${loading || compressing ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    {loading ? (
                      <>
                        <Oval height={20} width={20} color="#fff" />
                        <span>Creating...</span>
                      </>
                    ) : compressing ? (
                      <>
                        <Oval height={20} width={20} color="#fff" />
                        <span>Processing Image...</span>
                      </>
                    ) : (
                      <>
                        <span>📝</span>
                        <span>Create Note</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Note Modal with Compression Loader */}
        {showEditModal && selectedNote && (
          <div className='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl'>
              <div className='sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center'>
                <div>
                  <h2 className='text-2xl font-bold text-gray-800'>✏️ Edit Note</h2>
                  <p className='text-gray-600 text-sm mt-1'>Update your note</p>
                </div>
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    resetForm()
                    setSelectedNote(null)
                  }}
                  className='text-gray-400 hover:text-gray-600 text-2xl'
                  disabled={loadings || compressing}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdateNote} className='p-6'>
                {/* Image Upload Section */}
                <div className='mb-8'>
                  <label className='block text-gray-700 font-semibold mb-3'>
                    Update Image (Optional)
                  </label>

                  {/* Image Preview with Compression Loader */}
                  {previewImage || formData.imgUrl ? (
                    <div className='relative mb-4'>
                      <img
                        src={previewImage || formData.imgUrl}
                        alt='Preview'
                        className={`w-full h-64 object-cover rounded-xl shadow-lg ${loadings || compressing ? "opacity-50" : ""
                          }`}
                      />
                      {(loadings || compressing) && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
                          <Oval height={50} width={50} color="#fff" />
                          {compressing && (
                            <div className="absolute bottom-4 text-white text-sm">
                              Compressing image...
                            </div>
                          )}
                        </div>
                      )}
                      <button
                        type='button'
                        onClick={() => {
                          setPreviewImage(null);
                          setSelectedImageFile(null);
                          setFormData(prev => ({ ...prev, imgUrl: "" }));
                        }}
                        className='absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors'
                        disabled={loadings || compressing}
                      >
                        ✕ Remove
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${dragActive
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                        } ${loadings || compressing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => !(loadings || compressing) && document.getElementById('editFileInput').click()}
                    >
                      {compressing ? (
                        <div className="flex flex-col items-center justify-center">
                          <Oval height={40} width={40} color="#4f46e5" />
                          <p className='text-gray-700 font-medium mt-4'>Compressing image...</p>
                          <p className='text-gray-500 text-sm mt-2'>
                            Please wait while we optimize your image
                          </p>
                        </div>
                      ) : loadings ? (
                        <div className="flex flex-col items-center justify-center">
                          <Oval height={40} width={40} color="#4f46e5" />
                          <p className='text-gray-700 font-medium mt-4'>Uploading...</p>
                        </div>
                      ) : (
                        <>
                          <div className='text-5xl mb-4 text-gray-400'>📸</div>
                          <p className='text-gray-700 font-medium mb-2'>
                            Drag & drop an image here, or click to browse
                          </p>
                          <p className='text-gray-500 text-sm'>
                            Supports JPG, PNG up to 5MB (will be compressed to ~200KB)
                          </p>
                        </>
                      )}
                      <input
                        id='editFileInput'
                        type='file'
                        accept='image/*'
                        onChange={handleFileChange}
                        className='hidden'
                        disabled={loadings || compressing}
                      />
                    </div>
                  )}

                  {/* URL Input as Alternative */}
                  <div className='mt-4'>
                    <label className='block text-gray-700 text-sm font-medium mb-2'>
                      Or enter image URL:
                    </label>
                    <input
                      type='url'
                      value={formData.imgUrl}
                      onChange={(e) => setFormData({ ...formData, imgUrl: e.target.value })}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 ${loadings || compressing ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      placeholder='https://example.com/image.jpg'
                      disabled={loadings || compressing}
                    />
                  </div>
                </div>

                {/* Title Input */}
                <div className='mb-6'>
                  <label className='block text-gray-700 font-semibold mb-2'>
                    Note Title *
                  </label>
                  <input
                    type='text'
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-medium ${loadings || compressing ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    placeholder='Enter a descriptive title'
                    disabled={loadings || compressing}
                  />
                </div>

                {/* Description Input */}
                <div className='mb-8'>
                  <label className='block text-gray-700 font-semibold mb-2'>
                    Description *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent h-40 resize-none ${loadings || compressing ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    placeholder='Write your note here...'
                    disabled={loadings || compressing}
                  />
                </div>

                {/* Form Actions */}
                <div className='flex gap-4 sticky bottom-0 bg-white pt-4 border-t border-gray-200'>
                  <button
                    type='button'
                    onClick={() => {
                      setShowEditModal(false)
                      resetForm()
                      setSelectedNote(null)
                    }}
                    className={`flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-300 hover:scale-105 ${loadings || compressing ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    disabled={loadings || compressing}
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    disabled={loadings || compressing}
                    className={`flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium rounded-xl 
            hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2
            ${loadings || compressing ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    {loadings ? (
                      <>
                        <Oval height={20} width={20} color="#fff" />
                        <span>Updating...</span>
                      </>
                    ) : compressing ? (
                      <>
                        <Oval height={20} width={20} color="#fff" />
                        <span>Processing Image...</span>
                      </>
                    ) : (
                      <>
                        <span>💾</span>
                        <span>Update Note</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Note Modal (unchanged) */}
        {showViewModal && selectedNote && (
          <div className='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-2xl max-w-2xl max-h-[90vh] shadow-xl w-full flex flex-col overflow-hidden'>
              <div className="flex-1 overflow-y-auto">
                {selectedNote.imgUrl && (
                  <div className='relative h-72'>
                    <img
                      src={selectedNote.imgUrl}
                      alt={selectedNote.title}
                      className='w-full h-full object-cover'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent'></div>
                  </div>
                )}

                <div className='p-8'>
                  <h2 className='text-3xl font-bold text-gray-800 mb-4'>
                    {selectedNote.title}
                  </h2>
                  <div className='prose prose-lg max-w-none'>
                    <p className='text-gray-700 whitespace-pre-wrap break-words leading-relaxed'>
                      {selectedNote.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className='flex gap-4 p-6 border-t border-gray-200 bg-white'>
                <button
                  onClick={() => setShowViewModal(false)}
                  className='flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-300'
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false)
                    openEditModal(selectedNote)
                  }}
                  className='flex-1 px-6 py-3 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 transition-all duration-300'
                >
                  ✏️ Edit Note
                </button>
                <button
                  onClick={() => handleDeleteNote(selectedNote._id)}
                  className='flex-1 px-6 py-3 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-all duration-300'
                >
                  🗑️ Delete Note
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Notes