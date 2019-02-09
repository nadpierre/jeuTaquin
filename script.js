/**--------------------
 * LOGIQUE DU JEU
 * --------------------
*/

/* Jeu de taquin */
function Taquin(dimension){
	
	this.dimension = dimension;
	this.grille = new Array();
	this.nbCases = dimension * dimension;
	this.caseVide = (dimension * dimension) - 1;
	this.nbDeplacements = 0;
	
	
	//Générer la grille en fonction de la dimension
	for(let i = 0; i < dimension; i++) {
		let lignes = new Array();
		for(let j = 0; j < dimension; j++) {
			lignes.push(dimension*i + j);
		}
		this.grille.push(lignes);
	}
	
	//Afficher la grille sous forme de chaîne de caractères
	this.toString = function(){
		let affichage = "";
		
		for(let i = 0; i < dimension; i++){
			for(let j = 0; j < dimension; j++){
				if((j + 1) % dimension == 0){
					affichage += this.grille[i][j] + "\n";
				}
				else{
					affichage += this.grille[i][j] + " ";
				}
			}
		}
		
		return affichage;
	}
	
	//Mélanger les chiffres de la grille
	this.melanger = function() {
		let temp;
		
		for(let i = dimension - 1; i >= 0; i--) {
			for(let j = dimension - 1; j >= 0; j--){
				let x = Math.floor(Math.random() * (i + 1));
				let y = Math.floor(Math.random() * (j + 1));
				temp = this.grille[i][j];
				this.grille[i][j] = this.grille[x][y];
				this.grille[x][y] = temp;
				
			}
		}
		
	}
	
	//Calculer le nombre d'inversions
	this.getNbInversions = function() {
		
		let tableau = new Array();
		let compteur = 0;
		
		//Convertir le tableau 2D en tableau 1D
		for(let i = 0; i < dimension; i++) {
			for(let j = 0; j < dimension; j++){
				tableau.push(this.grille[i][j]);
				
			}
		}
		
		//Compter les paires
		for(let i = 0; i < this.nbCases - 1; i++) {
			for(let j = i + 1; j < this.nbCases; j++){
				if (tableau[j] != this.caseVide && tableau[i] != this.caseVide && tableau[i] > tableau[j]) {
					compteur++;
				}
			}
		}
		
		return compteur;
	}
	
	//Trouver l'index de la case vide
	this.getPositionVide = function() {
		
		for(let i = dimension - 1; i >= 0; i--) {
			for(let j = dimension - 1; j >= 0; j--){
				if(this.grille[i][j] == this.caseVide){
					return dimension - i;
				}
			}
		} 	
	}
	
	
	//Vérifier si un puzzle est solvable
	this.estSolvable = function() {
		
		let nbInversions = this.getNbInversions();
		let index = this.getPositionVide();
		
		if(dimension % 2 != 0){//si la dimension est impaire, le nombre d'inversions doit être pair
			return (nbInversions % 2 == 0);
		}
		else {//si la dimension est paire
			if(index % 2 != 0){//si l'index est impair, le nombre d'inversions doit être pair
				return (nbInversions % 2 == 0);
			}
		}
		
	}
	
	
	//Générer une grille de puzzle solvable
	this.genererPuzzle = function() {
		do {
			this.melanger();
		}
		while(!this.estSolvable());
	}
	
	//Permuter deux cases avec les coordonnées passées en paramètre
	this.permuter = function(x1, y1, x2, y2){
		let temp;
		
		temp = this.grille[x1][y1];
		this.grille[x1][y1] = this.grille[x2][y2];
		this.grille[x2][y2] = temp;
	}
	
	//Deplacer une case adjacente à une case vide
	this.deplacer = function(ligne, colonne) {
		
		//Déplacement vers le haut
		if(ligne - 1 >= 0 && this.grille[ligne - 1][colonne] == this.caseVide) {
			this.permuter(ligne, colonne, ligne - 1, colonne);
			return true;
		}
		
		//Déplacement vers le bas
		else if(ligne + 1 < dimension && this.grille[ligne + 1][colonne] == this.caseVide) {
			this.permuter(ligne, colonne, ligne + 1, colonne);
			return true;
		}
		
		//Déplacement vers la gauche
		else if(colonne - 1 >= 0 && this.grille[ligne][colonne - 1] == this.caseVide) {
			this.permuter(ligne, colonne, ligne, colonne - 1);
			return true;
		}
		
		//Déplacement vers la droite
		else if(colonne + 1 < dimension && this.grille[ligne][colonne + 1] == this.caseVide) {
			this.permuter(ligne, colonne, ligne, colonne + 1);
			return true;
		}
		
		return false;
		
		
	}
	
	//Valider si le joueur a gagné
	this.estGagnant = function() {
		
		let compteur = 0;
		
		for(let i = 0; i < dimension; i++) {
			for(let j = 0; j < dimension;j++) {
				if(this.grille[i][j] == (dimension * i) + j){
					compteur++;
				}
			}
		}
		console.log("Bonnes cases : " + compteur);
		return (compteur == this.nbCases);
		
	}
	
}


