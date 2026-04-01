let saldo = 1500.00;

const pantalla = document.getElementById('pantallaMensaje');
const inputMonto = document.getElementById('inputMonto');

function consultarSaldo() {
    let pantalla = document.getElementById("pantallaMensaje");
    pantalla.innerHTML = "Tu saldo actual es:<br><b>S/ " + saldo + "</b>";
}

function depositarDinero() {
    let pantalla = document.getElementById("pantallaMensaje");
    let input = document.getElementById("inputMonto");
    let monto = parseFloat(input.value);

    if (isNaN(monto) || monto <= 0) {
        pantalla.innerHTML = "Error Ingrese un monto valido para depositar.";
        return;
    }

    saldo = saldo + monto;
    pantalla.innerHTML = "Deposito exitoso.<br>Nuevo saldo: <b>S/ " + saldo + "</b>";
    input.value = ""; 
}

function retirarDinero() {
    let pantalla = document.getElementById("pantallaMensaje");
    let input = document.getElementById("inputMonto");
    let monto = parseFloat(input.value);

    if (isNaN(monto) || monto <= 0) {
        pantalla.innerHTML = "Error: Ingrese un monto válido para retirar.";
        return;
    }
    if (monto > saldo) {
        pantalla.innerHTML = "Error: Fondos insuficientes.";
        return;
    }

    saldo = saldo - monto;
    pantalla.innerHTML = "Retiro exitoso.<br>Nuevo saldo: <b>S/ " + saldo + "</b>";
    
    input.value = ""; 
}

