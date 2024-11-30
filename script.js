function main () {
    let billetera = document.getElementById("billetera");
    billetera.style.display = "none";
 
    let billeteraCreada = consultarBilleteraCreada();
    if (billeteraCreada) {
        ocultarFormulario();
        mostrarBilletera();
        mostrarDetalleFinanzas()
        agregarSeccionesNavbar();
    }
}

//Funciones de navegacion
function mostrarInformacion() {
    let informacion = document.getElementById("informacion");
    informacion.style.display = "block";
    let mostrar = document.getElementById("mostrar");
    mostrar.style.display = "none";
    let ocultar = document.getElementById("ocultar");
    ocultar.style.display = "block";
}
function ocultarInformacion() {
    let informacion = document.getElementById("informacion");
    informacion.style.display = "none";
    let mostrar = document.getElementById("mostrar");
    mostrar.style.display = "block";
    let ocultar = document.getElementById("ocultar");
    ocultar.style.display = "none";
}

//Acciones "funcionales"        //
function crearBilletera() {
    let nombre = document.getElementById("inputNombre").value
    let comboObjetivo = document.getElementById("objetivo");
    let objetivo = comboObjetivo.options[comboObjetivo.selectedIndex].text;

    let billetera = {
        nombreUsuario: nombre,
        objetivo: objetivo,
        balance: {
            total: 0,
            ingresos: 0,
            gastos: 0,
        },
        movimientos:[],
    };
    instanciarBilletera(billetera);
    ocultarFormulario();
    agregarSeccionesNavbar();
    mostrarBilletera();
}
function modificarMovimientos(accion, idMovimiento) {
    let comboTipoMovimiento = document.getElementById("tipoMovimiento");
    let comboCategoria = document.getElementById("categoria");

    let movimiento = {
        tipoMovimiento: comboTipoMovimiento.options[comboTipoMovimiento.selectedIndex].text,
        titulo: document.getElementById("movimientoTitulo").value,
        categoria: comboCategoria.options[comboCategoria.selectedIndex].text,
        monto: Number.parseInt(document.getElementById("monto").value),
    }

    if (accion === "agregar") {
        crearMovimiento(movimiento); 
    }
    if (accion === "eliminar") {

        eliminarMovimiento(idMovimiento); 
    }
    actualizarBilletera();
    limpiarModal();
}
function actualizarBilletera() {
    mostrarBilletera();
    mostrarDetalleFinanzas();
}

//Funciones de manejo de datos    //
function consultarBilleteraCreada () {
    if (localStorage.getItem("billetera")) {
        return true;
    } else {
        return false;
    };
}
function instanciarBilletera (billetera) {
    localStorage.setItem("billetera", JSON.stringify(billetera));
}
function vaciarBilletera(){
    console.log("Se vaciaria la billetera");
    let billetera = JSON.parse(localStorage.getItem("billetera"));
    let billeteraVacia = {
            nombreUsuario: billetera.nombreUsuario,
            objetivo: billetera.objetivo,
            balance: {
                total: 0,
                ingresos: 0,
                gastos: 0,
            },
            movimientos:[],
    }
    console.log("billetera actual", billetera);
    console.log("nueva billetera", billeteraVacia);
    actualizarBilletera();
}
function crearMovimiento(movimiento) {
    let billetera = JSON.parse(localStorage.getItem("billetera"));
    let movimientos = billetera.movimientos;
    movimiento = { ...movimiento, 
        idMovimiento: movimientos.length + 1,
    };
    movimientos.push(movimiento);
    
    let nuevoBalance = recalcularSaldos(movimientos)
    
    let nuevoBilletera = {
        nombreUsuario: billetera.nombreUsuario,
        objetivo: billetera.objetivo,
        balance: nuevoBalance,
        movimientos,
    }
    localStorage.setItem("billetera", JSON.stringify(nuevoBilletera)); 
}
function eliminarMovimiento(idMovimiento) {
    console.log("movimiento ", idMovimiento);
}
function recalcularSaldos(movimientos) {
    let nuevoIngresos = 0;
    let nuevoGastos = 0;

    for (i = 0; i < movimientos.length; i++) {
        if (movimientos[i].tipoMovimiento === "Ingreso") {
            nuevoIngresos += movimientos[i].monto;
        } else {
            nuevoGastos += movimientos[i].monto;
        }
    }
    
    let nuevoBalance = {
        total: nuevoIngresos - nuevoGastos,
        ingresos: nuevoIngresos,
        gastos: nuevoGastos,
    }

    return nuevoBalance;

}

