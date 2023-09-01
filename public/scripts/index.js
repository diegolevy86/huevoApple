var num = 0;
var ib = document.querySelectorAll(".imeiBox")
for (var i = 0; i < ib.length; i++)
    {
        ib[i].addEventListener("keydown", function(event){
    console.log(event);
    if (event.key == "1" || event.key == "2" || event.key == "3" || event.key == "4" || event.key == "5" 
        || event.key == "6" || event.key == "7" || event.key == "8" || event.key == "9" || event.key == "0")
        {
            let digit = Number(event.key);
            num = num * 10 + digit;
            console.log(num);
            if (validadorImei(num) == 0)
            {
                var it = document.querySelectorAll(".imeiTitle");
                for (var j = 0; j < it.length; j++)
                {
                    it[j].innerHTML = "IMEI ✔";
                }
            }
            else
            {
                var it = document.querySelectorAll(".imeiTitle");
                for (var k = 0; k < it.length; k++)
                {
                    it[k].innerHTML = "IMEI ❌";
                }
            }
        }
    else
    {
        if (event.key == "Backspace")
        {
            num = Math.floor(num/10);
        }
    }
});
}

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