
        // Matrix Rain Effect
        (function() {
            const canvas = document.getElementById('matrix');
            const ctx = canvas.getContext('2d', { alpha: true });
            
            function resize() {
                const dpr = window.devicePixelRatio || 1;
                canvas.width = Math.floor(window.innerWidth * dpr);
                canvas.height = Math.floor(window.innerHeight * dpr);
                canvas.style.width = window.innerWidth + 'px';
                canvas.style.height = window.innerHeight + 'px';
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            }
            
            window.addEventListener('resize', resize);
            resize();
            
            const characters = 'アァカサタナハマヤャラワン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const charArr = characters.split('');
            const fontSize = Math.max(12, Math.floor(window.innerWidth / 100));
            const columns = Math.floor(window.innerWidth / fontSize);
            const drops = Array.from({ length: columns }).map(() => Math.random() * -50);
            
            ctx.font = `${fontSize}px JetBrains Mono`;
            ctx.fillStyle = '#16a34a';
            
            let running = true;
            let animationId;
            
            function draw() {
                if (!running) return;
                
                ctx.fillStyle = 'rgba(15, 23, 42, 0.03)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                for (let i = 0; i < drops.length; i++) {
                    const x = i * fontSize;
                    const y = drops[i] * fontSize;
                    
                    const gradient = ctx.createLinearGradient(x, y, x, y + fontSize * 2);
                    gradient.addColorStop(0, '#22c55e');
                    gradient.addColorStop(0.5, '#0d9488');
                    gradient.addColorStop(1, '#0891b2');
                    ctx.fillStyle = gradient;
                    
                    const text = charArr[Math.floor(Math.random() * charArr.length)];
                    ctx.fillText(text, x, y);
                    
                    if (y > window.innerHeight + Math.random() * 1000) {
                        drops[i] = Math.random() * -50;
                    } else {
                        drops[i] += Math.random() * 0.6 + 0.4;
                    }
                }
                
                animationId = requestAnimationFrame(draw);
            }
            
            // Start animation
            animationId = requestAnimationFrame(draw);
            
            // Stop after 4 seconds with fade effect
            setTimeout(() => {
                canvas.style.transition = 'opacity 1s ease-in-out';
                canvas.style.opacity = '0.3';
            }, 4000);
            
        })();
        
        // Add hover effects to cards
        document.querySelectorAll('.cyber-border').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    