//Funciones de manipulacion de elementos del dom
function crearCard(movimiento) {
    let esGasto = false;

    if (movimiento.tipoMovimiento === "Gasto") {
        esGasto = true;
    }
    let cardContenedor = document.createElement("div");
    cardContenedor.className = "col";

    let card = document.createElement("div");
    card.className = "card d-flex flex-column justify-content-between align-items-center shadow card-movimiento";

    let contenedorImg = document.createElement("div");
    contenedorImg.className = "card-movimiento-img"
  
    let img = document.createElement("img");
    img.className = "card-img-top";

    let srcImg = obtenerImagen(movimiento.categoria);
    img.setAttribute("src", `${srcImg}`);
    img.setAttribute("height", "110");
    img.setAttribute("alt", "Alt correspondiente");

    contenedorImg.appendChild(img);

    let cuerpo = document.createElement("div");
    cuerpo.className = "card-body d-flex flex-column justify-content-center align-items-start card-movimiento-cuerpo";

    let titulo = document.createElement("h6");
    titulo.classList.add("card-title");
    titulo.innerHTML = `${movimiento.titulo}`;

    let monto = document.createElement("p");
    monto.classList.add("card-text");
   
    let badge = document.createElement("span");

    if (esGasto) {
        monto.innerHTML = `- $${movimiento.monto}`;
        badge.className = "badge text-bg-danger";
        badge.innerHTML = `Gasto`;
    } else {
        monto.innerHTML = `$${movimiento.monto}`;
        badge.className = "badge text-bg-primary";
        badge.innerHTML = `Ingreso`;
    }

    let footerCard = document.createElement("div");
    footerCard.className = "d-flex justify-content-between align-items-center card-movimiento-footer";

/*     let botonEliminar = document.createElement("button");
    botonEliminar.className = "btn link-danger btn-sm";

    botonEliminar.addEventListener("click", function (e) {
        console.log(this.className);
        modificarMovimientos("eliminar", movimiento.idMovimiento)
      });

    botonEliminar.innerHTML = `Eliminar` */

    footerCard.appendChild(badge);
    //footerCard.appendChild(botonEliminar);

    cuerpo.appendChild(titulo);
    cuerpo.appendChild(monto);
    card.appendChild(contenedorImg);
    card.appendChild(cuerpo);
    card.appendChild(footerCard);
    cardContenedor.appendChild(card);

    return cardContenedor;

}
function eliminarCard() {
    console.log("creacion de la card");
    /* Recibira el objeto
            {
                idMovimiento: 0,// chequear
                ingreso: false,
                titulo: "",
                tipo de gasto: "",
                monto: 0,
            },
        elimina del dom una card con la class "card-movimiento"
     */
}
function ocultarFormulario() {
    let formulario = document.getElementById("formulario");
    formulario.style.display = "none";
}

