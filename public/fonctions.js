//fonctions pour ajouter
export const ajouterCrypto=()=>{
    const buttonSubmit=document.querySelector("#submit");
buttonSubmit.addEventListener("click",(event)=>{
    event.preventDefault(); 
    const nom = document.querySelector("#nom-input").value;
    const prix = document.querySelector("#prix-input").value;
    const quantite = document.querySelector("#qte-input").value;
    const symbole = document.querySelector("#symbole-input").value;
    const categorie = document.querySelector("#cat-input").value;
    const date=document.querySelector("#date-input").value;

    const crypto={
        "name":nom,
        "prix":Number(prix),
        "quantite":Number(quantite),
        "symbole":symbole,
        "categorie":categorie,
        "date":date
    }

    let cryptos=JSON.parse(localStorage.getItem("cryptos")) || [];

    cryptos.push(crypto);
    localStorage.setItem("cryptos", JSON.stringify(cryptos));

        document.querySelector("#nom-input").value = "";
        document.querySelector("#prix-input").value = "";
        document.querySelector("#qte-input").value = "";
        document.querySelector("#symbole-input").value = "";
        document.querySelector("#cat-input").value = "";
        document.querySelector("#date-input").value = "";

    location.reload();
});
}

//fonction pour afficher
export const afficherCryptos=()=>{
     let cryptos=JSON.parse(localStorage.getItem("cryptos")) || [];
             const arrAffichage=document.querySelector("#actifs-tbody"); 
 cryptos.forEach((element, index) => {
            const {categorie,date,name,prix,quantite,symbole}=element;
            let CryptoArr=[name,symbole,prix,quantite,categorie,date];
            // console.log(CryptoArr);
            arrAffichage.innerHTML+=`
                        <tr>
                        <td class="seeCrypto">${name}</td>
                        <td class="seeCrypto"><span class="badge text-bg-dark border" style="border-color:var(--line)!important;">${symbole}</span></td>
                        <td class="seeCrypto">${quantite}</td>
                        <td class="seeCrypto">${prix}</td>
                        <td class="seeCrypto">${categorie}</td>
                        <td class="seeCrypto">${date}</td>
                        <td class="text-end">
                          <button class="btn btn-sm btn-outline-light update"  data-bs-toggle="modal" data-bs-target="#exampleModal"  data-index="${index}" type="button"><i class="bi bi-pencil"></i></button>
                          <button class=" delete btn btn-sm btn-outline-danger" data-index="${index}" type="button"><i class="bi bi-trash"></i></button>
                        </td>
                        </tr>
                        `
        });
}

//fonction pour supprimer


export const suppCrypto = () => {
  const deleteBtns = document.querySelectorAll(".delete");
  let cryptos=JSON.parse(localStorage.getItem("cryptos")) || [];
  deleteBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const deleteButton = e.target.closest(".delete");
      const index=deleteButton.dataset.index;
         console.log(cryptos[index].name);
        const reponse=confirm(`tu veux vraiment supprimer: ${cryptos[index].name} \nacheter le : ${cryptos[index].date}`);
        if(!reponse){
            return ;
        }else{
            cryptos.splice(index,1);
            localStorage.setItem("cryptos", JSON.stringify(cryptos));
            location.reload();
        }
        



    });
  });
};


//fonction pour modifier

export const modifierCrypto=()=>{

  let cryptos=JSON.parse(localStorage.getItem("cryptos")) || [];
    const form=document.querySelector("#form-modif");
    const closeButton=document.querySelector("#button-close");
    const checkValidite = (nom, symbole, prix, quantite, cat, date) => {
  nom = String(nom).trim();
  symbole = String(symbole).trim();
  cat = String(cat).trim();
  date = String(date).trim();

  const p = Number(prix);
  const q = Number(quantite);

  if (!nom || !symbole || !cat || !date) return false;
  if (!Number.isFinite(p) || p <= 0) return false;
  if (!Number.isFinite(q) || q <= 0) return false;

  return true;
};

   
     const updateBtn = document.querySelectorAll(".update");
    updateBtn.forEach(element => {
      element.addEventListener("click",(e)=>{
           const index = e.currentTarget.dataset.index;

           const crypto=cryptos[index];
        const buttonSave=document.querySelector("#save");
        buttonSave.addEventListener("click",()=>{
          const mNom=document.querySelector("#m-nom").value;
          const mSymbole=document.querySelector("#m-symbole").value;
          const mPrix=document.querySelector("#m-prix").value;
         const mQuantite=document.querySelector("#m-quantite").value;
         const mDate=document.querySelector("#m-date").value;
         const mCat=document.querySelector("#m-cat").value;
           
          cryptos[index] = {
        ...cryptos[index], 
          name: mNom,
          symbole: mSymbole,
          quantite: Number(mQuantite),
          prix: Number(mPrix),
          date:mDate,
          categorie:mCat
    };
       
         localStorage.setItem("cryptos", JSON.stringify(cryptos));
         form.addEventListener("submit",(e)=>{
          e.preventDefault();

          if(checkValidite(mNom,mSymbole,mPrix,mQuantite,mCat,mDate)===true){
            closeButton.click();
            location.reload();
          }
         })
        });
      
      
    });
    
    });
    
    
  
}