/**--------------------
 * INTERFACE GRAPHIQUE
 * --------------------
*/

/* Tuile */
function Tuile(x, y, valeur, contexte, largeur, hauteur){
	
	this.x = x;
	this.y = y;
	this.valeur = valeur
	this.contexte = contexte;
	this.largeur = largeur;
	this.hauteur = hauteur;
	
	
	//Dessiner une tuile
	this.dessiner = function(img, xImg, yImg, xDessin, yDessin) {
		
		//"Dessiner" l'image
		contexte.drawImage(img, xImg, yImg, this.largeur, this.hauteur, xDessin, yDessin, this.largeur, this.hauteur);
		
		//Dessiner le carré par dessus (pour créer une grille)
		contexte.strokeStyle = "#0D2D7B";
		contexte.lineWidth = 10;
		contexte.beginPath();
		contexte.moveTo(xDessin, yDessin);
		contexte.lineTo(xDessin, yDessin + hauteur);
		contexte.lineTo(xDessin + largeur, yDessin + hauteur);
		contexte.lineTo(xDessin + largeur, yDessin);
		contexte.lineTo(xDessin, yDessin);
		contexte.closePath();
		contexte.stroke();
	}
}

/* Aire de jeu */
function AireJeu(jeuTaquin, photo){
	
	this.jeuTaquin = jeuTaquin;
	this.canevas = document.getElementById("monCanevas");
	this.contexte = this.canevas.getContext("2d");
	this.tuiles = new Array();
	this.photo = photo;
	
	//Faire en sorte de ne pas dessiner tant que l'image est pas chargée
	this.photo.onload = this.dessiner;
	
	//Dessiner le casse-tête (et rafraîchir la grille)
	this.dessiner = function() {
		let grille = this.jeuTaquin.grille;
		let dimension = this.jeuTaquin.dimension;
		
		this.canevas.width = this.photo.width;
		let largeurImage = this.canevas.width;
		
		this.canevas.height = this.photo.height;
		let hauteurImage = this.canevas.height;
		
		let largeurTuile = largeurImage / dimension;
		let hauteurTuile = hauteurImage / dimension;
		
		//Remplir le tableau de tuiles
		for(let i = 0; i < jeuTaquin.dimension; i++) {
			let lignes = new Array();
			for(let j = 0; j < jeuTaquin.dimension; j++) {
				lignes.push(new Tuile(i, j, grille[i][j], this.contexte, largeurTuile, hauteurTuile));
			}
			this.tuiles.push(lignes);
		}
		
		//Parcourir le tableau de tuiles pour les dessiner
		for(let i = 0; i < dimension; i++){
			for(let j = 0; j < dimension; j++) {
				let valeur = grille[i][j];
				let x = Math.floor(valeur / dimension);
				let y = valeur % dimension;
				if(valeur != this.jeuTaquin.caseVide) {
					this.tuiles[i][j].dessiner(this.photo, y*largeurTuile, x*hauteurTuile, j*largeurTuile, i*hauteurTuile);
				}
				
			}
		}
	}

}


