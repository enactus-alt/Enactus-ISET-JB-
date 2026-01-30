import initPreloader from './preloader.js';
import initHero from './hero.js';
import initUI from './ui-interactions.js';
import initTransitions from './transition.js';
import initParticles from './particles.js';
import initMission from './mission.js';
import initTeam from './team.js';
import initProjects from './projects.js';
import initContact from './contact.js';
import { initNavigation } from './navigation.js';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    console.log("Enactus ISET Djerba - Future Makers Initializing...");

    // Initialize Navigation first
    initNavigation();

    // Initialize Global UI 
    initUI();
    initTransitions();
    initParticles();

    // Initialize Features
    initMission();
    initTeam();
    initProjects();
    initContact();

    // Initialize Preloader & Hero
    initPreloader(() => {
        console.log("Preloader finished, starting Hero...");
        initHero();
    });
});
