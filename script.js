        const PERSONAS = {
            "maria": {
                nombre: "María",
                mensaje: "Gracias por tu increíble dedicación. ¡Que estas fiestas estén llenas de risas y momentos inolvidables!"
            },
            "jose": {
                nombre: "José",
                mensaje: "Eres una pieza fundamental del equipo. Disfruta de un merecido descanso con los tuyos."
            },
            "ana": {
                nombre: "Ana",
                mensaje: "Tu talento nos inspira cada día. ¡Espero que el 2026 te traiga todo lo que sueñas!"
            }
        };

        const MENSAJE_GENERICO = {
            nombre: "Compañeros",
            mensaje: "Es un honor compartir camino con personas tan maravillosas. Que la magia de la Navidad ilumine sus hogares."
        };

        function cargarMensajePersonalizado() {
            // Limpia la ruta para obtener solo el nombre
            let path = window.location.pathname.replace(/^\/|\/$/g, '').toLowerCase();
            path = path.split('/').pop();

console.log("Path calculado:", path);

    const data = PERSONAS[path] || MENSAJE_GENERICO;
    console.log("Data seleccionada:", data);

            document.getElementById('card-title').textContent = `¡Feliz Navidad, ${data.nombre}!`;
            document.getElementById('card-content').innerHTML = `
                <p>Estimado/a ${data.nombre},</p>
                <p>${data.mensaje}</p>
                <p>Brindemos por un año lleno de éxitos y nuevas aventuras juntos.</p>
            `;
        }


        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        let isMusicActive = false;
        let melodyTimeout = null;

        const JINGLE_BELLS = [
            { n: "E4", d: 4 }, { n: "E4", d: 4 }, { n: "E4", d: 2 },
            { n: "E4", d: 4 }, { n: "E4", d: 4 }, { n: "E4", d: 2 },
            { n: "E4", d: 4 }, { n: "G4", d: 4 }, { n: "C4", d: 3 }, { n: "D4", d: 8 }, { n: "E4", d: 1 },
            { n: "F4", d: 4 }, { n: "F4", d: 4 }, { n: "F4", d: 3 }, { n: "F4", d: 8 },
            { n: "F4", d: 4 }, { n: "E4", d: 4 }, { n: "E4", d: 4 }, { n: "E4", d: 8 }, { n: "E4", d: 8 },
            { n: "E4", d: 4 }, { n: "D4", d: 4 }, { n: "D4", d: 4 }, { n: "E4", d: 4 }, { n: "D4", d: 2 }, { n: "G4", d: 2 }];

        const frequencies = { "C4": 261.63, "D4": 293.66, "E4": 329.63, "F4": 349.23, "G4": 392.00 };

        function playNote(freq, dur) {
            if (!isMusicActive) return;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = "triangle";
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(); osc.stop(audioCtx.currentTime + dur);
        }

        function playMelody(idx = 0) {
            if (!isMusicActive) return;
            const note = JINGLE_BELLS[idx % JINGLE_BELLS.length];
            const dur = 1.0 / note.d;
            playNote(frequencies[note.n], dur);
            melodyTimeout = setTimeout(() => playMelody(idx + 1), dur * 1000 * 1.2);
        }

        function startAudio() {
            if (audioCtx.state === 'suspended') audioCtx.resume();
            if (!isMusicActive) {
                isMusicActive = true; 
                document.getElementById('music-on-icon').classList.remove('hidden');
                document.getElementById('music-off-icon').classList.add('hidden');
                playMelody();
            }
        }

        const musicBtn = document.getElementById('music-control');
        const unlockBtn = document.getElementById('unlock-button');
        const unlocker = document.getElementById('audio-unlocker');
        const envelopeWrapper = document.getElementById('envelope-wrapper');

        unlockBtn.addEventListener('click', () => {
            startAudio();
            unlocker.style.opacity = '0';
            setTimeout(() => { unlocker.remove(); envelopeWrapper.classList.add('visible'); }, 800);
        });

        envelopeWrapper.addEventListener('click', () => {
            const isOpen = envelopeWrapper.classList.toggle('open');
            if (isOpen) {
                document.body.classList.add('allow-scroll');
            } else {
                document.body.classList.remove('allow-scroll');
                window.scrollTo({top: 0, behavior: 'smooth'});
            }
            if (!isMusicActive) startAudio();
        });

        musicBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            isMusicActive = !isMusicActive;
            document.getElementById('music-on-icon').classList.toggle('hidden');
            document.getElementById('music-off-icon').classList.toggle('hidden');
            if (isMusicActive) playMelody(); else clearTimeout(melodyTimeout);
        });

        function createPines() {
            const forest = document.getElementById('pine-forest');
            const positions = [35, 55, 75, 90]; 
            positions.forEach(pos => {
                const scale = 0.6 + Math.random() * 0.4;
                const tree = document.createElement('div');
                tree.className = 'pine-tree';
                tree.style.left = pos + '%';
                tree.style.transform = `scale(${scale})`;
                tree.innerHTML = `<svg width="100%" height="100%" viewBox="0 0 100 150" preserveAspectRatio="none"><polygon points="50,10 10,130 90,130" fill="var(--pine-green)" /><rect x="45" y="130" width="10" height="20" fill="#3e2723" /></svg>`;
                
                for(let i=0; i<10; i++) {
                    const orn = document.createElement('div');
                    orn.className = 'ornament';
                    const y = 20 + Math.random() * 60;
                    const progress = (y - 10) / 120;
                    const x = 50 + (Math.random() - 0.5) * 2 * (progress * 40 * 0.85);
                    orn.style.left = x + '%'; orn.style.top = y + '%';
                    const colors = ['#ff4d4d', '#4dff88', '#ffd11a', '#ffffff'];
                    orn.style.backgroundColor = colors[Math.floor(Math.random()*colors.length)];
                    tree.appendChild(orn);
                }
                forest.appendChild(tree);
            });
        }

        function createLEDs() {
            const string = document.getElementById('led-string');
            const colors = ['#ff0000', '#00ff00', '#ffff00', '#0000ff', '#ffffff'];
            for(let i=0; i<20; i++) {
                const led = document.createElement('div');
                led.className = 'led';
                led.style.backgroundColor = colors[i % colors.length];
                led.style.color = colors[i % colors.length];
                led.style.animationDelay = Math.random() + 's';
                string.appendChild(led);
            }
        }

        function createSnow() {
            for (let i = 0; i < 40; i++) {
                const flake = document.createElement('div');
                flake.className = 'snowflake';
                flake.innerHTML = '❄';
                flake.style.left = Math.random() * 100 + 'vw';
                flake.style.fontSize = (Math.random() * 10 + 10) + 'px';
                flake.style.animation = `fall ${Math.random() * 5 + 5}s linear infinite`;
                flake.style.animationDelay = Math.random() * 5 + 's';
                document.body.appendChild(flake);
            }
        }

        window.onload = () => { createPines(); createLEDs(); createSnow(); cargarMensajePersonalizado(); };