let depenses = JSON.parse(localStorage.getItem('depenses')) || [];

function sauvegarderDepenses(){
localStorage.setItem('depenses', JSON.stringify(depenses));
}
let init_id = 1;

let modification = false;
let idmodification = null;

function sanitizeNumericInput(inputElement) {
    if (!inputElement) return;

    inputElement.addEventListener('input', () => {
        inputElement.value = inputElement.value.replace(/[^0-9]/g, '');// Remove non-numeric characters
    });
}

sanitizeNumericInput(document.getElementById('amount'));
sanitizeNumericInput(document.getElementById('ramount'));
//fonction de creation d'un objet depense

function new_depense(name, amount, category){
    let depense = {
        id : init_id,
        name : name,
        amount : Number(amount),
        category : category

    }
    init_id++;
    
    return depense;

}

let ajout = document.getElementById('ajout_form');
ajout.addEventListener('submit', (e)=>{
    e.preventDefault();
    if(modification === false){
        ajouter();
    }else{
        modifier(idmodification);
    }
});

//fonction d'ajout d'une depense 
function ajouter(){
    let name = document.getElementById('name').value.trim();
    let amountValue = document.getElementById('amount').value.trim();
    let amount = Number(amountValue);
    let category = document.getElementById('category').value.trim();

    //empecher l'enregistrement d'un champ vide

    if(name !== '' && amountValue !== '' && category !== '' && Number.isFinite(amount) && amount >= 0){
        let depense = new_depense(name, amount, category);
        depenses.push(depense);
        afficher(depenses);
        sauvegarderDepenses();

        resetForm();
    }else{
        alert('veuillez remplir le champ vide et saisir un montant valide');
    }
}

//reinitialier le formulare

function resetForm(){
    document.getElementById('name').value = ""
    document.getElementById('amount').value = ""
    document.getElementById('category').value = ""

    document.getElementById('btn_submit').textContent = "Ajouter"

    modification = false;
    idmodification = null;
}


//fonction d'affichage

function formatMontant(montant){
    return Number(montant).toLocaleString('fr-FR');
}

function afficher(tableau){
    let tbody= document.querySelector('tbody');
    tbody.textContent='';
    let total = 0;

    tableau.forEach(depense => {
        total += depense.amount;
        
        let ligne = document.createElement('tr');
        let cell_name = document.createElement('td');
        let cell_amount = document.createElement('td');
        let cell_category = document.createElement('td');
        let cell_action = document.createElement('td');
        let btn_modifier = document.createElement('button');
        let btn_supprimer = document.createElement('button');

        btn_modifier.type = 'button';
        btn_supprimer.type = 'button';
        btn_modifier.className = 'btn-modify';
        btn_supprimer.className = 'btn-supprimer';

        cell_name.textContent = depense.name;
        cell_amount.textContent = formatMontant(depense.amount) + " "+"FCFA";
        cell_category.textContent = depense.category;
        

        btn_modifier.textContent = "Modifier"
        btn_supprimer.textContent = "supprimer"

        
        
        tbody.appendChild(ligne);
        ligne.appendChild(cell_name);
        ligne.appendChild(cell_amount);
        ligne.appendChild(cell_category);
        ligne.appendChild(cell_action);
        cell_action.appendChild(btn_modifier);
        cell_action.appendChild(btn_supprimer);


        btn_modifier.addEventListener('click', ()=>{
            pmodifier(depense.id);
        });

        btn_supprimer.addEventListener('click', ()=>{
            supprimer(depense.id);
        });

       
        

    });  
    let total_row = document.createElement('tr');
    let total_cell = document.createElement('td');
    let total_amount_cell = document.createElement('td');
    total_cell.textContent = "Total des depenses";
    total_amount_cell.textContent = formatMontant(total) + " "+"FCFA";
    total_row.appendChild(total_cell);
    total_row.appendChild(total_amount_cell);
    tbody.appendChild(total_row);

}

//preparer une modification

function pmodifier(id){
    
    let depense = depenses.find(d => d.id === id);
    
    if(!depense){
        alert('depense introuvable.');
        return;
    }
    document.getElementById('name').value = depense.name;
    document.getElementById('amount').value = depense.amount;
    document.getElementById('category').value = depense.category;

    let mid = depense.id;

    document.getElementById('btn_submit').textContent = "Modifier";
    modification = true;
    idmodification = mid;
    
}

// fonction de modification d'une depense 

function modifier(id){
    let name = document.getElementById('name').value.trim();
    let amountValue = document.getElementById('amount').value.trim();
    let amount = Number(amountValue);
    let category = document.getElementById('category').value.trim();

    if(name === "" || amountValue === "" || category === "" || !Number.isFinite(amount) || amount < 0){
        alert('veuillez saisir les espaces vides et un montant valide');
        return;
    }

    depenses = depenses.map(depense =>{
        if(depense.id === id){
            return{
                id: depense.id,
                name: name,
                amount: Number(amount),
                category : category,

            }
        }
       
        return depense;

    });
    sauvegarderDepenses();
    afficher(depenses);
    resetForm();
}
//fonction de suppression d'une depense
function supprimer(id){
    depenses = depenses.filter(depense => depense.id !== id);
    sauvegarderDepenses();
    afficher(depenses);
}

// fonction de recherche d'une depense

let recherche = document.getElementById('form_filter');
recherche.addEventListener('submit', filtre_depense);

function filtre_depense(e){
    e.preventDefault();
     let category_seach = document.getElementById('rcategory').value.trim();
     let amount_seach = document.getElementById('ramount').value.trim();
    let name_seach = document.getElementById('rname').value.trim();

    if(amount_seach !== '' && !/^\d+$/.test(amount_seach)){
        alert('Le montant de recherche ne doit contenir que des chiffres');
        return;
    }

     if(category_seach === "" && amount_seach === "" && name_seach === ""){
        afficher(depenses);
        alert('veuillez saisir un critere de recherche');
        return;
     }else if(category_seach !== "" && amount_seach === "" && name_seach ===""){
        let result = depenses.filter(depense => depense.category.toLowerCase() === category_seach.toLowerCase());
        afficher(result);
        return;
     }else if(category_seach === "" && amount_seach !== "" && name_seach ===""){
        let result = depenses.filter(depense => depense.amount === Number(amount_seach));
        afficher(result);
        return;
     }
     else if(category_seach === "" && amount_seach === "" && name_seach !==""){
        let result = depenses.filter(depense => depense.name.toLowerCase() === name_seach.toLowerCase());
        afficher(result);
        return;
     }else{
        let result = depenses.filter(depense => depense.category.toLowerCase() === category_seach.toLowerCase() && depense.amount === Number(amount_seach) && depense.name ===name_seach.toLowerCase);
        afficher(result);
        return;
     }
}


let tri_name = document.getElementById('tri_name');
tri_name.addEventListener('click', ()=>{
    depenses.sort((a,b)=>a.name.localeCompare(b.name));
    alert('les depenses sont triées par nom');
    afficher(depenses);
    
});

let tri_amount = document.getElementById('tri_amount');
tri_amount.addEventListener("click", function(){
    depenses.sort((a,b)=> a.amount-b.amount);
afficher(depenses); });

let tri_category = document.getElementById('tri_category');
tri_category.addEventListener('click',()=>{
    depenses.sort((a,b)=> a.category.localeCompare(b.category));
    afficher(depenses);
})

afficher(depenses);












