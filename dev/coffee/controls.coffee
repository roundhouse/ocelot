class WaveControls
  constructor: ->
    console.log "new contols"
    @controlWindow = document.getElementById("controls")
    @instructs = document.getElementById("instruct")
    @aTxt = document.getElementById("alpha_value")
    @bTxt = document.getElementById("beta_value")
    @pTxt = document.getElementById("phi_value")
    @lTxt = document.getElementById("length_value")
    @hTxt = document.getElementById("height_value")
    @sTxt = document.getElementById("stroke_value")
    @cTxt = document.getElementById("color_value")
    @eTxt = document.getElementById("equation_value")


  hide: =>
    @instructs.className = "hidden"
    @controlWindow.className = "hidden"

  openWindow: =>
    @controlWindow.className = "open"

  closeWindow: =>
    @controlWindow.className = ""
  
  updateWaveData:(a, b, p, l, h, s, c)=>
    @aTxt.innerHTML = a
    @bTxt.innerHTML = b
    @pTxt.innerHTML = p.toFixed(3)
    @lTxt.innerHTML = l + "px"
    @hTxt.innerHTML = h + "px"
    @sTxt.innerHTML = s + "px"
    @cTxt.innerHTML = c + "ms"
    @eTxt.innerHTML = "f(t)=sin(#{a}t) + cos(#{b}t + #{p.toFixed(1)} &Pi;)"