function mostrarBilletera() {
    let billetera = document.getElementById("billetera");
    billetera.className = "mb-1 d-flex flex-column";

    let bloque1 = document.getElementById("bloque1");
    let formulario = document.getElementById("formulario");
    if (formulario != null){
        bloque1.removeChild(formulario);
    }

    let cards = document.getElementById("cards");
    let cardBalanceActual = document.getElementById("balance");
    let cardIngresosGastosActual = document.getElementById("ingresos");

    let movimientos = consultarMovimientos();
    let balance = consultarBalance();

    if (movimientos.length > 0) {
        if (cardBalanceActual) {
            cards.removeChild(cardBalanceActual);
        }
        if (cardIngresosGastosActual) {
            cards.removeChild(cardIngresosGastosActual);
        }

        let cardBalance = document.createElement("div");
        cardBalance.className = "card text-bg-light justify-content-center align-items-center mb-3 card-balance";
        cardBalance.setAttribute("id", "balance");

        let tituloBalance = document.createElement("h6");
        tituloBalance.innerHTML = `Balance`;

        let montoBalance = document.createElement("h3");
        
        montoBalance.innerHTML = `$${balance.total}`;

        let verDetalle = document.createElement("a");
        verDetalle.setAttribute("href","#detalle");
        verDetalle.innerHTML = `Ver detalle`;

        cardBalance.appendChild(tituloBalance);
        cardBalance.appendChild(montoBalance);
        cardBalance.appendChild(verDetalle);

        let cardIngresosGastos = document.createElement("div");
        cardIngresosGastos.className = "card text-bg-light justify-content-center align-items-center mb-3 card-ingresos-gastos";
        cardIngresosGastos.setAttribute("id", "ingresos");
        
        let tituloIngresos = document.createElement("h6");
        tituloIngresos.innerHTML = `Ingresos`;
        tituloIngresos.style.color = ""

        let montoIngresos = document.createElement("h3");
        montoIngresos.innerHTML = `$${balance.ingresos}`;
        montoIngresos.style.color = "#0E6C00"

        let tituloGastos = document.createElement("h6");
        tituloGastos.innerHTML = `Gastos`;

        let montoGastos = document.createElement("h3");
        montoGastos.innerHTML = `$${balance.gastos}`;
        montoGastos.style.color = "#900000"

        cardIngresosGastos.appendChild(tituloIngresos);
        cardIngresosGastos.appendChild(montoIngresos);
        cardIngresosGastos.appendChild(tituloGastos);
        cardIngresosGastos.appendChild(montoGastos);

        cards.appendChild(cardBalance);
        cards.appendChild(cardIngresosGastos);
    }
}
function mostrarDetalleFinanzas() {
    let contenido = document.getElementById("contenido");
    let detalleExistente = document.getElementById("detalle");

    if (detalleExistente != null){
        contenido.removeChild(detalleExistente);
    }

    let detalle = document.createElement("div");
    detalle.setAttribute("id","detalle")
    detalle.className = "seccion-detalle d-flex flex-column align-items-center";
    detalle.style.display = "flex";
    detalle.style.padding = "5%";

    let headerDetalle = document.createElement("div");
    headerDetalle.classList.add("header-detalle");
    headerDetalle.style.width = "100%";

    let textoSeccion = document.createElement("div");
    textoSeccion.classList.add("texto-seccion-detalle");

    let tituloSeccion = document.createElement("h2");
    tituloSeccion.innerHTML = `Detalle de finanzas`;

    let bajadaSeccion = document.createElement("p");
    bajadaSeccion.innerHTML = `Acá podés ver el detalle de tus movimientos`;
    
    let botonAgregar = document.createElement("button");
    botonAgregar.className = "btn btn-primary btn-md";
    botonAgregar.style.height = "44%"
    botonAgregar.innerHTML = `Agrega nuevo`;
    botonAgregar.setAttribute("data-bs-toggle","modal");
    botonAgregar.setAttribute("data-bs-target","#exampleModal");

/*     let botonVaciar = document.createElement("button");
    botonVaciar.className = "btn btn-danger btn-md";
    botonVaciar.style.height = "44%"
    botonVaciar.innerHTML = `Vaciar`;
    botonVaciar.onclick = function() {vaciarBilletera()}; */

    textoSeccion.appendChild(tituloSeccion);
    textoSeccion.appendChild(bajadaSeccion);

    headerDetalle.appendChild(textoSeccion);
    /* headerDetalle.appendChild(botonVaciar); */
    headerDetalle.appendChild(botonAgregar);

    let cardGrilla = document.createElement("div");
    cardGrilla.className = "row row-cols-1 row-cols-md-3 g-4 contenedor-cards";
    let movimientos = consultarMovimientos();

    for (i = 0; i < movimientos.length; i++) {
        let card = crearCard(movimientos[i]);
        cardGrilla.appendChild(card);
    }

    detalle.appendChild(headerDetalle);
    detalle.appendChild(cardGrilla);   
    contenido.appendChild(detalle);
}

