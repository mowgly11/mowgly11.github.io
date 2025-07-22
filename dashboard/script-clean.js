// Configuration
const API_BASE_URL = 'https://api.osamabouzalim.com';
const BLOGS_PER_PAGE = 6;

// Global state
let currentPage = 1;
let totalBlogs = 0;
let allBlogs = [];
let currentDeleteId = null;
let isAuthorized = false;

// DOM Elements
const elements = {
  loadingSpinner: document.getElementById('loading-spinner'),
  blogCount: document.getElementById('blog-count'),
  toggleAddForm: document.getElementById('toggle-add-form'),
  addBlogForm: document.getElementById('add-blog-form'),
  blogForm: document.getElementById('blog-form'),
  cancelAdd: document.getElementById('cancel-add'),
  blogsContainer: document.getElementById('blogs-container'),
  noBlogsMessage: document.getElementById('no-blogs'),
  prevPage: document.getElementById('prev-page'),
  nextPage: document.getElementById('next-page'),
  pageInfo: document.getElementById('page-info'),
  paginationInfo: document.getElementById('pagination-info'),
  editModal: document.getElementById('edit-modal'),
  editForm: document.getElementById('edit-blog-form'),
  closeEditModal: document.getElementById('close-edit-modal'),
  cancelEdit: document.getElementById('cancel-edit'),
  deleteModal: document.getElementById('delete-modal'),
  confirmDelete: document.getElementById('confirm-delete'),
  cancelDelete: document.getElementById('cancel-delete'),
  toastContainer: document.getElementById('toast-container')
};

// Utility Functions
const showLoading = () => {
  elements.loadingSpinner.classList.remove('hidden');
};

const hideLoading = () => {
  elements.loadingSpinner.classList.add('hidden');
};

const showAccessDenied = () => {
  // Hide loading spinner
  hideLoading();
  
  // Create access denied message
  document.body.innerHTML = `
    <div style="min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 20px; background: linear-gradient(to bottom, #F5F5F5, #c4c4c4); font-family: 'Pixelify Sans', 'Ubuntu', sans-serif;">
      <div style="background-color: #e6e6e6; border: 4px solid rgb(98, 98, 98); border-radius: 15px; padding: 40px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); max-width: 500px; animation: floating 3s infinite ease-in-out;">
        <i class="fas fa-lock" style="font-size: 4em; color: rgb(98, 98, 98); margin-bottom: 20px;"></i>
        <h1 style="color: #242424; font-size: 2.5em; font-weight: 700; margin-bottom: 20px;">Access Denied</h1>
        <p style="color: rgb(98, 98, 98); font-size: 1.2em; font-weight: 600; margin-bottom: 30px;">You don't have permission to access this page.</p>
        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
          <a href="../login" class="special-btn" style="text-decoration: none; color: #242424; background-color: #e6e6e6; padding: 10px 25px; border-radius: 7px; font-size: 1.2em; font-weight: 600; box-shadow: 0 3px 2px rgb(0, 0, 0, .2); border: 1px solid rgb(0, 0, 0, .2); display: inline-flex; align-items: center; gap: 8px;">
            <i class="fas fa-sign-in-alt"></i> Login
          </a>
          <a href="../index.html" class="special-btn" style="text-decoration: none; color: #242424; background-color: #e6e6e6; padding: 10px 25px; border-radius: 7px; font-size: 1.2em; font-weight: 600; box-shadow: 0 3px 2px rgb(0, 0, 0, .2); border: 1px solid rgb(0, 0, 0, .2); display: inline-flex; align-items: center; gap: 8px;">
            <i class="fas fa-home"></i> Go Home
          </a>
        </div>
      </div>
    </div>
    <style>
      @keyframes floating {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
    </style>
  `;
};

