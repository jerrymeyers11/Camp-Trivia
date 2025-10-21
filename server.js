// server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Game datasets - 4 different games with their own questions and badge prefixes
const GAME_DATASETS = {
    1: {
        badgePrefix: 'g1_',
        meritBadgeNames: {
            5: "Firewood Badge",
            3: "Hockey Badge",
            8: "Physical Challenge",
            9: "Red Nose Badge",
            12: "Twin Badge",
            1: "Balloon Badge",
            10: "Thing-a-ma-jig Badge",
            11: "Physical Challenge"
        },
        questions: [
            {
                id: 1,
                meritBadge: 5,
                question: "In Wet Hot American Summer, who plays the eccentric camp counselor Gene who talks to a can of vegetables?",
                multipleChoice: [
                    "A) David Hyde Pierce",
                    "B) Paul Rudd",
                    "C) Christopher Meloni"
                ],
                answer: "Christopher Meloni"
            },
            {
                id: 2,
                meritBadge: 3,
                question: "In the original Friday the 13th, what is the name of the camp where a group of teenage counselors is stalked and murdered?",
                multipleChoice: [
                    "A) Camp Crystal Lake",
                    "B) Camp Green Lake",
                    "C) Camp Placid"
                ],
                answer: "Camp Crystal Lake"
            },
            {
                id: 3,
                meritBadge: 8,
                type: "physical",
                question: "Physical Challenge",
                answer: "Physical Challenge Complete"
            },
            {
                id: 4,
                meritBadge: 9,
                question: "In a season 4 episode of the Simpsons, what kind of “refreshment” are the kids served at Kamp Krusty?",
                multipleChoice: [
                    "A) Krusty Burgers",
                    "B) Krusty Brand Gruel",
                    "C) Krusty Brand Imitation Gruel"
                ],
                answer: "Krusty Brand Imitation Gruel"
            },
            {
                id: 5,
                meritBadge: 12,
                question: "The 1998 movie The Parent Trap, starring Lindsay Lohan, is set at what summer camp where the twin sisters first meet?",
                multipleChoice: [
                    "A) Camp Walden",
                    "B) Camp Northwood",
                    "C) Camp Redwood"
                ],
                answer: "Camp Walden"
            },
            {
                id: 6,
                meritBadge: 1,
                question: "Which animated movie features a talking dog named Dug, a wilderness explorer, and a senior citizen who flies his house to Paradise Falls?",
                multipleChoice: [
                    "A) Brave",
                    "B) Up",
                    "C) The Jungle Book"
                ],
                answer: "Up"
            },
            {
                id: 7,
                meritBadge: 10,
                question: "In the movie Addams Family Values, what is the name of the summer camp that Wednesday and Pugsley are sent to?",
                multipleChoice: [
                    "A) Camp Chippewa",
                    "B) Camp Harmony",
                    "C) Camp Sunnybrook"
                ],
                answer: "Camp Chippewa"
            },
            {
                id: 8,
                meritBadge: 11,
                type: "physical",
                question: "Physical Challenge",
                answer: "Physical Challenge Complete"
            }
        ]
    },
    2: {
        badgePrefix: 'g2_',
        meritBadgeNames: {
            5: "The Cloud Filer",
            3: "The Data Vault",
            8: "Data Migrator",
            9: "The Optimizer",
            12: "AI in a Box",
            1: "The Searcher",
            10: "The Good Tenant",
            11: "Data Drop"
        },
        questions: [
            {
                id: 1,
                meritBadge: 5,
                question: "What’s the only enterprise file storage service native to Azure and based on NetApp ONTAP?",
                multipleChoice: [
                    "A) Azure ONTAP",
                    "B) Azure NetApp Files",
                    "C) NetApp for Azure"
                ],
                answer: "Azure NetApp Files"
            },
            {
                id: 2,
                meritBadge: 3,
                question: "According to NVIDIA’s Jensen Huang, which storage vendor holds approximately 50% of the world’s files?",
                multipleChoice: [
                    "A) Pure",
                    "B) Dell",
                    "C) NetApp"
                ],
                answer: "NetApp"
            },
            {
                id: 3,
                meritBadge: 8,
                type: "physical",
                question: "Physical Challenge",
                answer: "Physical Challenge Complete"
            },
            {
                id: 4,
                meritBadge: 9,
                question: "What fully managed storage service is supported by NetApp Workload Factory, a free intelligent optimization and automation service?",
                multipleChoice: [
                    "A) Azure NetApp Files",
                    "B) Amazon FSx for NetApp ONTAP",
                    "C) Google Cloud NetApp Volumes"
                ],
                answer: "Amazon FSx for NetApp ONTAP"
            },
            {
                id: 5,
                meritBadge: 12,
                question: "What is the name of NetApp’s infrastructure based on NVIDIA BasePOD? ",
                multipleChoice: [
                    "A) NetApp DataPod",
                    "B) NetApp AIPod",
                    "C) NetApp StoragePad"
                ],
                answer: "NetApp AIPod"
            },
            {
                id: 6,
                meritBadge: 1,
                question: "What open-source capability found in Cassandra, PostgreSQL, Kafka and OpenSearch enables semantic search for AI workloads that are fully supported by NetApp Instaclustr? ",
                multipleChoice: [
                    "A) Vector databases",
                    "B) Vector graphics",
                    "C) Attack vectors"
                ],
                answer: "Vector databases"
            },
            {
                id: 7,
                meritBadge: 10,
                question: "What key ONTAP feature differentiates NetApp from other storage vendors also certified for the NVIDIA Cloud Partner program?",
                multipleChoice: [
                    "A) Network file storage (NFS)",
                    "B) Storage area network (SAN)",
                    "C) Secure multitenancy (SVM)"
                ],
                answer: "Secure multitenancy (SVM)"
            },
            {
                id: 8,
                meritBadge: 11,
                type: "physical",
                question: "Physical Challenge",
                answer: "Physical Challenge Complete"
            }
        ]
    },
    3: {
        badgePrefix: 'g3_',
        meritBadgeNames: {
            5: "The Classifier",
            3: "File and Blocker",
            8: "Data Capture",
            9: "Cloud Cacher",
            12: "The Hack Watcher",
            1: "The Ontap Badge",
            10: "The Open Sourcer",
            11: "Data Placement"
        },
        questions: [
            {
                id: 1,
                meritBadge: 5,
                question: "NetApp separates the AI pipeline into Prepare, Train and Deploy. Classification is an example of which?",
                multipleChoice: [
                    "A) Prepare",
                    "B) Train",
                    "C) Deploy"
                ],
                answer: "Prepare"
            },
            {
                id: 2,
                meritBadge: 3,
                question: "What’s the fully managed enterprise file and block storage service offered by Google Cloud?",
                multipleChoice: [
                    "A) Google Cloud ONTAP",
                    "B) Google Cloud NetApp Volumes",
                    "C) Google Volumes ONTAP"
                ],
                answer: "Google Cloud NetApp Volumes"
            },
            {
                id: 3,
                meritBadge: 8,
                type: "physical",
                question: "Physical Challenge",
                answer: "Physical Challenge Complete"
            },
            {
                id: 4,
                meritBadge: 9,
                question: "What ONTAP feature is ideal for bursting to the cloud to leverage GPUaaS?",
                multipleChoice: [
                    "A) SnapLock",
                    "B) FlexClone",
                    "C) FlexCache"
                ],
                answer: "FlexCache"
            },
            {
                id: 5,
                meritBadge: 12,
                question: "Which fully managed storage service was the first to support autonomous ransomware protection?",
                multipleChoice: [
                    "A) Azure NetApp Files",
                    "B) Google Cloud NetApp Volumes",
                    "C) Amazon FSx for NetApp ONTAP"
                ],
                answer: "Amazon FSx for NetApp ONTAP"
            },
            {
                id: 6,
                meritBadge: 1,
                question: "Which AI software vendor was first to integrate with ONTAP as part of their console?",
                multipleChoice: [
                    "A) NVIDIA",
                    "B) Domino Data Lab",
                    "C) Amazon Web Services"
                ],
                answer: "Domino Data Lab"
            },
            {
                id: 7,
                meritBadge: 10,
                question: "NetApp Instaclustr provides fully managed services and support for which open-source technologies?",
                multipleChoice: [
                    "A) Cassandra, PostgreSQL, Kafka Connect",
                    "B) ClickHouse, OpenSearch, Cadence",
                    "C) All of the above"
                ],
                answer: "All of the above"
            },
            {
                id: 8,
                meritBadge: 11,
                type: "physical",
                question: "Physical Challenge",
                answer: "Physical Challenge Complete"
            }
        ]
    },
    4: {
        badgePrefix: 'g4_',
        meritBadgeNames: {
            5: "The Cloud Filer",
            3: "The Data Vault",
            8: "Refactor It",
            9: "The Optimizer",
            12: "AI in a Box",
            1: "The Searcher",
            10: "The Good Tenant",
            11: "Data Identifier"
        },
        questions: [
            {
                id: 1,
                meritBadge: 5,
                question: "What’s the only enterprise file storage service native to Azure and based on NetApp ONTAP?",
                multipleChoice: [
                    "A) Azure ONTAP",
                    "B) Azure NetApp Files",
                    "C) NetApp for Azure"
                ],
                answer: "Azure NetApp Files"
            },
            {
                id: 2,
                meritBadge: 3,
                question: "According to NVIDIA’s Jensen Huang, which storage vendor holds approximately 50% of the world’s files?",
                multipleChoice: [
                    "A) Pure",
                    "B) Dell",
                    "C) NetApp"
                ],
                answer: "NetApp"
            },
            {
                id: 3,
                meritBadge: 8,
                type: "physical",
                question: "Audio Challenge",
                answer: "Physical Challenge Complete"
            },
            {
                id: 4,
                meritBadge: 9,
                question: "What fully managed storage service is supported by NetApp Workload Factory, a free intelligent optimization and automation service?",
                multipleChoice: [
                    "A) Azure NetApp Files",
                    "B) Amazon FSx for NetApp ONTAP",
                    "C) Google Cloud NetApp Volumes"
                ],
                answer: "Amazon FSx for NetApp ONTAP"
            },
            {
                id: 5,
                meritBadge: 12,
                question: "What is the name of NetApp’s infrastructure based on NVIDIA BasePOD? ",
                multipleChoice: [
                    "A) NetApp DataPod",
                    "B) NetApp AIPod",
                    "C) NetApp StoragePad"
                ],
                answer: "NetApp AIPod"
            },
            {
                id: 6,
                meritBadge: 1,
                question: "What open-source capability found in Cassandra, PostgreSQL, Kafka and OpenSearch enables semantic search for AI workloads that are fully supported by NetApp Instaclustr? ",
                multipleChoice: [
                    "A) Vector databases",
                    "B) Vector graphics",
                    "C) Attack vectors"
                ],
                answer: "Vector databases"
            },
            {
                id: 7,
                meritBadge: 10,
                question: "What key ONTAP feature differentiates NetApp from other storage vendors also certified for the NVIDIA Cloud Partner program?",
                multipleChoice: [
                    "A) Network file storage (NFS)",
                    "B) Storage area network (SAN)",
                    "C) Secure multitenancy (SVM)"
                ],
                answer: "Secure multitenancy (SVM)"
            },
            {
                id: 8,
                meritBadge: 11,
                type: "physical",
                question: "Audio Challenge",
                answer: "Physical Challenge Complete"
            }
        ]
    }
};

