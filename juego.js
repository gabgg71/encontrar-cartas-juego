let colores =["imagenes/gato1.jpg", 
            "imagenes/gato2.jpg",
            "imagenes/gato3.jpg",
            "imagenes/gato4.jpg", 
            "imagenes/gato5.jpg",
            "imagenes/gato6.jpg"
        ];
let cartas = document.querySelectorAll(".carta");
let barra = document.querySelector('.progress-bar');
let posiciones = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
let tiempo = document.querySelector(".texto");
let boton = document.querySelector(".btn");
let match =0;
let niveles
let tiempoPrimerNivel = 30000;
var body = document.getElementsByTagName('body')[0];
body.style.backgroundImage = 'url(imagenes/fondoJuego.jpg)';

const asignarColores = () => {
    let contador = 0;
    for (let i = 0; i < 12; i++) {
        let aleatorio = Math.floor(Math.random() * (posiciones.length + 1));
        while (posiciones[aleatorio] == undefined) {
            aleatorio = Math.floor(Math.random() * (posiciones.length + 1));
        }
        if (contador % 2 == 0) {
            colores.push(colores.shift());
            contador =0; 
        }
        cartas[posiciones[aleatorio]].classList.add(colores[0]);
        posiciones.splice(aleatorio, 1);  
        contador++;
    }
}

const init = () => {
    let contador = 0;
    while (contador < 12) {
        cartas[contador].innerHTML = '<img class = "img img-fluid style= "height:150px;" src="imagenes/carta.jpg" alt=""></img>'
        cartas[contador].classList.add("false");
        contador++;
    }
    for(let i =1 ; i<5; i++){
        if(sessionStorage.getItem("nivel") == `${i}`){
            barra.outerHTML = `<div class="progress-bar bg-success progress-bar-striped progress-bar-animated w-${i*25}">${i*25}%</div>`
            if(i == 4){
                //body.style.opacity = 0.1; 
                body.innerHTML = '<div class = "felicidades"> Felicidades has ganado!!!<button class="but btn-outline-success" type = "button">Jugar de nuevo</button></div>'
                let but = document.querySelector(".but")
                but.addEventListener("click", ()=>{
                    sessionStorage.setItem("nivel",0)
                    sessionStorage.setItem("tiempo",tiempoPrimerNivel)
                    document.location.reload();
                })

            }
            
        }
        
    }

}

//EL BOTON
boton.addEventListener("click", (e) => {
        if(sessionStorage.getItem('tiempo') == null){
            sessionStorage.setItem('tiempo',tiempoPrimerNivel)
        }
        let delTiempo =  parseInt(sessionStorage.getItem("tiempo"))/1000;
        darVuelta(parseInt(sessionStorage.getItem("tiempo")));
        boton.classList.add("disabled"); 
        setInterval(()=>{
         tiempo.innerHTML = delTiempo;
         delTiempo= delTiempo-1;
        },1000);
        setTimeout(()=>{
            if(sessionStorage.getItem("nivel")== null || sessionStorage.getItem("nivel")== "NaN"){
                niveles=1;
                sessionStorage.setItem("nivel", niveles);
                sessionStorage.setItem('tiempo',parseInt(sessionStorage.getItem("tiempo"))-5000)
            }
            else if(sessionStorage.getItem("nivel")!= null){
                niveles = parseInt(sessionStorage.getItem("nivel"))+1;
                sessionStorage.setItem("nivel", niveles);
                sessionStorage.setItem('tiempo',parseInt(sessionStorage.getItem("tiempo"))-5000)
            }
            document.location.reload();
        }, parseInt(sessionStorage.getItem("tiempo"))+1000);  
});

const ganar = (num) => {
    if (num == 6) {
        return true;
    } else {
        if(parseInt(sessionStorage.getItem("nivel"))>0){
            sessionStorage.setItem("nivel", parseInt(sessionStorage.getItem("nivel"))-1);
        }else if(parseInt(sessionStorage.getItem("nivel"))==0 || sessionStorage.getItem("nivel")== null){
            sessionStorage.setItem("nivel", null);
        }
        sessionStorage.setItem('tiempo',parseInt(sessionStorage.getItem("tiempo"))+5000)
        return false;
    }
}


const darVuelta = (tiempo) => {
    asignarColores();
    time = setTimeout(() => {
        ganar(match/2);
        match=0;
        setTimeout(() => {
            cartas.forEach(c => {
                elClone = c.cloneNode(true);
                elClone.innerHTML = '<img class = "img img-fluid style= "height:150px;" src="imagenes/carta.jpg" alt=""></img>'
                c.parentNode.replaceChild(elClone, c);
            });
        },1000)  
    }, tiempo+1000);
    for (let j = 0; j < cartas.length; j++) {
        cartas[j].addEventListener("click", (e) => {
                    if (cartas[j].innerHTML === '<img class="img img-fluid style= " height:150px;"="" src="imagenes/carta.jpg" alt="">') {
                        for (let i = 0; i < colores.length; i++) {
                            if (cartas[j].classList.contains(colores[i])) {
                                cartas[j].classList.replace("false", "true");
                                cartas[j].innerHTML = `<img src="${colores[i]}" class = "img" alt="">`;
                                if (hayMatch(cartas[j], j) == false) {
                                    setTimeout(() => { 
                                        if(hayMatch(cartas[j], j) == false){
                                            cartas[j].innerHTML = '<img class = "img img-fluid style= "height:150px;" src="imagenes/carta.jpg" alt=""></img>' 
                                        }
                                    }, 3000);
                                    cartas[j].classList.replace("true", "false");
                                } else {
                                    break;
                                }
                            }
                        }
                    }
        });
    }
    
}



const hayMatch = (carta) => {
    for (let j = 0; j < cartas.length; j++) {
        if (cartas[j].innerHTML === carta.innerHTML && cartas[j] != carta) {
            if (carta.classList.item(2) == cartas[j].classList.item(2)) {
                match++;
                return true;
            }
        }
    }
    return false;
}


init();





