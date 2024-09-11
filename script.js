document.addEventListener('DOMContentLoaded', () => {
    const createButton = document.getElementById('createButton');
    const resetButton = document.getElementById('resetButton');
    const modal = document.getElementById('modal');
    const resetModal = document.getElementById('resetModal');
    const closeButton = document.querySelector('.close-button');
    const closeResetButton = document.querySelector('.close-reset-button');
    const dataList = document.getElementById('dataList');
    const taskList = document.getElementById('taskList');
    const resetAllFalseButton = document.getElementById('resetAllFalseButton');
    const clearTasksButton = document.getElementById('clearTasksButton');
    const addTemplateButton = document.getElementById('addTemplateButton');
    const newTaskButton = document.getElementById('newTaskButton');
    const confettiCanvas = document.getElementById('confettiCanvas');
    const ctx = confettiCanvas.getContext('2d');

    const EXPIRED_TIME = 1.4 * 60 * 60 * 1000;

    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    const confettiPieces = [];
    const confettiColors = ['#f44336', '#4CAF50', '#FFEB3B', '#03A9F4', '#FF9800'];

    class ConfettiPiece {
        constructor(x, y, size, color) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.color = color;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 + 2;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 10 - 5;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            ctx.restore();
        }
    }

    const createConfetti = () => {
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * confettiCanvas.width;
            const y = Math.random() * -confettiCanvas.height;
            const size = Math.random() * 10 + 5;
            const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            confettiPieces.push(new ConfettiPiece(x, y, size, color));
        }
    };

    const updateConfetti = () => {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        for (const piece of confettiPieces) {
            piece.update();
            piece.draw();
        }
        requestAnimationFrame(updateConfetti);
    };

    const loadData = () => {
        const storedData = JSON.parse(sessionStorage.getItem('data')) || [];
        dataList.innerHTML = storedData.map((item, index) => `
            <div class="data-item">
                <input type="checkbox" id="checkbox-${index}" ${item.done === 'true' ? 'checked' : ''}>
                <label for="checkbox-${index}">${item.title}</label>
            </div>
        `).join('');

        storedData.forEach((_, index) => {
            const checkbox = document.getElementById(`checkbox-${index}`);
            checkbox.addEventListener('change', (event) => {
                toggleDoneStatus(index, event.target.checked);
                if (isAllTasksDone()) {
                    createConfetti();
                    updateConfetti();
                }
            });
        });
    };

    const showModal = () => {
        const storedData = JSON.parse(sessionStorage.getItem('data')) || [];
        taskList.innerHTML = storedData.map((item, index) => `
            <li class="task-item">
                <input type="text" value="${item.title}" data-index="${index}">
                <span class="trash-icon" data-index="${index}">🗑️</span>
            </li>
        `).join('');

        document.querySelectorAll('.task-item input').forEach(input => {
            input.addEventListener('blur', (event) => {
                const index = event.target.getAttribute('data-index');
                updateTaskTitle(index, event.target.value);
            });
        });

        document.querySelectorAll('.trash-icon').forEach(icon => {
            icon.addEventListener('click', (event) => {
                const index = event.target.getAttribute('data-index');
                deleteTask(index);
            });
        });

        modal.style.display = 'block';
        setTimeout(() => {
            modal.style.opacity = '1';
            document.querySelector('#modal .modal-content').classList.add('show');
        }, 0);
    };

    const toggleDoneStatus = (index, isChecked) => {
        const storedData = JSON.parse(sessionStorage.getItem('data')) || [];
        storedData[index].done = isChecked.toString();
        sessionStorage.setItem('data', JSON.stringify(storedData));
        loadData();
    };

    const isAllTasksDone = () => {
        const storedData = JSON.parse(sessionStorage.getItem('data')) || [];
        return storedData.every(item => item.done === 'true');
    };

    const updateTaskTitle = (index, title) => {
        const storedData = JSON.parse(sessionStorage.getItem('data')) || [];
        storedData[index].title = title;
        sessionStorage.setItem('data', JSON.stringify(storedData));
        loadData();
    };

    const deleteTask = (index) => {
        let storedData = JSON.parse(sessionStorage.getItem('data')) || [];
        storedData.splice(index, 1);
        sessionStorage.setItem('data', JSON.stringify(storedData));
        loadData();
        showModal();
    };

    const closeModal = (modalElement) => {
        modalElement.style.opacity = '0';
        modalElement.querySelector('.modal-content').classList.remove('show');
        setTimeout(() => {
            modalElement.style.display = 'none';
        }, 300);
    };

    const addTemplateTasks = () => {
        const templateTasks = [
            { title: 'Ruman LAB.SLC', done: 'false' },
            { title: 'Messier', done: 'false' },
            { title: 'Scan Barcode PC', done: 'false' },
            { title: 'Zoom', done: 'false' },
            { title: 'Course-Outline', done: 'false' },
            { title: 'Absen Kehadiran Binusmaya', done: 'false' },
            { title: 'Session Log', done: 'false' },
            { title: 'Centang Course Outline Messier', done: 'false' },
            { title: 'Verifikasi Mahasiswa', done: 'false' },
            { title: 'Ruman Clear D, Restart', done: 'false' },
            { title: 'Hapus file pc tutor', done: 'false' },
            { title: 'Crosscheck barang', done: 'false' },
        ];
        const storedData = JSON.parse(sessionStorage.getItem('data')) || [];
        const newData = storedData.concat(templateTasks);
        sessionStorage.setItem('data', JSON.stringify(newData));
        loadData();
        showModal();
    };

    const addNewTask = () => {
        const storedData = JSON.parse(sessionStorage.getItem('data')) || [];
        storedData.push({ title: '', done: 'false' });
        sessionStorage.setItem('data', JSON.stringify(storedData));
        loadData();
        showModal();
    };

    const setSessionExpiration = () => {
        const expirationTime = new Date().getTime() + EXPIRED_TIME;
        sessionStorage.setItem('expiration', expirationTime);
    };

    const checkSessionExpiration = () => {
        const expirationTime = sessionStorage.getItem('expiration');
        if (expirationTime && new Date().getTime() > expirationTime) {
            sessionStorage.removeItem('data');
            sessionStorage.removeItem('expiration');
        }
    };

    createButton.addEventListener('click', showModal);

    resetButton.addEventListener('click', () => {
        resetModal.style.display = 'block';
        setTimeout(() => {
            resetModal.style.opacity = '1';
            document.querySelector('#resetModal .modal-content').classList.add('show');
        }, 0);
    });

    closeButton.addEventListener('click', () => {
        closeModal(modal);
    });

    closeResetButton.addEventListener('click', () => {
        closeModal(resetModal);
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal(modal);
        }
        if (event.target === resetModal) {
            closeModal(resetModal);
        }
    });

    resetAllFalseButton.addEventListener('click', () => {
        const storedData = JSON.parse(sessionStorage.getItem('data')) || [];
        const resetData = storedData.map(item => ({ ...item, done: 'false' }));
        sessionStorage.setItem('data', JSON.stringify(resetData));
        loadData();
        closeModal(resetModal);
    });

    clearTasksButton.addEventListener('click', () => {
        sessionStorage.removeItem('data');
        sessionStorage.removeItem('expiration');
        loadData();
        closeModal(resetModal);
    });

    addTemplateButton.addEventListener('click', addTemplateTasks);
    newTaskButton.addEventListener('click', addNewTask);

    checkSessionExpiration();
    setSessionExpiration();
    loadData();
});
