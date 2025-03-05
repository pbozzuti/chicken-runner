import { useEffect, useState, useRef } from "react";

// Helper to get a random integer in a range
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default function ChickenRunner() {
    const [maxX, setMaxX] = useState(window.innerWidth);
    const [maxY, setMaxY] = useState(window.innerHeight);
    const [chickenLoc, setChickenLoc] = useState({ x: -100, y: -100 });
    const [isMoving, setIsMoving] = useState(true); // Track movement state
    const [score, setScore] = useState(0); // Initialize score to 0
    const [showToaster, setShowToaster] = useState(false); // To handle toaster visibility
    const [zombieToaster, setZombieToaster] = useState(false); // Zombie caught toaster visibility
    const [chickenImage, setChickenImage] = useState("/better_chicken.png"); // Chicken image state
    const [zombies, setZombies] = useState([]); // Array of zombie objects
    const directionRef = useRef({ x: 0, y: 0 });

    // Handle window resizing
    useEffect(() => {
        const handleResize = () => {
            setMaxX(window.innerWidth * 0.5);
            setMaxY(window.innerHeight * 0.5);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    function getMovementRad() {
        return getRandomInt(0, 360) * (Math.PI / 180);
    }

    function spawnEntity(image, isZombie = false) {
        if (maxX === 0 || maxY === 0) return;
    
        let startingX, startingY, movementRad;
        const edge = getRandomInt(0, 3);
    
        switch (edge) {
            case 0:
                startingX = 0;
                startingY = getRandomInt(0, maxY);
                movementRad = getRandomInt(0, 180) * (Math.PI / 180); break;
            case 1:
                startingX = maxX;
                startingY = getRandomInt(0, maxY);
                movementRad = getRandomInt(180, 360) * (Math.PI / 180); break;
            case 2:
                startingX = getRandomInt(0, maxX);
                startingY = 0;
                movementRad = getRandomInt(90, 270) * (Math.PI / 180); break;
            case 3:
                startingX = getRandomInt(0, maxX);
                startingY = maxY;
                movementRad = getRandomInt(0, 180) * (Math.PI / 180); break;
        }
    
        const newEntity = {
            x: startingX,
            y: startingY,
            direction: { x: Math.cos(movementRad), y: Math.sin(movementRad) },
            image: image,
        };
    
        if (isZombie) {
            setZombies((prev) => [...prev, newEntity]); // Add zombies to array
        } else {
            setChickenLoc({ x: startingX, y: startingY });
            directionRef.current = newEntity.direction;
        }
    }
    

    function initChicken() {
        if (maxX === 0 || maxY === 0) return;
    
        let startingX, startingY, movementRad;
    
        // Pick a random edge: 0 = left, 1 = right, 2 = top, 3 = bottom
        const edge = getRandomInt(0, 3);
    
        switch (edge) {
            case 0: // Left edge
                startingX = 0;
                startingY = getRandomInt(0, maxY);
                movementRad = getRandomInt(-45, 45) * (Math.PI / 180); // Move right
                break;
            case 1: // Right edge
                startingX = maxX;
                startingY = getRandomInt(0, maxY);
                movementRad = getRandomInt(135, 225) * (Math.PI / 180); // Move left
                break;
            case 2: // Top edge
                startingX = getRandomInt(0, maxX);
                startingY = 0;
                movementRad = getRandomInt(45, 135) * (Math.PI / 180); // Move downward
                break;
            case 3: // Bottom edge
                startingX = getRandomInt(0, maxX);
                startingY = maxY;
                movementRad = getRandomInt(225, 315) * (Math.PI / 180); // Move upward
                break;
        }
    
        const newDirection = {
            x: Math.cos(movementRad),
            y: Math.sin(movementRad),
        };
    
        directionRef.current = newDirection;
        setChickenLoc({ x: startingX, y: startingY });
    
        console.log("🐔 Chicken spawned at edge:", { x: startingX, y: startingY });
    }

    useEffect(() => {
        if (maxX > 0 && maxY > 0) {
            initChicken();
        }
    }, [maxX, maxY]);

    useEffect(() => {
        if (!isMoving) return; // Skip interval if chicken is not moving

        function AdvanceXY() {
            setChickenLoc((prev) => {
                const newX = prev.x + directionRef.current.x * 10;
                const newY = prev.y + directionRef.current.y * 10;
        
                // Check if completely out of bounds (with buffer to avoid instant reset)
                const isOffScreen = newX < -50 || newX > maxX + 50 || newY < -50 || newY > maxY + 50;
        
                if (isOffScreen) {
                    console.log("🐔 Fully off-screen, respawning...");
                    initChicken(); // Respawn at the edge
                    return prev;
                }
        
                return { x: newX, y: newY };
            });
        }
        

        const interval = setInterval(AdvanceXY, 50);
        return () => clearInterval(interval);
    }, [maxX, maxY, isMoving]);

    useEffect(() => {
        if (score > 0 && score % 3 === 0) {
            const zombiesToSpawn = score / 3;
            for (let i = 0; i < zombiesToSpawn; i++) {
                spawnEntity("/zombie.png", true); // Make sure this is spawning zombies
            }
        }
    }, [score]);

    useEffect(() => {
        console.log(zombies); // This logs the array of zombies
    }, [zombies])

    useEffect(() => {
        const interval = setInterval(moveZombies, 50);
        return () => clearInterval(interval);
    }, [zombies]);

    const moveZombies = () => {
        setZombies((prevZombies) =>
            prevZombies.map((zombie) => {
                const newX = zombie.x + zombie.direction.x * 10;
                const newY = zombie.y + zombie.direction.y * 10;
    
                // Check if zombie goes off-screen and reset its position
                const isOffScreen = newX < -50 || newX > maxX + 50 || newY < -50 || newY > maxY + 50;
    
                if (isOffScreen) {
                    // Reset the zombie's position to a new random edge if it moves off-screen
                    return spawnZombieAtRandomEdge(zombie.image);
                }
    
                // Continue updating the zombie position if it's still on screen
                return { ...zombie, x: newX, y: newY };
            }).filter(Boolean) // Filter out any zombies that might have been removed
        );
    };

    const spawnZombieAtRandomEdge = (image) => {
        const edge = getRandomInt(0, 3); // Get a random edge (0 = left, 1 = right, 2 = top, 3 = bottom)
        let startingX, startingY, movementRad;
    
        switch (edge) {
            case 0: // Left edge
                startingX = 0;
                startingY = getRandomInt(0, maxY);
                movementRad = getRandomInt(0, 180) * (Math.PI / 180);
                break;
            case 1: // Right edge
                startingX = maxX;
                startingY = getRandomInt(0, maxY);
                movementRad = getRandomInt(180, 360) * (Math.PI / 180);
                break;
            case 2: // Top edge
                startingX = getRandomInt(0, maxX);
                startingY = 0;
                movementRad = getRandomInt(90, 270) * (Math.PI / 180);
                break;
            case 3: // Bottom edge
                startingX = getRandomInt(0, maxX);
                startingY = maxY;
                movementRad = getRandomInt(0, 180) * (Math.PI / 180);
                break;
        }
    
        const newDirection = {
            x: Math.cos(movementRad),
            y: Math.sin(movementRad),
        };
    
        return {
            x: startingX,
            y: startingY,
            direction: newDirection,
            image: image, // Zombie image
        };
    };

    useEffect(() => {
        const interval = setInterval(moveZombies, 50);
        return () => clearInterval(interval);
    }, [maxX, maxY]);

    const handleCatch = (e) => {
        const catchRadius = 200;
        const distX = e.clientX - chickenLoc.x;
        const distY = e.clientY - chickenLoc.y;
        const distance = Math.sqrt(distX * distX + distY * distY);

        // 🐔 If caught the chicken, increase score
        if (distance < catchRadius) {
            setScore((prevScore) => prevScore + 1);
            setShowToaster("You got a point!");
            setChickenImage("/Cooked_Chicken_optimized.png");

            setIsMoving(false);
            setTimeout(() => {
                setIsMoving(true);
                setChickenImage("/better_chicken.png");
                spawnEntity("/better_chicken.png");
            }, 3000);

            setTimeout(() => setShowToaster(null), 1500);
            return;
        }

        // 🧟 If clicked a zombie, remove it from the screen
        for (let zombie of zombies) {
            const distZombieX = e.clientX - zombie.x;
            const distZombieY = e.clientY - zombie.y;
            const zombieDistance = Math.sqrt(distZombieX * distZombieX + distZombieY * distZombieY);

            if (zombieDistance < catchRadius) {
                setZombies((prevZombies) => prevZombies.filter((z) => z !== zombie)); // Remove clicked zombie
                setScore(0); // Reset score
                setZombieToaster("Zombie Caught! Score reset.");
                setTimeout(() => {
                    setZombieToaster(null);
                    spawnEntity("/zombie.png", true); // Spawn new zombie after reset
                }, 4000);
                return;
            }
        }
    };

    return (
        <div 
            className="chicken-runner" 
            style={{ position: "relative", width: "100%", height: "100vh" }}
            onClick={handleCatch} // Handle click to catch chicken
        >
            {/* Score display with black text */}
            <div className="score" style={{
                position: "absolute", 
                width: "200px",
                height: "100px",
                backgroundImage: "url('/toaster_img.png')", 
                backgroundSize: "cover", 
                backgroundPosition: "center", 
                top: 20, 
                right: 20, 
                fontSize: "60px", 
                color: "#000", 
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                zIndex: 1000
            }}>
                Score: {score}
            </div>
    
            {/* Toaster notification for catching chicken */}
            {showToaster && (
                <div 
                    className="toaster animate-fade-in"
                    style={{
                        position: "absolute",
                        bottom: "20px", // Position in the bottom right corner
                        right: "20px",
                        width: "424px", // Adjust width as needed
                        height: "210px", // Adjust height
                        backgroundImage: "url('/toaster_img.png')", // Replace with your image path
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        color: "#087236", // Ensure text is visible on the image
                        fontFamily: "'Micro 5', sans-serif", // Use your desired font
                        fontSize: "64px",
                        padding: "15px",
                        borderRadius: "10px",
                        boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        transition: "opacity 0.7s ease-in-out",
                        zIndex: 1000,
                    }}
                >
                    You got a point!
                </div>
            )}
    
            {/* Toaster notification for catching a zombie */}
            {zombieToaster && (
                <div 
                    className="toaster animate-fade-in"
                    style={{
                        position: "absolute",
                        bottom: "20px", // Position on the other side
                        left: "20px",
                        width: "424px", // Adjust width as needed
                        height: "210px", // Adjust height
                        backgroundImage: "url('/toaster_img.png')", // Replace with your image path
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        color: "#087236", // Ensure text is visible on the image
                        fontFamily: "'Micro 5', sans-serif", // Use your desired font
                        fontSize: "64px",
                        padding: "15px",
                        borderRadius: "10px",
                        boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        transition: "opacity 0.7s ease-in-out",
                        zIndex: 1000,
                    }}
                >
                    Zombie Caught! Score reset.
                </div>
            )}
    
            {/* Render zombies */}
            {zombies.map((zombie, index) => (
                <img
                    key={index}
                    src={zombie.image}
                    className="absolute z-50"
                    style={{
                        width: "75px",
                        height: "75px",
                        left: `${zombie.x}px`,
                        top: `${zombie.y}px`,
                        position: "absolute",
                        zIndex: 100,
                    }}
                />
            ))}
    
            {/* Render chicken */}
            <img
                src={chickenImage}
                key={`${chickenLoc.x}-${chickenLoc.y}`} // Force React to re-render the image when position changes
                className="absolute z-50"
                style={{
                    scale: 2,
                    width: "75px", // Adjust size if needed
                    height: "75px", // Adjust size if needed
                    left: `${chickenLoc.x}px`,
                    top: `${chickenLoc.y}px`,
                    position: "absolute",
                    zIndex: 100,
                }}
            />
        </div>
    );
}
