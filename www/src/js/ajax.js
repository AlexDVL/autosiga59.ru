var AS59ajaxLink = new Ajax({
    urlAjax : '/ajax',
    timeout : 3000,
    dataType : 'json'
});

AS59ajaxLink.mainMenu = function (data)
{
    var appendData = data.tagList;
    $('#content').empty().append(appendData, data.content);
    if (data.tagList)
    {
        $('.tags a[href="'
            + this.Ajax.getRelativeLink(document.location, {char:'&', item:0})
            + '"]').parent().addClass('active-a');
    }
}

AS59ajaxLink.ajaxBlogUpdatePosts = function(data)
{
    $('#posts').append(data.content);
    $('#blogUpdateSettings').attr('data-offset', (parseInt($('#blogUpdateSettings').attr('data-offset')) + 3));
    if (!data.content)
    {
        $(window).off('scroll');
        $('#posts').append($('<div id="noBlogPost" class="icon tick">').append('На сегодня все. Ждите обновлений.'));
    }
}



AS59ajaxLink.add(
{
    eventName     : 'click',
    selector      : '#mainMenu',
    filterSelector: '#nav a.mainMenuItem',
    preLoader     : function() {$('#content').toggleClass('loading');},
    handler       : AS59ajaxLink.mainMenu,
    data          : function()
    {
        return {
            command : 0,
            link : this.Ajax.getRelativeLink(this.target)
        }
    },
    changeActiveClass : true,
    changeUrl         : true,
    updateTitle       : true,
    audit             : true
});

AS59ajaxLink.activateBackButton();

AS59ajaxLink.add(
{
    eventName     : 'scroll',
    selector      : window,
    preLoader     : function() {$('#blogUpdatePreLoader').toggleClass('loading');},
    handler       : AS59ajaxLink.ajaxBlogUpdatePosts,
    data          : function()
    {
        return {
            command : 1,
            offset : $('#blogUpdateSettings').attr('data-offset')
        }
    },
    dynamicData    : function()
    {
        if (this.Ajax.getRelativeLink(document.location) !== '/blog')
        {
            return false;
        }
        var scroll_pos = $(window).scrollTop();
        if (scroll_pos < 0.7 * ($(document).height() - $(window).height()))
        {
           return false;
        }
    }
});


