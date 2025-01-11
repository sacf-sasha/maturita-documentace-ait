import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// Конфигурация игры
const GAME_CONFIG = {
    FIELD_SIZE: 200,
    WALL_HEIGHT: 2,
    WALL_THICKNESS: 1.5,
    CAMERA_HEIGHT: 8,
    CAMERA_DISTANCE: 15,
    PLAYER_SPEED: 0.2,
    PLAYER_MAX_SPEED: 0.2,
    ROTATION_SPEED: 0.002,
    BULLET_SPEED: 1,
    ENEMY_BULLET_SPEED: 0.5,
    ENEMY_SPAWN_DISTANCE: Math.floor(Math.random() * 30) + 40,
    MAX_ENEMIES: 1000,
    WAVE_DELAY: 1500,
    ENEMIES_PER_WAVE: 10,
    BULLET_LIFETIME: 3500,
    COLLISION_RADIUS: 1.5,
    ENEMY_SPAWN_HEIGHT: 0.5,
    PLAYER_SHOOT_COOLDOWN: 10,
    PERFORMANCE_MODE: false,
} as const;

// Константы для безопасности
const SAFETY_CONSTANTS = {
    MAX_ENEMY_COUNT: 1000,
    MIN_SPAWN_DISTANCE: 10,
    MAX_SPAWN_DISTANCE: 100,
    MAX_BULLET_COUNT: 500,
    MIN_HEALTH: 0,
    MAX_HEALTH: 200,
    MIN_DAMAGE: 1,
    MAX_DAMAGE: 100,
    MIN_SPEED: 0.001,
    MAX_SPEED: 0.1,
} as const;

// Типы врагов
const ENEMY_TYPES = {
    BASIC: {
        color: 0xff0000,
        speed: 0.15,
        health: 100,
        damage: 10,
        scale: 1.5,
    },
    SHOOTER: {
        color: 0xff6600,
        speed: 0.07,
        health: 150,
        damage: 15,
        scale: 1.8,
        shootInterval: 2000,
    },
};

// Состояния игры
enum GameState {
    MENU = 'MENU',
    PLAYING = 'PLAYING',
    GAME_OVER = 'GAME_OVER',
}
// В начале компонента добавим переиспользуемые векторы
const tempVector = new THREE.Vector3();
const moveVector = new THREE.Vector3();
const directionVector = new THREE.Vector3();
const idealOffset = new THREE.Vector3();

// Улучшенные типы
interface Vector3Like {
    x: number;
    y: number;
    z: number;
}

interface Enemy {
    group: THREE.Group;
    type: keyof typeof ENEMY_TYPES;
    health: number;
    maxHealth: number;
    damage: number;
    speed: number;
    lastShot?: number;
    isDestroyed?: boolean;
    healthBar: THREE.Mesh; 
}

interface Bullet {
    mesh: THREE.Mesh;
    direction: THREE.Vector3;
    speed: number;
    isPlayerBullet: boolean;
    createdAt: number;
    damage: number;
}

// Вспомогательные функции
const log = (message: string, data?: any) => {
    console.log(`[Game] ${message}`, data || '');
};

