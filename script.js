document.addEventListener("DOMContentLoaded", () => {
    const box = document.getElementById("box");
    const scoreDisplay = document.getElementById("score");
    const startButton = document.getElementById("startButton");
    const googleSignInBtn = document.getElementById("googleSignIn");
    const signOutBtn = document.getElementById("signOut");
    const userInfo = document.getElementById("userInfo");
    const leaderboardList = document.getElementById("leaderboard");
  
    let score = 0;
    let gameInterval;
  
    // Google Sign-in
    googleSignInBtn.addEventListener("click", () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider).then((result) => {
            const user = result.user;
            showUser(user);
            fetchLeaderboard();  // update leaderboard on sign in
        }).catch((error) => {
            console.error("Error signing in: ", error);
        });
    });
  
    // Sign-out
    signOutBtn.addEventListener("click", () => {
        auth.signOut().then(() => {
            hideUser();
        });
    });
  
    // Display user info
    function showUser(user) {
        userInfo.innerHTML = `Logged in as: ${user.displayName}`;
        googleSignInBtn.style.display = "none";
        signOutBtn.style.display = "block";
        userInfo.style.display = "block";
    }
  
    // Hide user info
    function hideUser() {
        userInfo.innerHTML = "";
        googleSignInBtn.style.display = "block";
        signOutBtn.style.display = "none";
        userInfo.style.display = "none";
    }
  
    // Check authentication state
    auth.onAuthStateChanged((user) => {
        if (user) {
            showUser(user);
            fetchLeaderboard();
        } else {
            hideUser();
        }
    });
  
    // Game logic
    function getRandomPosition() {
        const gameArea = document.getElementById("gameArea");
        const maxX = gameArea.clientWidth - box.clientWidth;
        const maxY = gameArea.clientHeight - box.clientHeight;
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);
        return { x: randomX, y: randomY };
    }
  
    function moveBox() {
        const position = getRandomPosition();
        box.style.left = position.x + "px";
        box.style.top = position.y + "px";
    }
  
    box.addEventListener("click", () => {
        score++;
        scoreDisplay.textContent = score;
        moveBox();
    });
  
    startButton.addEventListener("click", () => {
        // Reset score and start game
        score = 0;
        scoreDisplay.textContent = score;
        moveBox();
        gameInterval = setInterval(moveBox, 1000);
  
        setTimeout(() => {
            clearInterval(gameInterval);
            alert("Game Over! Your score: " + score);
            // If the user is logged in, save the score and update the leaderboard
            const currentUser = auth.currentUser;
            if (currentUser) {
                saveScore(score, currentUser);
            }
        }, 15000); // Game lasts 15 seconds
    });
  
    // Save the user’s score to Firestore
    function saveScore(score, user) {
        db.collection("scores").add({
            uid: user.uid,
            name: user.displayName,
            score: score,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            console.log("Score saved successfully!");
            fetchLeaderboard(); // Update leaderboard after saving score
        })
        .catch((error) => {
            console.error("Error saving score: ", error);
        });
    }
  
    // Fetch the top 10 scores and update the leaderboard
    function fetchLeaderboard() {
        db.collection("scores")
            .orderBy("score", "desc")
            .limit(10)
            .get()
            .then((querySnapshot) => {
                leaderboardList.innerHTML = "";
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const li = document.createElement("li");
                    li.textContent = `${data.name}: ${data.score}`;
                    leaderboardList.appendChild(li);
                });
            })
            .catch((error) => {
                console.error("Error fetching leaderboard: ", error);
            });
    }
  });
  