// Game state with phases
let gameState = {
    selectedGame: null, // Which game (1-4) is selected
    scores: { p1: 0, p2: 0, p3: 0 },
    playerNames: { p1: 'Team One', p2: 'Team Two', p3: 'Team Three' },
    currentQuestionIndex: 0, // Index into QUESTIONS array
    activePlayer: null, // Who buzzed in
    buzzersActive: false,
    usedBadges: new Set(), // Track which merit badges have been used
    gamePhase: 'GAME_SELECTION', // GAME_SELECTION, WAITING, LIGHTS, BADGE_SELECTION, QUESTION_SHOWN, MULTIPLE_CHOICE_SHOWN, PLAYER_BUZZED, INCORRECT_ANSWER, CORRECT_ANSWER
    attemptedPlayers: [], // Track who has already tried to answer this question
    multipleChoiceRevealed: false // Track if MC was shown for current question
};

// Helper function to get the current game's questions
function getCurrentQuestions() {
    if (!gameState.selectedGame) return [];
    return GAME_DATASETS[gameState.selectedGame].questions;
}

// Helper function to get the current game's badge prefix
function getBadgePrefix() {
    if (!gameState.selectedGame) return '';
    return GAME_DATASETS[gameState.selectedGame].badgePrefix;
}

// Helper function to get the current game's merit badge names
function getMeritBadgeNames() {
    if (!gameState.selectedGame) return {};
    return GAME_DATASETS[gameState.selectedGame].meritBadgeNames;
}