/**--------------------
 * CONTRÔLEUR
 * --------------------
*/

//Télécharger l'image
var illustration = document.getElementById('illustration');
var photo = new Image();
photo.src = "images/paysage.jpg";


window.onload = function(){
	//Cacher la grille de jeu
	document.getElementById("jeu").style.display = "none";

	//Placer l'image sur la section d'accueil et la section de jeu
	document.getElementById('imageIntro').src = photo.src;
	document.getElementById('imageSolution').src = photo.src;
}

//Jouer un effet sonore
function jouerSon(fichier, boucle){
	var son = new Audio();
	son.src = fichier ;
	son.loop = boucle;
	son.load();
	son.play();
}
		
//Méthode principale
function jouer() {
	//Jouer le son de pièces qui se brisent et la musique de fond
	jouerSon('audio/briser.mp3', false);

	let canevas = document.getElementById("monCanevas");
	
	//Déterminer la difficulté du puzzle en fonction du choix de l'utilisateur
	let choix = document.getElementById("choix");
	let dimension = choix.options[choix.selectedIndex].value;
	
	//Cacher l'interface d'introduction et afficher l'interface de jeu
	document.getElementById("intro").style.display = "none";
	document.getElementById("jeu").style.display = "flex";
	
	//Instanciation du jeu de taquin (logique)
	let monJeu = new Taquin(dimension);
	
	//Afficher la grille ordonnée
	console.log("Grille initiale : \n" + monJeu.toString());
	
	//Mélanger la grille
	monJeu.genererPuzzle();
	console.log("Grille mélangée : \n" + monJeu.toString());

	//Intégrer la logique à l'aire de jeu
	let aireJeu = new AireJeu(monJeu, photo);

	//Dessiner l'interface
	aireJeu.dessiner();

	//Afficher le chronomètre
	let secondesTotales = 0;
	let temps = "";
	let id = setInterval(function(){ 
		secondesTotales++; 
		
		//Formatter les secondes
		let heures = Math.floor(secondesTotales / 3600);
		secondesTotales %= 3600;
		let minutes = Math.floor(secondesTotales / 60);
		let secondes = secondesTotales % 60;
		heures = String(heures).padStart(2, '0');
		minutes = String(minutes).padStart(2, '0');
		secondes = String(secondes).padStart(2, '0');
		document.getElementById('affichage_chronometre').innerHTML = heures + ":" + minutes + ":" + secondes;
		//Arrêter le chronomètre lorsque la partie est terminée
		if(monJeu.estGagnant()){
			clearInterval(id);
		}
	}, 1000);

	
	//Écouteur de clics de souris
	canevas.addEventListener('click', function(e){
		
		let rect = canevas.getBoundingClientRect();
		let posX = e.clientX - rect.left;
		let posY = e.clientY - rect.top;
		let taille = document.getElementById('imageSolution').width / dimension;
		
		//Récupérer les coordonnées de l'endroit où on a cliqué dans le canevas
		let x = Math.floor(posX / taille);
		let y = Math.floor(posY / taille);
	
		//Valider les déplacements
		if(monJeu.deplacer(y, x)) {
			monJeu.nbDeplacements = monJeu.nbDeplacements + 1;
			//Jouer le son de tiroir qui glisse
			jouerSon('audio/tiroir.mp3', false);
			console.log("Nombre de déplacements : " + monJeu.nbDeplacements +  "\n" + monJeu.toString());
			aireJeu.dessiner(monJeu);
			
			//Valider si le joueur a gagné
			if(monJeu.estGagnant()){
				//Remplacer le canevas en photo
				canevas.parentNode.removeChild(canevas);
				let photoGagnante = document.createElement('img');
				photoGagnante.src = photo.src;
				let zoneJeu = document.getElementById('zoneJeu');
				zoneJeu.appendChild(photo);
				
				//Envoyer un message au joueur
				setTimeout(jouerSon('audio/bravo.mp3', false), 1000);
				setTimeout(function(){ alert("Vous avez réussi !"); }, 1000);
			}	
			
		}
		
	}, true);

}


