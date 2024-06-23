//const cDataInputUrl = "http://localhost:8181/read";
const cDataInputUrl = "./json/cpurealtimeinf.json";

window.onload = function()
{
    let ObjCpuRTInf = {
        ObjInput : {
            UpgradeFlag : false,
            AutoUpgrade : false,
            ObjIntervalUpgradeTaskId : {},
            UpgradeTimePeriod : 1000,
            timeoutCnt : 0,
            ObjInputData : {},
            ObjJsonButton : document.getElementById("idInputJson"),
            objInputTypeMsg : document.getElementById("idConnectType"),
        },
        ObjOutputMsg : document.getElementById("idCpuInfMsg"),
    };

    sfDisplayCpuInf(ObjCpuRTInf);
    ObjCpuRTInf.ObjInput.ObjJsonButton.addEventListener("click", function(){
        sfStartPeriodCpuInfUpgrade(ObjCpuRTInf);
    });
}


function sfStartPeriodCpuInfUpgrade(ObjInf)
{
    if(ObjInf.ObjInput.AutoUpgrade == false)
    {
        ObjInf.ObjInput.ObjIntervalUpgradeTaskId = setInterval(() => {
            sfGetCpuInfFromServer(ObjInf);
        }, ObjInf.ObjInput.UpgradeTimePeriod);
        ObjInf.ObjInput.AutoUpgrade = true;
        ObjInf.ObjInput.ObjJsonButton.value = "Stop Monitor";
    }
    else
    {
        clearInterval(ObjInf.ObjInput.ObjIntervalUpgradeTaskId);
        ObjInf.ObjInput.AutoUpgrade = false;
        ObjInf.ObjInput.ObjJsonButton.value = "Start Monitor";
        ObjInf.ObjInput.objInputTypeMsg.innerHTML = `連線待命中`;
        ObjInf.ObjInput.objInputTypeMsg.style.color = "black";
    }
}


function sfGetCpuInfFromServer(ObjInf)
{
    fetch(cDataInputUrl)
        .then((response) => {
            ObjInf.ObjInput.objInputTypeMsg.innerHTML = `連線成功..數據更新中`;
            ObjInf.ObjInput.objInputTypeMsg.style.color = "green";
            ObjInf.ObjInput.timeoutCnt = 0;
            return response.json();
    })
        .then((result) => {
            ObjInf.ObjInput.ObjInputData = result[0];
            ObjInf.ObjInput.UpgradeFlag = true;
            sfDisplayCpuInf(ObjInf);
    })    
        .catch((error) => {
            if(++ObjInf.ObjInput.timeoutCnt > 10)
            {
                clearInterval(ObjInf.ObjInput.ObjIntervalUpgradeTaskId);
                ObjInf.ObjInput.AutoUpgrade = false;
                ObjInf.ObjInput.ObjJsonButton.value = "Start Monitor";
                ObjInf.ObjInput.objInputTypeMsg.innerHTML = `已與Server斷線`;
                ObjInf.ObjInput.objInputTypeMsg.style.color = "red";
            }
            else if(ObjInf.ObjInput.timeoutCnt > 3)
            {
                ObjInf.ObjInput.objInputTypeMsg.innerHTML = `嘗試重新連線中..`;
                ObjInf.ObjInput.objInputTypeMsg.style.color = "rgb(255, 128, 0)";
            }
    });
}


function sfDisplayCpuInf(ObjInf)
{
    let InpputItem = [];
    let InpputValue = [];

    if(ObjInf.ObjInput.UpgradeFlag == false)
    {
        ObjInf.ObjOutputMsg.innerHTML = `監控關閉中`;
    }
    else
    {
        ObjInf.ObjOutputMsg.innerHTML = `Server即時監控資訊:<br><br>`
        let numCount = 0;
        for(let item in ObjInf.ObjInput.ObjInputData)
        {
            InpputItem[numCount] = item;
            InpputValue[numCount] = ObjInf.ObjInput.ObjInputData[item];
            ObjInf.ObjOutputMsg.innerHTML += `◆ ${InpputItem[numCount]} : <span style="color:blue">${InpputValue[numCount]}</span><br>`;
            numCount++;
        }
        numCount = 0;
    }
}