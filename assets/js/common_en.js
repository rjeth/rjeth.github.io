var wh = $(window).height();
var ww = $(window).width();
var bp = 700;
var list_num = 0;
var list_num_limit;
var set_flg = false;
var load_flg = false;
var resize_flg = false;
var tar_class;
var tar_class_search;
var search_detail_flg = false;
var search_detail_blank_flg = false;

$(function() {
    // setup
    $("#ajax_area").addClass("active");
    if (ww >= bp) {
        $(".js-height").height(wh);
    }

    // load
    $(window).load(function() {
        $("html,body").animate({
            scrollTop: 0
        }, 10);
        setTimeout(function() {
            $("#load").addClass("on");
        }, 500);
        setTimeout(function() {
            $(".js-sc").removeClass("on");
            $("#load").addClass("on2");
            $("body").addClass("loaded");
            header_color();
            setTimeout(function() {
                each_page();
                $("#load").fadeOut(3000, function() {
                    load_flg = true;
                    if ($("#index .js-slide").length) {
                        slider_index.startAuto();
                    }
                });
            }, 800);
        }, 4000);
    });

    // #btn_menu
    $("#btn_menu").click(function() {
        $(this).toggleClass("on");
        $("#block_menu").fadeToggle(800, function() {
            $("#block_menu").toggleClass("on");
        });
        $("body").toggleClass("popup");
    });
    $("#header a, #block_menu a").click(function() {
        $("body").removeClass("popup");
        $("#block_menu").fadeOut(800, function() {
            $("#btn_menu, #block_menu").removeClass("on");
        });
    });

    // #other
    $("#other:not(.gallery) li").click(function() {
        $("#other li").removeClass("on");
        $(this).addClass("on");
    });

    // .js-search
    $(".js-search").click(function() {
        $(this).toggleClass("on");
        $(".search .form").toggleClass("on");
        $("body").toggleClass("searched");
        $(".js-search_block").fadeToggle(500);
        if ($(this).hasClass("on")) {
            $("form .s").focus();
        }
    });

    // .js-search_block
    $(".js-search_block li").click(function() {
        $("body").removeClass("searched");
        $(".js-search_block").fadeOut(500);
        $(".js-search").removeClass("on");
    });

    // pjax
    $(document).on("click", "a.pjax", function(event) {
        event.preventDefault();
        var href = $(this).attr("href");
        set_flg = false;

        $("#ajax_area").removeClass("active");
        if (typeof slider_index != "undefined") {
            slider_index.stopAuto();
        }
        $(".js-search").removeClass("on");
        $(".search .form").removeClass("on");
        $("body").removeClass("searched");
        $(".js-search_block").fadeOut(500);

        setTimeout(function() {
            $.pjax({
                url: href + "?l=en",
                container: "#ajax_area",
                fragment: "#ajax_area"
            });
        }, 1000);
    });
    $.pjax.defaults.timeout = 10000;


    // pjax / end
    $(document).on('pjax:end', function() {
        // GA
        gtag('config', 'UA-129674387-1', {
            'page_path': location.pathname
        });

        // setting
        each_page();
        header_color();
        $(".js-sc").removeClass("on");
        $("#ajax_area").addClass("active");
    });

    // pjax / popstate
    $(document).on("pjax:popstate", function() {
        var href = location.pathname;

        $("#ajax_area").removeClass("active");
        other_menu(href);
    });

});

// resize
var timer = false;
$(window).resize(function() {
    if (timer !== false) {
        clearTimeout(timer);
    }
    resize_flg = true;
    timer = setTimeout(function() {
        ww = $(window).width();
        wh = $(window).height();
        if ($("#video").length) {
            video_resize();
        }
    }, 400);
});

// scroll
var timeoutId;
var start_pos = 0;
$(window).scroll(function(e) {
    var scroll = $(window).scrollTop();
    var current_pos = $(this).scrollTop();
    $(".js-sc").each(function() {
        var elemPos = $(this).offset().top;
        if (scroll > elemPos - wh / 1.1) {
            $(this).addClass("on");
        }
    });

    clearTimeout(timeoutId);
    timeoutId = setTimeout(function() {
        header_color();
    }, 50);

    if (current_pos > start_pos) {
        if (current_pos > 100) {
            $("body").addClass("hide");
        }
    } else {
        $("body").removeClass("hide");
    }
    start_pos = current_pos;

});