const showToast = (message, type = 'success', duration = 3000) => {
  if (!isAuthorized) return; // Don't show toasts if not authorized
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = type === 'success' ? 'fas fa-check-circle' : 
               type === 'error' ? 'fas fa-exclamation-circle' : 
               'fas fa-exclamation-triangle';
  
  toast.innerHTML = `
    <i class="${icon}"></i>
    <span>${message}</span>
  `;
  
  elements.toastContainer.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 100);
  
  // Remove toast
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
};

const formatPostDate = (timestamp) => {
  if (!timestamp) return 'Unknown date';
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const truncateText = (text, maxLength = 150) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// API Functions - ALL requests include cookies for authentication
const apiCall = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Ensure all requests include cookies for session management
    const requestOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      credentials: 'include', // CRITICAL: Include cookies for authentication
      ...options
    };
    
    const response = await fetch(url, requestOptions);

    const data = await response.json();
    
    // Handle the actual API response structure
    if (data.status) {
      return {
        success: data.status === 200,
        status: data.status,
        data: data.data,
        error: data.error
      };
    }
    
    // Fallback for other endpoints that might not follow this structure
    return { 
      success: response.ok, 
      status: response.status,
      data: data,
      error: response.ok ? null : `HTTP ${response.status}: ${response.statusText}`
    };
  } catch (error) {
    return { 
      success: false, 
      status: 0,
      data: null,
      error: `Network error: ${error.message}`
    };
  }
};

// Dashboard Access Check
const checkDashboardAccess = async () => {
  try {
    const result = await apiCall('/api/dashboard', {
      method: 'GET'
    });
    
    if (result.success) {
      isAuthorized = true;
      return true;
    } else {
      isAuthorized = false;
      return false;
    }
  } catch (error) {
    isAuthorized = false;
    return false;
  }
};

const addBlog = async (title, author, content) => {
  return await apiCall('/api/add_blog', {
    method: 'POST',
    body: JSON.stringify({ title, author, content })
  });
};

const getBlogs = async (from, to) => {
  return await apiCall(`/api/get_blogs?from=${from}&to=${to}`, {
    method: 'GET'
  });
};

const editBlog = async (id, title, author, content) => {
  return await apiCall('/api/edit_blog', {
    method: 'PATCH',
    body: JSON.stringify({ id, title, author, content })
  });
};

const deleteBlog = async (id) => {
  return await apiCall('/api/delete_blog', {
    method: 'DELETE',
    body: JSON.stringify({ id })
  });
};

const hideBlog = async (blogId) => {
  if (!isAuthorized) return { success: false, error: 'Not authorized' };
  
  const result = await apiCall('/api/hide_blog', {
    method: 'PATCH',
    body: JSON.stringify({ id: blogId })
  });
  
  if (result.success) {
    await loadBlogs();
  }
  
  return result;
};

const unhideBlog = async (blogId) => {
  if (!isAuthorized) return { success: false, error: 'Not authorized' };
  
  const result = await apiCall('/api/unhide_blog', {
    method: 'PATCH',
    body: JSON.stringify({ id: blogId })
  });
  
  if (result.success) {
    await loadBlogs();
  }
  
  return result;
};

// UI Functions
const updateBlogCount = () => {
  const count = allBlogs.length;
  elements.blogCount.textContent = count === 1 ? '1 blog' : `${count} blogs`;
};

const updatePaginationInfo = () => {
  const startIndex = (currentPage - 1) * BLOGS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * BLOGS_PER_PAGE, totalBlogs);
  
  elements.paginationInfo.textContent = 
    totalBlogs === 0 ? 'Showing 0-0 of 0' : `Showing ${startIndex}-${endIndex} of ${totalBlogs}`;
  
  elements.pageInfo.textContent = `Page ${currentPage}`;
  
  // Update pagination buttons
  elements.prevPage.disabled = currentPage === 1;
  elements.nextPage.disabled = currentPage * BLOGS_PER_PAGE >= totalBlogs;
};

