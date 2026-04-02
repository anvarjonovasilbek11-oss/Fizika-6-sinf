// --- STARFIELD CANVAS ---
const canvas = document.getElementById('stars-canvas');
const ctx = canvas.getContext('2d');
let stars = [];

function initStars() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = [];
    for (let i = 0; i < 200; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.5,
            speed: Math.random() * 0.5 + 0.1,
            opacity: Math.random()
        });
    }
}

function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => {
        star.y -= star.speed;
        if (star.y < 0) star.y = canvas.height;
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });
    requestAnimationFrame(animateStars);
}

window.addEventListener('resize', initStars);
initStars();
animateStars();

// --- REVEAL ON SCROLL ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// --- QUIZ DATA ---
const questions = [
    {
        q: "Tezlik qaysi harf bilan belgilanadi?",
        options: ["F", "v", "m", "P"],
        answer: 1,
        exp: "Tezlik (velocity) lotincha 'velocitas' so'zidan olingan va 'v' harfi bilan belgilanadi."
    },
    {
        q: "Bosimning o'lchov birligi nima?",
        options: ["Paskal", "Nyuton", "Metr", "Joul"],
        answer: 0,
        exp: "Bosim birligi buyuk olim Blez Paskal sharafiga 'Paskal' (Pa) deb ataladi."
    },
    {
        q: "Zichlik formulasi qanday?",
        options: ["P = F/S", "v = s/t", "ρ = m/V", "A = F·s"],
        answer: 2,
        exp: "Zichlik — moddaning hajm birligidaga massasi. ρ = m/V."
    }
];

let currentQuestion = 0;
let score = 0;

function renderQuiz() {
    const quizContent = document.getElementById('quiz-content');
    const q = questions[currentQuestion];
    
    document.getElementById('progress-bar').style.width = `${((currentQuestion) / questions.length) * 100}%`;

    quizContent.innerHTML = `
        <div class="question">${currentQuestion + 1}. ${q.q}</div>
        <div class="options">
            ${q.options.map((opt, i) => `<button class="option-btn" onclick="checkAnswer(${i})">${opt}</button>`).join('')}
        </div>
    `;
}

function checkAnswer(index) {
    const q = questions[currentQuestion];
    const buttons = document.querySelectorAll('.option-btn');
    
    if (index === q.answer) {
        buttons[index].classList.add('correct');
        score++;
    } else {
        buttons[index].classList.add('wrong');
        buttons[q.answer].classList.add('correct');
    }

    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            renderQuiz();
        } else {
            showResult();
        }
    }, 1500);
}

function showResult() {
    const quizContent = document.getElementById('quiz-content');
    document.getElementById('progress-bar').style.width = `100%`;
    
    quizContent.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🏆</div>
            <h2>Natijangiz: ${score} / ${questions.length}</h2>
            <p style="margin: 1.5rem 0; color: #94a3b8;">Siz fizikani o'rganishda juda yaxshi ketyapsiz!</p>
            <button class="btn btn-primary" onclick="restartQuiz()">Qayta Boshlash</button>
        </div>
    `;
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    renderQuiz();
}

renderQuiz();

// --- MODAL SYSTEM ---
const modalOverlay = document.getElementById('modal-overlay');
const modalBody = document.getElementById('modal-body');

const topicData = {
    jism: {
        title: "Jism va Materiya",
        content: `
            <p>Bizni o'rab turgan barcha narsalar materiyadir. Fizik jismlar esa materiyadan tashkil topgan aniq shaklga ega narsalardir.</p>
            <br>
            <ul>
                <li><strong>Modda:</strong> Jismlar nimadan tuzilgani (suv, temir, havo).</li>
                <li><strong>Materiya:</strong> Olamda mavjud bo'lgan barcha narsaning umumiy nomi.</li>
            </ul>
        `
    },
    harakat: {
        title: "Mexanik Harakat",
        content: `
            <p>Harakat — bu jismning vaqt o'tishi bilan boshqa jismlarga nisbatan vaziyatining o'zgarishi.</p>
            <br>
            <p>Asosiy kattaliklar:</p>
            <ul>
                <li><strong>Yo'l (s):</strong> Trayektoriya uzunligi.</li>
                <li><strong>Tezlik (v):</strong> Vaqt birligi ichida bosib o'tilgan yo'l.</li>
            </ul>
        `
    },
    kuch: {
        title: "Kuch va Gravitatsiya",
        content: `
            <p>Kuch — jismlarning bir-biriga ta'sirini ifodalovchi kattalik. Nyuton (N) birligida o'lchanadi.</p>
            <br>
            <p>Asosiy kuch turlari:</p>
            <ul>
                <li><strong>Og'irlik kuchi:</strong> Yerning tortish kuchi.</li>
                <li><strong>Elasticlik kuchi:</strong> Shakl o'zgarganda paydo bo'ladi.</li>
            </ul>
        `
    }
};

function openTopic(id) {
    const data = topicData[id];
    modalBody.innerHTML = `<h2 style="font-size: 2.5rem; margin-bottom: 2rem;">${data.title}</h2>${data.content}`;
    modalOverlay.style.display = 'flex';
}

document.getElementById('close-modal').onclick = () => {
    modalOverlay.style.display = 'none';
};

window.onclick = (e) => {
    if (e.target === modalOverlay) modalOverlay.style.display = 'none';
};
