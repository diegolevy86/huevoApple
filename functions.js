const https = require("https");
const API = require(__dirname + "/apikeys.json")

let validadorImei = function (imei) {
    let num1 = Math.trunc(imei / 10000000000000);
    if (((num1 != 1) && (num1 != 35)) && (num1 != 99)) {
        return -2;
    }
    else {
        let num2 = imei;
        let count = 1;
        let sum = 0;
        while (num2 > 0) {
            let num3 = num2 % 10;
            if (count % 2 === 1) {
                sum = sum + num3;
            }
            else {
                let num4 = num3 * 2;
                if (num4 >= 10) {
                    sum = sum + 1 + (num4 - 10);
                }
                else {
                    sum = sum + num4;
                }
            }
            num2 = Math.trunc(num2 / 10);
            count = count + 1;
        }
        if (sum % 10 === 0) {
            return 0;
        }
        else {
            return -1;
        }
    }
}

function numeroModeloColor(mc) {
    switch (mc) {
        case "iPhone 5C Blanco": return 1;
        case "iPhone 5C Amarillo": return 2;
        case "iPhone 5C Coral": return 3;
        case "iPhone 5C Verde": return 4;
        case "iPhone 5C Celeste": return 5;
        case "iPhone 5S Negro": return 6;
        case "iPhone 5S Gris": return 7;
        case "iPhone 5S Dorado": return 8;
        case "iPhone 6- Negro": return 9;
        case "iPhone 6- Gris": return 10;
        case "iPhone 6- Dorado": return 11;
        case "iPhone 6 PLUS Negro": return 12;
        case "iPhone 6 PLUS Gris": return 13;
        case "iPhone 6 PLUS Dorado": return 14;
        case "iPhone 6S- Negro": return 15;
        case "iPhone 6S- Gris": return 16;
        case "iPhone 6S- Dorado": return 17;
        case "iPhone 6S- Rosa": return 18;
        case "iPhone 6S PLUS Negro": return 19;
        case "iPhone 6S PLUS Gris": return 20;
        case "iPhone 6S PLUS Dorado": return 21;
        case "iPhone 6S PLUS Rosa": return 22;
        case "iPhone 7- Negro": return 23;
        case "iPhone 7- Gris": return 24;
        case "iPhone 7- Dorado": return 25;
        case "iPhone 7- Rosa": return 26;
        case "iPhone 7 PLUS Negro": return 27;
        case "iPhone 7 PLUS Gris": return 28;
        case "iPhone 7 PLUS Dorado": return 29;
        case "iPhone 7 PLUS Rosa": return 30;
        case "iPhone 8- Blanco": return 31;
        case "iPhone 8- Negro": return 32;
        case "iPhone 8- Dorado": return 33;
        case "iPhone 8 PLUS Blanco": return 34;
        case "iPhone 8 PLUS Negro": return 35;
        case "iPhone 8 PLUS Dorado": return 36;
        case "iPhone X- Blanco": return 37;
        case "iPhone X- Negro": return 38;
        case "iPhone XS- Blanco": return 39;
        case "iPhone XS- Negro": return 40;
        case "iPhone XS- Dorado": return 41;
        case "iPhone XS MAX Blanco": return 42;
        case "iPhone XS MAX Negro": return 43;
        case "iPhone XS MAX Dorado": return 44;
        case "iPhone XR Blanco": return 45;
        case "iPhone XR Negro": return 46;
        case "iPhone XR Amarillo": return 47;
        case "iPhone XR Coral": return 48;
        case "iPhone XR Rojo": return 49;
        case "iPhone XR Celeste": return 50;
        case "iPhone 11- Blanco": return 51;
        case "iPhone 11- Negro": return 52;
        case "iPhone 11- Amarillo": return 53;
        case "iPhone 11- Rojo": return 54;
        case "iPhone 11- Verde claro": return 55;
        case "iPhone 11- Violeta": return 56;
        case "iPhone SE2 Negro": return 57;
        case "iPhone 13- Azul": return 58;
        case "iPhone 13 PRO- Azul": return 59;
        case "iPhone 7 PLUS Rojo": return 60;
        case "iPhone 11 PRO MAX Verde oscuro": return 61;
        case "iPhone SE1 Negro": return 62;
        case "iPhone 13 PRO- Gris": return 63;
        case "iPhone SE1 Gris": return 64;
        case "iPhone SE1 Dorado": return 65;
        case "iPhone 13 PRO- Blanco": return 66;
        case "iPhone 8- Rojo": return 67;
        case "iPhone SE2 Rojo": return 68;
        case "iPhone 11 PRO MAX Negro": return 69;
        case "iPhone SE2 Blanco": return 70;
        case "iPhone 12- Blanco": return 71;
        case "iPhone 12- Negro": return 72;
        case "iPhone 12 PRO- Azul": return 73;
        case "iPhone SE1 Rosa": return 74;
        case "iPhone 12 PRO MAX Gris": return 76;
        case "iPhone 8 PLUS Rojo": return 77;
        case "iPhone 12 PRO- Negro": return 78;
        case "iPhone 11 PRO- Negro": return 79;
        case "iPhone 11 PRO MAX Blanco": return 80;
        case "iPhone 13- Blanco": return 81;
        case "iPhone 12 PRO MAX Dorado": return 82;
        case "iPhone 11 PRO- Blanco": return 83;
        case "iPhone 13 PRO- Negro": return 84;
        case "iPhone 13 PRO MAX Verde": return 85;
        case "iPhone 11 PRO MAX Dorado": return 86;
        case "iPhone SE3 Blanco": return 87;
        case "iPhone 7- Rojo": return 88;
        case "iPhone 5- Negro": return 89;
        case "iPhone 5- Gris": return 90;
        case "iPhone 11 PRO- Dorado": return 91;
        case "iPhone 13 PRO- Dorado": return 92;
        case "iPhone 14- Azul oscuro": return 93;
        case "iPhone 11 PRO- Verde oscuro": return 94;
        case "iPhone 12 PRO- Verde oscuro": return 95;
        case "iPhone 12 PRO- Dorado": return 96;
        case "iPhone 13 PRO MAX Negro": return 97;
        case "iPhone 12 PRO MAX Blanco": return 98;
        case "iPhone 12 PRO MAX Azul": return 99;
        case "iPhone SE3 Azul oscuro": return 100;
        case "iPhone 12- Rojo": return 101;
        case "iPhone 12- Azul": return 102;
        case "iPhone 12 PRO- Blanco": return 103;
        case "iPhone 13 PRO MAX Blanco": return 104;
        case "iPhone 14 PRO Negro": return 105;
        case "iPhone 13 PRO MAX Azul": return 106;
        case "iPhone 12 MINI Verde claro": return 107;
        case "iPhone 14 Celeste": return 108;
        case "iPhone 12 MINI Blanco": return 109;
        case "iPhone 14 PLUS Celeste": return 110;
        case "iPhone 12 Verde claro": return 111;
    }
}