const createBlogCard = (blog) => {
  const card = document.createElement('div');
  const isHidden = !blog.visible; // Note: API uses 'visible' not 'hidden'
  card.className = `blog-card ${isHidden ? 'hidden-blog' : ''}`;
  card.setAttribute('data-aos', 'fade-up');
  
  card.innerHTML = `
    <div class="blog-header">
      <div class="blog-title-row">
        <h3 class="blog-title">${blog.title || 'Untitled'}</h3>
        <span class="visibility-badge ${blog.visible ? 'public' : 'private'}">
          <i class="fas fa-${blog.visible ? 'globe' : 'lock'}"></i>
          ${blog.visible ? 'PUBLIC' : 'PRIVATE'}
        </span>
      </div>
      <p class="blog-author">By ${blog.author || 'Unknown Author'}</p>
      <p class="blog-date">Posted: ${formatPostDate(blog.postedAt)}</p>
      ${blog.lastModified ? `<p class="blog-date">Modified: ${formatPostDate(blog.lastModified)}</p>` : ''}
      <p class="blog-views">Views: ${blog.views || 0}</p>
    </div>
    <div class="blog-content">
      ${truncateText(blog.content || 'No content available')}
    </div>
    <div class="blog-actions">
      <button class="special-btn" onclick="openEditModal('${blog.id}')">
        <i class="fas fa-edit"></i> Edit
      </button>
      <button class="special-btn ${blog.visible ? 'cancel-btn' : 'submit-btn'}" 
              onclick="toggleBlogVisibility('${blog.id}', ${blog.visible})">
        <i class="fas fa-eye${blog.visible ? '-slash' : ''}"></i> 
        ${blog.visible ? 'Hide' : 'Show'}
      </button>
      <button class="special-btn delete-btn" onclick="openDeleteModal('${blog.id}')">
        <i class="fas fa-trash"></i> Delete
      </button>
    </div>
  `;
  
  return card;
};

const renderBlogs = () => {
  elements.blogsContainer.innerHTML = '';
  
  if (allBlogs.length === 0) {
    elements.noBlogsMessage.style.display = 'block';
    return;
  }
  
  elements.noBlogsMessage.style.display = 'none';
  
  // Calculate blogs for current page
  const startIndex = (currentPage - 1) * BLOGS_PER_PAGE;
  const endIndex = startIndex + BLOGS_PER_PAGE;
  const blogsToShow = allBlogs.slice(startIndex, endIndex);
  
  blogsToShow.forEach(blog => {
    const card = createBlogCard(blog);
    elements.blogsContainer.appendChild(card);
  });
  
  updatePaginationInfo();
};

const loadBlogs = async () => {
  if (!isAuthorized) return;
  
  showLoading();
  
  try {
    // Get all blogs (we'll handle pagination on frontend)
    const result = await getBlogs(0, 100); // Large number to get all blogs
    
    if (result.success && result.data) {
      allBlogs = result.data.blogs || [];
      totalBlogs = result.data.length || allBlogs.length;
      
      // Ensure we're on a valid page
      const maxPages = Math.ceil(totalBlogs / BLOGS_PER_PAGE) || 1;
      if (currentPage > maxPages) {
        currentPage = maxPages;
      }
      
      updateBlogCount();
      renderBlogs();
    } else {
      if (result.status === 401 || result.status === 403) {
        // Session expired or access revoked
        isAuthorized = false;
        showAccessDenied();
        return;
      }
      showToast('Failed to load blogs: ' + (result.error || 'Unknown error'), 'error');
    }
  } catch (error) {
    showToast('Error loading blogs: ' + error.message, 'error');
  }
  
  hideLoading();
};

const resetAddForm = () => {
  if (!isAuthorized) return;
  elements.blogForm.reset();
  elements.addBlogForm.classList.add('hidden');
  elements.toggleAddForm.innerHTML = '<i class="fas fa-plus"></i> New Blog';
};

const resetEditForm = () => {
  if (!isAuthorized) return;
  elements.editForm.reset();
  elements.editModal.classList.remove('active');
};

