let information;
fetch('https://api.adviceslip.com/advice')
     .then(response => response.json())
     .then(data => translate(data.slip.advice));


function translate(information){
    let sl = "en";
    let tl = "ru";
    let str = "Hello, world";
    let originalText = information

    let translateUrl = "https://translate.googleapis.com/translate_a/single?format=text&client=gtx&sl=" + sl + "&tl=" + tl + "&dt=t&q=" + originalText;
    let translatedText = httpGet(translateUrl);
    function httpGet(url) {
        fetch(url)
        .then(response => response.json())
        .then(
            data => {
                textCon = data[0][0][0],
                modalCloseButton_add()
        })
    }
}

function modalCloseButton_add(){
    document.getElementsByClassName("modal-close")[0].textContent = textCon;
}
