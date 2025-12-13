function initializeAdminPanel() {
    const PARTNERS_API_URL = 'http://localhost:3000/api/partners';
    const PRODUCTS_API_URL = 'http://localhost:3000/api/products';
    const TESTIMONIALS_API_URL = 'http://localhost:3000/api/testimonials';
    const USERS_API_URL = 'http://localhost:3000/api/users';
    
    // --- Mobile Sidebar ---
    const sidebar = document.getElementById('admin-sidebar');
    const mobileMenuBtn = document.getElementById('admin-mobile-menu-btn');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    const toggleSidebar = () => {
        sidebar.classList.toggle('-translate-x-full');
        sidebarOverlay.classList.toggle('hidden');
    };

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleSidebar);
    }
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', toggleSidebar);
    }

    // --- Navigation ---
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.dataset.target;

            // Update active link style
            navLinks.forEach(navLink => {
                navLink.classList.remove('bg-slate-700', 'text-white');
                navLink.classList.add('text-slate-400', 'hover:bg-slate-700', 'hover:text-white');
            });
            link.classList.add('bg-slate-700', 'text-white');
            link.classList.remove('text-slate-400', 'hover:bg-slate-700', 'hover:text-white');

            // Show target section, hide others
            contentSections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.remove('hidden');
                } else {
                    section.classList.add('hidden');
                }
            });

            // Close sidebar on mobile after navigation
            if (window.innerWidth < 768 && !sidebar.classList.contains('-translate-x-full')) {
                toggleSidebar();
            }
        });
    });

    // --- Reusable API Fetch Function ---
    const api = async (url, method = 'GET', body = null) => {
        const options = {
            method,
            headers: {
                // This is where we add the JWT for every API request
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
        };
        if (body) {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            // If the token is invalid or expired, the server will return 401 or 403
            if (response.status === 401 || response.status === 403) {
                // Token is bad, log the user out
                localStorage.removeItem('authToken');
                window.location.reload();
                throw new Error('Session expired. Please log in again.');
            }
            // For 204 No Content, response.json() will fail.
            if (response.status === 204) return null;
            const errorData = await response.json().catch(() => ({ error: `Request failed with status: ${response.status}` }));
            throw new Error(errorData.error || 'An unknown API error occurred.');
        }
        // For 204 No Content, response.json() will fail.
        return response.status === 204 ? null : response.json();
    };

    // --- Partners Management ---
    const partnersTableBody = document.getElementById('partners-table-body');
    const addPartnerForm = document.getElementById('add-partner-form');
    const partnerFormMessage = document.getElementById('partner-form-message');
    
    // Modal elements
    const editModal = document.getElementById('edit-modal');
    const editForm = document.getElementById('edit-partner-form');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const editPartnerId = document.getElementById('edit-partner-id');
    const editPartnerName = document.getElementById('edit-partner-name');
    const editPartnerLogo = document.getElementById('edit-partner-logo');

    // Function to render partners in the table
    let currentPartners = []; // Cache for partners to avoid re-fetching
    const renderPartners = (partners) => { 
        partnersTableBody.innerHTML = '';
        if (partners.length === 0) {
            partnersTableBody.innerHTML = '<tr><td colspan="3" class="p-4 text-center text-slate-500">No partners found.</td></tr>';
            return;
        }
        partners.forEach(partner => {
            const row = document.createElement('tr');
            row.className = 'border-b border-slate-100';
            row.innerHTML = `
                <td class="p-4"><img src="${partner.logo_url}" alt="${partner.name}" class="h-8"></td>
                <td class="p-4 text-slate-800">${partner.name}</td>
                <td class="p-4 text-right">
                    <button data-id="${partner.id}" class="edit-btn text-blue-500 hover:text-blue-700 mr-4">
                        <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button data-id="${partner.id}" class="delete-btn text-red-500 hover:text-red-700">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;
            partnersTableBody.appendChild(row);
        });
    };

    // Function to fetch all partners
    const fetchPartners = async () => {
        try {
            const partners = await api(PARTNERS_API_URL);
            currentPartners = partners;
            renderPartners(partners);
        } catch (error) {
            partnersTableBody.innerHTML = `<tr><td colspan="3" class="p-4 text-center text-red-500">${error.message}</td></tr>`;
        }
    };

    // Event Listener for adding a new partner
    addPartnerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('partner-name').value;
        const logo_url = document.getElementById('partner-logo').value;
        const submitButton = addPartnerForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Adding...';

        try {
            await api(PARTNERS_API_URL, 'POST', { name, logo_url });
            partnerFormMessage.textContent = 'Partner added successfully!';
            partnerFormMessage.className = 'text-sm mt-2 h-5 text-green-600';
            addPartnerForm.reset();
            fetchPartners(); // Refresh the table
        } catch (error) {
            partnerFormMessage.textContent = error.message;
            partnerFormMessage.className = 'text-sm mt-2 h-5 text-red-600';
            console.error('Add partner error:', error);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Add Partner';
            setTimeout(() => partnerFormMessage.textContent = '', 3000);
        }
    });

    // Event Listener for table actions (Edit and Delete)
    partnersTableBody.addEventListener('click', async (e) => {
        // Handle Edit button click
        const editButton = e.target.closest('.edit-btn');
        if (editButton) {
            const partnerId = editButton.dataset.id;
            const partnerToEdit = currentPartners.find(p => p.id == partnerId);
            if (partnerToEdit) {
                editPartnerId.value = partnerToEdit.id;
                editPartnerName.value = partnerToEdit.name;
                editPartnerLogo.value = partnerToEdit.logo_url;
                editModal.classList.remove('hidden');
            }
        }

        // Handle Delete button click
        const deleteButton = e.target.closest('.delete-btn');
        if (deleteButton) {
            const partnerId = deleteButton.dataset.id;
            if (confirm('Are you sure you want to delete this partner?')) {
                try {
                    await api(`${PARTNERS_API_URL}/${partnerId}`, 'DELETE');
                    fetchPartners(); // Refresh the table
                } catch (error) {
                    alert(error.message);
                }
            }
        }
    });

    // Event listener for submitting the edit form
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = editPartnerId.value;
        const name = editPartnerName.value;
        const logo_url = editPartnerLogo.value;
        const submitButton = editForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Saving...';

        try {
            await api(`${PARTNERS_API_URL}/${id}`, 'PUT', { name, logo_url });
            editModal.classList.add('hidden');
            fetchPartners(); // Refresh the table
        } catch (error) {
            alert(`Error saving partner: ${error.message}`);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Save Changes';
        }
    });

    // Event listener to close the modal
    cancelEditBtn.addEventListener('click', () => {
        editModal.classList.add('hidden');
    });

    // --- Products Management ---
    const productsTableBody = document.getElementById('products-table-body');
    const addProductForm = document.getElementById('add-product-form');
    let currentProducts = [];

    // Product Edit Modal Elements
    const editProductModal = document.getElementById('edit-product-modal');
    const editProductForm = document.getElementById('edit-product-form');
    const cancelEditProductBtn = document.getElementById('cancel-edit-product-btn');
    const editProductId = document.getElementById('edit-product-id');
    const editProductName = document.getElementById('edit-product-name');
    const editProductIcon = document.getElementById('edit-product-icon');
    const editProductDescription = document.getElementById('edit-product-description');
    const editProductCategory = document.getElementById('edit-product-category');
    const editProductCategoryUrl = document.getElementById('edit-product-category-url');
    const editProductTheme = document.getElementById('edit-product-theme');
    const editProductOrder = document.getElementById('edit-product-order');
    const editProductFeatured = document.getElementById('edit-product-featured');
    
    const renderProductsTable = (products) => {
        productsTableBody.innerHTML = '';
        if (products.length === 0) {
            productsTableBody.innerHTML = '<tr><td colspan="6" class="p-4 text-center text-slate-500">No products found.</td></tr>';
            return;
        }
        products.forEach(product => {
            const row = document.createElement('tr');
            row.className = 'block md:table-row border-b border-slate-200 md:border-b-0 dark:border-slate-700';
            row.innerHTML = `
                <td class="p-4 flex justify-between items-center md:table-cell md:text-slate-500"><span class="font-semibold text-slate-600 md:hidden mr-2 dark:text-slate-300">Order:</span> ${product.display_order}</td>
                <td class="p-4 flex justify-between items-center md:table-cell md:text-slate-800 md:font-semibold dark:md:text-white"><span class="font-semibold text-slate-600 md:hidden mr-2 dark:text-slate-300">Product:</span> <span class="text-right font-bold md:font-semibold">${product.name}</span></td>
                <td class="p-4 flex justify-between items-center md:table-cell md:text-slate-500 md:text-sm md:max-w-xs md:truncate" title="${product.description}"><span class="font-semibold text-slate-600 md:hidden mr-2 dark:text-slate-300">Description:</span> <span class="text-right text-sm text-slate-600 dark:text-slate-400">${product.description}</span></td>
                <td class="p-4 flex justify-between items-center md:table-cell md:text-slate-500"><span class="font-semibold text-slate-600 md:hidden mr-2 dark:text-slate-300">Category:</span> ${product.category || 'N/A'}</td>
                <td class="p-4 flex justify-between items-center md:table-cell md:text-slate-500"><span class="font-semibold text-slate-600 md:hidden mr-2 dark:text-slate-300">Featured:</span> ${product.is_featured ? '<i class="fas fa-star text-yellow-400"></i>' : 'No'}</td>
                <td class="p-4 flex justify-end items-center md:table-cell md:text-right">
                    <button data-id="${product.id}" class="product-edit-btn text-blue-500 hover:text-blue-700 mr-4" title="Edit" aria-label="Edit">
                        <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button data-id="${product.id}" class="product-delete-btn text-red-500 hover:text-red-700" title="Delete" aria-label="Delete">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;
            productsTableBody.appendChild(row);
        });
    };

    const fetchProducts = async () => {
        try {
            const products = await api(PRODUCTS_API_URL);
            // Ensure products are sorted by display_order
            currentProducts = products.sort((a, b) => a.display_order - b.display_order);
            renderProductsTable(products);
        } catch (error) {
            productsTableBody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-red-500">${error.message}</td></tr>`;
        }
    };

    addProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitButton = addProductForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Adding...';

        const productData = {
            name: document.getElementById('product-name').value,
            icon_class: document.getElementById('product-icon').value,
            description: document.getElementById('product-description').value,
            category: document.getElementById('product-category').value,
            category_url: document.getElementById('product-category-url').value,
            theme: document.getElementById('product-theme').value,
            display_order: document.getElementById('product-order').value,
            is_featured: document.getElementById('product-featured').checked
        };

        try {
            await api(PRODUCTS_API_URL, 'POST', productData);
            addProductForm.reset();
            fetchProducts(); // Refresh the product list
        } catch (error) {
            alert(`Error adding product: ${error.message}`);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Add Product';
        }
    });

    // Event listener for product table actions (Edit/Delete)
    productsTableBody.addEventListener('click', async (e) => {
        // Handle Delete
        const deleteButton = e.target.closest('.product-delete-btn');
        if (deleteButton) {
            const productId = deleteButton.dataset.id;
            if (confirm('Are you sure you want to delete this product?')) {
                try {
                    await api(`${PRODUCTS_API_URL}/${productId}`, 'DELETE');
                    fetchProducts(); // Refresh list
                } catch (error) {
                    alert(error.message);
                }
            }
        }

        // Handle Edit
        const editButton = e.target.closest('.product-edit-btn');
        if (editButton) {
            const productId = editButton.dataset.id;
            const productToEdit = currentProducts.find(p => p.id == productId);
            if (productToEdit) {
                // Populate and show the modal
                editProductId.value = productToEdit.id;
                editProductName.value = productToEdit.name;
                editProductIcon.value = productToEdit.icon_class;
                editProductDescription.value = productToEdit.description;
                editProductCategory.value = productToEdit.category;
                editProductCategoryUrl.value = productToEdit.category_url;
                editProductOrder.value = productToEdit.display_order;
                editProductFeatured.checked = productToEdit.is_featured;
                
                // Populate theme dropdown
                const themes = ['blue', 'purple', 'orange', 'green'];
                editProductTheme.innerHTML = themes.map(t => `<option value="${t}" ${productToEdit.theme === t ? 'selected' : ''}>${t.charAt(0).toUpperCase() + t.slice(1)}</option>`).join('');

                editProductModal.classList.remove('hidden');
            }
        }
    });

    // Handle Product Edit Form Submission
    editProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = editProductId.value;
        const submitButton = editProductForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Saving...';

        const productData = {
            name: editProductName.value,
            icon_class: editProductIcon.value,
            description: editProductDescription.value,
            category: editProductCategory.value,
            category_url: editProductCategoryUrl.value,
            theme: editProductTheme.value,
            display_order: editProductOrder.value,
            is_featured: editProductFeatured.checked,
        };

        try {
            await api(`${PRODUCTS_API_URL}/${id}`, 'PUT', productData);
            editProductModal.classList.add('hidden');
            fetchProducts();
        } catch (error) {
            alert(`Error saving product: ${error.message}`);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Save Changes';
        }
    });

    // Close product edit modal
    cancelEditProductBtn.addEventListener('click', () => {
        editProductModal.classList.add('hidden');
    });

    // --- Testimonials Management ---
    const testimonialsTableBody = document.getElementById('testimonials-table-body');
    const addTestimonialForm = document.getElementById('add-testimonial-form');
    let currentTestimonials = [];

    // Testimonial Edit Modal Elements
    const editTestimonialModal = document.getElementById('edit-testimonial-modal');
    const editTestimonialForm = document.getElementById('edit-testimonial-form');
    const cancelEditTestimonialBtn = document.getElementById('cancel-edit-testimonial-btn');
    const editTestimonialId = document.getElementById('edit-testimonial-id');
    const editTestimonialQuote = document.getElementById('edit-testimonial-quote');
    const editTestimonialClientName = document.getElementById('edit-testimonial-client-name');
    const editTestimonialClientTitle = document.getElementById('edit-testimonial-client-title');
    const editTestimonialImageUrl = document.getElementById('edit-testimonial-image-url');
    const editTestimonialOrder = document.getElementById('edit-testimonial-order');

    const renderTestimonialsTable = (testimonials) => {
        testimonialsTableBody.innerHTML = '';
        if (testimonials.length === 0) {
            testimonialsTableBody.innerHTML = '<tr><td colspan="3" class="p-4 text-center text-slate-500">No testimonials found.</td></tr>';
            return;
        }
        testimonials.forEach(testimonial => {
            const row = document.createElement('tr');
            row.className = 'block md:table-row border-b border-slate-200 md:border-b-0 dark:border-slate-700';
            row.innerHTML = `
                <td class="p-4 flex justify-between items-center md:table-cell">
                    <span class="font-semibold text-slate-600 md:hidden mr-2 dark:text-slate-300">Client:</span>
                    <div class="flex items-center gap-3">
                        <img src="${testimonial.image_url || 'https://via.placeholder.com/40'}" alt="${testimonial.client_name}" class="h-10 w-10 rounded-full object-cover">
                        <div>
                            <div class="font-semibold text-slate-800 dark:text-white">${testimonial.client_name}</div>
                            <div class="text-sm text-slate-500 dark:text-slate-400">${testimonial.client_title || ''}</div>
                        </div>
                    </div>
                </td>
                <td class="p-4 flex justify-between items-center md:table-cell md:text-slate-600 md:text-sm md:max-w-md md:truncate dark:text-slate-400" title="${testimonial.quote}"><span class="font-semibold text-slate-600 md:hidden mr-2 dark:text-slate-300">Quote:</span> <span class="text-right">${testimonial.quote}</span></td>
                <td class="p-4 flex justify-end items-center md:table-cell md:text-right">
                    <button data-id="${testimonial.id}" class="testimonial-edit-btn text-blue-500 hover:text-blue-700 mr-4" title="Edit"><i class="fas fa-pencil-alt"></i></button>
                    <button data-id="${testimonial.id}" class="testimonial-delete-btn text-red-500 hover:text-red-700" title="Delete"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
            testimonialsTableBody.appendChild(row);
        });
    };

    const fetchTestimonials = async () => {
        try {
            const testimonials = await api(TESTIMONIALS_API_URL);
            currentTestimonials = testimonials;
            renderTestimonialsTable(testimonials);
        } catch (error) {
            testimonialsTableBody.innerHTML = `<tr><td colspan="3" class="p-4 text-center text-red-500">${error.message}</td></tr>`;
        }
    };

    addTestimonialForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitButton = addTestimonialForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Adding...';

        const testimonialData = {
            quote: document.getElementById('testimonial-quote').value,
            client_name: document.getElementById('testimonial-client-name').value,
            client_title: document.getElementById('testimonial-client-title').value,
            image_url: document.getElementById('testimonial-image-url').value,
            display_order: document.getElementById('testimonial-order').value,
        };
        try {
            await api(TESTIMONIALS_API_URL, 'POST', testimonialData);
            addTestimonialForm.reset();
            fetchTestimonials();
        } catch (error) {
            alert(`Error adding testimonial: ${error.message}`);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Add Testimonial';
        }
    });

    testimonialsTableBody.addEventListener('click', async (e) => {
        const editButton = e.target.closest('.testimonial-edit-btn');
        if (editButton) {
            const testimonialId = editButton.dataset.id;
            const testimonialToEdit = currentTestimonials.find(t => t.id == testimonialId);
            if (testimonialToEdit) {
                editTestimonialId.value = testimonialToEdit.id;
                editTestimonialQuote.value = testimonialToEdit.quote;
                editTestimonialClientName.value = testimonialToEdit.client_name;
                editTestimonialClientTitle.value = testimonialToEdit.client_title;
                editTestimonialImageUrl.value = testimonialToEdit.image_url;
                editTestimonialOrder.value = testimonialToEdit.display_order;
                editTestimonialModal.classList.remove('hidden');
            }
        }

        const deleteButton = e.target.closest('.testimonial-delete-btn');
        if (deleteButton) {
            const testimonialId = deleteButton.dataset.id;
            if (confirm('Are you sure you want to delete this testimonial?')) {
                await api(`${TESTIMONIALS_API_URL}/${testimonialId}`, 'DELETE');
                fetchTestimonials();
            }
        }
    });

    editTestimonialForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = editTestimonialId.value;
        const submitButton = editTestimonialForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Saving...';

        const data = Object.fromEntries(new FormData(e.target));
        
        try {
            await api(`${TESTIMONIALS_API_URL}/${id}`, 'PUT', data);
            editTestimonialModal.classList.add('hidden');
            fetchTestimonials();
        } catch (error) {
            alert(`Error saving testimonial: ${error.message}`);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Save Changes';
        }
    });

    cancelEditTestimonialBtn.addEventListener('click', () => editTestimonialModal.classList.add('hidden'));

    // --- Users Management ---
    const usersTableBody = document.getElementById('users-table-body');
    const addUserForm = document.getElementById('add-user-form');
    const userFormMessage = document.getElementById('user-form-message');
    let currentUsers = [];

    // User Edit Modal Elements
    const editUserModal = document.getElementById('edit-user-modal');
    const editUserForm = document.getElementById('edit-user-form');
    const cancelEditUserBtn = document.getElementById('cancel-edit-user-btn');
    const editUserId = document.getElementById('edit-user-id');
    const editUserUsername = document.getElementById('edit-user-username');
    const editUserPassword = document.getElementById('edit-user-password');

    const renderUsersTable = (users) => {
        usersTableBody.innerHTML = '';
        if (users.length === 0) {
            usersTableBody.innerHTML = '<tr><td colspan="5" class="p-4 text-center text-slate-500">No users found.</td></tr>';
            return;
        }
        users.forEach(user => {
            const row = document.createElement('tr');
            row.className = 'block md:table-row border-b border-slate-200 md:border-b-0 dark:border-slate-700';
            row.innerHTML = `
                <td class="p-4 flex justify-between items-center md:table-cell md:text-slate-500 dark:text-slate-400"><span class="font-semibold text-slate-600 md:hidden mr-2 dark:text-slate-300">ID:</span> ${user.id}</td>
                <td class="p-4 flex justify-between items-center md:table-cell md:text-slate-800 md:font-semibold dark:text-white"><span class="font-semibold text-slate-600 md:hidden mr-2 dark:text-slate-300">Username:</span> ${user.username}</td>
                <td class="p-4 flex justify-between items-center md:table-cell md:text-slate-500 dark:text-slate-400"><span class="font-semibold text-slate-600 md:hidden mr-2 dark:text-slate-300">Role:</span> ${user.role}</td>
                <td class="p-4 flex justify-between items-center md:table-cell md:text-slate-500 md:text-sm dark:text-slate-400"><span class="font-semibold text-slate-600 md:hidden mr-2 dark:text-slate-300">Created At:</span> ${new Date(user.created_at).toLocaleDateString()}</td>
                <td class="p-4 flex justify-end items-center md:table-cell md:text-right">
                    <button data-id="${user.id}" class="user-edit-btn text-blue-500 hover:text-blue-700 mr-4" title="Edit" aria-label="Edit"><i class="fas fa-pencil-alt"></i></button>
                    <button data-id="${user.id}" class="user-delete-btn text-red-500 hover:text-red-700" title="Delete"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
            usersTableBody.appendChild(row);
        });
    };

    const fetchUsers = async () => {
        try {
            const users = await api(USERS_API_URL);
            currentUsers = users;
            renderUsersTable(users);
        } catch (error) {
            usersTableBody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-red-500">${error.message}</td></tr>`;
        }
    };

    addUserForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('user-username').value;
        const password = document.getElementById('user-password').value;
        try {
            await api(USERS_API_URL, 'POST', { username, password });
            userFormMessage.textContent = 'User added successfully!';
            userFormMessage.className = 'text-sm mt-2 h-5 text-green-600';
            addUserForm.reset();
            fetchUsers();
        } catch (error) {
            userFormMessage.textContent = error.message;
            userFormMessage.className = 'text-sm mt-2 h-5 text-red-600';
        } finally {
            setTimeout(() => userFormMessage.textContent = '', 3000);
        }
    });

    usersTableBody.addEventListener('click', async (e) => {
        const editButton = e.target.closest('.user-edit-btn');
        if (editButton) {
            const userId = editButton.dataset.id;
            const userToEdit = currentUsers.find(u => u.id == userId);
            if (userToEdit) {
                editUserId.value = userToEdit.id;
                editUserUsername.value = userToEdit.username;
                editUserPassword.value = ''; // Clear password field
                editUserModal.classList.remove('hidden');
            }
        }

        const deleteButton = e.target.closest('.user-delete-btn');
        if (deleteButton) {
            const userId = deleteButton.dataset.id;
            if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
                await api(`${USERS_API_URL}/${userId}`, 'DELETE');
                fetchUsers();
            }
        }
    });

    editUserForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = editUserId.value;
        const username = editUserUsername.value;
        const password = editUserPassword.value;
        const data = { username };
        if (password) data.password = password; // Only include password if it's not empty

        await api(`${USERS_API_URL}/${id}`, 'PUT', data);
        editUserModal.classList.add('hidden');
        fetchUsers();
    });

    cancelEditUserBtn.addEventListener('click', () => editUserModal.classList.add('hidden'));

    // Initial data fetch
    function initialize() {
        fetchPartners();
        fetchProducts();
        fetchTestimonials();
        fetchUsers();
    }

    initialize();
}

document.addEventListener('DOMContentLoaded', () => {
    // Make the initialization function available to the inline script in admin.html
    window.initializeAdminPanel = initializeAdminPanel;

    // If the page loads and the user is already logged in (token exists), initialize immediately.
    if (localStorage.getItem('authToken')) {
        initializeAdminPanel();
    }
});