/*
$(window).ready(function() {
    //selector, filterSelector, changeActiveClass, changeLink, updateTitle, audit, command
    ajaxLinkHandler('#mainMenu', '#nav a.mainMenuItem',      1, 1, 1, 1, 0);
    ajaxLinkHandler('#content',   '#servicesHome a',         0, 1, 1, 1, 0);
    ajaxLinkHandler('#content',   '#servicesNav li a',       1, 1, 1, 1, 3);
    ajaxLinkHandler('#content',   '.post .serviceLinks',     0, 0, 0, 1, 2);
    ajaxLinkHandler('#content',   '.tags a',                 1, 1, 0, 1, 0);
    ajaxLinkHandler('#content',   'a#MoreReviews',           0, 0, 0, 0, 4);
    blogScrollHandler();

    $(window).on('popstate', function(e) {
        var backPathLocation = (history.location.pathname || document.location.pathname).split('/');
        $(['#mainMenu a[href="',
            (backPathLocation[1] ? backPathLocation[1] : document.location.href), '"]'].join(''))
                    .parent().addClass('active-a').siblings('.active-a').removeClass('active-a'); 
        ajaxRequest(backPathLocation, 0, 0, 1, 0, 0, 0);
    });

    $(['.tags a[href="', document.location.pathname.substring(1) + document.location.search, '"]'].join(''))
        .parent().addClass('active-a').siblings('.active-a').removeClass('active-a');
});

function blogScrollHandler()
{
    if ($('#posts div').is('#noBlogPost'))
        { return false; }
    $(window).off('scroll').on('scroll', function() {
        if (isLoading) { return false; }
        if (!$('#content div').is('#posts'))
        { 
            $(window).off('scroll'); 
            return false; 
        }
        var scroll_pos = $(window).scrollTop();
        if (scroll_pos >= 0.7 * ($(document).height() - $(window).height()))
        {
           ajaxRequest('#posts', 0, 0, 0, 0, 0, 1);
        }
    });
}

function ajaxLinkHandler(selector, filterSelector, changeActiveClass, changeLink, updateTitle, audit, command)
{
    $(selector).on('click', filterSelector, function() {
        ajaxRequest(filterSelector, changeActiveClass, changeLink, updateTitle, audit, this, command);
        return false;
    });
}

function ajaxRequest(filterSelector, changeActiveClass, changeLink, updateTitle, audit, thisClick, command)
{
    if (!ajaxArrange(filterSelector, changeLink, audit, thisClick))
        { return false; }
    var location = thisClick ? thisClick : document.location;
    $.ajax({
        dataType: 'json',
        timeout: 3000,
        url: 'ajax',
        data: { link:    !location.hash ? [location.pathname, location.search].join('') : location.hash.substring(1),
                command: command,
                offset:  command === 1 ? $('#blogUpdateSettings').attr('data-offset') :
                         command === 4 ? $('#ReviewsUpdateSettings').attr('data-offset') : 0
              },
        beforeSend: function() { preLoader(command, thisClick); },
        success: function(data) {
            ajaxSuccess(data, filterSelector, thisClick);
            ajaxEnd(data, updateTitle, changeActiveClass, thisClick)
        },
        error: function() { ajaxError(command); },
        complete: function() { preLoader(command, thisClick); isLoading = 0; }
    });
}

function preLoader(command, thisClick)
{
    switch(command)
    {
        case 0:
        case 3:
            $('#content').toggleClass('loading');
            break;
        case 1:
            $('#blogUpdatePreLoader').toggleClass('loading');
            break;
        case 2:
            $(thisClick).parents('.post').toggleClass('loading');
            break;
        case 4:
            $('#ReviewsPreLoader').toggleClass('loading');
            break;
    }
}

function ajaxError(command)
{
    switch(command)
    {
        case 0:
        case 3:
            document.location.reload();
            break;
        case 1:
            break;
        case 2:
            break;
        case 3:
            break;
    }
}

function ajaxArrange(filterSelector, changeLink, audit, thisClick)
{
    if (audit)
    {
        yaCounter28763381.hit(thisClick.href, thisClick.title,
            (document.location.hash === '' ?
                document.location.pathname + document.location.search :
                    document.location.hash.substring(1)));
        ga('send', {
            'hitType': 'pageview',
            'page': thisClick.href,
            'title': thisClick.title
        });
    }
    if (changeLink) {

        history.pushState( null, null, thisClick.href );
    }
    if (thisClick.pathname === '/contacts' || thisClick.pathname === 'contacts')
    {
        isLoading = 1;
        $('html, body').animate({ scrollTop: $("#redFlag").offset().top }, 'fast', function()
            { isLoading = 0; });

        return false;
    }
    isLoading = 1;
    return true;
}

function ajaxEnd(data, updateTitle, changeActiveClass, thisClick)
{
    if (updateTitle)
    {
        document.title = data.pageTitle;
    }
    if (changeActiveClass)
    {
        $(thisClick.parentNode).addClass('active-a').siblings('.active-a').removeClass('active-a');
    }
    if (document.location.pathname === '/blog' || document.location.hash === '#/blog')
    {
        blogScrollHandler();
    }
}

function ajaxSuccess(data, filterSelector, thisClick)
{
    if (filterSelector === '#nav a.mainMenuItem' || filterSelector.length === 2)
        { ajaxContent(data, thisClick); }
    if (filterSelector === '#servicesHome a' || (filterSelector[1] === 'services' && filterSelector.length === 3))
        { ajaxServicesMenuImg(data); }
    if (filterSelector === '#servicesNav li a')
        { ajaxServicesMenu(data); }
    if (filterSelector === '.post .serviceLinks')
        { ajaxBlogPost(data, thisClick); }
    if (filterSelector === '.tags a')
        { ajaxBlogTag(data, thisClick); } 
    if (filterSelector === '#posts')
        { ajaxBlogUpdatePosts(data); }
    if (filterSelector === 'a#MoreReviews')
        { ajaxReviewsUpdate(data); }
}

function ajaxContent(data, thisClick)
{
    var appendData = data.tagList;
    $('#content').empty().append(appendData, data.content);
    // if (data.tagList)
    // {
    //     $(['.tags a[href="',
    //         (!document.location.hash ?
    //             (document.location.pathname.substring(1) + document.location.search.split('&')[0]) :
    //                 document.location.hash.substring(2)), '"]'].join(''))
    //                     .parent().addClass('active-a');
    // }
}

function ajaxServicesMenuImg(data)
{
    $('#content').empty().append(
        data.servicesMenu,
        $('<div>').append(['<h1>', data.pageTitle.split('—')[0], '</h1><hr>', data.content].join(''))
            .prop('id', 'servicesInfo'));
    $('#mainMenu a[href="services"]').parent().addClass('active-a').siblings(".active-a").removeClass("active-a");
    $(['#servicesNav a[href="',
        (!document.location.hash ?
            document.location.pathname.substring(1) :
                document.location.hash.substring(2)), '"]'].join(''))
                    .parent().addClass("active-a");
}

function ajaxServicesMenu(data)
{
    $('#servicesInfo').empty().append(
        ['<h1>', data.pageTitle.split('—')[0], '</h1><hr>', data.content].join(''));
}

function ajaxBlogPost(data, thisClick)
{
    var post = $(thisClick).parents('.post');
    var contentPost = post.children('.contentPost');
    var expand = post.find('.expand a');
    contentPost.append(data.content).slideToggle('fast');
    expand.html('Свернуть пост');
    expand.removeClass('downArrow').addClass('upArrow');
    $(['.post a[href="',
        (!thisClick.hash ? thisClick.pathname.substring(1) :
            thisClick.hash.substring(2)),'"]'].join(''))
                .on('click', function() {
                    contentPost.slideToggle('fast');
                    if (!expand.hasClass('off'))
                    {
                        expand.html('Развернуть пост');
                        expand.removeClass('upArrow').addClass('downArrow');
                    }
                    else
                    {
                        expand.html('Свернуть пост');
                        expand.removeClass('downArrow').addClass('upArrow');
                    }
                    expand.toggleClass('off');
                    return false;
                });
}

function ajaxBlogTag(data, thisClick)
{
    $('#content').empty().append(data.tagList, data.content);
    $(['.tags li:contains(', $(thisClick).text(), ')'].join(''))
        .addClass('active-a').siblings('.active-a').removeClass('active-a');
}

function ajaxBlogUpdatePosts(data)
{
    $('#posts').append(data.content);
    $('#blogUpdateSettings').attr('data-offset', (parseInt($('#blogUpdateSettings').attr('data-offset')) + 3));
    if (!data.content)
    {
        $(window).off('scroll');
        $('#posts').append($('<div id="noBlogPost" class="icon tick">').append('На сегодня все. Ждите обновлений.'));
    }
}

function ajaxReviewsUpdate(data)
{
    $('#comments').append(data.content);
    $('#ReviewsUpdateSettings').attr('data-offset', (parseInt($('#ReviewsUpdateSettings').attr('data-offset')) + 10));
    if (!data.content)
    {
        $('#MoreReviews').hide();
        $('#MoreReviews').after($('<div class="no-reviews" class="icon tick">').append('Пока все. Оставьте свой отзыв.'));
    }
}*/