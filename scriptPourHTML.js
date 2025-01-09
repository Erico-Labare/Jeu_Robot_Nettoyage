//Version JS secondaire après ajôur du HTML+CSS
//Code plus détaillé sur la version JS ("scriptInitialJS.js")

//fonction d'initialisation de la grille
function initialiserGrille(largeur, hauteur, pourcentageSale) {
    const grille = [];
    for (let y = 0; y < hauteur; y++) {
        const ligne = [];
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
    const grilleElement = document.getElementById("grille");
    grilleElement.innerHTML = "";

    for (let y = 0; y < grille.length; y++) {
        const ligne = document.createElement("tr");
        for (let x = 0; x < grille[y].length; x++) {
            const caseActuelle = grille[y][x];
            const cellule = document.createElement("td");

            if (robot.x === x && robot.y === y) {
                cellule.textContent = "R";
                cellule.classList.add("propre");
            } else {
                cellule.classList.add(caseActuelle.propre ? "propre" : "sale");
            }
            ligne.appendChild(cellule);
        }
        grilleElement.appendChild(ligne);
    }
}

//function d'affichage des messages
function afficherMessage(message) {
    const messagesElement = document.getElementById("messages");
    messagesElement.textContent += message + "\n";

    messagesElement.scrollTop = messagesElement.scrollHeight;
}

//fonction de recherche des cases sales et de leur trajet
function trouverCaseSaleLaPlusProche(grille, robot) {
    const directions = [
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
    ];

    const queue = [{ x: robot.x, y: robot.y, chemin: [] }];
    const visites = new Set([`${robot.x},${robot.y}`]);

    while (queue.length > 0) {
        const { x, y, chemin } = queue.shift();

        if (!grille[y][x].propre) {
            return chemin;
        }

        for (const dir of directions) {
            const newX = x + dir.x;
            const newY = y + dir.y;

            if (
                newX >= 0 &&
                newX < grille[0].length &&
                newY >= 0 &&
                newY < grille.length &&
                !visites.has(`${newX},${newY}`)
            ) {
                visites.add(`${newX},${newY}`);
                queue.push({ x: newX, y: newY, chemin: [...chemin, { x: newX, y: newY }] });
            }
        }
    }

    return null;
}

//fonction d'éxcution des tâches du robot
function nettoyerGrille(largeur, hauteur, pourcentageSale) {
    const grille = initialiserGrille(largeur, hauteur, pourcentageSale);
    const robot = { x: 0, y: 0 };
    let enPause = false;

    const interval = setInterval(() => {
        if (enPause) return;

        afficherGrille(grille, robot);

        if (grille.flat().every(cell => cell.propre)) {
            afficherMessage("\n👏 Toutes les cases sont propres. 👏\nNettoyage fini.");
            clearInterval(interval);
            return;
        }

        if (!grille[robot.y][robot.x].propre) {
            afficherMessage(`>>> Nettoyage de la case [${robot.x}, ${robot.y}].`);
            grille[robot.y][robot.x].propre = true;

            enPause = true;
            setTimeout(() => {
                enPause = false;
            }, 500);
            return;
        }

        const chemin = trouverCaseSaleLaPlusProche(grille, robot);

        if (chemin && chemin.length > 0) {
            const prochaineCase = chemin[0];
            afficherMessage(`==> Le robot se déplace de [${robot.x}, ${robot.y}] à [${prochaineCase.x}, ${prochaineCase.y}]`);
            robot.x = prochaineCase.x;
            robot.y = prochaineCase.y;
        } else {
            afficherMessage("!!! Bug : Aucune case sale accessible. !!!");
            clearInterval(interval);
            return;
        }
    }, 200);
    return interval;
}

let jeuEnCours = null;

//Activation du jeu
document.getElementById("lancerJeu").addEventListener("click", () => {
    if (jeuEnCours) {
        clearInterval(jeuEnCours);
        jeuEnCours = null;
    }

    const largeur = parseInt(document.getElementById("largeur").value, 10);
    const hauteur = parseInt(document.getElementById("hauteur").value, 10);
    const pourcentageSale = parseFloat(document.getElementById("pourcentageSale").value);

    if (
        isNaN(largeur) || largeur <= 0 || isNaN(hauteur) || hauteur <= 0 || isNaN(pourcentageSale) || pourcentageSale < 0 || pourcentageSale > 1
    ) {
        alert("Veuillez entrer des valeurs valides.");
        return;
    }

    document.getElementById("messages").textContent = "";
    document.getElementById("grille").innerHTML = "";

    jeuEnCours = nettoyerGrille(largeur, hauteur, pourcentageSale);
});