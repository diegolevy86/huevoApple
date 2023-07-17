let validadorImei = function(imei)
{
    let num1 = Math.trunc(imei / 10000000000000);
    if (((num1 != 1) && (num1 != 35)) && (num1 != 99))
    {
        return -2;
    }
    else
    {
        let num2 = imei;
        let count = 1;
        let sum = 0;
        while (num2 > 0)
        {
            let num3 = num2 % 10;
            if (count % 2 === 1) 
            {
                sum = sum + num3;
            }
            else 
            {
                let num4 = num3 * 2;
                if (num4 >= 10)
                {
                    sum = sum + 1 + (num4 - 10);
                }
                else
                {
                    sum = sum + num4;
                }
            }
            num2 = Math.trunc(num2 / 10);
            count = count + 1;
        }
        if (sum % 10 === 0)
        {
            return 0;
        }
        else
        {
            return -1;
        }
    }
}

module.exports = { validadorImei };