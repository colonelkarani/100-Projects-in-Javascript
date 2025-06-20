        // Page loader
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.getElementById('loader').classList.add('hidden');
            }, 1000);
        });

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            body.setAttribute('data-theme', newTheme);
            themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
            
            localStorage.setItem('theme', newTheme);
        });

        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'dark';
        body.setAttribute('data-theme', savedTheme);
        themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const postsGrid = document.getElementById('postsGrid');
        const posts = document.querySelectorAll('.post-card');

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            posts.forEach(post => {
                const title = post.querySelector('.post-title').textContent.toLowerCase();
                const excerpt = post.querySelector('.post-excerpt').textContent.toLowerCase();
                const tags = post.getAttribute('data-tags').toLowerCase();
                
                if (title.includes(searchTerm) || excerpt.includes(searchTerm) || tags.includes(searchTerm)) {
                    post.style.display = 'block';
                } else {
                    post.style.display = 'none';
                }
            });
        });

        // Tag filtering
        const tagFilters = document.querySelectorAll('.tag-filter');
        
        tagFilters.forEach(filter => {
            filter.addEventListener('click', () => {
                tagFilters.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');
                
                const selectedTag = filter.getAttribute('data-tag');
                
                posts.forEach(post => {
                    const postTags = post.getAttribute('data-tags');
                    
                    if (selectedTag === 'all' || postTags.includes(selectedTag)) {
                        post.style.display = 'block';
                    } else {
                        post.style.display = 'none';
                    }
                });
            });
        });

        // Newsletter form
        document.querySelector('.newsletter-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('.newsletter-input').value;
            alert(`Thank you for subscribing with ${email}!`);
            e.target.reset();
        });

        // Contact form
        document.querySelector('.contact-form').addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! I\'ll get back to you soon.');
            e.target.reset();
        });

        // Support modal
        const supportBtn = document.getElementById('supportBtn');
        const supportModal = document.getElementById('supportModal');
        
        supportBtn.addEventListener('click', () => {
            supportModal.classList.add('active');
        });

        function closeModal() {
            supportModal.classList.remove('active');
        }

        supportModal.addEventListener('click', (e) => {
            if (e.target === supportModal) {
                closeModal();
            }
        });

        // Back to top button
        const backToTop = document.getElementById('backToTop');
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Social sharing
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const icon = btn.querySelector('i');
                const postCard = btn.closest('.post-card');
                const postTitle = postCard.querySelector('.post-title').textContent;
                const postUrl = window.location.href;
                
                if (icon.classList.contains('fa-twitter')) {
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(postUrl)}`, '_blank');
                } else if (icon.classList.contains('fa-whatsapp')) {
                    window.open(`https://wa.me/?text=${encodeURIComponent(postTitle + ' ' + postUrl)}`, '_blank');
                } else if (icon.classList.contains('fa-link')) {
                    navigator.clipboard.writeText(postUrl).then(() => {
                        btn.innerHTML = '<i class="fas fa-check"></i>';
                        setTimeout(() => {
                            btn.innerHTML = '<i class="fas fa-link"></i>';
                        }, 2000);
                    });
                }
            });
        });

        // E-commerce functionality
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', () => {
                const productCard = btn.closest('.product-card');
                const productName = productCard.querySelector('h4').textContent;
                btn.textContent = 'Added!';
                btn.style.background = '#28a745';
                setTimeout(() => {
                    btn.textContent = 'Add to Cart';
                    btn.style.background = '';
                }, 2000);
            });
        });

        // Portfolio item interactions
        document.querySelectorAll('.portfolio-item').forEach(item => {
            item.addEventListener('click', () => {
                const title = item.querySelector('h4').textContent;
                alert(`Opening ${title} project details...`);
            });
        });

        // Comment system (local storage)
        let comments = JSON.parse(localStorage.getItem('blogComments')) || [];

        function addComment() {
            const commentInput = document.getElementById('commentInput');
            const commentText = commentInput.value.trim();
            
            if (commentText) {
                const comment = {
                    id: Date.now(),
                    text: commentText,
                    date: new Date().toLocaleDateString()
                };
                
                comments.unshift(comment);
                localStorage.setItem('blogComments', JSON.stringify(comments));
                commentInput.value = '';
                displayComments();
            }
        }

        function displayComments() {
            const commentsList = document.getElementById('commentsList');
            commentsList.innerHTML = comments.map(comment => `
                <div style="background: var(--card-bg); padding: 1rem; border-radius: 8px; margin-top: 1rem; border-left: 3px solid var(--accent-color);">
                    <p style="margin-bottom: 0.5rem;">${comment.text}</p>
                    <small style="color: var(--text-secondary);">${comment.date}</small>
                </div>
            `).join('');
        }

        // Load comments on page load
        displayComments();

        // Enter key for comment submission
        document.getElementById('commentInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                addComment();
            }
        });

        // Smooth scrolling for internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });