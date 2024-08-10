document.addEventListener('DOMContentLoaded', () => {
    const createButton = document.getElementById('createButton');
    const resetButton = document.getElementById('resetButton');
    const modal = document.getElementById('modal');
    const resetModal = document.getElementById('resetModal');
    const closeButton = document.querySelector('.close-button');
    const closeResetButton = document.querySelector('.close-reset-button');
    const dataForm = document.getElementById('dataForm');
    const dataList = document.getElementById('dataList');
    const resetAllFalseButton = document.getElementById('resetAllFalseButton');
    const clearTasksButton = document.getElementById('clearTasksButton');
    const confettiCanvas = document.getElementById('confettiCanvas');
    const ctx = confettiCanvas.getContext('2d');

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

    createButton.addEventListener('click', () => {
        modal.style.display = 'block';
        setTimeout(() => {
            modal.style.opacity = '1';
            document.querySelector('#modal .modal-content').classList.add('show');
        }, 0);
    });

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

    const closeModal = (modalElement) => {
        modalElement.style.opacity = '0';
        modalElement.querySelector('.modal-content').classList.remove('show');
        setTimeout(() => {
            modalElement.style.display = 'none';
        }, 300);
    };

    dataForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = document.getElementById('title').value;

        const storedData = JSON.parse(sessionStorage.getItem('data')) || [];
        storedData.push({ title, done: 'false' });
        sessionStorage.setItem('data', JSON.stringify(storedData));

        loadData();
        closeModal(modal);
        dataForm.reset();
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
        loadData();
        closeModal(resetModal);
    });

    loadData();
});