// Modal Functions
const openEditModal = (blogId) => {
  if (!isAuthorized) return;
  
  const blog = allBlogs.find(b => b.id === blogId);
  if (!blog) {
    showToast('Blog not found', 'error');
    return;
  }
  
  // Show the modal first
  elements.editModal.classList.add('active');
  
  // Small delay to ensure modal is rendered before populating fields
  setTimeout(() => {
    const idField = document.getElementById('edit-blog-id');
    const titleField = document.getElementById('edit-blog-title');
    const authorField = document.getElementById('edit-blog-author');
    const contentField = document.getElementById('edit-blog-content');
    
    // Ensure all fields exist before populating
    if (idField && titleField && authorField && contentField) {
      idField.value = blog.id;
      titleField.value = blog.title || '';
      authorField.value = blog.author || '';
      contentField.value = blog.content || '';
      
      // Focus on the title field for better UX
      titleField.focus();
    } else {
      showToast('Error loading edit form', 'error');
    }
  }, 100);
};

const closeEditModal = () => {
  if (!isAuthorized) return;
  resetEditForm();
};

const openDeleteModal = (blogId) => {
  if (!isAuthorized) return;
  currentDeleteId = blogId;
  elements.deleteModal.classList.add('active');
};

const closeDeleteModal = () => {
  if (!isAuthorized) return;
  currentDeleteId = null;
  elements.deleteModal.classList.remove('active');
};

// Blog Operations
const toggleBlogVisibility = async (blogId, currentlyVisible) => {
  if (!isAuthorized) return;
  showLoading();
  
  try {
    // If currently visible, we want to hide it, and vice versa
    const result = currentlyVisible ? await hideBlog(blogId) : await unhideBlog(blogId);
    
    if (result.success) {
      showToast(`Blog ${currentlyVisible ? 'hidden' : 'shown'} successfully`, 'success');
      await loadBlogs(); // Reload to get updated data
    } else {
      if (result.status === 401 || result.status === 403) {
        isAuthorized = false;
        showAccessDenied();
        return;
      }
      showToast(`Failed to ${currentlyVisible ? 'hide' : 'show'} blog: ` + (result.error || 'Unknown error'), 'error');
    }
  } catch (error) {
    showToast(`Error ${currentlyVisible ? 'hiding' : 'showing'} blog: ` + error.message, 'error');
  }
  
  hideLoading();
};

const handleDeleteBlog = async () => {
  if (!currentDeleteId || !isAuthorized) return;
  
  showLoading();
  
  try {
    const result = await deleteBlog(currentDeleteId);
    
    if (result.success) {
      showToast('Blog deleted successfully', 'success');
      closeDeleteModal();
      await loadBlogs();
    } else {
      if (result.status === 401 || result.status === 403) {
        isAuthorized = false;
        showAccessDenied();
        return;
      }
      showToast('Failed to delete blog: ' + (result.error || 'Unknown error'), 'error');
    }
  } catch (error) {
    showToast('Error deleting blog: ' + error.message, 'error');
  }
  
  hideLoading();
};