const Game: React.FC = () => {
    log('Component rendered');

    // Refs
    const containerRef = useRef<HTMLDivElement | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const playerRef = useRef<THREE.Group | null>(null);
    const groundRef = useRef<THREE.Mesh | null>(null);
    const animationFrameRef = useRef<number>();
    const enemiesRef = useRef<Enemy[]>([]);
    const bulletsRef = useRef<Bullet[]>([]);
    const lastShotTime = useRef<number>(0);

    // State
    const [score, setScore] = useState(0);
    const [wave, setWave] = useState(0);
    const [playerHealth, setPlayerHealth] = useState(100);
    const [gameState, setGameState] = useState<GameState>(GameState.MENU);
    const [waveInProgress, setWaveInProgress] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Movement state
    const isRotating = useRef(false);
    const moveStates = useRef({
        forward: false,
        backward: false,
        left: false,
        right: false
    });

    // Добавляем состояние для поворота
    const cameraRotation = useRef({ x: 0, y: 0 });

    // Обработчик поворота камеры
    const handleMouseMove = useCallback((event: MouseEvent) => {
        if (!isRotating.current || !playerRef.current || !cameraRef.current || gameState !== GameState.PLAYING) return;

        const movementX = event.movementX || 0;
        const movementY = event.movementY || 0;

        // Обновляем поворот игрока и камеры
        cameraRotation.current.x -= movementY * GAME_CONFIG.ROTATION_SPEED;
        cameraRotation.current.y -= movementX * GAME_CONFIG.ROTATION_SPEED;

        // Ограничиваем вертикальный поворот
        cameraRotation.current.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, cameraRotation.current.x));

        // Поворачиваем игрока
        playerRef.current.rotation.y = cameraRotation.current.y;
    }, [gameState]);

    // Обработчики блокировки указателя
    const handlePointerLockChange = useCallback(() => {
        isRotating.current = document.pointerLockElement === containerRef.current;
    }, []);

    const requestPointerLock = useCallback(() => {
        if (gameState === GameState.PLAYING && containerRef.current) {
            containerRef.current.requestPointerLock();
        }
    }, [gameState]);

    // Инициализация игры
    const initGame = useCallback(() => {
        if (!containerRef.current) {
            console.error('Container not ready');
            return false;
        }

        try {
            // Создаем сцену
            sceneRef.current = new THREE.Scene();

            // Создаем камеру
            cameraRef.current = new THREE.PerspectiveCamera(
                75,
                containerRef.current.clientWidth / containerRef.current.clientHeight,
                0.1,
                1000
            );
            cameraRef.current.position.set(0, GAME_CONFIG.CAMERA_HEIGHT, GAME_CONFIG.CAMERA_DISTANCE);
            cameraRef.current.lookAt(new THREE.Vector3(0, 0, 0));

            // Создаем рендерер
            rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
            rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
            rendererRef.current.setClearColor(0x000000);
            containerRef.current.appendChild(rendererRef.current.domElement);

            // Создаем землю
            const textureLoader = new THREE.TextureLoader();
            const groundTexture = textureLoader.load('./textures/plitka-textura.png');
            groundTexture.wrapS = THREE.RepeatWrapping;
            groundTexture.wrapT = THREE.RepeatWrapping;
            groundTexture.repeat.set(20, 20); // Повторяем текстуру

            const groundGeometry = new THREE.PlaneGeometry(GAME_CONFIG.FIELD_SIZE, GAME_CONFIG.FIELD_SIZE);
            const groundMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x404040,
                side: THREE.DoubleSide,
                map: groundTexture
            });
            groundRef.current = new THREE.Mesh(groundGeometry, groundMaterial);
            groundRef.current.rotation.x = -Math.PI / 2;
            groundRef.current.receiveShadow = true;
            sceneRef.current.add(groundRef.current);

            const wallTexture = textureLoader.load('./textures/stena.jpg');
            wallTexture.wrapS = THREE.RepeatWrapping;
            wallTexture.wrapT = THREE.RepeatWrapping;
            wallTexture.repeat.set(15, 0.5); // Повторяем текстуру

            const wallMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xffffff,
                side: THREE.DoubleSide,
                map: wallTexture
            });

            // Создаем геометрию для стен
            const wallGeometryX = new THREE.BoxGeometry((GAME_CONFIG.FIELD_SIZE-3) + GAME_CONFIG.WALL_THICKNESS * 2, GAME_CONFIG.WALL_HEIGHT, GAME_CONFIG.WALL_THICKNESS);
            const wallGeometryZ = new THREE.BoxGeometry(GAME_CONFIG.WALL_THICKNESS, GAME_CONFIG.WALL_HEIGHT, GAME_CONFIG.FIELD_SIZE + GAME_CONFIG.WALL_THICKNESS * 2);

            // Создаем стены и добавляем их на сцену
            const wallNorth = new THREE.Mesh(wallGeometryX, wallMaterial);
            const wallSouth = new THREE.Mesh(wallGeometryX, wallMaterial);
            const wallEast = new THREE.Mesh(wallGeometryZ, wallMaterial);
            const wallWest = new THREE.Mesh(wallGeometryZ, wallMaterial);

            // Позиционируем стены
            const halfField = GAME_CONFIG.FIELD_SIZE / 2;
            wallNorth.position.set(0, GAME_CONFIG.WALL_HEIGHT / 2, -halfField - GAME_CONFIG.WALL_THICKNESS / 2);
            wallSouth.position.set(0, GAME_CONFIG.WALL_HEIGHT / 2, halfField + GAME_CONFIG.WALL_THICKNESS / 2);
            wallEast.position.set(halfField + GAME_CONFIG.WALL_THICKNESS / 2, GAME_CONFIG.WALL_HEIGHT / 2, 0);
            wallWest.position.set(-halfField - GAME_CONFIG.WALL_THICKNESS / 2, GAME_CONFIG.WALL_HEIGHT / 2, 0);

            // Добавляем стены на сцену
            sceneRef.current.add(wallNorth);
            sceneRef.current.add(wallSouth);
            sceneRef.current.add(wallEast);
            sceneRef.current.add(wallWest);

            // Создаем игрока-гоблина
            const playerGroup = new THREE.Group();
            
            // Тело гоблина (зеленое)
            const bodyGeometry = new THREE.CapsuleGeometry(0.3, 0.5, 4, 8);
            const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x2d5a27 });
            const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
            body.position.y = 0.5;
            playerGroup.add(body);

            // Голова гоблина
            const headGeometry = new THREE.SphereGeometry(0.25, 8, 8);
            const headMaterial = new THREE.MeshPhongMaterial({ color: 0x2d5a27 });
            const head = new THREE.Mesh(headGeometry, headMaterial);
            head.position.y = 1.0;
            playerGroup.add(head);

            // Глаза
            const eyeGeometry = new THREE.SphereGeometry(0.05, 8, 8);
            const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
            
            const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
            leftEye.position.set(0.1, 1.05, 0.2);
            playerGroup.add(leftEye);

            const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
            rightEye.position.set(-0.1, 1.05, 0.2);
            playerGroup.add(rightEye);

            // Уши
            const earGeometry = new THREE.ConeGeometry(0.1, 0.2, 8);
            const earMaterial = new THREE.MeshPhongMaterial({ color: 0x2d5a27 });
            
            const leftEar = new THREE.Mesh(earGeometry, earMaterial);
            leftEar.position.set(0.2, 1.2, 0);
            leftEar.rotation.z = -Math.PI / 4;
            playerGroup.add(leftEar);

            const rightEar = new THREE.Mesh(earGeometry, earMaterial);
            rightEar.position.set(-0.2, 1.2, 0);
            rightEar.rotation.z = Math.PI / 4;
            playerGroup.add(rightEar);

            playerRef.current = playerGroup;
            sceneRef.current.add(playerGroup);

            // Добавляем освещение
            const ambientLight = new THREE.AmbientLight(0xffffff, 2);
            sceneRef.current.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(5, 5, 5);
            directionalLight.castShadow = true;
            sceneRef.current.add(directionalLight);

            setIsLoading(false);
            return true;
        } catch (error) {
            console.error('Error initializing game:', error);
            return false;
        }
    }, []);





    // Создание пули
