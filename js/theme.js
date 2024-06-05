//Светлая или тёмная тема
if (window.localStorage){
    if ("data_theme" in localStorage){
        document.getElementsByTagName("html")[0].setAttribute("data_theme",localStorage.getItem("data_theme"));
        document.querySelector(`input[name="theme"][value=${localStorage.data_theme}]`).checked = true;
    }
}

document.getElementById("theme_choice").addEventListener("change",() => {
    let data_theme = document.querySelector('input[name="theme"]:checked').value;
    document.getElementsByTagName("html")[0].setAttribute("data_theme",data_theme);
    if (window.localStorage){
        localStorage.setItem("data_theme", data_theme);
    }
})


const modal = document.createElement('div');
modal.classList.add('modal');

const modalContent = document.createElement('div');
modalContent.classList.add('modal-content');


let hello = document.createElement("h1");
hello.classList.add("meta_main");
hello.style.animation = "none";


hello.textContent = 'Игра "Крестики-нолики"';
modalContent.appendChild(hello);



const modalCloseButton = document.createElement('button');
modalCloseButton.classList.add('modal-close');
modalCloseButton.textContent += 'Перед началом хотим сказать...';
modalCloseButton.style.fontFamily = "fantasy";

modalContent.appendChild(modalCloseButton);
modal.appendChild(modalContent);


let divv = document.createElement("div");
divv.style.position = "absolute";
divv.style.bottom = "5%";
divv.style.width = "100%";
divv.style.textAlign = "center";
let contin = document.createElement("h1");

contin.style.position = "relative";
contin.textContent = 'Для продолжения нажмите на белую область';
divv.appendChild(contin);
modalContent.appendChild(divv);



document.body.appendChild(modal);



// Открыть модальное окно
modal.classList.add('modal--open');


// Закрыть модальное окно
modalCloseButton.addEventListener('click', () => {
  modal.classList.remove('modal--open');
  setTimeout(() => {
    document.body.removeChild(modal)
    document.getElementsByClassName("main")[0].style.visibility = "visible";
},600);

});