// A map to keep track of clients and their roles
const clients = new Map();

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        console.log('Received:', data);

        switch (data.type) {
            case 'select_game':
                console.log('Game selected:', data.gameNumber);
                gameState.selectedGame = data.gameNumber;
                gameState.gamePhase = 'WAITING';
                // Broadcast the selected game, badge prefix, and merit badge names to all clients
                broadcast({
                    type: 'game_selected',
                    gameNumber: data.gameNumber,
                    badgePrefix: getBadgePrefix(),
                    meritBadgeNames: getMeritBadgeNames()
                });
                broadcastGameState();
                break;

            case 'identify':
                clients.set(ws, { role: data.role, playerId: data.playerId, playerName: data.playerName });

                // If solo host is connecting, ensure we're in a good starting state
                if (data.role === 'host_solo') {
                    console.log('Solo host connected - checking game state');
                    console.log('Current game phase:', gameState.gamePhase);
                    // If we're in an unexpected state, reset to GAME_SELECTION
                    if (gameState.gamePhase !== 'GAME_SELECTION' && gameState.gamePhase !== 'WAITING' && gameState.gamePhase !== 'READY_FOR_BADGE_SEQUENCE') {
                        console.log('Resetting game phase to GAME_SELECTION for solo host');
                        gameState.gamePhase = 'GAME_SELECTION';
                        gameState.selectedGame = null;
                    }
                }

                // If a contestant is registering with a name, update the game state
                if (data.role === 'contestant' && data.playerName && data.playerId) {
                    gameState.playerNames[data.playerId] = data.playerName;
                    // Broadcast updated game state to all clients when name changes
                    broadcastGameState();
                } else {
                    // Send the current game state to the newly connected client
                    ws.send(JSON.stringify({ type: 'game_state', state: gameState }));
                }
                break;

            case 'select_question':
                if (gameState.currentQuestion) return; // Don't allow new question if one is active
                gameState.currentQuestion = data.questionId;
                gameState.buzzersActive = true;
                gameState.activePlayer = null;
                gameState.answeredQuestions.push(data.questionId);
                broadcast({ type: 'question_selected', questionId: data.questionId });
                break;

            case 'buzz_in':
                // Only allow buzzing if in the right phase and player hasn't already tried
                if ((gameState.gamePhase === 'QUESTION_SHOWN' || gameState.gamePhase === 'MULTIPLE_CHOICE_SHOWN') && 
                    gameState.buzzersActive && 
                    !gameState.activePlayer && 
                    !gameState.attemptedPlayers.includes(data.playerId)) {
                    
                    gameState.activePlayer = data.playerId;
                    gameState.buzzersActive = false;
                    gameState.gamePhase = 'PLAYER_BUZZED';
                    broadcast({ 
                        type: 'buzzer_winner', 
                        playerId: data.playerId,
                        playerName: gameState.playerNames[data.playerId] 
                    });
                    broadcastGameState();
                }
                break;
            
            case 'ruling':
                if (gameState.gamePhase === 'PLAYER_BUZZED' && gameState.activePlayer) {
                    gameState.attemptedPlayers.push(gameState.activePlayer);
                    
                    if (data.result === 'correct') {
                        // Award points based on whether multiple choice was revealed
                        const points = gameState.multipleChoiceRevealed ? 1 : 3;
                        gameState.scores[gameState.activePlayer] += points;
                        gameState.gamePhase = 'CORRECT_ANSWER';
                        broadcast({ type: 'correct_answer', scores: gameState.scores, points: points });
                        // Delay showing answer to allow correct.wav to play first
                        setTimeout(() => {
                            handleGameAdvance();
                        }, 500); // 500ms delay for correct sound to play
                    } else {
                        // Incorrect answer - play wrong sound
                        broadcast({ type: 'play_wrong_sound' });

                        // Check if other players can still try
                        const remainingPlayers = ['p1', 'p2', 'p3'].filter(p => !gameState.attemptedPlayers.includes(p));

                        if (remainingPlayers.length > 0) {
                            // Other players can still try - return to appropriate phase
                            gameState.activePlayer = null;
                            gameState.buzzersActive = true;
                            gameState.gamePhase = gameState.multipleChoiceRevealed ? 'MULTIPLE_CHOICE_SHOWN' : 'QUESTION_SHOWN';
                            broadcast({ type: 'next_buzzer_chance', remainingPlayers });
                        } else {
                            // No one got it right - move to next question without points
                            gameState.gamePhase = 'CORRECT_ANSWER'; // Trigger the answer reveal and next question
                            handleGameAdvance();
                        }
                    }
                    broadcastGameState();
                }
                break;

            case 'reset_game':
                 gameState = {
                    selectedGame: null,
                    scores: { p1: 0, p2: 0, p3: 0 },
                    playerNames: { p1: 'Team One', p2: 'Team Two', p3: 'Team Three' },
                    currentQuestionIndex: 0,
                    activePlayer: null,
                    buzzersActive: false,
                    usedBadges: new Set(),
                    gamePhase: 'GAME_SELECTION',
                    attemptedPlayers: [],
                    multipleChoiceRevealed: false
                };
                broadcastGameState();
                break;

            case 'advance_game':
                handleGameAdvance();
                break;

            case 'trigger_lights':
                console.log('Broadcasting trigger_lights');
                broadcast({ type: 'trigger_lights' });
                break;

            case 'physical_challenge_score':
                console.log('=== PHYSICAL CHALLENGE SCORE ===');
                console.log('Message data:', data);
                if (gameState.gamePhase === 'PHYSICAL_CHALLENGE') {
                    const { playerId } = data;
                    console.log('Player ID:', playerId);
                    console.log('Current scores before:', gameState.physicalChallengeScores);
                    if (gameState.physicalChallengeScores && gameState.physicalChallengeScores[playerId] !== undefined) {
                        gameState.physicalChallengeScores[playerId]++;
                        console.log('Current scores after:', gameState.physicalChallengeScores);
                        broadcast({
                            type: 'physical_challenge_scores_update',
                            scores: gameState.physicalChallengeScores
                        });
                    } else {
                        console.log('ERROR: Invalid player ID or scores not initialized');
                    }
                }
                break;

            case 'physical_challenge_complete':
                console.log('=== PHYSICAL CHALLENGE COMPLETE ===');
                console.log('Current game phase:', gameState.gamePhase);
                console.log('Physical challenge scores:', gameState.physicalChallengeScores);
                console.log('Current main scores:', gameState.scores);

                if (gameState.gamePhase === 'PHYSICAL_CHALLENGE') {
                    // Add physical challenge scores to main scores
                    gameState.scores.p1 += gameState.physicalChallengeScores.p1 || 0;
                    gameState.scores.p2 += gameState.physicalChallengeScores.p2 || 0;
                    gameState.scores.p3 += gameState.physicalChallengeScores.p3 || 0;

                    console.log('Updated main scores:', gameState.scores);

                    // Broadcast updated scores to all clients
                    const scoreMessage = {
                        type: 'update_scores',
                        scores: gameState.scores
                    };
                    console.log('Broadcasting score update:', scoreMessage);
                    broadcast(scoreMessage);

                    // Hide plank and move to next question
                    broadcast({ type: 'hide_plank' });

                    if (gameState.currentQuestionIndex < getCurrentQuestions().length - 1) {
                        gameState.currentQuestionIndex++;
                        gameState.gamePhase = 'READY_FOR_BADGE_SEQUENCE';
                        gameState.physicalChallengeScores = null;
                    } else {
                        console.log('All questions complete - checking for ties!');

                        // Check for ties
                        const scores = gameState.scores;
                        const sortedScores = [
                            { player: 'p1', score: scores.p1 },
                            { player: 'p2', score: scores.p2 },
                            { player: 'p3', score: scores.p3 }
                        ].sort((a, b) => b.score - a.score);

                        const highestScore = sortedScores[0].score;
                        const tiedPlayers = sortedScores.filter(p => p.score === highestScore);

                        if (tiedPlayers.length > 1) {
                            console.log('TIE DETECTED after physical challenge! Tied players:', tiedPlayers.map(p => p.player));
                            gameState.gamePhase = 'TIEBREAKER_READY';
                            gameState.tiedPlayers = tiedPlayers.map(p => p.player);
                        } else {
                            console.log('No tie - ready to reveal winner');
                            gameState.gamePhase = 'READY_TO_REVEAL_WINNER';
                        }
                        gameState.physicalChallengeScores = null;
                    }

                    // Broadcast updated game state so host interface updates
                    console.log('Broadcasting updated game state after physical challenge');
                    broadcastGameState();
                } else {
                    console.log('ERROR: Not in PHYSICAL_CHALLENGE phase, current phase:', gameState.gamePhase);
                }
                break;

            case 'add_points':
                if (data.playerId && data.points) {
                    gameState.scores[data.playerId] = (gameState.scores[data.playerId] || 0) + data.points;
                    broadcast({ type: 'update_scores', scores: gameState.scores });
                }
                break;

            case 'trigger_badge_sequence':
                console.log('Broadcasting trigger_badge_sequence');
                broadcast({ type: 'trigger_badge_sequence' });
                break;

            case 'trigger_badge_sequence_2':
                console.log('Broadcasting trigger_badge_sequence_2');
                broadcast({ type: 'trigger_badge_sequence_2' });
                break;

            case 'show_question':
                console.log('Broadcasting show_question');
                broadcast({ type: 'show_question' });
                break;

            case 'show_answer':
                console.log('Broadcasting show_answer');
                broadcast({ type: 'show_answer' });
                break;

            case 'hide_plank':
                console.log('Broadcasting hide_plank');
                broadcast({ type: 'hide_plank' });
                break;

            case 'show_question_2':
                console.log('Broadcasting show_question_2');
                broadcast({ type: 'show_question_2' });
                break;

            case 'show_multiple_choice':
                console.log('=== SERVER RECEIVED SHOW_MULTIPLE_CHOICE ===');
                console.log('Current question index:', gameState.currentQuestionIndex);
                console.log('Current game phase:', gameState.gamePhase);
                const currentMC = getCurrentQuestions()[gameState.currentQuestionIndex];
                console.log('Current question data:', currentMC);

                if (currentMC) {
                    console.log('Broadcasting show_multiple_choice with data');

                    // RESET ATTEMPTED PLAYERS - everyone gets a second chance with multiple choice!
                    console.log('Resetting attempted players - all players can buzz in again');
                    gameState.attemptedPlayers = [];
                    gameState.buzzersActive = true; // Reactivate buzzers for all players
                    gameState.activePlayer = null; // Clear any active player

                    broadcast({
                        type: 'show_multiple_choice',
                        questionData: currentMC
                    });
                    gameState.gamePhase = 'MULTIPLE_CHOICE_SHOWN';
                    gameState.multipleChoiceRevealed = true;

                    // Broadcast updated game state so player screens re-enable their buzzers
                    broadcastGameState();

                    console.log('Multiple choice broadcast completed - all players can buzz in again');
                } else {
                    console.log('ERROR: No current question found!');
                }
                break;

            case 'show_multiple_choice_2':
                console.log('Broadcasting show_multiple_choice_2');
                broadcast({ type: 'show_multiple_choice_2' });
                break;

            case 'show_answer_2':
                console.log('Broadcasting show_answer_2');
                broadcast({ type: 'show_answer_2' });
                break;

            case 'hide_plank_2':
                console.log('Broadcasting hide_plank_2');
                broadcast({ type: 'hide_plank_2' });
                break;

            case 'test_question_position':
                console.log('Broadcasting test_question_position');
                broadcast({ type: 'test_question_position' });
                break;

            case 'test_multiple_choice_position':
                console.log('Broadcasting test_multiple_choice_position');
                broadcast({ type: 'test_multiple_choice_position' });
                break;

            case 'test_answer_position':
                console.log('Broadcasting test_answer_position');
                broadcast({ type: 'test_answer_position' });
                break;

            case 'roll_in_tv_cart':
                console.log('Broadcasting roll_in_tv_cart');
                broadcast({ type: 'roll_in_tv_cart' });
                break;

            case 'roll_out_tv_cart':
                console.log('Broadcasting roll_out_tv_cart');
                broadcast({ type: 'roll_out_tv_cart' });
                break;

            case 'tv_ad_start':
                console.log('TV Ad starting - rolling in cart and playing video');
                gameState.gamePhase = 'TV_AD_PLAYING';
                broadcast({ type: 'roll_in_tv_cart' });
                broadcastGameState();
                break;

            case 'tv_ad_end':
                console.log('TV Ad ending - rolling out cart and continuing game');
                gameState.gamePhase = 'READY_FOR_BADGE_SEQUENCE';
                broadcast({ type: 'roll_out_tv_cart' });
                broadcastGameState();
                break;

            case 'show_winner':
                console.log('Broadcasting show_winner test');
                broadcast({
                    type: 'show_winner',
                    winner: data.winner,
                    score: data.score
                });
                break;

            case 'set_team_names':
                console.log('Setting team names:', data.teamNames);
                gameState.playerNames = {
                    p1: data.teamNames.p1,
                    p2: data.teamNames.p2,
                    p3: data.teamNames.p3
                };
                // Broadcast updated game state with new team names
                broadcastGameState();
                break;

            case 'adjust_scores':
                console.log('Adjusting scores to:', data.scores);
                gameState.scores = {
                    p1: data.scores.p1,
                    p2: data.scores.p2,
                    p3: data.scores.p3
                };
                // Broadcast score update to all clients
                broadcast({ type: 'update_scores', scores: gameState.scores });
                // Also broadcast updated game state
                broadcastGameState();
                break;

            case 'tiebreaker_winner':
                console.log('Tiebreaker winner selected:', data.playerId);
                // Award 1 point to the selected player
                gameState.scores[data.playerId] += 1;

                // Clear tiebreaker state
                gameState.tiedPlayers = null;
                gameState.gamePhase = 'WINNER_REVEALED';

                // Broadcast score update
                broadcast({ type: 'update_scores', scores: gameState.scores });

                // Find winner details
                const tbWinnerName = gameState.playerNames[data.playerId] || `Team ${data.playerId.slice(-1)}`;
                const tbWinnerScore = gameState.scores[data.playerId];

                console.log(`Tiebreaker won by: ${tbWinnerName} with ${tbWinnerScore} points`);

                // Hide tiebreaker screen and show winner immediately
                broadcast({
                    type: 'tiebreaker_complete',
                    winner: tbWinnerName,
                    score: tbWinnerScore
                });

                // Broadcast updated game state so host interface updates (including closing script)
                broadcastGameState();
                break;

            case 'player_correct_solo':
                console.log(`Player ${data.playerId} answered correctly for ${data.points} points`);
                // Add points to the player's score
                gameState.scores[data.playerId] += data.points;

                // Broadcast correct answer with updated scores to play correct.wav
                broadcast({ type: 'correct_answer', scores: gameState.scores, points: data.points });

                // Delay showing answer to allow correct.wav to play first
                setTimeout(() => {
                    // Show the answer and advance the game
                    const currentQ = getCurrentQuestions()[gameState.currentQuestionIndex];
                    if (currentQ) {
                        broadcast({
                            type: 'show_answer',
                            questionData: currentQ
                        });
                    }

                    // Update game phase
                    gameState.gamePhase = 'ANSWER_SHOWN';
                    gameState.activePlayer = null;
                    gameState.buzzersActive = false;

                    console.log(`Updated scores:`, gameState.scores);
                    console.log('Setting game phase to ANSWER_SHOWN and broadcasting...');

                    // Broadcast updated game state so clients know we're in ANSWER_SHOWN phase
                    broadcastGameState();

                    console.log('Game state broadcast sent with phase:', gameState.gamePhase);
                }, 500); // 500ms delay for correct sound to play
                break;

            case 'question_done':
                console.log('Host clicked Done - moving to next round');

                // Hide the answer plank
                broadcast({ type: 'hide_plank' });

                // Check if we just completed question 5 (index 4) - time for TV ad
                if (gameState.currentQuestionIndex === 4) {
                    console.log('Question 5 completed - transitioning to TV ad phase');
                    gameState.currentQuestionIndex++; // Move to index 5 (question 6)
                    gameState.gamePhase = 'TV_AD_READY';
                    gameState.multipleChoiceRevealed = false;
                    gameState.attemptedPlayers = [];
                    gameState.activePlayer = null;
                    gameState.buzzersActive = false;
                    console.log('TV ad phase ready - host can click "TV Ad" button');
                } else {
                    // Normal progression for all other questions
                    // Move to next question
                    gameState.currentQuestionIndex++;

                    // Check if game is complete
                    if (gameState.currentQuestionIndex >= getCurrentQuestions().length) {
                        console.log('Game complete - checking for ties!');

                        // Check for ties
                        const scores = gameState.scores;
                        const sortedScores = [
                            { player: 'p1', score: scores.p1 },
                            { player: 'p2', score: scores.p2 },
                            { player: 'p3', score: scores.p3 }
                        ].sort((a, b) => b.score - a.score);

                        const highestScore = sortedScores[0].score;
                        const tiedPlayers = sortedScores.filter(p => p.score === highestScore);

                        if (tiedPlayers.length > 1) {
                            console.log('TIE DETECTED! Tied players:', tiedPlayers.map(p => p.player));
                            gameState.gamePhase = 'TIEBREAKER_READY';
                            gameState.tiedPlayers = tiedPlayers.map(p => p.player);
                        } else {
                            console.log('No tie - ready to reveal winner');
                            gameState.gamePhase = 'READY_TO_REVEAL_WINNER';
                        }
                    } else {
                        // Set up for next question
                        gameState.gamePhase = 'READY_FOR_BADGE_SEQUENCE';
                        gameState.multipleChoiceRevealed = false;
                        gameState.attemptedPlayers = [];
                        gameState.activePlayer = null;
                        gameState.buzzersActive = false;
                    }

                    console.log(`Advanced to question ${gameState.currentQuestionIndex + 1}`);
                }

                // Broadcast updated game state so button changes appropriately
                broadcastGameState();
                break;

            case 'physical_challenge_complete_solo':
                console.log('=== PHYSICAL CHALLENGE COMPLETE SOLO ===');
                console.log('Physical challenge completed with scores:', data.scores);
                console.log('Current question index:', gameState.currentQuestionIndex);
                console.log('Total questions:', getCurrentQuestions().length);

                // Add the physical challenge points to main scores
                gameState.scores.p1 += data.scores.p1 || 0;
                gameState.scores.p2 += data.scores.p2 || 0;
                gameState.scores.p3 += data.scores.p3 || 0;

                console.log(`Updated scores after physical challenge:`, gameState.scores);

                // Hide the physical challenge plank
                broadcast({ type: 'hide_plank' });

                // Move directly to next question (skip the answer step)
                gameState.currentQuestionIndex++;

                // Check if game is complete
                if (gameState.currentQuestionIndex >= getCurrentQuestions().length) {
                    console.log('All questions complete - checking for ties!');

                    // Check for ties
                    const scores = gameState.scores;
                    const sortedScores = [
                        { player: 'p1', score: scores.p1 },
                        { player: 'p2', score: scores.p2 },
                        { player: 'p3', score: scores.p3 }
                    ].sort((a, b) => b.score - a.score);

                    const highestScore = sortedScores[0].score;
                    const tiedPlayers = sortedScores.filter(p => p.score === highestScore);

                    if (tiedPlayers.length > 1) {
                        console.log('TIE DETECTED after physical challenge! Tied players:', tiedPlayers.map(p => p.player));
                        gameState.gamePhase = 'TIEBREAKER_READY';
                        gameState.tiedPlayers = tiedPlayers.map(p => p.player);
                    } else {
                        console.log('No tie - ready to reveal winner');
                        gameState.gamePhase = 'READY_TO_REVEAL_WINNER';
                    }
                } else {
                    // Set up for next question
                    gameState.gamePhase = 'READY_FOR_BADGE_SEQUENCE';
                    gameState.multipleChoiceRevealed = false;
                    gameState.attemptedPlayers = [];
                    gameState.activePlayer = null;
                    gameState.buzzersActive = false;
                }

                console.log(`Physical challenge complete - advanced to question ${gameState.currentQuestionIndex + 1}`);

                // Broadcast updated game state so button changes to "Choose Question" or "Reveal Winner"
                broadcastGameState();
                break;

            case 'reveal_winner_final':
                console.log('Emergency end game - checking for ties first');

                // Check for ties
                const scores = gameState.scores;
                const sortedScores = [
                    { player: 'p1', score: scores.p1 },
                    { player: 'p2', score: scores.p2 },
                    { player: 'p3', score: scores.p3 }
                ].sort((a, b) => b.score - a.score);

                const highestScore = sortedScores[0].score;
                const tiedPlayers = sortedScores.filter(p => p.score === highestScore);

                if (tiedPlayers.length > 1) {
                    // There's a tie - go to tiebreaker
                    console.log('TIE DETECTED in emergency end! Tied players:', tiedPlayers.map(p => p.player));
                    gameState.gamePhase = 'TIEBREAKER_READY';
                    gameState.tiedPlayers = tiedPlayers.map(p => p.player);
                    broadcastGameState();
                } else {
                    // No tie - reveal winner immediately
                    let winnerPlayerId = sortedScores[0].player;
                    const winnerName = gameState.playerNames[winnerPlayerId] || `Team ${winnerPlayerId.slice(-1)}`;

                    console.log(`Final winner: ${winnerName} with ${highestScore} points`);

                    // Show winner display
                    gameState.gamePhase = 'WINNER_REVEALED';
                    broadcast({
                        type: 'show_winner',
                        winner: winnerName,
                        score: highestScore
                    });
                    broadcastGameState();
                }
                break;

            case 'audio_enabled':
                console.log('Gameboard audio enabled');
                // Broadcast audio status to all clients (especially host_solo)
                broadcast({
                    type: 'audio_status',
                    enabled: true
                });
                break;

            case 'play_outro':
                console.log('Play outro requested - playing closing theme again');
                // Broadcast to gameboard to play closing theme
                broadcast({
                    type: 'play_outro'
                });
                break;

            case 'start_preshow':
                console.log('Starting preshow - triggering lights and playing preshow music');
                gameState.gamePhase = 'PRESHOW_ACTIVE';
                // Trigger lights animation (will loop until Start Game is clicked)
                broadcast({ type: 'trigger_preshow_lights' });
                // Play preshow music
                broadcast({ type: 'play_preshow_music' });
                broadcastGameState();
                break;
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        clients.delete(ws);
    });
});

