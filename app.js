// Classe
class Gallery{

	// Constructeur
	constructor(element){
		// Toutes les images de l'élément dans un array ...spread
		this.list = [ ...element.querySelectorAll('.img') ];
		// Conteneur global section.nature ou city
		this.container = element;
		// Modal element
		this.modal = getElement('.modal');
		// Image principale du modal
		this.modalImg = getElement('.main-img');
		this.imageName = getElement('.image-name');
		// Petites images du modal
		this.modalImages = getElement('.modal-images');
		// Boutons
		this.closeBtn = getElement('.close-btn');
		this.nextBtn = getElement('.next-btn');
		this.prevBtn = getElement('.prev-btn');

		// Events
		// N'oublions pas let that = this qui évite le bind !
		/* Avec la fonction fléchée il n'est pas nécessaire 
		de faire binder la fonction callback à la fin */
		this.container.addEventListener('click', (e) => {
			if (e.target.classList.contains('img')){
				// Nous avons bien cliqué sur l'image
				this.openModal(e.target, this.list);
			}
		});
	};

	// Méthodes
	openModal(selectedImage, list){
		this.setMainImage(selectedImage);
		this.modalImages.innerHTML = list.map((img) => {
			return `<img src="${ img.src }" title="${ img.title }" 
				class="modal-img ${ selectedImage.dataset.id === img.dataset.id ? 'selected' : '' }" 
				data-id="${ img.dataset.id }" alt="city">`;
		}).join('');
		this.modal.classList.add('open');
		// Add eventlistener to btns
		/* Nous plaçons le bind dans une référence pour pouvoir supprimer 
		les event listener à la fermeture de la modale. (memory leak) */
		this.closeModal = this.closeModal.bind(this);
		this.closeBtn.addEventListener('click', this.closeModal);
		this.nextImage = this.nextImage.bind(this);
		this.nextBtn.addEventListener('click', this.nextImage);
		this.prevImage = this.prevImage.bind(this);
		this.prevBtn.addEventListener('click', this.prevImage);
		// Click sur une miniature, nous ciblons le container (bubbling)
		this.chooseImage = this.chooseImage.bind(this);
		this.modalImages.addEventListener('click', this.chooseImage);
	};
	setMainImage(selectedImage){
		this.modalImg.src = selectedImage.src;
		this.imageName.textContent = selectedImage.title;
	};
	// Btns
	closeModal(){
		this.modal.classList.remove('open');
		// Suppression des events listeners
		this.closeBtn.removeEventListener('click', this.closeModal);
		this.nextBtn.removeEventListener('click', this.nextImage);
		this.prevBtn.removeEventListener('click', this.prevImage);
		this.modalImages.removeEventListener('click', this.chooseImage);
	};
	nextImage(){
		// Selected image
		const selectedImage = this.modalImages.querySelector('.selected');
		// Si l'image suivant n'existe pas nous repartons sur la première ,-)
		const next = selectedImage.nextElementSibling || this.modalImages.firstElementChild;
		// Remove selected sur l'ancienne selectedImage
		selectedImage.classList.remove('selected');
		// Add to new
		next.classList.add('selected');
		// Main image
		this.setMainImage(next);
	};
	prevImage(){
		// Selected image
		const selectedImage = this.modalImages.querySelector('.selected');
		// Si l'image suivant n'existe pas nous repartons sur la dernière ,-)
		const prev = selectedImage.previousElementSibling || this.modalImages.lastElementChild;
		// Remove selected sur l'ancienne selectedImage
		selectedImage.classList.remove('selected');
		// Add to new
		prev.classList.add('selected');
		// Main image
		this.setMainImage(prev);
	};
	// Click sur une miniature => setMainImage
	chooseImage(e){
		// Nous avons bien cliqué sur une miniature
		if (e.target.classList.contains('modal-img')){
			this.setMainImage(e.target);
			// Remove selected sur l'ancienne selectedImage
			const selected = this.modalImages.querySelector('.selected');
			selected.classList.remove('selected');
			e.target.classList.add('selected');
		}
	};

};

// Instance
const nature = new Gallery(getElement('.nature'));
const city = new Gallery(getElement('.city'));

// Get element function
function getElement(selection){
	const element = document.querySelector(selection);
	if (element){
		return element;
	}
	throw new Error(`Please check ${ selection } selector, no such element exists.`)
};