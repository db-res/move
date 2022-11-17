let settingControl = false

setTimeout(function name(params) {
    document.getElementById('setting').style.transform = 'translateX(calc(100% - 40px))'
},1000)
document.getElementById('settingBox-block').onclick = function (params) {
    if (!settingControl) {
        document.getElementById('setting').style.transform = 'translateX(0)'
    }else{
        document.getElementById('setting').style.transform = 'translateX(calc(100% - 40px))'
    }
    settingControl = !settingControl
}

document.getElementById('mode').style.display = 'none'



