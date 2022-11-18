
// let init = function (params) {
    // let {controls, camera, scene, renderer, controlsType} = params
    let settingControl = false
    
    setTimeout(function name() {
        document.getElementById('setting').style.transform = 'translateX(calc(100% - 40px))'
    },1000)
    document.getElementById('settingBox-block').onclick = function () {
        if (!settingControl) {
            document.getElementById('setting').style.transform = 'translateX(0)'
        }else{
            document.getElementById('setting').style.transform = 'translateX(calc(100% - 40px))'
        }
        settingControl = !settingControl
    }
    
    document.getElementById('mode').style.display = 'none'
// }




// export default init