const createBullet = useCallback((position: THREE.Vector3, direction: THREE.Vector3, isPlayerBullet: boolean) => {
    if (!sceneRef.current || bulletsRef.current.length >= SAFETY_CONSTANTS.MAX_BULLET_COUNT) return;

    try {
        const bulletGeometry = new THREE.SphereGeometry(0.2);
        const bulletMaterial = new THREE.MeshBasicMaterial({ 
            color: isPlayerBullet ? 0x00ff00 : 0xff0000 
        });
        const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
        
        const safePosition = position.clone();
        safePosition.y = Math.max(0.5, position.y);
        bullet.position.copy(safePosition);
        
        sceneRef.current.add(bullet);
        
        const bulletSpeed = isPlayerBullet 
            ? GAME_CONFIG.BULLET_SPEED 
            : GAME_CONFIG.ENEMY_BULLET_SPEED;

        bulletsRef.current.push({
            mesh: bullet,
            direction: direction.normalize(),
            speed: bulletSpeed,
            isPlayerBullet: isPlayerBullet,
            createdAt: Date.now(),
            damage: isPlayerBullet ? 30 : Math.min(5 + Math.floor(wave * 0.5), 20)
        });
    } catch (error) {
        console.error('Error creating bullet:', error);
    }
}, [wave]);




    // Обновление врагов
    const updateEnemies = useCallback(() => {
        if (!playerRef.current || gameState !== GameState.PLAYING) return;
    
        const playerPos = playerRef.current.position;
        
        enemiesRef.current = enemiesRef.current.filter(enemy => {
            if (!enemy.group || enemy.isDestroyed) return false;
    
            try {
                // Обновляем полоску здоровья
                if (enemy.healthBar && cameraRef.current) {
                    const healthPercent = enemy.health / enemy.maxHealth;
                    enemy.healthBar.scale.x = Math.max(0, healthPercent);
                    enemy.healthBar.lookAt(cameraRef.current.position);
                }
    
                // Движение к игроку
                directionVector.subVectors(playerPos, enemy.group.position).normalize();
                const safeSpeed = Math.min(enemy.speed, SAFETY_CONSTANTS.MAX_SPEED);
                enemy.group.position.addScaledVector(directionVector, safeSpeed);
                enemy.group.lookAt(playerPos);
    
                // Стрельба для врагов-стрелков
                if (enemy.type === 'SHOOTER') {
                    const now = Date.now();
                    if (now - (enemy.lastShot || 0) >= ENEMY_TYPES.SHOOTER.shootInterval) {
                        enemy.lastShot = now;
                        createBullet(
                            enemy.group.position.clone(),
                            directionVector.clone(),
                            false
                        );
                    }
                }
    
                // Проверка столкновений
                if (enemy.group.position.distanceTo(playerPos) < GAME_CONFIG.COLLISION_RADIUS) {
                    const damage = Math.min(enemy.damage, SAFETY_CONSTANTS.MAX_DAMAGE);
                    setPlayerHealth(prev => {
                        const newHealth = Math.max(0, prev - damage);
                        if (newHealth <= 0) setGameState(GameState.GAME_OVER);
                        return newHealth;
                    });
                }
    
                return true;
            } catch (error) {
                console.error('Error updating enemy:', error);
                return false;
            }
        });
    }, [createBullet, gameState]);



