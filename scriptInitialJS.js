//Version JS inital avant ajôur du HTML+CSS

//fonction d'initialisation de la grille
function initialiserGrille(largeur, hauteur, pourcentageSale) {
    const grille = [];
    for (let y = 0; y < hauteur; y++) {
        const ligne = [];
        // determination initiale de la propreté d'une case par pourcentage
        for (let x = 0; x < largeur; x++) {
            const estSale = Math.random() < pourcentageSale;
            ligne.push({ propre: !estSale });
        }
        grille.push(ligne);
    }
    return grille;
}

//Fonction d'affichage des cases de la grille
function afficherGrille(grille, robot) {
    console.clear();
    console.log("Grille :");
    console.log("".padEnd(grille[0].length * 3, "."));
    grille.forEach((ligne, y) => {
        let affichage = "";
        // |X = propre ; |  = sale
        ligne.forEach((caseActuelle, x) => {
            if (robot.x === x && robot.y === y) {
                affichage += "|R";
            } else {
                affichage += caseActuelle.propre ? "|X" : "| ";
            }
        });
        // fin de la barrière pour avoir |X| et | | en affichage
        affichage += "|";
        console.log(affichage);
    });
    console.log("".padEnd(grille[0].length * 3, "."));
}

//fonction de recherche des cases sales et de leur trajet
function trouverCaseSaleLaPlusProche(grille, robot) {
    const directions = [
        { x: 0, y: -1 }, // haut
        { x: 0, y: 1 },  // bas
        { x: -1, y: 0 }, // gauche
        { x: 1, y: 0 },  // droite
    ];

    // file d'attente qui va contenir les positions du robot et les chemins parcourus
    const queue = [{ x: robot.x, y: robot.y, chemin: [] }];
    // pour garder une trace des cases déjà visitées
    const visites = new Set([`${robot.x},${robot.y}`]);

    // tant que la file d'attente queue n'est pas vide, on continue de parcourir sur la grille
    while (queue.length > 0) {
        const { x, y, chemin } = queue.shift();

        // vérif si case sale
        if (!grille[y][x].propre) {
            return chemin;
        }

        // recherche case voisine avec directions
        for (const d of directions) {
            const newX = x + d.x;
            const newY = y + d.y;

            if (
                // vérifie que la nouvelle position est dans les limites horizontales de la grille
                newX >= 0 &&
                newX < grille[0].length &&
                // vérifie que la nouvelle position est dans les limites verticales de la grille
                newY >= 0 &&
                newY < grille.length &&
                // vérifie que la case voisine n'a pas déjà été visitée.
                !visites.has(`${newX},${newY}`)
            ) {
                // ajout a liste cases visités
                visites.add(`${newX},${newY}`);
                // ajout a la file d'attente
                queue.push({ x: newX, y: newY, chemin: [...chemin, { x: newX, y: newY }] });
            }
        }
    }

    // si rien n'est touvé
    return null;
}

//fonction d'éxcution des tâches du robot
function nettoyerGrille(largeur, hauteur, pourcentageSale) {
    const grille = initialiserGrille(largeur, hauteur, pourcentageSale);
    const robot = { x: 0, y: 0 };
    // timer specifique pour mettre un temps mort quand est besoin
    let enPause = false;

    //timer general pour chaque boucle d'action
    const interval = setInterval(() => {
        if (enPause) return;

        afficherGrille(grille, robot);

        // activation de la fin  quand nettoyage total
        if (grille.flat().every(cell => cell.propre)) {
            console.log("Toutes les cases sont propres. Fin de l'opération.");
            clearInterval(interval);
            return;
        }

        // nettoyage de la case ou se trouve le robot
        if (!grille[robot.y][robot.x].propre) {
            console.log(`Nettoyage de la case [${robot.x}, ${robot.y}].`);
            grille[robot.y][robot.x].propre = true;

            // exemple activation du timer
            enPause = true;
            setTimeout(() => {
                enPause = false;
            }, 1350);
            return;
        }

        const chemin = trouverCaseSaleLaPlusProche(grille, robot);

        //deplacmeent du robot en fonction du chemin trouvé
        if (chemin && chemin.length > 0) {
            const prochaineCase = chemin[0];
            console.log(`Le robot se déplace de [${robot.x}, ${robot.y}] à [${prochaineCase.x}, ${prochaineCase.y}]`);
            robot.x = prochaineCase.x;
            robot.y = prochaineCase.y;
        } else {
            console.log("Bug : Aucune case sale accessible.");
            clearInterval(interval);
            return;
        }

    }, 1000);
}

// appel de la fontion principale.
nettoyerGrille(6, 5, 0.5);