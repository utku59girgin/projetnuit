document.addEventListener('DOMContentLoaded', () => {
    
    const modal = document.getElementById("quiz-modal");
    const openBtn = document.getElementById("open-quiz-btn");
    const closeSpan = document.querySelector(".close-modal");
    const closeFinalBtn = document.getElementById("close-btn-final");

    openBtn.onclick = function() {
        modal.style.display = "flex";
        resetGame();
    }

    closeSpan.onclick = function() {
        modal.style.display = "none";
    }

    closeFinalBtn.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    
    const questions = [
        {
            question: "Ton école doit renouveler ses ordinateurs. Que proposes-tu ?",
            answers: [
                { text: "On rachète tout en neuf chez le même fournisseur.", correct: false },
                { text: "On passe aux tablettes, c'est plus moderne.", correct: false },
                { text: "On installe Linux sur les vieux PC pour les prolonger.", correct: true }
            ]
        },
        {
            question: "Tu veux naviguer sur Internet. Que choisis-tu ?",
            answers: [
                { text: "Google Chrome, c'est le plus utilisé.", correct: false },
                { text: "Mozilla Firefox, pour la vie privée et la liberté.", correct: true },
                { text: "Internet Explorer, c'est déjà installé.", correct: false }
            ]
        },
        {
            question: "Tu dois envoyer un gros fichier à un ami. Que fais-tu ?",
            answers: [
                { text: "Je l'envoie par email, peu importe la taille.", correct: false },
                { text: "Je le mets sur une clé USB et je le lui donne en main propre.", correct: false },
                { text: "J'utilise un service de partage de fichiers libre comme Nextcloud.", correct: true },
                { text: "J'appelle ma mère pour qu'elle m'aide.", correct: false }
            ]
        },
        {
            question: "Tu veux protéger tes données personnelles. Que fais-tu ?",
            answers: [
                { text: "Je n'utilise pas de mot de passe, c'est trop compliqué.", correct: false },
                { text: "Je note mes mots de passe sur un post-it.", correct: false },
                { text: "J'utilise un gestionnaire de mots de passe libre comme Apple Passwords.", correct: true }
            ]
        },
        {
            question: "Facebook te propose de télécharger tes données. Que fais-tu ?",
            answers: [
                { text: "Je télécharge tout et je le publie en ligne.", correct: false },
                { text: "Je télécharge mes données et je les analyse avec des outils libres.", correct: true },
                { text: "Je ne fais rien, ça ne m'intéresse pas.", correct: false }
            ]
        },
        {
            question: "Une application te demande des permissions excessives. Que fais-tu ?",
            answers: [
                { text: "Je les accepte, sinon l'application ne marche pas.", correct: false },
                { text: "Je cherche une alternative libre qui respecte ma vie privée.", correct: true },
                { text: "Je désinstalle l'application et j'abandonne.", correct: false }
            ]
        },
        {
            question: "Un fichier '.docx' ne s'ouvre pas. Que fais-tu ?",
            answers: [
                { text: "J'achète une licence Office à 150€.", correct: false },
                { text: "J'utilise LibreOffice, c'est gratuit et compatible.", correct: true },
                { text: "Je panique et j'appelle le support technique.", correct: false }
            ]
        },
        {
            question: "Pourquoi choisir le Logiciel Libre ?",
            answers: [
                { text: "C'est gratuit, c'est la seule raison.", correct: false },
                { text: "Pour l'indépendance, la transparence et le partage.", correct: true },
                { text: "Parce que c'est obligatoire.", correct: false }
            ]
        }
    ];

    const startScreen = document.getElementById('quiz-start');
    const gameScreen = document.getElementById('quiz-game');
    const resultScreen = document.getElementById('quiz-result');
    
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const questionText = document.getElementById('question-text');
    const answerButtons = document.getElementById('answer-buttons');
    const progressBar = document.getElementById('progress');
    const scoreSpan = document.getElementById('score');
    const conseilText = document.getElementById('conseil-text');
    const restartBtn = document.getElementById('restart-btn');

    let currentQuestionIndex, score;

    startQuizBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);

    function resetGame() {
        startScreen.classList.remove('hide');
        gameScreen.classList.add('hide');
        resultScreen.classList.add('hide');
    }

    function startGame() {
        startScreen.classList.add('hide');
        resultScreen.classList.add('hide');
        gameScreen.classList.remove('hide');
        currentQuestionIndex = 0;
        score = 0;
        setNextQuestion();
    }

    function setNextQuestion() {
        resetState();
        showQuestion(questions[currentQuestionIndex]);
        const progress = ((currentQuestionIndex) / questions.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    function showQuestion(question) {
        questionText.innerText = question.question;
        question.answers.forEach(answer => {
            const button = document.createElement('button');
            button.innerText = answer.text;
            button.classList.add('btn', 'btn-outline');
            if (answer.correct) {
                button.dataset.correct = answer.correct;
            }
            button.addEventListener('click', selectAnswer);
            answerButtons.appendChild(button);
        });
    }

    function resetState() {
        while (answerButtons.firstChild) {
            answerButtons.removeChild(answerButtons.firstChild);
        }
    }

    function selectAnswer(e) {
        const selectedButton = e.target;
        const correct = selectedButton.dataset.correct === "true";
        
        if (correct) {
            score++;
            selectedButton.style.backgroundColor = "#10b981";
            selectedButton.style.color = "white";
        } else {
            selectedButton.style.backgroundColor = "#ef4444";
            selectedButton.style.color = "white";
        }

        Array.from(answerButtons.children).forEach(button => {
            button.disabled = true;

            if (button.dataset.correct === "true") {
                button.style.backgroundColor = "#10b981";
                button.style.color = "white";
            }
        });

        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                setNextQuestion();
            } else {
                showResults();
            }
        }, 800);
    }

    function showResults() {
        gameScreen.classList.add('hide');
        resultScreen.classList.remove('hide');
        
        scoreSpan.innerText = `${score} / ${questions.length}`;

        if (score === questions.length) {
            conseilText.innerText = "Excellent ! Tu es prêt à mener la résistance numérique.";
        } else if (score >= 0 && score < 4) {
            conseilText.innerText = "Oups ! Goliath te tient encore. Commence par installer Firefox aujourd'hui.";
        } else if (score >= 4 && score <=6) {
            conseilText.innerText = "Pas mal ! Tu commences à comprendre les enjeux du logiciel libre.";
        }  
        else {
            conseilText.innerText = "T'es un vrai crack champion!!";
        }
    }

});


