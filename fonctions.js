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
                          <button class="btn btn-sm btn-outline-light" type="button"><i class="bi bi-pencil"></i></button>
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