// Event Listeners - only add if authorized
const initializeEventListeners = () => {
  if (!isAuthorized) return;

  elements.toggleAddForm.addEventListener('click', () => {
    const isHidden = elements.addBlogForm.classList.contains('hidden');
    
    if (isHidden) {
      elements.addBlogForm.classList.remove('hidden');
      elements.toggleAddForm.innerHTML = '<i class="fas fa-times"></i> Cancel';
    } else {
      resetAddForm();
    }
  });

  elements.cancelAdd.addEventListener('click', resetAddForm);

  elements.blogForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const blogData = {
      title: formData.get('title').trim(),
      author: formData.get('author').trim(),
      content: formData.get('content').trim()
    };
    
    // Validation
    if (!blogData.title || !blogData.author || !blogData.content) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    
    showLoading();
    
    try {
      const result = await addBlog(blogData.title, blogData.author, blogData.content);
      
      if (result.success) {
        showToast('Blog created successfully', 'success');
        resetAddForm();
        await loadBlogs();
      } else {
        if (result.status === 401 || result.status === 403) {
          isAuthorized = false;
          showAccessDenied();
          return;
        }
        showToast('Failed to create blog: ' + (result.error || 'Unknown error'), 'error');
      }
    } catch (error) {
      showToast('Error creating blog: ' + error.message, 'error');
    }
    
    hideLoading();
  });

  elements.editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const blogId = formData.get('id');
    const blogData = {
      title: formData.get('title').trim(),
      author: formData.get('author').trim(),
      content: formData.get('content').trim()
    };
    
    // Validation
    if (!blogId) {
      showToast('Error: Blog ID not found', 'error');
      return;
    }
    
    if (!blogData.title || !blogData.author || !blogData.content) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    
    showLoading();
    
    try {
      const result = await editBlog(blogId, blogData.title, blogData.author, blogData.content);
      
      if (result.success) {
        showToast('Blog updated successfully', 'success');
        closeEditModal();
        await loadBlogs();
      } else {
        if (result.status === 401 || result.status === 403) {
          isAuthorized = false;
          showAccessDenied();
          return;
        }
        showToast('Failed to update blog: ' + (result.error || 'Unknown error'), 'error');
      }
    } catch (error) {
      showToast('Error updating blog: ' + error.message, 'error');
    }
    
    hideLoading();
  });

  // Modal event listeners
  elements.closeEditModal.addEventListener('click', closeEditModal);
  elements.cancelEdit.addEventListener('click', closeEditModal);

  elements.confirmDelete.addEventListener('click', handleDeleteBlog);
  elements.cancelDelete.addEventListener('click', closeDeleteModal);

  // Close modals when clicking outside
  elements.editModal.addEventListener('click', (e) => {
    if (e.target === elements.editModal) {
      closeEditModal();
    }
  });

  elements.deleteModal.addEventListener('click', (e) => {
    if (e.target === elements.deleteModal) {
      closeDeleteModal();
    }
  });

  // Pagination event listeners
  elements.prevPage.addEventListener('click', async () => {
    if (currentPage > 1) {
      currentPage--;
      renderBlogs();
    }
  });

  elements.nextPage.addEventListener('click', async () => {
    const maxPages = Math.ceil(totalBlogs / BLOGS_PER_PAGE);
    if (currentPage < maxPages) {
      currentPage++;
      renderBlogs();
    }
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (!isAuthorized) return;
    
    // Escape key closes modals
    if (e.key === 'Escape') {
      if (elements.editModal.classList.contains('active')) {
        closeEditModal();
      }
      if (elements.deleteModal.classList.contains('active')) {
        closeDeleteModal();
      }
      if (!elements.addBlogForm.classList.contains('hidden')) {
        resetAddForm();
      }
    }
    
    // Ctrl+N opens new blog form
    if (e.ctrlKey && e.key === 'n') {
      e.preventDefault();
      if (elements.addBlogForm.classList.contains('hidden')) {
        elements.toggleAddForm.click();
      }
    }
  });
};

// Initialize the dashboard
window.addEventListener('DOMContentLoaded', async () => {
  // Add a small delay to show loading animation
  setTimeout(async () => {
    const hasAccess = await checkDashboardAccess();
    if (hasAccess) {
      initializeEventListeners();
      await loadBlogs();
    } else {
      showAccessDenied();
    }
  }, 500);
});

// Make functions globally available for onclick handlers
window.openEditModal = openEditModal;
window.openDeleteModal = openDeleteModal;
window.toggleBlogVisibility = toggleBlogVisibility;

// Handle page visibility changes (only if authorized)
document.addEventListener('visibilitychange', async () => {
  if (!document.hidden && isAuthorized) {
    const hasAccess = await checkDashboardAccess();
    if (hasAccess) {
      await loadBlogs();
    } else {
      showAccessDenied();
    }
  }
});
