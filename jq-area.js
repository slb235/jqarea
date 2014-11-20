(function() {
  var __slice = [].slice;

  (function($, window) {
    var JQueryArea;
    JQueryArea = (function() {
      function JQueryArea(el, options) {
        this.options = options;
        this.$el = $(el);
        this.build();
      }

      JQueryArea.prototype.build = function() {
        var cell, data, fill, fill_popup, init_popup, ol, popup, prefill, _i, _j, _k, _len, _len1, _ref, _ref1, _results;
        this.$el.addClass('jqa');
        this.$wrapper = $('<div />', {
          "class": 'wrapper'
        }).appendTo(this.$el);
        prefill = [];
        ol = this.$el.find('ol');
        _ref = ol.find('li');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          fill = _ref[_i];
          data = $(fill).data();
          data.text = $(fill).text();
          prefill.push(data);
        }
        ol.remove();
        this.popup = $('<div />', {
          "class": 'popup'
        }).appendTo(this.$el).hide();
        fill = void 0;
        fill_popup = [];
        for (cell = _j = 0, _ref1 = this.options.cellCount - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; cell = 0 <= _ref1 ? ++_j : --_j) {
          cell = $('<span />', {
            "class": 'cell',
            css: {
              width: this.options.cellWidth,
              height: this.options.cellHeight
            }
          });
          if (fill) {
            if (fill.cells <= 0) {
              fill.$el.appendTo(this.$wrapper);
              fill = void 0;
            }
          }
          if (!fill) {
            fill = prefill.shift();
            if (fill) {
              fill.$el = $('<a />');
              if (fill.link) {
                fill.$el.attr('href', fill.link);
              }
              fill_popup.push(fill);
            }
          }
          if (fill) {
            fill.cells--;
            fill.cells--;
            cell.css({
              'background-color': fill.color
            });
            cell.appendTo(fill.$el);
          } else {
            cell.addClass('unused');
            cell.appendTo(this.$wrapper);
          }
        }
        this.$el.css({
          width: "" + (this.options.cellWidth * this.options.cellsInLine) + "px"
        });
        this.$el.find('input[type=range]').on({
          input: (function(_this) {
            return function(evt) {
              var val;
              val = $(evt.target).val();
              return _this.$el.find('.unused').removeClass('marked').slice(0, val).addClass('marked');
            };
          })(this)
        }).trigger('input');
        this.disableCloseMove = false;
        _results = [];
        for (_k = 0, _len1 = fill_popup.length; _k < _len1; _k++) {
          popup = fill_popup[_k];
          init_popup = (function(_this) {
            return function() {
              var cpopup;
              cpopup = popup;
              return cpopup.$el.on({
                mouseenter: function(e) {
                  var html;
                  if (!_this.disableCloseMove) {
                    _this.popup.css({
                      left: "" + (e.pageX + 10) + "px",
                      top: "" + (e.pageY - $(window).scrollTop() + 10) + "px"
                    });
                    if (cpopup.popup) {
                      html = $(cpopup.popup).html();
                      if (html !== _this.popup.html()) {
                        _this.popup.html(html);
                      }
                    } else {
                      _this.popup.text(cpopup.text);
                    }
                    return _this.popup.show();
                  }
                },
                mouseleave: function() {
                  if (!_this.disableCloseMove) {
                    return _this.popup.hide();
                  }
                },
                mousemove: function(e) {
                  if (!_this.disableCloseMove) {
                    return _this.popup.css({
                      left: "" + (e.pageX + 10) + "px",
                      top: "" + (e.pageY - $(window).scrollTop() + 10) + "px"
                    });
                  }
                },
                click: function() {
                  return _this.disableCloseMove = !_this.disableCloseMove;
                }
              });
            };
          })(this);
          _results.push(init_popup());
        }
        return _results;
      };

      return JQueryArea;

    })();
    return $.fn.extend({
      jqarea: function() {
        var args, defaults, option, options;
        option = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        defaults = {
          'cellWidth': 5,
          'cellHeight': 5,
          'cellCount': 400,
          'cellsInLine': 20
        };
        options = $.extend(defaults, options);
        return this.each(function() {
          var $this, data, plutin;
          $this = $(this);
          data = $this.data();
          options = $.extend(true, {}, options, data);
          return plutin = new JQueryArea(this, options);
        });
      }
    });
  })(window.jQuery, window);

}).call(this);
