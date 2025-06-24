// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavigation();
    initQuiz();
    initCarousel();
    initWeatherApp();
});

// Mobile Navigation
function initNavigation() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    const navAnchors = document.querySelectorAll('.nav-links a');
    
    // Toggle navigation menu
    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');
        
        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        
        // Burger Animation
        burger.classList.toggle('toggle');
    });
    
    // Close menu when clicking a link
    navAnchors.forEach(anchor => {
        anchor.addEventListener('click', () => {
            if (nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                
                navLinks.forEach(link => {
                    link.style.animation = '';
                });
            }
        });
    });
    
    // Active link highlighting
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        
        navAnchors.forEach(anchor => {
            anchor.classList.remove('active');
            if (anchor.getAttribute('href').substring(1) === current) {
                anchor.classList.add('active');
            }
        });
    });
}

// Interactive Quiz
function initQuiz() {
    const startBtn = document.getElementById('start-quiz-btn');
    const nextBtn = document.getElementById('next-btn');
    const restartBtn = document.getElementById('restart-btn');
    const quizStart = document.getElementById('quiz-start');
    const quizQuestions = document.getElementById('quiz-questions');
    const quizResults = document.getElementById('quiz-results');
    const questionText = document.getElementById('question-text');
    const answerButtons = document.getElementById('answer-buttons');
    const currentQuestionEl = document.getElementById('current-question');
    const totalQuestionsEl = document.getElementById('total-questions');
    const timerEl = document.getElementById('timer');
    const scoreEl = document.getElementById('score');
    const maxScoreEl = document.getElementById('max-score');
    const scoreMessageEl = document.getElementById('score-message');
    const resultsDetailsEl = document.getElementById('results-details');
    
    let currentQuestionIndex = 0;
    let score = 0;
    let timer;
    let timeLeft;
    let selectedAnswer = null;
    let userAnswers = [];
    
    // Quiz questions
    const questions = [
        {
            question: "What does HTML stand for?",
            answers: [
                { text: "Hyper Text Markup Language", correct: true },
                { text: "High Tech Modern Language", correct: false },
                { text: "Hyper Transfer Markup Language", correct: false },
                { text: "Home Tool Markup Language", correct: false }
            ]
        },
        {
            question: "Which CSS property is used to control the spacing between elements?",
            answers: [
                { text: "spacing", correct: false },
                { text: "margin", correct: true },
                { text: "padding-between", correct: false },
                { text: "element-spacing", correct: false }
            ]
        },
        {
            question: "Which of the following is NOT a JavaScript data type?",
            answers: [
                { text: "String", correct: false },
                { text: "Boolean", correct: false },
                { text: "Float", correct: true },
                { text: "Object", correct: false }
            ]
        },
        {
            question: "What is the correct CSS syntax for making all text elements bold?",
            answers: [
                { text: "text {font-weight: bold;}", correct: false },
                { text: "text {text-style: bold;}", correct: false },
                { text: "text-element {font-weight: bold;}", correct: false },
                { text: "* {font-weight: bold;}", correct: true }
            ]
        },
        {
            question: "Which method is used to add an element at the end of an array in JavaScript?",
            answers: [
                { text: "push()", correct: true },
                { text: "append()", correct: false },
                { text: "addToEnd()", correct: false },
                { text: "pop()", correct: false }
            ]
        }
    ];
    
    // Start quiz
    startBtn.addEventListener('click', startQuiz);
    nextBtn.addEventListener('click', () => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            showQuestion();
        } else {
            showResults();
        }
    });
    restartBtn.addEventListener('click', startQuiz);
    
    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        userAnswers = [];
        quizStart.classList.add('hidden');
        quizResults.classList.add('hidden');
        quizQuestions.classList.remove('hidden');
        totalQuestionsEl.textContent = questions.length;
        showQuestion();
    }
    
    function showQuestion() {
        resetState();
        const question = questions[currentQuestionIndex];
        questionText.textContent = question.question;
        currentQuestionEl.textContent = currentQuestionIndex + 1;
        
        // Create answer buttons
        question.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.textContent = answer.text;
            button.dataset.index = index;
            button.addEventListener('click', selectAnswer);
            answerButtons.appendChild(button);
        });
        
        // Start timer
        startTimer();
    }
    
    function resetState() {
        clearInterval(timer);
        nextBtn.disabled = true;
        selectedAnswer = null;
        while (answerButtons.firstChild) {
            answerButtons.removeChild(answerButtons.firstChild);
        }
    }
    
    function selectAnswer(e) {
        if (selectedAnswer !== null) return; // Prevent multiple selections
        
        selectedAnswer = parseInt(e.target.dataset.index);
        const buttons = answerButtons.querySelectorAll('button');
        
        // Mark selected answer
        buttons.forEach(button => button.classList.remove('selected'));
        e.target.classList.add('selected');
        
        // Enable next button
        nextBtn.disabled = false;
        
        // Check if answer is correct
        const question = questions[currentQuestionIndex];
        const isCorrect = question.answers[selectedAnswer].correct;
        
        // Store user's answer
        userAnswers.push({
            question: question.question,
            userAnswer: question.answers[selectedAnswer].text,
            correctAnswer: question.answers.find(a => a.correct).text,
            isCorrect: isCorrect
        });
        
        // Update score
        if (isCorrect) {
            score++;
        }
        
        // Show correct/wrong feedback
        setTimeout(() => {
            buttons.forEach((button, index) => {
                if (question.answers[index].correct) {
                    button.classList.add('correct');
                } else if (index === selectedAnswer) {
                    button.classList.add('wrong');
                }
            });
            
            clearInterval(timer); // Stop timer after answer is selected
        }, 500);
    }
    
    function startTimer() {
        timeLeft = 30; // 30 seconds per question
        timerEl.textContent = timeLeft;
        
        timer = setInterval(() => {
            timeLeft--;
            timerEl.textContent = timeLeft;
            
            if (timeLeft <= 10) {
                timerEl.style.color = '#e74c3c';
            }
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                // Auto-select wrong answer if time runs out
                if (selectedAnswer === null) {
                    const question = questions[currentQuestionIndex];
                    userAnswers.push({
                        question: question.question,
                        userAnswer: 'Time expired',
                        correctAnswer: question.answers.find(a => a.correct).text,
                        isCorrect: false
                    });
                    
                    // Show correct answer
                    const buttons = answerButtons.querySelectorAll('button');
                    buttons.forEach((button, index) => {
                        if (question.answers[index].correct) {
                            button.classList.add('correct');
                        }
                    });
                    
                    nextBtn.disabled = false;
                }
            }
        }, 1000);
    }
    
    function showResults() {
        quizQuestions.classList.add('hidden');
        quizResults.classList.remove('hidden');
        
        // Update score
        scoreEl.textContent = score;
        maxScoreEl.textContent = questions.length;
        
        // Score message
        const percentage = (score / questions.length) * 100;
        let message;
        
        if (percentage === 100) {
            message = 'Perfect! You got all questions right!';
        } else if (percentage >= 80) {
            message = 'Great job! You have excellent knowledge!';
        } else if (percentage >= 60) {
            message = 'Good effort! You know quite a bit!';
        } else if (percentage >= 40) {
            message = 'Not bad, but there\'s room for improvement.';
        } else {
            message = 'Keep studying and try again!';
        }
        
        scoreMessageEl.textContent = message;
        
        // Show detailed results
        resultsDetailsEl.innerHTML = '';
        userAnswers.forEach((answer, index) => {
            const resultItem = document.createElement('div');
            resultItem.classList.add('result-item');
            resultItem.classList.add(answer.isCorrect ? 'correct' : 'wrong');
            
            resultItem.innerHTML = `
                <p><strong>Question ${index + 1}:</strong> ${answer.question}</p>
                <p><strong>Your answer:</strong> ${answer.userAnswer}</p>
                ${!answer.isCorrect ? `<p><strong>Correct answer:</strong> ${answer.correctAnswer}</p>` : ''}
            `;
            
            resultsDetailsEl.appendChild(resultItem);
        });
    }
}

