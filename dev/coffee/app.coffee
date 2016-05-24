class App
  constructor: ->
    # @stage = Snap("#snap-animation")
    # console.log @stage
    @createVars()
    @init()
  
  createVars: =>
    @curve = document.getElementById("curve");
    @curve
    @alpha = 1
    @beta = 1
    @phi = 0
    @dphi = Math.PI/120
    @w = window.innerWidth;
    @h = window.innerHeight;
    @resizeTimer
    @paused = false
    @colorCount = 0
    @strokeWeight = 2
    @mouseDown = false
    @colorCounter = 0
    @colorspeed = 1
    @blur = 0

    #COLORS
    @rbg =["#C00404", "#0594F2", "#3FA61E"] 

    
    @mobile = new MobileCheck()
    @controls = new WaveControls()


    window.addEventListener("resize", =>
      @w = window.innerWidth;
      @h = window.innerHeight;
    )
      # if evt.keyCode ==  81
      #   @blur--
      #   if @blur < 0
      #     @blur = 0
      #     document.getElementById("blur").setAttribute("stdDeviation", @blur);
      # if evt.keyCode == 87
      #   @blur++
      #   console.log @blur++
      #   document.getElementById("blur").setAttribute("stdDeviation", @blur);q
    # )

    # window.on('resize', =>
    #   clearTimeout(@resizeTimer)
    #   @resizeTimer = setTimeout(=>
    #     console.log 'resize'
    #   , 250)
    # )


  init: =>
    
    if @mobile.isMobile != null
      @mobile = true
      @controls.hide()
      @touchControls()
    else
      @mobile = false
      @desktopControls()
      
    
    # modifyColor();
    # setInterval(@Animate(), 2);
    @tick = setInterval(@animate, 4)

  touchControls: =>
    @touchX
    @touchY
    @mobile_force = document.getElementById("mobile_force")
    window.addEventListener("touchmove",(evt)=>
      b = Math.round( ((@w / 2) - evt.changedTouches[0].clientX ) * 0.1 )
      a = Math.round( ((@h / 2) - evt.changedTouches[0].clientY) * 0.1 )
      if a == 0
        a = 1
      if b == 0
        b = 1
      @beta = b
      @alpha = a
      # console.log evt.changedTouches[0].force
      newStroke = Math.round( (1 - evt.changedTouches[0].force) * 2)
      # newStroke = Math.round(1 + ((1 - evt.changedTouches[0].force) / 2) * 10)
      # newStroke =  1 + (evt.changedTouches[0].force * 4)
      @curve.setAttributeNS(null,"stroke-width", newStroke);
      @mobile_force.innerHTML = newStroke
      # console.log evt.changedTouches[0].clientX
      # console.log evt.changedTouches[0].clientY
    )
    

  desktopControls: =>
    window.addEventListener("mousemove",(evt)=>
      if @paused == false && evt.shiftKey
        @beta = Math.round((evt.pageX - (@w / 2)) / 10)
        @alpha = Math.round((evt.pageY - (@h / 2)) / 10)
      else if @paused == false && @mouseDown
        b = Math.round((evt.movementX) )
        a = Math.round((evt.movementY))
        if a == 0
          a = 1
        if b == 0
          b = 1

        @beta = b
        @alpha = a
    )
    window.addEventListener("mousedown", (evt)=>
      @mouseDown = true
    )
    window.addEventListener("mouseup", (evt)=>
      @mouseDown = false
    )
    #KEY PRESS    
    window.addEventListener("keydown",(evt)=>
      if evt.keyCode == 32
        if @paused == false
          @paused =  true
          @controls.openWindow()
        else
          @paused = false
          @controls.closeWindow()
      if evt.keyCode == 37
        @beta--
      if evt.keyCode == 39
        @beta++
      if evt.keyCode == 38
        @alpha++
      if evt.keyCode == 40
        @alpha--
      if evt.keyCode == 79
        @colorspeed = @colorspeed - 5
        if @colorspeed < 1
          @colorspeed = 1
      if evt.keyCode == 80
        @colorspeed = @colorspeed + 5
        console.log @colorspeed
      if evt.keyCode ==  219
        @strokeWeight--
        if @strokeWeight < 1
          @strokeWeight = 1
        @curve.setAttributeNS(null,"stroke-width", @strokeWeight); 
      if evt.keyCode ==  221
        @strokeWeight++
        @curve.setAttributeNS(null,"stroke-width", @strokeWeight);
    )


  Lissajou:(a, b, phi) =>
    if @mobile == false
      @controls.updateWaveData(a, b, phi, @w, @h, @strokeWeight, @colorspeed)

    dt  = Math.PI/(@w/2)
    str = "M"
    max = 2 * Math.PI
    x= 0
    while x <= max
      str += (((@w/2)) + (((@w/2) - 100 )  * Math.sin(a * x))) + " "+  (((@h/2)) + (((@h/2) - 50 )  * Math.cos(b * x + phi))) + " ";
      x += dt

    @curve.setAttributeNS(null,"d", str);
  
  animate: =>
    if @paused == false
      @Lissajou(@alpha, @beta, @phi);
      @phi += @dphi
      @phi %= 2.0 * Math.PI
      # console.log @phi
      # if @phi > (2.0 * Math.PI) - @dphi && @phi < (2.0 * Math.PI) + @dphi
      #   @alpha++
      #   @beta++
      #   if @alpha == 11
      #     @alpha=1
      #     @beta=2
      #   else
      #     @alpha=1
      #     @beta++
      # else
      #   @alpha++
      @modifyColor()
  
  modifyColor: =>
    # @curve.setAttributeNS(null,"stroke", @randoColor());
    @curve.setAttributeNS(null,"stroke", @rbgColor()); 
    

  rbgColor: =>
    @colorCounter++
    if @colorspeed < @colorCounter
      @colorCounter = 0
      @colorCount += 1
      if @colorCount > @rbg.length - 1
          @colorCount = 0
    return @rbg[@colorCount]

  randoColor: =>
    r=Math.random()*(16777215)
    return "#"+Math.floor(r).toString(16)


window.onload = =>
  _app = new App()