// Обновление пуль
const updateBullets = useCallback(() => {
    if (!sceneRef.current) return;

    const now = Date.now();
    const bulletsToRemove: Set<number> = new Set();

    bulletsRef.current.forEach((bullet, index) => {
        if (!bullet.mesh) return;

        if (now - bullet.createdAt > GAME_CONFIG.BULLET_LIFETIME) {
            bulletsToRemove.add(index);
            return;
        }

        bullet.mesh.position.addScaledVector(bullet.direction, bullet.speed);

        if (bullet.isPlayerBullet) {
            // Проверка столкновений с врагами
            for (let i = 0; i < enemiesRef.current.length; i++) {
                const enemy = enemiesRef.current[i];
                if (!enemy.group || bulletsToRemove.has(index)) continue;

                if (bullet.mesh.position.distanceTo(enemy.group.position) < GAME_CONFIG.COLLISION_RADIUS) {
                    enemy.health -= bullet.damage;
                    bulletsToRemove.add(index);

                    if (enemy.health <= 0) {
                        sceneRef.current?.remove(enemy.group);
                        enemiesRef.current.splice(i, 1);
                        setScore(prev => prev + 10);
                    }
                    break;
                }
            }
        } else if (playerRef.current && 
                  bullet.mesh.position.distanceTo(playerRef.current.position) < GAME_CONFIG.COLLISION_RADIUS) {
            setPlayerHealth(prev => {
                const newHealth = Math.max(0, prev - bullet.damage);
                if (newHealth <= 0) setGameState(GameState.GAME_OVER);
                return newHealth;
            });
            bulletsToRemove.add(index);
        }
    });

    // Удаляем пули
    Array.from(bulletsToRemove).sort((a, b) => b - a).forEach(index => {
        const bullet = bulletsRef.current[index];
        if (bullet.mesh) sceneRef.current?.remove(bullet.mesh);
        bulletsRef.current.splice(index, 1);
    });
}, []);


    // Игровой цикл
    const gameLoop = useCallback(() => {
        if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !playerRef.current || gameState !== GameState.PLAYING) {
            return;
        }

        // Обновляем позицию игрока
    moveVector.set(0, 0, 0);
    if (moveStates.current.forward) moveVector.z -= 1;
    if (moveStates.current.backward) moveVector.z += 1;
    if (moveStates.current.left) moveVector.x -= 1;
    if (moveStates.current.right) moveVector.x += 1;

    if (moveVector.lengthSq() > 0) {
        moveVector.normalize();
        moveVector.applyQuaternion(playerRef.current.quaternion);

        // Ограничиваем скорость движения
        const currentSpeed = GAME_CONFIG.PLAYER_MAX_SPEED;
        moveVector.multiplyScalar(currentSpeed);

        // Используем tempVector для проверки столкновений
        tempVector.copy(playerRef.current.position).add(moveVector);
        const halfField = GAME_CONFIG.FIELD_SIZE / 2;
        const playerRadius = 0.5;

        tempVector.x = Math.max(-halfField + playerRadius, Math.min(halfField - playerRadius, tempVector.x));
        tempVector.z = Math.max(-halfField + playerRadius, Math.min(halfField - playerRadius, tempVector.z));

        playerRef.current.position.copy(tempVector);
    }

        // Обновляем позицию камеры
    idealOffset.set(0, GAME_CONFIG.CAMERA_HEIGHT, GAME_CONFIG.CAMERA_DISTANCE);
    idealOffset.applyQuaternion(playerRef.current.quaternion);
    idealOffset.add(playerRef.current.position);
    
    cameraRef.current.position.copy(idealOffset);
    cameraRef.current.lookAt(playerRef.current.position);

    // Рендерим сцену
    rendererRef.current.render(sceneRef.current, cameraRef.current);

    // Запускаем следующий кадр
    animationFrameRef.current = requestAnimationFrame(gameLoop);
}, [gameState, updateEnemies, updateBullets]);

    // Обработчики событий клавиатуры
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        switch(event.key.toLowerCase()) {
            case 'w': moveStates.current.forward = true; break;
            case 's': moveStates.current.backward = true; break;
            case 'a': moveStates.current.left = true; break;
            case 'd': moveStates.current.right = true; break;
        }
    }, []);

    const handleKeyUp = useCallback((event: KeyboardEvent) => {
        switch(event.key.toLowerCase()) {
            case 'w': moveStates.current.forward = false; break;
            case 's': moveStates.current.backward = false; break;
            case 'a': moveStates.current.left = false; break;
            case 'd': moveStates.current.right = false; break;
        }
    }, []);

    

    // Стрельба игрока
    const shoot = useCallback(() => {
        if (!playerRef.current || !sceneRef.current || gameState !== GameState.PLAYING) return;
        
        const now = Date.now();
        if (now - lastShotTime.current < GAME_CONFIG.PLAYER_SHOOT_COOLDOWN) return;
        
        lastShotTime.current = now;
        
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyQuaternion(playerRef.current.quaternion);
        
        createBullet(playerRef.current.position.clone(), direction, true);
    }, [createBullet, gameState]);

    // Создание врага
    const createEnemy = useCallback((type: keyof typeof ENEMY_TYPES) => {
        if (!sceneRef.current || enemiesRef.current.length >= GAME_CONFIG.MAX_ENEMIES) return null;

        try {
            const config = ENEMY_TYPES[type];
            const scale = Math.min(Math.max(config.scale, 0.1), 5.0);

            const enemyGroup = new THREE.Group();
            
            // Тело гнома
            const bodyGeometry = new THREE.CapsuleGeometry(0.3 * scale, 0.4 * scale, 4, 8);
            const bodyMaterial = new THREE.MeshPhongMaterial({ color: config.color });
            const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
            body.position.y = 0.4 * scale;
            enemyGroup.add(body);

            // Голова гнома
            const headGeometry = new THREE.SphereGeometry(0.25 * scale, 8, 8);
            const headMaterial = new THREE.MeshPhongMaterial({ color: config.color });
            const head = new THREE.Mesh(headGeometry, headMaterial);
            head.position.y = 0.9 * scale;
            enemyGroup.add(head);

            // Борода гнома
            const beardGeometry = new THREE.ConeGeometry(0.2 * scale, 0.3 * scale, 8);
            const beardMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
            const beard = new THREE.Mesh(beardGeometry, beardMaterial);
            beard.position.set(0, 0.8 * scale, 0.1 * scale);
            beard.rotation.x = 0.2;
            enemyGroup.add(beard);

            // Шляпа гнома
            const hatGeometry = new THREE.ConeGeometry(0.2 * scale, 0.4 * scale, 8);
            const hatMaterial = new THREE.MeshPhongMaterial({ 
                color: type === 'SHOOTER' ? 0xff6600 : 0xff0000 
            });
            const hat = new THREE.Mesh(hatGeometry, hatMaterial);
            hat.position.y = 1.2 * scale;
            enemyGroup.add(hat);

            // Создаем полоску здоровья
            const healthBarWidth = 1.0 * scale;
            const healthBarHeight = 0.1 * scale;
            const healthBarGeometry = new THREE.PlaneGeometry(healthBarWidth, healthBarHeight);
            const healthBarMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            const healthBar = new THREE.Mesh(healthBarGeometry, healthBarMaterial);
            healthBar.position.y = 1.6 * scale;
            enemyGroup.add(healthBar);

            // Безопасное позиционирование
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.max(
                SAFETY_CONSTANTS.MIN_SPAWN_DISTANCE,
                Math.min(GAME_CONFIG.ENEMY_SPAWN_DISTANCE, SAFETY_CONSTANTS.MAX_SPAWN_DISTANCE)
            );

            enemyGroup.position.set(
                Math.cos(angle) * radius,
                GAME_CONFIG.ENEMY_SPAWN_HEIGHT,
                Math.sin(angle) * radius
            );

            sceneRef.current.add(enemyGroup);

            const enemy: Enemy = {
                group: enemyGroup,
                type: type,
                health: Math.min(Math.max(config.health, SAFETY_CONSTANTS.MIN_HEALTH), SAFETY_CONSTANTS.MAX_HEALTH),
                maxHealth: Math.min(Math.max(config.health, SAFETY_CONSTANTS.MIN_HEALTH), SAFETY_CONSTANTS.MAX_HEALTH),
                damage: Math.min(Math.max(config.damage, SAFETY_CONSTANTS.MIN_DAMAGE), SAFETY_CONSTANTS.MAX_DAMAGE),
                speed: Math.min(Math.max(config.speed, SAFETY_CONSTANTS.MIN_SPEED), SAFETY_CONSTANTS.MAX_SPEED),
                lastShot: Date.now(),
                isDestroyed: false,
                healthBar: healthBar
            };

            enemiesRef.current.push(enemy);
            return enemy;
        } catch (error) {
            console.error('Error creating enemy:', error);
            return null;
        }
    }, []);

    // Спавн волны врагов
    const spawnWave = useCallback(() => {
        if (waveInProgress || gameState !== GameState.PLAYING) return;

        setWaveInProgress(true);
        const enemyCount = Math.min(
            GAME_CONFIG.ENEMIES_PER_WAVE + Math.floor(wave*2),
            GAME_CONFIG.MAX_ENEMIES
        );

        for (let i = 0; i < enemyCount; i++) {
            createEnemy(i % 3 === 0 ? 'SHOOTER' : 'BASIC');
        }

        setWaveInProgress(false);
    }, [createEnemy, gameState, wave, waveInProgress]);

    // Эффект для отслеживания завершения волны
    useEffect(() => {
        if (gameState === GameState.PLAYING && !waveInProgress && enemiesRef.current.length === 0) {
            // Увеличиваем номер волны только когда все враги уничтожены
            setWave(prev => prev + 1);
        }
    }, [gameState, waveInProgress, enemiesRef.current.length]);

    // Эффекты
    useEffect(() => {
        const initialized = initGame();
        if (!initialized) {
            console.error('Failed to initialize game');
            return;
        }
    
        // Добавляем обработчики событий
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
    
        let lastTime = 0;
        const animate = (currentTime: number) => {
            if (gameState === GameState.PLAYING) {
                const deltaTime = currentTime - lastTime;
                lastTime = currentTime;
    
                // Обновляем состояние игры
                updateEnemies();
                updateBullets();
                
                // Обновляем позицию игрока и камеру
                if (playerRef.current && cameraRef.current && rendererRef.current) {
                    moveVector.set(0, 0, 0);
                    if (moveStates.current.forward) moveVector.z -= 1;
                    if (moveStates.current.backward) moveVector.z += 1;
                    if (moveStates.current.left) moveVector.x -= 1;
                    if (moveStates.current.right) moveVector.x += 1;
    
                    if (moveVector.lengthSq() > 0) {
                        moveVector.normalize();
                        moveVector.applyQuaternion(playerRef.current.quaternion);
                        moveVector.multiplyScalar(GAME_CONFIG.PLAYER_MAX_SPEED);
    
                        tempVector.copy(playerRef.current.position).add(moveVector);
                        const halfField = GAME_CONFIG.FIELD_SIZE / 2;
                        const playerRadius = 0.5;
    
                        tempVector.x = Math.max(-halfField + playerRadius, Math.min(halfField - playerRadius, tempVector.x));
                        tempVector.z = Math.max(-halfField + playerRadius, Math.min(halfField - playerRadius, tempVector.z));
    
                        playerRef.current.position.copy(tempVector);
                    }
    
                    // Обновляем позицию камеры
                    idealOffset.set(0, GAME_CONFIG.CAMERA_HEIGHT, GAME_CONFIG.CAMERA_DISTANCE);
                    idealOffset.applyQuaternion(playerRef.current.quaternion);
                    idealOffset.add(playerRef.current.position);
                    
                    cameraRef.current.position.copy(idealOffset);
                    cameraRef.current.lookAt(playerRef.current.position);
    
                    rendererRef.current.render(sceneRef.current!, cameraRef.current);
                }
            }
            animationFrameRef.current = requestAnimationFrame(animate);
        };
    
        animationFrameRef.current = requestAnimationFrame(animate);
    
        // Очистка при размонтировании
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (rendererRef.current && containerRef.current && containerRef.current.contains(rendererRef.current.domElement)) {
                containerRef.current.removeChild(rendererRef.current.domElement);
            }
        };
    }, [initGame, gameState, handleKeyDown, handleKeyUp, updateEnemies, updateBullets]);

    

    // Обновляем эффект для спавна волн
    useEffect(() => {
        let waveCheckInterval: NodeJS.Timeout;

        if (gameState === GameState.PLAYING) {
            waveCheckInterval = setInterval(() => {
                // Спавним новую волну только если нет активных врагов и не идет спавн волны
                if (!waveInProgress && enemiesRef.current.length === 0) {
                    spawnWave();
                }
            }, GAME_CONFIG.WAVE_DELAY);
        }

        return () => {
            if (waveCheckInterval) {
                clearInterval(waveCheckInterval);
            }
        };
    }, [gameState, waveInProgress, spawnWave]);

    // Добавляем обработчики для поворота камеры
    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('pointerlockchange', handlePointerLockChange);
        
        if (containerRef.current) {
            containerRef.current.addEventListener('click', requestPointerLock);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('pointerlockchange', handlePointerLockChange);
            
            if (containerRef.current) {
                containerRef.current.removeEventListener('click', requestPointerLock);
            }
        };
    }, [handleMouseMove, handlePointerLockChange, requestPointerLock]);

    return (
        <div className="relative w-full h-screen bg-black">
            {/* Контейнер для Three.js */}
            <div 
                ref={containerRef}
                className="w-full h-full"
                tabIndex={0}
                onMouseDown={(e) => {
                    if (e.button === 0) shoot();
                }}
            />

            {/* Игровой интерфейс */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {/* Здоровье, счет и волна */}
                <div className="absolute top-16 left-4 text-white">
                    <div>HP: {playerHealth}</div>
                    <div>Score: {score}</div>
                    <div>Wave: {wave}</div>
                </div>

                {/* Экран окончания игры */}
                {gameState === GameState.GAME_OVER && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-gray-800 p-8 rounded-lg text-white pointer-events-auto">
                            <h2 className="text-2xl mb-4">game over</h2>
                            <div className="mb-4">Final score : {score}
                                <br /> restart the game - F5
                            </div>
                        </div>
                    </div>
                )}

                {/* Начальное меню */}
                {gameState === GameState.MENU && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-gray-800 p-8 rounded-lg text-white pointer-events-auto">
                            <h1 className="text-3xl mb-4">Goblin vs dwarves</h1>
                            <div className="mb-4">
                                <p>Сontrols:</p>
                                <ul className="list-disc list-inside">
                                    <li>WASD - movement</li>
                                    <li>LMB - shoot</li>    
                                </ul>
                            </div>
                            <button
                                className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
                                onClick={() => setGameState(GameState.PLAYING)}
                            >
                                Start the game
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Game;