// Image Carousel
function initCarousel() {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.querySelectorAll('.carousel-slide'));
    const nextButton = document.querySelector('.carousel-button.next');
    const prevButton = document.querySelector('.carousel-button.prev');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    let currentIndex = 0;
    let autoplayInterval;
    
    // Set up slides
    slides.forEach((slide, index) => {
        // Create dot for each slide
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = Array.from(dotsContainer.querySelectorAll('.carousel-dot'));
    
    // Set slide position
    function setSlidePosition() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update dots
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');
    }
    
    // Go to specific slide
    function goToSlide(index) {
        currentIndex = index;
        setSlidePosition();
        resetAutoplay();
    }
    
    // Next slide
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        setSlidePosition();
    }
    
    // Previous slide
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        setSlidePosition();
    }
    
    // Start autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000);
    }
    
    // Reset autoplay
    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }
    
    // Event listeners
    nextButton.addEventListener('click', () => {
        nextSlide();
        resetAutoplay();
    });
    
    prevButton.addEventListener('click', () => {
        prevSlide();
        resetAutoplay();
    });
    
    // Touch events for mobile swiping
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            nextSlide(); // Swipe left, go to next
            resetAutoplay();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            prevSlide(); // Swipe right, go to previous
            resetAutoplay();
        }
    }
    
    // Start autoplay
    startAutoplay();
}