function handleGameAdvance() {
    console.log(`=== HANDLE GAME ADVANCE ===`);
    console.log(`Current game phase: ${gameState.gamePhase}`);
    console.log(`Current question index: ${gameState.currentQuestionIndex}`);
    console.log(`Game state:`, gameState);

    switch (gameState.gamePhase) {
        case 'PRESHOW_ACTIVE':
            // Start Game clicked during preshow -> stop preshow and start normal game
            console.log('Stopping preshow and starting game');
            broadcast({ type: 'stop_preshow_music' });
            gameState.gamePhase = 'LIGHTS';
            broadcast({ type: 'trigger_lights' });
            // After 10 seconds, change to READY_FOR_BADGE_SEQUENCE but don't auto-advance
            setTimeout(() => {
                if (gameState.gamePhase === 'LIGHTS') {
                    gameState.gamePhase = 'READY_FOR_BADGE_SEQUENCE';
                    broadcastGameState();
                }
            }, 10000);
            break;

        case 'WAITING':
            // Start Game -> trigger lights sequence
            gameState.gamePhase = 'LIGHTS';
            broadcast({ type: 'trigger_lights' });
            // After 10 seconds, change to READY_FOR_BADGE_SEQUENCE but don't auto-advance
            setTimeout(() => {
                if (gameState.gamePhase === 'LIGHTS') {
                    gameState.gamePhase = 'READY_FOR_BADGE_SEQUENCE';
                    broadcastGameState();
                }
            }, 10000);
            break;
            
        case 'READY_FOR_BADGE_SEQUENCE':
            // Host clicked "Next Question" -> trigger badge sequence
            gameState.gamePhase = 'BADGE_SELECTION';
            console.log(`=== SERVER DEBUG ===`);
            console.log(`Current question index: ${gameState.currentQuestionIndex}`);
            console.log(`QUESTIONS array length: ${getCurrentQuestions().length}`);
            const currentQuestion = getCurrentQuestions()[gameState.currentQuestionIndex];
            console.log(`Current question:`, currentQuestion);
            if (currentQuestion) {
                console.log(`Merit badge: ${currentQuestion.meritBadge}`);
                // Trigger badge sequence for this question's merit badge
                // Don't add to usedBadges yet - do that after the sequence
                const message = {
                    type: 'trigger_badge_sequence',
                    targetBadge: currentQuestion.meritBadge,
                    usedBadges: Array.from(gameState.usedBadges)
                };
                console.log(`Broadcasting message:`, message);
                broadcast(message);

                // Add current badge to used badges after sending the message
                gameState.usedBadges.add(currentQuestion.meritBadge);
            } else {
                console.error(`ERROR: No question found at index ${gameState.currentQuestionIndex}`);
            }
            // After badge sequence, change to READY_TO_SHOW_QUESTION but don't auto-advance
            setTimeout(() => {
                if (gameState.gamePhase === 'BADGE_SELECTION') {
                    gameState.gamePhase = 'READY_TO_SHOW_QUESTION';
                    broadcastGameState();
                }
            }, 3000);
            break;
            
        case 'READY_TO_SHOW_QUESTION':
            // Host clicked "Show Question" -> show question and activate buzzers (or physical challenge)
            const currentQ = getCurrentQuestions()[gameState.currentQuestionIndex];
            if (currentQ && currentQ.type === 'physical') {
                // Physical challenge - no buzzers, special interface
                gameState.gamePhase = 'PHYSICAL_CHALLENGE';
                gameState.buzzersActive = false;
                gameState.physicalChallengeScores = { p1: 0, p2: 0, p3: 0 };
                broadcast({
                    type: 'show_physical_challenge',
                    questionData: currentQ
                });
            } else {
                // Regular question - activate buzzers
                gameState.gamePhase = 'QUESTION_SHOWN';
                if (currentQ) {
                    broadcast({
                        type: 'show_question',
                        questionData: currentQ
                    });
                }
                gameState.buzzersActive = true;
            }
            gameState.attemptedPlayers = [];
            gameState.multipleChoiceRevealed = false;
            break;
            
        case 'QUESTION_SHOWN':
            // Host clicked "Multiple Choice" -> show MC and keep buzzers active
            gameState.gamePhase = 'MULTIPLE_CHOICE_SHOWN';
            const currentMC = getCurrentQuestions()[gameState.currentQuestionIndex];
            if (currentMC) {
                broadcast({
                    type: 'show_multiple_choice',
                    questionData: currentMC
                });
            }
            gameState.multipleChoiceRevealed = true;
            // Buzzers stay active, but now worth 1 point
            break;
            
        case 'PLAYER_BUZZED':
            // This is handled by correct/incorrect buttons
            break;
            
        case 'CORRECT_ANSWER':
            // Show answer and pause for host to click "Done"
            const currentAnswer = getCurrentQuestions()[gameState.currentQuestionIndex];
            if (currentAnswer) {
                broadcast({
                    type: 'show_answer',
                    questionData: currentAnswer
                });
            }
            gameState.gamePhase = 'ANSWER_SHOWN';
            break;

        case 'ANSWER_SHOWN':
            // Host clicked "Done" - hide plank and prepare for next question
            broadcast({ type: 'hide_plank' });

            // Move to next question or end game
            if (gameState.currentQuestionIndex < getCurrentQuestions().length - 1) {
                gameState.currentQuestionIndex++;
                gameState.gamePhase = 'READY_FOR_BADGE_SEQUENCE';
                gameState.activePlayer = null;
                gameState.attemptedPlayers = [];
                gameState.multipleChoiceRevealed = false;
            } else {
                // Game complete - check for ties
                console.log('All questions complete - checking for ties!');

                const scores = gameState.scores;
                const sortedScores = [
                    { player: 'p1', score: scores.p1 },
                    { player: 'p2', score: scores.p2 },
                    { player: 'p3', score: scores.p3 }
                ].sort((a, b) => b.score - a.score);

                const highestScore = sortedScores[0].score;
                const tiedPlayers = sortedScores.filter(p => p.score === highestScore);

                if (tiedPlayers.length > 1) {
                    console.log('TIE DETECTED! Tied players:', tiedPlayers.map(p => p.player));
                    gameState.gamePhase = 'TIEBREAKER_READY';
                    gameState.tiedPlayers = tiedPlayers.map(p => p.player);
                } else {
                    console.log('No tie - ready to reveal winner');
                    gameState.gamePhase = 'READY_TO_REVEAL_WINNER';
                }
            }
            break;

        case 'TIEBREAKER_READY':
            // Host clicked "Tiebreaker" button - show tiebreaker screen
            gameState.gamePhase = 'TIEBREAKER_ACTIVE';
            broadcast({
                type: 'show_tiebreaker',
                tiedPlayers: gameState.tiedPlayers
            });
            break;

        case 'READY_TO_REVEAL_WINNER':
        case 'GAME_COMPLETE':
            // Host clicked "Reveal Winner" - show winner on plank
            gameState.gamePhase = 'WINNER_REVEALED';

            // Find the winner (highest score)
            const scores = gameState.scores;
            const playerNames = gameState.playerNames;
            let winner = 'p1';
            let highestScore = scores.p1;

            if (scores.p2 > highestScore) {
                winner = 'p2';
                highestScore = scores.p2;
            }
            if (scores.p3 > highestScore) {
                winner = 'p3';
                highestScore = scores.p3;
            }

            const winnerName = playerNames[winner] || `Team ${winner.slice(-1)}`;

            console.log(`Winner: ${winnerName} with ${highestScore} points`);

            // Show winner on plank
            broadcast({
                type: 'show_winner',
                winner: winnerName,
                score: highestScore
            });
            break;
    }
    
    // Always broadcast updated state
    broadcastGameState();
}