// header color check
function header_color() {
    if ($(".js-img_check").length) {
        if (ww > bp) {
            var elm = document.elementFromPoint(290, 59);
        } else {
            var elm = document.elementFromPoint(50, 31);
        }
        var clr = elm.style.backgroundColor;
        if (clr) {
            // has background-color
            $("#wrapper").removeClass("head_black head_white");
        } else {
            // no background-color
            if (elm.hasAttribute('data-color')) {
                ch2 = elm.getAttribute('data-color');
                $("#wrapper").removeClass("head_black head_white").addClass("head_" + ch2);
            } else {
                var ch = elm.children;
                if (ch.length) {
                    for (var i = 0; i < ch.length; i++) {
                        ch2 = ch[i].getAttribute('data-color');
                        if (ch2) {
                            $("#wrapper").removeClass("head_black head_white").addClass("head_" + ch2);
                        }
                    }
                } else {
                    ch2 = elm.getAttribute('data-color');
                    $("#wrapper").removeClass("head_black head_white").addClass("head_" + ch2);
                }
            }
        }
    } else {
        $("#wrapper").removeClass("head_black head_white");
    }
}

// each_page
function each_page() {
    other();
    if ($("#index").length) {
        wh = $(window).height();
        $("#fv").height(wh);
        if ($("#index .js-slide").length) {
            slider_index = $(".js-slide").bxSlider({
                mode: "fade",
                auto: false,
                speed: 2000,
                pager: false,
                controls: false,
                pause: 4000,
                onSlideBefore: function($slideElement) {
                    $(".js-slide li").removeClass("on");
                    setTimeout(function() {
                        $slideElement.addClass("on");
                    }, 1000);
                },
                onSlideAfter: function($slideElement) {
                    header_color();
                }
            });
            if (load_flg == true) {
                slider_index.startAuto();
            }
        }
        if ($("#video").length) {
            var video = document.getElementById('js-video');
            video.play();
            video_resize();
        }
    } else if ($("#works_list").length || $("#gallery_list").length) {
        list_num = 0;
        if (ww > bp) {
            list_num_limit = 8;
        } else {
            list_num_limit = 4;
        }

        if (search_detail_blank_flg == true) {
            search_detail_blank_flg = false;
            $(".js-cate li").removeClass("on");
            $(".list").hide();
            $("#no_hit").fadeIn(1000);
        }

        $img = $('.list li img');
        startOnLoadImage($img).done(function() {
            var $grid = $('.list').isotope({
                layoutMode: 'packery',
                itemSelector: '.list li',
                percentPosition: true,
                isInitLayout: false,
                reize: false,
                transitionDuration: '1.5s',
                hiddenStyle: {
                    opacity: 0,
                    transform: 'scale(0.95)'
                },
                visibleStyle: {
                    opacity: 1,
                    transform: 'scale(1)'
                }
            });

            // complete
            resize_flg = false;
            $grid.on('layoutComplete', function(event, laidOutItems) {
                if (set_flg == false) {
                    set_flg = true;
                    $(".js-sc").removeClass("on");
                    setTimeout(function() {
                        $(".js-sc").addClass("on");
                    }, 10);
                    $(".js-sc").removeClass("on");
                    // hash
                    var hash = location.hash;
                    if (hash.indexOf('#design') != -1 || hash.indexOf('#installation') != -1 || hash.indexOf('#architecture') != -1 || hash.indexOf('#exhibition') != -1) {
                        $(".list").addClass("change");
                        var text = hash.split("#")[1];
                        var text = text.split("?l")[0];
                        $(".js-cate li").removeClass("on");
                        $(".js-cate li." + text).addClass("on");
                        tar_class = "." + text;
                        $grid.isotope({
                            filter: tar_class
                        });
                        $("html,body").animate({
                            scrollTop: 0
                        }, 10);
                    } else {
                        $(".js-cate li").removeClass("on");
                        $(".js-cate li.all").addClass("on");
                    }

                    // lazyload
                    $(".lazy").lazyload({
                        threshold: wh * 5,
                    });
                } else if (resize_flg == false) {
                    $(".js-sc").removeClass("on");
                    list_num = 0;

                    setTimeout(function() {
                        $(".js-sc").addClass("on");
                        $(".list").removeClass("change");
                    }, 400);
                }
            });
            if (search_detail_flg == true) {
                $grid.isotope({
                    filter: tar_class_search
                });
                $("html,body").animate({
                    scrollTop: 0
                }, 10);
                search_detail_flg = false;
            }
            $grid.isotope('layout');

            $(".js-cate li").click(function() {
                $("body").removeClass("searched");
                $(".js-search_block").fadeOut(500);
                $(".js-search").removeClass("on");

                if ($("#works_list").length) {
                    tar_class = $(this).attr("tar");
                    $(".js-cate li").removeClass("on");
                    $(this).addClass("on");
                    $("#no_hit").fadeOut(300);
                    $(".list").css("display", "block");
                    $(".list").addClass("change");
                    setTimeout(function() {
                        $grid.isotope({
                            filter: tar_class
                        });
                        $("html,body").animate({
                            scrollTop: 0
                        }, 10);
                        if (tar_class == "*") {
                            tar_class = "";
                        }
                    }, 400);
                }
                resize_flg = false;
            });

            $('.searchsubmit').click(function() {
                var form = $('#searchform');
                $("#no_hit").fadeOut(300);
                $(".js-search").removeClass("on");
                $("body").removeClass("searched");
                $(".js-search_block").fadeOut(500);
                $("form .s").blur();

                //Ajax送信
                $.ajax({
                    url: form.attr('action'), //送信先のURLをフォームから取得
                    type: form.attr('method'), //送信メソッドをフォームから取得
                    data: form.serialize(), //送信するデータをフォームから取得
                    timeout: 10000, //
                    cache: false,
                    success: function(response, json) { //通信成功時の処理
                        if ($("#works_list").length) {
                            var pjson = $.parseJSON(response);
                            if (pjson.length > 0) {
                                $(".js-cate li").removeClass("on");
                                $(".list").css("display", "block");
                                $(".list").addClass("change");
                                for (var i = 0; i < pjson.length; i++) {
                                    var text = pjson[i];
                                    if (i == 0) {
                                        tar_class_search = ".id" + text;
                                    } else {
                                        tar_class_search = tar_class_search + ",.id" + text;
                                    }
                                };
                                setTimeout(function() {
                                    $grid.isotope({
                                        filter: tar_class_search
                                    });
                                    $("html,body").animate({
                                        scrollTop: 0
                                    }, 10);
                                }, 400);

                            } else {
                                $(".js-cate li").removeClass("on");
                                $(".list").fadeOut(500, function() {
                                    setTimeout(function() {
                                        $("#no_hit").fadeIn(1000);
                                    }, 300);
                                });
                            }
                            resize_flg = false;
                        };
                    },
                    error: function(res) { //通信失敗時の処理
                    },
                    complete: function(res) {}
                });
                return false;
            });

            $(".js-search_block .tag li").click(function() {
                if ($("#works_list").length) {
                    $(".js-cate li").removeClass("on");
                    $(".list").css("display", "block");
                    $(".list").addClass("change");
                    tar_class_search = $(this).attr("tar");
                    setTimeout(function() {
                        $grid.isotope({
                            filter: tar_class_search
                        });
                        $("html,body").animate({
                            scrollTop: 0
                        }, 10);
                    }, 400);
                    resize_flg = false;
                };
            });
        });
    } else if ($("#movie_list").length) {
        $(".js-sc").removeClass("on");
        setTimeout(function() {
            if (ww > bp) {
                $(".js-sc").slice(0, 4).addClass("on");
            } else {
                $(".js-sc").slice(0, 2).addClass("on");
            }
        }, 100);
    } else if ($("#works_detail").length || $("#gallery_detail").length || $("#movie_detail").length) {
        // .js-slide
        if ($(".js-slide").length) {
            slider_detail = $(".js-slide").bxSlider({
                mode: "fade",
                auto: false,
                speed: 1200,
                pager: false,
                controls: true,
                onSliderLoad: function() {
                    setTimeout(function() {
                        $(".btn_prev").attr("data-color", $(".slide li.on .js-img_check").attr("data-color"));
                    }, 10);
                },
                onSlideBefore: function($slideElement) {
                    $(".js-slide li").removeClass("on");
                    setTimeout(function() {
                        $slideElement.addClass("on");
                        if ($slideElement.hasClass("movie")) {
                            $(".btn_prev,.btn_next").hide();
                        } else {
                            $(".btn_prev,.btn_next").show();
                            if ($("#vimeo").length) {
                                player.pause();
                            }
                        }
                        $(".js-num .now").text(zeroPadding(slider_detail.getCurrentSlide() + 1, 2));
                    }, 1000);
                },
                onSlideAfter: function($slideElement) {
                    $(".btn_prev").attr("data-color", $(".slide li.on .js-img_check").attr("data-color"));
                    header_color();
                }
            });
            $(".js-slide li:nth-child(1)").addClass("on");
            if ($(".js-slide li:nth-child(1)").hasClass("movie")) {
                $(".btn_prev,.btn_next").hide();
            }

            $(".btn_prev").click(function() {
                slider_detail.goToPrevSlide();
            });
            $(".btn_next").click(function() {
                slider_detail.goToNextSlide();
            });

            $(".js-num .total").text(zeroPadding(slider_detail.getSlideCount(), 2));
        }

        if (ww <= bp) {
            if (load_flg == false) {
                setTimeout(function() {
                    $(".common_detail .head").addClass("on");
                }, 1000);
            } else {
                setTimeout(function() {
                    $(".common_detail .head").addClass("on");
                }, 100);
            }
        }

        // movie
        if ($("#vimeo").length) {
            var player = new Vimeo.Player($("#vimeo"));
            $(".js-play").click(function() {
                player.play();
                var _this = $(this);
                setTimeout(function() {
                    _this.parent().fadeOut(1000);
                }, 100);
            });
        }

        $('.searchsubmit').click(function() {
            var form = $('#searchform');
            //Ajax送信
            $.ajax({
                url: form.attr('action'), //送信先のURLをフォームから取得
                type: form.attr('method'), //送信メソッドをフォームから取得
                data: form.serialize(), //送信するデータをフォームから取得
                timeout: 10000, //
                cache: false,
                success: function(response, json) { //通信成功時の処理
                    if ($("#works_detail").length) {
                        var pjson = $.parseJSON(response);
                        if (pjson.length > 0) {} else {
                            search_detail_blank_flg = true;
                        }

                        $(".js-cate li").removeClass("on");
                        $(".list").addClass("change");
                        $("#ajax_area").removeClass("active");
                        for (var i = 0; i < pjson.length; i++) {
                            var text = pjson[i];
                            if (i == 0) {
                                tar_class_search = ".id" + text;
                            } else {
                                tar_class_search = tar_class_search + ",.id" + text;
                            }
                        };
                        setTimeout(function() {
                            var href = location.href.split("/works/")[0];
                            $.pjax({
                                url: href + "/works/?l=en",
                                container: "#ajax_area",
                                fragment: "#ajax_area"
                            });
                            search_detail_flg = true;
                        }, 400);
                        resize_flg = false;
                    };
                },
                error: function(res) { //通信失敗時の処理
                },
                complete: function(res) {}
            });
            return false;
        });

        $(".js-search_block .tag li").click(function() {
            if ($("#works_detail").length) {
                $(".js-cate li").removeClass("on");
                $(".list").css("display", "block");
                $(".list").addClass("change");
                $("#ajax_area").removeClass("active");
                tar_class_search = $(this).attr("tar");
                setTimeout(function() {
                    var href = location.href.split("/works/")[0];
                    $.pjax({
                        url: href + "/works/?l=en",
                        container: "#ajax_area",
                        fragment: "#ajax_area"
                    });
                    search_detail_flg = true;
                }, 400);
                resize_flg = false;
            };
        });
    } else if ($("#news").length) {
        if (load_flg == false) {
            setTimeout(function() {
                $("#news .list li:nth-child(1)").addClass("on");
            }, 1000);
        } else {
            setTimeout(function() {
                $("#news .list li:nth-child(1)").addClass("on");
            }, 100);
        }

        // lazyload
        $(".lazy").lazyload({
            threshold: wh * 2,
        });

        // movie
        if ($(".movie").length) {
            $(".movie").each(function(i) {
                var num = i;
                $(this).find("iframe").addClass("h_v" + num);
                $(this).find(".js-play").addClass("v" + num);
                var num = new Vimeo.Player($(".h_v" + num));
                $(".v" + i).click(function() {
                    _this = $(this);
                    num.play();
                    setTimeout(function() {
                        _this.parent(".thum").fadeOut(1000);
                    }, 100);
                });
            });
        }
    } else {
        if (load_flg == false) {
            setTimeout(function() {
                $(".js-load").addClass("on");
            }, 1000);
        } else {
            setTimeout(function() {
                $(".js-load").addClass("on");
            }, 100);
        }
    }
}