// Weather API Integration
function initWeatherApp() {
    const cityInput = document.getElementById('city-input');
    const searchButton = document.getElementById('search-weather');
    const loadingElement = document.getElementById('weather-loading');
    const errorElement = document.getElementById('weather-error');
    const weatherDataElement = document.getElementById('weather-data');
    const cityElement = document.getElementById('weather-city');
    const dateElement = document.getElementById('weather-date');
    const tempElement = document.getElementById('weather-temp');
    const feelsLikeElement = document.getElementById('weather-feels-like');
    const descriptionElement = document.getElementById('weather-description');
    const iconElement = document.getElementById('weather-icon');
    const humidityElement = document.getElementById('weather-humidity');
    const windElement = document.getElementById('weather-wind');
    const pressureElement = document.getElementById('weather-pressure');
    const visibilityElement = document.getElementById('weather-visibility');
    
    // OpenWeatherMap API key - you would need to sign up for a free API key
    // For demo purposes, we'll use a placeholder
    const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key from OpenWeatherMap
    
    // Fetch weather data
    function fetchWeather(city) {
        // Show loading state
        loadingElement.textContent = 'Loading weather data...';
        loadingElement.classList.remove('hidden');
        errorElement.classList.add('hidden');
        weatherDataElement.classList.add('hidden');
        
        // API URL
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
        
        // Fetch data
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('City not found or API key invalid');
                }
                return response.json();
            })
            .then(data => {
                // Hide loading, show data
                loadingElement.classList.add('hidden');
                weatherDataElement.classList.remove('hidden');
                
                // Update UI with weather data
                updateWeatherUI(data);
            })
            .catch(error => {
                // Show error
                loadingElement.classList.add('hidden');
                errorElement.classList.remove('hidden');
                errorElement.textContent = `Error: ${error.message}`;
                
                // If API key is invalid or missing, show helpful message
                if (apiKey === 'YOUR_API_KEY') {
                    errorElement.textContent = 'Error: Please replace "YOUR_API_KEY" with a valid OpenWeatherMap API key in the script.js file.';
                }
            });
    }
    
    // Update UI with weather data
    function updateWeatherUI(data) {
        // City and country
        cityElement.textContent = `${data.name}, ${data.sys.country}`;
        
        // Date
        const date = new Date();
        dateElement.textContent = date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        // Temperature
        const temp = Math.round(data.main.temp);
        tempElement.textContent = `${temp}°C`;
        
        // Feels like
        const feelsLike = Math.round(data.main.feels_like);
        feelsLikeElement.textContent = `Feels like: ${feelsLike}°C`;
        
        // Weather description and icon
        descriptionElement.textContent = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        iconElement.innerHTML = `<img src="http://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${data.weather[0].description}">`;
        
        // Additional details
        humidityElement.textContent = `${data.main.humidity}%`;
        windElement.textContent = `${data.wind.speed} m/s`;
        pressureElement.textContent = `${data.main.pressure} hPa`;
        
        // Visibility (convert from meters to kilometers)
        const visibility = data.visibility / 1000;
        visibilityElement.textContent = `${visibility.toFixed(1)} km`;
    }
    
    // Event listeners
    searchButton.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeather(city);
        }
    });
    
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const city = cityInput.value.trim();
            if (city) {
                fetchWeather(city);
            }
        }
    });
    
    // Default city (optional)
    // fetchWeather('London');
}