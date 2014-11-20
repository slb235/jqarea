(($, window) ->
  class JQueryArea
 
    constructor: (el, options) ->
      @options = options
      @$el = $(el)
      @build()
      
    build: ->
      @$el.addClass 'jqa'
      @$wrapper = $('<div />', { class: 'wrapper' }).appendTo @$el
      
      prefill = []
      ol = @$el.find('ol')
      for fill in ol.find('li')
        data = $(fill).data()
        data.text = $(fill).text()
        prefill.push data
      ol.remove()
      
      @popup = $('<div />', { class: 'popup' }).appendTo(@$el).hide()
      
      fill = undefined
      fill_popup = []
      
      for cell in [0..@options.cellCount-1]
        cell = $ '<span />',
          class: 'cell'
          css:
            width: @options.cellWidth
            height: @options.cellHeight

        if fill
          if fill.cells <= 0
            fill.$el.appendTo @$wrapper
            fill = undefined

        unless fill
          fill = prefill.shift()
          if fill
            fill.$el = $ '<a />'
            if fill.link
              fill.$el.attr 'href', fill.link
            fill_popup.push fill

        if fill
          fill.cells--
          fill.cells--
          cell.css
            'background-color': fill.color
          cell.appendTo fill.$el
        else
          cell.addClass 'unused'
          cell.appendTo @$wrapper
        
      @$el.css
        width: "#{@options.cellWidth*@options.cellsInLine}px"
      
      @$el.find('input[type=range]').on(
        input: (evt) =>
          val = $(evt.target).val()
          @$el.find('.unused').removeClass('marked').slice(0, val)
            .addClass 'marked'
      ).trigger 'input'
          
      @disableCloseMove = false
    
      for popup in fill_popup
        init_popup = =>
          cpopup = popup
          
          cpopup.$el.on
            mouseenter: (e) =>
              unless @disableCloseMove
                @popup.css
                  left: "#{e.pageX+10}px"
                  top: "#{e.pageY-$(window).scrollTop()+10}px"
                if cpopup.popup
                  html = $(cpopup.popup).html()
                  if html != @popup.html()
                    @popup.html html
                else
                  @popup.text cpopup.text
                @popup.show()
            mouseleave: =>
              @popup.hide() unless @disableCloseMove
            mousemove: (e) =>
              unless @disableCloseMove
                @popup.css
                  left: "#{e.pageX+10}px"
                  top: "#{e.pageY-$(window).scrollTop()+10}px"
            click: =>
              @disableCloseMove = ! @disableCloseMove

          
        init_popup()
      

  $.fn.extend jqarea: (option, args...) ->
    defaults =
      'cellWidth': 5
      'cellHeight': 5
      'cellCount': 400
      'cellsInLine': 20

    options = $.extend defaults, options
    
    @each ->
      $this = $(this)
      data = $this.data()
      
      options = $.extend true, {}, options, data
      plutin = new JQueryArea this, options
) window.jQuery, window