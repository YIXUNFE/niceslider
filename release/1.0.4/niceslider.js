"use strict"
;(function ($) {  
  
  /**
   * NiceSlider
   */
  
  //����PC���ƶ����¼�
  var _mobileCheck = 'ontouchend' in document,
    ev = {
      click: 'click',
      start: _mobileCheck ? 'touchstart' : 'mousedown',
      move: _mobileCheck ? 'touchmove' : 'mousemove',
      end: _mobileCheck ? 'touchend' : 'mouseup',
      cancel: _mobileCheck ? 'touchcancel' : 'mousecancel'
    }
  
  var _prefix = (function () {
    var div = document.createElement('div'),
      style = div.style,
    /*  arr = ['WebkitT', 'MozT', 'MsT'],
      temp = '',
      i = 0,
      l = 3,*/
      
      result = ''
      
    /*for (i; i < l; i++) {
      temp = arr[i]
      if (typeof style[temp + 'ransform'] !== 'undefined') {
        result = '-' + temp.replace('T', '').toLowerCase() + '-'
        break
      }
    }*/
    if (style.WebkitTransform === '') {
      result = '-webkit-'
    } else if (style.MozTransform === '') {
      result = '-moz-'
    } else if (style.MsTransform === '') {
      result = '-ms-'
    }
    return result
  }())
  
  /**
   * ������
   * @param {Boolean} unlimit �Ƿ�ִ���޷�ѭ��
   * @param {Boolean} ctrlBtn �Ƿ�������ҿ��ư�ť
   * @param {Boolean} indexBtn �Ƿ�������б�ǩ
   * @param {Function} indexFormat indxBtnΪtrue������£����б�ǩ���ݵ�format����������ֵ���������ǩԪ����
   * @param {Number} unit ����������Ĭ��1����0��ʾ����������
   * @param {Number} offset ƫ��ֵ
   * @param {Number} index ��ʼ�����
   * @param {String} dir �ƶ�����
   * @param {Boolean} autoPlay �Ƿ��Զ�����
   * @param {Number} duration �Զ����ż��ʱ��
   * @param {Boolean} bounce �Ƿ���лص�Ч��
   * @param {Boolean} drag �Ƿ�֧����ק
   * @param {Boolean} indexBind indxBtnΪtrue������£��Ƿ�����б�ǩ��ӻ����¼�
   * @param {Function} onChange ��λ����ִ����ɺ󴥷�
   * @param {Boolean} noAnimate �رն���
   * @param {String} animation ָ������Ч��
   */
  var _defaultConfig = {
    unlimit: true,
    ctrlBtn: true,
    indexBtn: true,
    /*indexFormat: function (i) {
      return '��' + i + '��'
    },
    extendAnimate: {
      'swing': function (t, b, c, d) {
        return t / d * c + b
      }
    }
    */
    unit: 1,
    offset: 0,
    index: 0,
    dir: 'h',
    autoPlay: false,
    duration: 5000,
    bounce: true,
    drag: true,
    indexBind: true,
    noAnimate: false,
    animation: 'ease-out-back'
  }
  
  /**
   * ����������
   * @type {Function} 
   * @param {Object} cfg
   * @return {Object}
   */
  function _handleCfg (cfg) {
    return $.extend({}, _defaultConfig, cfg)
  }
  
  /**
   * ����Ԫ��λ��
   * @type {Function} 
   * @param {Object} jDom jQuery/Zepto����
   * @param {Number} dist λ��ֵ
   */
  var _setDist = function (jDom, dist, isVertical) {
    var d = {}
    if (_mobileCheck) {
      if (!isVertical) {
        d[_prefix + 'transform'] = 'translate3d(' + dist + 'px, 0, 0)'
      } else {
        d[_prefix + 'transform'] = 'translate3d(0, ' + dist + 'px, 0)'
      }
      jDom.css(d)
    } else {
      if (!isVertical) {
        d.left = dist + 'px'
      } else {
        d.top = dist + 'px'
      }
      jDom.css(d)
    }
  }
  
  /**
   * ʱ����Ť������
   * @param {Number} t current time����ǰʱ�䣩
   * @param {Number} b beginning value����ʼֵ����0����b=0��
   * @param {Number} c change in value���仯������1����c=1��
   * @param {Number} d duration������ʱ�䣩 ��1����d=1��
   * @return {Number}
   */
  var _aniFn = {
    'ease-out-back': function (t, b, c, d) {
      var s = 1.70158
      return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b
    },
    'linear': function (t, b, c, d) {
      return t / d * c + b
    }
  }
  
  /**
   * ��Ӷ�������
   * @param {Object} obj ��������
   */
  function _extendAnimate (obj) {
    $.extend(_aniFn, obj)
  }
  
  /**
   * ʹ��requestAnimationFrame���setTimeout/setInterval
   * @param {Object} obj ��������
   */
  function _rAF (fn) {
    var a = (window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    setTimeout)(fn)
    return a
  }
  
  function _cAF (id) {
    (window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    clearTimeout)(id)
    return null
  }
  
  /**
   * ��������
   * @param {Object} args
   */
  function _animate (args) {
    var start = args.start || 0,
      end = args.end || 0,
      jDom = args.dom,
      time = args.time,
      distence = end - start,
      current = start,
      startTime = +new Date,
      pastTime = 0,
      isVertical = this.isVertical,
      that = this
    if (this._at) {_cAF(this._at)}
    
    function _step () {
      that._at = _rAF(function () {
        pastTime = +new Date - startTime
        current = (_aniFn[that.cfg.animation] || _aniFn.linear)(pastTime, start, distence, time)
        _setDist(jDom, current, isVertical)
        
        //����һ�������ǰ��λ��ֵ���������Ʋ���ʱʹ��
        //that.moveDist = current
        
        if (pastTime >= time) {
          _cAF(that._at)
          _setDist(jDom, end, isVertical)
          args.cb && args.cb.apply(that)
          that._isAni = false
          that.cfg.onChange && that.cfg.onChange.apply(that)
        } else {
          _step()
        }
      })
    }
    
    this._isAni = true
    _step()
    
  }
  
  /**
   * ȡ����������
   * @type {Function}
   */
  function _cancelAnimate () {
    if (this._isAni) {_cAF(this._at); this._isAni = false; _resetIndex.apply(this)}
  }
  
  /**
   * ����Ԫ��λ�ƶ���
   * @type {Function} 
   * @param {Object} jDom jQuery/Zepto����
   * @param {Number} left λ��ֵ
   */
  function _setAni (start, end, time) {
    //jDom.animate(data, 300, 'swing', function () {})
    _animate.call(this, {
      dom: this.jBox,
      start: start,
      end: end,
      time: typeof time === 'number' ? time : 300,
      cb: _resetIndex
    })
  }
  
  /**
   * Ϊǰ�����Ԫ�ذ��¼�
   * @type {Function} 
   * @param {Object} prevBtn 
   * @param {Object} nextBtn 
   */
  function _bindCtrlBtn (prevBtn, nextBtn) {
    var that = this
    this.jPrev = prevBtn.on(ev.click, function () {
      that.prev()
    })
    this.jNext = nextBtn.on(ev.click, function () {
      that.next()
    })
  }
  
  /**
   * ������������
   * @type {Function} 
   */
  function _createSteps () {
    var i = 0,
      items = this.jItem,
      l = this.stepLength,
      html = '<ol class="slider-steps">',
      indexFormat = this.cfg.indexFormat,
      that = this,
      steps = null,
      cfg = this.cfg
    
    for (i; i < l; i++) {
      html += '<li class="step">' + (indexFormat ? indexFormat.call(that, i) : i) + '</li>'
    }
    html += '</ol>'
    this.jWrap.append(html)
    if (this.cfg.indexBind) {
      steps = this.jWrap.find('.slider-steps').on(ev.click, '.step', function () {
        var s = $(this), index
        if (s.hasClass('disable')) {return}
        index = steps.find('.step').index(s)
        that.moveTo(index)
      })
    } else {
      steps = this.jWrap.find('.slider-steps')
    }
    this.jSteps = steps
  }
  
  /**
   * �������DOM�ṹ
   * @type {Function} 
   */
  function _create () {
    var html = '<div class="slider-wrapper"><div class="slider-content"></div></div>',
      cfg = this.cfg,
      box = null,
      items,
      wrapper,
      content,
      width,
      height,
      multiple = 1,
      isVertical = cfg.dir === 'h' ? false : true,
      rangeWidth, rangeHeight, realLength, size
    
    this.isVertical = isVertical
    
    //����refresh���
    if (this.jWrap) {
      box = this.fragmentDom.clone(true)
      this.jWrap.after(box)
      this.jWrap.remove()
      delete this.jWrap
      this.jBox = box
    } else {
      box = this.jBox
      this.fragmentDom = box.clone(true)
    }
    box.wrap(html)
    this.jWrap = wrapper = box.closest('.slider-wrapper')
    this.jItem = items = box.children()
    this.jContent = content = wrapper.find('.slider-content')
    if (cfg.ctrlBtn) {
      wrapper.append('<div class="slider-control"><span class="prev"><span class="prev-s"></span></span><span class="next"><span class="next-s"></span></span></div>')
      _bindCtrlBtn.call(this, wrapper.find('.prev'), wrapper.find('.next'))
      this.jCtrl = this.jWrap.find('.slider-control')
    }
    if (items.length > 1) {
      //Zepto����û��outWidth����������ʹ��width
      width = items.width()
      height = items.height()
      
      if (cfg.unlimit) {
        box.append(items.clone())
        multiple = 2
        if (items.length === 2) {
          box.append(items.clone())
          multiple = 3
        }
      
        //���»�ȡslider item
        this.jItem = items = box.children()
      }
      realLength = items.length / multiple
      
      if (!isVertical) {
        this.jItem.width(width)
        box.width(width * items.length)
        size = Math.ceil(width * items.length / multiple)
        content.height(box.height())
        rangeWidth = size - this.jWrap.width() + cfg.offset
        this.current = cfg.index * width
      } else {
        this.jItem.height(height)
        box.height(height * items.length)
        size = Math.ceil(height * items.length / multiple)
        content.width(box.width()).height(height)
        rangeHeight = size - this.jWrap.height() + cfg.offset
        this.current = cfg.index * height
      }
      this.wrapperSize = isVertical ? wrapper.height() : wrapper.width()
      this.itemSize = isVertical ? height : width
      this.moveUnit = cfg.unit > 0 ? this.itemSize * cfg.unit : this.wrapperSize
      this.scope = isVertical ? rangeHeight : rangeWidth
      this.stepLength = cfg.unit > 0 ? Math.round(this.scope / this.moveUnit + 1) : Math.round(this.itemSize * realLength / this.wrapperSize)
      if (cfg.unlimit && cfg.unit) {this.stepLength += Math.round((this.wrapperSize - cfg.offset - this.itemSize) / this.moveUnit)}
      if (cfg.indexBtn) {
        _createSteps.apply(this)
      }
      this.moveTo(cfg.index, 0)
    } else {
      width = items.width()
      height = items.height()
      realLength = 1
      this.wrapperSize = isVertical ? wrapper.height() : wrapper.width()
      this.itemSize = isVertical ? height : width
      this.moveUnit = 0
      this.scope = 0
      this.stepLength = 1
      if (!isVertical) {
        box.width(width)
        content.height(box.height())
        rangeWidth = 0
        wrapper.addClass('slider-no-effect')
        this.current = 0
        this.moveTo(0, 0)
      } else {
        box.height(height)
        content.width(box.width())
        rangeHeight = 0
        wrapper.addClass('slider-no-effect')
        this.current = 0
        this.moveTo(0, 0)
      }
    }
  }
  
  ////////////////////////darg���
  var _origin = {},
    _currentPoint = {},
    _locked = false,
    _isChecked = false,
    _dir = true,
    _distance = 0,
    _currentSlider = null,
    _sliderArray = [],
    _bound = false,
    _sliderCount = 0
  
  /**
   * ��ȡ�¼������е�����ֵ
   * @type {Function} 
   * @param {Object} e
   * @return {Object} ��������ֵ�Ķ���
   */
  var _getXY = function (e) {
    var e = e.originalEvent ? e.originalEvent : e,
      touches = e.touches,
      x,
      y
    if (touches) {
      x = touches[0].pageX
      y = touches[0].pageY
    } else {
      x = e.clientX
      y = e.clientY
    }
    
    return {x: x, y: y} 
  }
  
  /**
   * ������
   * @type {Function} 
   * @param {Object} e
   */
  function _touchstart (e) {
    _cancelAnimate.apply(this)
    this.touched = true
    _origin = _getXY(e)
    _locked = false
    _isChecked = false
    _dir = 0
    _distance = 0
    _sliderArray.push(this)
    //if (this.timer) {clearTimeout(this.timer)}
  }
  
  /**
   * ������
   * @type {Function} 
   * @param {Object} e
   */
  function _touchmove (e) {
    _currentSlider = _sliderArray[0]
    if (_currentSlider && _currentSlider.cfg.drag && !_currentSlider.checkLock()) {
      if (_currentSlider.touched) {
        if (_currentSlider.timer) {clearTimeout(_currentSlider.timer)}
        _currentPoint = _getXY(e)
        _handleMove.call(_currentSlider, _currentSlider.isVertical ? (_currentPoint.y - _origin.y) : (_currentPoint.x - _origin.x))
        if (_locked) {e.preventDefault()}
      }
    } else {
      _sliderArray.shift()
    }
  }
  
  /**
   * �����ͷ�
   * @type {Function} 
   * @param {Object} e
   */
  function _touchend (e) {
    if (_currentSlider) {
      if (_currentSlider.cfg.drag) {
        _origin = {}
        _currentPoint = {}
        if (_locked) {_checkIndex.apply(_currentSlider)}
        _currentSlider.touched = false
        _locked = false
      }
      _setAutoPlay.apply(_currentSlider)
      _currentSlider.moveDist = 0
    }
    _currentSlider = null
    _sliderArray = []
  }
  
  /**
   * �ж�����/���һ���
   * @type {Function} 
   * @param {Number} deltaX
   * @param {Number} deltaY
   */
  function _checkDir (deltaX, deltaY) {
    if ((this.isVertical && Math.abs(deltaX) > Math.abs(deltaY))|| (!this.isVertical && Math.abs(deltaY) > Math.abs(deltaX))) {
      _sliderArray.shift()
      if (_sliderArray.length) {
        _currentSlider = _sliderArray[0]
        _checkDir.call(_currentSlider, deltaX, deltaY)
        return
      } else {
        _locked = false
        this.touched = false
      }
    } else {
      _locked = true
    }
    _isChecked = true
  }
  
  /**
   * ��������ƶ�
   * @type {Function} 
   * @param {Number} delta
   */
  function _handleMove (delta) {
    if (!_isChecked) {
      _checkDir.call(this, _currentPoint.x - _origin.x, _currentPoint.y - _origin.y)
      return
    }
    //����slider��������
    _dir = delta > 0
    
    if (_dir && this.checkLockPrev()) {
      delta = 0
    }
    if (!_dir && this.checkLockNext()) {
      delta = 0
    }
    
    _distance = delta
    _move.call(this, delta)
  }
  
  ///////////////drag���
  
  /**
   * slider��Ե�ǰλ�����ƶ�
   * @type {Function} 
   * @param {Number} dist λ�ƾ���
   */
  function _move (dist) {
    var isVertical = this.isVertical,
      origin = this.current,
      range = this.scope
    var dist = origin + dist
    if (!this.cfg.bounce && !this.cfg.unlimit) {
      dist = Math.min(0, Math.max(dist, -1 * range))
    }
    _setDist(this.jBox, dist, isVertical)
    this.moveDist = dist
  }
  
  /**
   * ��slider���ƶ�ֵ�����ȷ����ǰindex
   * @type {Function} 
   */
  function _checkIndex () {
    var isVertical = this.isVertical,
      idx = this.currentIndex,
      unitDist = this.moveUnit,
      l = this.jItem.length,
      rl = this.stepLength,
      d = Math.abs(_distance),
      deltaIndex = 0
    //δ���������¼� _dir��0 ����booleanֵ
    if (_dir === 0) {return}
            
    if (this.cfg.unlimit) {
      _dir ? this.prev() : this.next()
    } else {
      //���ݻ��������жϻ����˶��ٸ�item
      if (d > unitDist / 4) {
        deltaIndex = (_dir ? -1 : 1) * Math.ceil(d / unitDist)
      }
      idx = idx + deltaIndex
      idx = Math.max(0, Math.min(idx, this.stepLength - 1))
      this.moveTo(idx)
    }
  }
  
  /**
   * ��slider�Ŀ��ư�ť�����
   * @type {Function} 
   */
  function _checkCtrlBtn () {
    var idx = this.currentIndex,
      cfg = this.cfg,
      l = this.stepLength,
      pb = this.jPrev,
      nb = this.jNext
    
    if (!cfg.unlimit) { 
      //�����ư�ť״̬
      if (idx === 0) {
        pb.addClass('disable')
      } else {
        pb.removeClass('disable')
      }
      if (idx === l - 1) {
        nb.addClass('disable')
      } else {
        nb.removeClass('disable')
      }
    } else {
      if (l === 1) {
        pb.addClass('disable')
        nb.addClass('disable')
      }
    }
  }
  
  /**
   * ������ǰindex
   * @type {Function} 
   */
  function _toggleStepTo () {
    var idx = this.currentIndex,
      cfg = this.cfg,
      l = this.stepLength,
      pb = this.jPrev,
      nb = this.jNext
     
    this.jSteps.find('.step').removeClass('current').eq(idx % l).addClass('current')
  }
  
  /**
   * �ṩһ���ӿ����û������ȷ�ĵ�ǰ����
   * @type {Function} 
   */
  function _getIndex () {
    return this.currentIndex % this.stepLength
  }
  
  /**
   * ִ���Զ�����
   * @type {Function} 
   */
  function _setAutoPlay () {
    var that = this,
      cfg = this.cfg
    if (cfg.autoPlay) {
      if (this.timer) {clearTimeout(this.timer)}
      this.timer = setTimeout(function () {
        //that.next()
        
        var idx = that.currentIndex + 1
        if (that.cfg.unlimit) {
          that.moveTo(idx)
        } else {
          idx = idx % that.stepLength
          that.moveTo(idx)
        }
        
        _setAutoPlay.apply(that)
      }, this.cfg.duration)
    }
  }
  
  /**
   * �޷�ѭ��ʱ���������������ú����index
   * @type {Function} 
   */
  function _resetIndex () {
    var idx, rl, l
    if (this.cfg.unlimit && !this.touched) {
      idx = this.currentIndex
      rl = this.stepLength
      l = Math.ceil(this.jItem.length * this.itemSize / this.moveUnit)
      if (rl > 1) {
        if (idx <= 1) {
          idx = rl + 1
          this.setIndexTo(idx)
        } else if (idx >= l - 2) {
          idx = l - 2 - rl
          this.setIndexTo(idx)
        }
      }
    }
  }
  
  /**
   * slider��λ����Ӧindex
   * @type {Function} 
   * @param {Number} idx
   * @param {Number} duration �Ƿ�������λ
   */
  function _moveTo (idx, duration) {
    var isVertical = this.isVertical,
      l = this.jItem.length,
      unitDist = this.moveUnit,
      range = this.scope,
      offset = this.cfg.offset,
      rl = this.stepLength,
      dist = 0,
      that = this
    
    if (this.cfg.unlimit) {
      if (rl > 1) {
        if (idx <= 0) {
          idx = rl
          this.setIndexTo(idx + 1)
        } else if (idx >= l - 1) {
          idx = l - 1 - rl
          this.setIndexTo(idx - 1)
        }
        dist = -1 * idx * unitDist + offset
      } else {
        idx = 0
        dist = offset
      }
    } else {
      idx = idx % l
      dist = Math.max(-1 * idx * unitDist + offset, -1 * range)
    }
    
    //if (!isImmediate && !this.cfg.noAnimate) {
      _setAni.call(this, this.touched ? this.moveDist : this.current, dist, this.cfg.noAnimate ? 0 : duration)
    //} else {
      //_setAni.call(this, dist, dist, 0)
    //}
    
    this.currentIndex = idx
    this.current = dist
    
    if (this.jSteps) {_toggleStepTo.apply(this)}
    if (this.cfg.ctrlBtn) {_checkCtrlBtn.apply(this)}
    _setAutoPlay.apply(this)
    return this
  }
  
  /**
   * slider������ʾΪ��Ӧindex��
   * @type {Function} 
   * @param {Number} idx
   */
  function _setIndexTo (idx) {
    var isVertical = this.isVertical,
      wrapper = this.jWrap,
      l = this.stepLength,
      unitDist = this.moveUnit,
      offset = this.cfg.offset,
      dist
    if (idx.toString() === 'NaN') {return}
    dist = -1 * idx * unitDist + offset
    _setDist(this.jBox, dist, isVertical)
    this.currentIndex = idx
    this.current = dist
    return this
  }
  
  /**
   * slider��ǰ����һ��
   * @type {Function} 
   */
  function _prev () {
    var idx = this.currentIndex - 1
    var isLocked = this.checkLock() || this.checkLockPrev()
    if (isLocked) {return}
    if (this.cfg.unlimit) {
      this.moveTo(idx)
    } else {
      if (idx < 0) {return}
      this.moveTo(idx)
    }
    return this
  }
  
  /**
   * slider���󻬶�һ��
   * @type {Function} 
   */
  function _next () {
    var idx = this.currentIndex + 1
    var isLocked = this.checkLock() || this.checkLockNext()
    if (isLocked) {return}
    if (this.cfg.unlimit) {
      this.moveTo(idx)
    } else {
      if (idx >= this.stepLength) {return}
      this.moveTo(idx)
    }
    return this
  }
  
  /**
   * ˢ��slider
   * @type {Function} 
   * @param {Object}
   */
  function _refresh (cfg) {
    
    this.cfg = _handleCfg($.extend(this.cfg, {index: this.currentIndex}, cfg))
    if (this.timer) {clearTimeout(this.timer)}
    _sliderCount--
    _init.apply(this)
    return this
  }
  
  /**
   * ����ʵ������
   * @type {Function} 
   */
  function _destroy () {
    var item = ''
    this.jWrap.off().remove()
    this.timer && clearTimeout(this.timer)
    for (item in this) {
      delete this[item]
    }
    
    this.__proto__ = null
    
    _sliderCount--
    if (_sliderCount === 0) {
      _unbind()
    }
  }
  
  /**
   * ����ק����¼�
   * @type {Function} 
   */
  function _bind () {
    var that = this
    this.jContent.on(ev.start, function (e) {_touchstart.call(that, e)})
    if (!_bound) {
      $(document).on(ev.move, _touchmove).on(ev.end, _touchend).on(ev.cancel, _touchend)
      
      !_mobileCheck && this.jWrap.hover(function () {
        that.timer && clearTimeout(that.timer)
      }, function () {
        _setAutoPlay.apply(that)
      })
      _bound = true
    }
  }
  
  /**
   * �Ƴ������¼�
   * @type {Function} 
   */
  function _unbind () {
    $(document).off(ev.move, _touchmove).off(ev.end, _touchend).off(ev.cancel, _touchend)
    _bound = false
  }
  
  /**
   * ��ʼ��
   * @type {Function} 
   */
  function _init () {
    this.currentIndex = this.cfg.index
    if (this.cfg.extendAnimate) {_extendAnimate(this.cfg.extendAnimate)}
    _create.apply(this)
    _bind.apply(this)
    _setAutoPlay.apply(this)
    _sliderCount++
  }
  
  /**
   * NiceSlider����
   * @type {Function}
   * @param {Object} dom 
   * @param {Object} cfg ������
   */
  function NiceSlider (dom, cfg) {
    this.jBox = $(dom)
    this.cfg = _handleCfg(cfg || {})
    
    var _islocked = false
    
    /**
     * ��鵱ǰ�Ƿ�����
     * @type {Function}
     */
    function _checkLock () {
      return _islocked
    }
    
    /**
     * ���õ�ǰΪ����״̬
     * @type {Function}
     */
    function _lock () {
      _islocked = true
      return this
    }
    
    /**
     * ����
     * @type {Function}
     */
    function _unlock () {
      _islocked = false
      return this
    }
    
    this.checkLock = _checkLock
    this.lock = _lock
    this.unlock = _unlock
    
    //����������
    var _isLockPrev = false,
      _isLockNext = false
      
    /**
     * �Ƿ�����ǰһ��
     * @type {Function}
     */
    function _checkLockPrev () {
      return _isLockPrev
    }
    
    /**
     * �Ƿ�������һ��
     * @type {Function}
     */
    function _checkLockNext () {
      return _isLockNext
    }
    
    /**
     * ����ǰһ��
     * @type {Function}
     */
    function _lockPrev () {
      _isLockPrev = true
      return this
    }
    
    /**
     * ����ǰһ��
     * @type {Function}
     */
    function _unlockPrev () {
      _isLockPrev = false
      return this
    }
    
    /**
     * ������һ��
     * @type {Function}
     */
    function _lockNext () {
      _isLockNext = true
      return this
    }
    
    /**
     * ������һ��
     * @type {Function}
     */
    function _unlockNext () {
      _isLockNext = false
      return this
    }
    
    this.checkLockPrev = _checkLockPrev
    this.lockPrev = _lockPrev
    this.unlockPrev = _unlockPrev
    this.checkLockNext = _checkLockNext
    this.lockNext = _lockNext
    this.unlockNext = _unlockNext
    
    _init.apply(this)
    return this
  }
  
  NiceSlider.prototype = {
    prev: _prev,
    next: _next,
    setIndexTo: _setIndexTo,
    moveTo: _moveTo,
    getIndex: _getIndex,
    refresh: _refresh,
    destroy: _destroy
  }
  
  if(typeof define === 'function' && define.amd) {
		define([], function () {
			return NiceSlider
		})
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = NiceSlider
	} else {
		window.NiceSlider = NiceSlider
	}
  
}(window.jQuery || window.Zepto))