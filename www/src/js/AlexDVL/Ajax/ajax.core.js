var Ajax = function(settings)
{
    this._urlAjax = settings.urlAjax;
    this._timeout = settings.timeout;
    this._dataType = settings.dataType;
    this._queryHistory = [];
}

Ajax.prototype.isLoading = false;
Ajax.prototype.isFirstVisit = true;

Ajax.prototype.activateBackButton = function()
{
    this.add(
    {
        eventName     : 'popstate',
        selector      : window,
        dynamicData     : function()
        {
            var settings = this.Ajax
                ._queryHistory[this.Ajax.getRelativeLink(document.location)];
            if (!settings)
            {
                document.location.reload();
            }
            settings.sendData = settings.data();
            settings.changeUrl = false;
            return settings;
        }
    });
}

Ajax.prototype._clone = function(obj)
{
    copy = {};
    for (var attr in obj)
    {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

Ajax.prototype._firstAddHistory = function(settings)
{
    if (Ajax.prototype.isFirstVisit)
    {
        var link = this.getRelativeLink(document.location);
        if (link === '/')
        {
            link = document.location.href;
        }
        var node = $(settings.filterSelector + '[href="' + link + '"]')[0];
        if (node)
        {
            settings.target = node;
            this._queryHistory[this.getRelativeLink(document.location)] =
                this._clone(settings);
        }
        Ajax.prototype.isFirstVisit = false;
    }
}

Ajax.prototype.add = function(settings)
{
    settings.Ajax = this;
    this._firstAddHistory(settings);
    $(settings.selector).on(
        settings.eventName,
        settings.filterSelector,
        function(event)
        {
            var obj = settings.Ajax._clone(settings);
            obj.target = event.target;
            if (obj.dynamicData)
                var result = obj.dynamicData();
            if (event.type === 'popstate')
                obj = result;
            else if (result === false)
                return false;
            obj.sendData = obj.data();
            obj.Ajax._ajaxRequest(obj);
            return false;
        }
    );
}

Ajax.prototype._ajaxRequest = function(settings)
{
    if (Ajax.prototype.isLoading) return;
    Ajax.prototype.isLoading = true;
    $.ajax(
    {
        dataType  : this._dataType,
        timeout   : this._timeout,
        url       : this._urlAjax,
        data      : settings.sendData,
        beforeSend: function()
                    {
                        settings.Ajax._startAjaxRequest(settings);
                        settings.preLoader();
                    },
        success   : function(data)
                    {
                        settings.handler(data);
                        settings.Ajax._endAjaxRequest(data, settings);
                    },
        error     : settings.error,
        complete  : function()
                    {
                        settings.preLoader();
                        Ajax.prototype.isLoading = false;
                    }
    });
}

Ajax.prototype.getRelativeLink = function(obj, split)
{
    split = split || false;
    return  window.history.pushState ? (obj.pathname
                + (split ? obj.search.split(split.char)[split.item] : obj.search))
            : (split ? obj.hash.substring(1).split(split.char)[split.item]
              : obj.hash.substring(1));
}

Ajax.prototype._startAjaxRequest = function(settings)
{
    if (settings.audit)
    {
        yaCounter28763381.hit(
            settings.target.href,
            settings.target.title,
            this.getRelativeLink(settings.target));
        ga('send',
        {
            'hitType': 'pageview',
            'page': settings.target.href,
            'title': settings.target.title
        });
    }
    if (settings.changeUrl)
    {
        history.pushState(null, null, settings.target.href);
    }
}

Ajax.prototype._endAjaxRequest = function(data, settings)
{
    if (settings.updateTitle)
    {
        document.title = data.pageTitle;
    }
    if (settings.changeActiveClass)
    {
        $(settings.target.parentNode)
            .addClass('active-a')
            .siblings('.active-a')
            .removeClass('active-a');
    }
    if (!this._queryHistory[this.getRelativeLink(settings.target)])
    {
        this._queryHistory[this.getRelativeLink(settings.target)] =
            this._clone(settings);
    }
}