function numeroReparacionTipo(rt) {
    switch (rt) {
        case "Cambio pantalla": return 1;
        case "Cambio batería": return 2;
        case "Cambio carcasa / módulo trasero": return 3;
        case "Cambio cámara trasera": return 4;
        case "Cambio flex cámara frontal / Sensor proximidad": return 5;
        case "Cambio botón home": return 6;
        case "Arreglo de placa otros": return 7;
        case "Arreglo de placa audio": return 8;
        case "Cambio flex botones": return 9;
        case "Cambio dock": return 10;
        case "Cambio flex parlante auricular / sensores (face ID)": return 11;
        case "Limpieza parlante auricular": return 12;
        case "Cambio antenas wifi": return 13;
        case "Revisión": return 15;
        case "Cambio flex varios": return 16;
        case "Cambio vidrio cámara": return 17;
        case "Vuelto para atrás": return 18;
        case "P. pegada": return 19;
        case "Cambio parlante altavoz": return 20;
        case "Flasheo": return 21;
        case "Cambio bt. con cambio de celda": return 22;
        case "Cambio parlante auricular": return 23;
        default: return -1;
    }
}

function numeroReventa(rv) {
    switch (rv) {
        case "Fede": return 1;
        case "Fantech": return 2;
        case "Guido": return 3;
        case "Santi": return 4;
        case "Martín": return 9;
        case "Jona": return 10;
        case "Varios": return 11;
        case "Manu Lokura": return 12;
        case "Martina": return 13;
        case "Diego": return 14;
        case "": return null;
        default: return -1;
    }
}

async function darFechaHoy() {
    const fecha = new Date();
    let dia = 7;
    switch (fecha.getDay()) {
        case 1: dia = "Lunes";
            break;
        case 2: dia = "Martes";
            break;
        case 3: dia = "Miércoles";
            break;
        case 4: dia = "Jueves";
            break;
        case 5: dia = "Viernes";
            break;
        case 6: dia = "Sábado";
            break;
        case 0: dia = "Domingo";
            break;
        default: dia = "que pasó???";
            break;
    }
    return dia + ", " + fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear();
}

async function obtenerTiempo() {
    const apiKey = API.WeatherAPI;
    const url = "https://api.openweathermap.org/data/2.5/weather?id=" + "3432043" + "&appid=" + apiKey + "&units=metric";
    try {
        const response = await fetch(url);
        const weatherData = await response.json();
        const icon = weatherData.weather[0].icon;
        const iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        return [weatherData.main.temp, iconURL];
    } catch (error) {
        console.error("Error al obtener datos del clima:", error)
        return ["No disponible", "No disponible"];
    }
}

module.exports = { validadorImei, numeroModeloColor, numeroReparacionTipo, numeroReventa, darFechaHoy, obtenerTiempo };