var startOnLoadImage = function($target) {
    var d = new $.Deferred();
    var loaded = 0;
    var max = $target.length;
    $target.each(function() {
        var targetObj = new Image();
        $(targetObj).on('load', function() {
            loaded++;
            if (loaded == max) {
                d.resolve();
            }
        });
        targetObj.src = this.src;
    });
    return d.promise();
};

function zeroPadding(NUM, LEN) {
    return (Array(LEN).join('0') + NUM).slice(-LEN);
}

function other() {
    if ($(".common_page").length) {
        $("#other").removeClass("contact works gallery").addClass("active profile");
        $("#other li").removeClass("on");
        if ($("#profile").length) {
            $("#other .c1").addClass("on");
        }
        if ($("#award").length) {
            $("#other .c2").addClass("on");
        }
        if ($("#media").length) {
            $("#other .c3").addClass("on");
        }
    } else if ($("#contact").length || $("#job").length) {
        $("#other").removeClass("profile works gallery").addClass("active contact");
        $("#other li").removeClass("on");
        if ($("#contact").length) {
            $("#other .c4").addClass("on");
        }
        if ($("#job").length) {
            $("#other .c5").addClass("on");
        }
    } else if ($("#gallery_list").length || $("#gallery_detail").length) {
        $("#other").removeClass("profile contact works").addClass("active gallery");
        $("#other li").removeClass("on");
        setTimeout(function() {
            $("#other .c6").addClass("on");
        }, 10);
    } else if ($("#works_list").length || $("#works_detail").length) {
        $("#other").removeClass("profile contact gallery").addClass("active works");
        if ($("#works_list").length) {
            $("#other").addClass("works_list").removeClass("works_detail");
        } else {
            $("#other").addClass("works_detail").removeClass("works_list");
        }
    } else {
        $("#other").removeClass();
    }
}

function other_menu(href) {
    if (href.indexOf("/profile") > -1 || href.indexOf("/profile/award") > -1 || href.indexOf("/profile/media") > -1) {
        $("#other").removeClass("contact gallery works list detail");
    } else if (href.indexOf("/contact") > -1 || href.indexOf("/job") > -1) {
        $("#other").removeClass("profile gallery works list detail");
    } else if (href.indexOf("/gallery") > -1) {
        $("#other").removeClass("contact profile works list detail");
    } else if (href.indexOf("/works") > -1) {
        $("#other").removeClass("contact profile gallery");
    } else {
        $("#other").removeClass();
    }
}

function video_resize() {
    if (ww > bp) {
        if (ww / wh > 1.7) {
            $("#video").addClass("wide");
        } else {
            $("#video").removeClass("wide");
        }
    } else {
        if (ww / wh > 0.57) {
            $("#video").addClass("wide");
        } else {
            $("#video").removeClass("wide");
        }
    }
}