function agregarSeccionesNavbar () {
    let billetera = JSON.parse(localStorage.getItem("billetera"));
    let navlist = document.getElementById("navlist");

    let seccionBilletera = document.getElementById("seccion-billetera");

    if (seccionBilletera) {
        let linkBilletera = document.createElement("li");
        linkBilletera.className = "nav-item";
        
        let textoLinkBilletera = document.createElement("a");
        textoLinkBilletera.className = "nav-link active text-light";
        textoLinkBilletera.setAttribute("aria-current","page");
        textoLinkBilletera.setAttribute("href","#seccion-billetera");
        textoLinkBilletera.innerHTML = `Billetera`;
        
        linkBilletera.appendChild(textoLinkBilletera);
        navlist.appendChild(linkBilletera);
    }

    let seccionDetalle = document.getElementById("detalle");

    if (seccionDetalle) {
        let linkDetalle = document.createElement("li");
        linkDetalle.className = "nav-item";
        
        let textoLinkDetalle = document.createElement("a");
        textoLinkDetalle.className = "nav-link active text-light";
        textoLinkDetalle.setAttribute("href","#detalle");
        textoLinkDetalle.innerHTML = `Detalle`;
        
        linkDetalle.appendChild(textoLinkDetalle);
        navlist.appendChild(linkDetalle);
    }

    let usuario = document.createElement("li");
    usuario.className = "nav-item align-items-center";
    usuario.setAttribute("id","usuario");

    let textoUsuario = document.createElement("a");
    textoUsuario.className = "nav-link ms-4 fw-bold";
    textoUsuario.style.color = "#FF9E1F";
    textoUsuario.innerHTML = `${billetera.nombreUsuario}`;

    usuario.appendChild(textoUsuario);
    navlist.appendChild(usuario);
}
// Otras funciones
function consultarMovimientos () {
    let billetera = JSON.parse(localStorage.getItem("billetera"));
    return billetera.movimientos;
}
function consultarBalance () {
    let billetera = JSON.parse(localStorage.getItem("billetera"));
    return billetera.balance;
}
function obtenerImagen (categoria) {
    let srcImg = "";

    switch (categoria) {
        case "Ahorro":
            srcImg = "./recursos/ahorro.svg";
            break;
        case "Ocio":
            srcImg = "./recursos/ocio.svg";
            break;
        case "Gastos mensuales":
            srcImg = "./recursos/mensuales.svg";
            break;
        case "Gastos hormiga":
            srcImg = "./recursos/hormigas.svg";
            break;
        case "Sueldo":
            srcImg = "./recursos/sueldo.svg";
            break;
        case "Inversión":
            srcImg = "./recursos/inversion.svg";
            break;
    }
    return srcImg;
}
function limpiarModal() {
    let tipoMovimiento = document.getElementById("tipoMovimiento");
    let movimientoTitulo = document.getElementById("movimientoTitulo");
    let categoria = document.getElementById("categoria");
    let monto = document.getElementById("monto");

    tipoMovimiento.value = '';
    movimientoTitulo.value = '';
    categoria.value = '';
    monto.value = '';
}


/*
- Revisar absolutamente todo el responsive y crear las mediaquerys necesarias para que funcione.
- Desarrollar funcionalidad de eliminar movimiento.
*/