/* ========== MODULE FUN ALIEN + GAME ==========
===============================================*/

// 1) Mini Alien qui traverse l'écran une fois
function spawnAlien() {
  const alien = document.createElement("div");
  alien.textContent = "👽";
  alien.style.position = "fixed";
  alien.style.left = "-50px";
  alien.style.top = Math.random() * 60 + "%";
  alien.style.fontSize = "40px";
  alien.style.transition = "left 4s linear";
  alien.style.zIndex = "9999";

  document.body.appendChild(alien);

  setTimeout(() => alien.style.left = "110%");

  // suppression après passage
  setTimeout(() => alien.remove(), 5000);
}

// apparaît une seule fois, 3 sec après arrivée sur la page
setTimeout(spawnAlien, 3000);


// 2) Mot-clé secret : si l'utilisateur écrit "alien", "ovni", "ufo"
const cosmicWords = ["alien", "ovni", "ufo", "extraterrestre"];

document.getElementById("message").addEventListener("input", (e) => {
  const val = e.target.value.toLowerCase();
  if (cosmicWords.some(w => val.includes(w))) {
    showAlienHint();
  }
});

function showAlienHint() {
  const hint = document.createElement("div");
  hint.textContent = "🛸 Message détecté… Transmission intergalactique en cours.";
  hint.style.position = "fixed";
  hint.style.bottom = "20px";
  hint.style.right = "20px";
  hint.style.padding = "10px 15px";
  hint.style.background = "rgba(0,255,170,0.25)";
  hint.style.border = "1px solid #0fa";
  hint.style.borderRadius = "8px";
  hint.style.backdropFilter = "blur(4px)";
  hint.style.zIndex = "9999";
  hint.style.animation = "fadeInOut 4s ease";

  document.body.appendChild(hint);
  setTimeout(() => hint.remove(), 4000);
}


// 3) Effet arcade si on tape ↑ ↑ ↓ ↓ ← → ← → B A
const konami = [];
const secret = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];

window.addEventListener("keydown", (e) => {
  konami.push(e.key);
  if (konami.join("").includes(secret.join(""))) {
    activateArcadeMode();
  }
  if (konami.length > secret.length) konami.shift();
});

function activateArcadeMode() {
  document.body.style.transition = "0.4s";
  document.body.style.filter = "hue-rotate(120deg)";
  document.body.style.background = "#001f2e url('https://i.gifer.com/7VE.gif') repeat";
  alert("👾 MODE ARCADE ALIEN ACTIVÉ !");
}


// 4) bruit de scan au clic sur “Envoyer”
document.getElementById("sendBtn").addEventListener("click", () => {
  const audio = new Audio("https://cdn.pixabay.com/download/audio/2021/08/04/audio_7e01ef2f85.mp3?filename=scan-90697.mp3");
  audio.volume = 0.4;
  audio.play();
});