function broadcast(data) {
    const message = JSON.stringify(data);
    console.log('Broadcasting:', data);
    for (const [client] of clients.entries()) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    }
}

// Enhanced broadcast for game state that includes question data for host
function broadcastGameState() {
    const currentQuestion = getCurrentQuestions()[gameState.currentQuestionIndex];
    const gameStateForBroadcast = {
        ...gameState,
        // Add current question data for host notes (only if host_solo is connected)
        currentQuestion: currentQuestion ? {
            meritBadge: currentQuestion.meritBadge,
            question: currentQuestion.question,
            answer: currentQuestion.answer,
            multipleChoice: currentQuestion.multipleChoice
        } : null,
        // Add badge prefix for gameboard
        badgePrefix: getBadgePrefix()
    };

    broadcast({ type: 'game_state', state: gameStateForBroadcast });
}

// Export the server creation function for Electron
function createServer(callback) {
    const PORT = process.env.PORT || 8080;
    server.listen(PORT, () => {
        console.log(`Server is listening on http://localhost:${PORT}`);
        console.log(`Open gameboard, host, and contestant pages in browser.`);
        if (callback) callback();
    });
    return server;
}

// If running standalone (not imported by Electron)
if (require.main === module) {
    createServer();
}

// Export for use in Electron
module.exports = { createServer };