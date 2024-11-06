// script.js

let score = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;
let currentExpression = "";
let correctAnswer = 0;
let startTime = 0; // Variable para guardar el tiempo de inicio
let gameRunning = false; // Para controlar si el juego está en ejecución
let operationsHistory = []; // Array para guardar las operaciones realizadas

// Función para detectar si estamos en un dispositivo móvil
function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
}

// Mostrar el botón de "Enviar Resultado" solo si estamos en un dispositivo móvil
function toggleMobileSubmitButton() {
    if (isMobile()) {
        document.getElementById("submitMobileButton").style.display = "inline-block";
    } else {
        document.getElementById("submitMobileButton").style.display = "none";
    }
}

// Función para generar una expresión aleatoria combinada
function generateExpression() {
    const operations = ["+", "-"];
    let expressionParts = [];
    let numCount = Math.floor(Math.random() * 4) + 2; // Genera entre 2 y 5 números
    let result = 0;

    // Probamos varias combinaciones hasta obtener un resultado válido
    do {
        expressionParts = [];
        // Generamos el primer número (puede ser de uno o dos dígitos)
        let firstNumber = Math.floor(Math.random() * 90) + 1; // Genera un número entre 1 y 99
        expressionParts.push(firstNumber);

        // Generamos entre 1 y 4 números adicionales y agregamos operaciones
        for (let i = 0; i < numCount - 1; i++) {
            let operation = operations[Math.floor(Math.random() * operations.length)];
            let nextNumber = Math.floor(Math.random() * 90) + 1; // Generamos números entre 1 y 99
            expressionParts.push(operation, nextNumber);
        }

        // Creamos la expresión y calculamos el resultado
        currentExpression = expressionParts.join(" ");
        result = eval(currentExpression);

        // Aseguramos que el resultado esté entre 0 y 1000 y sea un número entero
        if (result >= 0 && result < 1000 && Number.isInteger(result)) {
            break;
        }
    } while (true);

    correctAnswer = result; // Asignamos el resultado correcto de la expresión
}

// Función para mostrar la expresión generada y preparar la entrada de respuesta
function showExpression() {
    generateExpression();
    document.getElementById("question").innerText = `¿Cuánto es ${currentExpression}?`;
    document.getElementById("answer").value = '';
    document.getElementById("answer").focus();

    // Capturamos el tiempo al momento de mostrar la pregunta
    startTime = Date.now();
}

// Función para verificar la respuesta del usuario
function checkAnswer() {
    const userAnswer = parseInt(document.getElementById("answer").value, 10); // Convertir la respuesta a entero

    // Calculamos el tiempo que tardó el usuario en responder
    const timeTaken = (Date.now() - startTime) / 1000; // Convertir de milisegundos a segundos

    // Compara la respuesta del usuario con el resultado correcto
    let isCorrect = false;
    if (userAnswer === correctAnswer) {
        alert(`¡Correcto! Respondiste en ${timeTaken.toFixed(2)} segundos.`);
        score++;
        correctAnswers++;
        isCorrect = true;
    } else {
        alert(`Incorrecto. La respuesta correcta era ${correctAnswer}. Respondiste en ${timeTaken.toFixed(2)} segundos.`);
        incorrectAnswers++;
    }

    // Actualiza los contadores y puntaje
    document.getElementById("score").innerText = `Puntaje: ${score}`;
    document.getElementById("correctAnswers").innerText = `Aciertos: ${correctAnswers}`;
    document.getElementById("incorrectAnswers").innerText = `Errores: ${incorrectAnswers}`;

    // Guarda la operación en el historial con su estado (correcta o incorrecta)
    operationsHistory.push({
        operation: currentExpression,
        result: correctAnswer,
        userAnswer: userAnswer,
        time: timeTaken.toFixed(2),
        correct: isCorrect
    });

    // Actualiza el historial de operaciones
    updateOperationsHistory();

    // Genera una nueva operación automáticamente
    if (gameRunning) {
        showExpression(); // Muestra una nueva operación
    }
}

// Función para mostrar el historial de operaciones
function updateOperationsHistory() {
    const historyContainer = document.getElementById("operationsHistory");
    historyContainer.innerHTML = ''; // Limpiamos el contenedor antes de agregar nuevas operaciones

    operationsHistory.forEach(item => {
        const operationElement = document.createElement("div");
        operationElement.classList.add("operation");

        // Asigna color según si la respuesta fue correcta o incorrecta
        if (item.correct) {
            operationElement.classList.add("correct");
        } else {
            operationElement.classList.add("incorrect");
        }

        // Muestra la operación, el resultado y el tiempo de respuesta
        operationElement.innerHTML = `${item.operation} = ${item.result} | Respuesta: ${item.userAnswer} | Tiempo: ${item.time} segundos`;
        historyContainer.appendChild(operationElement);
    });
}

// Función para iniciar el juego
function startGame() {
    if (!gameRunning) {
        score = 0;
        correctAnswers = 0;
        incorrectAnswers = 0;
        gameRunning = true;
        document.getElementById("startButton").style.display = "none";
        document.getElementById("stopButton").style.display = "block";
        showExpression(); // Muestra la primera operación
        document.getElementById("answer").disabled = false; // Habilita el campo de respuesta
    }
}

// Función para detener el juego
function stopGame() {
    if (gameRunning) {
        gameRunning = false;
        alert("Juego detenido.");
        document.getElementById("startButton").style.display = "block";
        document.getElementById("stopButton").style.display = "none";
        document.getElementById("answer").disabled = true; // Deshabilita el campo de respuesta
        document.getElementById("question").innerText = "Juego detenido. No hay más operaciones.";
    }
}

// Función para permitir la tecla Enter como entrada
function handleEnterKey(event) {
    if (event.key === "Enter" && gameRunning) {
        checkAnswer();
    }
}

// Asignar el evento 'Enter' a la caja de texto
document.getElementById("answer").addEventListener("keydown", handleEnterKey);

// Llamamos a la función para mostrar el botón "Enviar Resultado" si estamos en móvil
window.onload = function () {
    toggleMobileSubmitButton();
};











